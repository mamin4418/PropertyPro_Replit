
<?php
class User {
    private $conn;
    
    public function __construct($db) {
        $this->conn = $db;
    }
    
    public function getAllUsers() {
        $query = "SELECT id, username, email, first_name, last_name, role, status, last_login, created_at FROM users ORDER BY username";
        $result = $this->conn->query($query);
        
        $users = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $users[] = $row;
            }
        }
        
        return $users;
    }
    
    public function getUserById($id) {
        $id = intval($id);
        
        $query = "SELECT id, username, email, first_name, last_name, role, status, last_login, created_at FROM users WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result && $result->num_rows > 0) {
            return $result->fetch_assoc();
        }
        
        return false;
    }
    
    public function getUserByUsername($username) {
        $query = "SELECT * FROM users WHERE username = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result && $result->num_rows > 0) {
            return $result->fetch_assoc();
        }
        
        return false;
    }
    
    public function getUserByEmail($email) {
        $query = "SELECT * FROM users WHERE email = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result && $result->num_rows > 0) {
            return $result->fetch_assoc();
        }
        
        return false;
    }
    
    public function createUser($username, $password, $email, $first_name, $last_name, $role = 'user', $status = 'active') {
        // Check if username or email already exists
        if ($this->getUserByUsername($username) || $this->getUserByEmail($email)) {
            return false;
        }
        
        // Hash the password
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        
        $query = "INSERT INTO users (username, password, email, first_name, last_name, role, status) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)";
                 
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("sssssss", $username, $hashed_password, $email, $first_name, $last_name, $role, $status);
        
        if ($stmt->execute()) {
            return $this->conn->insert_id;
        }
        
        return false;
    }
    
    public function updateUser($id, $email, $first_name, $last_name, $role, $status) {
        $id = intval($id);
        
        $query = "UPDATE users SET email = ?, first_name = ?, last_name = ?, role = ?, status = ? WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("sssssi", $email, $first_name, $last_name, $role, $status, $id);
        
        return $stmt->execute();
    }
    
    public function changePassword($id, $new_password) {
        $id = intval($id);
        
        // Hash the new password
        $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);
        
        $query = "UPDATE users SET password = ? WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("si", $hashed_password, $id);
        
        return $stmt->execute();
    }
    
    public function deleteUser($id) {
        $id = intval($id);
        
        $query = "DELETE FROM users WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $id);
        
        return $stmt->execute();
    }
    
    public function login($username, $password) {
        $user = $this->getUserByUsername($username);
        
        if (!$user) {
            return false;
        }
        
        if (password_verify($password, $user['password'])) {
            // Update last login time
            $query = "UPDATE users SET last_login = NOW() WHERE id = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param("i", $user['id']);
            $stmt->execute();
            
            return $user;
        }
        
        return false;
    }
    
    public function getUserRoles($user_id) {
        $user_id = intval($user_id);
        
        $query = "SELECT r.* FROM roles r 
                 JOIN user_roles ur ON r.id = ur.role_id 
                 WHERE ur.user_id = ?";
                 
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $user_id);
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
    
    public function assignRoleToUser($user_id, $role_id) {
        $user_id = intval($user_id);
        $role_id = intval($role_id);
        
        $query = "INSERT INTO user_roles (user_id, role_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE user_id = user_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("ii", $user_id, $role_id);
        
        return $stmt->execute();
    }
    
    public function removeRoleFromUser($user_id, $role_id) {
        $user_id = intval($user_id);
        $role_id = intval($role_id);
        
        $query = "DELETE FROM user_roles WHERE user_id = ? AND role_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("ii", $user_id, $role_id);
        
        return $stmt->execute();
    }
    
    public function hasPermission($user_id, $permission_name) {
        $user_id = intval($user_id);
        
        $query = "SELECT COUNT(*) as count FROM permissions p 
                 JOIN role_permissions rp ON p.id = rp.permission_id 
                 JOIN user_roles ur ON rp.role_id = ur.role_id 
                 WHERE ur.user_id = ? AND p.name = ?";
                 
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("is", $user_id, $permission_name);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result && $result->num_rows > 0) {
            $row = $result->fetch_assoc();
            return $row['count'] > 0;
        }
        
        return false;
    }
}
?>
