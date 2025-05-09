<?php
require_once '../includes/header.php';
require_once '../models/Payment.php';

// Initialize Payment model
$paymentModel = new Payment($mysqli);

// Get query parameters
$search = isset($_GET['search']) ? $_GET['search'] : '';
$start_date = isset($_GET['start_date']) ? $_GET['start_date'] : '';
$end_date = isset($_GET['end_date']) ? $_GET['end_date'] : '';
$payment_type = isset($_GET['payment_type']) ? $_GET['payment_type'] : '';

// Get all payments or filtered payments
if (!empty($start_date) && !empty($end_date)) {
    $payments = $paymentModel->getPaymentsByDateRange($start_date, $end_date);
} else {
    $payments = $paymentModel->getAllPayments();
}

// Filter by payment type if specified
if (!empty($payment_type)) {
    $payments = array_filter($payments, function($payment) use ($payment_type) {
        return $payment['payment_type'] == $payment_type;
    });
}

// Filter by search term if provided
if (!empty($search)) {
    $search = strtolower($search);
    $payments = array_filter($payments, function($payment) use ($search) {
        return (
            stripos($payment['tenant_name'], $search) !== false ||
            stripos($payment['property_name'], $search) !== false ||
            stripos($payment['unit_number'], $search) !== false ||
            stripos($payment['reference_number'], $search) !== false
        );
    });
}

// Get payment statistics
$stats = $paymentModel->getPaymentStats();

// Process any success or error messages
$success = isset($_GET['success']) ? $_GET['success'] : '';
$error = isset($_GET['error']) ? $_GET['error'] : '';
?>

<div class="container-fluid">
    <h1 class="h3 mb-4 text-gray-800">Payments</h1>

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

    <!-- Payment Overview Cards -->
    <div class="row">
        <div class="col-xl-3 col-md-6 mb-4">
            <div class="card border-left-primary shadow h-100 py-2">
                <div class="card-body">
                    <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                            <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                Total Payments</div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800"><?php echo $stats['count']; ?></div>
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
                            <div class="h5 mb-0 font-weight-bold text-gray-800">$<?php echo number_format($stats['total_amount'], 2); ?></div>
                        </div>
                        <div class="col-auto">
                            <i class="fas fa-dollar-sign fa-2x text-gray-300"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-xl-3 col-md-6 mb-4">
            <div class="card border-left-info shadow h-100 py-2">
                <div class="card-body">
                    <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                            <div class="text-xs font-weight-bold text-info text-uppercase mb-1">
                                Average Payment</div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800">$<?php echo number_format($stats['avg_amount'], 2); ?></div>
                        </div>
                        <div class="col-auto">
                            <i class="fas fa-clipboard-list fa-2x text-gray-300"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-xl-3 col-md-6 mb-4">
            <div class="card border-left-warning shadow h-100 py-2">
                <div class="card-body">
                    <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                            <div class="text-xs font-weight-bold text-warning text-uppercase mb-1">
                                Recent Payments</div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800"><?php echo count($stats['recent_payments']); ?></div>
                        </div>
                        <div class="col-auto">
                            <i class="fas fa-comments fa-2x text-gray-300"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Payment Filter Card -->
    <div class="card shadow mb-4">
        <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">Filter Payments</h6>
        </div>
        <div class="card-body">
            <form method="GET" class="form-inline">
                <div class="input-group mb-2 mr-sm-2">
                    <input type="text" class="form-control" id="search" name="search" placeholder="Search..." value="<?php echo $search; ?>">
                </div>
                <div class="input-group mb-2 mr-sm-2">
                    <div class="input-group-prepend">
                        <div class="input-group-text">From</div>
                    </div>
                    <input type="date" class="form-control" id="start_date" name="start_date" value="<?php echo $start_date; ?>">
                </div>
                <div class="input-group mb-2 mr-sm-2">
                    <div class="input-group-prepend">
                        <div class="input-group-text">To</div>
                    </div>
                    <input type="date" class="form-control" id="end_date" name="end_date" value="<?php echo $end_date; ?>">
                </div>
                <div class="input-group mb-2 mr-sm-2">
                    <select class="form-control" id="payment_type" name="payment_type">
                        <option value="" <?php echo $payment_type == '' ? 'selected' : ''; ?>>All Payment Types</option>
                        <option value="rent" <?php echo $payment_type == 'rent' ? 'selected' : ''; ?>>Rent</option>
                        <option value="deposit" <?php echo $payment_type == 'deposit' ? 'selected' : ''; ?>>Deposit</option>
                        <option value="fee" <?php echo $payment_type == 'fee' ? 'selected' : ''; ?>>Fee</option>
                        <option value="utility" <?php echo $payment_type == 'utility' ? 'selected' : ''; ?>>Utility</option>
                        <option value="other" <?php echo $payment_type == 'other' ? 'selected' : ''; ?>>Other</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-primary mb-2">
                    <i class="fas fa-filter"></i> Filter
                </button>
                <a href="payments.php" class="btn btn-secondary mb-2 ml-2">
                    <i class="fas fa-sync"></i> Reset
                </a>
            </form>
        </div>
    </div>

    <!-- Payments Table -->
    <div class="card shadow mb-4">
        <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
            <h6 class="m-0 font-weight-bold text-primary">All Payments</h6>
            <a href="add_payment.php" class="btn btn-primary btn-sm">
                <i class="fas fa-plus"></i> Add Payment
            </a>
        </div>
        <div class="card-body">
            <div class="table-responsive">
                <table class="table table-bordered" id="paymentsTable" width="100%" cellspacing="0">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Date</th>
                            <th>Tenant</th>
                            <th>Property</th>
                            <th>Unit</th>
                            <th>Amount</th>
                            <th>Method</th>
                            <th>Type</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (count($payments) > 0): ?>
                            <?php foreach ($payments as $payment): ?>
                                <tr>
                                    <td><?php echo $payment['id']; ?></td>
                                    <td><?php echo date('M d, Y', strtotime($payment['payment_date'])); ?></td>
                                    <td><?php echo $payment['tenant_name']; ?></td>
                                    <td><?php echo $payment['property_name']; ?></td>
                                    <td><?php echo $payment['unit_number']; ?></td>
                                    <td>$<?php echo number_format($payment['amount'], 2); ?></td>
                                    <td><?php echo ucfirst($payment['payment_method']); ?></td>
                                    <td><?php echo ucfirst($payment['payment_type']); ?></td>
                                    <td>
                                        <a href="view_payment.php?id=<?php echo $payment['id']; ?>" class="btn btn-info btn-sm">
                                            <i class="fas fa-eye"></i>
                                        </a>
                                        <a href="edit_payment.php?id=<?php echo $payment['id']; ?>" class="btn btn-primary btn-sm">
                                            <i class="fas fa-edit"></i>
                                        </a>
                                        <a href="payment_receipt.php?id=<?php echo $payment['id']; ?>" class="btn btn-success btn-sm">
                                            <i class="fas fa-file-invoice-dollar"></i>
                                        </a>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        <?php else: ?>
                            <tr>
                                <td colspan="9" class="text-center">No payments found</td>
                            </tr>
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
            "order": [[ 0, "desc" ]]
        });
    });
</script>

<?php require_once '../includes/footer.php'; ?>