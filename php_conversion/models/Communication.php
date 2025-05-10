
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
<?php
class Communication {
    private $db;
    
    public function __construct($db) {
        $this->db = $db;
    }
    
    public function createCommunication($data) {
        try {
            $stmt = $this->db->prepare("
                INSERT INTO communications (
                    type, recipient_type, recipient_id, recipient_name, 
                    recipient_contact, subject, content, status,
                    sent_at, created_at, updated_at
                ) VALUES (
                    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
                )
            ");
            
            $stmt->bind_param(
                "ssisssssss",
                $data['type'],
                $data['recipient_type'],
                $data['recipient_id'],
                $data['recipient_name'],
                $data['recipient_contact'],
                $data['subject'],
                $data['content'],
                $data['status'],
                $data['sent_at'],
                $data['created_at'],
                $data['updated_at']
            );
            
            $stmt->execute();
            
            if ($stmt->affected_rows > 0) {
                return $this->db->insert_id;
            }
            
            return false;
        } catch (Exception $e) {
            error_log("Error creating communication: " . $e->getMessage());
            return false;
        }
    }
    
    public function getCommunications($type = null, $status = null, $tenant_id = null, $property_id = null, $start_date = null, $end_date = null) {
        try {
            $where_clauses = [];
            $params = [];
            $types = "";
            
            if ($type) {
                $where_clauses[] = "type = ?";
                $params[] = $type;
                $types .= "s";
            }
            
            if ($status) {
                $where_clauses[] = "status = ?";
                $params[] = $status;
                $types .= "s";
            }
            
            if ($tenant_id) {
                $where_clauses[] = "recipient_id = ? AND recipient_type = 'tenant'";
                $params[] = $tenant_id;
                $types .= "i";
            }
            
            // For property_id, we need to join with tenants and units
            if ($property_id) {
                $where_clauses[] = "recipient_type = 'tenant' AND recipient_id IN (
                    SELECT t.id FROM tenants t
                    JOIN units u ON t.unit_id = u.id
                    WHERE u.property_id = ?
                )";
                $params[] = $property_id;
                $types .= "i";
            }
            
            if ($start_date) {
                $where_clauses[] = "sent_at >= ?";
                $params[] = $start_date . " 00:00:00";
                $types .= "s";
            }
            
            if ($end_date) {
                $where_clauses[] = "sent_at <= ?";
                $params[] = $end_date . " 23:59:59";
                $types .= "s";
            }
            
            $where_sql = count($where_clauses) > 0 ? "WHERE " . implode(" AND ", $where_clauses) : "";
            
            $sql = "SELECT * FROM communications $where_sql ORDER BY sent_at DESC";
            
            $stmt = $this->db->prepare($sql);
            
            if (count($params) > 0) {
                $stmt->bind_param($types, ...$params);
            }
            
            $stmt->execute();
            $result = $stmt->get_result();
            
            $communications = [];
            while ($row = $result->fetch_assoc()) {
                $communications[] = $row;
            }
            
            return $communications;
        } catch (Exception $e) {
            error_log("Error retrieving communications: " . $e->getMessage());
            return false;
        }
    }
    
    public function getCommunicationById($id) {
        try {
            $stmt = $this->db->prepare("SELECT * FROM communications WHERE id = ?");
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($result->num_rows === 1) {
                return $result->fetch_assoc();
            }
            
            return false;
        } catch (Exception $e) {
            error_log("Error retrieving communication: " . $e->getMessage());
            return false;
        }
    }
    
    public function updateCommunicationStatus($id, $status) {
        try {
            $now = date('Y-m-d H:i:s');
            
            $stmt = $this->db->prepare("UPDATE communications SET status = ?, updated_at = ? WHERE id = ?");
            $stmt->bind_param("ssi", $status, $now, $id);
            $stmt->execute();
            
            return $stmt->affected_rows > 0;
        } catch (Exception $e) {
            error_log("Error updating communication status: " . $e->getMessage());
            return false;
        }
    }
    
    public function getCommunicationStats() {
        try {
            $stats = [
                'total' => 0,
                'email' => 0,
                'sms' => 0,
                'letter' => 0,
                'sent' => 0,
                'delivered' => 0,
                'failed' => 0
            ];
            
            // Get total count
            $stmt = $this->db->prepare("SELECT COUNT(*) as count FROM communications");
            $stmt->execute();
            $result = $stmt->get_result();
            $row = $result->fetch_assoc();
            $stats['total'] = $row['count'];
            
            // Get counts by type
            $stmt = $this->db->prepare("SELECT type, COUNT(*) as count FROM communications GROUP BY type");
            $stmt->execute();
            $result = $stmt->get_result();
            
            while ($row = $result->fetch_assoc()) {
                $stats[$row['type']] = $row['count'];
            }
            
            // Get counts by status
            $stmt = $this->db->prepare("SELECT status, COUNT(*) as count FROM communications GROUP BY status");
            $stmt->execute();
            $result = $stmt->get_result();
            
            while ($row = $result->fetch_assoc()) {
                $stats[$row['status']] = $row['count'];
            }
            
            return $stats;
        } catch (Exception $e) {
            error_log("Error retrieving communication stats: " . $e->getMessage());
            return [
                'total' => 0,
                'email' => 0,
                'sms' => 0,
                'letter' => 0,
                'sent' => 0,
                'delivered' => 0,
                'failed' => 0
            ];
        }
    }
    
    public function getTenantCommunications($tenant_id) {
        try {
            $stmt = $this->db->prepare("
                SELECT * FROM communications 
                WHERE recipient_type = 'tenant' AND recipient_id = ?
                ORDER BY sent_at DESC
            ");
            
            $stmt->bind_param("i", $tenant_id);
            $stmt->execute();
            $result = $stmt->get_result();
            
            $communications = [];
            while ($row = $result->fetch_assoc()) {
                $communications[] = $row;
            }
            
            return $communications;
        } catch (Exception $e) {
            error_log("Error retrieving tenant communications: " . $e->getMessage());
            return false;
        }
    }
    
    public function getPropertyCommunications($property_id) {
        try {
            $stmt = $this->db->prepare("
                SELECT c.* FROM communications c
                JOIN tenants t ON c.recipient_id = t.id AND c.recipient_type = 'tenant'
                JOIN units u ON t.unit_id = u.id
                WHERE u.property_id = ?
                ORDER BY c.sent_at DESC
            ");
            
            $stmt->bind_param("i", $property_id);
            $stmt->execute();
            $result = $stmt->get_result();
            
            $communications = [];
            while ($row = $result->fetch_assoc()) {
                $communications[] = $row;
            }
            
            return $communications;
        } catch (Exception $e) {
            error_log("Error retrieving property communications: " . $e->getMessage());
            return false;
        }
    }
}
