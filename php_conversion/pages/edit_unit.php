
<?php
require_once '../database/init.php';
require_once '../models/Unit.php';
require_once '../models/Property.php';
require_once '../includes/functions.php';

// Check if user is logged in
session_start();
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

// Check if unit ID is provided
if (!isset($_GET['id']) || empty($_GET['id'])) {
    header("Location: units.php");
    exit();
}

$unit_id = $_GET['id'];

// Initialize models
$unitModel = new Unit($conn);
$propertyModel = new Property($conn);

// Get unit details
$unit = $unitModel->getUnitById($unit_id);

if (!$unit) {
    $_SESSION['error_message'] = "Unit not found";
    header("Location: units.php");
    exit();
}

// Get all properties for dropdown
$properties = $propertyModel->getAllProperties();

// Initialize form errors array
$errors = [];

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Validate input
    $property_id = trim($_POST['property_id']);
    $unit_number = trim($_POST['unit_number']);
    $type = trim($_POST['type']);
    $bedrooms = trim($_POST['bedrooms']);
    $bathrooms = trim($_POST['bathrooms']);
    $size_sqft = trim($_POST['size_sqft']);
    $rent_amount = trim($_POST['rent_amount']);
    $status = trim($_POST['status']);
    $description = trim($_POST['description']);
    
    // Collect amenities
    $amenities_array = isset($_POST['amenities']) ? $_POST['amenities'] : [];
    $amenities = json_encode($amenities_array);
    
    // Basic validation
    if (empty($property_id)) {
        $errors[] = "Property is required";
    }
    if (empty($unit_number)) {
        $errors[] = "Unit number is required";
    }
    if (empty($type)) {
        $errors[] = "Unit type is required";
    }
    
    // If no errors, update the unit
    if (empty($errors)) {
        $unit_data = [
            'property_id' => $property_id,
            'unit_number' => $unit_number,
            'type' => $type,
            'bedrooms' => $bedrooms,
            'bathrooms' => $bathrooms,
            'size_sqft' => $size_sqft,
            'rent_amount' => $rent_amount,
            'status' => $status,
            'description' => $description,
            'amenities' => $amenities
        ];
        
        if ($unitModel->updateUnit($unit_id, $unit_data)) {
            $_SESSION['success_message'] = "Unit updated successfully";
            header("Location: view_unit.php?id=" . $unit_id);
            exit();
        } else {
            $errors[] = "Failed to update unit";
        }
    }
} else {
    // Pre-populate form with existing unit data
    $amenities_array = json_decode($unit['amenities'], true) ?: [];
}

// Page title
$pageTitle = "Edit Unit";
require_once '../includes/header.php';
?>

<div class="container-fluid">
    <h1 class="h3 mb-4 text-gray-800">Edit Unit</h1>
    
    <?php if (!empty($errors)): ?>
        <div class="alert alert-danger">
            <ul class="mb-0">
                <?php foreach ($errors as $error): ?>
                    <li><?= $error ?></li>
                <?php endforeach; ?>
            </ul>
        </div>
    <?php endif; ?>
    
    <div class="card shadow mb-4">
        <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">Unit Information</h6>
        </div>
        <div class="card-body">
            <form method="POST" action="edit_unit.php?id=<?= $unit_id ?>">
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="property_id">Property <span class="text-danger">*</span></label>
                            <select class="form-control" id="property_id" name="property_id" required>
                                <option value="">Select Property</option>
                                <?php foreach ($properties as $property): ?>
                                    <option value="<?= $property['id'] ?>" <?= ($unit['property_id'] == $property['id']) ? 'selected' : '' ?>>
                                        <?= htmlspecialchars($property['name']) ?>
                                    </option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="unit_number">Unit Number <span class="text-danger">*</span></label>
                            <input type="text" class="form-control" id="unit_number" name="unit_number" 
                                   value="<?= htmlspecialchars($unit['unit_number']) ?>" required>
                        </div>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-md-4">
                        <div class="form-group">
                            <label for="type">Unit Type <span class="text-danger">*</span></label>
                            <select class="form-control" id="type" name="type" required>
                                <option value="">Select Type</option>
                                <option value="Studio" <?= ($unit['type'] == 'Studio') ? 'selected' : '' ?>>Studio</option>
                                <option value="Apartment" <?= ($unit['type'] == 'Apartment') ? 'selected' : '' ?>>Apartment</option>
                                <option value="Condo" <?= ($unit['type'] == 'Condo') ? 'selected' : '' ?>>Condo</option>
                                <option value="House" <?= ($unit['type'] == 'House') ? 'selected' : '' ?>>House</option>
                                <option value="Townhouse" <?= ($unit['type'] == 'Townhouse') ? 'selected' : '' ?>>Townhouse</option>
                                <option value="Duplex" <?= ($unit['type'] == 'Duplex') ? 'selected' : '' ?>>Duplex</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-group">
                            <label for="bedrooms">Bedrooms</label>
                            <input type="number" class="form-control" id="bedrooms" name="bedrooms" min="0" 
                                   value="<?= htmlspecialchars($unit['bedrooms']) ?>">
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-group">
                            <label for="bathrooms">Bathrooms</label>
                            <input type="number" class="form-control" id="bathrooms" name="bathrooms" min="0" step="0.5" 
                                   value="<?= htmlspecialchars($unit['bathrooms']) ?>">
                        </div>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-md-4">
                        <div class="form-group">
                            <label for="size_sqft">Size (sq ft)</label>
                            <input type="number" class="form-control" id="size_sqft" name="size_sqft" min="0" 
                                   value="<?= htmlspecialchars($unit['size_sqft']) ?>">
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-group">
                            <label for="rent_amount">Monthly Rent ($)</label>
                            <input type="number" class="form-control" id="rent_amount" name="rent_amount" min="0" step="0.01" 
                                   value="<?= htmlspecialchars($unit['rent_amount']) ?>">
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-group">
                            <label for="status">Status</label>
                            <select class="form-control" id="status" name="status">
                                <option value="vacant" <?= ($unit['status'] == 'vacant') ? 'selected' : '' ?>>Vacant</option>
                                <option value="occupied" <?= ($unit['status'] == 'occupied') ? 'selected' : '' ?>>Occupied</option>
                                <option value="maintenance" <?= ($unit['status'] == 'maintenance') ? 'selected' : '' ?>>Under Maintenance</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="description">Description</label>
                    <textarea class="form-control" id="description" name="description" rows="3"><?= htmlspecialchars($unit['description']) ?></textarea>
                </div>
                
                <div class="form-group">
                    <label>Amenities</label>
                    <div class="row">
                        <div class="col-md-3">
                            <div class="custom-control custom-checkbox mb-2">
                                <input type="checkbox" class="custom-control-input" id="amenity_parking" name="amenities[]" value="Parking"
                                       <?= (in_array('Parking', $amenities_array)) ? 'checked' : '' ?>>
                                <label class="custom-control-label" for="amenity_parking">Parking</label>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="custom-control custom-checkbox mb-2">
                                <input type="checkbox" class="custom-control-input" id="amenity_pool" name="amenities[]" value="Pool"
                                       <?= (in_array('Pool', $amenities_array)) ? 'checked' : '' ?>>
                                <label class="custom-control-label" for="amenity_pool">Pool</label>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="custom-control custom-checkbox mb-2">
                                <input type="checkbox" class="custom-control-input" id="amenity_gym" name="amenities[]" value="Gym"
                                       <?= (in_array('Gym', $amenities_array)) ? 'checked' : '' ?>>
                                <label class="custom-control-label" for="amenity_gym">Gym</label>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="custom-control custom-checkbox mb-2">
                                <input type="checkbox" class="custom-control-input" id="amenity_elevator" name="amenities[]" value="Elevator"
                                       <?= (in_array('Elevator', $amenities_array)) ? 'checked' : '' ?>>
                                <label class="custom-control-label" for="amenity_elevator">Elevator</label>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="custom-control custom-checkbox mb-2">
                                <input type="checkbox" class="custom-control-input" id="amenity_laundry" name="amenities[]" value="Laundry"
                                       <?= (in_array('Laundry', $amenities_array)) ? 'checked' : '' ?>>
                                <label class="custom-control-label" for="amenity_laundry">Laundry</label>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="custom-control custom-checkbox mb-2">
                                <input type="checkbox" class="custom-control-input" id="amenity_ac" name="amenities[]" value="A/C"
                                       <?= (in_array('A/C', $amenities_array)) ? 'checked' : '' ?>>
                                <label class="custom-control-label" for="amenity_ac">A/C</label>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="custom-control custom-checkbox mb-2">
                                <input type="checkbox" class="custom-control-input" id="amenity_furnished" name="amenities[]" value="Furnished"
                                       <?= (in_array('Furnished', $amenities_array)) ? 'checked' : '' ?>>
                                <label class="custom-control-label" for="amenity_furnished">Furnished</label>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="custom-control custom-checkbox mb-2">
                                <input type="checkbox" class="custom-control-input" id="amenity_security" name="amenities[]" value="Security"
                                       <?= (in_array('Security', $amenities_array)) ? 'checked' : '' ?>>
                                <label class="custom-control-label" for="amenity_security">Security System</label>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="mt-4">
                    <button type="submit" class="btn btn-primary">Update Unit</button>
                    <a href="view_unit.php?id=<?= $unit_id ?>" class="btn btn-secondary">Cancel</a>
                </div>
            </form>
        </div>
    </div>
</div>

<?php
require_once '../includes/footer.php';
?>
