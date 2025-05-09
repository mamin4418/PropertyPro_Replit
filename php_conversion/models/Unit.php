
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
<?php
class Unit {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function getAllUnits($property_id = null) {
        $query = "SELECT u.*, p.name as property_name 
                 FROM units u 
                 LEFT JOIN properties p ON u.property_id = p.id";
        
        if ($property_id) {
            $query .= " WHERE u.property_id = ?";
            $stmt = $this->db->prepare($query);
            $stmt->bind_param("i", $property_id);
        } else {
            $stmt = $this->db->prepare($query);
        }
        
        $stmt->execute();
        $result = $stmt->get_result();
        
        $units = [];
        while ($row = $result->fetch_assoc()) {
            $units[] = $row;
        }
        
        return $units;
    }

    public function getUnitById($id) {
        $query = "SELECT u.*, p.name as property_name 
                 FROM units u 
                 LEFT JOIN properties p ON u.property_id = p.id 
                 WHERE u.id = ?";
        $stmt = $this->db->prepare($query);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        return $result->fetch_assoc();
    }

    public function getUnitsByPropertyId($property_id) {
        return $this->getAllUnits($property_id);
    }

    public function createUnit($data) {
        $query = "INSERT INTO units (property_id, unit_number, type, bedrooms, bathrooms, 
                 size_sqft, rent_amount, status, description, amenities) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $this->db->prepare($query);
        $stmt->bind_param(
            "issiddsss", 
            $data['property_id'], 
            $data['unit_number'], 
            $data['type'], 
            $data['bedrooms'], 
            $data['bathrooms'], 
            $data['size_sqft'], 
            $data['rent_amount'], 
            $data['status'], 
            $data['description'], 
            $data['amenities']
        );
        
        if ($stmt->execute()) {
            return $this->db->insert_id;
        }
        
        return false;
    }

    public function updateUnit($id, $data) {
        $query = "UPDATE units SET 
                 property_id = ?, 
                 unit_number = ?, 
                 type = ?, 
                 bedrooms = ?, 
                 bathrooms = ?, 
                 size_sqft = ?, 
                 rent_amount = ?, 
                 status = ?, 
                 description = ?, 
                 amenities = ? 
                 WHERE id = ?";
        
        $stmt = $this->db->prepare($query);
        $stmt->bind_param(
            "issiddssssi", 
            $data['property_id'], 
            $data['unit_number'], 
            $data['type'], 
            $data['bedrooms'], 
            $data['bathrooms'], 
            $data['size_sqft'], 
            $data['rent_amount'], 
            $data['status'], 
            $data['description'], 
            $data['amenities'],
            $id
        );
        
        return $stmt->execute();
    }

    public function deleteUnit($id) {
        $query = "DELETE FROM units WHERE id = ?";
        $stmt = $this->db->prepare($query);
        $stmt->bind_param("i", $id);
        
        return $stmt->execute();
    }

    public function getUnitOccupancyHistory($unit_id) {
        $query = "SELECT l.*, t.first_name, t.last_name 
                 FROM leases l
                 JOIN tenants t ON l.tenant_id = t.id
                 WHERE l.unit_id = ?
                 ORDER BY l.start_date DESC";
        
        $stmt = $this->db->prepare($query);
        $stmt->bind_param("i", $unit_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $history = [];
        while ($row = $result->fetch_assoc()) {
            $history[] = $row;
        }
        
        return $history;
    }

    public function getVacantUnits() {
        $query = "SELECT u.*, p.name as property_name 
                 FROM units u 
                 LEFT JOIN properties p ON u.property_id = p.id 
                 WHERE u.status = 'vacant'";
        
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $units = [];
        while ($row = $result->fetch_assoc()) {
            $units[] = $row;
        }
        
        return $units;
    }
}
?>
