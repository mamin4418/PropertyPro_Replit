
<?php
require_once __DIR__ . '/../config/database.php';

class Company {
    private $conn;
    private $table = 'companies';
    
    // Company properties
    public $id;
    public $name;
    public $address;
    public $city;
    public $state;
    public $zip;
    public $phone;
    public $email;
    public $website;
    public $notes;
    public $created_at;
    public $updated_at;
    
    // Constructor with DB connection
    public function __construct() {
        $this->conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
        if ($this->conn->connect_error) {
            die('Connection failed: ' . $this->conn->connect_error);
        }
    }
    
    // Create company
    public function create() {
        $query = "INSERT INTO {$this->table} (name, address, city, state, zip, phone, email, website, notes) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param('sssssssss', 
            $this->name, 
            $this->address, 
            $this->city, 
            $this->state, 
            $this->zip, 
            $this->phone, 
            $this->email, 
            $this->website, 
            $this->notes
        );
        
        if ($stmt->execute()) {
            $this->id = $this->conn->insert_id;
            return true;
        }
        
        printf("Error: %s.\n", $stmt->error);
        return false;
    }
    
    // Read all companies
    public function read() {
        $query = "SELECT * FROM {$this->table} ORDER BY name";
        $result = $this->conn->query($query);
        return $result;
    }
    
    // Read single company
    public function read_single() {
        $query = "SELECT * FROM {$this->table} WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param('i', $this->id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows == 1) {
            $row = $result->fetch_assoc();
            
            $this->name = $row['name'];
            $this->address = $row['address'];
            $this->city = $row['city'];
            $this->state = $row['state'];
            $this->zip = $row['zip'];
            $this->phone = $row['phone'];
            $this->email = $row['email'];
            $this->website = $row['website'];
            $this->notes = $row['notes'];
            $this->created_at = $row['created_at'];
            $this->updated_at = $row['updated_at'];
            
            return true;
        }
        
        return false;
    }
    
    // Update company
    public function update() {
        $query = "UPDATE {$this->table} 
                 SET name = ?, address = ?, city = ?, state = ?, zip = ?, 
                     phone = ?, email = ?, website = ?, notes = ? 
                 WHERE id = ?";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param('sssssssssi', 
            $this->name, 
            $this->address, 
            $this->city, 
            $this->state, 
            $this->zip, 
            $this->phone, 
            $this->email, 
            $this->website, 
            $this->notes, 
            $this->id
        );
        
        if ($stmt->execute()) {
            return true;
        }
        
        printf("Error: %s.\n", $stmt->error);
        return false;
    }
    
    // Delete company
    public function delete() {
        $query = "DELETE FROM {$this->table} WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param('i', $this->id);
        
        if ($stmt->execute()) {
            return true;
        }
        
        printf("Error: %s.\n", $stmt->error);
        return false;
    }

    // Close database connection
    public function __destruct() {
        $this->conn->close();
    }
}
?>
