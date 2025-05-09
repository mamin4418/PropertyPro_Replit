
<?php
class Transaction {
    private $conn;
    
    public function __construct($db) {
        $this->conn = $db;
    }
    
    public function getAllTransactions($limit = 100, $offset = 0) {
        $query = "SELECT t.*, ba.account_name 
                 FROM transactions t 
                 JOIN bank_accounts ba ON t.bank_account_id = ba.id 
                 ORDER BY t.transaction_date DESC 
                 LIMIT ? OFFSET ?";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("ii", $limit, $offset);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $transactions = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $transactions[] = $row;
            }
        }
        
        return $transactions;
    }
    
    public function getTransactionsByAccount($account_id, $limit = 100, $offset = 0) {
        $account_id = intval($account_id);
        
        $query = "SELECT t.*, ba.account_name 
                 FROM transactions t 
                 JOIN bank_accounts ba ON t.bank_account_id = ba.id 
                 WHERE t.bank_account_id = ? 
                 ORDER BY t.transaction_date DESC 
                 LIMIT ? OFFSET ?";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("iii", $account_id, $limit, $offset);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $transactions = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $transactions[] = $row;
            }
        }
        
        return $transactions;
    }
    
    public function getTransactionById($id) {
        $id = intval($id);
        
        $query = "SELECT t.*, ba.account_name 
                 FROM transactions t 
                 JOIN bank_accounts ba ON t.bank_account_id = ba.id 
                 WHERE t.id = ?";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result && $result->num_rows > 0) {
            return $result->fetch_assoc();
        }
        
        return false;
    }
    
    public function createTransaction($bank_account_id, $transaction_date, $amount, $description, $type, $category, $reference_number, $related_id = null, $related_type = null) {
        $bank_account_id = intval($bank_account_id);
        
        // Start transaction
        $this->conn->begin_transaction();
        
        try {
            // Insert the transaction
            $query = "INSERT INTO transactions (bank_account_id, transaction_date, amount, description, type, category, reference_number, related_id, related_type) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param("isdssssis", $bank_account_id, $transaction_date, $amount, $description, $type, $category, $reference_number, $related_id, $related_type);
            $stmt->execute();
            
            $transaction_id = $this->conn->insert_id;
            
            // Update bank account balance
            $bankAccountModel = new BankAccount($this->conn);
            
            // Adjust balance based on transaction type
            $adjustment_amount = $amount;
            if ($type == 'withdrawal' || $type == 'expense') {
                $adjustment_amount = -$amount;
            }
            
            if (!$bankAccountModel->adjustBalance($bank_account_id, $adjustment_amount)) {
                throw new Exception("Failed to update bank account balance");
            }
            
            // Commit transaction
            $this->conn->commit();
            
            return $transaction_id;
        } catch (Exception $e) {
            // Rollback on error
            $this->conn->rollback();
            return false;
        }
    }
    
    public function updateTransaction($id, $bank_account_id, $transaction_date, $amount, $description, $type, $category, $reference_number, $related_id = null, $related_type = null, $reconciled = 0) {
        $id = intval($id);
        $bank_account_id = intval($bank_account_id);
        $reconciled = intval($reconciled);
        
        // Get the old transaction to calculate balance adjustment
        $oldTransaction = $this->getTransactionById($id);
        if (!$oldTransaction) {
            return false;
        }
        
        // Start transaction
        $this->conn->begin_transaction();
        
        try {
            // Calculate old effect on balance
            $old_adjustment = $oldTransaction['amount'];
            if ($oldTransaction['type'] == 'withdrawal' || $oldTransaction['type'] == 'expense') {
                $old_adjustment = -$old_adjustment;
            }
            
            // Calculate new effect on balance
            $new_adjustment = $amount;
            if ($type == 'withdrawal' || $type == 'expense') {
                $new_adjustment = -$new_adjustment;
            }
            
            // Calculate net effect
            $net_adjustment = $new_adjustment - $old_adjustment;
            
            // Update the transaction
            $query = "UPDATE transactions SET bank_account_id = ?, transaction_date = ?, amount = ?, description = ?, type = ?, category = ?, reference_number = ?, related_id = ?, related_type = ?, reconciled = ? WHERE id = ?";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param("isdssssisii", $bank_account_id, $transaction_date, $amount, $description, $type, $category, $reference_number, $related_id, $related_type, $reconciled, $id);
            $stmt->execute();
            
            // Update bank account balance if account hasn't changed
            if ($bank_account_id == $oldTransaction['bank_account_id']) {
                $bankAccountModel = new BankAccount($this->conn);
                
                if (!$bankAccountModel->adjustBalance($bank_account_id, $net_adjustment)) {
                    throw new Exception("Failed to update bank account balance");
                }
            } else {
                // Account has changed - reverse old transaction from old account
                $bankAccountModel = new BankAccount($this->conn);
                
                if (!$bankAccountModel->adjustBalance($oldTransaction['bank_account_id'], -$old_adjustment)) {
                    throw new Exception("Failed to update old bank account balance");
                }
                
                // Add new transaction amount to new account
                if (!$bankAccountModel->adjustBalance($bank_account_id, $new_adjustment)) {
                    throw new Exception("Failed to update new bank account balance");
                }
            }
            
            // Commit transaction
            $this->conn->commit();
            
            return true;
        } catch (Exception $e) {
            // Rollback on error
            $this->conn->rollback();
            return false;
        }
    }
    
    public function deleteTransaction($id) {
        $id = intval($id);
        
        // Get the transaction before deleting
        $transaction = $this->getTransactionById($id);
        if (!$transaction) {
            return false;
        }
        
        // Start transaction
        $this->conn->begin_transaction();
        
        try {
            // Delete the transaction
            $query = "DELETE FROM transactions WHERE id = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param("i", $id);
            $stmt->execute();
            
            // Adjust bank account balance
            $bankAccountModel = new BankAccount($this->conn);
            
            $adjustment = -$transaction['amount'];
            if ($transaction['type'] == 'withdrawal' || $transaction['type'] == 'expense') {
                $adjustment = $transaction['amount'];
            }
            
            if (!$bankAccountModel->adjustBalance($transaction['bank_account_id'], $adjustment)) {
                throw new Exception("Failed to update bank account balance");
            }
            
            // Commit transaction
            $this->conn->commit();
            
            return true;
        } catch (Exception $e) {
            // Rollback on error
            $this->conn->rollback();
            return false;
        }
    }
    
    public function markReconciled($id, $status = 1) {
        $id = intval($id);
        $status = intval($status);
        
        $query = "UPDATE transactions SET reconciled = ? WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("ii", $status, $id);
        
        return $stmt->execute();
    }
    
    public function getTransactionCountByType() {
        $query = "SELECT type, COUNT(*) as count FROM transactions GROUP BY type";
        $result = $this->conn->query($query);
        
        $counts = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $counts[$row['type']] = $row['count'];
            }
        }
        
        return $counts;
    }
    
    public function getTransactionSumByType($start_date = null, $end_date = null) {
        $query = "SELECT type, SUM(amount) as total FROM transactions";
        
        $params = [];
        $types = "";
        
        if ($start_date || $end_date) {
            $query .= " WHERE ";
            
            if ($start_date) {
                $query .= "transaction_date >= ?";
                $params[] = $start_date;
                $types .= "s";
                
                if ($end_date) {
                    $query .= " AND ";
                }
            }
            
            if ($end_date) {
                $query .= "transaction_date <= ?";
                $params[] = $end_date;
                $types .= "s";
            }
        }
        
        $query .= " GROUP BY type";
        
        $stmt = $this->conn->prepare($query);
        
        if (!empty($params)) {
            $stmt->bind_param($types, ...$params);
        }
        
        $stmt->execute();
        $result = $stmt->get_result();
        
        $sums = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $sums[$row['type']] = $row['total'];
            }
        }
        
        return $sums;
    }
    
    public function searchTransactions($search, $limit = 100) {
        $search = "%" . $search . "%";
        
        $query = "SELECT t.*, ba.account_name 
                 FROM transactions t 
                 JOIN bank_accounts ba ON t.bank_account_id = ba.id 
                 WHERE t.description LIKE ? OR t.reference_number LIKE ? OR t.category LIKE ? 
                 ORDER BY t.transaction_date DESC 
                 LIMIT ?";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("sssi", $search, $search, $search, $limit);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $transactions = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $transactions[] = $row;
            }
        }
        
        return $transactions;
    }
}
?>
