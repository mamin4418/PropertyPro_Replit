
<?php
require_once '../database/init.php';
require_once '../models/Payment.php';
require_once '../models/Property.php';
require_once '../models/Tenant.php';
require_once '../includes/functions.php';

// Check if user is logged in
session_start();
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

// Initialize models
$paymentModel = new Payment($conn);
$propertyModel = new Property($conn);
$tenantModel = new Tenant($conn);

// Handle payment deletion
if (isset($_POST['delete_payment']) && isset($_POST['payment_id'])) {
    $payment_id = $_POST['payment_id'];
    if ($paymentModel->deletePayment($payment_id)) {
        $_SESSION['success_message'] = "Payment deleted successfully.";
    } else {
        $_SESSION['error_message'] = "Failed to delete payment.";
    }
    header("Location: payments.php");
    exit();
}

// Get filter parameters
$filters = [];
if (isset($_GET['tenant_id']) && !empty($_GET['tenant_id'])) {
    $filters['tenant_id'] = $_GET['tenant_id'];
}
if (isset($_GET['property_id']) && !empty($_GET['property_id'])) {
    $filters['property_id'] = $_GET['property_id'];
}
if (isset($_GET['status']) && !empty($_GET['status'])) {
    $filters['status'] = $_GET['status'];
}
if (isset($_GET['date_from']) && !empty($_GET['date_from'])) {
    $filters['date_from'] = $_GET['date_from'];
}
if (isset($_GET['date_to']) && !empty($_GET['date_to'])) {
    $filters['date_to'] = $_GET['date_to'];
}

// Get payments based on filters
$payments = $paymentModel->getAllPayments($filters);

// Get payment totals
$payment_totals = $paymentModel->getPaymentTotals($filters);

// Get all properties for the filter dropdown
$properties = $propertyModel->getAllProperties();

// Get all tenants for the filter dropdown
$tenants = $tenantModel->getAllTenants();

// Page title
$pageTitle = "Payments";
require_once '../includes/header.php';
?>

<div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="h3 mb-0 text-gray-800">Payments</h1>
        <a href="add_payment.php" class="btn btn-primary"><i class="fas fa-plus"></i> Record New Payment</a>
    </div>

    <?php include_once '../includes/messages.php'; ?>

    <!-- Filters -->
    <div class="card shadow mb-4">
        <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">Filters</h6>
        </div>
        <div class="card-body">
            <form method="GET" action="payments.php">
                <div class="row">
                    <div class="col-md-3">
                        <div class="form-group">
                            <label for="tenant_id">Tenant:</label>
                            <select class="form-control" id="tenant_id" name="tenant_id">
                                <option value="">All Tenants</option>
                                <?php foreach ($tenants as $tenant): ?>
                                    <option value="<?= $tenant['id'] ?>" <?= (isset($filters['tenant_id']) && $filters['tenant_id'] == $tenant['id']) ? 'selected' : '' ?>>
                                        <?= htmlspecialchars($tenant['first_name'] . ' ' . $tenant['last_name']) ?>
                                    </option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="form-group">
                            <label for="property_id">Property:</label>
                            <select class="form-control" id="property_id" name="property_id">
                                <option value="">All Properties</option>
                                <?php foreach ($properties as $property): ?>
                                    <option value="<?= $property['id'] ?>" <?= (isset($filters['property_id']) && $filters['property_id'] == $property['id']) ? 'selected' : '' ?>>
                                        <?= htmlspecialchars($property['name']) ?>
                                    </option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-2">
                        <div class="form-group">
                            <label for="status">Status:</label>
                            <select class="form-control" id="status" name="status">
                                <option value="">All Statuses</option>
                                <option value="completed" <?= (isset($filters['status']) && $filters['status'] == 'completed') ? 'selected' : '' ?>>Completed</option>
                                <option value="pending" <?= (isset($filters['status']) && $filters['status'] == 'pending') ? 'selected' : '' ?>>Pending</option>
                                <option value="failed" <?= (isset($filters['status']) && $filters['status'] == 'failed') ? 'selected' : '' ?>>Failed</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-2">
                        <div class="form-group">
                            <label for="date_from">Date From:</label>
                            <input type="date" class="form-control" id="date_from" name="date_from" 
                                   value="<?= isset($filters['date_from']) ? $filters['date_from'] : '' ?>">
                        </div>
                    </div>
                    <div class="col-md-2">
                        <div class="form-group">
                            <label for="date_to">Date To:</label>
                            <input type="date" class="form-control" id="date_to" name="date_to" 
                                   value="<?= isset($filters['date_to']) ? $filters['date_to'] : '' ?>">
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <button type="submit" class="btn btn-primary">Apply Filters</button>
                        <a href="payments.php" class="btn btn-secondary">Reset</a>
                    </div>
                </div>
            </form>
        </div>
    </div>

    <!-- Summary Card -->
    <div class="row mb-4">
        <div class="col-xl-3 col-md-6 mb-4">
            <div class="card border-left-primary shadow h-100 py-2">
                <div class="card-body">
                    <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                            <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                Total Payments</div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800"><?= $payment_totals['total_count'] ?></div>
                        </div>
                        <div class="col-auto">
                            <i class="fas fa-calendar fa-2x text-gray-300"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-xl-3 col-md-6 mb-4">
            <div class="card border-left-success shadow h-100 py-2">
                <div class="card-body">
                    <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                            <div class="text-xs font-weight-bold text-success text-uppercase mb-1">
                                Total Amount</div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800">
                                $<?= number_format($payment_totals['total_amount'], 2) ?>
                            </div>
                        </div>
                        <div class="col-auto">
                            <i class="fas fa-dollar-sign fa-2x text-gray-300"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Payments Table -->
    <div class="card shadow mb-4">
        <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">Payments List</h6>
        </div>
        <div class="card-body">
            <div class="table-responsive">
                <table class="table table-bordered" id="paymentsTable" width="100%" cellspacing="0">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Tenant</th>
                            <th>Property</th>
                            <th>Unit</th>
                            <th>Amount</th>
                            <th>Method</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (empty($payments)): ?>
                            <tr>
                                <td colspan="8" class="text-center">No payments found</td>
                            </tr>
                        <?php else: ?>
                            <?php foreach ($payments as $payment): ?>
                                <tr>
                                    <td><?= date('M d, Y', strtotime($payment['payment_date'])) ?></td>
                                    <td>
                                        <a href="view_tenant.php?id=<?= $payment['tenant_id'] ?>">
                                            <?= htmlspecialchars($payment['tenant_first_name'] . ' ' . $payment['tenant_last_name']) ?>
                                        </a>
                                    </td>
                                    <td><?= htmlspecialchars($payment['property_name']) ?></td>
                                    <td><?= htmlspecialchars($payment['unit_number']) ?></td>
                                    <td>$<?= number_format($payment['amount'], 2) ?></td>
                                    <td><?= htmlspecialchars($payment['payment_method']) ?></td>
                                    <td>
                                        <span class="badge badge-<?= getPaymentStatusBadgeClass($payment['status']) ?>">
                                            <?= ucfirst(htmlspecialchars($payment['status'])) ?>
                                        </span>
                                    </td>
                                    <td>
                                        <a href="view_payment.php?id=<?= $payment['id'] ?>" class="btn btn-info btn-sm">
                                            <i class="fas fa-eye"></i>
                                        </a>
                                        <a href="edit_payment.php?id=<?= $payment['id'] ?>" class="btn btn-primary btn-sm">
                                            <i class="fas fa-edit"></i>
                                        </a>
                                        <a href="payment_receipt.php?id=<?= $payment['id'] ?>" class="btn btn-success btn-sm">
                                            <i class="fas fa-file-invoice"></i>
                                        </a>
                                        <form action="payments.php" method="POST" class="d-inline" onsubmit="return confirm('Are you sure you want to delete this payment?');">
                                            <input type="hidden" name="payment_id" value="<?= $payment['id'] ?>">
                                            <button type="submit" name="delete_payment" class="btn btn-danger btn-sm">
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
    $('#paymentsTable').DataTable({
        "order": [[0, "desc"]]
    });
});

function getPaymentStatusBadgeClass(status) {
    switch(status) {
        case 'completed':
            return 'success';
        case 'pending':
            return 'warning';
        case 'failed':
            return 'danger';
        default:
            return 'secondary';
    }
}
</script>

<?php
require_once '../includes/footer.php';
?>
