
<?php
require_once __DIR__ . '/../config/database.php';

class Vendor {
    private $conn;
    private $table = 'vendors';
    
    // Vendor properties
    public $id;
    public $name;
    public $contact_name;
    public $email;
    public $phone;
    public $service_type;
    public $address;
    public $city;
    public $state;
    public $zip;
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
    
    // Create vendor
    public function create() {
        $query = "INSERT INTO {$this->table} (name, contact_name, email, phone, service_type, address, city, state, zip, notes) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param('ssssssssss', 
            $this->name, 
            $this->contact_name,
            $this->email, 
            $this->phone, 
            $this->service_type,
            $this->address, 
            $this->city, 
            $this->state, 
            $this->zip, 
            $this->notes
        );
        
        if ($stmt->execute()) {
            $this->id = $this->conn->insert_id;
            return true;
        }
        
        printf("Error: %s.\n", $stmt->error);
        return false;
    }
    
    // Read all vendors
    public function read() {
        $query = "SELECT * FROM {$this->table} ORDER BY name";
        $result = $this->conn->query($query);
        return $result;
    }
    
    // Read single vendor
    public function read_single() {
        $query = "SELECT * FROM {$this->table} WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param('i', $this->id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows == 1) {
            $row = $result->fetch_assoc();
            
            $this->name = $row['name'];
            $this->contact_name = $row['contact_name'];
            $this->email = $row['email'];
            $this->phone = $row['phone'];
            $this->service_type = $row['service_type'];
            $this->address = $row['address'];
            $this->city = $row['city'];
            $this->state = $row['state'];
            $this->zip = $row['zip'];
            $this->notes = $row['notes'];
            $this->created_at = $row['created_at'];
            $this->updated_at = $row['updated_at'];
            
            return true;
        }
        
        return false;
    }
    
    // Update vendor
    public function update() {
        $query = "UPDATE {$this->table} 
                 SET name = ?, contact_name = ?, email = ?, phone = ?, service_type = ?, 
                     address = ?, city = ?, state = ?, zip = ?, notes = ? 
                 WHERE id = ?";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param('ssssssssssi', 
            $this->name, 
            $this->contact_name,
            $this->email, 
            $this->phone, 
            $this->service_type,
            $this->address, 
            $this->city, 
            $this->state, 
            $this->zip, 
            $this->notes,
            $this->id
        );
        
        if ($stmt->execute()) {
            return true;
        }
        
        printf("Error: %s.\n", $stmt->error);
        return false;
    }
    
    // Delete vendor
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
    
    // Get vendors by service type
    public function readByServiceType($service_type) {
        $query = "SELECT * FROM {$this->table} WHERE service_type = ? ORDER BY name";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param('s', $service_type);
        $stmt->execute();
        return $stmt->get_result();
    }

    // Close database connection
    public function __destruct() {
        $this->conn->close();
    }
}
?>
