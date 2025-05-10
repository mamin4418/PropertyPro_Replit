<?php
/**
 * CommunicationTemplate Model
 * 
 * This class handles all operations related to communication templates
 * used for emails, SMS, and other communication types.
 */
class CommunicationTemplate {
    private $db;
    
    /**
     * Constructor - Initialize database connection
     */
    public function __construct($db) {
        $this->db = $db;
    }
    
    /**
     * Get all communication templates
     * 
     * @param string|null $type Filter templates by type (email, sms, etc.)
     * @return array Array of templates
     */
    public function getAllTemplates($type = null) {
        try {
            $sql = "SELECT * FROM communication_templates";
            $params = [];
            $types = "";
            
            if ($type) {
                $sql .= " WHERE type = ?";
                $params[] = $type;
                $types = "s";
            }
            
            $sql .= " ORDER BY name ASC";
            
            $stmt = $this->db->prepare($sql);
            
            if (!empty($params)) {
                $stmt->bind_param($types, ...$params);
            }
            
            $stmt->execute();
            $result = $stmt->get_result();
            
            $templates = [];
            while ($row = $result->fetch_assoc()) {
                $templates[] = $row;
            }
            
            return $templates;
        } catch (Exception $e) {
            error_log("Error retrieving templates: " . $e->getMessage());
            return [];
        }
    }
    
    /**
     * Get a template by ID
     * 
     * @param int $id Template ID
     * @return array|false Template data or false if not found
     */
    public function getTemplateById($id) {
        try {
            $stmt = $this->db->prepare("SELECT * FROM communication_templates WHERE id = ?");
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($result->num_rows === 0) {
                return false;
            }
            
            return $result->fetch_assoc();
        } catch (Exception $e) {
            error_log("Error retrieving template: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Create a new template
     * 
     * @param array $data Template data
     * @return int|false ID of the new template or false on failure
     */
    public function createTemplate($data) {
        try {
            $stmt = $this->db->prepare("
                INSERT INTO communication_templates (
                    name, type, subject, content, variables, 
                    created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
            ");
            
            $now = date('Y-m-d H:i:s');
            
            // Convert variables array to JSON if it's an array
            $variables = is_array($data['variables']) ? json_encode($data['variables']) : $data['variables'];
            
            $stmt->bind_param(
                "sssssss",
                $data['name'],
                $data['type'],
                $data['subject'],
                $data['content'],
                $variables,
                $now,
                $now
            );
            
            $stmt->execute();
            
            if ($stmt->affected_rows > 0) {
                return $this->db->insert_id;
            }
            
            return false;
        } catch (Exception $e) {
            error_log("Error creating template: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Update an existing template
     * 
     * @param int $id Template ID
     * @param array $data Updated template data
     * @return bool Success or failure
     */
    public function updateTemplate($id, $data) {
        try {
            $stmt = $this->db->prepare("
                UPDATE communication_templates SET
                    name = ?,
                    type = ?,
                    subject = ?,
                    content = ?,
                    variables = ?,
                    updated_at = ?
                WHERE id = ?
            ");
            
            $now = date('Y-m-d H:i:s');
            
            // Convert variables array to JSON if it's an array
            $variables = is_array($data['variables']) ? json_encode($data['variables']) : $data['variables'];
            
            $stmt->bind_param(
                "ssssssi",
                $data['name'],
                $data['type'],
                $data['subject'],
                $data['content'],
                $variables,
                $now,
                $id
            );
            
            $stmt->execute();
            
            return $stmt->affected_rows > 0;
        } catch (Exception $e) {
            error_log("Error updating template: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Delete a template
     * 
     * @param int $id Template ID
     * @return bool Success or failure
     */
    public function deleteTemplate($id) {
        try {
            $stmt = $this->db->prepare("DELETE FROM communication_templates WHERE id = ?");
            $stmt->bind_param("i", $id);
            $stmt->execute();
            
            return $stmt->affected_rows > 0;
        } catch (Exception $e) {
            error_log("Error deleting template: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Render a template with variables
     * 
     * @param int $template_id Template ID
     * @param array $variables Variables to replace in the template
     * @return array|false Rendered template with subject and content, or false on failure
     */
    public function renderTemplate($template_id, $variables = []) {
        try {
            $template = $this->getTemplateById($template_id);
            
            if (!$template) {
                return false;
            }
            
            $subject = $template['subject'];
            $content = $template['content'];
            
            // Replace variables in subject and content
            foreach ($variables as $key => $value) {
                $placeholder = "{{" . $key . "}}";
                $subject = str_replace($placeholder, $value, $subject);
                $content = str_replace($placeholder, $value, $content);
            }
            
            return [
                'subject' => $subject,
                'content' => $content,
                'type' => $template['type']
            ];
        } catch (Exception $e) {
            error_log("Error rendering template: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Get template statistics
     * 
     * @return array Template statistics
     */
    public function getTemplateStats() {
        try {
            $stats = [
                'total' => 0,
                'email' => 0,
                'sms' => 0,
                'letter' => 0
            ];
            
            // Get total count
            $stmt = $this->db->prepare("SELECT COUNT(*) as count FROM communication_templates");
            $stmt->execute();
            $result = $stmt->get_result();
            $row = $result->fetch_assoc();
            $stats['total'] = $row['count'];
            
            // Get counts by type
            $stmt = $this->db->prepare("SELECT type, COUNT(*) as count FROM communication_templates GROUP BY type");
            $stmt->execute();
            $result = $stmt->get_result();
            
            while ($row = $result->fetch_assoc()) {
                $stats[$row['type']] = $row['count'];
            }
            
            return $stats;
        } catch (Exception $e) {
            error_log("Error retrieving template stats: " . $e->getMessage());
            return [
                'total' => 0,
                'email' => 0,
                'sms' => 0,
                'letter' => 0
            ];
        }
    }
}