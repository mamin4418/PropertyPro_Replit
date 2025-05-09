
<?php
class Communication {
    private $conn;
    
    public function __construct($db) {
        $this->conn = $db;
    }
    
    public function getAllCommunications($limit = 100, $offset = 0) {
        $query = "SELECT c.*, u.username as sender_name 
                 FROM communications c 
                 LEFT JOIN users u ON c.sender_id = u.id 
                 ORDER BY c.sent_date DESC 
                 LIMIT ? OFFSET ?";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("ii", $limit, $offset);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $communications = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $communications[] = $row;
            }
        }
        
        return $communications;
    }
    
    public function getCommunicationById($id) {
        $id = intval($id);
        
        $query = "SELECT c.*, u.username as sender_name 
                 FROM communications c 
                 LEFT JOIN users u ON c.sender_id = u.id 
                 WHERE c.id = ?";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result && $result->num_rows > 0) {
            return $result->fetch_assoc();
        }
        
        return false;
    }
    
    public function getCommunicationsByRecipient($recipient_type, $recipient_id, $limit = 100, $offset = 0) {
        $recipient_id = intval($recipient_id);
        
        $query = "SELECT c.*, u.username as sender_name 
                 FROM communications c 
                 LEFT JOIN users u ON c.sender_id = u.id 
                 WHERE c.recipient_type = ? AND c.recipient_id = ? 
                 ORDER BY c.sent_date DESC 
                 LIMIT ? OFFSET ?";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("siii", $recipient_type, $recipient_id, $limit, $offset);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $communications = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $communications[] = $row;
            }
        }
        
        return $communications;
    }
    
    public function createCommunication($sender_id, $recipient_type, $recipient_id, $subject, $message, $communication_type, $attachment_path = null, $status = 'sent') {
        $query = "INSERT INTO communications (
            sender_id, recipient_type, recipient_id, subject, 
            message, communication_type, status, attachment_path
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param(
            "isisssss",
            $sender_id,
            $recipient_type,
            $recipient_id,
            $subject,
            $message,
            $communication_type,
            $status,
            $attachment_path
        );
        
        if ($stmt->execute()) {
            return $this->conn->insert_id;
        }
        
        return false;
    }
    
    public function updateCommunicationStatus($id, $status) {
        $id = intval($id);
        
        $query = "UPDATE communications SET status = ? WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("si", $status, $id);
        
        return $stmt->execute();
    }
    
    public function deleteCommunication($id) {
        $id = intval($id);
        
        $query = "DELETE FROM communications WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $id);
        
        return $stmt->execute();
    }
    
    public function getCommunicationStats() {
        $query = "SELECT 
                  communication_type, 
                  COUNT(*) as total_count,
                  SUM(CASE WHEN status = 'sent' THEN 1 ELSE 0 END) as sent_count,
                  SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) as delivered_count,
                  SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed_count
                 FROM communications 
                 GROUP BY communication_type";
        
        $result = $this->conn->query($query);
        
        $stats = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $stats[$row['communication_type']] = [
                    'total' => $row['total_count'],
                    'sent' => $row['sent_count'],
                    'delivered' => $row['delivered_count'],
                    'failed' => $row['failed_count']
                ];
            }
        }
        
        return $stats;
    }
    
    public function getRecentCommunications($limit = 5) {
        $query = "SELECT c.*, u.username as sender_name, 
                 CASE 
                    WHEN c.recipient_type = 'tenant' THEN (SELECT CONCAT(first_name, ' ', last_name) FROM tenants WHERE id = c.recipient_id)
                    WHEN c.recipient_type = 'vendor' THEN (SELECT name FROM vendors WHERE id = c.recipient_id)
                    WHEN c.recipient_type = 'owner' THEN 'Owner'
                    ELSE 'Other'
                 END as recipient_name
                 FROM communications c 
                 LEFT JOIN users u ON c.sender_id = u.id 
                 ORDER BY c.sent_date DESC 
                 LIMIT ?";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $limit);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $communications = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $communications[] = $row;
            }
        }
        
        return $communications;
    }
}
?>
