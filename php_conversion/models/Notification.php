
<?php
/**
 * Notification Model
 * 
 * This class handles all operations related to system notifications.
 */
class Notification {
    private $db;
    
    /**
     * Constructor - Initialize database connection
     * 
     * @param object $db Database connection
     */
    public function __construct($db) {
        $this->db = $db;
    }
    
    /**
     * Get all notifications in the system
     * 
     * @return array Array of notifications
     */
    public function getAllNotifications() {
        try {
            $query = "SELECT * FROM notifications ORDER BY created_at DESC";
            $result = $this->db->query($query);
            
            $notifications = [];
            if ($result && $result->num_rows > 0) {
                while ($row = $result->fetch_assoc()) {
                    $notifications[] = $row;
                }
            }
            
            return $notifications;
        } catch (Exception $e) {
            error_log("Error retrieving notifications: " . $e->getMessage());
            return [];
        }
    }
    
    /**
     * Get notifications for a specific user
     * 
     * @param int $user_id User ID
     * @param int $limit Maximum number of notifications to retrieve
     * @param bool $unread_only Only retrieve unread notifications
     * @return array Array of notifications
     */
    public function getNotificationsByUser($user_id, $limit = 20, $unread_only = false) {
        try {
            $user_id = intval($user_id);
            
            $query = "SELECT * FROM notifications WHERE user_id = ?";
            
            if ($unread_only) {
                $query .= " AND is_read = 0";
            }
            
            $query .= " ORDER BY created_at DESC LIMIT ?";
            
            $stmt = $this->db->prepare($query);
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
        } catch (Exception $e) {
            error_log("Error retrieving user notifications: " . $e->getMessage());
            return [];
        }
    }
    
    /**
     * Get a specific notification by ID
     * 
     * @param int $id Notification ID
     * @return array|false Notification data or false if not found
     */
    public function getNotificationById($id) {
        try {
            $id = intval($id);
            
            $query = "SELECT * FROM notifications WHERE id = ?";
            $stmt = $this->db->prepare($query);
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($result && $result->num_rows > 0) {
                return $result->fetch_assoc();
            }
            
            return false;
        } catch (Exception $e) {
            error_log("Error retrieving notification: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Create a new notification
     * 
     * @param int $user_id User ID
     * @param string $title Notification title
     * @param string $message Notification message
     * @param string|null $related_type Related entity type
     * @param int|null $related_id Related entity ID
     * @return int|false ID of new notification or false on failure
     */
    public function createNotification($user_id, $title, $message, $related_type = null, $related_id = null) {
        try {
            $now = date('Y-m-d H:i:s');
            $query = "INSERT INTO notifications (
                user_id, title, message, related_type, related_id, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?)";
            
            $stmt = $this->db->prepare($query);
            $stmt->bind_param(
                "isssiss", 
                $user_id, 
                $title, 
                $message, 
                $related_type, 
                $related_id,
                $now,
                $now
            );
            
            if ($stmt->execute()) {
                return $this->db->insert_id;
            }
            
            return false;
        } catch (Exception $e) {
            error_log("Error creating notification: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Mark a notification as read
     * 
     * @param int $id Notification ID
     * @return bool Success or failure
     */
    public function markAsRead($id) {
        try {
            $id = intval($id);
            $now = date('Y-m-d H:i:s');
            
            $query = "UPDATE notifications SET is_read = 1, updated_at = ? WHERE id = ?";
            $stmt = $this->db->prepare($query);
            $stmt->bind_param("si", $now, $id);
            
            return $stmt->execute();
        } catch (Exception $e) {
            error_log("Error marking notification as read: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Mark all notifications for a user as read
     * 
     * @param int $user_id User ID
     * @return bool Success or failure
     */
    public function markAllAsRead($user_id) {
        try {
            $user_id = intval($user_id);
            $now = date('Y-m-d H:i:s');
            
            $query = "UPDATE notifications SET is_read = 1, updated_at = ? WHERE user_id = ? AND is_read = 0";
            $stmt = $this->db->prepare($query);
            $stmt->bind_param("si", $now, $user_id);
            
            return $stmt->execute();
        } catch (Exception $e) {
            error_log("Error marking all notifications as read: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Delete a notification
     * 
     * @param int $id Notification ID
     * @return bool Success or failure
     */
    public function deleteNotification($id) {
        try {
            $id = intval($id);
            
            $query = "DELETE FROM notifications WHERE id = ?";
            $stmt = $this->db->prepare($query);
            $stmt->bind_param("i", $id);
            
            return $stmt->execute();
        } catch (Exception $e) {
            error_log("Error deleting notification: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Delete all notifications for a user
     * 
     * @param int $user_id User ID
     * @return bool Success or failure
     */
    public function deleteAllNotifications($user_id) {
        try {
            $user_id = intval($user_id);
            
            $query = "DELETE FROM notifications WHERE user_id = ?";
            $stmt = $this->db->prepare($query);
            $stmt->bind_param("i", $user_id);
            
            return $stmt->execute();
        } catch (Exception $e) {
            error_log("Error deleting all notifications: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Get count of unread notifications for a user
     * 
     * @param int $user_id User ID
     * @return int Count of unread notifications
     */
    public function getUnreadCount($user_id) {
        try {
            $user_id = intval($user_id);
            
            $query = "SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0";
            $stmt = $this->db->prepare($query);
            $stmt->bind_param("i", $user_id);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($result && $result->num_rows > 0) {
                $row = $result->fetch_assoc();
                return intval($row['count']);
            }
            
            return 0;
        } catch (Exception $e) {
            error_log("Error getting unread notification count: " . $e->getMessage());
            return 0;
        }
    }
    
    /**
     * Create a system notification for multiple users
     * 
     * @param array $user_ids Array of user IDs
     * @param string $title Notification title
     * @param string $message Notification message
     * @param string|null $related_type Related entity type
     * @param int|null $related_id Related entity ID
     * @return bool Success or failure
     */
    public function createBulkNotifications($user_ids, $title, $message, $related_type = null, $related_id = null) {
        try {
            if (empty($user_ids)) {
                return false;
            }
            
            $success = true;
            foreach ($user_ids as $user_id) {
                $result = $this->createNotification($user_id, $title, $message, $related_type, $related_id);
                if (!$result) {
                    $success = false;
                }
            }
            
            return $success;
        } catch (Exception $e) {
            error_log("Error creating bulk notifications: " . $e->getMessage());
            return false;
        }
    }
}
?>
