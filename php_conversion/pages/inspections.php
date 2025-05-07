
<?php
require_once '../config/database.php';
require_once '../models/Inspection.php';
require_once '../models/Property.php';
require_once '../includes/functions.php';

// Initialize the database connection
$database = new Database();
$db = $database->getConnection();

// Initialize models
$inspection = new Inspection($db);
$property = new Property($db);

// Get all properties for the dropdown
$propertiesResult = $property->getAllProperties();
$properties = [];
while ($row = $propertiesResult->fetch_assoc()) {
    $properties[] = $row;
}

// Get scheduled and completed inspections
$scheduledInspections = $inspection->getScheduledInspections();
$completedInspections = $inspection->getCompletedInspections();

// Set page title
$pageTitle = "Property Inspections";
include_once '../includes/header.php';
?>

<div class="container-fluid">
    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 class="h2"><?php echo $pageTitle; ?></h1>
        <div class="btn-toolbar mb-2 mb-md-0">
            <a href="schedule_inspection.php" class="btn btn-sm btn-primary">
                <i class="fas fa-plus"></i> Schedule New Inspection
            </a>
        </div>
    </div>

    <div class="row mb-4">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">
                    <ul class="nav nav-tabs card-header-tabs" id="inspectionTabs" role="tablist">
                        <li class="nav-item" role="presentation">
                            <a class="nav-link active" id="scheduled-tab" data-bs-toggle="tab" href="#scheduled" role="tab" aria-controls="scheduled" aria-selected="true">
                                Scheduled Inspections
                            </a>
                        </li>
                        <li class="nav-item" role="presentation">
                            <a class="nav-link" id="completed-tab" data-bs-toggle="tab" href="#completed" role="tab" aria-controls="completed" aria-selected="false">
                                Completed Inspections
                            </a>
                        </li>
                    </ul>
                </div>
                <div class="card-body">
                    <div class="tab-content" id="inspectionTabsContent">
                        <!-- Scheduled Inspections Tab -->
                        <div class="tab-pane fade show active" id="scheduled" role="tabpanel" aria-labelledby="scheduled-tab">
                            <?php if ($scheduledInspections->num_rows > 0): ?>
                                <div class="table-responsive">
                                    <table class="table table-striped table-sm">
                                        <thead>
                                            <tr>
                                                <th>Property</th>
                                                <th>Type</th>
                                                <th>Scheduled Date</th>
                                                <th>Inspector</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <?php while ($inspection = $scheduledInspections->fetch_assoc()): ?>
                                                <tr>
                                                    <td><?php echo htmlspecialchars($inspection['property_name']); ?></td>
                                                    <td><?php echo htmlspecialchars($inspection['type']); ?></td>
                                                    <td><?php echo formatDate($inspection['scheduled_date']); ?></td>
                                                    <td><?php echo htmlspecialchars($inspection['inspector_name']); ?></td>
                                                    <td>
                                                        <a href="view_inspection.php?id=<?php echo $inspection['id']; ?>" class="btn btn-sm btn-info">
                                                            <i class="fas fa-eye"></i>
                                                        </a>
                                                        <a href="complete_inspection.php?id=<?php echo $inspection['id']; ?>" class="btn btn-sm btn-success">
                                                            <i class="fas fa-check"></i> Complete
                                                        </a>
                                                        <a href="edit_inspection.php?id=<?php echo $inspection['id']; ?>" class="btn btn-sm btn-primary">
                                                            <i class="fas fa-edit"></i>
                                                        </a>
                                                        <button type="button" class="btn btn-sm btn-danger" 
                                                                onclick="confirmDelete('delete_inspection.php?id=<?php echo $inspection['id']; ?>', 'inspection')">
                                                            <i class="fas fa-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            <?php endwhile; ?>
                                        </tbody>
                                    </table>
                                </div>
                            <?php else: ?>
                                <div class="alert alert-info">No scheduled inspections found.</div>
                            <?php endif; ?>
                        </div>
                        
                        <!-- Completed Inspections Tab -->
                        <div class="tab-pane fade" id="completed" role="tabpanel" aria-labelledby="completed-tab">
                            <?php if ($completedInspections->num_rows > 0): ?>
                                <div class="table-responsive">
                                    <table class="table table-striped table-sm">
                                        <thead>
                                            <tr>
                                                <th>Property</th>
                                                <th>Type</th>
                                                <th>Completed Date</th>
                                                <th>Inspector</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <?php while ($inspection = $completedInspections->fetch_assoc()): ?>
                                                <tr>
                                                    <td><?php echo htmlspecialchars($inspection['property_name']); ?></td>
                                                    <td><?php echo htmlspecialchars($inspection['type']); ?></td>
                                                    <td><?php echo formatDate($inspection['completed_date']); ?></td>
                                                    <td><?php echo htmlspecialchars($inspection['inspector_name']); ?></td>
                                                    <td>
                                                        <a href="view_inspection.php?id=<?php echo $inspection['id']; ?>" class="btn btn-sm btn-info">
                                                            <i class="fas fa-eye"></i>
                                                        </a>
                                                    </td>
                                                </tr>
                                            <?php endwhile; ?>
                                        </tbody>
                                    </table>
                                </div>
                            <?php else: ?>
                                <div class="alert alert-info">No completed inspections found.</div>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
function confirmDelete(url, itemType) {
    if (confirm(`Are you sure you want to delete this ${itemType}? This action cannot be undone.`)) {
        window.location.href = url;
    }
}
</script>

<?php include_once '../includes/footer.php'; ?>
