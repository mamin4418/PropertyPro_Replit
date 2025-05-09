
<?php
class Role {
    private $conn;
    
    public function __construct($db) {
        $this->conn = $db;
    }
    
    public function getAllRoles() {
        $query = "SELECT * FROM roles ORDER BY name";
        $result = $this->conn->query($query);
        
        $roles = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $roles[] = $row;
            }
        }
        
        return $roles;
    }
    
    public function getRoleById($id) {
        $id = intval($id);
        
        $query = "SELECT * FROM roles WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result && $result->num_rows > 0) {
            return $result->fetch_assoc();
        }
        
        return false;
    }
    
    public function getRoleByName($name) {
        $query = "SELECT * FROM roles WHERE name = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("s", $name);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result && $result->num_rows > 0) {
            return $result->fetch_assoc();
        }
        
        return false;
    }
    
    public function createRole($name, $description) {
        // Check if role already exists
        if ($this->getRoleByName($name)) {
            return false;
        }
        
        $query = "INSERT INTO roles (name, description) VALUES (?, ?)";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("ss", $name, $description);
        
        if ($stmt->execute()) {
            return $this->conn->insert_id;
        }
        
        return false;
    }
    
    public function updateRole($id, $name, $description) {
        $id = intval($id);
        
        // Check if another role with the same name exists
        $existing_role = $this->getRoleByName($name);
        if ($existing_role && $existing_role['id'] != $id) {
            return false;
        }
        
        $query = "UPDATE roles SET name = ?, description = ? WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("ssi", $name, $description, $id);
        
        return $stmt->execute();
    }
    
    public function deleteRole($id) {
        $id = intval($id);
        
        // Start transaction
        $this->conn->begin_transaction();
        
        try {
            // Delete role-permission associations
            $query = "DELETE FROM role_permissions WHERE role_id = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param("i", $id);
            $stmt->execute();
            
            // Delete user-role associations
            $query = "DELETE FROM user_roles WHERE role_id = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param("i", $id);
            $stmt->execute();
            
            // Delete the role
            $query = "DELETE FROM roles WHERE id = ?";
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
    
    public function getRolePermissions($role_id) {
        $role_id = intval($role_id);
        
        $query = "SELECT p.* FROM permissions p 
                 JOIN role_permissions rp ON p.id = rp.permission_id 
                 WHERE rp.role_id = ?";
                 
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $role_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $permissions = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $permissions[] = $row;
            }
        }
        
        return $permissions;
    }
    
    public function assignPermissionToRole($role_id, $permission_id) {
        $role_id = intval($role_id);
        $permission_id = intval($permission_id);
        
        $query = "INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE role_id = role_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("ii", $role_id, $permission_id);
        
        return $stmt->execute();
    }
    
    public function removePermissionFromRole($role_id, $permission_id) {
        $role_id = intval($role_id);
        $permission_id = intval($permission_id);
        
        $query = "DELETE FROM role_permissions WHERE role_id = ? AND permission_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("ii", $role_id, $permission_id);
        
        return $stmt->execute();
    }
    
    public function getRoleUsers($role_id) {
        $role_id = intval($role_id);
        
        $query = "SELECT u.id, u.username, u.email, u.first_name, u.last_name, u.status 
                 FROM users u 
                 JOIN user_roles ur ON u.id = ur.user_id 
                 WHERE ur.role_id = ?";
                 
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $role_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $users = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $users[] = $row;
            }
        }
        
        return $users;
    }
}
?>
