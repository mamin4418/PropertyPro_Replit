
<?php
class Inspection {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getAllInspections() {
        $query = "SELECT i.*, p.name as property_name 
                  FROM inspections i 
                  JOIN properties p ON i.property_id = p.id 
                  ORDER BY i.scheduled_date DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->get_result();
    }

    public function getScheduledInspections() {
        $query = "SELECT i.*, p.name as property_name 
                  FROM inspections i 
                  JOIN properties p ON i.property_id = p.id 
                  WHERE i.status = 'scheduled' 
                  ORDER BY i.scheduled_date ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->get_result();
    }

    public function getCompletedInspections() {
        $query = "SELECT i.*, p.name as property_name 
                  FROM inspections i 
                  JOIN properties p ON i.property_id = p.id 
                  WHERE i.status = 'completed' 
                  ORDER BY i.completed_date DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->get_result();
    }

    public function getInspectionById($id) {
        $query = "SELECT i.*, p.name as property_name 
                  FROM inspections i 
                  JOIN properties p ON i.property_id = p.id 
                  WHERE i.id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    public function createInspection($property_id, $unit_id, $type, $scheduled_date, $inspector_name, $notes) {
        $query = "INSERT INTO inspections (property_id, unit_id, type, scheduled_date, inspector_name, notes, status) 
                  VALUES (?, ?, ?, ?, ?, ?, 'scheduled')";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("iissss", $property_id, $unit_id, $type, $scheduled_date, $inspector_name, $notes);
        
        if ($stmt->execute()) {
            return $this->conn->insert_id;
        }
        
        return false;
    }

    public function completeInspection($id, $findings, $completed_date) {
        $query = "UPDATE inspections SET findings = ?, completed_date = ?, status = 'completed' WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("ssi", $findings, $completed_date, $id);
        
        return $stmt->execute();
    }

    public function updateInspection($id, $property_id, $unit_id, $type, $scheduled_date, $inspector_name, $notes) {
        $query = "UPDATE inspections SET property_id = ?, unit_id = ?, type = ?, scheduled_date = ?, inspector_name = ?, notes = ? WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("iissssi", $property_id, $unit_id, $type, $scheduled_date, $inspector_name, $notes, $id);
        
        return $stmt->execute();
    }

    public function deleteInspection($id) {
        $query = "DELETE FROM inspections WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $id);
        
        return $stmt->execute();
    }
}
?>
