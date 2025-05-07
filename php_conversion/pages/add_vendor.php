
<?php
// Include header and sidebar
include_once '../includes/header.php';
include_once '../includes/sidebar.php';

// Include the Vendor model
require_once '../models/Vendor.php';

// Initialize variables
$name = $contact_name = $email = $phone = $service_type = $address = $city = $state = $zip = $notes = '';
$errors = [];

// Service type options
$service_types = [
    'Plumbing',
    'Electrical',
    'HVAC',
    'Landscaping',
    'Cleaning',
    'Pest Control',
    'Construction',
    'Painting',
    'Roofing',
    'General Maintenance',
    'Other'
];

// Check if form is submitted
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Validate inputs
    if (empty($_POST['name'])) {
        $errors[] = 'Vendor name is required';
    } else {
        $name = trim($_POST['name']);
    }
    
    if (empty($_POST['service_type'])) {
        $errors[] = 'Service type is required';
    } else {
        $service_type = trim($_POST['service_type']);
    }
    
    // Optional fields
    $contact_name = !empty($_POST['contact_name']) ? trim($_POST['contact_name']) : '';
    $email = !empty($_POST['email']) ? trim($_POST['email']) : '';
    $phone = !empty($_POST['phone']) ? trim($_POST['phone']) : '';
    $address = !empty($_POST['address']) ? trim($_POST['address']) : '';
    $city = !empty($_POST['city']) ? trim($_POST['city']) : '';
    $state = !empty($_POST['state']) ? trim($_POST['state']) : '';
    $zip = !empty($_POST['zip']) ? trim($_POST['zip']) : '';
    $notes = !empty($_POST['notes']) ? trim($_POST['notes']) : '';
    
    // If email is provided, validate it
    if (!empty($email) && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Invalid email format';
    }
    
    // If no errors, create vendor
    if (empty($errors)) {
        $vendor = new Vendor();
        $vendor->name = $name;
        $vendor->contact_name = $contact_name;
        $vendor->email = $email;
        $vendor->phone = $phone;
        $vendor->service_type = $service_type;
        $vendor->address = $address;
        $vendor->city = $city;
        $vendor->state = $state;
        $vendor->zip = $zip;
        $vendor->notes = $notes;
        
        if ($vendor->create()) {
            // Redirect to vendors list
            header("Location: vendors.php");
            exit;
        } else {
            $errors[] = 'Failed to create vendor';
        }
    }
}
?>

<div class="content-wrapper">
    <div class="content-header">
        <div class="container-fluid">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h1 class="m-0">Add Vendor</h1>
                </div>
                <div class="col-sm-6">
                    <ol class="breadcrumb float-sm-right">
                        <li class="breadcrumb-item"><a href="../index.php">Home</a></li>
                        <li class="breadcrumb-item"><a href="vendors.php">Vendors</a></li>
                        <li class="breadcrumb-item active">Add Vendor</li>
                    </ol>
                </div>
            </div>
        </div>
    </div>

    <div class="content">
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-12">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Vendor Information</h3>
                        </div>
                        
                        <form action="<?= htmlspecialchars($_SERVER['PHP_SELF']); ?>" method="post">
                            <div class="card-body">
                                <?php if (!empty($errors)) : ?>
                                    <div class="alert alert-danger">
                                        <ul>
                                            <?php foreach ($errors as $error) : ?>
                                                <li><?= $error ?></li>
                                            <?php endforeach; ?>
                                        </ul>
                                    </div>
                                <?php endif; ?>

                                <div class="form-group">
                                    <label for="name">Vendor Name *</label>
                                    <input type="text" class="form-control" id="name" name="name" value="<?= htmlspecialchars($name) ?>" required>
                                </div>
                                
                                <div class="form-group">
                                    <label for="contact_name">Contact Person</label>
                                    <input type="text" class="form-control" id="contact_name" name="contact_name" value="<?= htmlspecialchars($contact_name) ?>">
                                </div>
                                
                                <div class="form-group">
                                    <label for="service_type">Service Type *</label>
                                    <select class="form-control" id="service_type" name="service_type" required>
                                        <option value="">Select Service Type</option>
                                        <?php foreach ($service_types as $type) : ?>
                                            <option value="<?= $type ?>" <?= $service_type === $type ? 'selected' : '' ?>>
                                                <?= $type ?>
                                            </option>
                                        <?php endforeach; ?>
                                    </select>
                                </div>
                                
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label for="phone">Phone</label>
                                            <input type="tel" class="form-control" id="phone" name="phone" value="<?= htmlspecialchars($phone) ?>">
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label for="email">Email</label>
                                            <input type="email" class="form-control" id="email" name="email" value="<?= htmlspecialchars($email) ?>">
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="form-group">
                                    <label for="address">Address</label>
                                    <input type="text" class="form-control" id="address" name="address" value="<?= htmlspecialchars($address) ?>">
                                </div>
                                
                                <div class="row">
                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label for="city">City</label>
                                            <input type="text" class="form-control" id="city" name="city" value="<?= htmlspecialchars($city) ?>">
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label for="state">State</label>
                                            <input type="text" class="form-control" id="state" name="state" value="<?= htmlspecialchars($state) ?>">
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label for="zip">ZIP Code</label>
                                            <input type="text" class="form-control" id="zip" name="zip" value="<?= htmlspecialchars($zip) ?>">
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="form-group">
                                    <label for="notes">Notes</label>
                                    <textarea class="form-control" id="notes" name="notes" rows="3"><?= htmlspecialchars($notes) ?></textarea>
                                </div>
                            </div>
                            
                            <div class="card-footer">
                                <button type="submit" class="btn btn-primary">Save</button>
                                <a href="vendors.php" class="btn btn-default">Cancel</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<?php include_once '../includes/footer.php'; ?>
