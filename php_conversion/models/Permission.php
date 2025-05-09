
<?php
class Permission {
    private $conn;
    
    public function __construct($db) {
        $this->conn = $db;
    }
    
    public function getAllPermissions() {
        $query = "SELECT * FROM permissions ORDER BY name";
        $result = $this->conn->query($query);
        
        $permissions = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $permissions[] = $row;
            }
        }
        
        return $permissions;
    }
    
    public function getPermissionById($id) {
        $id = intval($id);
        
        $query = "SELECT * FROM permissions WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result && $result->num_rows > 0) {
            return $result->fetch_assoc();
        }
        
        return false;
    }
    
    public function getPermissionByName($name) {
        $query = "SELECT * FROM permissions WHERE name = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("s", $name);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result && $result->num_rows > 0) {
            return $result->fetch_assoc();
        }
        
        return false;
    }
    
    public function createPermission($name, $description) {
        // Check if permission already exists
        if ($this->getPermissionByName($name)) {
            return false;
        }
        
        $query = "INSERT INTO permissions (name, description) VALUES (?, ?)";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("ss", $name, $description);
        
        if ($stmt->execute()) {
            return $this->conn->insert_id;
        }
        
        return false;
    }
    
    public function updatePermission($id, $name, $description) {
        $id = intval($id);
        
        // Check if another permission with the same name exists
        $existing_permission = $this->getPermissionByName($name);
        if ($existing_permission && $existing_permission['id'] != $id) {
            return false;
        }
        
        $query = "UPDATE permissions SET name = ?, description = ? WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("ssi", $name, $description, $id);
        
        return $stmt->execute();
    }
    
    public function deletePermission($id) {
        $id = intval($id);
        
        // Start transaction
        $this->conn->begin_transaction();
        
        try {
            // Delete role-permission associations
            $query = "DELETE FROM role_permissions WHERE permission_id = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param("i", $id);
            $stmt->execute();
            
            // Delete the permission
            $query = "DELETE FROM permissions WHERE id = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param("i", $id);
            $stmt->execute();
            
            // Commit transaction
            $this->conn->commit();
            
            return true;
        } catch (Exception $e) {
            // Rollback on error
            $this->conn->rollback();
            return false;
        }
    }
    
    public function getPermissionRoles($permission_id) {
        $permission_id = intval($permission_id);
        
        $query = "SELECT r.* FROM roles r 
                 JOIN role_permissions rp ON r.id = rp.role_id 
                 WHERE rp.permission_id = ?";
                 
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $permission_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $roles = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $roles[] = $row;
            }
        }
        
        return $roles;
    }
}
?>
