
<?php
class Property {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    // Get all properties
    public function getAll() {
        $query = "SELECT * FROM properties";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }

    // Get property by ID
    public function getById($id) {
        $query = "SELECT * FROM properties WHERE id = ?";
        $stmt = $this->db->prepare($query);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        
        return $stmt->get_result()->fetch_assoc();
    }

    // Create a new property
    public function create($data) {
        $query = "INSERT INTO properties (
            company_id, name, description, type, address, city, state, zipcode, 
            country, total_units, size, year_built, purchase_price, purchase_date, 
            mortgage_amount, property_tax, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $this->db->prepare($query);
        $stmt->bind_param(
            "issssssssididsds",
            $data['company_id'],
            $data['name'],
            $data['description'],
            $data['type'],
            $data['address'],
            $data['city'],
            $data['state'],
            $data['zipcode'],
            $data['country'],
            $data['total_units'],
            $data['size'],
            $data['year_built'],
            $data['purchase_price'],
            $data['purchase_date'],
            $data['mortgage_amount'],
            $data['property_tax'],
            $data['status']
        );
        
        if ($stmt->execute()) {
            return $this->db->insert_id;
        } else {
            return false;
        }
    }

    // Update property
    public function update($id, $data) {
        $query = "UPDATE properties SET 
            company_id = ?, 
            name = ?, 
            description = ?, 
            type = ?, 
            address = ?, 
            city = ?, 
            state = ?, 
            zipcode = ?, 
            country = ?, 
            total_units = ?, 
            size = ?, 
            year_built = ?, 
            purchase_price = ?, 
            purchase_date = ?, 
            mortgage_amount = ?, 
            property_tax = ?, 
            status = ? 
            WHERE id = ?";
        
        $stmt = $this->db->prepare($query);
        $stmt->bind_param(
            "issssssssididsdssi",
            $data['company_id'],
            $data['name'],
            $data['description'],
            $data['type'],
            $data['address'],
            $data['city'],
            $data['state'],
            $data['zipcode'],
            $data['country'],
            $data['total_units'],
            $data['size'],
            $data['year_built'],
            $data['purchase_price'],
            $data['purchase_date'],
            $data['mortgage_amount'],
            $data['property_tax'],
            $data['status'],
            $id
        );
        
        return $stmt->execute();
    }

    // Delete property
    public function delete($id) {
        $query = "DELETE FROM properties WHERE id = ?";
        $stmt = $this->db->prepare($query);
        $stmt->bind_param("i", $id);
        
        return $stmt->execute();
    }

    // Get properties with stats
    public function getPropertiesWithStats() {
        $query = "SELECT 
            p.*, 
            COUNT(DISTINCT u.id) as unit_count,
            SUM(CASE WHEN u.status = 'occupied' THEN 1 ELSE 0 END) as occupied_units,
            SUM(CASE WHEN u.status = 'vacant' THEN 1 ELSE 0 END) as vacant_units
        FROM 
            properties p
        LEFT JOIN 
            units u ON p.id = u.property_id
        GROUP BY 
            p.id";
            
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }
}
?>
