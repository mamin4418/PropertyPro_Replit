<?php
require_once '../database/init.php';
require_once '../includes/header.php';
require_once '../models/Payment.php';
require_once '../models/Lease.php';
require_once '../models/Tenant.php';
require_once '../models/Unit.php';
require_once '../models/Property.php';
require_once '../includes/functions.php';

// Initialize models
$paymentModel = new Payment($conn);
$leaseModel = new Lease($conn);
$tenantModel = new Tenant($conn);
$unitModel = new Unit($conn);
$propertyModel = new Property($conn);

// Check if user is logged in
session_start();
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

// Get lease ID from URL if provided
$lease_id = isset($_GET['lease_id']) ? intval($_GET['lease_id']) : null;

// Initialize variables
$leases = [];
$selected_lease = null;

// If a lease ID is provided, get the lease details
if ($lease_id) {
    $selected_lease = $leaseModel->getLeaseById($lease_id);
}

// Get leases for dropdown
$leases = $leaseModel->getAllActiveLeasesWithDetails();

// Process form submission
$success = '';
$error = '';

// Set default payment date to today if not submitted
$default_payment_date = date('Y-m-d');

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Validate and sanitize inputs
    $lease_id = isset($_POST['lease_id']) ? intval($_POST['lease_id']) : 0;
    $amount = isset($_POST['amount']) ? floatval($_POST['amount']) : 0;
    $payment_date = isset($_POST['payment_date']) ? $_POST['payment_date'] : '';
    $payment_method = isset($_POST['payment_method']) ? $_POST['payment_method'] : '';
    $payment_type = isset($_POST['payment_type']) ? $_POST['payment_type'] : '';
    $reference_number = isset($_POST['reference_number']) ? $_POST['reference_number'] : '';
    $memo = isset($_POST['memo']) ? $_POST['memo'] : '';
    $notes = isset($_POST['notes']) ? $_POST['notes'] : '';
    $status = isset($_POST['status']) ? $_POST['status'] : '';

    // Validate inputs
    if ($lease_id <= 0) {
        $error = "Please select a valid lease";
    } elseif ($amount <= 0) {
        $error = "Please enter a valid amount";
    } elseif (empty($payment_date)) {
        $error = "Please select a payment date";
    } elseif (empty($payment_method)) {
        $error = "Please select a payment method";
    } elseif (empty($payment_type)) {
        $error = "Please select a payment type";
    } else {
        // Insert payment into database
        $payment_data = [
            'lease_id' => $lease_id,
            'amount' => $amount,
            'payment_date' => $payment_date,
            'payment_method' => $payment_method,
            'payment_type' => $payment_type,
            'reference_number' => $reference_number,
            'memo' => $memo,
            'notes' => $notes,
            'status' => $status
        ];
        
        if ($payment_id = $paymentModel->createPayment($payment_data)) {
            $_SESSION['success_message'] = "Payment recorded successfully";
            
            // Generate receipt if status is completed
            if ($status === 'completed') {
                $receipt_ref = $paymentModel->generateReceipt($payment_id);
                if ($receipt_ref) {
                    $_SESSION['success_message'] .= ". Receipt: " . $receipt_ref;
                }
            }
            
            header("Location: payments.php");
            exit();
        } else {
             $error = "Failed to add payment. Please try again.";
        }
    }
}

// Page title
$pageTitle = "Record Payment";
?>

<div class="container-fluid">
    <h1 class="h3 mb-4 text-gray-800">Add Payment</h1>

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

    <div class="card shadow mb-4">
        <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">Payment Information</h6>
        </div>
        <div class="card-body">
            <form method="POST" action="">
                <div class="form-group row">
                    <div class="col-md-6">
                        <label for="lease_id">Lease <span class="text-danger">*</span></label>
                        <select class="form-control" id="lease_id" name="lease_id" required>
                            <option value="">Select a lease</option>
                            <?php foreach ($leases as $lease): ?>
                                <option value="<?php echo $lease['id']; ?>" <?php echo (isset($_POST['lease_id']) && $_POST['lease_id'] == $lease['id']) ? 'selected' : ''; ?>>
                                    <?php echo htmlspecialchars($lease['tenant_name'] . ' - ' . $lease['property_name'] . ' (Unit ' . $lease['unit_number'] . ')'); ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="col-md-6">
                        <label for="amount">Amount <span class="text-danger">*</span></label>
                        <div class="input-group">
                            <div class="input-group-prepend">
                                <span class="input-group-text">$</span>
                            </div>
                            <input type="number" class="form-control" id="amount" name="amount" step="0.01" min="0.01" value="<?php echo isset($_POST['amount']) ? htmlspecialchars($_POST['amount']) : (isset($selected_lease) ? $selected_lease['rent_amount'] : ''); ?>" required>
                        </div>
                    </div>
                </div>

                <div class="form-group row">
                    <div class="col-md-6">
                        <label for="payment_date">Payment Date <span class="text-danger">*</span></label>
                        <input type="date" class="form-control" id="payment_date" name="payment_date" value="<?php echo isset($_POST['payment_date']) ? htmlspecialchars($_POST['payment_date']) : $default_payment_date; ?>" required>
                    </div>
                    <div class="col-md-6">
                        <label for="payment_method">Payment Method <span class="text-danger">*</span></label>
                        <select class="form-control" id="payment_method" name="payment_method" required>
                            <option value="">Select a payment method</option>
                            <option value="cash" <?php echo (isset($_POST['payment_method']) && $_POST['payment_method'] == 'cash') ? 'selected' : ''; ?>>Cash</option>
                            <option value="check" <?php echo (isset($_POST['payment_method']) && $_POST['payment_method'] == 'check') ? 'selected' : ''; ?>>Check</option>
                            <option value="credit card" <?php echo (isset($_POST['payment_method']) && $_POST['payment_method'] == 'credit card') ? 'selected' : ''; ?>>Credit Card</option>
                            <option value="bank transfer" <?php echo (isset($_POST['payment_method']) && $_POST['payment_method'] == 'bank transfer') ? 'selected' : ''; ?>>Bank Transfer</option>
                            <option value="money order" <?php echo (isset($_POST['payment_method']) && $_POST['payment_method'] == 'money order') ? 'selected' : ''; ?>>Money Order</option>
                            <option value="other" <?php echo (isset($_POST['payment_method']) && $_POST['payment_method'] == 'other') ? 'selected' : ''; ?>>Other</option>
                        </select>
                    </div>
                </div>

                <div class="form-group row">
                    <div class="col-md-6">
                        <label for="payment_type">Payment Type <span class="text-danger">*</span></label>
                        <select class="form-control" id="payment_type" name="payment_type" required>
                            <option value="">Select a payment type</option>
                            <option value="rent" <?php echo (isset($_POST['payment_type']) && $_POST['payment_type'] == 'rent') ? 'selected' : ''; ?>>Rent</option>
                            <option value="deposit" <?php echo (isset($_POST['payment_type']) && $_POST['payment_type'] == 'deposit') ? 'selected' : ''; ?>>Deposit</option>
                            <option value="fee" <?php echo (isset($_POST['payment_type']) && $_POST['payment_type'] == 'fee') ? 'selected' : ''; ?>>Fee</option>
                            <option value="utility" <?php echo (isset($_POST['payment_type']) && $_POST['payment_type'] == 'utility') ? 'selected' : ''; ?>>Utility</option>
                            <option value="other" <?php echo (isset($_POST['payment_type']) && $_POST['payment_type'] == 'other') ? 'selected' : ''; ?>>Other</option>
                        </select>
                    </div>
                     <div class="col-md-6">
                        <label for="status">Status <span class="text-danger">*</span></label>
                        <select class="form-control" id="status" name="status" required>
                            <option value="completed" <?php echo (isset($_POST['status']) && $_POST['status'] == 'completed') ? 'selected' : 'selected'; ?>>Completed</option>
                            <option value="pending" <?php echo (isset($_POST['status']) && $_POST['status'] == 'pending') ? 'selected' : ''; ?>>Pending</option>
                            <option value="failed" <?php echo (isset($_POST['status']) && $_POST['status'] == 'failed') ? 'selected' : ''; ?>>Failed</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label for="memo">Memo/Notes</label>
                    <textarea class="form-control" id="memo" name="memo" rows="3"><?php echo isset($_POST['memo']) ? htmlspecialchars($_POST['memo']) : ''; ?></textarea>
                </div>

                <div class="form-group row">
                    <div class="col-md-6">
                        <label for="reference_number">Reference Number</label>
                        <input type="text" class="form-control" id="reference_number" name="reference_number" value="<?php echo isset($_POST['reference_number']) ? htmlspecialchars($_POST['reference_number']) : ''; ?>">
                    </div>
                    <div class="col-md-6">
                        <label for="notes">Notes</label>
                        <textarea class="form-control" id="notes" name="notes" rows="3"><?php echo isset($_POST['notes']) ? htmlspecialchars($_POST['notes']) : ''; ?></textarea>
                    </div>
                </div>

                <div class="form-group row">
                    <div class="col-md-6">
                        <button type="submit" class="btn btn-primary btn-block">
                            <i class="fas fa-save"></i> Record Payment
                        </button>
                    </div>
                    <div class="col-md-6">
                        <a href="payments.php" class="btn btn-secondary btn-block">
                            <i class="fas fa-arrow-left"></i> Back to Payments
                        </a>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>

<script>
    $(document).ready(function() {
        // Fetch lease details when a lease is selected
        $('#lease_id').change(function() {
            const leaseId = $(this).val();
            if (leaseId) {
                $.ajax({
                    url: '../api/get_lease.php',
                    type: 'GET',
                    data: { id: leaseId },
                    dataType: 'json',
                    success: function(data) {
                        if (data && data.rent_amount) {
                            $('#amount').val(data.rent_amount);
                        }
                    }
                });
            }
        });
    });
</script>

<?php require_once '../includes/footer.php'; ?>