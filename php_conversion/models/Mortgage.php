
<?php
class Mortgage {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function getAllMortgages() {
        $query = "SELECT m.*, p.name as property_name 
                  FROM mortgages m 
                  LEFT JOIN properties p ON m.property_id = p.id 
                  ORDER BY m.start_date DESC";
        $result = $this->db->query($query);
        
        $mortgages = [];
        while ($row = $result->fetch_assoc()) {
            $mortgages[] = $row;
        }
        
        return $mortgages;
    }

    public function getMortgagesByProperty($property_id) {
        $query = "SELECT m.*, p.name as property_name 
                  FROM mortgages m 
                  LEFT JOIN properties p ON m.property_id = p.id 
                  WHERE m.property_id = ? 
                  ORDER BY m.start_date DESC";
        
        $stmt = $this->db->prepare($query);
        $stmt->bind_param("i", $property_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $mortgages = [];
        while ($row = $result->fetch_assoc()) {
            $mortgages[] = $row;
        }
        
        return $mortgages;
    }

    public function getMortgageById($id) {
        $query = "SELECT m.*, p.name as property_name 
                  FROM mortgages m 
                  LEFT JOIN properties p ON m.property_id = p.id 
                  WHERE m.id = ?";
        
        $stmt = $this->db->prepare($query);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        return $result->fetch_assoc();
    }

    public function addMortgage($data) {
        $query = "INSERT INTO mortgages (property_id, lender, loan_amount, interest_rate, term_years, 
                  start_date, payment_amount, payment_frequency, loan_number, notes) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $this->db->prepare($query);
        $stmt->bind_param("isdisdsiss", 
            $data['property_id'], 
            $data['lender'], 
            $data['loan_amount'], 
            $data['interest_rate'], 
            $data['term_years'], 
            $data['start_date'], 
            $data['payment_amount'], 
            $data['payment_frequency'], 
            $data['loan_number'], 
            $data['notes']
        );
        
        if ($stmt->execute()) {
            return $this->db->insert_id;
        } else {
            return false;
        }
    }

    public function updateMortgage($id, $data) {
        $query = "UPDATE mortgages 
                  SET property_id = ?, lender = ?, loan_amount = ?, interest_rate = ?, 
                      term_years = ?, start_date = ?, payment_amount = ?, payment_frequency = ?, 
                      loan_number = ?, notes = ? 
                  WHERE id = ?";
        
        $stmt = $this->db->prepare($query);
        $stmt->bind_param("isdisdsissi", 
            $data['property_id'], 
            $data['lender'], 
            $data['loan_amount'], 
            $data['interest_rate'], 
            $data['term_years'], 
            $data['start_date'], 
            $data['payment_amount'], 
            $data['payment_frequency'], 
            $data['loan_number'], 
            $data['notes'],
            $id
        );
        
        return $stmt->execute();
    }

    public function deleteMortgage($id) {
        $query = "DELETE FROM mortgages WHERE id = ?";
        $stmt = $this->db->prepare($query);
        $stmt->bind_param("i", $id);
        return $stmt->execute();
    }

    public function getMortgageSummary() {
        $query = "SELECT SUM(loan_amount) as total_debt, 
                         AVG(interest_rate) as avg_interest_rate, 
                         COUNT(*) as total_mortgages 
                  FROM mortgages";
        
        $result = $this->db->query($query);
        return $result->fetch_assoc();
    }
}
?>
