
<?php
require_once '../includes/header.php';
require_once '../models/Application.php';
require_once '../models/Property.php';

// Initialize models
$applicationModel = new Application($mysqli);
$propertyModel = new Property($mysqli);

// Handle application deletion
if (isset($_GET['delete']) && is_numeric($_GET['delete'])) {
    $application_id = intval($_GET['delete']);
    $result = $applicationModel->deleteApplication($application_id);
    if ($result) {
        $message = "Application deleted successfully.";
    } else {
        $error = "Failed to delete application.";
    }
}

// Get filter parameters
$status = isset($_GET['status']) ? $_GET['status'] : '';
$property_id = isset($_GET['property_id']) ? intval($_GET['property_id']) : 0;
$date_from = isset($_GET['date_from']) ? $_GET['date_from'] : '';
$date_to = isset($_GET['date_to']) ? $_GET['date_to'] : '';

// Get all applications with filters
$applications = $applicationModel->getFilteredApplications($status, $property_id, $date_from, $date_to);

// Get all properties for filter dropdown
$properties = $propertyModel->getAllProperties();
?>

<div class="container-fluid">
    <h1 class="h3 mb-4 text-gray-800">Rental Applications</h1>
    
    <?php if (isset($message)): ?>
        <div class="alert alert-success" role="alert">
            <?php echo $message; ?>
        </div>
    <?php endif; ?>
    
    <?php if (isset($error)): ?>
        <div class="alert alert-danger" role="alert">
            <?php echo $error; ?>
        </div>
    <?php endif; ?>
    
    <!-- Filter Card -->
    <div class="card shadow mb-4">
        <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">Filter Applications</h6>
        </div>
        <div class="card-body">
            <form method="GET" action="">
                <div class="form-row">
                    <div class="col-md-3 mb-3">
                        <label for="status">Status</label>
                        <select class="form-control" id="status" name="status">
                            <option value="">All Statuses</option>
                            <option value="pending" <?php echo ($status == 'pending') ? 'selected' : ''; ?>>Pending</option>
                            <option value="approved" <?php echo ($status == 'approved') ? 'selected' : ''; ?>>Approved</option>
                            <option value="denied" <?php echo ($status == 'denied') ? 'selected' : ''; ?>>Denied</option>
                            <option value="cancelled" <?php echo ($status == 'cancelled') ? 'selected' : ''; ?>>Cancelled</option>
                        </select>
                    </div>
                    <div class="col-md-3 mb-3">
                        <label for="property_id">Property</label>
                        <select class="form-control" id="property_id" name="property_id">
                            <option value="0">All Properties</option>
                            <?php foreach ($properties as $property): ?>
                                <option value="<?php echo $property['id']; ?>" <?php echo ($property_id == $property['id']) ? 'selected' : ''; ?>>
                                    <?php echo htmlspecialchars($property['name']); ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="col-md-3 mb-3">
                        <label for="date_from">From Date</label>
                        <input type="date" class="form-control" id="date_from" name="date_from" value="<?php echo $date_from; ?>">
                    </div>
                    <div class="col-md-3 mb-3">
                        <label for="date_to">To Date</label>
                        <input type="date" class="form-control" id="date_to" name="date_to" value="<?php echo $date_to; ?>">
                    </div>
                </div>
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-filter"></i> Apply Filters
                </button>
                <a href="applications.php" class="btn btn-secondary">
                    <i class="fas fa-sync-alt"></i> Reset Filters
                </a>
            </form>
        </div>
    </div>
    
    <!-- Applications Table -->
    <div class="card shadow mb-4">
        <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
            <h6 class="m-0 font-weight-bold text-primary">Rental Applications</h6>
            <a href="application_form.php" class="btn btn-primary btn-sm">
                <i class="fas fa-plus"></i> New Application
            </a>
        </div>
        <div class="card-body">
            <div class="table-responsive">
                <table class="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Applicant</th>
                            <th>Property</th>
                            <th>Unit</th>
                            <th>Application Date</th>
                            <th>Move-in Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (empty($applications)): ?>
                            <tr>
                                <td colspan="8" class="text-center">No applications found</td>
                            </tr>
                        <?php else: ?>
                            <?php foreach ($applications as $application): ?>
                                <tr>
                                    <td><?php echo $application['id']; ?></td>
                                    <td><?php echo htmlspecialchars($application['first_name'] . ' ' . $application['last_name']); ?></td>
                                    <td><?php echo htmlspecialchars($application['property_name']); ?></td>
                                    <td><?php echo !empty($application['unit_number']) ? htmlspecialchars($application['unit_number']) : 'N/A'; ?></td>
                                    <td><?php echo date('M d, Y', strtotime($application['application_date'])); ?></td>
                                    <td><?php echo date('M d, Y', strtotime($application['desired_move_in'])); ?></td>
                                    <td>
                                        <?php
                                        $statusClass = '';
                                        switch ($application['application_status']) {
                                            case 'pending':
                                                $statusClass = 'badge-warning';
                                                break;
                                            case 'approved':
                                                $statusClass = 'badge-success';
                                                break;
                                            case 'denied':
                                                $statusClass = 'badge-danger';
                                                break;
                                            case 'cancelled':
                                                $statusClass = 'badge-secondary';
                                                break;
                                            default:
                                                $statusClass = 'badge-info';
                                        }
                                        ?>
                                        <span class="badge <?php echo $statusClass; ?>">
                                            <?php echo ucfirst($application['application_status']); ?>
                                        </span>
                                    </td>
                                    <td>
                                        <a href="review_application.php?id=<?php echo $application['id']; ?>" class="btn btn-info btn-sm">
                                            <i class="fas fa-eye"></i> Review
                                        </a>
                                        <a href="applications.php?delete=<?php echo $application['id']; ?>" 
                                           class="btn btn-danger btn-sm" 
                                           onclick="return confirm('Are you sure you want to delete this application?');">
                                            <i class="fas fa-trash"></i>
                                        </a>
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

<?php require_once '../includes/footer.php'; ?>
