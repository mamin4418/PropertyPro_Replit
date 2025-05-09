
<?php
class Payment {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function getAllPayments($filters = []) {
        $sql = "SELECT p.*, 
                l.id as lease_id, 
                t.first_name as tenant_first_name, 
                t.last_name as tenant_last_name,
                pr.name as property_name,
                u.unit_number
                FROM payments p
                LEFT JOIN leases l ON p.lease_id = l.id
                LEFT JOIN tenants t ON l.tenant_id = t.id
                LEFT JOIN units u ON l.unit_id = u.id
                LEFT JOIN properties pr ON u.property_id = pr.id
                WHERE 1=1";
        
        $params = [];
        $param_types = "";
        
        // Apply filters
        if (isset($filters['tenant_id']) && !empty($filters['tenant_id'])) {
            $sql .= " AND l.tenant_id = ?";
            $params[] = $filters['tenant_id'];
            $param_types .= "i";
        }
        
        if (isset($filters['property_id']) && !empty($filters['property_id'])) {
            $sql .= " AND pr.id = ?";
            $params[] = $filters['property_id'];
            $param_types .= "i";
        }
        
        if (isset($filters['unit_id']) && !empty($filters['unit_id'])) {
            $sql .= " AND u.id = ?";
            $params[] = $filters['unit_id'];
            $param_types .= "i";
        }
        
        if (isset($filters['status']) && !empty($filters['status'])) {
            $sql .= " AND p.status = ?";
            $params[] = $filters['status'];
            $param_types .= "s";
        }
        
        if (isset($filters['date_from']) && !empty($filters['date_from'])) {
            $sql .= " AND p.payment_date >= ?";
            $params[] = $filters['date_from'];
            $param_types .= "s";
        }
        
        if (isset($filters['date_to']) && !empty($filters['date_to'])) {
            $sql .= " AND p.payment_date <= ?";
            $params[] = $filters['date_to'];
            $param_types .= "s";
        }
        
        $sql .= " ORDER BY p.payment_date DESC";
        
        $stmt = $this->db->prepare($sql);
        
        if (!empty($params)) {
            $stmt->bind_param($param_types, ...$params);
        }
        
        $stmt->execute();
        $result = $stmt->get_result();
        
        $payments = [];
        while ($row = $result->fetch_assoc()) {
            $payments[] = $row;
        }
        
        return $payments;
    }

    public function getPaymentById($id) {
        $query = "SELECT p.*, 
                 l.id as lease_id, 
                 t.first_name as tenant_first_name, 
                 t.last_name as tenant_last_name,
                 t.id as tenant_id,
                 pr.name as property_name,
                 pr.id as property_id,
                 u.unit_number,
                 u.id as unit_id
                 FROM payments p
                 LEFT JOIN leases l ON p.lease_id = l.id
                 LEFT JOIN tenants t ON l.tenant_id = t.id
                 LEFT JOIN units u ON l.unit_id = u.id
                 LEFT JOIN properties pr ON u.property_id = pr.id
                 WHERE p.id = ?";
        
        $stmt = $this->db->prepare($query);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        return $result->fetch_assoc();
    }

    public function getPaymentsByLeaseId($lease_id) {
        $query = "SELECT * FROM payments WHERE lease_id = ? ORDER BY payment_date DESC";
        $stmt = $this->db->prepare($query);
        $stmt->bind_param("i", $lease_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $payments = [];
        while ($row = $result->fetch_assoc()) {
            $payments[] = $row;
        }
        
        return $payments;
    }

    public function getPaymentsByTenantId($tenant_id) {
        $query = "SELECT p.*, 
                 l.id as lease_id, 
                 pr.name as property_name,
                 u.unit_number
                 FROM payments p
                 JOIN leases l ON p.lease_id = l.id
                 JOIN units u ON l.unit_id = u.id
                 JOIN properties pr ON u.property_id = pr.id
                 WHERE l.tenant_id = ?
                 ORDER BY p.payment_date DESC";
        
        $stmt = $this->db->prepare($query);
        $stmt->bind_param("i", $tenant_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $payments = [];
        while ($row = $result->fetch_assoc()) {
            $payments[] = $row;
        }
        
        return $payments;
    }

    public function createPayment($data) {
        $query = "INSERT INTO payments (lease_id, amount, payment_date, payment_method, 
                 reference_number, memo, status, created_at) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, NOW())";
        
        $stmt = $this->db->prepare($query);
        $stmt->bind_param(
            "idssss", 
            $data['lease_id'], 
            $data['amount'], 
            $data['payment_date'], 
            $data['payment_method'], 
            $data['reference_number'], 
            $data['memo'],
            $data['status']
        );
        
        if ($stmt->execute()) {
            return $this->db->insert_id;
        }
        
        return false;
    }

    public function updatePayment($id, $data) {
        $query = "UPDATE payments SET 
                 lease_id = ?, 
                 amount = ?, 
                 payment_date = ?, 
                 payment_method = ?, 
                 reference_number = ?, 
                 memo = ?, 
                 status = ?, 
                 updated_at = NOW()
                 WHERE id = ?";
        
        $stmt = $this->db->prepare($query);
        $stmt->bind_param(
            "idssssi", 
            $data['lease_id'], 
            $data['amount'], 
            $data['payment_date'], 
            $data['payment_method'], 
            $data['reference_number'], 
            $data['memo'],
            $data['status'],
            $id
        );
        
        return $stmt->execute();
    }

    public function deletePayment($id) {
        $query = "DELETE FROM payments WHERE id = ?";
        $stmt = $this->db->prepare($query);
        $stmt->bind_param("i", $id);
        
        return $stmt->execute();
    }
    
    public function getPaymentTotals($filters = []) {
        $sql = "SELECT SUM(p.amount) as total_amount, COUNT(p.id) as total_count
                FROM payments p
                LEFT JOIN leases l ON p.lease_id = l.id
                LEFT JOIN tenants t ON l.tenant_id = t.id
                LEFT JOIN units u ON l.unit_id = u.id
                LEFT JOIN properties pr ON u.property_id = pr.id
                WHERE 1=1";
        
        $params = [];
        $param_types = "";
        
        // Apply filters
        if (isset($filters['tenant_id']) && !empty($filters['tenant_id'])) {
            $sql .= " AND l.tenant_id = ?";
            $params[] = $filters['tenant_id'];
            $param_types .= "i";
        }
        
        if (isset($filters['property_id']) && !empty($filters['property_id'])) {
            $sql .= " AND pr.id = ?";
            $params[] = $filters['property_id'];
            $param_types .= "i";
        }
        
        if (isset($filters['unit_id']) && !empty($filters['unit_id'])) {
            $sql .= " AND u.id = ?";
            $params[] = $filters['unit_id'];
            $param_types .= "i";
        }
        
        if (isset($filters['status']) && !empty($filters['status'])) {
            $sql .= " AND p.status = ?";
            $params[] = $filters['status'];
            $param_types .= "s";
        }
        
        if (isset($filters['date_from']) && !empty($filters['date_from'])) {
            $sql .= " AND p.payment_date >= ?";
            $params[] = $filters['date_from'];
            $param_types .= "s";
        }
        
        if (isset($filters['date_to']) && !empty($filters['date_to'])) {
            $sql .= " AND p.payment_date <= ?";
            $params[] = $filters['date_to'];
            $param_types .= "s";
        }
        
        $stmt = $this->db->prepare($sql);
        
        if (!empty($params)) {
            $stmt->bind_param($param_types, ...$params);
        }
        
        $stmt->execute();
        $result = $stmt->get_result();
        
        return $result->fetch_assoc();
    }
    
    public function generateReceipt($payment_id) {
        $payment = $this->getPaymentById($payment_id);
        
        if (!$payment) {
            return false;
        }
        
        // Generate a receipt reference
        $receipt_ref = 'RCPT-' . date('Ymd') . '-' . $payment_id;
        
        // Update payment with receipt reference
        $query = "UPDATE payments SET receipt_reference = ? WHERE id = ?";
        $stmt = $this->db->prepare($query);
        $stmt->bind_param("si", $receipt_ref, $payment_id);
        $stmt->execute();
        
        return $receipt_ref;
    }
}
?>
