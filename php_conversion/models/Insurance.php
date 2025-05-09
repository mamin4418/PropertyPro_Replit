
<?php
class Insurance {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function getAllInsurances() {
        $query = "SELECT i.*, p.name as property_name 
                  FROM insurances i 
                  LEFT JOIN properties p ON i.property_id = p.id 
                  ORDER BY i.expiration_date";
        $result = $this->db->query($query);
        
        $insurances = [];
        while ($row = $result->fetch_assoc()) {
            $insurances[] = $row;
        }
        
        return $insurances;
    }

    public function getInsurancesByProperty($property_id) {
        $query = "SELECT i.*, p.name as property_name 
                  FROM insurances i 
                  LEFT JOIN properties p ON i.property_id = p.id 
                  WHERE i.property_id = ? 
                  ORDER BY i.expiration_date";
        
        $stmt = $this->db->prepare($query);
        $stmt->bind_param("i", $property_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $insurances = [];
        while ($row = $result->fetch_assoc()) {
            $insurances[] = $row;
        }
        
        return $insurances;
    }

    public function getInsuranceById($id) {
        $query = "SELECT i.*, p.name as property_name 
                  FROM insurances i 
                  LEFT JOIN properties p ON i.property_id = p.id 
                  WHERE i.id = ?";
        
        $stmt = $this->db->prepare($query);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        return $result->fetch_assoc();
    }

    public function addInsurance($data) {
        $query = "INSERT INTO insurances (property_id, provider, policy_number, coverage_type, 
                  premium_amount, payment_frequency, effective_date, expiration_date, 
                  coverage_amount, deductible, notes) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $this->db->prepare($query);
        $stmt->bind_param("isssississs", 
            $data['property_id'], 
            $data['provider'], 
            $data['policy_number'], 
            $data['coverage_type'], 
            $data['premium_amount'], 
            $data['payment_frequency'], 
            $data['effective_date'], 
            $data['expiration_date'], 
            $data['coverage_amount'], 
            $data['deductible'], 
            $data['notes']
        );
        
        if ($stmt->execute()) {
            return $this->db->insert_id;
        } else {
            return false;
        }
    }

    public function updateInsurance($id, $data) {
        $query = "UPDATE insurances 
                  SET property_id = ?, provider = ?, policy_number = ?, coverage_type = ?, 
                      premium_amount = ?, payment_frequency = ?, effective_date = ?, 
                      expiration_date = ?, coverage_amount = ?, deductible = ?, notes = ? 
                  WHERE id = ?";
        
        $stmt = $this->db->prepare($query);
        $stmt->bind_param("isssississsi", 
            $data['property_id'], 
            $data['provider'], 
            $data['policy_number'], 
            $data['coverage_type'], 
            $data['premium_amount'], 
            $data['payment_frequency'], 
            $data['effective_date'], 
            $data['expiration_date'], 
            $data['coverage_amount'], 
            $data['deductible'], 
            $data['notes'],
            $id
        );
        
        return $stmt->execute();
    }

    public function deleteInsurance($id) {
        $query = "DELETE FROM insurances WHERE id = ?";
        $stmt = $this->db->prepare($query);
        $stmt->bind_param("i", $id);
        return $stmt->execute();
    }

    public function getExpiringInsurances($days = 30) {
        $query = "SELECT i.*, p.name as property_name 
                  FROM insurances i 
                  LEFT JOIN properties p ON i.property_id = p.id 
                  WHERE i.expiration_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL ? DAY) 
                  ORDER BY i.expiration_date";
        
        $stmt = $this->db->prepare($query);
        $stmt->bind_param("i", $days);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $insurances = [];
        while ($row = $result->fetch_assoc()) {
            $insurances[] = $row;
        }
        
        return $insurances;
    }
}
?>
