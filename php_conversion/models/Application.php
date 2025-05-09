
<?php
class Application {
    private $conn;
    
    public function __construct($db) {
        $this->conn = $db;
    }
    
    public function getAllApplications() {
        $query = "SELECT a.*, p.name as property_name, u.unit_number 
                 FROM applications a 
                 LEFT JOIN properties p ON a.property_id = p.id 
                 LEFT JOIN units u ON a.unit_id = u.id 
                 ORDER BY a.application_date DESC";
        
        $result = $this->conn->query($query);
        
        $applications = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $applications[] = $row;
            }
        }
        
        return $applications;
    }
    
    public function getApplicationsByStatus($status) {
        $query = "SELECT a.*, p.name as property_name, u.unit_number 
                 FROM applications a 
                 LEFT JOIN properties p ON a.property_id = p.id 
                 LEFT JOIN units u ON a.unit_id = u.id 
                 WHERE a.status = ? 
                 ORDER BY a.application_date DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("s", $status);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $applications = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $applications[] = $row;
            }
        }
        
        return $applications;
    }
    
    public function getApplicationById($id) {
        $id = intval($id);
        
        $query = "SELECT a.*, p.name as property_name, u.unit_number 
                 FROM applications a 
                 LEFT JOIN properties p ON a.property_id = p.id 
                 LEFT JOIN units u ON a.unit_id = u.id 
                 WHERE a.id = ?";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result && $result->num_rows > 0) {
            return $result->fetch_assoc();
        }
        
        return false;
    }
    
    public function createApplication($data) {
        $query = "INSERT INTO applications (
            property_id, unit_id, first_name, last_name, email, phone, date_of_birth, 
            current_address, current_city, current_state, current_zip, 
            current_landlord_name, current_landlord_phone, employment_status, 
            employer_name, employer_phone, monthly_income, additional_occupants, 
            pets, pet_description, vehicle_make, vehicle_model, vehicle_year, 
            license_plate, emergency_contact_name, emergency_contact_phone, 
            emergency_contact_relation, status, screening_status, notes
        ) VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        )";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param(
            "iisssssssssssssdiiissssssssss",
            $data['property_id'],
            $data['unit_id'],
            $data['first_name'],
            $data['last_name'],
            $data['email'],
            $data['phone'],
            $data['date_of_birth'],
            $data['current_address'],
            $data['current_city'],
            $data['current_state'],
            $data['current_zip'],
            $data['current_landlord_name'],
            $data['current_landlord_phone'],
            $data['employment_status'],
            $data['employer_name'],
            $data['employer_phone'],
            $data['monthly_income'],
            $data['additional_occupants'],
            $data['pets'],
            $data['pet_description'],
            $data['vehicle_make'],
            $data['vehicle_model'],
            $data['vehicle_year'],
            $data['license_plate'],
            $data['emergency_contact_name'],
            $data['emergency_contact_phone'],
            $data['emergency_contact_relation'],
            $data['status'],
            $data['screening_status'],
            $data['notes']
        );
        
        if ($stmt->execute()) {
            return $this->conn->insert_id;
        }
        
        return false;
    }
    
    public function updateApplication($id, $data) {
        $id = intval($id);
        
        $query = "UPDATE applications SET 
            property_id = ?, unit_id = ?, first_name = ?, last_name = ?, 
            email = ?, phone = ?, date_of_birth = ?, current_address = ?, 
            current_city = ?, current_state = ?, current_zip = ?, 
            current_landlord_name = ?, current_landlord_phone = ?, 
            employment_status = ?, employer_name = ?, employer_phone = ?, 
            monthly_income = ?, additional_occupants = ?, pets = ?, 
            pet_description = ?, vehicle_make = ?, vehicle_model = ?, 
            vehicle_year = ?, license_plate = ?, emergency_contact_name = ?, 
            emergency_contact_phone = ?, emergency_contact_relation = ?, 
            status = ?, screening_status = ?, notes = ? 
        WHERE id = ?";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param(
            "iisssssssssssssdiiisssssssssi",
            $data['property_id'],
            $data['unit_id'],
            $data['first_name'],
            $data['last_name'],
            $data['email'],
            $data['phone'],
            $data['date_of_birth'],
            $data['current_address'],
            $data['current_city'],
            $data['current_state'],
            $data['current_zip'],
            $data['current_landlord_name'],
            $data['current_landlord_phone'],
            $data['employment_status'],
            $data['employer_name'],
            $data['employer_phone'],
            $data['monthly_income'],
            $data['additional_occupants'],
            $data['pets'],
            $data['pet_description'],
            $data['vehicle_make'],
            $data['vehicle_model'],
            $data['vehicle_year'],
            $data['license_plate'],
            $data['emergency_contact_name'],
            $data['emergency_contact_phone'],
            $data['emergency_contact_relation'],
            $data['status'],
            $data['screening_status'],
            $data['notes'],
            $id
        );
        
        return $stmt->execute();
    }
    
    public function updateApplicationStatus($id, $status, $notes = null) {
        $id = intval($id);
        
        $query = "UPDATE applications SET status = ?";
        
        $params = [$status];
        $types = "s";
        
        if ($notes) {
            $query .= ", notes = CONCAT(notes, '\n', ?)";
            $params[] = date('Y-m-d H:i:s') . ": Status updated to $status - $notes";
            $types .= "s";
        }
        
        $query .= " WHERE id = ?";
        $params[] = $id;
        $types .= "i";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param($types, ...$params);
        
        return $stmt->execute();
    }
    
    public function updateScreeningStatus($id, $status, $notes = null) {
        $id = intval($id);
        
        $query = "UPDATE applications SET screening_status = ?";
        
        $params = [$status];
        $types = "s";
        
        if ($notes) {
            $query .= ", notes = CONCAT(notes, '\n', ?)";
            $params[] = date('Y-m-d H:i:s') . ": Screening updated to $status - $notes";
            $types .= "s";
        }
        
        $query .= " WHERE id = ?";
        $params[] = $id;
        $types .= "i";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param($types, ...$params);
        
        return $stmt->execute();
    }
    
    public function deleteApplication($id) {
        $id = intval($id);
        
        // First, delete any documents associated with the application
        $query = "DELETE FROM application_documents WHERE application_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        
        // Then delete the application
        $query = "DELETE FROM applications WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $id);
        
        return $stmt->execute();
    }
    
    public function getApplicationDocuments($application_id) {
        $application_id = intval($application_id);
        
        $query = "SELECT * FROM application_documents WHERE application_id = ? ORDER BY upload_date DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $application_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $documents = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $documents[] = $row;
            }
        }
        
        return $documents;
    }
    
    public function addApplicationDocument($application_id, $document_type, $file_path, $notes = null) {
        $application_id = intval($application_id);
        
        $query = "INSERT INTO application_documents (application_id, document_type, file_path, notes) 
                 VALUES (?, ?, ?, ?)";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("isss", $application_id, $document_type, $file_path, $notes);
        
        if ($stmt->execute()) {
            return $this->conn->insert_id;
        }
        
        return false;
    }
    
    public function deleteApplicationDocument($document_id) {
        $document_id = intval($document_id);
        
        // First get the document to find the file path
        $query = "SELECT file_path FROM application_documents WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $document_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result && $result->num_rows > 0) {
            $document = $result->fetch_assoc();
            
            // Delete the file if it exists
            if (file_exists($document['file_path'])) {
                unlink($document['file_path']);
            }
            
            // Delete the database record
            $query = "DELETE FROM application_documents WHERE id = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param("i", $document_id);
            
            return $stmt->execute();
        }
        
        return false;
    }
    
    public function convertApplicationToTenant($application_id) {
        $application_id = intval($application_id);
        
        // Get the application data
        $application = $this->getApplicationById($application_id);
        if (!$application) {
            return false;
        }
        
        // Create a new tenant from the application data
        $query = "INSERT INTO tenants (
            first_name, last_name, email, phone, date_of_birth, 
            emergency_contact_name, emergency_contact_phone
        ) VALUES (?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param(
            "sssssss",
            $application['first_name'],
            $application['last_name'],
            $application['email'],
            $application['phone'],
            $application['date_of_birth'],
            $application['emergency_contact_name'],
            $application['emergency_contact_phone']
        );
        
        if ($stmt->execute()) {
            $tenant_id = $this->conn->insert_id;
            
            // Update the application status
            $this->updateApplicationStatus($application_id, 'approved', 'Converted to tenant ID: ' . $tenant_id);
            
            return $tenant_id;
        }
        
        return false;
    }
    
    public function getApplicationCountsByStatus() {
        $query = "SELECT status, COUNT(*) as count FROM applications GROUP BY status";
        $result = $this->conn->query($query);
        
        $counts = [
            'pending' => 0,
            'approved' => 0,
            'denied' => 0,
            'cancelled' => 0
        ];
        
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $counts[$row['status']] = $row['count'];
            }
        }
        
        return $counts;
    }
}
?>
