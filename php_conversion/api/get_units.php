
<?php
require_once '../config/database.php';
require_once '../models/Unit.php';

// Set content type to JSON
header('Content-Type: application/json');

// Check if property_id is provided
if (!isset($_GET['property_id']) || empty($_GET['property_id'])) {
    echo json_encode(['error' => 'Property ID is required']);
    exit;
}

$propertyId = (int)$_GET['property_id'];

// Get units for the property
$unit = new Unit($mysqli);
$units = $unit->getUnitsByProperty($propertyId);

// Return the units as JSON
echo json_encode($units);
?>
