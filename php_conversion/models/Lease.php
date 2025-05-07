
<?php
/**
 * Lease Model
 * Handles database operations related to leases
 */
class Lease {
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
     * Get all leases
     * 
     * @return array Array of leases
     */
    public function getAllLeases() {
        $leases = [];
        
        $query = "SELECT l.*, p.name as property_name, 
                 t.first_name, t.last_name, u.unit_number 
                 FROM leases l
                 LEFT JOIN properties p ON l.property_id = p.id
                 LEFT JOIN tenants t ON l.tenant_id = t.id  
                 LEFT JOIN units u ON l.unit_id = u.id
                 ORDER BY l.created_at DESC";
                 
        $result = $this->mysqli->query($query);
        
        if ($result) {
            while ($row = $result->fetch_assoc()) {
                $leases[] = $row;
            }
            $result->free();
        }
        
        return $leases;
    }
    
    /**
     * Get lease by ID
     * 
     * @param int $id Lease ID
     * @return array|null Lease details or null if not found
     */
    public function getLeaseById($id) {
        $id = (int)$id;
        
        $query = "SELECT l.*, p.name as property_name, 
                 t.first_name, t.last_name, t.email as tenant_email, 
                 t.phone as tenant_phone, u.unit_number 
                 FROM leases l
                 LEFT JOIN properties p ON l.property_id = p.id
                 LEFT JOIN tenants t ON l.tenant_id = t.id  
                 LEFT JOIN units u ON l.unit_id = u.id
                 WHERE l.id = ?";
                 
        $stmt = $this->mysqli->prepare($query);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        
        $result = $stmt->get_result();
        $lease = $result->fetch_assoc();
        
        $stmt->close();
        
        return $lease;
    }
    
    /**
     * Get leases by tenant ID
     * 
     * @param int $tenantId Tenant ID
     * @return array Array of leases for the tenant
     */
    public function getLeasesByTenant($tenantId) {
        $tenantId = (int)$tenantId;
        $leases = [];
        
        $query = "SELECT l.*, p.name as property_name, u.unit_number 
                 FROM leases l
                 LEFT JOIN properties p ON l.property_id = p.id
                 LEFT JOIN units u ON l.unit_id = u.id
                 WHERE l.tenant_id = ?
                 ORDER BY l.start_date DESC";
                 
        $stmt = $this->mysqli->prepare($query);
        $stmt->bind_param("i", $tenantId);
        $stmt->execute();
        
        $result = $stmt->get_result();
        
        while ($row = $result->fetch_assoc()) {
            $leases[] = $row;
        }
        
        $stmt->close();
        
        return $leases;
    }
    
    /**
     * Get leases by property ID
     * 
     * @param int $propertyId Property ID
     * @return array Array of leases for the property
     */
    public function getLeasesByProperty($propertyId) {
        $propertyId = (int)$propertyId;
        $leases = [];
        
        $query = "SELECT l.*, t.first_name, t.last_name, u.unit_number 
                 FROM leases l
                 LEFT JOIN tenants t ON l.tenant_id = t.id
                 LEFT JOIN units u ON l.unit_id = u.id
                 WHERE l.property_id = ?
                 ORDER BY l.start_date DESC";
                 
        $stmt = $this->mysqli->prepare($query);
        $stmt->bind_param("i", $propertyId);
        $stmt->execute();
        
        $result = $stmt->get_result();
        
        while ($row = $result->fetch_assoc()) {
            $leases[] = $row;
        }
        
        $stmt->close();
        
        return $leases;
    }
    
    /**
     * Create a new lease
     * 
     * @param array $leaseData Lease data
     * @return int|bool New lease ID or false on failure
     */
    public function createLease($leaseData) {
        $query = "INSERT INTO leases (
                   tenant_id, property_id, unit_id, lease_type, 
                   start_date, end_date, rent_amount, security_deposit,
                   payment_frequency, payment_day, late_fee, grace_period,
                   status, notes, created_at
                 ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";
                 
        $stmt = $this->mysqli->prepare($query);
        
        $stmt->bind_param(
            "iiissddsiidsss",
            $leaseData['tenant_id'],
            $leaseData['property_id'],
            $leaseData['unit_id'],
            $leaseData['lease_type'],
            $leaseData['start_date'],
            $leaseData['end_date'],
            $leaseData['rent_amount'],
            $leaseData['security_deposit'],
            $leaseData['payment_frequency'],
            $leaseData['payment_day'],
            $leaseData['late_fee'],
            $leaseData['grace_period'],
            $leaseData['status'],
            $leaseData['notes']
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
     * Update an existing lease
     * 
     * @param int $id Lease ID
     * @param array $leaseData Lease data
     * @return bool True on success, false on failure
     */
    public function updateLease($id, $leaseData) {
        $query = "UPDATE leases SET 
                   tenant_id = ?, property_id = ?, unit_id = ?, 
                   lease_type = ?, start_date = ?, end_date = ?, 
                   rent_amount = ?, security_deposit = ?,
                   payment_frequency = ?, payment_day = ?, 
                   late_fee = ?, grace_period = ?,
                   status = ?, notes = ?, updated_at = NOW()
                 WHERE id = ?";
                 
        $stmt = $this->mysqli->prepare($query);
        
        $stmt->bind_param(
            "iiissddsiidssi",
            $leaseData['tenant_id'],
            $leaseData['property_id'],
            $leaseData['unit_id'],
            $leaseData['lease_type'],
            $leaseData['start_date'],
            $leaseData['end_date'],
            $leaseData['rent_amount'],
            $leaseData['security_deposit'],
            $leaseData['payment_frequency'],
            $leaseData['payment_day'],
            $leaseData['late_fee'],
            $leaseData['grace_period'],
            $leaseData['status'],
            $leaseData['notes'],
            $id
        );
        
        $result = $stmt->execute();
        $stmt->close();
        
        return $result;
    }
    
    /**
     * Delete a lease
     * 
     * @param int $id Lease ID
     * @return bool True on success, false on failure
     */
    public function deleteLease($id) {
        $id = (int)$id;
        
        $query = "DELETE FROM leases WHERE id = ?";
        $stmt = $this->mysqli->prepare($query);
        $stmt->bind_param("i", $id);
        
        $result = $stmt->execute();
        $stmt->close();
        
        return $result;
    }
    
    /**
     * Check if a unit is already leased for a given date range
     * 
     * @param int $unitId Unit ID
     * @param string $startDate Start date (YYYY-MM-DD)
     * @param string $endDate End date (YYYY-MM-DD)
     * @param int $excludeLeaseId Lease ID to exclude from check
     * @return bool True if unit is available, false if already leased
     */
    public function isUnitAvailable($unitId, $startDate, $endDate, $excludeLeaseId = 0) {
        $query = "SELECT COUNT(*) AS lease_count 
                 FROM leases 
                 WHERE unit_id = ? 
                 AND status = 'active'
                 AND id != ?
                 AND (
                     (? BETWEEN start_date AND end_date) OR
                     (? BETWEEN start_date AND end_date) OR
                     (start_date BETWEEN ? AND ?) OR
                     (end_date BETWEEN ? AND ?)
                 )";
                 
        $stmt = $this->mysqli->prepare($query);
        $stmt->bind_param("iissssss", $unitId, $excludeLeaseId, $startDate, $endDate, $startDate, $endDate, $startDate, $endDate);
        $stmt->execute();
        
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        
        $stmt->close();
        
        return ($row['lease_count'] == 0);
    }
    
    /**
     * Get upcoming lease renewals
     * 
     * @param int $daysThreshold Number of days to look ahead
     * @return array Array of leases needing renewal
     */
    public function getUpcomingRenewals($daysThreshold = 30) {
        $renewals = [];
        
        $query = "SELECT l.*, p.name as property_name, 
                 t.first_name, t.last_name, u.unit_number 
                 FROM leases l
                 LEFT JOIN properties p ON l.property_id = p.id
                 LEFT JOIN tenants t ON l.tenant_id = t.id  
                 LEFT JOIN units u ON l.unit_id = u.id
                 WHERE l.status = 'active' 
                 AND l.end_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL ? DAY)
                 ORDER BY l.end_date ASC";
                 
        $stmt = $this->mysqli->prepare($query);
        $stmt->bind_param("i", $daysThreshold);
        $stmt->execute();
        
        $result = $stmt->get_result();
        
        while ($row = $result->fetch_assoc()) {
            $renewals[] = $row;
        }
        
        $stmt->close();
        
        return $renewals;
    }
    
    /**
     * Get expired leases
     * 
     * @return array Array of expired leases
     */
    public function getExpiredLeases() {
        $expired = [];
        
        $query = "SELECT l.*, p.name as property_name, 
                 t.first_name, t.last_name, u.unit_number 
                 FROM leases l
                 LEFT JOIN properties p ON l.property_id = p.id
                 LEFT JOIN tenants t ON l.tenant_id = t.id  
                 LEFT JOIN units u ON l.unit_id = u.id
                 WHERE l.status = 'active' 
                 AND l.end_date < CURDATE()
                 ORDER BY l.end_date ASC";
                 
        $result = $this->mysqli->query($query);
        
        if ($result) {
            while ($row = $result->fetch_assoc()) {
                $expired[] = $row;
            }
            $result->free();
        }
        
        return $expired;
    }
}
