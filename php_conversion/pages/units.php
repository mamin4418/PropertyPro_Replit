
<?php
require_once '../database/init.php';
require_once '../models/Unit.php';
require_once '../models/Property.php';
require_once '../includes/functions.php';

// Check if user is logged in
session_start();
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

// Initialize models
$unitModel = new Unit($conn);
$propertyModel = new Property($conn);

// Handle unit deletion
if (isset($_POST['delete_unit']) && isset($_POST['unit_id'])) {
    $unit_id = $_POST['unit_id'];
    if ($unitModel->deleteUnit($unit_id)) {
        $_SESSION['success_message'] = "Unit deleted successfully.";
    } else {
        $_SESSION['error_message'] = "Failed to delete unit.";
    }
    header("Location: units.php");
    exit();
}

// Get filter parameters
$property_id = isset($_GET['property_id']) ? $_GET['property_id'] : null;
$status = isset($_GET['status']) ? $_GET['status'] : null;

// Get units based on filters
if ($property_id) {
    $units = $unitModel->getUnitsByPropertyId($property_id);
} elseif ($status && $status === 'vacant') {
    $units = $unitModel->getVacantUnits();
} else {
    $units = $unitModel->getAllUnits();
}

// Get all properties for the filter dropdown
$properties = $propertyModel->getAllProperties();

// Page title
$pageTitle = "Units";
require_once '../includes/header.php';
?>

<div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="h3 mb-0 text-gray-800">Units</h1>
        <a href="add_unit.php" class="btn btn-primary"><i class="fas fa-plus"></i> Add New Unit</a>
    </div>

    <?php include_once '../includes/messages.php'; ?>

    <!-- Filters -->
    <div class="card shadow mb-4">
        <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">Filters</h6>
        </div>
        <div class="card-body">
            <form method="GET" action="units.php" class="form-inline">
                <div class="form-group mb-2 mr-3">
                    <label for="property_id" class="mr-2">Property:</label>
                    <select class="form-control" id="property_id" name="property_id">
                        <option value="">All Properties</option>
                        <?php foreach ($properties as $property): ?>
                            <option value="<?= $property['id'] ?>" <?= ($property_id == $property['id']) ? 'selected' : '' ?>>
                                <?= htmlspecialchars($property['name']) ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>
                <div class="form-group mb-2 mr-3">
                    <label for="status" class="mr-2">Status:</label>
                    <select class="form-control" id="status" name="status">
                        <option value="">All Statuses</option>
                        <option value="vacant" <?= ($status == 'vacant') ? 'selected' : '' ?>>Vacant</option>
                        <option value="occupied" <?= ($status == 'occupied') ? 'selected' : '' ?>>Occupied</option>
                        <option value="maintenance" <?= ($status == 'maintenance') ? 'selected' : '' ?>>Maintenance</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-primary mb-2">Apply Filters</button>
                <a href="units.php" class="btn btn-secondary mb-2 ml-2">Reset</a>
            </form>
        </div>
    </div>

    <!-- Units Table -->
    <div class="card shadow mb-4">
        <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">Units List</h6>
        </div>
        <div class="card-body">
            <div class="table-responsive">
                <table class="table table-bordered" id="unitsTable" width="100%" cellspacing="0">
                    <thead>
                        <tr>
                            <th>Unit Number</th>
                            <th>Property</th>
                            <th>Type</th>
                            <th>Bedrooms</th>
                            <th>Bathrooms</th>
                            <th>Size (sq ft)</th>
                            <th>Rent</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (empty($units)): ?>
                            <tr>
                                <td colspan="9" class="text-center">No units found</td>
                            </tr>
                        <?php else: ?>
                            <?php foreach ($units as $unit): ?>
                                <tr>
                                    <td><?= htmlspecialchars($unit['unit_number']) ?></td>
                                    <td><?= htmlspecialchars($unit['property_name']) ?></td>
                                    <td><?= htmlspecialchars($unit['type']) ?></td>
                                    <td><?= htmlspecialchars($unit['bedrooms']) ?></td>
                                    <td><?= htmlspecialchars($unit['bathrooms']) ?></td>
                                    <td><?= htmlspecialchars($unit['size_sqft']) ?></td>
                                    <td>$<?= htmlspecialchars(number_format($unit['rent_amount'], 2)) ?></td>
                                    <td>
                                        <span class="badge badge-<?= getStatusBadgeClass($unit['status']) ?>">
                                            <?= ucfirst(htmlspecialchars($unit['status'])) ?>
                                        </span>
                                    </td>
                                    <td>
                                        <a href="view_unit.php?id=<?= $unit['id'] ?>" class="btn btn-info btn-sm">
                                            <i class="fas fa-eye"></i>
                                        </a>
                                        <a href="edit_unit.php?id=<?= $unit['id'] ?>" class="btn btn-primary btn-sm">
                                            <i class="fas fa-edit"></i>
                                        </a>
                                        <form action="units.php" method="POST" class="d-inline" onsubmit="return confirm('Are you sure you want to delete this unit?');">
                                            <input type="hidden" name="unit_id" value="<?= $unit['id'] ?>">
                                            <button type="submit" name="delete_unit" class="btn btn-danger btn-sm">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<script>
$(document).ready(function() {
    $('#unitsTable').DataTable({
        "order": [[1, "asc"], [0, "asc"]]
    });
});

function getStatusBadgeClass(status) {
    switch(status) {
        case 'vacant':
            return 'success';
        case 'occupied':
            return 'primary';
        case 'maintenance':
            return 'warning';
        default:
            return 'secondary';
    }
}
</script>

<?php
require_once '../includes/footer.php';
?>
