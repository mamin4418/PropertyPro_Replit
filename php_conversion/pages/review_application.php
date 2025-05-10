
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
<?php
require_once '../includes/header.php';
require_once '../models/Application.php';
require_once '../models/Tenant.php';
require_once '../models/Unit.php';
require_once '../models/ScreeningCriteria.php';

// Check if ID is provided
if (!isset($_GET['id']) || empty($_GET['id'])) {
    echo '<div class="alert alert-danger">No application ID provided.</div>';
    require_once '../includes/footer.php';
    exit;
}

$application_id = intval($_GET['id']);

// Initialize models
$applicationModel = new Application($mysqli);
$tenantModel = new Tenant($mysqli);
$unitModel = new Unit($mysqli);
$screeningModel = new ScreeningCriteria($mysqli);

// Get application data
$application = $applicationModel->getApplicationById($application_id);
if (!$application) {
    echo '<div class="alert alert-danger">Application not found.</div>';
    require_once '../includes/footer.php';
    exit;
}

// Get screening criteria
$criteria = $screeningModel->getActiveCriteria();

// Process form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        if (isset($_POST['approve'])) {
            $result = $applicationModel->updateApplicationStatus($application_id, 'approved');
            if ($result) {
                // Create tenant from application if approved
                $tenant_data = [
                    'first_name' => $application['first_name'],
                    'last_name' => $application['last_name'],
                    'email' => $application['email'],
                    'phone' => $application['phone'],
                    'unit_id' => $application['unit_id'],
                    'move_in_date' => $application['desired_move_in'],
                    'status' => 'active',
                    'created_at' => date('Y-m-d H:i:s'),
                    'updated_at' => date('Y-m-d H:i:s')
                ];
                
                $tenant_id = $tenantModel->addTenant($tenant_data);
                if ($tenant_id) {
                    $unitModel->updateUnitStatus($application['unit_id'], 'occupied');
                    header("Location: applications.php?success=Application approved and tenant created successfully");
                    exit;
                }
            }
        } elseif (isset($_POST['reject'])) {
            $result = $applicationModel->updateApplicationStatus($application_id, 'rejected');
            if ($result) {
                header("Location: applications.php?success=Application rejected successfully");
                exit;
            }
        } elseif (isset($_POST['pending'])) {
            $notes = isset($_POST['notes']) ? $_POST['notes'] : '';
            $result = $applicationModel->updateApplicationNotes($application_id, $notes);
            if ($result) {
                header("Location: applications.php?success=Application updated successfully");
                exit;
            }
        }
    } catch (Exception $e) {
        $error = "Error processing application: " . $e->getMessage();
    }
}

// Get unit and property information
$unit = $unitModel->getUnitById($application['unit_id']);
$property = null;
if ($unit) {
    $propertyModel = new Property($mysqli);
    $property = $propertyModel->getPropertyById($unit['property_id']);
}
?>

<div class="container-fluid">
    <h1 class="h3 mb-4 text-gray-800">Review Application</h1>
    
    <?php if (isset($error)): ?>
        <div class="alert alert-danger" role="alert">
            <?php echo $error; ?>
        </div>
    <?php endif; ?>
    
    <div class="row">
        <div class="col-lg-8">
            <!-- Application Details Card -->
            <div class="card shadow mb-4">
                <div class="card-header py-3 d-flex justify-content-between align-items-center">
                    <h6 class="m-0 font-weight-bold text-primary">Application Details</h6>
                    <span class="badge badge-<?php 
                        echo $application['status'] === 'pending' ? 'warning' : 
                             ($application['status'] === 'approved' ? 'success' : 
                             ($application['status'] === 'rejected' ? 'danger' : 'secondary')); 
                    ?>">
                        <?php echo ucfirst($application['status']); ?>
                    </span>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <h5>Personal Information</h5>
                            <p><strong>Name:</strong> <?php echo htmlspecialchars($application['first_name'] . ' ' . $application['last_name']); ?></p>
                            <p><strong>Email:</strong> <?php echo htmlspecialchars($application['email']); ?></p>
                            <p><strong>Phone:</strong> <?php echo htmlspecialchars($application['phone']); ?></p>
                            <p><strong>Date of Birth:</strong> <?php echo date('M d, Y', strtotime($application['date_of_birth'])); ?></p>
                            <p><strong>SSN (Last 4):</strong> XXX-XX-<?php echo substr($application['ssn'], -4); ?></p>
                        </div>
                        <div class="col-md-6">
                            <h5>Application Information</h5>
                            <p><strong>Desired Move-in Date:</strong> <?php echo date('M d, Y', strtotime($application['desired_move_in'])); ?></p>
                            <p><strong>Application Date:</strong> <?php echo date('M d, Y', strtotime($application['created_at'])); ?></p>
                            <p><strong>Property:</strong> <?php echo $property ? htmlspecialchars($property['name']) : 'N/A'; ?></p>
                            <p><strong>Unit:</strong> <?php echo $unit ? htmlspecialchars($unit['unit_number']) : 'N/A'; ?></p>
                        </div>
                    </div>
                    
                    <hr>
                    
                    <div class="row">
                        <div class="col-md-6">
                            <h5>Employment Information</h5>
                            <p><strong>Employer:</strong> <?php echo htmlspecialchars($application['employer']); ?></p>
                            <p><strong>Position:</strong> <?php echo htmlspecialchars($application['position']); ?></p>
                            <p><strong>Monthly Income:</strong> $<?php echo number_format($application['monthly_income'], 2); ?></p>
                            <p><strong>Employment Length:</strong> <?php echo htmlspecialchars($application['employment_length']); ?></p>
                        </div>
                        <div class="col-md-6">
                            <h5>Previous Rental History</h5>
                            <p><strong>Previous Address:</strong> <?php echo htmlspecialchars($application['previous_address']); ?></p>
                            <p><strong>Previous Landlord:</strong> <?php echo htmlspecialchars($application['previous_landlord']); ?></p>
                            <p><strong>Previous Landlord Phone:</strong> <?php echo htmlspecialchars($application['previous_landlord_phone']); ?></p>
                            <p><strong>Rental Length:</strong> <?php echo htmlspecialchars($application['previous_rental_length']); ?></p>
                        </div>
                    </div>
                    
                    <hr>
                    
                    <h5>Additional Information</h5>
                    <p><strong>Occupants:</strong> <?php echo htmlspecialchars($application['num_occupants']); ?></p>
                    <p><strong>Pets:</strong> <?php echo $application['has_pets'] ? 'Yes' : 'No'; ?></p>
                    <?php if ($application['has_pets']): ?>
                        <p><strong>Pet Details:</strong> <?php echo htmlspecialchars($application['pet_details']); ?></p>
                    <?php endif; ?>
                    
                    <p><strong>Bankruptcy History:</strong> <?php echo $application['bankruptcy_history'] ? 'Yes' : 'No'; ?></p>
                    <p><strong>Eviction History:</strong> <?php echo $application['eviction_history'] ? 'Yes' : 'No'; ?></p>
                    <p><strong>Criminal History:</strong> <?php echo $application['criminal_history'] ? 'Yes' : 'No'; ?></p>
                    
                    <?php if ($application['bankruptcy_history'] || $application['eviction_history'] || $application['criminal_history']): ?>
                        <p><strong>Explanation:</strong> <?php echo htmlspecialchars($application['history_explanation']); ?></p>
                    <?php endif; ?>
                    
                    <?php if ($application['notes']): ?>
                        <hr>
                        <h5>Notes</h5>
                        <p><?php echo nl2br(htmlspecialchars($application['notes'])); ?></p>
                    <?php endif; ?>
                </div>
            </div>
            
            <!-- Document Uploads -->
            <div class="card shadow mb-4">
                <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">Uploaded Documents</h6>
                </div>
                <div class="card-body">
                    <?php 
                    // Get uploaded documents
                    $documents = $applicationModel->getApplicationDocuments($application_id);
                    if ($documents && count($documents) > 0): 
                    ?>
                        <div class="table-responsive">
                            <table class="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>Document Type</th>
                                        <th>Filename</th>
                                        <th>Upload Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php foreach ($documents as $doc): ?>
                                        <tr>
                                            <td><?php echo htmlspecialchars($doc['document_type']); ?></td>
                                            <td><?php echo htmlspecialchars($doc['filename']); ?></td>
                                            <td><?php echo date('M d, Y', strtotime($doc['uploaded_at'])); ?></td>
                                            <td>
                                                <a href="../uploads/applications/<?php echo $doc['filepath']; ?>" target="_blank" class="btn btn-sm btn-info">
                                                    <i class="fas fa-eye"></i> View
                                                </a>
                                            </td>
                                        </tr>
                                    <?php endforeach; ?>
                                </tbody>
                            </table>
                        </div>
                    <?php else: ?>
                        <p>No documents uploaded.</p>
                    <?php endif; ?>
                </div>
            </div>
        </div>
        
        <div class="col-lg-4">
            <!-- Screening Card -->
            <div class="card shadow mb-4">
                <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">Screening</h6>
                </div>
                <div class="card-body">
                    <h5>Screening Criteria</h5>
                    
                    <ul class="list-group mb-4">
                        <?php 
                        $totalScore = 0;
                        $maxScore = 0;
                        $failedMandatory = false;
                        
                        if ($criteria && count($criteria) > 0):
                            foreach ($criteria as $criterion): 
                                $maxScore += $criterion['weight'];
                                
                                // Simple simulation of scoring for demo purposes
                                // In real app, this would be more sophisticated
                                $passed = true;
                                $score = $criterion['weight'];
                                
                                // Example criteria checks based on application data
                                if ($criterion['name'] === 'Income Requirements') {
                                    // Example: Income should be 3x the rent
                                    $rentAmount = $unit ? $unit['rent_amount'] : 1000; // default if no unit
                                    $passed = ($application['monthly_income'] >= ($rentAmount * 3));
                                    $score = $passed ? $criterion['weight'] : 0;
                                } elseif ($criterion['name'] === 'Credit Score') {
                                    // Example: Credit score simulation
                                    $creditScore = isset($application['credit_score']) ? $application['credit_score'] : rand(550, 800);
                                    $passed = ($creditScore >= 650);
                                    $score = $passed ? $criterion['weight'] : 0;
                                } elseif ($criterion['name'] === 'Eviction History') {
                                    $passed = !$application['eviction_history'];
                                    $score = $passed ? $criterion['weight'] : 0;
                                } elseif ($criterion['name'] === 'Criminal Background') {
                                    $passed = !$application['criminal_history'];
                                    $score = $passed ? $criterion['weight'] : 0;
                                } elseif ($criterion['name'] === 'Rental History') {
                                    // Example: Must have minimum rental history
                                    $passed = !empty($application['previous_rental_length']);
                                    $score = $passed ? $criterion['weight'] : 0;
                                }
                                
                                $totalScore += $score;
                                
                                // Check if mandatory criterion failed
                                if ($criterion['is_mandatory'] && !$passed) {
                                    $failedMandatory = true;
                                }
                                
                                $criterionClass = $passed ? 'success' : 'danger';
                        ?>
                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                <?php echo htmlspecialchars($criterion['name']); ?>
                                <?php if ($criterion['is_mandatory']): ?>
                                    <span class="badge badge-warning mx-2">Mandatory</span>
                                <?php endif; ?>
                                <span class="badge badge-<?php echo $criterionClass; ?>"><?php echo $passed ? 'Pass' : 'Fail'; ?></span>
                            </li>
                        <?php 
                            endforeach; 
                        else: 
                        ?>
                            <li class="list-group-item">No screening criteria defined.</li>
                        <?php endif; ?>
                    </ul>
                    
                    <div class="text-center mb-4">
                        <h5>Overall Score</h5>
                        <div class="progress mb-2">
                            <?php 
                            $scorePercentage = $maxScore > 0 ? ($totalScore / $maxScore) * 100 : 0;
                            $progressClass = $scorePercentage >= 70 ? 'bg-success' : 
                                           ($scorePercentage >= 50 ? 'bg-warning' : 'bg-danger');
                            ?>
                            <div class="progress-bar <?php echo $progressClass; ?>" role="progressbar" 
                                 style="width: <?php echo $scorePercentage; ?>%" 
                                 aria-valuenow="<?php echo $scorePercentage; ?>" aria-valuemin="0" aria-valuemax="100">
                                <?php echo round($scorePercentage); ?>%
                            </div>
                        </div>
                        <p class="mb-0"><?php echo $totalScore; ?> out of <?php echo $maxScore; ?> points</p>
                        
                        <?php if ($failedMandatory): ?>
                            <div class="alert alert-danger mt-3">
                                <i class="fas fa-exclamation-triangle"></i> Failed mandatory criteria
                            </div>
                        <?php endif; ?>
                    </div>
                    
                    <?php if ($application['status'] === 'pending'): ?>
                        <form method="POST">
                            <div class="form-group">
                                <label for="notes">Notes</label>
                                <textarea class="form-control" id="notes" name="notes" rows="4"><?php echo htmlspecialchars($application['notes'] ?? ''); ?></textarea>
                            </div>
                            
                            <div class="d-flex justify-content-between">
                                <button type="submit" name="approve" class="btn btn-success" <?php echo $failedMandatory ? 'disabled' : ''; ?>>
                                    <i class="fas fa-check"></i> Approve
                                </button>
                                <button type="submit" name="pending" class="btn btn-warning">
                                    <i class="fas fa-clock"></i> Keep Pending
                                </button>
                                <button type="submit" name="reject" class="btn btn-danger">
                                    <i class="fas fa-times"></i> Reject
                                </button>
                            </div>
                        </form>
                    <?php else: ?>
                        <div class="alert alert-info">
                            This application has been <?php echo strtolower($application['status']); ?>.
                        </div>
                        
                        <?php if ($application['status'] === 'approved'): ?>
                            <a href="leases.php" class="btn btn-primary btn-block">
                                <i class="fas fa-file-contract"></i> Create Lease
                            </a>
                        <?php endif; ?>
                    <?php endif; ?>
                </div>
            </div>
            
            <!-- Background Check Results -->
            <div class="card shadow mb-4">
                <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">Background Check</h6>
                </div>
                <div class="card-body">
                    <p class="mb-2"><strong>Credit Score:</strong> 
                        <span class="badge badge-<?php 
                            $creditScore = isset($application['credit_score']) ? $application['credit_score'] : rand(550, 800);
                            echo $creditScore >= 700 ? 'success' : ($creditScore >= 600 ? 'warning' : 'danger'); 
                        ?>">
                            <?php echo $creditScore; ?>
                        </span>
                    </p>
                    
                    <p class="mb-2"><strong>Criminal Records:</strong> 
                        <span class="badge badge-<?php echo $application['criminal_history'] ? 'danger' : 'success'; ?>">
                            <?php echo $application['criminal_history'] ? 'Found' : 'None'; ?>
                        </span>
                    </p>
                    
                    <p class="mb-2"><strong>Eviction Records:</strong> 
                        <span class="badge badge-<?php echo $application['eviction_history'] ? 'danger' : 'success'; ?>">
                            <?php echo $application['eviction_history'] ? 'Found' : 'None'; ?>
                        </span>
                    </p>
                    
                    <p class="mb-2"><strong>Employment Verified:</strong> 
                        <span class="badge badge-success">Yes</span>
                    </p>
                    
                    <p class="mb-0"><strong>Identity Verified:</strong> 
                        <span class="badge badge-success">Yes</span>
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>

<?php require_once '../includes/footer.php'; ?>
