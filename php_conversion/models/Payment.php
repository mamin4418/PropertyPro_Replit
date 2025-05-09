
<?php
class Payment {
    private $conn;
    
    public function __construct($db) {
        $this->conn = $db;
    }
    
    /**
     * Get all payments with related info
     * @return array Array of payments
     */
    public function getAllPayments() {
        $query = "SELECT p.*, l.unit_id, 
                  CONCAT(t.first_name, ' ', t.last_name) as tenant_name,
                  u.unit_number, pr.name as property_name
                  FROM payments p
                  JOIN leases l ON p.lease_id = l.id
                  JOIN tenants t ON l.tenant_id = t.id
                  JOIN units u ON l.unit_id = u.id
                  JOIN properties pr ON u.property_id = pr.id
                  ORDER BY p.payment_date DESC";
        
        $result = $this->conn->query($query);
        
        $payments = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $payments[] = $row;
            }
        }
        
        return $payments;
    }
    
    /**
     * Get payments by lease ID
     * @param int $lease_id Lease ID
     * @return array Array of payments for the specified lease
     */
    public function getPaymentsByLeaseId($lease_id) {
        $query = "SELECT * FROM payments WHERE lease_id = ? ORDER BY payment_date DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $lease_id);
        $stmt->execute();
        
        $result = $stmt->get_result();
        
        $payments = [];
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $payments[] = $row;
            }
        }
        
        $stmt->close();
        return $payments;
    }
    
    /**
     * Get payment by ID
     * @param int $id Payment ID
     * @return array|null Payment details or null if not found
     */
    public function getPaymentById($id) {
        $query = "SELECT p.*, l.unit_id, 
                  CONCAT(t.first_name, ' ', t.last_name) as tenant_name,
                  u.unit_number, pr.name as property_name
                  FROM payments p
                  JOIN leases l ON p.lease_id = l.id
                  JOIN tenants t ON l.tenant_id = t.id
                  JOIN units u ON l.unit_id = u.id
                  JOIN properties pr ON u.property_id = pr.id
                  WHERE p.id = ?";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $payment = $result->fetch_assoc();
            $stmt->close();
            return $payment;
        }
        
        $stmt->close();
        return null;
    }
    
    /**
     * Create a new payment
     * @param int $lease_id Lease ID
     * @param float $amount Payment amount
     * @param string $payment_date Payment date (YYYY-MM-DD)
     * @param string $payment_method Payment method
     * @param string $payment_type Payment type
     * @param string $reference_number Reference number
     * @param string $notes Notes
     * @return int|bool Newly created payment ID or false on failure
     */
    public function createPayment($lease_id, $amount, $payment_date, $payment_method, $payment_type, $reference_number, $notes) {
        $query = "INSERT INTO payments (lease_id, amount, payment_date, payment_method, payment_type, reference_number, notes) 
                  VALUES (?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("idssss", $lease_id, $amount, $payment_date, $payment_method, $payment_type, $reference_number, $notes);
        
        if ($stmt->execute()) {
            $payment_id = $stmt->insert_id;
            $stmt->close();
            return $payment_id;
        }
        
        $stmt->close();
        return false;
    }
    
    /**
     * Update an existing payment
     * @param int $id Payment ID
     * @param int $lease_id Lease ID
     * @param float $amount Payment amount
     * @param string $payment_date Payment date (YYYY-MM-DD)
     * @param string $payment_method Payment method
     * @param string $payment_type Payment type
     * @param string $reference_number Reference number
     * @param string $notes Notes
     * @return bool True on success, false on failure
     */
    public function updatePayment($id, $lease_id, $amount, $payment_date, $payment_method, $payment_type, $reference_number, $notes) {
        $query = "UPDATE payments 
                  SET lease_id = ?, amount = ?, payment_date = ?, payment_method = ?, 
                      payment_type = ?, reference_number = ?, notes = ? 
                  WHERE id = ?";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("idssssi", $lease_id, $amount, $payment_date, $payment_method, $payment_type, $reference_number, $notes, $id);
        
        $result = $stmt->execute();
        $stmt->close();
        
        return $result;
    }
    
    /**
     * Delete a payment
     * @param int $id Payment ID
     * @return bool True on success, false on failure
     */
    public function deletePayment($id) {
        $query = "DELETE FROM payments WHERE id = ?";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $id);
        
        $result = $stmt->execute();
        $stmt->close();
        
        return $result;
    }
    
    /**
     * Get payment statistics
     * @return array Payment statistics
     */
    public function getPaymentStats() {
        $stats = [
            'total_amount' => 0,
            'count' => 0,
            'avg_amount' => 0,
            'recent_payments' => []
        ];
        
        // Get total amount and count
        $query = "SELECT COUNT(*) as count, SUM(amount) as total FROM payments";
        $result = $this->conn->query($query);
        
        if ($result && $result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $stats['total_amount'] = $row['total'] ?: 0;
            $stats['count'] = $row['count'] ?: 0;
            $stats['avg_amount'] = $stats['count'] > 0 ? $stats['total_amount'] / $stats['count'] : 0;
        }
        
        // Get recent payments
        $query = "SELECT p.*, l.unit_id, 
                  CONCAT(t.first_name, ' ', t.last_name) as tenant_name,
                  u.unit_number
                  FROM payments p
                  JOIN leases l ON p.lease_id = l.id
                  JOIN tenants t ON l.tenant_id = t.id
                  JOIN units u ON l.unit_id = u.id
                  ORDER BY p.payment_date DESC LIMIT 5";
        
        $result = $this->conn->query($query);
        
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $stats['recent_payments'][] = $row;
            }
        }
        
        return $stats;
    }
    
    /**
     * Get payments by date range
     * @param string $start_date Start date (YYYY-MM-DD)
     * @param string $end_date End date (YYYY-MM-DD)
     * @return array Array of payments in the specified date range
     */
    public function getPaymentsByDateRange($start_date, $end_date) {
        $query = "SELECT p.*, l.unit_id, 
                  CONCAT(t.first_name, ' ', t.last_name) as tenant_name,
                  u.unit_number, pr.name as property_name
                  FROM payments p
                  JOIN leases l ON p.lease_id = l.id
                  JOIN tenants t ON l.tenant_id = t.id
                  JOIN units u ON l.unit_id = u.id
                  JOIN properties pr ON u.property_id = pr.id
                  WHERE p.payment_date BETWEEN ? AND ?
                  ORDER BY p.payment_date DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("ss", $start_date, $end_date);
        $stmt->execute();
        
        $result = $stmt->get_result();
        
        $payments = [];
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $payments[] = $row;
            }
        }
        
        $stmt->close();
        return $payments;
    }
    
    /**
     * Get payments by property ID
     * @param int $property_id Property ID
     * @return array Array of payments for the specified property
     */
    public function getPaymentsByPropertyId($property_id) {
        $query = "SELECT p.*, l.unit_id, 
                  CONCAT(t.first_name, ' ', t.last_name) as tenant_name,
                  u.unit_number
                  FROM payments p
                  JOIN leases l ON p.lease_id = l.id
                  JOIN tenants t ON l.tenant_id = t.id
                  JOIN units u ON l.unit_id = u.id
                  WHERE u.property_id = ?
                  ORDER BY p.payment_date DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $property_id);
        $stmt->execute();
        
        $result = $stmt->get_result();
        
        $payments = [];
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $payments[] = $row;
            }
        }
        
        $stmt->close();
        return $payments;
    }
}
?>
