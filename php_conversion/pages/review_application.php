
<?php
require_once '../includes/header.php';
require_once '../models/Application.php';
require_once '../models/ScreeningCriteria.php';
require_once '../models/Property.php';
require_once '../models/Unit.php';

// Initialize models
$applicationModel = new Application($mysqli);
$screeningModel = new ScreeningCriteria($mysqli);
$propertyModel = new Property($mysqli);
$unitModel = new Unit($mysqli);

// Get application ID from URL
$application_id = isset($_GET['id']) ? intval($_GET['id']) : 0;

// Verify application exists
$application = $applicationModel->getApplicationById($application_id);
if (!$application) {
    // Application not found, redirect to applications page
    header("Location: applications.php?error=Application not found");
    exit;
}

// Get property and unit information
$property = $propertyModel->getPropertyById($application['property_id']);
$unit = $unitModel->getUnitById($application['unit_id']);

// Get screening criteria
$criteria = $screeningModel->getAllCriteria();

// Process form submission
$success = '';
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $status = isset($_POST['status']) ? $_POST['status'] : '';
    $notes = isset($_POST['notes']) ? trim($_POST['notes']) : '';
    
    if (empty($status)) {
        $error = "Please select an application status";
    } else {
        $result = $applicationModel->updateApplicationStatus($application_id, $status, $notes);
        
        if ($result) {
            $success = "Application status updated successfully";
            // Refresh application data
            $application = $applicationModel->getApplicationById($application_id);
        } else {
            $error = "Failed to update application status";
        }
    }
}
?>

<div class="container-fluid">
    <h1 class="h3 mb-4 text-gray-800">Review Application</h1>
    
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
        <div class="col-lg-8">
            <!-- Application Details -->
            <div class="card shadow mb-4">
                <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                    <h6 class="m-0 font-weight-bold text-primary">Application #<?php echo $application['id']; ?></h6>
                    <div>
                        <span class="badge badge-<?php 
                            if ($application['status'] == 'pending') echo 'warning';
                            elseif ($application['status'] == 'approved') echo 'success';
                            elseif ($application['status'] == 'denied') echo 'danger';
                            else echo 'secondary';
                        ?>">
                            <?php echo ucfirst($application['status']); ?>
                        </span>
                    </div>
                </div>
                <div class="card-body">
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <p><strong>Applicant Name:</strong> <?php echo $application['first_name'] . ' ' . $application['last_name']; ?></p>
                            <p><strong>Email:</strong> <?php echo $application['email']; ?></p>
                            <p><strong>Phone:</strong> <?php echo $application['phone']; ?></p>
                        </div>
                        <div class="col-md-6">
                            <p><strong>Property:</strong> <?php echo $property['name']; ?></p>
                            <p><strong>Unit:</strong> <?php echo $unit['unit_number']; ?></p>
                            <p><strong>Application Date:</strong> <?php echo date('M d, Y', strtotime($application['application_date'])); ?></p>
                        </div>
                    </div>
                    
                    <h5 class="mt-4 mb-3">Personal Information</h5>
                    <div class="row">
                        <div class="col-md-6">
                            <p><strong>Date of Birth:</strong> <?php echo $application['date_of_birth'] ? date('M d, Y', strtotime($application['date_of_birth'])) : 'N/A'; ?></p>
                            <p><strong>SSN (Last 4):</strong> <?php echo $application['ssn_last_four'] ? 'XXXX-XX-' . $application['ssn_last_four'] : 'N/A'; ?></p>
                            <p><strong>Driver's License:</strong> <?php echo $application['drivers_license'] ?: 'N/A'; ?></p>
                        </div>
                        <div class="col-md-6">
                            <p><strong>Current Address:</strong> <?php echo $application['current_address'] ?: 'N/A'; ?></p>
                            <p><strong>City/State/ZIP:</strong> <?php echo ($application['current_city'] ? $application['current_city'] . ', ' : '') . 
                                ($application['current_state'] ? $application['current_state'] . ' ' : '') . 
                                ($application['current_zip'] ?: ''); ?></p>
                            <p><strong>Time at Address:</strong> <?php echo $application['years_at_address'] ? $application['years_at_address'] . ' years' : 'N/A'; ?></p>
                        </div>
                    </div>
                    
                    <h5 class="mt-4 mb-3">Employment Information</h5>
                    <div class="row">
                        <div class="col-md-6">
                            <p><strong>Employer:</strong> <?php echo $application['employer_name'] ?: 'N/A'; ?></p>
                            <p><strong>Position:</strong> <?php echo $application['position'] ?: 'N/A'; ?></p>
                            <p><strong>Duration:</strong> <?php echo $application['employment_duration'] ? $application['employment_duration'] . ' years' : 'N/A'; ?></p>
                        </div>
                        <div class="col-md-6">
                            <p><strong>Monthly Income:</strong> <?php echo $application['monthly_income'] ? '$' . number_format($application['monthly_income'], 2) : 'N/A'; ?></p>
                            <p><strong>Supervisor:</strong> <?php echo $application['supervisor_name'] ?: 'N/A'; ?></p>
                            <p><strong>Supervisor Phone:</strong> <?php echo $application['supervisor_phone'] ?: 'N/A'; ?></p>
                        </div>
                    </div>
                    
                    <h5 class="mt-4 mb-3">Rental History</h5>
                    <div class="row">
                        <div class="col-md-6">
                            <p><strong>Previous Landlord:</strong> <?php echo $application['previous_landlord_name'] ?: 'N/A'; ?></p>
                            <p><strong>Landlord Phone:</strong> <?php echo $application['previous_landlord_phone'] ?: 'N/A'; ?></p>
                        </div>
                        <div class="col-md-6">
                            <p><strong>Previous Rent:</strong> <?php echo $application['previous_rent'] ? '$' . number_format($application['previous_rent'], 2) : 'N/A'; ?></p>
                            <p><strong>Reason for Leaving:</strong> <?php echo $application['reason_for_leaving'] ?: 'N/A'; ?></p>
                        </div>
                    </div>
                    
                    <h5 class="mt-4 mb-3">References</h5>
                    <div class="row">
                        <div class="col-md-6">
                            <p><strong>Reference 1:</strong> <?php echo $application['reference1_name'] ?: 'N/A'; ?></p>
                            <p><strong>Relationship:</strong> <?php echo $application['reference1_relationship'] ?: 'N/A'; ?></p>
                            <p><strong>Phone:</strong> <?php echo $application['reference1_phone'] ?: 'N/A'; ?></p>
                        </div>
                        <div class="col-md-6">
                            <p><strong>Reference 2:</strong> <?php echo $application['reference2_name'] ?: 'N/A'; ?></p>
                            <p><strong>Relationship:</strong> <?php echo $application['reference2_relationship'] ?: 'N/A'; ?></p>
                            <p><strong>Phone:</strong> <?php echo $application['reference2_phone'] ?: 'N/A'; ?></p>
                        </div>
                    </div>
                    
                    <h5 class="mt-4 mb-3">Additional Information</h5>
                    <div class="row">
                        <div class="col-md-12">
                            <p><strong>Pets:</strong> <?php echo $application['has_pets'] ? 'Yes' : 'No'; ?></p>
                            <?php if ($application['has_pets']): ?>
                                <p><strong>Pet Details:</strong> <?php echo $application['pet_details'] ?: 'N/A'; ?></p>
                            <?php endif; ?>
                            <p><strong>Vehicles:</strong> <?php echo $application['vehicle_make'] ?: 'N/A'; ?> 
                                <?php echo $application['vehicle_model'] ? $application['vehicle_model'] : ''; ?> 
                                <?php echo $application['vehicle_year'] ? '(' . $application['vehicle_year'] . ')' : ''; ?></p>
                            <p><strong>Smoker:</strong> <?php echo $application['is_smoker'] ? 'Yes' : 'No'; ?></p>
                            <p><strong>Evicted:</strong> <?php echo $application['has_been_evicted'] ? 'Yes' : 'No'; ?></p>
                            <?php if ($application['has_been_evicted']): ?>
                                <p><strong>Eviction Details:</strong> <?php echo $application['eviction_details'] ?: 'N/A'; ?></p>
                            <?php endif; ?>
                            <p><strong>Criminal Record:</strong> <?php echo $application['has_criminal_record'] ? 'Yes' : 'No'; ?></p>
                            <?php if ($application['has_criminal_record']): ?>
                                <p><strong>Criminal Record Details:</strong> <?php echo $application['criminal_record_details'] ?: 'N/A'; ?></p>
                            <?php endif; ?>
                        </div>
                    </div>
                    
                    <h5 class="mt-4 mb-3">Application Notes</h5>
                    <div class="row">
                        <div class="col-md-12">
                            <div class="p-3 bg-light rounded">
                                <?php echo nl2br($application['notes'] ?: 'No notes available.'); ?>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="col-lg-4">
            <!-- Screening Checklist -->
            <div class="card shadow mb-4">
                <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">Screening Checklist</h6>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Criteria</th>
                                    <th>Requirement</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($criteria as $criterion): ?>
                                    <tr>
                                        <td><?php echo $criterion['name']; ?></td>
                                        <td><?php echo $criterion['description']; ?></td>
                                        <td>
                                            <div class="form-check">
                                                <input class="form-check-input screening-check" type="checkbox" 
                                                       id="criterion_<?php echo $criterion['id']; ?>">
                                            </div>
                                        </td>
                                    </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            <!-- Update Status -->
            <div class="card shadow mb-4">
                <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">Update Application Status</h6>
                </div>
                <div class="card-body">
                    <form method="POST" action="">
                        <div class="form-group">
                            <label for="status">Application Status</label>
                            <select class="form-control" id="status" name="status" required>
                                <option value="">Select status</option>
                                <option value="pending" <?php echo ($application['status'] == 'pending') ? 'selected' : ''; ?>>Pending</option>
                                <option value="under_review" <?php echo ($application['status'] == 'under_review') ? 'selected' : ''; ?>>Under Review</option>
                                <option value="approved" <?php echo ($application['status'] == 'approved') ? 'selected' : ''; ?>>Approved</option>
                                <option value="denied" <?php echo ($application['status'] == 'denied') ? 'selected' : ''; ?>>Denied</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="notes">Notes</label>
                            <textarea class="form-control" id="notes" name="notes" rows="4"><?php echo $application['notes']; ?></textarea>
                        </div>
                        
                        <button type="submit" class="btn btn-primary btn-block">
                            <i class="fas fa-save"></i> Update Status
                        </button>
                    </form>
                    
                    <div class="mt-3">
                        <a href="applications.php" class="btn btn-secondary btn-block">
                            <i class="fas fa-arrow-left"></i> Back to Applications
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
$(document).ready(function() {
    // Add interactivity for screening checklist
    $('.screening-check').change(function() {
        updateScreeningProgress();
    });
    
    function updateScreeningProgress() {
        const totalCriteria = $('.screening-check').length;
        const checkedCriteria = $('.screening-check:checked').length;
        const percentage = Math.round((checkedCriteria / totalCriteria) * 100);
        
        // You could update a progress bar here if needed
        console.log(`Screening progress: ${percentage}%`);
    }
});
</script>

<?php require_once '../includes/footer.php'; ?>
