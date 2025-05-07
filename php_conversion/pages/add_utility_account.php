
<?php
require_once '../config/database.php';
require_once '../models/Utility.php';
require_once '../models/Property.php';
require_once '../models/Unit.php';
require_once '../includes/functions.php';

// Initialize the database connection
$database = new Database();
$db = $database->getConnection();

// Initialize models
$utility = new Utility($db);
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
    $unit_id = isset($_POST['unit_id']) && !empty($_POST['unit_id']) ? intval($_POST['unit_id']) : null;
    $provider_name = isset($_POST['provider_name']) ? trim($_POST['provider_name']) : '';
    $utility_type = isset($_POST['utility_type']) ? trim($_POST['utility_type']) : '';
    $account_number = isset($_POST['account_number']) ? trim($_POST['account_number']) : '';
    $billing_day = isset($_POST['billing_day']) ? intval($_POST['billing_day']) : 1;
    $auto_pay = isset($_POST['auto_pay']) ? 1 : 0;
    $avg_cost = isset($_POST['avg_cost']) ? floatval($_POST['avg_cost']) : 0;
    
    // Basic validation
    if ($property_id === 0) {
        $errorMsg = 'Please select a property.';
    } elseif (empty($provider_name)) {
        $errorMsg = 'Please enter a provider name.';
    } elseif (empty($utility_type)) {
        $errorMsg = 'Please select a utility type.';
    } elseif (empty($account_number)) {
        $errorMsg = 'Please enter an account number.';
    } elseif ($billing_day < 1 || $billing_day > 31) {
        $errorMsg = 'Please enter a valid billing day (1-31).';
    } else {
        // Create new utility account
        $result = $utility->createUtilityAccount($property_id, $unit_id, $provider_name, $utility_type, $account_number, $billing_day, $auto_pay, $avg_cost);
        
        if ($result) {
            $successMsg = 'Utility account added successfully!';
            // Reset form
            $property_id = 0;
            $unit_id = null;
            $provider_name = '';
            $utility_type = '';
            $account_number = '';
            $billing_day = 1;
            $auto_pay = 0;
            $avg_cost = 0;
        } else {
            $errorMsg = 'Error adding utility account. Please try again.';
        }
    }
}

// Set page title
$pageTitle = "Add Utility Account";
include_once '../includes/header.php';
?>

<div class="container-fluid">
    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 class="h2"><?php echo $pageTitle; ?></h1>
        <div class="btn-toolbar mb-2 mb-md-0">
            <a href="utilities.php" class="btn btn-sm btn-outline-secondary">
                <i class="fas fa-arrow-left"></i> Back to Utilities
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
                    <h5 class="card-title mb-0">Add New Utility Account</h5>
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
                            <label for="provider_name" class="form-label">Provider Name <span class="text-danger">*</span></label>
                            <input type="text" class="form-control" id="provider_name" name="provider_name" value="<?php echo isset($provider_name) ? htmlspecialchars($provider_name) : ''; ?>" required>
                        </div>
                        
                        <div class="mb-3">
                            <label for="utility_type" class="form-label">Utility Type <span class="text-danger">*</span></label>
                            <select class="form-select" id="utility_type" name="utility_type" required>
                                <option value="">Select Utility Type</option>
                                <option value="Electricity" <?php echo (isset($utility_type) && $utility_type == 'Electricity') ? 'selected' : ''; ?>>Electricity</option>
                                <option value="Water" <?php echo (isset($utility_type) && $utility_type == 'Water') ? 'selected' : ''; ?>>Water</option>
                                <option value="Gas" <?php echo (isset($utility_type) && $utility_type == 'Gas') ? 'selected' : ''; ?>>Gas</option>
                                <option value="Internet" <?php echo (isset($utility_type) && $utility_type == 'Internet') ? 'selected' : ''; ?>>Internet</option>
                                <option value="Cable/TV" <?php echo (isset($utility_type) && $utility_type == 'Cable/TV') ? 'selected' : ''; ?>>Cable/TV</option>
                                <option value="Trash" <?php echo (isset($utility_type) && $utility_type == 'Trash') ? 'selected' : ''; ?>>Trash</option>
                                <option value="Sewer" <?php echo (isset($utility_type) && $utility_type == 'Sewer') ? 'selected' : ''; ?>>Sewer</option>
                                <option value="Other" <?php echo (isset($utility_type) && $utility_type == 'Other') ? 'selected' : ''; ?>>Other</option>
                            </select>
                        </div>
                        
                        <div class="mb-3">
                            <label for="account_number" class="form-label">Account Number <span class="text-danger">*</span></label>
                            <input type="text" class="form-control" id="account_number" name="account_number" value="<?php echo isset($account_number) ? htmlspecialchars($account_number) : ''; ?>" required>
                        </div>
                        
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label for="billing_day" class="form-label">Billing Day <span class="text-danger">*</span></label>
                                <input type="number" class="form-control" id="billing_day" name="billing_day" value="<?php echo isset($billing_day) ? $billing_day : 1; ?>" min="1" max="31" required>
                                <div class="form-text">Day of the month when the bill is typically issued</div>
                            </div>
                            <div class="col-md-6">
                                <label for="avg_cost" class="form-label">Average Monthly Cost</label>
                                <div class="input-group">
                                    <span class="input-group-text">$</span>
                                    <input type="number" class="form-control" id="avg_cost" name="avg_cost" value="<?php echo isset($avg_cost) ? $avg_cost : 0; ?>" min="0" step="0.01">
                                </div>
                            </div>
                        </div>
                        
                        <div class="mb-3 form-check">
                            <input type="checkbox" class="form-check-input" id="auto_pay" name="auto_pay" <?php echo (isset($auto_pay) && $auto_pay) ? 'checked' : ''; ?>>
                            <label class="form-check-label" for="auto_pay">Auto-Pay Enabled</label>
                        </div>
                        
                        <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                            <button type="submit" class="btn btn-primary">Add Utility Account</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        
        <div class="col-md-4">
            <div class="card">
                <div class="card-header">
                    <h5 class="card-title mb-0">Utility Account Tips</h5>
                </div>
                <div class="card-body">
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">Add accounts for each utility provider</li>
                        <li class="list-group-item">Set up auto-pay to avoid late fees</li>
                        <li class="list-group-item">Keep account numbers in a secure location</li>
                        <li class="list-group-item">Track average costs for budgeting</li>
                        <li class="list-group-item">Specify unit-specific utilities when applicable</li>
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
