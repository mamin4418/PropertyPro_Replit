
<?php
/**
 * Maintenance Model
 * Handles database operations related to maintenance requests
 */
class Maintenance {
    private $mysqli;
    
    /**
     * Constructor
     * 
     * @param mysqli $mysqli Database connection
     */
    public function __construct($mysqli) {
        $this->mysqli = $mysqli;
    }
    
    /**
     * Get all maintenance requests
     * 
     * @return array Array of maintenance requests
     */
    public function getAllRequests() {
        $requests = [];
        
        $query = "SELECT m.*, p.name as property_name, 
                 t.first_name as tenant_first_name, t.last_name as tenant_last_name, 
                 u.unit_number 
                 FROM maintenance_requests m
                 LEFT JOIN properties p ON m.property_id = p.id
                 LEFT JOIN tenants t ON m.tenant_id = t.id  
                 LEFT JOIN units u ON m.unit_id = u.id
                 ORDER BY 
                   CASE 
                     WHEN m.priority = 'urgent' THEN 1
                     WHEN m.priority = 'high' THEN 2
                     WHEN m.priority = 'medium' THEN 3
                     WHEN m.priority = 'low' THEN 4
                     ELSE 5
                   END,
                   m.created_at DESC";
                   
        $result = $this->mysqli->query($query);
        
        if ($result) {
            while ($row = $result->fetch_assoc()) {
                $requests[] = $row;
            }
            $result->free();
        }
        
        return $requests;
    }
    
    /**
     * Get maintenance request by ID
     * 
     * @param int $id Maintenance request ID
     * @return array|null Maintenance request details or null if not found
     */
    public function getRequestById($id) {
        $id = (int)$id;
        
        $query = "SELECT m.*, p.name as property_name, 
                 t.first_name as tenant_first_name, t.last_name as tenant_last_name, 
                 t.email as tenant_email, t.phone as tenant_phone, 
                 u.unit_number 
                 FROM maintenance_requests m
                 LEFT JOIN properties p ON m.property_id = p.id
                 LEFT JOIN tenants t ON m.tenant_id = t.id  
                 LEFT JOIN units u ON m.unit_id = u.id
                 WHERE m.id = ?";
                 
        $stmt = $this->mysqli->prepare($query);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        
        $result = $stmt->get_result();
        $request = $result->fetch_assoc();
        
        $stmt->close();
        
        return $request;
    }
    
    /**
     * Get maintenance requests by property ID
     * 
     * @param int $propertyId Property ID
     * @return array Array of maintenance requests
     */
    public function getRequestsByProperty($propertyId) {
        $propertyId = (int)$propertyId;
        $requests = [];
        
        $query = "SELECT m.*, 
                 t.first_name as tenant_first_name, t.last_name as tenant_last_name, 
                 u.unit_number 
                 FROM maintenance_requests m
                 LEFT JOIN tenants t ON m.tenant_id = t.id  
                 LEFT JOIN units u ON m.unit_id = u.id
                 WHERE m.property_id = ?
                 ORDER BY 
                   CASE 
                     WHEN m.priority = 'urgent' THEN 1
                     WHEN m.priority = 'high' THEN 2
                     WHEN m.priority = 'medium' THEN 3
                     WHEN m.priority = 'low' THEN 4
                     ELSE 5
                   END,
                   m.created_at DESC";
                   
        $stmt = $this->mysqli->prepare($query);
        $stmt->bind_param("i", $propertyId);
        $stmt->execute();
        
        $result = $stmt->get_result();
        
        while ($row = $result->fetch_assoc()) {
            $requests[] = $row;
        }
        
        $stmt->close();
        
        return $requests;
    }
    
    /**
     * Get maintenance requests by tenant ID
     * 
     * @param int $tenantId Tenant ID
     * @return array Array of maintenance requests
     */
    public function getRequestsByTenant($tenantId) {
        $tenantId = (int)$tenantId;
        $requests = [];
        
        $query = "SELECT m.*, p.name as property_name, u.unit_number 
                 FROM maintenance_requests m
                 LEFT JOIN properties p ON m.property_id = p.id
                 LEFT JOIN units u ON m.unit_id = u.id
                 WHERE m.tenant_id = ?
                 ORDER BY m.created_at DESC";
                 
        $stmt = $this->mysqli->prepare($query);
        $stmt->bind_param("i", $tenantId);
        $stmt->execute();
        
        $result = $stmt->get_result();
        
        while ($row = $result->fetch_assoc()) {
            $requests[] = $row;
        }
        
        $stmt->close();
        
        return $requests;
    }
    
    /**
     * Create a new maintenance request
     * 
     * @param array $requestData Maintenance request data
     * @return int|bool New request ID or false on failure
     */
    public function createRequest($requestData) {
        $query = "INSERT INTO maintenance_requests (
                   property_id, unit_id, tenant_id, category, 
                   title, description, priority, status,
                   assigned_to, created_at
                 ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";
                 
        $stmt = $this->mysqli->prepare($query);
        
        $stmt->bind_param(
            "iiisssssi",
            $requestData['property_id'],
            $requestData['unit_id'],
            $requestData['tenant_id'],
            $requestData['category'],
            $requestData['title'],
            $requestData['description'],
            $requestData['priority'],
            $requestData['status'],
            $requestData['assigned_to']
        );
        
        if ($stmt->execute()) {
            $newId = $this->mysqli->insert_id;
            $stmt->close();
            return $newId;
        } else {
            $stmt->close();
            return false;
        }
    }
    
    /**
     * Update an existing maintenance request
     * 
     * @param int $id Maintenance request ID
     * @param array $requestData Maintenance request data
     * @return bool True on success, false on failure
     */
    public function updateRequest($id, $requestData) {
        $query = "UPDATE maintenance_requests SET 
                   property_id = ?, unit_id = ?, tenant_id = ?, 
                   category = ?, title = ?, description = ?, 
                   priority = ?, status = ?, assigned_to = ?,
                   updated_at = NOW()
                 WHERE id = ?";
                 
        $stmt = $this->mysqli->prepare($query);
        
        $stmt->bind_param(
            "iiisssssii",
            $requestData['property_id'],
            $requestData['unit_id'],
            $requestData['tenant_id'],
            $requestData['category'],
            $requestData['title'],
            $requestData['description'],
            $requestData['priority'],
            $requestData['status'],
            $requestData['assigned_to'],
            $id
        );
        
        $result = $stmt->execute();
        $stmt->close();
        
        return $result;
    }
    
    /**
     * Update maintenance request status
     * 
     * @param int $id Maintenance request ID
     * @param string $status New status
     * @param string $comments Status update comments
     * @return bool True on success, false on failure
     */
    public function updateStatus($id, $status, $comments = '') {
        // First update the main record
        $query = "UPDATE maintenance_requests SET 
                   status = ?, 
                   updated_at = NOW() 
                 WHERE id = ?";
                 
        $stmt = $this->mysqli->prepare($query);
        $stmt->bind_param("si", $status, $id);
        $result = $stmt->execute();
        $stmt->close();
        
        if (!$result) {
            return false;
        }
        
        // Then add a status update entry
        if (!empty($comments)) {
            $query = "INSERT INTO maintenance_status_updates (
                       request_id, status, comments, created_at
                     ) VALUES (?, ?, ?, NOW())";
                     
            $stmt = $this->mysqli->prepare($query);
            $stmt->bind_param("iss", $id, $status, $comments);
            $result = $stmt->execute();
            $stmt->close();
        }
        
        return $result;
    }
    
    /**
     * Delete a maintenance request
     * 
     * @param int $id Maintenance request ID
     * @return bool True on success, false on failure
     */
    public function deleteRequest($id) {
        $id = (int)$id;
        
        // First delete any status updates for this request
        $query = "DELETE FROM maintenance_status_updates WHERE request_id = ?";
        $stmt = $this->mysqli->prepare($query);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $stmt->close();
        
        // Then delete the main record
        $query = "DELETE FROM maintenance_requests WHERE id = ?";
        $stmt = $this->mysqli->prepare($query);
        $stmt->bind_param("i", $id);
        
        $result = $stmt->execute();
        $stmt->close();
        
        return $result;
    }
    
    /**
     * Add a status update to a maintenance request
     * 
     * @param int $requestId Maintenance request ID
     * @param string $status New status
     * @param string $comments Status update comments
     * @return int|bool New status update ID or false on failure
     */
    public function addStatusUpdate($requestId, $status, $comments) {
        $query = "INSERT INTO maintenance_status_updates (
                   request_id, status, comments, created_at
                 ) VALUES (?, ?, ?, NOW())";
                 
        $stmt = $this->mysqli->prepare($query);
        $stmt->bind_param("iss", $requestId, $status, $comments);
        
        if ($stmt->execute()) {
            $newId = $this->mysqli->insert_id;
            $stmt->close();
            
            // Also update the main request status
            $this->updateStatus($requestId, $status);
            
            return $newId;
        } else {
            $stmt->close();
            return false;
        }
    }
    
    /**
     * Get status history for a maintenance request
     * 
     * @param int $requestId Maintenance request ID
     * @return array Array of status updates
     */
    public function getStatusHistory($requestId) {
        $requestId = (int)$requestId;
        $updates = [];
        
        $query = "SELECT * FROM maintenance_status_updates 
                 WHERE request_id = ? 
                 ORDER BY created_at DESC";
                 
        $stmt = $this->mysqli->prepare($query);
        $stmt->bind_param("i", $requestId);
        $stmt->execute();
        
        $result = $stmt->get_result();
        
        while ($row = $result->fetch_assoc()) {
            $updates[] = $row;
        }
        
        $stmt->close();
        
        return $updates;
    }
    
    /**
     * Get counts of maintenance requests by status
     * 
     * @return array Array of counts by status
     */
    public function getRequestCountsByStatus() {
        $counts = [
            'open' => 0,
            'in-progress' => 0,
            'completed' => 0,
            'cancelled' => 0,
            'total' => 0
        ];
        
        $query = "SELECT status, COUNT(*) as count 
                 FROM maintenance_requests 
                 GROUP BY status";
                 
        $result = $this->mysqli->query($query);
        
        if ($result) {
            while ($row = $result->fetch_assoc()) {
                if (isset($counts[$row['status']])) {
                    $counts[$row['status']] = (int)$row['count'];
                }
                $counts['total'] += (int)$row['count'];
            }
            $result->free();
        }
        
        return $counts;
    }
}
