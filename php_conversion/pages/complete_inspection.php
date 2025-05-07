
<?php
require_once '../config/database.php';
require_once '../models/Inspection.php';
require_once '../models/Property.php';
require_once '../models/Unit.php';
require_once '../includes/functions.php';

// Initialize the database connection
$database = new Database();
$db = $database->getConnection();

// Initialize models
$inspection = new Inspection($db);
$property = new Property($db);
$unit = new Unit($db);

// Check if ID is set
if (!isset($_GET['id']) || empty($_GET['id'])) {
    header('Location: inspections.php');
    exit;
}

$id = intval($_GET['id']);
$inspectionData = $inspection->getInspectionById($id);

if (!$inspectionData) {
    header('Location: inspections.php');
    exit;
}

// If inspection is already completed, redirect to view page
if ($inspectionData['status'] === 'completed') {
    header('Location: view_inspection.php?id=' . $id);
    exit;
}

// Get property details
$propertyData = $property->getPropertyById($inspectionData['property_id']);

// Get unit details if applicable
$unitData = null;
if (!empty($inspectionData['unit_id'])) {
    $unitData = $unit->getUnitById($inspectionData['unit_id']);
}

$errorMsg = '';
$successMsg = '';

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Validate and sanitize input
    $findings = isset($_POST['findings']) ? trim($_POST['findings']) : '';
    $completed_date = isset($_POST['completed_date']) ? $_POST['completed_date'] : date('Y-m-d');
    
    // Basic validation
    if (empty($findings)) {
        $errorMsg = 'Please enter inspection findings.';
    } else {
        // Update inspection as completed
        $result = $inspection->completeInspection($id, $findings, $completed_date);
        
        if ($result) {
            // Redirect to view page
            header('Location: view_inspection.php?id=' . $id . '&success=1');
            exit;
        } else {
            $errorMsg = 'Error completing inspection. Please try again.';
        }
    }
}

// Set page title
$pageTitle = "Complete Inspection - " . $inspectionData['type'] . " for " . $propertyData['name'];
include_once '../includes/header.php';
?>

<div class="container-fluid">
    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 class="h2"><?php echo $pageTitle; ?></h1>
        <div class="btn-toolbar mb-2 mb-md-0">
            <a href="inspections.php" class="btn btn-sm btn-outline-secondary me-2">
                <i class="fas fa-arrow-left"></i> Back to Inspections
            </a>
            <a href="view_inspection.php?id=<?php echo $id; ?>" class="btn btn-sm btn-info">
                <i class="fas fa-eye"></i> View Inspection
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
            <div class="card mb-4">
                <div class="card-header">
                    <h5 class="card-title mb-0">Complete Inspection</h5>
                </div>
                <div class="card-body">
                    <form action="<?php echo htmlspecialchars($_SERVER['PHP_SELF'] . '?id=' . $id); ?>" method="post">
                        <!-- Inspection Summary -->
                        <div class="mb-4">
                            <h6>Inspection Summary</h6>
                            <div class="row mb-2">
                                <div class="col-md-4 fw-bold">Property:</div>
                                <div class="col-md-8"><?php echo htmlspecialchars($propertyData['name']); ?></div>
                            </div>
                            <div class="row mb-2">
                                <div class="col-md-4 fw-bold">Type:</div>
                                <div class="col-md-8"><?php echo htmlspecialchars($inspectionData['type']); ?></div>
                            </div>
                            <div class="row mb-2">
                                <div class="col-md-4 fw-bold">Scheduled Date:</div>
                                <div class="col-md-8"><?php echo formatDate($inspectionData['scheduled_date']); ?></div>
                            </div>
                            <?php if ($unitData): ?>
                            <div class="row mb-2">
                                <div class="col-md-4 fw-bold">Unit:</div>
                                <div class="col-md-8">Unit <?php echo htmlspecialchars($unitData['unit_number']); ?></div>
                            </div>
                            <?php endif; ?>
                            <div class="row mb-2">
                                <div class="col-md-4 fw-bold">Inspector:</div>
                                <div class="col-md-8"><?php echo htmlspecialchars($inspectionData['inspector_name']); ?></div>
                            </div>
                        </div>
                        
                        <hr class="my-4">
                        
                        <!-- Completion Details -->
                        <div class="mb-3">
                            <label for="completed_date" class="form-label">Completion Date <span class="text-danger">*</span></label>
                            <input type="date" class="form-control" id="completed_date" name="completed_date" value="<?php echo date('Y-m-d'); ?>" required>
                        </div>
                        
                        <div class="mb-3">
                            <label for="findings" class="form-label">Inspection Findings <span class="text-danger">*</span></label>
                            <textarea class="form-control" id="findings" name="findings" rows="10" required></textarea>
                            <div class="form-text">
                                Include detailed observations, any issues found, and recommendations. Be as specific as possible.
                            </div>
                        </div>
                        
                        <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                            <a href="view_inspection.php?id=<?php echo $id; ?>" class="btn btn-outline-secondary me-2">Cancel</a>
                            <button type="submit" class="btn btn-success">
                                <i class="fas fa-check"></i> Mark as Completed
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        
        <div class="col-md-4">
            <div class="card mb-4">
                <div class="card-header">
                    <h5 class="card-title mb-0">Inspection Checklist</h5>
                </div>
                <div class="card-body">
                    <p class="card-text">Use the following checklist as a guide when documenting your findings:</p>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">
                            <i class="fas fa-check-square text-success me-2"></i> Structural integrity
                        </li>
                        <li class="list-group-item">
                            <i class="fas fa-check-square text-success me-2"></i> Plumbing functionality
                        </li>
                        <li class="list-group-item">
                            <i class="fas fa-check-square text-success me-2"></i> Electrical systems
                        </li>
                        <li class="list-group-item">
                            <i class="fas fa-check-square text-success me-2"></i> HVAC operation
                        </li>
                        <li class="list-group-item">
                            <i class="fas fa-check-square text-success me-2"></i> Appliance condition
                        </li>
                        <li class="list-group-item">
                            <i class="fas fa-check-square text-success me-2"></i> Windows and doors
                        </li>
                        <li class="list-group-item">
                            <i class="fas fa-check-square text-success me-2"></i> Flooring condition
                        </li>
                        <li class="list-group-item">
                            <i class="fas fa-check-square text-success me-2"></i> Wall and ceiling condition
                        </li>
                        <li class="list-group-item">
                            <i class="fas fa-check-square text-success me-2"></i> Safety equipment (smoke detectors, etc.)
                        </li>
                        <li class="list-group-item">
                            <i class="fas fa-check-square text-success me-2"></i> Exterior condition
                        </li>
                    </ul>
                </div>
            </div>
            
            <div class="card">
                <div class="card-header">
                    <h5 class="card-title mb-0">Tips for Documentation</h5>
                </div>
                <div class="card-body">
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">
                            <i class="fas fa-info-circle text-info me-2"></i> Be specific and detailed
                        </li>
                        <li class="list-group-item">
                            <i class="fas fa-info-circle text-info me-2"></i> Note any code violations
                        </li>
                        <li class="list-group-item">
                            <i class="fas fa-info-circle text-info me-2"></i> Include recommendations for repairs
                        </li>
                        <li class="list-group-item">
                            <i class="fas fa-info-circle text-info me-2"></i> Prioritize issues by severity
                        </li>
                        <li class="list-group-item">
                            <i class="fas fa-info-circle text-info me-2"></i> Document with photos when possible
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</div>

<?php include_once '../includes/footer.php'; ?>
