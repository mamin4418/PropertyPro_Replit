
<?php
require_once '../includes/header.php';
require_once '../models/Setting.php';

// Initialize models
$settingModel = new Setting($mysqli);

// Process form submission
$success = '';
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Application fee
    $application_fee = isset($_POST['application_fee']) ? floatval($_POST['application_fee']) : 0;
    
    // Application fields configuration
    $required_fields = isset($_POST['required_fields']) ? $_POST['required_fields'] : [];
    $required_fields_json = json_encode($required_fields);
    
    // Background check settings
    $enable_background_check = isset($_POST['enable_background_check']) ? 1 : 0;
    $background_check_provider = isset($_POST['background_check_provider']) ? $_POST['background_check_provider'] : '';
    
    // Credit check settings
    $enable_credit_check = isset($_POST['enable_credit_check']) ? 1 : 0;
    $minimum_credit_score = isset($_POST['minimum_credit_score']) ? intval($_POST['minimum_credit_score']) : 0;
    
    // Income requirements
    $income_requirement_multiplier = isset($_POST['income_requirement_multiplier']) ? floatval($_POST['income_requirement_multiplier']) : 3.0;
    
    // Save settings
    $settingModel->saveSetting('application_fee', $application_fee);
    $settingModel->saveSetting('required_application_fields', $required_fields_json);
    $settingModel->saveSetting('enable_background_check', $enable_background_check);
    $settingModel->saveSetting('background_check_provider', $background_check_provider);
    $settingModel->saveSetting('enable_credit_check', $enable_credit_check);
    $settingModel->saveSetting('minimum_credit_score', $minimum_credit_score);
    $settingModel->saveSetting('income_requirement_multiplier', $income_requirement_multiplier);
    
    $success = "Application settings updated successfully";
}

// Get current settings
$application_fee = $settingModel->getSetting('application_fee', 50.00);
$required_fields_json = $settingModel->getSetting('required_application_fields', '[]');
$required_fields = json_decode($required_fields_json, true);
$enable_background_check = $settingModel->getSetting('enable_background_check', 0);
$background_check_provider = $settingModel->getSetting('background_check_provider', '');
$enable_credit_check = $settingModel->getSetting('enable_credit_check', 0);
$minimum_credit_score = $settingModel->getSetting('minimum_credit_score', 620);
$income_requirement_multiplier = $settingModel->getSetting('income_requirement_multiplier', 3.0);
?>

<div class="container-fluid">
    <h1 class="h3 mb-4 text-gray-800">Application Settings</h1>
    
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

    <div class="card shadow mb-4">
        <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">Configure Application Settings</h6>
        </div>
        <div class="card-body">
            <form method="POST" action="">
                <div class="row">
                    <div class="col-lg-6">
                        <div class="card mb-4">
                            <div class="card-header">
                                General Settings
                            </div>
                            <div class="card-body">
                                <div class="form-group">
                                    <label for="application_fee">Application Fee ($)</label>
                                    <input type="number" class="form-control" id="application_fee" name="application_fee" 
                                           value="<?php echo $application_fee; ?>" step="0.01" min="0">
                                </div>
                                
                                <div class="form-group">
                                    <label>Required Application Fields</label>
                                    <div class="custom-control custom-checkbox">
                                        <input type="checkbox" class="custom-control-input" id="field_ssn" name="required_fields[]" 
                                               value="ssn" <?php echo in_array('ssn', $required_fields) ? 'checked' : ''; ?>>
                                        <label class="custom-control-label" for="field_ssn">Social Security Number</label>
                                    </div>
                                    <div class="custom-control custom-checkbox">
                                        <input type="checkbox" class="custom-control-input" id="field_driver_license" name="required_fields[]" 
                                               value="driver_license" <?php echo in_array('driver_license', $required_fields) ? 'checked' : ''; ?>>
                                        <label class="custom-control-label" for="field_driver_license">Driver's License</label>
                                    </div>
                                    <div class="custom-control custom-checkbox">
                                        <input type="checkbox" class="custom-control-input" id="field_employment" name="required_fields[]" 
                                               value="employment" <?php echo in_array('employment', $required_fields) ? 'checked' : ''; ?>>
                                        <label class="custom-control-label" for="field_employment">Employment Information</label>
                                    </div>
                                    <div class="custom-control custom-checkbox">
                                        <input type="checkbox" class="custom-control-input" id="field_rental_history" name="required_fields[]" 
                                               value="rental_history" <?php echo in_array('rental_history', $required_fields) ? 'checked' : ''; ?>>
                                        <label class="custom-control-label" for="field_rental_history">Rental History</label>
                                    </div>
                                    <div class="custom-control custom-checkbox">
                                        <input type="checkbox" class="custom-control-input" id="field_references" name="required_fields[]" 
                                               value="references" <?php echo in_array('references', $required_fields) ? 'checked' : ''; ?>>
                                        <label class="custom-control-label" for="field_references">References</label>
                                    </div>
                                    <div class="custom-control custom-checkbox">
                                        <input type="checkbox" class="custom-control-input" id="field_vehicle" name="required_fields[]" 
                                               value="vehicle" <?php echo in_array('vehicle', $required_fields) ? 'checked' : ''; ?>>
                                        <label class="custom-control-label" for="field_vehicle">Vehicle Information</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-lg-6">
                        <div class="card mb-4">
                            <div class="card-header">
                                Screening Settings
                            </div>
                            <div class="card-body">
                                <div class="form-group">
                                    <div class="custom-control custom-switch">
                                        <input type="checkbox" class="custom-control-input" id="enable_background_check" name="enable_background_check" 
                                               <?php echo $enable_background_check ? 'checked' : ''; ?>>
                                        <label class="custom-control-label" for="enable_background_check">Enable Background Checks</label>
                                    </div>
                                </div>
                                
                                <div class="form-group">
                                    <label for="background_check_provider">Background Check Provider</label>
                                    <select class="form-control" id="background_check_provider" name="background_check_provider" 
                                            <?php echo !$enable_background_check ? 'disabled' : ''; ?>>
                                        <option value="">Select Provider</option>
                                        <option value="checkr" <?php echo $background_check_provider == 'checkr' ? 'selected' : ''; ?>>Checkr</option>
                                        <option value="goodhire" <?php echo $background_check_provider == 'goodhire' ? 'selected' : ''; ?>>GoodHire</option>
                                        <option value="verify" <?php echo $background_check_provider == 'verify' ? 'selected' : ''; ?>>Verify</option>
                                        <option value="manual" <?php echo $background_check_provider == 'manual' ? 'selected' : ''; ?>>Manual Process</option>
                                    </select>
                                </div>
                                
                                <div class="form-group mt-4">
                                    <div class="custom-control custom-switch">
                                        <input type="checkbox" class="custom-control-input" id="enable_credit_check" name="enable_credit_check" 
                                               <?php echo $enable_credit_check ? 'checked' : ''; ?>>
                                        <label class="custom-control-label" for="enable_credit_check">Enable Credit Checks</label>
                                    </div>
                                </div>
                                
                                <div class="form-group">
                                    <label for="minimum_credit_score">Minimum Credit Score</label>
                                    <input type="number" class="form-control" id="minimum_credit_score" name="minimum_credit_score" 
                                           value="<?php echo $minimum_credit_score; ?>" min="300" max="850" 
                                           <?php echo !$enable_credit_check ? 'disabled' : ''; ?>>
                                </div>
                                
                                <div class="form-group mt-4">
                                    <label for="income_requirement_multiplier">Income Requirement (x monthly rent)</label>
                                    <select class="form-control" id="income_requirement_multiplier" name="income_requirement_multiplier">
                                        <option value="2.0" <?php echo $income_requirement_multiplier == 2.0 ? 'selected' : ''; ?>>2.0x</option>
                                        <option value="2.5" <?php echo $income_requirement_multiplier == 2.5 ? 'selected' : ''; ?>>2.5x</option>
                                        <option value="3.0" <?php echo $income_requirement_multiplier == 3.0 ? 'selected' : ''; ?>>3.0x</option>
                                        <option value="3.5" <?php echo $income_requirement_multiplier == 3.5 ? 'selected' : ''; ?>>3.5x</option>
                                        <option value="4.0" <?php echo $income_requirement_multiplier == 4.0 ? 'selected' : ''; ?>>4.0x</option>
                                    </select>
                                    <small class="form-text text-muted">
                                        Applicants must earn this multiple of the monthly rent to qualify.
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="form-group">
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-save"></i> Save Settings
                    </button>
                    <a href="applications.php" class="btn btn-secondary ml-2">
                        <i class="fas fa-arrow-left"></i> Back to Applications
                    </a>
                </div>
            </form>
        </div>
    </div>
</div>

<script>
$(document).ready(function() {
    // Toggle background check provider field
    $('#enable_background_check').change(function() {
        $('#background_check_provider').prop('disabled', !this.checked);
    });
    
    // Toggle credit score field
    $('#enable_credit_check').change(function() {
        $('#minimum_credit_score').prop('disabled', !this.checked);
    });
});
</script>

<?php require_once '../includes/footer.php'; ?>
