
<?php
require_once '../database/init.php';
require_once '../models/Unit.php';
require_once '../models/Property.php';
require_once '../models/Lease.php';
require_once '../includes/functions.php';

// Check if user is logged in
session_start();
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

// Check if unit ID is provided
if (!isset($_GET['id']) || empty($_GET['id'])) {
    header("Location: units.php");
    exit();
}

$unit_id = $_GET['id'];

// Initialize models
$unitModel = new Unit($conn);
$propertyModel = new Property($conn);
$leaseModel = new Lease($conn);

// Get unit details
$unit = $unitModel->getUnitById($unit_id);

if (!$unit) {
    $_SESSION['error_message'] = "Unit not found";
    header("Location: units.php");
    exit();
}

// Get property details
$property = $propertyModel->getPropertyById($unit['property_id']);

// Get unit occupancy history
$occupancy_history = $unitModel->getUnitOccupancyHistory($unit_id);

// Get current lease if the unit is occupied
$current_lease = null;
if ($unit['status'] == 'occupied') {
    $current_lease = $leaseModel->getCurrentLeaseByUnitId($unit_id);
}

// Decode amenities
$amenities = json_decode($unit['amenities'], true) ?: [];

// Page title
$pageTitle = "View Unit";
require_once '../includes/header.php';
?>

<div class="container-fluid">
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 class="h3 mb-0 text-gray-800">Unit Details</h1>
        <div>
            <a href="edit_unit.php?id=<?= $unit_id ?>" class="btn btn-primary btn-sm">
                <i class="fas fa-edit"></i> Edit Unit
            </a>
            <a href="units.php" class="btn btn-secondary btn-sm">
                <i class="fas fa-arrow-left"></i> Back to Units
            </a>
        </div>
    </div>

    <?php include_once '../includes/messages.php'; ?>

    <div class="row">
        <!-- Unit Information Card -->
        <div class="col-xl-6 col-lg-6">
            <div class="card shadow mb-4">
                <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                    <h6 class="m-0 font-weight-bold text-primary">Unit Information</h6>
                    <span class="badge badge-<?= getStatusBadgeClass($unit['status']) ?> badge-lg">
                        <?= ucfirst(htmlspecialchars($unit['status'])) ?>
                    </span>
                </div>
                <div class="card-body">
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <strong>Unit Number:</strong>
                            <p><?= htmlspecialchars($unit['unit_number']) ?></p>
                        </div>
                        <div class="col-md-6">
                            <strong>Property:</strong>
                            <p><a href="view_property.php?id=<?= $property['id'] ?>"><?= htmlspecialchars($property['name']) ?></a></p>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-md-4">
                            <strong>Type:</strong>
                            <p><?= htmlspecialchars($unit['type']) ?></p>
                        </div>
                        <div class="col-md-4">
                            <strong>Bedrooms:</strong>
                            <p><?= htmlspecialchars($unit['bedrooms']) ?></p>
                        </div>
                        <div class="col-md-4">
                            <strong>Bathrooms:</strong>
                            <p><?= htmlspecialchars($unit['bathrooms']) ?></p>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <strong>Size:</strong>
                            <p><?= htmlspecialchars($unit['size_sqft']) ?> sq ft</p>
                        </div>
                        <div class="col-md-6">
                            <strong>Monthly Rent:</strong>
                            <p>$<?= htmlspecialchars(number_format($unit['rent_amount'], 2)) ?></p>
                        </div>
                    </div>
                    <?php if (!empty($unit['description'])): ?>
                        <div class="mb-3">
                            <strong>Description:</strong>
                            <p><?= nl2br(htmlspecialchars($unit['description'])) ?></p>
                        </div>
                    <?php endif; ?>
                    
                    <?php if (!empty($amenities)): ?>
                        <div>
                            <strong>Amenities:</strong>
                            <div class="mt-2">
                                <?php foreach ($amenities as $amenity): ?>
                                    <span class="badge badge-info mb-1 mr-1 p-2">
                                        <?= htmlspecialchars($amenity) ?>
                                    </span>
                                <?php endforeach; ?>
                            </div>
                        </div>
                    <?php endif; ?>
                </div>
            </div>
        </div>

        <!-- Current Occupancy Card -->
        <div class="col-xl-6 col-lg-6">
            <div class="card shadow mb-4">
                <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">Current Occupancy</h6>
                </div>
                <div class="card-body">
                    <?php if ($unit['status'] == 'occupied' && $current_lease): ?>
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <strong>Tenant:</strong>
                                <p>
                                    <a href="view_tenant.php?id=<?= $current_lease['tenant_id'] ?>">
                                        <?= htmlspecialchars($current_lease['first_name'] . ' ' . $current_lease['last_name']) ?>
                                    </a>
                                </p>
                            </div>
                            <div class="col-md-6">
                                <strong>Lease:</strong>
                                <p>
                                    <a href="view_lease.php?id=<?= $current_lease['id'] ?>">
                                        View Lease
                                    </a>
                                </p>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <strong>Start Date:</strong>
                                <p><?= htmlspecialchars(date('M d, Y', strtotime($current_lease['start_date']))) ?></p>
                            </div>
                            <div class="col-md-6">
                                <strong>End Date:</strong>
                                <p><?= htmlspecialchars(date('M d, Y', strtotime($current_lease['end_date']))) ?></p>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <strong>Rent Amount:</strong>
                                <p>$<?= htmlspecialchars(number_format($current_lease['rent_amount'], 2)) ?></p>
                            </div>
                            <div class="col-md-6">
                                <strong>Security Deposit:</strong>
                                <p>$<?= htmlspecialchars(number_format($current_lease['security_deposit'], 2)) ?></p>
                            </div>
                        </div>
                        <div class="mt-3">
                            <a href="view_lease.php?id=<?= $current_lease['id'] ?>" class="btn btn-info btn-sm">
                                <i class="fas fa-eye"></i> View Full Lease Details
                            </a>
                        </div>
                    <?php elseif ($unit['status'] == 'vacant'): ?>
                        <div class="text-center py-5">
                            <i class="fas fa-home fa-3x text-gray-300 mb-3"></i>
                            <p class="mb-0">This unit is currently vacant</p>
                            <div class="mt-3">
                                <a href="add_lease.php?unit_id=<?= $unit_id ?>" class="btn btn-primary">
                                    <i class="fas fa-plus"></i> Create New Lease
                                </a>
                            </div>
                        </div>
                    <?php elseif ($unit['status'] == 'maintenance'): ?>
                        <div class="text-center py-5">
                            <i class="fas fa-tools fa-3x text-gray-300 mb-3"></i>
                            <p class="mb-0">This unit is currently under maintenance</p>
                            <div class="mt-3">
                                <a href="maintenance.php?unit_id=<?= $unit_id ?>" class="btn btn-warning">
                                    <i class="fas fa-wrench"></i> View Maintenance Details
                                </a>
                            </div>
                        </div>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </div>

    <!-- Occupancy History Card -->
    <div class="card shadow mb-4">
        <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">Occupancy History</h6>
        </div>
        <div class="card-body">
            <?php if (empty($occupancy_history)): ?>
                <p class="text-center">No occupancy history found for this unit.</p>
            <?php else: ?>
                <div class="table-responsive">
                    <table class="table table-bordered" width="100%" cellspacing="0">
                        <thead>
                            <tr>
                                <th>Tenant</th>
                                <th>Lease Term</th>
                                <th>Rent</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($occupancy_history as $lease): ?>
                                <tr>
                                    <td>
                                        <a href="view_tenant.php?id=<?= $lease['tenant_id'] ?>">
                                            <?= htmlspecialchars($lease['first_name'] . ' ' . $lease['last_name']) ?>
                                        </a>
                                    </td>
                                    <td>
                                        <?= htmlspecialchars(date('M d, Y', strtotime($lease['start_date']))) ?> - 
                                        <?= htmlspecialchars(date('M d, Y', strtotime($lease['end_date']))) ?>
                                    </td>
                                    <td>$<?= htmlspecialchars(number_format($lease['rent_amount'], 2)) ?></td>
                                    <td>
                                        <span class="badge badge-<?= getLeaseStatusBadgeClass($lease['status']) ?>">
                                            <?= ucfirst(htmlspecialchars($lease['status'])) ?>
                                        </span>
                                    </td>
                                    <td>
                                        <a href="view_lease.php?id=<?= $lease['id'] ?>" class="btn btn-info btn-sm">
                                            <i class="fas fa-eye"></i> View
                                        </a>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            <?php endif; ?>
        </div>
    </div>

    <!-- Action Buttons -->
    <div class="row mb-4">
        <div class="col-md-6">
            <div class="card shadow">
                <div class="card-body">
                    <h6 class="font-weight-bold">Unit Management</h6>
                    <div class="mt-3">
                        <?php if ($unit['status'] == 'vacant'): ?>
                            <a href="add_lease.php?unit_id=<?= $unit_id ?>" class="btn btn-success btn-block">
                                <i class="fas fa-file-contract"></i> Create New Lease
                            </a>
                        <?php endif; ?>
                        <a href="edit_unit.php?id=<?= $unit_id ?>" class="btn btn-primary btn-block">
                            <i class="fas fa-edit"></i> Edit Unit Details
                        </a>
                        <?php if ($unit['status'] != 'maintenance'): ?>
                            <a href="add_maintenance.php?unit_id=<?= $unit_id ?>" class="btn btn-warning btn-block">
                                <i class="fas fa-wrench"></i> Schedule Maintenance
                            </a>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-6">
            <div class="card shadow">
                <div class="card-body">
                    <h6 class="font-weight-bold">Related Actions</h6>
                    <div class="mt-3">
                        <a href="view_property.php?id=<?= $unit['property_id'] ?>" class="btn btn-info btn-block">
                            <i class="fas fa-building"></i> View Property
                        </a>
                        <?php if ($unit['status'] == 'occupied' && $current_lease): ?>
                            <a href="add_payment.php?lease_id=<?= $current_lease['id'] ?>" class="btn btn-success btn-block">
                                <i class="fas fa-dollar-sign"></i> Record Payment
                            </a>
                        <?php endif; ?>
                        <a href="schedule_inspection.php?unit_id=<?= $unit_id ?>" class="btn btn-secondary btn-block">
                            <i class="fas fa-clipboard-check"></i> Schedule Inspection
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
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

function getLeaseStatusBadgeClass(status) {
    switch(status) {
        case 'active':
            return 'success';
        case 'expired':
            return 'danger';
        case 'terminated':
            return 'warning';
        default:
            return 'secondary';
    }
}
</script>

<?php
require_once '../includes/footer.php';
?>
