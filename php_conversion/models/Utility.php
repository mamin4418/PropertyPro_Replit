
<?php
class Utility {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getAllUtilityAccounts() {
        $query = "SELECT u.*, p.name as property_name 
                  FROM utility_accounts u 
                  JOIN properties p ON u.property_id = p.id 
                  ORDER BY u.provider_name";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->get_result();
    }
    
    public function getUtilityById($id) {
        $query = "SELECT u.*, p.name as property_name 
                  FROM utility_accounts u 
                  JOIN properties p ON u.property_id = p.id 
                  WHERE u.id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }
    
    public function getUtilitiesByProperty($property_id) {
        $query = "SELECT * FROM utility_accounts WHERE property_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $property_id);
        $stmt->execute();
        return $stmt->get_result();
    }
    
    public function createUtilityAccount($property_id, $unit_id, $provider_name, $utility_type, $account_number, $billing_day, $auto_pay, $avg_cost) {
        $query = "INSERT INTO utility_accounts (property_id, unit_id, provider_name, utility_type, account_number, billing_day, auto_pay, avg_cost) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("iisssidi", $property_id, $unit_id, $provider_name, $utility_type, $account_number, $billing_day, $auto_pay, $avg_cost);
        
        if ($stmt->execute()) {
            return $this->conn->insert_id;
        }
        
        return false;
    }
    
    public function updateUtilityAccount($id, $property_id, $unit_id, $provider_name, $utility_type, $account_number, $billing_day, $auto_pay, $avg_cost) {
        $query = "UPDATE utility_accounts 
                  SET property_id = ?, unit_id = ?, provider_name = ?, utility_type = ?, account_number = ?, billing_day = ?, auto_pay = ?, avg_cost = ? 
                  WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("iisssidii", $property_id, $unit_id, $provider_name, $utility_type, $account_number, $billing_day, $auto_pay, $avg_cost, $id);
        
        return $stmt->execute();
    }
    
    public function deleteUtilityAccount($id) {
        $query = "DELETE FROM utility_accounts WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $id);
        
        return $stmt->execute();
    }
    
    public function getAllUtilityBills() {
        $query = "SELECT b.*, u.provider_name, u.utility_type, p.name as property_name 
                  FROM utility_bills b 
                  JOIN utility_accounts u ON b.utility_account_id = u.id 
                  JOIN properties p ON u.property_id = p.id 
                  ORDER BY b.due_date DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->get_result();
    }
    
    public function getBillsByAccountId($account_id) {
        $query = "SELECT * FROM utility_bills WHERE utility_account_id = ? ORDER BY due_date DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $account_id);
        $stmt->execute();
        return $stmt->get_result();
    }
    
    public function addUtilityBill($utility_account_id, $amount, $issue_date, $due_date, $status) {
        $query = "INSERT INTO utility_bills (utility_account_id, amount, issue_date, due_date, status) 
                  VALUES (?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("idsss", $utility_account_id, $amount, $issue_date, $due_date, $status);
        
        if ($stmt->execute()) {
            return $this->conn->insert_id;
        }
        
        return false;
    }
    
    public function updateUtilityBillStatus($bill_id, $status) {
        $query = "UPDATE utility_bills SET status = ? WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("si", $status, $bill_id);
        
        return $stmt->execute();
    }
    
    public function deleteBill($id) {
        $query = "DELETE FROM utility_bills WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $id);
        
        return $stmt->execute();
    }
}
?>
