<?php
class Lease {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    /**
     * Get all leases with related info
     * @return array Array of leases
     */
    public function getAllLeases() {
        $query = "SELECT l.*, 
                  CONCAT(t.first_name, ' ', t.last_name) as tenant_name,
                  u.unit_number, p.name as property_name
                  FROM leases l
                  JOIN tenants t ON l.tenant_id = t.id
                  JOIN units u ON l.unit_id = u.id
                  JOIN properties p ON u.property_id = p.id
                  ORDER BY l.start_date DESC";

        $result = $this->conn->query($query);

        $leases = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $leases[] = $row;
            }
        }

        return $leases;
    }

    /**
     * Get lease by ID
     * @param int $id Lease ID
     * @return array|null Lease details or null if not found
     */
    public function getLeaseById($id) {
        $query = "SELECT l.*, 
                  CONCAT(t.first_name, ' ', t.last_name) as tenant_name,
                  u.unit_number, p.name as property_name
                  FROM leases l
                  JOIN tenants t ON l.tenant_id = t.id
                  JOIN units u ON l.unit_id = u.id
                  JOIN properties p ON u.property_id = p.id
                  WHERE l.id = ?";

        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $id);
        $stmt->execute();

        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $lease = $result->fetch_assoc();
            $stmt->close();
            return $lease;
        }

        $stmt->close();
        return null;
    }

    /**
     * Get leases by tenant ID
     * @param int $tenant_id Tenant ID
     * @return array Array of leases for the specified tenant
     */
    public function getLeasesByTenantId($tenant_id) {
        $query = "SELECT l.*, 
                  u.unit_number, p.name as property_name
                  FROM leases l
                  JOIN units u ON l.unit_id = u.id
                  JOIN properties p ON u.property_id = p.id
                  WHERE l.tenant_id = ?
                  ORDER BY l.start_date DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $tenant_id);
        $stmt->execute();

        $result = $stmt->get_result();

        $leases = [];
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $leases[] = $row;
            }
        }

        $stmt->close();
        return $leases;
    }

    /**
     * Get leases by unit ID
     * @param int $unit_id Unit ID
     * @return array Array of leases for the specified unit
     */
    public function getLeasesByUnitId($unit_id) {
        $query = "SELECT l.*, 
                  CONCAT(t.first_name, ' ', t.last_name) as tenant_name
                  FROM leases l
                  JOIN tenants t ON l.tenant_id = t.id
                  WHERE l.unit_id = ?
                  ORDER BY l.start_date DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $unit_id);
        $stmt->execute();

        $result = $stmt->get_result();

        $leases = [];
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $leases[] = $row;
            }
        }

        $stmt->close();
        return $leases;
    }

    /**
     * Get active leases
     * @return array Array of active leases
     */
    public function getActiveLeases() {
        $query = "SELECT l.*, 
                  CONCAT(t.first_name, ' ', t.last_name) as tenant_name,
                  u.unit_number, p.name as property_name
                  FROM leases l
                  JOIN tenants t ON l.tenant_id = t.id
                  JOIN units u ON l.unit_id = u.id
                  JOIN properties p ON u.property_id = p.id
                  WHERE l.status = 'active'
                  ORDER BY l.start_date DESC";

        $result = $this->conn->query($query);

        $leases = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $leases[] = $row;
            }
        }

        return $leases;
    }

    /**
     * Create a new lease
     * @param int $unit_id Unit ID
     * @param int $tenant_id Tenant ID
     * @param string $start_date Start date (YYYY-MM-DD)
     * @param string $end_date End date (YYYY-MM-DD)
     * @param float $rent_amount Rent amount
     * @param float $security_deposit Security deposit amount
     * @param string $status Lease status
     * @param string $lease_type Lease type
     * @param int $payment_due_day Payment due day
     * @param float $late_fee_amount Late fee amount
     * @param int $late_fee_days Late fee days
     * @return int|bool Newly created lease ID or false on failure
     */
    public function createLease($unit_id, $tenant_id, $start_date, $end_date, $rent_amount, $security_deposit, $status, $lease_type, $payment_due_day, $late_fee_amount, $late_fee_days) {
        $query = "INSERT INTO leases (unit_id, tenant_id, start_date, end_date, rent_amount, security_deposit, status, lease_type, payment_due_day, late_fee_amount, late_fee_days) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("iissddssidi", $unit_id, $tenant_id, $start_date, $end_date, $rent_amount, $security_deposit, $status, $lease_type, $payment_due_day, $late_fee_amount, $late_fee_days);

        if ($stmt->execute()) {
            $lease_id = $stmt->insert_id;
            $stmt->close();
            return $lease_id;
        }

        $stmt->close();
        return false;
    }

    /**
     * Update an existing lease
     * @param int $id Lease ID
     * @param int $unit_id Unit ID
     * @param int $tenant_id Tenant ID
     * @param string $start_date Start date (YYYY-MM-DD)
     * @param string $end_date End date (YYYY-MM-DD)
     * @param float $rent_amount Rent amount
     * @param float $security_deposit Security deposit amount
     * @param string $status Lease status
     * @param string $lease_type Lease type
     * @param int $payment_due_day Payment due day
     * @param float $late_fee_amount Late fee amount
     * @param int $late_fee_days Late fee days
     * @return bool True on success, false on failure
     */
    public function updateLease($id, $unit_id, $tenant_id, $start_date, $end_date, $rent_amount, $security_deposit, $status, $lease_type, $payment_due_day, $late_fee_amount, $late_fee_days) {
        $query = "UPDATE leases 
                  SET unit_id = ?, tenant_id = ?, start_date = ?, end_date = ?, 
                      rent_amount = ?, security_deposit = ?, status = ?, lease_type = ?, 
                      payment_due_day = ?, late_fee_amount = ?, late_fee_days = ? 
                  WHERE id = ?";

        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("iissddssidii", $unit_id, $tenant_id, $start_date, $end_date, $rent_amount, $security_deposit, $status, $lease_type, $payment_due_day, $late_fee_amount, $late_fee_days, $id);

        $result = $stmt->execute();
        $stmt->close();

        return $result;
    }

    /**
     * Update lease status
     * @param int $id Lease ID
     * @param string $status New status
     * @return bool True on success, false on failure
     */
    public function updateLeaseStatus($id, $status) {
        $query = "UPDATE leases SET status = ? WHERE id = ?";

        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("si", $status, $id);

        $result = $stmt->execute();
        $stmt->close();

        return $result;
    }
}
?>