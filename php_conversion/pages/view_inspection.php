
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

// Get property details
$propertyData = $property->getPropertyById($inspectionData['property_id']);

// Get unit details if applicable
$unitData = null;
if (!empty($inspectionData['unit_id'])) {
    $unitData = $unit->getUnitById($inspectionData['unit_id']);
}

// Set page title
$pageTitle = "View Inspection - " . $inspectionData['type'] . " for " . $propertyData['name'];
include_once '../includes/header.php';
?>

<div class="container-fluid">
    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 class="h2"><?php echo $pageTitle; ?></h1>
        <div class="btn-toolbar mb-2 mb-md-0">
            <a href="inspections.php" class="btn btn-sm btn-outline-secondary me-2">
                <i class="fas fa-arrow-left"></i> Back to Inspections
            </a>
            <?php if ($inspectionData['status'] === 'scheduled'): ?>
                <a href="edit_inspection.php?id=<?php echo $id; ?>" class="btn btn-sm btn-primary me-2">
                    <i class="fas fa-edit"></i> Edit
                </a>
                <a href="complete_inspection.php?id=<?php echo $id; ?>" class="btn btn-sm btn-success">
                    <i class="fas fa-check"></i> Mark Complete
                </a>
            <?php endif; ?>
        </div>
    </div>

    <div class="row">
        <div class="col-md-8">
            <div class="card mb-4">
                <div class="card-header">
                    <h5 class="card-title mb-0">Inspection Details</h5>
                </div>
                <div class="card-body">
                    <div class="row mb-3">
                        <div class="col-md-4 fw-bold">Status:</div>
                        <div class="col-md-8">
                            <?php if ($inspectionData['status'] === 'scheduled'): ?>
                                <span class="badge bg-warning">Scheduled</span>
                            <?php elseif ($inspectionData['status'] === 'completed'): ?>
                                <span class="badge bg-success">Completed</span>
                            <?php else: ?>
                                <span class="badge bg-secondary"><?php echo ucfirst($inspectionData['status']); ?></span>
                            <?php endif; ?>
                        </div>
                    </div>
                    
                    <div class="row mb-3">
                        <div class="col-md-4 fw-bold">Inspection Type:</div>
                        <div class="col-md-8"><?php echo htmlspecialchars($inspectionData['type']); ?></div>
                    </div>
                    
                    <div class="row mb-3">
                        <div class="col-md-4 fw-bold">Property:</div>
                        <div class="col-md-8">
                            <a href="view_property.php?id=<?php echo $propertyData['id']; ?>">
                                <?php echo htmlspecialchars($propertyData['name']); ?>
                            </a>
                            <div class="text-muted">
                                <?php echo htmlspecialchars($propertyData['address']); ?>,
                                <?php echo htmlspecialchars($propertyData['city']); ?>,
                                <?php echo htmlspecialchars($propertyData['state']); ?>
                                <?php echo htmlspecialchars($propertyData['zip']); ?>
                            </div>
                        </div>
                    </div>
                    
                    <?php if ($unitData): ?>
                    <div class="row mb-3">
                        <div class="col-md-4 fw-bold">Unit:</div>
                        <div class="col-md-8">
                            Unit <?php echo htmlspecialchars($unitData['unit_number']); ?>
                            <?php if (!empty($unitData['description'])): ?>
                                - <?php echo htmlspecialchars($unitData['description']); ?>
                            <?php endif; ?>
                        </div>
                    </div>
                    <?php endif; ?>
                    
                    <div class="row mb-3">
                        <div class="col-md-4 fw-bold">Inspector:</div>
                        <div class="col-md-8"><?php echo htmlspecialchars($inspectionData['inspector_name']); ?></div>
                    </div>
                    
                    <div class="row mb-3">
                        <div class="col-md-4 fw-bold">Scheduled Date:</div>
                        <div class="col-md-8"><?php echo formatDate($inspectionData['scheduled_date']); ?></div>
                    </div>
                    
                    <?php if ($inspectionData['status'] === 'completed' && !empty($inspectionData['completed_date'])): ?>
                    <div class="row mb-3">
                        <div class="col-md-4 fw-bold">Completed Date:</div>
                        <div class="col-md-8"><?php echo formatDate($inspectionData['completed_date']); ?></div>
                    </div>
                    <?php endif; ?>
                    
                    <?php if (!empty($inspectionData['notes'])): ?>
                    <div class="row mb-3">
                        <div class="col-md-4 fw-bold">Notes:</div>
                        <div class="col-md-8"><?php echo nl2br(htmlspecialchars($inspectionData['notes'])); ?></div>
                    </div>
                    <?php endif; ?>
                    
                    <?php if ($inspectionData['status'] === 'completed' && !empty($inspectionData['findings'])): ?>
                    <div class="row">
                        <div class="col-md-12">
                            <h5 class="mt-4 mb-3">Inspection Findings</h5>
                            <div class="p-3 border rounded">
                                <?php echo nl2br(htmlspecialchars($inspectionData['findings'])); ?>
                            </div>
                        </div>
                    </div>
                    <?php endif; ?>
                </div>
            </div>
        </div>
        
        <div class="col-md-4">
            <div class="card mb-4">
                <div class="card-header">
                    <h5 class="card-title mb-0">Timeline</h5>
                </div>
                <div class="card-body">
                    <ul class="timeline">
                        <li class="timeline-item">
                            <div class="timeline-marker"></div>
                            <div class="timeline-content">
                                <h5 class="timeline-title">Inspection Created</h5>
                                <p class="timeline-text"><?php echo formatDateTime($inspectionData['created_at']); ?></p>
                            </div>
                        </li>
                        
                        <li class="timeline-item">
                            <div class="timeline-marker <?php echo ($inspectionData['status'] === 'scheduled') ? 'timeline-marker-active' : ''; ?>"></div>
                            <div class="timeline-content">
                                <h5 class="timeline-title">Scheduled</h5>
                                <p class="timeline-text"><?php echo formatDate($inspectionData['scheduled_date']); ?></p>
                            </div>
                        </li>
                        
                        <?php if ($inspectionData['status'] === 'completed' && !empty($inspectionData['completed_date'])): ?>
                        <li class="timeline-item">
                            <div class="timeline-marker timeline-marker-completed"></div>
                            <div class="timeline-content">
                                <h5 class="timeline-title">Completed</h5>
                                <p class="timeline-text"><?php echo formatDate($inspectionData['completed_date']); ?></p>
                            </div>
                        </li>
                        <?php endif; ?>
                    </ul>
                </div>
            </div>
            
            <div class="card">
                <div class="card-header">
                    <h5 class="card-title mb-0">Actions</h5>
                </div>
                <div class="card-body">
                    <div class="d-grid gap-2">
                        <?php if ($inspectionData['status'] === 'scheduled'): ?>
                            <a href="complete_inspection.php?id=<?php echo $id; ?>" class="btn btn-success">
                                <i class="fas fa-check"></i> Mark as Completed
                            </a>
                            <a href="edit_inspection.php?id=<?php echo $id; ?>" class="btn btn-primary">
                                <i class="fas fa-edit"></i> Edit Inspection
                            </a>
                            <button type="button" class="btn btn-danger" 
                                    onclick="confirmDelete('delete_inspection.php?id=<?php echo $id; ?>')">
                                <i class="fas fa-trash"></i> Delete Inspection
                            </button>
                        <?php else: ?>
                            <a href="create_maintenance.php?property_id=<?php echo $propertyData['id']; ?>&inspection_id=<?php echo $id; ?>" class="btn btn-warning">
                                <i class="fas fa-tools"></i> Create Maintenance Request
                            </a>
                            <a href="#" class="btn btn-secondary" onclick="window.print()">
                                <i class="fas fa-print"></i> Print Inspection Report
                            </a>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
function confirmDelete(url) {
    if (confirm('Are you sure you want to delete this inspection? This action cannot be undone.')) {
        window.location.href = url;
    }
}
</script>

<style>
/* Timeline styles */
.timeline {
    position: relative;
    list-style: none;
    padding: 0;
    margin: 0;
}

.timeline:before {
    content: "";
    position: absolute;
    top: 0;
    left: 10px;
    height: 100%;
    width: 2px;
    background-color: #e0e0e0;
}

.timeline-item {
    position: relative;
    padding-left: 30px;
    margin-bottom: 20px;
}

.timeline-marker {
    position: absolute;
    top: 5px;
    left: 0;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: #e0e0e0;
    border: 2px solid white;
    z-index: 1;
}

.timeline-marker-active {
    background-color: #ffc107;
}

.timeline-marker-completed {
    background-color: #28a745;
}

.timeline-title {
    margin: 0;
    font-size: 1rem;
    font-weight: bold;
}

.timeline-text {
    margin: 0;
    color: #666;
}
</style>

<?php include_once '../includes/footer.php'; ?>
