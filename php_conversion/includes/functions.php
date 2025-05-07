
<?php
// Helper functions for the application

/**
 * Sanitize user inputs
 */
function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

/**
 * Generate a random token
 */
function generate_token($length = 32) {
    return bin2hex(random_bytes($length));
}

/**
 * Check if user has permission for a specific action
 */
function has_permission($permission) {
    if (!isset($_SESSION['user_role'])) {
        return false;
    }
    
    // Admin has all permissions
    if ($_SESSION['user_role'] === 'admin') {
        return true;
    }
    
    // Get database connection
    $mysqli = require __DIR__ . '/../config/database.php';
    
    // Get user permissions
    $sql = "SELECT p.permission_name FROM user_permissions up
            JOIN permissions p ON up.permission_id = p.id
            WHERE up.user_id = ?";
    
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param("i", $_SESSION['user_id']);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $permissions = [];
    while ($row = $result->fetch_assoc()) {
        $permissions[] = $row['permission_name'];
    }
    
    return in_array($permission, $permissions);
}

/**
 * Format currency values
 */
function format_currency($amount) {
    return '$' . number_format($amount, 2);
}

/**
 * Format date values
 */
function format_date($date, $format = 'Y-m-d') {
    return date($format, strtotime($date));
}

/**
 * Get property by ID
 */
function get_property($property_id) {
    $mysqli = require __DIR__ . '/../config/database.php';
    
    $stmt = $mysqli->prepare("SELECT * FROM properties WHERE id = ?");
    $stmt->bind_param("i", $property_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    return $result->fetch_assoc();
}

/**
 * Get unit by ID
 */
function get_unit($unit_id) {
    $mysqli = require __DIR__ . '/../config/database.php';
    
    $stmt = $mysqli->prepare("SELECT * FROM units WHERE id = ?");
    $stmt->bind_param("i", $unit_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    return $result->fetch_assoc();
}

/**
 * Get contact by ID
 */
function get_contact($contact_id) {
    $mysqli = require __DIR__ . '/../config/database.php';
    
    $stmt = $mysqli->prepare("SELECT * FROM contacts WHERE id = ?");
    $stmt->bind_param("i", $contact_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    return $result->fetch_assoc();
}

/**
 * Generate pagination links
 */
function generate_pagination($current_page, $total_pages, $url_pattern) {
    $links = '';
    
    if ($total_pages <= 1) {
        return $links;
    }
    
    $links .= '<ul class="pagination">';
    
    // Previous link
    if ($current_page > 1) {
        $links .= '<li><a href="' . sprintf($url_pattern, $current_page - 1) . '">Previous</a></li>';
    } else {
        $links .= '<li class="disabled"><a>Previous</a></li>';
    }
    
    // Page numbers
    $range = 2;
    for ($i = max(1, $current_page - $range); $i <= min($total_pages, $current_page + $range); $i++) {
        if ($i == $current_page) {
            $links .= '<li class="active"><a>' . $i . '</a></li>';
        } else {
            $links .= '<li><a href="' . sprintf($url_pattern, $i) . '">' . $i . '</a></li>';
        }
    }
    
    // Next link
    if ($current_page < $total_pages) {
        $links .= '<li><a href="' . sprintf($url_pattern, $current_page + 1) . '">Next</a></li>';
    } else {
        $links .= '<li class="disabled"><a>Next</a></li>';
    }
    
    $links .= '</ul>';
    
    return $links;
}
?>
