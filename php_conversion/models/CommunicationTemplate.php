
<?php
class CommunicationTemplate {
    private $conn;
    
    public function __construct($db) {
        $this->conn = $db;
    }
    
    public function getAllTemplates() {
        $query = "SELECT * FROM communication_templates ORDER BY name";
        $result = $this->conn->query($query);
        
        $templates = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $templates[] = $row;
            }
        }
        
        return $templates;
    }
    
    public function getActiveTemplates() {
        $query = "SELECT * FROM communication_templates WHERE active = 1 ORDER BY name";
        $result = $this->conn->query($query);
        
        $templates = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $templates[] = $row;
            }
        }
        
        return $templates;
    }
    
    public function getTemplatesByType($type) {
        $query = "SELECT * FROM communication_templates WHERE template_type = ? AND active = 1 ORDER BY name";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("s", $type);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $templates = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $templates[] = $row;
            }
        }
        
        return $templates;
    }
    
    public function getTemplateById($id) {
        $id = intval($id);
        
        $query = "SELECT * FROM communication_templates WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result && $result->num_rows > 0) {
            return $result->fetch_assoc();
        }
        
        return false;
    }
    
    public function createTemplate($name, $template_type, $subject, $body, $placeholders = null) {
        $query = "INSERT INTO communication_templates (name, template_type, subject, body, placeholders) 
                 VALUES (?, ?, ?, ?, ?)";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("sssss", $name, $template_type, $subject, $body, $placeholders);
        
        if ($stmt->execute()) {
            return $this->conn->insert_id;
        }
        
        return false;
    }
    
    public function updateTemplate($id, $name, $template_type, $subject, $body, $placeholders = null, $active = 1) {
        $id = intval($id);
        $active = intval($active);
        
        $query = "UPDATE communication_templates SET 
                 name = ?, template_type = ?, subject = ?, body = ?, 
                 placeholders = ?, active = ? 
                 WHERE id = ?";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("sssssii", $name, $template_type, $subject, $body, $placeholders, $active, $id);
        
        return $stmt->execute();
    }
    
    public function deleteTemplate($id) {
        $id = intval($id);
        
        $query = "DELETE FROM communication_templates WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $id);
        
        return $stmt->execute();
    }
    
    public function renderTemplate($template_id, $placeholders_data) {
        $template = $this->getTemplateById($template_id);
        
        if (!$template) {
            return false;
        }
        
        $subject = $template['subject'];
        $body = $template['body'];
        
        // Replace placeholders in subject and body
        foreach ($placeholders_data as $key => $value) {
            $subject = str_replace('{{' . $key . '}}', $value, $subject);
            $body = str_replace('{{' . $key . '}}', $value, $body);
        }
        
        return [
            'subject' => $subject,
            'body' => $body
        ];
    }
}
?>
