
<?php
class Expense {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function getAllExpenses() {
        $query = "SELECT e.*, p.name as property_name, v.name as vendor_name 
                  FROM expenses e 
                  LEFT JOIN properties p ON e.property_id = p.id 
                  LEFT JOIN vendors v ON e.vendor_id = v.id 
                  ORDER BY e.date DESC";
        $result = $this->db->query($query);
        
        $expenses = [];
        while ($row = $result->fetch_assoc()) {
            $expenses[] = $row;
        }
        
        return $expenses;
    }

    public function getExpensesByProperty($property_id) {
        $query = "SELECT e.*, p.name as property_name, v.name as vendor_name 
                  FROM expenses e 
                  LEFT JOIN properties p ON e.property_id = p.id 
                  LEFT JOIN vendors v ON e.vendor_id = v.id 
                  WHERE e.property_id = ? 
                  ORDER BY e.date DESC";
        
        $stmt = $this->db->prepare($query);
        $stmt->bind_param("i", $property_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $expenses = [];
        while ($row = $result->fetch_assoc()) {
            $expenses[] = $row;
        }
        
        return $expenses;
    }

    public function getExpenseById($id) {
        $query = "SELECT e.*, p.name as property_name, v.name as vendor_name 
                  FROM expenses e 
                  LEFT JOIN properties p ON e.property_id = p.id 
                  LEFT JOIN vendors v ON e.vendor_id = v.id 
                  WHERE e.id = ?";
        
        $stmt = $this->db->prepare($query);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        return $result->fetch_assoc();
    }

    public function addExpense($data) {
        $query = "INSERT INTO expenses (property_id, vendor_id, category, amount, date, description, payment_method, receipt_url) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $this->db->prepare($query);
        $stmt->bind_param("iisdsss", 
            $data['property_id'], 
            $data['vendor_id'], 
            $data['category'], 
            $data['amount'], 
            $data['date'], 
            $data['description'], 
            $data['payment_method'], 
            $data['receipt_url']
        );
        
        if ($stmt->execute()) {
            return $this->db->insert_id;
        } else {
            return false;
        }
    }

    public function updateExpense($id, $data) {
        $query = "UPDATE expenses 
                  SET property_id = ?, vendor_id = ?, category = ?, amount = ?, 
                      date = ?, description = ?, payment_method = ?, receipt_url = ? 
                  WHERE id = ?";
        
        $stmt = $this->db->prepare($query);
        $stmt->bind_param("iisdsssi", 
            $data['property_id'], 
            $data['vendor_id'], 
            $data['category'], 
            $data['amount'], 
            $data['date'], 
            $data['description'], 
            $data['payment_method'], 
            $data['receipt_url'],
            $id
        );
        
        return $stmt->execute();
    }

    public function deleteExpense($id) {
        $query = "DELETE FROM expenses WHERE id = ?";
        $stmt = $this->db->prepare($query);
        $stmt->bind_param("i", $id);
        return $stmt->execute();
    }

    public function getExpensesByCategory() {
        $query = "SELECT category, SUM(amount) as total_amount 
                  FROM expenses 
                  GROUP BY category 
                  ORDER BY total_amount DESC";
        
        $result = $this->db->query($query);
        
        $expenses = [];
        while ($row = $result->fetch_assoc()) {
            $expenses[] = $row;
        }
        
        return $expenses;
    }

    public function getExpensesByMonth($year) {
        $query = "SELECT MONTH(date) as month, SUM(amount) as total_amount 
                  FROM expenses 
                  WHERE YEAR(date) = ? 
                  GROUP BY MONTH(date) 
                  ORDER BY month";
        
        $stmt = $this->db->prepare($query);
        $stmt->bind_param("i", $year);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $expenses = [];
        while ($row = $result->fetch_assoc()) {
            $expenses[] = $row;
        }
        
        return $expenses;
    }
}
?>
