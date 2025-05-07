
<?php
class Tenant {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    // Get all tenants
    public function getAll() {
        $query = "SELECT t.*, c.first_name, c.last_name, c.email, c.phone 
                  FROM tenants t
                  JOIN contacts c ON t.contact_id = c.id";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }

    // Get tenant by ID
    public function getById($id) {
        $query = "SELECT t.*, c.first_name, c.last_name, c.email, c.phone 
                  FROM tenants t
                  JOIN contacts c ON t.contact_id = c.id
                  WHERE t.id = ?";
        $stmt = $this->db->prepare($query);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        
        return $stmt->get_result()->fetch_assoc();
    }

    // Create a new tenant
    public function create($contactData, $tenantData) {
        // First create or update contact
        $contactId = $this->createOrUpdateContact($contactData);
        
        if (!$contactId) {
            return false;
        }
        
        // Then create tenant with contact_id
        $query = "INSERT INTO tenants (
            contact_id, date_of_birth, ssn, driver_license, employer_name, 
            employer_phone, income, emergency_contact_name, 
            emergency_contact_phone, emergency_contact_relationship, type, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $this->db->prepare($query);
        $stmt->bind_param(
            "issssdsssss",
            $contactId,
            $tenantData['date_of_birth'],
            $tenantData['ssn'],
            $tenantData['driver_license'],
            $tenantData['employer_name'],
            $tenantData['employer_phone'],
            $tenantData['income'],
            $tenantData['emergency_contact_name'],
            $tenantData['emergency_contact_phone'],
            $tenantData['emergency_contact_relationship'],
            $tenantData['type'],
            $tenantData['status']
        );
        
        if ($stmt->execute()) {
            return $this->db->insert_id;
        } else {
            return false;
        }
    }

    // Create or update a contact
    private function createOrUpdateContact($data) {
        // Check if contact already exists
        if (isset($data['contact_id']) && $data['contact_id'] > 0) {
            $query = "UPDATE contacts SET
                first_name = ?,
                last_name = ?,
                email = ?,
                phone = ?,
                alternate_phone = ?,
                notes = ?
                WHERE id = ?";
                
            $stmt = $this->db->prepare($query);
            $stmt->bind_param(
                "ssssssi",
                $data['first_name'],
                $data['last_name'],
                $data['email'],
                $data['phone'],
                $data['alternate_phone'],
                $data['notes'],
                $data['contact_id']
            );
            
            if ($stmt->execute()) {
                return $data['contact_id'];
            } else {
                return false;
            }
        } else {
            // Create new contact
            $query = "INSERT INTO contacts (
                first_name, last_name, email, phone, alternate_phone, 
                notes, contact_type, status
            ) VALUES (?, ?, ?, ?, ?, ?, 'tenant', 'active')";
            
            $stmt = $this->db->prepare($query);
            $stmt->bind_param(
                "ssssss",
                $data['first_name'],
                $data['last_name'],
                $data['email'],
                $data['phone'],
                $data['alternate_phone'],
                $data['notes']
            );
            
            if ($stmt->execute()) {
                return $this->db->insert_id;
            } else {
                return false;
            }
        }
    }

    // Update tenant
    public function update($id, $contactData, $tenantData) {
        // First update contact
        if (!$this->createOrUpdateContact($contactData)) {
            return false;
        }
        
        // Then update tenant
        $query = "UPDATE tenants SET
            date_of_birth = ?,
            ssn = ?,
            driver_license = ?,
            employer_name = ?,
            employer_phone = ?,
            income = ?,
            emergency_contact_name = ?,
            emergency_contact_phone = ?,
            emergency_contact_relationship = ?,
            type = ?,
            status = ?
            WHERE id = ?";
            
        $stmt = $this->db->prepare($query);
        $stmt->bind_param(
            "sssssdssssi",
            $tenantData['date_of_birth'],
            $tenantData['ssn'],
            $tenantData['driver_license'],
            $tenantData['employer_name'],
            $tenantData['employer_phone'],
            $tenantData['income'],
            $tenantData['emergency_contact_name'],
            $tenantData['emergency_contact_phone'],
            $tenantData['emergency_contact_relationship'],
            $tenantData['type'],
            $tenantData['status'],
            $id
        );
        
        return $stmt->execute();
    }

    // Delete tenant
    public function delete($id) {
        // Get contact_id first
        $query = "SELECT contact_id FROM tenants WHERE id = ?";
        $stmt = $this->db->prepare($query);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();
        $contactId = $result ? $result['contact_id'] : null;
        
        // Delete tenant
        $query = "DELETE FROM tenants WHERE id = ?";
        $stmt = $this->db->prepare($query);
        $stmt->bind_param("i", $id);
        $tenantDeleted = $stmt->execute();
        
        // Delete associated contact
        if ($tenantDeleted && $contactId) {
            $query = "DELETE FROM contacts WHERE id = ?";
            $stmt = $this->db->prepare($query);
            $stmt->bind_param("i", $contactId);
            return $stmt->execute();
        }
        
        return $tenantDeleted;
    }

    // Get tenants by unit
    public function getByUnit($unitId) {
        $query = "SELECT t.*, c.first_name, c.last_name, c.email, c.phone 
                  FROM tenants t
                  JOIN contacts c ON t.contact_id = c.id
                  JOIN leases l ON t.id = l.tenant_id
                  WHERE l.unit_id = ? AND l.status = 'active'";
        $stmt = $this->db->prepare($query);
        $stmt->bind_param("i", $unitId);
        $stmt->execute();
        
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }
}
?>
