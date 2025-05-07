
<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/Property.php';

// Initialize Property model
$propertyModel = new Property($mysqli);

// Process form submission
$errors = [];
$success = false;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Validate form data
    if (empty($_POST['name'])) {
        $errors[] = "Property name is required";
    }
    
    if (empty($_POST['address'])) {
        $errors[] = "Address is required";
    }
    
    if (empty($_POST['city'])) {
        $errors[] = "City is required";
    }
    
    if (empty($_POST['state'])) {
        $errors[] = "State is required";
    }
    
    if (empty($_POST['zipcode'])) {
        $errors[] = "Zipcode is required";
    }
    
    if (empty($_POST['type'])) {
        $errors[] = "Property type is required";
    }
    
    if (!isset($_POST['total_units']) || !is_numeric($_POST['total_units'])) {
        $errors[] = "Total units must be a number";
    }
    
    // If no errors, process the data
    if (empty($errors)) {
        // Prepare data for the database
        $propertyData = [
            'company_id' => isset($_POST['company_id']) ? $_POST['company_id'] : null,
            'name' => $_POST['name'],
            'description' => $_POST['description'] ?? '',
            'type' => $_POST['type'],
            'address' => $_POST['address'],
            'city' => $_POST['city'],
            'state' => $_POST['state'],
            'zipcode' => $_POST['zipcode'],
            'country' => $_POST['country'] ?? 'USA',
            'total_units' => (int)$_POST['total_units'],
            'size' => isset($_POST['size']) && is_numeric($_POST['size']) ? $_POST['size'] : null,
            'year_built' => isset($_POST['year_built']) && is_numeric($_POST['year_built']) ? (int)$_POST['year_built'] : null,
            'purchase_price' => isset($_POST['purchase_price']) && is_numeric($_POST['purchase_price']) ? $_POST['purchase_price'] : null,
            'purchase_date' => !empty($_POST['purchase_date']) ? $_POST['purchase_date'] : null,
            'mortgage_amount' => isset($_POST['mortgage_amount']) && is_numeric($_POST['mortgage_amount']) ? $_POST['mortgage_amount'] : null,
            'property_tax' => isset($_POST['property_tax']) && is_numeric($_POST['property_tax']) ? $_POST['property_tax'] : null,
            'status' => $_POST['status'] ?? 'active'
        ];
        
        // Create property
        $propertyId = $propertyModel->create($propertyData);
        
        if ($propertyId) {
            // Success, redirect to property view
            header("Location: view_property.php?id=$propertyId&created=1");
            exit;
        } else {
            $errors[] = "Failed to create property. Please try again.";
        }
    }
}

$pageTitle = "Add Property";
require_once __DIR__ . '/../includes/header.php';
?>

<div class="container-fluid py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="h3 mb-0">Add Property</h1>
        <a href="properties.php" class="btn btn-secondary">
            <i class="fas fa-arrow-left"></i> Back to Properties
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

    <div class="card shadow mb-4">
        <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">Property Information</h6>
        </div>
        <div class="card-body">
            <form method="post" action="add_property.php">
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label for="name" class="form-label">Property Name <span class="text-danger">*</span></label>
                        <input type="text" class="form-control" id="name" name="name" required 
                               value="<?= isset($_POST['name']) ? htmlspecialchars($_POST['name']) : '' ?>">
                    </div>
                    <div class="col-md-6">
                        <label for="type" class="form-label">Property Type <span class="text-danger">*</span></label>
                        <select class="form-select" id="type" name="type" required>
                            <option value="">Select property type</option>
                            <option value="apartment" <?= isset($_POST['type']) && $_POST['type'] === 'apartment' ? 'selected' : '' ?>>Apartment Building</option>
                            <option value="single_family" <?= isset($_POST['type']) && $_POST['type'] === 'single_family' ? 'selected' : '' ?>>Single Family Home</option>
                            <option value="condo" <?= isset($_POST['type']) && $_POST['type'] === 'condo' ? 'selected' : '' ?>>Condominium</option>
                            <option value="townhouse" <?= isset($_POST['type']) && $_POST['type'] === 'townhouse' ? 'selected' : '' ?>>Townhouse</option>
                            <option value="commercial" <?= isset($_POST['type']) && $_POST['type'] === 'commercial' ? 'selected' : '' ?>>Commercial</option>
                            <option value="mixed_use" <?= isset($_POST['type']) && $_POST['type'] === 'mixed_use' ? 'selected' : '' ?>>Mixed Use</option>
                            <option value="other" <?= isset($_POST['type']) && $_POST['type'] === 'other' ? 'selected' : '' ?>>Other</option>
                        </select>
                    </div>
                </div>

                <div class="mb-3">
                    <label for="description" class="form-label">Description</label>
                    <textarea class="form-control" id="description" name="description" rows="3"><?= isset($_POST['description']) ? htmlspecialchars($_POST['description']) : '' ?></textarea>
                </div>

                <h5 class="mb-3 mt-4">Property Address</h5>
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label for="address" class="form-label">Street Address <span class="text-danger">*</span></label>
                        <input type="text" class="form-control" id="address" name="address" required 
                               value="<?= isset($_POST['address']) ? htmlspecialchars($_POST['address']) : '' ?>">
                    </div>
                    <div class="col-md-6">
                        <label for="city" class="form-label">City <span class="text-danger">*</span></label>
                        <input type="text" class="form-control" id="city" name="city" required 
                               value="<?= isset($_POST['city']) ? htmlspecialchars($_POST['city']) : '' ?>">
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-md-4">
                        <label for="state" class="form-label">State <span class="text-danger">*</span></label>
                        <input type="text" class="form-control" id="state" name="state" required 
                               value="<?= isset($_POST['state']) ? htmlspecialchars($_POST['state']) : '' ?>">
                    </div>
                    <div class="col-md-4">
                        <label for="zipcode" class="form-label">Zipcode <span class="text-danger">*</span></label>
                        <input type="text" class="form-control" id="zipcode" name="zipcode" required 
                               value="<?= isset($_POST['zipcode']) ? htmlspecialchars($_POST['zipcode']) : '' ?>">
                    </div>
                    <div class="col-md-4">
                        <label for="country" class="form-label">Country</label>
                        <input type="text" class="form-control" id="country" name="country" 
                               value="<?= isset($_POST['country']) ? htmlspecialchars($_POST['country']) : 'USA' ?>">
                    </div>
                </div>

                <h5 class="mb-3 mt-4">Property Details</h5>
                <div class="row mb-3">
                    <div class="col-md-4">
                        <label for="total_units" class="form-label">Total Units <span class="text-danger">*</span></label>
                        <input type="number" class="form-control" id="total_units" name="total_units" required min="1" 
                               value="<?= isset($_POST['total_units']) ? htmlspecialchars($_POST['total_units']) : '' ?>">
                    </div>
                    <div class="col-md-4">
                        <label for="size" class="form-label">Property Size (sq ft)</label>
                        <input type="number" class="form-control" id="size" name="size" step="0.01" 
                               value="<?= isset($_POST['size']) ? htmlspecialchars($_POST['size']) : '' ?>">
                    </div>
                    <div class="col-md-4">
                        <label for="year_built" class="form-label">Year Built</label>
                        <input type="number" class="form-control" id="year_built" name="year_built" min="1800" max="<?= date('Y') ?>" 
                               value="<?= isset($_POST['year_built']) ? htmlspecialchars($_POST['year_built']) : '' ?>">
                    </div>
                </div>

                <h5 class="mb-3 mt-4">Financial Information</h5>
                <div class="row mb-3">
                    <div class="col-md-3">
                        <label for="purchase_price" class="form-label">Purchase Price</label>
                        <div class="input-group">
                            <span class="input-group-text">$</span>
                            <input type="number" class="form-control" id="purchase_price" name="purchase_price" step="0.01" 
                                   value="<?= isset($_POST['purchase_price']) ? htmlspecialchars($_POST['purchase_price']) : '' ?>">
                        </div>
                    </div>
                    <div class="col-md-3">
                        <label for="purchase_date" class="form-label">Purchase Date</label>
                        <input type="date" class="form-control" id="purchase_date" name="purchase_date" 
                               value="<?= isset($_POST['purchase_date']) ? htmlspecialchars($_POST['purchase_date']) : '' ?>">
                    </div>
                    <div class="col-md-3">
                        <label for="mortgage_amount" class="form-label">Mortgage Amount</label>
                        <div class="input-group">
                            <span class="input-group-text">$</span>
                            <input type="number" class="form-control" id="mortgage_amount" name="mortgage_amount" step="0.01" 
                                   value="<?= isset($_POST['mortgage_amount']) ? htmlspecialchars($_POST['mortgage_amount']) : '' ?>">
                        </div>
                    </div>
                    <div class="col-md-3">
                        <label for="property_tax" class="form-label">Annual Property Tax</label>
                        <div class="input-group">
                            <span class="input-group-text">$</span>
                            <input type="number" class="form-control" id="property_tax" name="property_tax" step="0.01" 
                                   value="<?= isset($_POST['property_tax']) ? htmlspecialchars($_POST['property_tax']) : '' ?>">
                        </div>
                    </div>
                </div>

                <div class="mb-3">
                    <label for="status" class="form-label">Status</label>
                    <select class="form-select" id="status" name="status">
                        <option value="active" <?= isset($_POST['status']) && $_POST['status'] === 'active' ? 'selected' : '' ?>>Active</option>
                        <option value="inactive" <?= isset($_POST['status']) && $_POST['status'] === 'inactive' ? 'selected' : '' ?>>Inactive</option>
                        <option value="maintenance" <?= isset($_POST['status']) && $_POST['status'] === 'maintenance' ? 'selected' : '' ?>>Under Maintenance</option>
                    </select>
                </div>

                <div class="mt-4">
                    <button type="submit" class="btn btn-primary">Create Property</button>
                    <a href="properties.php" class="btn btn-secondary">Cancel</a>
                </div>
            </form>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
