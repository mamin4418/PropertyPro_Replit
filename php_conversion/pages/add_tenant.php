
<?php
require_once '../includes/header.php';
require_once '../models/Property.php';
require_once '../models/Unit.php';

// Get all properties for dropdown
$property = new Property($mysqli);
$properties = $property->getAllProperties();

// Initialize units array
$units = [];

// Handle form submission
$errors = [];
$success = false;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Validate form data
    if (empty($_POST['first_name'])) {
        $errors[] = "First name is required";
    }
    
    if (empty($_POST['last_name'])) {
        $errors[] = "Last name is required";
    }
    
    if (empty($_POST['email'])) {
        $errors[] = "Email is required";
    } elseif (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Invalid email format";
    }
    
    if (empty($_POST['phone'])) {
        $errors[] = "Phone number is required";
    }
    
    // If no errors, process the form
    if (empty($errors)) {
        require_once '../models/Tenant.php';
        $tenant = new Tenant($mysqli);
        
        $tenantData = [
            'first_name' => $_POST['first_name'],
            'last_name' => $_POST['last_name'],
            'email' => $_POST['email'],
            'phone' => $_POST['phone'],
            'property_id' => $_POST['property_id'] ?? null,
            'unit_id' => $_POST['unit_id'] ?? null,
            'status' => $_POST['status'],
            'move_in_date' => $_POST['move_in_date'] ?? null,
            'lease_start' => $_POST['lease_start'] ?? null,
            'lease_end' => $_POST['lease_end'] ?? null,
            'rent_amount' => $_POST['rent_amount'] ?? null,
            'security_deposit' => $_POST['security_deposit'] ?? null,
            'emergency_contact_name' => $_POST['emergency_contact_name'] ?? null,
            'emergency_contact_phone' => $_POST['emergency_contact_phone'] ?? null,
            'notes' => $_POST['notes'] ?? null
        ];
        
        $result = $tenant->createTenant($tenantData);
        
        if ($result) {
            $success = true;
            // Redirect to tenants list
            header("Location: tenants.php?success=Tenant created successfully");
            exit;
        } else {
            $errors[] = "Failed to create tenant. Please try again.";
        }
    }
    
    // If property is selected, get units for that property
    if (!empty($_POST['property_id'])) {
        $unit = new Unit($mysqli);
        $units = $unit->getUnitsByProperty($_POST['property_id']);
    }
}
?>

<div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="h3 mb-0 text-gray-800">Add New Tenant</h1>
        <a href="tenants.php" class="btn btn-secondary">
            <i class="fas fa-arrow-left"></i> Back to Tenants
        </a>
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
    
    <?php if ($success): ?>
        <div class="alert alert-success">
            Tenant created successfully!
        </div>
    <?php endif; ?>
    
    <div class="card shadow mb-4">
        <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">Tenant Information</h6>
        </div>
        <div class="card-body">
            <form method="POST" action="">
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="first_name">First Name <span class="text-danger">*</span></label>
                            <input type="text" class="form-control" id="first_name" name="first_name" value="<?= $_POST['first_name'] ?? '' ?>" required>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="last_name">Last Name <span class="text-danger">*</span></label>
                            <input type="text" class="form-control" id="last_name" name="last_name" value="<?= $_POST['last_name'] ?? '' ?>" required>
                        </div>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="email">Email <span class="text-danger">*</span></label>
                            <input type="email" class="form-control" id="email" name="email" value="<?= $_POST['email'] ?? '' ?>" required>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="phone">Phone <span class="text-danger">*</span></label>
                            <input type="text" class="form-control" id="phone" name="phone" value="<?= $_POST['phone'] ?? '' ?>" required>
                        </div>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="property_id">Property</label>
                            <select class="form-control" id="property_id" name="property_id">
                                <option value="">Select Property</option>
                                <?php foreach ($properties as $prop): ?>
                                    <option value="<?= $prop['id'] ?>" <?= (isset($_POST['property_id']) && $_POST['property_id'] == $prop['id']) ? 'selected' : '' ?>>
                                        <?= htmlspecialchars($prop['name']) ?>
                                    </option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="unit_id">Unit</label>
                            <select class="form-control" id="unit_id" name="unit_id" <?= empty($units) ? 'disabled' : '' ?>>
                                <option value="">Select Unit</option>
                                <?php foreach ($units as $unit): ?>
                                    <option value="<?= $unit['id'] ?>" <?= (isset($_POST['unit_id']) && $_POST['unit_id'] == $unit['id']) ? 'selected' : '' ?>>
                                        <?= htmlspecialchars($unit['unit_number']) ?>
                                    </option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="status">Status <span class="text-danger">*</span></label>
                            <select class="form-control" id="status" name="status" required>
                                <option value="active" <?= (isset($_POST['status']) && $_POST['status'] == 'active') ? 'selected' : '' ?>>Active</option>
                                <option value="pending" <?= (isset($_POST['status']) && $_POST['status'] == 'pending') ? 'selected' : '' ?>>Pending</option>
                                <option value="inactive" <?= (isset($_POST['status']) && $_POST['status'] == 'inactive') ? 'selected' : '' ?>>Inactive</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="move_in_date">Move-in Date</label>
                            <input type="date" class="form-control" id="move_in_date" name="move_in_date" value="<?= $_POST['move_in_date'] ?? '' ?>">
                        </div>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="lease_start">Lease Start Date</label>
                            <input type="date" class="form-control" id="lease_start" name="lease_start" value="<?= $_POST['lease_start'] ?? '' ?>">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="lease_end">Lease End Date</label>
                            <input type="date" class="form-control" id="lease_end" name="lease_end" value="<?= $_POST['lease_end'] ?? '' ?>">
                        </div>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="rent_amount">Rent Amount</label>
                            <div class="input-group">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">$</span>
                                </div>
                                <input type="number" step="0.01" class="form-control" id="rent_amount" name="rent_amount" value="<?= $_POST['rent_amount'] ?? '' ?>">
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="security_deposit">Security Deposit</label>
                            <div class="input-group">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">$</span>
                                </div>
                                <input type="number" step="0.01" class="form-control" id="security_deposit" name="security_deposit" value="<?= $_POST['security_deposit'] ?? '' ?>">
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="emergency_contact_name">Emergency Contact Name</label>
                            <input type="text" class="form-control" id="emergency_contact_name" name="emergency_contact_name" value="<?= $_POST['emergency_contact_name'] ?? '' ?>">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="emergency_contact_phone">Emergency Contact Phone</label>
                            <input type="text" class="form-control" id="emergency_contact_phone" name="emergency_contact_phone" value="<?= $_POST['emergency_contact_phone'] ?? '' ?>">
                        </div>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="notes">Notes</label>
                    <textarea class="form-control" id="notes" name="notes" rows="3"><?= $_POST['notes'] ?? '' ?></textarea>
                </div>
                
                <div class="text-center mt-4">
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-save"></i> Save Tenant
                    </button>
                    <a href="tenants.php" class="btn btn-secondary">
                        <i class="fas fa-times"></i> Cancel
                    </a>
                </div>
            </form>
        </div>
    </div>
</div>

<script>
    $(document).ready(function() {
        // When property changes, update units dropdown
        $('#property_id').change(function() {
            var propertyId = $(this).val();
            if (propertyId) {
                $.ajax({
                    url: '../api/get_units.php',
                    type: 'GET',
                    data: { property_id: propertyId },
                    dataType: 'json',
                    success: function(data) {
                        var unitDropdown = $('#unit_id');
                        unitDropdown.empty();
                        unitDropdown.append('<option value="">Select Unit</option>');
                        
                        if (data.length > 0) {
                            $.each(data, function(index, unit) {
                                unitDropdown.append('<option value="' + unit.id + '">' + unit.unit_number + '</option>');
                            });
                            unitDropdown.prop('disabled', false);
                        } else {
                            unitDropdown.prop('disabled', true);
                        }
                    },
                    error: function() {
                        alert('Failed to fetch units. Please try again.');
                    }
                });
            } else {
                $('#unit_id').empty().append('<option value="">Select Unit</option>').prop('disabled', true);
            }
        });
    });
</script>

<?php require_once '../includes/footer.php'; ?>
