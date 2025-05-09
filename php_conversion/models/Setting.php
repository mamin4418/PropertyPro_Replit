
<?php
class Setting {
    private $conn;
    
    public function __construct($db) {
        $this->conn = $db;
    }
    
    public function getAllSettings() {
        $query = "SELECT * FROM settings ORDER BY setting_group, setting_key";
        $result = $this->conn->query($query);
        
        $settings = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $settings[] = $row;
            }
        }
        
        return $settings;
    }
    
    public function getSettingsByGroup($group) {
        $query = "SELECT * FROM settings WHERE setting_group = ? ORDER BY setting_key";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("s", $group);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $settings = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $settings[] = $row;
            }
        }
        
        return $settings;
    }
    
    public function getSettingByKey($key) {
        $query = "SELECT * FROM settings WHERE setting_key = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("s", $key);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result && $result->num_rows > 0) {
            return $result->fetch_assoc();
        }
        
        return false;
    }
    
    public function getSettingValue($key, $default = null) {
        $setting = $this->getSettingByKey($key);
        
        if ($setting) {
            return $setting['setting_value'];
        }
        
        return $default;
    }
    
    public function setSetting($key, $value) {
        $setting = $this->getSettingByKey($key);
        
        if ($setting) {
            // Update existing setting
            $query = "UPDATE settings SET setting_value = ? WHERE setting_key = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param("ss", $value, $key);
            
            return $stmt->execute();
        } else {
            // This should not happen as all settings should be pre-defined
            // Consider using createSetting for new settings
            return false;
        }
    }
    
    public function createSetting($key, $value, $group, $type, $description = null) {
        // Check if setting already exists
        if ($this->getSettingByKey($key)) {
            return false;
        }
        
        $query = "INSERT INTO settings (setting_key, setting_value, setting_group, setting_type, description) 
                 VALUES (?, ?, ?, ?, ?)";
                 
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("sssss", $key, $value, $group, $type, $description);
        
        if ($stmt->execute()) {
            return $this->conn->insert_id;
        }
        
        return false;
    }
    
    public function deleteSetting($key) {
        $query = "DELETE FROM settings WHERE setting_key = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("s", $key);
        
        return $stmt->execute();
    }
    
    public function getSettings() {
        $settings = $this->getAllSettings();
        
        // Reorganize settings by group
        $grouped_settings = [];
        foreach ($settings as $setting) {
            $group = $setting['setting_group'];
            
            if (!isset($grouped_settings[$group])) {
                $grouped_settings[$group] = [];
            }
            
            $grouped_settings[$group][$setting['setting_key']] = $setting['setting_value'];
        }
        
        return $grouped_settings;
    }
    
    public function updateSettings($settings_data) {
        // Start transaction
        $this->conn->begin_transaction();
        
        try {
            foreach ($settings_data as $key => $value) {
                $this->setSetting($key, $value);
            }
            
            // Commit transaction
            $this->conn->commit();
            
            return true;
        } catch (Exception $e) {
            // Rollback on error
            $this->conn->rollback();
            return false;
        }
    }
}
?>
