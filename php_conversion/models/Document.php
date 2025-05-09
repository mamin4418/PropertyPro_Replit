
<?php
class Document {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function getAllDocuments() {
        $query = "SELECT d.*, p.name as property_name, t.first_name, t.last_name 
                  FROM documents d 
                  LEFT JOIN properties p ON d.property_id = p.id 
                  LEFT JOIN tenants t ON d.tenant_id = t.id 
                  ORDER BY d.created_at DESC";
        $result = $this->db->query($query);
        
        $documents = [];
        while ($row = $result->fetch_assoc()) {
            $documents[] = $row;
        }
        
        return $documents;
    }

    public function getDocumentsByPropertyId($property_id) {
        $query = "SELECT d.*, p.name as property_name, t.first_name, t.last_name 
                  FROM documents d 
                  LEFT JOIN properties p ON d.property_id = p.id 
                  LEFT JOIN tenants t ON d.tenant_id = t.id 
                  WHERE d.property_id = ? 
                  ORDER BY d.created_at DESC";
        
        $stmt = $this->db->prepare($query);
        $stmt->bind_param("i", $property_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $documents = [];
        while ($row = $result->fetch_assoc()) {
            $documents[] = $row;
        }
        
        return $documents;
    }

    public function getDocumentsByTenantId($tenant_id) {
        $query = "SELECT d.*, p.name as property_name, t.first_name, t.last_name 
                  FROM documents d 
                  LEFT JOIN properties p ON d.property_id = p.id 
                  LEFT JOIN tenants t ON d.tenant_id = t.id 
                  WHERE d.tenant_id = ? 
                  ORDER BY d.created_at DESC";
        
        $stmt = $this->db->prepare($query);
        $stmt->bind_param("i", $tenant_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $documents = [];
        while ($row = $result->fetch_assoc()) {
            $documents[] = $row;
        }
        
        return $documents;
    }

    public function getDocumentById($id) {
        $query = "SELECT d.*, p.name as property_name, t.first_name, t.last_name 
                  FROM documents d 
                  LEFT JOIN properties p ON d.property_id = p.id 
                  LEFT JOIN tenants t ON d.tenant_id = t.id 
                  WHERE d.id = ?";
        
        $stmt = $this->db->prepare($query);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        return $result->fetch_assoc();
    }

    public function addDocument($data) {
        $query = "INSERT INTO documents (title, document_type, file_path, property_id, tenant_id, description, status) 
                  VALUES (?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $this->db->prepare($query);
        $stmt->bind_param("sssiiis", 
            $data['title'], 
            $data['document_type'], 
            $data['file_path'], 
            $data['property_id'], 
            $data['tenant_id'], 
            $data['description'], 
            $data['status']
        );
        
        if ($stmt->execute()) {
            return $this->db->insert_id;
        } else {
            return false;
        }
    }

    public function updateDocument($id, $data) {
        $query = "UPDATE documents 
                  SET title = ?, document_type = ?, file_path = ?, property_id = ?, 
                      tenant_id = ?, description = ?, status = ? 
                  WHERE id = ?";
        
        $stmt = $this->db->prepare($query);
        $stmt->bind_param("sssiiisi", 
            $data['title'], 
            $data['document_type'], 
            $data['file_path'], 
            $data['property_id'], 
            $data['tenant_id'], 
            $data['description'], 
            $data['status'],
            $id
        );
        
        return $stmt->execute();
    }

    public function deleteDocument($id) {
        $query = "DELETE FROM documents WHERE id = ?";
        $stmt = $this->db->prepare($query);
        $stmt->bind_param("i", $id);
        return $stmt->execute();
    }

    public function updateDocumentStatus($id, $status) {
        $query = "UPDATE documents SET status = ? WHERE id = ?";
        $stmt = $this->db->prepare($query);
        $stmt->bind_param("si", $status, $id);
        return $stmt->execute();
    }

    public function getDocumentsByType($document_type) {
        $query = "SELECT d.*, p.name as property_name, t.first_name, t.last_name 
                  FROM documents d 
                  LEFT JOIN properties p ON d.property_id = p.id 
                  LEFT JOIN tenants t ON d.tenant_id = t.id 
                  WHERE d.document_type = ? 
                  ORDER BY d.created_at DESC";
        
        $stmt = $this->db->prepare($query);
        $stmt->bind_param("s", $document_type);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $documents = [];
        while ($row = $result->fetch_assoc()) {
            $documents[] = $row;
        }
        
        return $documents;
    }
}
?>
