
<?php
require_once '../includes/header.php';
require_once '../models/Company.php';
require_once '../models/Setting.php';

// Initialize models
$companyModel = new Company($mysqli);
$settingModel = new Setting($mysqli);

// Process form submission
$success = '';
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Validate and sanitize inputs
    $company_name = isset($_POST['company_name']) ? trim($_POST['company_name']) : '';
    $legal_name = isset($_POST['legal_name']) ? trim($_POST['legal_name']) : '';
    $ein = isset($_POST['ein']) ? trim($_POST['ein']) : '';
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
    $address = isset($_POST['address']) ? trim($_POST['address']) : '';
    $city = isset($_POST['city']) ? trim($_POST['city']) : '';
    $state = isset($_POST['state']) ? trim($_POST['state']) : '';
    $zipcode = isset($_POST['zipcode']) ? trim($_POST['zipcode']) : '';
    $country = isset($_POST['country']) ? trim($_POST['country']) : '';
    $website = isset($_POST['website']) ? trim($_POST['website']) : '';
    $company_type = isset($_POST['company_type']) ? trim($_POST['company_type']) : '';
    $tax_id = isset($_POST['tax_id']) ? trim($_POST['tax_id']) : '';
    $logo = isset($_POST['logo']) ? trim($_POST['logo']) : '';

    // Validate email if provided
    if (!empty($email) && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = "Please enter a valid email address";
    } else {
        // Update company information
        $result = $companyModel->updateCompanySettings([
            'company_name' => $company_name,
            'legal_name' => $legal_name,
            'ein' => $ein,
            'email' => $email,
            'phone' => $phone,
            'address' => $address,
            'city' => $city,
            'state' => $state,
            'zipcode' => $zipcode,
            'country' => $country,
            'website' => $website,
            'company_type' => $company_type,
            'tax_id' => $tax_id,
            'logo' => $logo
        ]);

        if ($result) {
            $success = "Company settings updated successfully";
        } else {
            $error = "Failed to update company settings. Please try again.";
        }
    }
}

// Get current company information
$company = $companyModel->getCompanyDetails();

// Get current settings
$settings = $settingModel->getAllSettings();
?>

<div class="container-fluid">
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 class="h3 mb-0 text-gray-800">Company Settings</h1>
    </div>

    <?php if (!empty($success)): ?>
        <div class="alert alert-success" role="alert">
            <?php echo $success; ?>
        </div>
    <?php endif; ?>

    <?php if (!empty($error)): ?>
        <div class="alert alert-danger" role="alert">
            <?php echo $error; ?>
        </div>
    <?php endif; ?>

    <div class="row">
        <div class="col-lg-12">
            <div class="card shadow mb-4">
                <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                    <h6 class="m-0 font-weight-bold text-primary">Company Information</h6>
                </div>
                <div class="card-body">
                    <ul class="nav nav-tabs" id="companyTabs" role="tablist">
                        <li class="nav-item">
                            <a class="nav-link active" id="basic-tab" data-toggle="tab" href="#basic" role="tab" aria-controls="basic" aria-selected="true">Basic Information</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" id="contact-tab" data-toggle="tab" href="#contact" role="tab" aria-controls="contact" aria-selected="false">Contact Information</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" id="branding-tab" data-toggle="tab" href="#branding" role="tab" aria-controls="branding" aria-selected="false">Branding</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" id="legal-tab" data-toggle="tab" href="#legal" role="tab" aria-controls="legal" aria-selected="false">Legal Information</a>
                        </li>
                    </ul>
                    <div class="tab-content" id="companyTabContent">
                        <div class="tab-pane fade show active p-3" id="basic" role="tabpanel" aria-labelledby="basic-tab">
                            <form method="POST" action="">
                                <div class="form-group">
                                    <label for="company_name">Company Name</label>
                                    <input type="text" class="form-control" id="company_name" name="company_name" value="<?php echo isset($company['company_name']) ? $company['company_name'] : ''; ?>" required>
                                </div>
                                <div class="form-group">
                                    <label for="legal_name">Legal Name</label>
                                    <input type="text" class="form-control" id="legal_name" name="legal_name" value="<?php echo isset($company['legal_name']) ? $company['legal_name'] : ''; ?>">
                                </div>
                                <div class="form-group">
                                    <label for="company_type">Company Type</label>
                                    <select class="form-control" id="company_type" name="company_type">
                                        <?php
                                        $types = ['LLC', 'Corporation', 'Partnership', 'Sole Proprietorship', 'S Corporation', 'Non-Profit', 'Other'];
                                        $currentType = isset($company['company_type']) ? $company['company_type'] : '';
                                        foreach ($types as $type) {
                                            echo '<option value="' . $type . '"' . ($currentType == $type ? ' selected' : '') . '>' . $type . '</option>';
                                        }
                                        ?>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="website">Website</label>
                                    <input type="url" class="form-control" id="website" name="website" value="<?php echo isset($company['website']) ? $company['website'] : ''; ?>">
                                </div>
                                <button type="submit" class="btn btn-primary">Save Basic Information</button>
                            </form>
                        </div>
                        <div class="tab-pane fade p-3" id="contact" role="tabpanel" aria-labelledby="contact-tab">
                            <form method="POST" action="">
                                <div class="form-group">
                                    <label for="email">Email</label>
                                    <input type="email" class="form-control" id="email" name="email" value="<?php echo isset($company['email']) ? $company['email'] : ''; ?>">
                                </div>
                                <div class="form-group">
                                    <label for="phone">Phone</label>
                                    <input type="tel" class="form-control" id="phone" name="phone" value="<?php echo isset($company['phone']) ? $company['phone'] : ''; ?>">
                                </div>
                                <div class="form-group">
                                    <label for="address">Address</label>
                                    <input type="text" class="form-control" id="address" name="address" value="<?php echo isset($company['address']) ? $company['address'] : ''; ?>">
                                </div>
                                <div class="form-row">
                                    <div class="form-group col-md-6">
                                        <label for="city">City</label>
                                        <input type="text" class="form-control" id="city" name="city" value="<?php echo isset($company['city']) ? $company['city'] : ''; ?>">
                                    </div>
                                    <div class="form-group col-md-4">
                                        <label for="state">State/Province</label>
                                        <input type="text" class="form-control" id="state" name="state" value="<?php echo isset($company['state']) ? $company['state'] : ''; ?>">
                                    </div>
                                    <div class="form-group col-md-2">
                                        <label for="zipcode">Zip/Postal Code</label>
                                        <input type="text" class="form-control" id="zipcode" name="zipcode" value="<?php echo isset($company['zipcode']) ? $company['zipcode'] : ''; ?>">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="country">Country</label>
                                    <select class="form-control" id="country" name="country">
                                        <?php
                                        $countries = ['United States', 'Canada', 'Mexico', 'United Kingdom', 'Australia', 'Germany', 'France', 'Japan', 'China', 'Other'];
                                        $currentCountry = isset($company['country']) ? $company['country'] : 'United States';
                                        foreach ($countries as $country) {
                                            echo '<option value="' . $country . '"' . ($currentCountry == $country ? ' selected' : '') . '>' . $country . '</option>';
                                        }
                                        ?>
                                    </select>
                                </div>
                                <button type="submit" class="btn btn-primary">Save Contact Information</button>
                            </form>
                        </div>
                        <div class="tab-pane fade p-3" id="branding" role="tabpanel" aria-labelledby="branding-tab">
                            <form method="POST" action="" enctype="multipart/form-data">
                                <div class="form-group">
                                    <label>Company Logo</label>
                                    <div class="mb-3">
                                        <?php if (isset($company['logo']) && !empty($company['logo'])): ?>
                                            <img src="<?php echo $company['logo']; ?>" alt="Company Logo" class="img-thumbnail" style="max-width: 200px;">
                                        <?php else: ?>
                                            <p>No logo uploaded</p>
                                        <?php endif; ?>
                                    </div>
                                    <div class="custom-file">
                                        <input type="file" class="custom-file-input" id="logo_upload" name="logo_upload">
                                        <label class="custom-file-label" for="logo_upload">Choose file</label>
                                    </div>
                                    <small class="form-text text-muted">Recommended size: 200x200 pixels. Supported formats: JPG, PNG, GIF.</small>
                                </div>
                                <div class="form-group">
                                    <label for="primary_color">Primary Brand Color</label>
                                    <input type="color" class="form-control" id="primary_color" name="primary_color" value="<?php echo isset($company['primary_color']) ? $company['primary_color'] : '#4e73df'; ?>" style="height: 40px;">
                                </div>
                                <div class="form-group">
                                    <label for="secondary_color">Secondary Brand Color</label>
                                    <input type="color" class="form-control" id="secondary_color" name="secondary_color" value="<?php echo isset($company['secondary_color']) ? $company['secondary_color'] : '#858796'; ?>" style="height: 40px;">
                                </div>
                                <div class="form-group">
                                    <label for="email_signature">Default Email Signature</label>
                                    <textarea class="form-control" id="email_signature" name="email_signature" rows="4"><?php echo isset($company['email_signature']) ? $company['email_signature'] : ''; ?></textarea>
                                </div>
                                <button type="submit" class="btn btn-primary">Save Branding Settings</button>
                            </form>
                        </div>
                        <div class="tab-pane fade p-3" id="legal" role="tabpanel" aria-labelledby="legal-tab">
                            <form method="POST" action="">
                                <div class="form-group">
                                    <label for="ein">EIN (Employer Identification Number)</label>
                                    <input type="text" class="form-control" id="ein" name="ein" value="<?php echo isset($company['ein']) ? $company['ein'] : ''; ?>">
                                    <small class="form-text text-muted">This information is encrypted and secured.</small>
                                </div>
                                <div class="form-group">
                                    <label for="tax_id">Tax ID</label>
                                    <input type="text" class="form-control" id="tax_id" name="tax_id" value="<?php echo isset($company['tax_id']) ? $company['tax_id'] : ''; ?>">
                                    <small class="form-text text-muted">This information is encrypted and secured.</small>
                                </div>
                                <div class="form-group">
                                    <label for="business_license">Business License Number</label>
                                    <input type="text" class="form-control" id="business_license" name="business_license" value="<?php echo isset($company['business_license']) ? $company['business_license'] : ''; ?>">
                                </div>
                                <div class="form-group">
                                    <label for="business_license_expiry">Business License Expiration</label>
                                    <input type="date" class="form-control" id="business_license_expiry" name="business_license_expiry" value="<?php echo isset($company['business_license_expiry']) ? $company['business_license_expiry'] : ''; ?>">
                                </div>
                                <div class="form-group">
                                    <label for="legal_disclaimer">Legal Disclaimer</label>
                                    <textarea class="form-control" id="legal_disclaimer" name="legal_disclaimer" rows="4"><?php echo isset($company['legal_disclaimer']) ? $company['legal_disclaimer'] : ''; ?></textarea>
                                    <small class="form-text text-muted">This disclaimer will appear on documents and reports.</small>
                                </div>
                                <button type="submit" class="btn btn-primary">Save Legal Information</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
    // Update file input label with selected file name
    document.getElementById('logo_upload').addEventListener('change', function() {
        var fileName = this.files[0].name;
        var nextSibling = this.nextElementSibling;
        nextSibling.innerText = fileName;
    });
</script>

<?php require_once '../includes/footer.php'; ?>
