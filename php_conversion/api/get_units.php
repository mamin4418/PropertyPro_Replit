
<?php
require_once '../config/database.php';
require_once '../models/Unit.php';

header('Content-Type: application/json');

// Allow CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Get database connection
$database = new Database();
$db = $database->getConnection();

$unit = new Unit($db);

// Default response
$response = [
    'success' => false,
    'data' => [],
    'message' => 'No property ID provided'
];

// Check if property_id is provided
if (isset($_GET['property_id'])) {
    $property_id = intval($_GET['property_id']);
    
    // Get units for the property
    $result = $unit->getUnitsByProperty($property_id);
    
    if ($result) {
        $units = [];
        while ($row = $result->fetch_assoc()) {
            $units[] = $row;
        }
        
        $response = [
            'success' => true,
            'data' => $units,
            'message' => count($units) . ' units found'
        ];
    } else {
        $response['message'] = 'No units found for this property';
    }
}

echo json_encode($response);
?>
