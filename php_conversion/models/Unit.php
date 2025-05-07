
<?php
class Unit {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    // Get all units
    public function getAll() {
        $query = "SELECT * FROM units";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }

    // Get unit by ID
    public function getById($id) {
        $query = "SELECT * FROM units WHERE id = ?";
        $stmt = $this->db->prepare($query);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        
        return $stmt->get_result()->fetch_assoc();
    }

    // Get units by property ID
    public function getByPropertyId($propertyId) {
        $query = "SELECT * FROM units WHERE property_id = ?";
        $stmt = $this->db->prepare($query);
        $stmt->bind_param("i", $propertyId);
        $stmt->execute();
        
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }

    // Create a new unit
    public function create($data) {
        $query = "INSERT INTO units (
            property_id, unit_number, type, bedrooms, bathrooms, size, rent, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $this->db->prepare($query);
        $stmt->bind_param(
            "issiddds", 
            $data['property_id'],
            $data['unit_number'],
            $data['type'],
            $data['bedrooms'],
            $data['bathrooms'],
            $data['size'],
            $data['rent'],
            $data['status']
        );
        
        if ($stmt->execute()) {
            return $this->db->insert_id;
        } else {
            return false;
        }
    }

    // Update unit
    public function update($id, $data) {
        $query = "UPDATE units SET 
            property_id = ?,
            unit_number = ?,
            type = ?,
            bedrooms = ?,
            bathrooms = ?,
            size = ?,
            rent = ?,
            status = ?
            WHERE id = ?";
        
        $stmt = $this->db->prepare($query);
        $stmt->bind_param(
            "issidddsi",
            $data['property_id'],
            $data['unit_number'],
            $data['type'],
            $data['bedrooms'],
            $data['bathrooms'],
            $data['size'],
            $data['rent'],
            $data['status'],
            $id
        );
        
        return $stmt->execute();
    }

    // Delete unit
    public function delete($id) {
        $query = "DELETE FROM units WHERE id = ?";
        $stmt = $this->db->prepare($query);
        $stmt->bind_param("i", $id);
        
        return $stmt->execute();
    }

    // Get unit statistics
    public function getUnitStatistics($propertyId = null) {
        $whereClause = $propertyId ? "WHERE property_id = ?" : "";
        
        $query = "SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN status = 'occupied' THEN 1 ELSE 0 END) as occupied,
            SUM(CASE WHEN status = 'vacant' THEN 1 ELSE 0 END) as vacant,
            SUM(CASE WHEN status = 'maintenance' THEN 1 ELSE 0 END) as maintenance,
            AVG(rent) as average_rent
        FROM units 
        $whereClause";
        
        $stmt = $this->db->prepare($query);
        
        if ($propertyId) {
            $stmt->bind_param("i", $propertyId);
        }
        
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }
}
?>
