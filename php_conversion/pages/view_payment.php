
<?php
require_once '../database/init.php';
require_once '../models/Payment.php';
require_once '../models/Lease.php';
require_once '../models/Tenant.php';
require_once '../models/Property.php';
require_once '../includes/functions.php';

// Check if user is logged in
session_start();
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

// Check if payment ID is provided
if (!isset($_GET['id']) || empty($_GET['id'])) {
    header("Location: payments.php");
    exit();
}

$payment_id = $_GET['id'];

// Initialize models
$paymentModel = new Payment($conn);
$leaseModel = new Lease($conn);
$tenantModel = new Tenant($conn);
$propertyModel = new Property($conn);

// Get payment details
$payment = $paymentModel->getPaymentById($payment_id);

if (!$payment) {
    $_SESSION['error_message'] = "Payment not found";
    header("Location: payments.php");
    exit();
}

// Generate receipt if not exists and status is completed
if ($payment['status'] === 'completed' && empty($payment['receipt_reference'])) {
    $receipt_ref = $paymentModel->generateReceipt($payment_id);
}

// Get lease details
$lease = $leaseModel->getLeaseById($payment['lease_id']);

// Page title
$pageTitle = "View Payment";
require_once '../includes/header.php';
?>

<div class="container-fluid">
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 class="h3 mb-0 text-gray-800">Payment Details</h1>
        <div>
            <a href="edit_payment.php?id=<?= $payment_id ?>" class="btn btn-primary btn-sm">
                <i class="fas fa-edit"></i> Edit Payment
            </a>
            <a href="payment_receipt.php?id=<?= $payment_id ?>" class="btn btn-success btn-sm">
                <i class="fas fa-file-invoice"></i> View Receipt
            </a>
            <a href="payments.php" class="btn btn-secondary btn-sm">
                <i class="fas fa-arrow-left"></i> Back to Payments
            </a>
        </div>
    </div>

    <?php include_once '../includes/messages.php'; ?>

    <div class="row">
        <!-- Payment Information Card -->
        <div class="col-xl-6 col-lg-6">
            <div class="card shadow mb-4">
                <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                    <h6 class="m-0 font-weight-bold text-primary">Payment Information</h6>
                    <span class="badge badge-<?= getPaymentStatusBadgeClass($payment['status']) ?> badge-lg">
                        <?= ucfirst(htmlspecialchars($payment['status'])) ?>
                    </span>
                </div>
                <div class="card-body">
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <strong>Amount:</strong>
                            <p class="text-lg">$<?= number_format($payment['amount'], 2) ?></p>
                        </div>
                        <div class="col-md-6">
                            <strong>Payment Date:</strong>
                            <p><?= date('M d, Y', strtotime($payment['payment_date'])) ?></p>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <strong>Payment Method:</strong>
                            <p><?= htmlspecialchars($payment['payment_method']) ?></p>
                        </div>
                        <div class="col-md-6">
                            <strong>Reference/Check Number:</strong>
                            <p><?= !empty($payment['reference_number']) ? htmlspecialchars($payment['reference_number']) : 'N/A' ?></p>
                        </div>
                    </div>
                    <?php if (!empty($payment['receipt_reference'])): ?>
                        <div class="row mb-3">
                            <div class="col-md-12">
                                <strong>Receipt Reference:</strong>
                                <p><?= htmlspecialchars($payment['receipt_reference']) ?></p>
                            </div>
                        </div>
                    <?php endif; ?>
                    <?php if (!empty($payment['memo'])): ?>
                        <div class="mb-3">
                            <strong>Memo/Notes:</strong>
                            <p><?= nl2br(htmlspecialchars($payment['memo'])) ?></p>
                        </div>
                    <?php endif; ?>
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <strong>Created At:</strong>
                            <p><?= date('M d, Y H:i', strtotime($payment['created_at'])) ?></p>
                        </div>
                        <?php if (!empty($payment['updated_at'])): ?>
                            <div class="col-md-6">
                                <strong>Updated At:</strong>
                                <p><?= date('M d, Y H:i', strtotime($payment['updated_at'])) ?></p>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        </div>

        <!-- Lease and Tenant Information Card -->
        <div class="col-xl-6 col-lg-6">
            <div class="card shadow mb-4">
                <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">Lease and Tenant Information</h6>
                </div>
                <div class="card-body">
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <strong>Tenant:</strong>
                            <p>
                                <a href="view_tenant.php?id=<?= $payment['tenant_id'] ?>">
                                    <?= htmlspecialchars($payment['tenant_first_name'] . ' ' . $payment['tenant_last_name']) ?>
                                </a>
                            </p>
                        </div>
                        <div class="col-md-6">
                            <strong>Lease:</strong>
                            <p>
                                <a href="view_lease.php?id=<?= $payment['lease_id'] ?>">
                                    View Lease Details
                                </a>
                            </p>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <strong>Property:</strong>
                            <p>
                                <a href="view_property.php?id=<?= $payment['property_id'] ?>">
                                    <?= htmlspecialchars($payment['property_name']) ?>
                                </a>
                            </p>
                        </div>
                        <div class="col-md-6">
                            <strong>Unit:</strong>
                            <p>
                                <a href="view_unit.php?id=<?= $payment['unit_id'] ?>">
                                    <?= htmlspecialchars($payment['unit_number']) ?>
                                </a>
                            </p>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <strong>Lease Term:</strong>
                            <p>
                                <?= date('M d, Y', strtotime($lease['start_date'])) ?> - 
                                <?= date('M d, Y', strtotime($lease['end_date'])) ?>
                            </p>
                        </div>
                        <div class="col-md-6">
                            <strong>Monthly Rent:</strong>
                            <p>$<?= number_format($lease['rent_amount'], 2) ?></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Related Payments Card -->
    <div class="card shadow mb-4">
        <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">Other Payments for this Lease</h6>
        </div>
        <div class="card-body">
            <?php
            $lease_payments = $paymentModel->getPaymentsByLeaseId($payment['lease_id']);
            ?>
            
            <?php if (empty($lease_payments) || count($lease_payments) <= 1): ?>
                <p class="text-center">No other payments found for this lease.</p>
            <?php else: ?>
                <div class="table-responsive">
                    <table class="table table-bordered" width="100%" cellspacing="0">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Method</th>
                                <th>Status</th>
                                <th>Reference</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($lease_payments as $lease_payment): ?>
                                <?php if ($lease_payment['id'] != $payment_id): ?>
                                    <tr>
                                        <td><?= date('M d, Y', strtotime($lease_payment['payment_date'])) ?></td>
                                        <td>$<?= number_format($lease_payment['amount'], 2) ?></td>
                                        <td><?= htmlspecialchars($lease_payment['payment_method']) ?></td>
                                        <td>
                                            <span class="badge badge-<?= getPaymentStatusBadgeClass($lease_payment['status']) ?>">
                                                <?= ucfirst(htmlspecialchars($lease_payment['status'])) ?>
                                            </span>
                                        </td>
                                        <td><?= !empty($lease_payment['reference_number']) ? htmlspecialchars($lease_payment['reference_number']) : 'N/A' ?></td>
                                        <td>
                                            <a href="view_payment.php?id=<?= $lease_payment['id'] ?>" class="btn btn-info btn-sm">
                                                <i class="fas fa-eye"></i> View
                                            </a>
                                        </td>
                                    </tr>
                                <?php endif; ?>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            <?php endif; ?>
        </div>
    </div>

    <!-- Action Buttons -->
    <div class="row mb-4">
        <div class="col-md-12">
            <div class="card shadow">
                <div class="card-body">
                    <h6 class="font-weight-bold">Actions</h6>
                    <div class="mt-3 d-flex flex-wrap gap-2">
                        <a href="edit_payment.php?id=<?= $payment_id ?>" class="btn btn-primary m-1">
                            <i class="fas fa-edit"></i> Edit Payment
                        </a>
                        <a href="payment_receipt.php?id=<?= $payment_id ?>" class="btn btn-success m-1">
                            <i class="fas fa-file-invoice"></i> View Receipt
                        </a>
                        <?php if ($payment['status'] === 'pending'): ?>
                            <a href="mark_payment_completed.php?id=<?= $payment_id ?>" class="btn btn-info m-1">
                                <i class="fas fa-check"></i> Mark as Completed
                            </a>
                        <?php endif; ?>
                        <form action="payments.php" method="POST" class="d-inline m-1" onsubmit="return confirm('Are you sure you want to delete this payment?');">
                            <input type="hidden" name="payment_id" value="<?= $payment_id ?>">
                            <button type="submit" name="delete_payment" class="btn btn-danger">
                                <i class="fas fa-trash"></i> Delete Payment
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
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
