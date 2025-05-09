
<?php
class BankAccount {
    private $conn;
    
    public function __construct($db) {
        $this->conn = $db;
    }
    
    public function getAllAccounts() {
        $query = "SELECT * FROM bank_accounts ORDER BY account_name";
        $result = $this->conn->query($query);
        
        $accounts = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $accounts[] = $row;
            }
        }
        
        return $accounts;
    }
    
    public function getActiveAccounts() {
        $query = "SELECT * FROM bank_accounts WHERE active = 1 ORDER BY account_name";
        $result = $this->conn->query($query);
        
        $accounts = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $accounts[] = $row;
            }
        }
        
        return $accounts;
    }
    
    public function getAccountById($id) {
        $id = intval($id);
        $query = "SELECT * FROM bank_accounts WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result && $result->num_rows > 0) {
            return $result->fetch_assoc();
        }
        
        return false;
    }
    
    public function createAccount($account_name, $account_number, $routing_number, $bank_name, $account_type, $opening_balance, $notes) {
        $query = "INSERT INTO bank_accounts (account_name, account_number, routing_number, bank_name, account_type, opening_balance, current_balance, notes) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        
        $current_balance = $opening_balance; // Initially set to opening balance
        
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("sssssids", $account_name, $account_number, $routing_number, $bank_name, $account_type, $opening_balance, $current_balance, $notes);
        
        if ($stmt->execute()) {
            return $this->conn->insert_id;
        }
        
        return false;
    }
    
    public function updateAccount($id, $account_name, $account_number, $routing_number, $bank_name, $account_type, $notes, $active) {
        $id = intval($id);
        $active = intval($active);
        
        $query = "UPDATE bank_accounts SET account_name = ?, account_number = ?, routing_number = ?, bank_name = ?, account_type = ?, notes = ?, active = ? WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("ssssssii", $account_name, $account_number, $routing_number, $bank_name, $account_type, $notes, $active, $id);
        
        if ($stmt->execute()) {
            return true;
        }
        
        return false;
    }
    
    public function updateBalance($id, $new_balance) {
        $id = intval($id);
        $new_balance = floatval($new_balance);
        
        $query = "UPDATE bank_accounts SET current_balance = ? WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("di", $new_balance, $id);
        
        if ($stmt->execute()) {
            return true;
        }
        
        return false;
    }
    
    public function adjustBalance($id, $amount) {
        $id = intval($id);
        $amount = floatval($amount);
        
        $account = $this->getAccountById($id);
        if (!$account) {
            return false;
        }
        
        $new_balance = $account['current_balance'] + $amount;
        
        return $this->updateBalance($id, $new_balance);
    }
    
    public function deleteAccount($id) {
        $id = intval($id);
        
        // Check if account has transactions
        $query = "SELECT COUNT(*) as count FROM transactions WHERE bank_account_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        
        if ($row['count'] > 0) {
            // Account has transactions, just deactivate it
            $query = "UPDATE bank_accounts SET active = 0 WHERE id = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param("i", $id);
            return $stmt->execute();
        } else {
            // Account has no transactions, can delete
            $query = "DELETE FROM bank_accounts WHERE id = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param("i", $id);
            return $stmt->execute();
        }
    }
    
    public function getTotalBalance() {
        $query = "SELECT SUM(current_balance) as total FROM bank_accounts WHERE active = 1";
        $result = $this->conn->query($query);
        
        if ($result && $result->num_rows > 0) {
            $row = $result->fetch_assoc();
            return $row['total'] ? $row['total'] : 0;
        }
        
        return 0;
    }
}
?>
