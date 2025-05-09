
<?php
class ScreeningCriteria {
    private $conn;
    
    public function __construct($db) {
        $this->conn = $db;
    }
    
    public function getAllCriteria() {
        $query = "SELECT * FROM screening_criteria ORDER BY name";
        $result = $this->conn->query($query);
        
        $criteria = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $criteria[] = $row;
            }
        }
        
        return $criteria;
    }
    
    public function getActiveCriteria() {
        $query = "SELECT * FROM screening_criteria WHERE active = 1 ORDER BY name";
        $result = $this->conn->query($query);
        
        $criteria = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $criteria[] = $row;
            }
        }
        
        return $criteria;
    }
    
    public function getCriteriaById($id) {
        $id = intval($id);
        
        $query = "SELECT * FROM screening_criteria WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result && $result->num_rows > 0) {
            return $result->fetch_assoc();
        }
        
        return false;
    }
    
    public function createCriteria($data) {
        $query = "INSERT INTO screening_criteria (
            name, description, min_credit_score, min_income_ratio, 
            criminal_check, eviction_check, employment_verification, 
            landlord_verification, active
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param(
            "ssiiiiii",
            $data['name'],
            $data['description'],
            $data['min_credit_score'],
            $data['min_income_ratio'],
            $data['criminal_check'],
            $data['eviction_check'],
            $data['employment_verification'],
            $data['landlord_verification'],
            $data['active']
        );
        
        if ($stmt->execute()) {
            return $this->conn->insert_id;
        }
        
        return false;
    }
    
    public function updateCriteria($id, $data) {
        $id = intval($id);
        
        $query = "UPDATE screening_criteria SET 
            name = ?, description = ?, min_credit_score = ?, 
            min_income_ratio = ?, criminal_check = ?, eviction_check = ?, 
            employment_verification = ?, landlord_verification = ?, active = ? 
        WHERE id = ?";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param(
            "ssiiiiiiii",
            $data['name'],
            $data['description'],
            $data['min_credit_score'],
            $data['min_income_ratio'],
            $data['criminal_check'],
            $data['eviction_check'],
            $data['employment_verification'],
            $data['landlord_verification'],
            $data['active'],
            $id
        );
        
        return $stmt->execute();
    }
    
    public function deleteCriteria($id) {
        $id = intval($id);
        
        $query = "DELETE FROM screening_criteria WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $id);
        
        return $stmt->execute();
    }
    
    public function screenApplication($application_id, $criteria_id) {
        // In a real implementation, this would include actual credit checks, background checks, etc.
        // For this demo, we'll just simulate the screening process
        
        $application_id = intval($application_id);
        $criteria_id = intval($criteria_id);
        
        // Get the application and criteria
        $applicationModel = new Application($this->conn);
        $application = $applicationModel->getApplicationById($application_id);
        
        $criteria = $this->getCriteriaById($criteria_id);
        
        if (!$application || !$criteria) {
            return [
                'status' => 'error',
                'message' => 'Application or criteria not found'
            ];
        }
        
        // Simulate screening checks
        $checks = [];
        $passed = true;
        
        // Income check
        $rent = 0;
        if ($application['unit_id']) {
            // Get the rent amount for the unit
            $query = "SELECT rent_amount FROM units WHERE id = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param("i", $application['unit_id']);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($result && $result->num_rows > 0) {
                $unit = $result->fetch_assoc();
                $rent = $unit['rent_amount'];
            }
        }
        
        if ($rent > 0) {
            $income_ratio = $application['monthly_income'] / $rent;
            $income_check = $income_ratio >= $criteria['min_income_ratio'];
            
            $checks[] = [
                'name' => 'Income Ratio',
                'result' => $income_check ? 'Passed' : 'Failed',
                'details' => 'Income ratio: ' . number_format($income_ratio, 2) . ' (minimum: ' . $criteria['min_income_ratio'] . ')'
            ];
            
            if (!$income_check) {
                $passed = false;
            }
        }
        
        // Simulate other checks
        $credit_score = rand(550, 800); // Random score for simulation
        $credit_check = $credit_score >= $criteria['min_credit_score'];
        
        $checks[] = [
            'name' => 'Credit Score',
            'result' => $credit_check ? 'Passed' : 'Failed',
            'details' => 'Credit score: ' . $credit_score . ' (minimum: ' . $criteria['min_credit_score'] . ')'
        ];
        
        if (!$credit_check) {
            $passed = false;
        }
        
        // Simulate criminal and eviction checks
        if ($criteria['criminal_check']) {
            $has_criminal = (rand(1, 10) == 1); // 10% chance for demo
            
            $checks[] = [
                'name' => 'Criminal Background',
                'result' => $has_criminal ? 'Failed' : 'Passed',
                'details' => $has_criminal ? 'Criminal record found' : 'No criminal record found'
            ];
            
            if ($has_criminal) {
                $passed = false;
            }
        }
        
        if ($criteria['eviction_check']) {
            $has_eviction = (rand(1, 20) == 1); // 5% chance for demo
            
            $checks[] = [
                'name' => 'Eviction History',
                'result' => $has_eviction ? 'Failed' : 'Passed',
                'details' => $has_eviction ? 'Eviction record found' : 'No eviction record found'
            ];
            
            if ($has_eviction) {
                $passed = false;
            }
        }
        
        // Update application screening status
        $screening_status = $passed ? 'passed' : 'failed';
        $applicationModel->updateScreeningStatus($application_id, $screening_status);
        
        return [
            'status' => 'success',
            'screening_status' => $screening_status,
            'checks' => $checks
        ];
    }
}
?>
