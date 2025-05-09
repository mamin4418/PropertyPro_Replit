
<?php
class Notification {
    private $conn;
    
    public function __construct($db) {
        $this->conn = $db;
    }
    
    public function getAllNotifications() {
        $query = "SELECT * FROM notifications ORDER BY created_at DESC";
        $result = $this->conn->query($query);
        
        $notifications = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $notifications[] = $row;
            }
        }
        
        return $notifications;
    }
    
    public function getNotificationsByUser($user_id, $limit = 20, $unread_only = false) {
        $user_id = intval($user_id);
        
        $query = "SELECT * FROM notifications WHERE user_id = ?";
        
        if ($unread_only) {
            $query .= " AND is_read = 0";
        }
        
        $query .= " ORDER BY created_at DESC LIMIT ?";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("ii", $user_id, $limit);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $notifications = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $notifications[] = $row;
            }
        }
        
        return $notifications;
    }
    
    public function getNotificationById($id) {
        $id = intval($id);
        
        $query = "SELECT * FROM notifications WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result && $result->num_rows > 0) {
            return $result->fetch_assoc();
        }
        
        return false;
    }
    
    public function createNotification($user_id, $title, $message, $related_type = null, $related_id = null) {
        $query = "INSERT INTO notifications (user_id, title, message, related_type, related_id) 
                 VALUES (?, ?, ?, ?, ?)";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("isssi", $user_id, $title, $message, $related_type, $related_id);
        
        if ($stmt->execute()) {
            return $this->conn->insert_id;
        }
        
        return false;
    }
    
    public function markAsRead($id) {
        $id = intval($id);
        
        $query = "UPDATE notifications SET is_read = 1 WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $id);
        
        return $stmt->execute();
    }
    
    public function markAllAsRead($user_id) {
        $user_id = intval($user_id);
        
        $query = "UPDATE notifications SET is_read = 1 WHERE user_id = ? AND is_read = 0";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $user_id);
        
        return $stmt->execute();
    }
    
    public function deleteNotification($id) {
        $id = intval($id);
        
        $query = "DELETE FROM notifications WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $id);
        
        return $stmt->execute();
    }
    
    public function deleteAllNotifications($user_id) {
        $user_id = intval($user_id);
        
        $query = "DELETE FROM notifications WHERE user_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $user_id);
        
        return $stmt->execute();
    }
    
    public function getUnreadCount($user_id) {
        $user_id = intval($user_id);
        
        $query = "SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result && $result->num_rows > 0) {
            $row = $result->fetch_assoc();
            return $row['count'];
        }
        
        return 0;
    }
}
?>
