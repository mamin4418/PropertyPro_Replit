
<?php
require_once '../config/database.php';
require_once '../models/Inspection.php';
require_once '../models/Property.php';
require_once '../models/Unit.php';
require_once '../includes/functions.php';

// Initialize the database connection
$database = new Database();
$db = $database->getConnection();

// Initialize models
$inspection = new Inspection($db);
$property = new Property($db);
$unit = new Unit($db);

// Get all properties for the dropdown
$propertiesResult = $property->getAllProperties();
$properties = [];
while ($row = $propertiesResult->fetch_assoc()) {
    $properties[] = $row;
}

$errorMsg = '';
$successMsg = '';

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Validate and sanitize input
    $property_id = isset($_POST['property_id']) ? intval($_POST['property_id']) : 0;
    $unit_id = isset($_POST['unit_id']) ? intval($_POST['unit_id']) : null;
    $type = isset($_POST['type']) ? $_POST['type'] : '';
    $scheduled_date = isset($_POST['scheduled_date']) ? $_POST['scheduled_date'] : '';
    $inspector_name = isset($_POST['inspector_name']) ? $_POST['inspector_name'] : '';
    $notes = isset($_POST['notes']) ? $_POST['notes'] : '';
    
    // Basic validation
    if ($property_id === 0) {
        $errorMsg = 'Please select a property.';
    } elseif (empty($type)) {
        $errorMsg = 'Please select an inspection type.';
    } elseif (empty($scheduled_date)) {
        $errorMsg = 'Please select a scheduled date.';
    } elseif (empty($inspector_name)) {
        $errorMsg = 'Please enter the inspector name.';
    } else {
        // Create new inspection
        $result = $inspection->createInspection($property_id, $unit_id, $type, $scheduled_date, $inspector_name, $notes);
        
        if ($result) {
            $successMsg = 'Inspection scheduled successfully!';
            // Reset form
            $property_id = 0;
            $unit_id = null;
            $type = '';
            $scheduled_date = '';
            $inspector_name = '';
            $notes = '';
        } else {
            $errorMsg = 'Error scheduling inspection. Please try again.';
        }
    }
}

// Set page title
$pageTitle = "Schedule Inspection";
include_once '../includes/header.php';
?>

<div class="container-fluid">
    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 class="h2"><?php echo $pageTitle; ?></h1>
        <div class="btn-toolbar mb-2 mb-md-0">
            <a href="inspections.php" class="btn btn-sm btn-outline-secondary">
                <i class="fas fa-arrow-left"></i> Back to Inspections
            </a>
        </div>
    </div>

    <?php if (!empty($errorMsg)): ?>
        <div class="alert alert-danger"><?php echo $errorMsg; ?></div>
    <?php endif; ?>
    
    <?php if (!empty($successMsg)): ?>
        <div class="alert alert-success"><?php echo $successMsg; ?></div>
    <?php endif; ?>

    <div class="row">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">
                    <h5 class="card-title mb-0">Schedule a New Inspection</h5>
                </div>
                <div class="card-body">
                    <form action="<?php echo htmlspecialchars($_SERVER['PHP_SELF']); ?>" method="post">
                        <div class="mb-3">
                            <label for="property_id" class="form-label">Property <span class="text-danger">*</span></label>
                            <select class="form-select" id="property_id" name="property_id" required onchange="getUnits(this.value)">
                                <option value="">Select Property</option>
                                <?php foreach ($properties as $prop): ?>
                                    <option value="<?php echo $prop['id']; ?>" <?php echo (isset($property_id) && $property_id == $prop['id']) ? 'selected' : ''; ?>>
                                        <?php echo htmlspecialchars($prop['name']); ?> (<?php echo htmlspecialchars($prop['address']); ?>)
                                    </option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        
                        <div class="mb-3">
                            <label for="unit_id" class="form-label">Unit (Optional)</label>
                            <select class="form-select" id="unit_id" name="unit_id">
                                <option value="">All Units / Common Areas</option>
                                <!-- Units will be loaded via AJAX -->
                            </select>
                        </div>
                        
                        <div class="mb-3">
                            <label for="type" class="form-label">Inspection Type <span class="text-danger">*</span></label>
                            <select class="form-select" id="type" name="type" required>
                                <option value="">Select Type</option>
                                <option value="Annual" <?php echo (isset($type) && $type == 'Annual') ? 'selected' : ''; ?>>Annual</option>
                                <option value="Move In" <?php echo (isset($type) && $type == 'Move In') ? 'selected' : ''; ?>>Move In</option>
                                <option value="Move Out" <?php echo (isset($type) && $type == 'Move Out') ? 'selected' : ''; ?>>Move Out</option>
                                <option value="Maintenance" <?php echo (isset($type) && $type == 'Maintenance') ? 'selected' : ''; ?>>Maintenance</option>
                                <option value="Safety" <?php echo (isset($type) && $type == 'Safety') ? 'selected' : ''; ?>>Safety</option>
                                <option value="Seasonal" <?php echo (isset($type) && $type == 'Seasonal') ? 'selected' : ''; ?>>Seasonal</option>
                                <option value="Other" <?php echo (isset($type) && $type == 'Other') ? 'selected' : ''; ?>>Other</option>
                            </select>
                        </div>
                        
                        <div class="mb-3">
                            <label for="scheduled_date" class="form-label">Scheduled Date <span class="text-danger">*</span></label>
                            <input type="date" class="form-control" id="scheduled_date" name="scheduled_date" value="<?php echo isset($scheduled_date) ? $scheduled_date : ''; ?>" required>
                        </div>
                        
                        <div class="mb-3">
                            <label for="inspector_name" class="form-label">Inspector Name <span class="text-danger">*</span></label>
                            <input type="text" class="form-control" id="inspector_name" name="inspector_name" value="<?php echo isset($inspector_name) ? htmlspecialchars($inspector_name) : ''; ?>" required>
                        </div>
                        
                        <div class="mb-3">
                            <label for="notes" class="form-label">Notes</label>
                            <textarea class="form-control" id="notes" name="notes" rows="3"><?php echo isset($notes) ? htmlspecialchars($notes) : ''; ?></textarea>
                        </div>
                        
                        <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                            <button type="submit" class="btn btn-primary">Schedule Inspection</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        
        <div class="col-md-4">
            <div class="card">
                <div class="card-header">
                    <h5 class="card-title mb-0">Inspection Tips</h5>
                </div>
                <div class="card-body">
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">Schedule inspections at least 24 hours in advance</li>
                        <li class="list-group-item">Notify tenants of upcoming inspections</li>
                        <li class="list-group-item">Bring a checklist for consistent documentation</li>
                        <li class="list-group-item">Take photos during inspections</li>
                        <li class="list-group-item">Document any issues found immediately</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
function getUnits(propertyId) {
    if (!propertyId) {
        document.getElementById('unit_id').innerHTML = '<option value="">All Units / Common Areas</option>';
        return;
    }
    
    fetch(`../api/get_units.php?property_id=${propertyId}`)
        .then(response => response.json())
        .then(data => {
            let options = '<option value="">All Units / Common Areas</option>';
            
            if (data.success && data.data.length > 0) {
                data.data.forEach(unit => {
                    options += `<option value="${unit.id}">${unit.unit_number} - ${unit.description}</option>`;
                });
            }
            
            document.getElementById('unit_id').innerHTML = options;
        })
        .catch(error => {
            console.error('Error fetching units:', error);
        });
}
</script>

<?php include_once '../includes/footer.php'; ?>
