
<?php
class ExpenseCategory {
    private $conn;
    
    public function __construct($db) {
        $this->conn = $db;
    }
    
    public function getAllCategories() {
        $query = "SELECT * FROM expense_categories ORDER BY name";
        $result = $this->conn->query($query);
        
        $categories = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $categories[] = $row;
            }
        }
        
        return $categories;
    }
    
    public function getActiveCategories() {
        $query = "SELECT * FROM expense_categories WHERE active = 1 ORDER BY name";
        $result = $this->conn->query($query);
        
        $categories = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $categories[] = $row;
            }
        }
        
        return $categories;
    }
    
    public function getCategoryById($id) {
        $id = intval($id);
        $query = "SELECT * FROM expense_categories WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result && $result->num_rows > 0) {
            return $result->fetch_assoc();
        }
        
        return false;
    }
    
    public function createCategory($name, $description) {
        $query = "INSERT INTO expense_categories (name, description) VALUES (?, ?)";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("ss", $name, $description);
        
        if ($stmt->execute()) {
            return $this->conn->insert_id;
        }
        
        return false;
    }
    
    public function updateCategory($id, $name, $description, $active) {
        $id = intval($id);
        $active = intval($active);
        
        $query = "UPDATE expense_categories SET name = ?, description = ?, active = ? WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("ssii", $name, $description, $active, $id);
        
        if ($stmt->execute()) {
            return true;
        }
        
        return false;
    }
    
    public function deleteCategory($id) {
        $id = intval($id);
        
        // Check if category is in use
        $query = "SELECT COUNT(*) as count FROM expenses WHERE category_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        
        if ($row['count'] > 0) {
            // Category is in use, just deactivate it
            $query = "UPDATE expense_categories SET active = 0 WHERE id = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param("i", $id);
            return $stmt->execute();
        } else {
            // Category not in use, can delete
            $query = "DELETE FROM expense_categories WHERE id = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param("i", $id);
            return $stmt->execute();
        }
    }
    
    public function getCategoryStats() {
        $query = "SELECT ec.id, ec.name, COUNT(e.id) as expense_count, SUM(e.amount) as total_amount 
                 FROM expense_categories ec
                 LEFT JOIN expenses e ON ec.id = e.category_id
                 GROUP BY ec.id
                 ORDER BY total_amount DESC";
        
        $result = $this->conn->query($query);
        
        $stats = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $stats[] = $row;
            }
        }
        
        return $stats;
    }
}
?>
