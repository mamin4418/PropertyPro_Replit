
<?php
// Include header and sidebar
include_once '../includes/header.php';
include_once '../includes/sidebar.php';

// Include the Company model
require_once '../models/Company.php';

// Check if ID is provided
if (!isset($_GET['id']) || empty($_GET['id'])) {
    header("Location: companies.php");
    exit;
}

// Initialize Company object
$company = new Company();
$company->id = $_GET['id'];

// Get company details
if (!$company->read_single()) {
    header("Location: companies.php");
    exit;
}

// Initialize variables with company data
$name = $company->name;
$address = $company->address;
$city = $company->city;
$state = $company->state;
$zip = $company->zip;
$phone = $company->phone;
$email = $company->email;
$website = $company->website;
$notes = $company->notes;
$errors = [];

// Check if form is submitted
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Validate inputs
    if (empty($_POST['name'])) {
        $errors[] = 'Company name is required';
    } else {
        $name = trim($_POST['name']);
    }
    
    // Optional fields
    $address = !empty($_POST['address']) ? trim($_POST['address']) : '';
    $city = !empty($_POST['city']) ? trim($_POST['city']) : '';
    $state = !empty($_POST['state']) ? trim($_POST['state']) : '';
    $zip = !empty($_POST['zip']) ? trim($_POST['zip']) : '';
    $phone = !empty($_POST['phone']) ? trim($_POST['phone']) : '';
    $email = !empty($_POST['email']) ? trim($_POST['email']) : '';
    $website = !empty($_POST['website']) ? trim($_POST['website']) : '';
    $notes = !empty($_POST['notes']) ? trim($_POST['notes']) : '';
    
    // If email is provided, validate it
    if (!empty($email) && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Invalid email format';
    }
    
    // If no errors, update company
    if (empty($errors)) {
        $company->name = $name;
        $company->address = $address;
        $company->city = $city;
        $company->state = $state;
        $company->zip = $zip;
        $company->phone = $phone;
        $company->email = $email;
        $company->website = $website;
        $company->notes = $notes;
        
        if ($company->update()) {
            // Redirect to company view
            header("Location: view_company.php?id={$company->id}");
            exit;
        } else {
            $errors[] = 'Failed to update company';
        }
    }
}
?>

<div class="content-wrapper">
    <div class="content-header">
        <div class="container-fluid">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h1 class="m-0">Edit Company</h1>
                </div>
                <div class="col-sm-6">
                    <ol class="breadcrumb float-sm-right">
                        <li class="breadcrumb-item"><a href="../index.php">Home</a></li>
                        <li class="breadcrumb-item"><a href="companies.php">Companies</a></li>
                        <li class="breadcrumb-item active">Edit Company</li>
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
                            <h3 class="card-title">Company Information</h3>
                        </div>
                        
                        <form action="<?= htmlspecialchars($_SERVER['PHP_SELF']) . '?id=' . $company->id; ?>" method="post">
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
                                    <label for="name">Company Name *</label>
                                    <input type="text" class="form-control" id="name" name="name" value="<?= htmlspecialchars($name) ?>" required>
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
                                    <label for="website">Website</label>
                                    <input type="url" class="form-control" id="website" name="website" value="<?= htmlspecialchars($website) ?>">
                                </div>
                                
                                <div class="form-group">
                                    <label for="notes">Notes</label>
                                    <textarea class="form-control" id="notes" name="notes" rows="3"><?= htmlspecialchars($notes) ?></textarea>
                                </div>
                            </div>
                            
                            <div class="card-footer">
                                <button type="submit" class="btn btn-primary">Update</button>
                                <a href="view_company.php?id=<?= $company->id ?>" class="btn btn-default">Cancel</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<?php include_once '../includes/footer.php'; ?>
