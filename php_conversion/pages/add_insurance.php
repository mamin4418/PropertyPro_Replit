
<?php
// Include necessary files
require_once 'includes/header.php';
require_once 'includes/sidebar.php';
require_once 'models/Insurance.php';
require_once 'models/Property.php';

// Initialize database connection
$db = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
if ($db->connect_error) {
    die("Connection failed: " . $db->connect_error);
}

// Initialize models
$insurance = new Insurance($db);
$property = new Property($db);

// Get all properties
$properties = $property->getAllProperties();

// Initialize variables
$id = isset($_GET['id']) ? intval($_GET['id']) : 0;
$isEditing = ($id > 0);
$insuranceData = [];
$errors = [];

// If editing, get insurance data
if ($isEditing) {
    $insuranceData = $insurance->getInsuranceById($id);
    if (!$insuranceData) {
        echo "<script>alert('Insurance policy not found.'); window.location.href = 'insurances.php';</script>";
        exit;
    }
}

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Validate and collect form data
    $data = [
        'property_id' => isset($_POST['property_id']) ? intval($_POST['property_id']) : 0,
        'provider' => isset($_POST['provider']) ? trim($_POST['provider']) : '',
        'policy_number' => isset($_POST['policy_number']) ? trim($_POST['policy_number']) : '',
        'coverage_type' => isset($_POST['coverage_type']) ? trim($_POST['coverage_type']) : '',
        'premium_amount' => isset($_POST['premium_amount']) ? floatval($_POST['premium_amount']) : 0,
        'payment_frequency' => isset($_POST['payment_frequency']) ? trim($_POST['payment_frequency']) : '',
        'effective_date' => isset($_POST['effective_date']) ? trim($_POST['effective_date']) : '',
        'expiration_date' => isset($_POST['expiration_date']) ? trim($_POST['expiration_date']) : '',
        'coverage_amount' => isset($_POST['coverage_amount']) ? floatval($_POST['coverage_amount']) : 0,
        'deductible' => isset($_POST['deductible']) ? floatval($_POST['deductible']) : 0,
        'notes' => isset($_POST['notes']) ? trim($_POST['notes']) : ''
    ];
    
    // Validate required fields
    if ($data['property_id'] <= 0) {
        $errors[] = "Property is required.";
    }
    if (empty($data['provider'])) {
        $errors[] = "Provider is required.";
    }
    if (empty($data['policy_number'])) {
        $errors[] = "Policy number is required.";
    }
    if (empty($data['coverage_type'])) {
        $errors[] = "Coverage type is required.";
    }
    if ($data['premium_amount'] <= 0) {
        $errors[] = "Premium amount must be greater than zero.";
    }
    if (empty($data['payment_frequency'])) {
        $errors[] = "Payment frequency is required.";
    }
    if (empty($data['effective_date'])) {
        $errors[] = "Effective date is required.";
    }
    if (empty($data['expiration_date'])) {
        $errors[] = "Expiration date is required.";
    }
    if ($data['coverage_amount'] <= 0) {
        $errors[] = "Coverage amount must be greater than zero.";
    }
    
    // If no errors, save the data
    if (empty($errors)) {
        if ($isEditing) {
            // Update existing insurance
            if ($insurance->updateInsurance($id, $data)) {
                echo "<script>alert('Insurance policy updated successfully.'); window.location.href = 'insurances.php';</script>";
                exit;
            } else {
                $errors[] = "Error updating insurance policy.";
            }
        } else {
            // Add new insurance
            if ($newId = $insurance->addInsurance($data)) {
                echo "<script>alert('Insurance policy added successfully.'); window.location.href = 'insurances.php';</script>";
                exit;
            } else {
                $errors[] = "Error adding insurance policy.";
            }
        }
    }
}
?>

<div class="content-wrapper">
    <div class="container-fluid">
        <div class="row mb-4">
            <div class="col-md-6">
                <h1 class="h3 mb-0 text-gray-800"><?= $isEditing ? 'Edit' : 'Add' ?> Insurance Policy</h1>
                <p class="mb-4"><?= $isEditing ? 'Update existing' : 'Create new' ?> insurance policy details</p>
            </div>
            <div class="col-md-6 text-md-end">
                <a href="insurances.php" class="btn btn-secondary">
                    <i class="fas fa-arrow-left me-2"></i>Back to Insurance Policies
                </a>
            </div>
        </div>
        
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
                <h6 class="m-0 font-weight-bold text-primary"><?= $isEditing ? 'Edit' : 'New' ?> Insurance Policy Information</h6>
            </div>
            <div class="card-body">
                <form method="post" action="<?= $isEditing ? "add_insurance.php?id=$id" : "add_insurance.php" ?>">
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label for="property_id" class="form-label">Property <span class="text-danger">*</span></label>
                            <select name="property_id" id="property_id" class="form-select" required>
                                <option value="">Select Property</option>
                                <?php foreach ($properties as $p): ?>
                                    <option value="<?= $p['id'] ?>" <?= (isset($insuranceData['property_id']) && $insuranceData['property_id'] == $p['id']) ? 'selected' : '' ?>>
                                        <?= htmlspecialchars($p['name']) ?> (<?= htmlspecialchars($p['address']) ?>)
                                    </option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label for="provider" class="form-label">Provider <span class="text-danger">*</span></label>
                            <input type="text" class="form-control" id="provider" name="provider" 
                                   value="<?= isset($insuranceData['provider']) ? htmlspecialchars($insuranceData['provider']) : '' ?>" required>
                        </div>
                    </div>
                    
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label for="policy_number" class="form-label">Policy Number <span class="text-danger">*</span></label>
                            <input type="text" class="form-control" id="policy_number" name="policy_number" 
                                   value="<?= isset($insuranceData['policy_number']) ? htmlspecialchars($insuranceData['policy_number']) : '' ?>" required>
                        </div>
                        <div class="col-md-6">
                            <label for="coverage_type" class="form-label">Coverage Type <span class="text-danger">*</span></label>
                            <select name="coverage_type" id="coverage_type" class="form-select" required>
                                <option value="">Select Coverage Type</option>
                                <option value="Property" <?= (isset($insuranceData['coverage_type']) && $insuranceData['coverage_type'] == 'Property') ? 'selected' : '' ?>>Property</option>
                                <option value="Liability" <?= (isset($insuranceData['coverage_type']) && $insuranceData['coverage_type'] == 'Liability') ? 'selected' : '' ?>>Liability</option>
                                <option value="Flood" <?= (isset($insuranceData['coverage_type']) && $insuranceData['coverage_type'] == 'Flood') ? 'selected' : '' ?>>Flood</option>
                                <option value="Fire" <?= (isset($insuranceData['coverage_type']) && $insuranceData['coverage_type'] == 'Fire') ? 'selected' : '' ?>>Fire</option>
                                <option value="Earthquake" <?= (isset($insuranceData['coverage_type']) && $insuranceData['coverage_type'] == 'Earthquake') ? 'selected' : '' ?>>Earthquake</option>
                                <option value="Umbrella" <?= (isset($insuranceData['coverage_type']) && $insuranceData['coverage_type'] == 'Umbrella') ? 'selected' : '' ?>>Umbrella</option>
                                <option value="Other" <?= (isset($insuranceData['coverage_type']) && $insuranceData['coverage_type'] == 'Other') ? 'selected' : '' ?>>Other</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="row mb-3">
                        <div class="col-md-4">
                            <label for="premium_amount" class="form-label">Premium Amount ($) <span class="text-danger">*</span></label>
                            <input type="number" step="0.01" min="0" class="form-control" id="premium_amount" name="premium_amount" 
                                   value="<?= isset($insuranceData['premium_amount']) ? $insuranceData['premium_amount'] : '' ?>" required>
                        </div>
                        <div class="col-md-4">
                            <label for="payment_frequency" class="form-label">Payment Frequency <span class="text-danger">*</span></label>
                            <select name="payment_frequency" id="payment_frequency" class="form-select" required>
                                <option value="">Select Frequency</option>
                                <option value="Monthly" <?= (isset($insuranceData['payment_frequency']) && $insuranceData['payment_frequency'] == 'Monthly') ? 'selected' : '' ?>>Monthly</option>
                                <option value="Quarterly" <?= (isset($insuranceData['payment_frequency']) && $insuranceData['payment_frequency'] == 'Quarterly') ? 'selected' : '' ?>>Quarterly</option>
                                <option value="Semi-Annually" <?= (isset($insuranceData['payment_frequency']) && $insuranceData['payment_frequency'] == 'Semi-Annually') ? 'selected' : '' ?>>Semi-Annually</option>
                                <option value="Annually" <?= (isset($insuranceData['payment_frequency']) && $insuranceData['payment_frequency'] == 'Annually') ? 'selected' : '' ?>>Annually</option>
                            </select>
                        </div>
                        <div class="col-md-4">
                            <label for="deductible" class="form-label">Deductible ($)</label>
                            <input type="number" step="0.01" min="0" class="form-control" id="deductible" name="deductible" 
                                   value="<?= isset($insuranceData['deductible']) ? $insuranceData['deductible'] : '' ?>">
                        </div>
                    </div>
                    
                    <div class="row mb-3">
                        <div class="col-md-4">
                            <label for="effective_date" class="form-label">Effective Date <span class="text-danger">*</span></label>
                            <input type="date" class="form-control" id="effective_date" name="effective_date" 
                                   value="<?= isset($insuranceData['effective_date']) ? $insuranceData['effective_date'] : '' ?>" required>
                        </div>
                        <div class="col-md-4">
                            <label for="expiration_date" class="form-label">Expiration Date <span class="text-danger">*</span></label>
                            <input type="date" class="form-control" id="expiration_date" name="expiration_date" 
                                   value="<?= isset($insuranceData['expiration_date']) ? $insuranceData['expiration_date'] : '' ?>" required>
                        </div>
                        <div class="col-md-4">
                            <label for="coverage_amount" class="form-label">Coverage Amount ($) <span class="text-danger">*</span></label>
                            <input type="number" step="0.01" min="0" class="form-control" id="coverage_amount" name="coverage_amount" 
                                   value="<?= isset($insuranceData['coverage_amount']) ? $insuranceData['coverage_amount'] : '' ?>" required>
                        </div>
                    </div>
                    
                    <div class="row mb-3">
                        <div class="col-12">
                            <label for="notes" class="form-label">Notes</label>
                            <textarea class="form-control" id="notes" name="notes" rows="3"><?= isset($insuranceData['notes']) ? htmlspecialchars($insuranceData['notes']) : '' ?></textarea>
                        </div>
                    </div>
                    
                    <hr>
                    
                    <div class="row">
                        <div class="col-12">
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-save me-2"></i><?= $isEditing ? 'Update' : 'Save' ?> Insurance Policy
                            </button>
                            <a href="insurances.php" class="btn btn-secondary">Cancel</a>
                            
                            <?php if ($isEditing): ?>
                                <a href="view_insurance.php?id=<?= $id ?>" class="btn btn-info">
                                    <i class="fas fa-eye me-2"></i>View Details
                                </a>
                            <?php endif; ?>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<script>
    document.addEventListener('DOMContentLoaded', function() {
        // Set minimum effective date to today for new policies
        const effectiveDateInput = document.getElementById('effective_date');
        const expirationDateInput = document.getElementById('expiration_date');
        
        if (!effectiveDateInput.value && !expirationDateInput.value) {
            const today = new Date().toISOString().split('T')[0];
            effectiveDateInput.setAttribute('min', today);
            
            // Default expiration date to 1 year from effective date
            effectiveDateInput.addEventListener('change', function() {
                if (this.value) {
                    const effectiveDate = new Date(this.value);
                    effectiveDate.setFullYear(effectiveDate.getFullYear() + 1);
                    expirationDateInput.value = effectiveDate.toISOString().split('T')[0];
                }
            });
        }
    });
</script>

<?php
require_once 'includes/footer.php';
$db->close();
?>
