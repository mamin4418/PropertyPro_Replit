
<?php
require_once '../includes/header.php';
require_once '../models/Payment.php';
require_once '../models/Lease.php';

// Initialize classes
$paymentModel = new Payment($mysqli);
$leaseModel = new Lease($mysqli);

// Get payment ID from URL
$payment_id = isset($_GET['id']) ? intval($_GET['id']) : 0;

// Verify payment exists
$payment = $paymentModel->getPaymentById($payment_id);
if (!$payment) {
    // Payment not found, redirect to payments page
    header("Location: payments.php?error=Payment not found");
    exit;
}

// Get lease details for the dropdown
$leases = $leaseModel->getAllLeases();

// Process form submission
$success = '';
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Validate and sanitize inputs
    $lease_id = isset($_POST['lease_id']) ? intval($_POST['lease_id']) : 0;
    $amount = isset($_POST['amount']) ? floatval($_POST['amount']) : 0;
    $payment_date = isset($_POST['payment_date']) ? $_POST['payment_date'] : '';
    $payment_method = isset($_POST['payment_method']) ? $_POST['payment_method'] : '';
    $payment_type = isset($_POST['payment_type']) ? $_POST['payment_type'] : '';
    $reference_number = isset($_POST['reference_number']) ? $_POST['reference_number'] : '';
    $notes = isset($_POST['notes']) ? $_POST['notes'] : '';

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
        // Update payment in the database
        $result = $paymentModel->updatePayment(
            $payment_id,
            $lease_id,
            $amount,
            $payment_date,
            $payment_method,
            $payment_type,
            $reference_number,
            $notes
        );

        if ($result) {
            $success = "Payment updated successfully";
        } else {
            $error = "Failed to update payment. Please try again.";
        }
    }
}
?>

<div class="container-fluid">
    <h1 class="h3 mb-4 text-gray-800">Edit Payment</h1>

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
            <h6 class="m-0 font-weight-bold text-primary">Payment Details</h6>
        </div>
        <div class="card-body">
            <form method="POST" action="">
                <div class="form-group row">
                    <div class="col-md-6">
                        <label for="lease_id">Lease</label>
                        <select class="form-control" id="lease_id" name="lease_id" required>
                            <option value="">Select a lease</option>
                            <?php foreach ($leases as $lease): ?>
                                <option value="<?php echo $lease['id']; ?>" <?php echo ($lease['id'] == $payment['lease_id']) ? 'selected' : ''; ?>>
                                    <?php echo "Lease #" . $lease['id'] . " - Unit " . $lease['unit_number'] . " - " . $lease['tenant_name']; ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="col-md-6">
                        <label for="amount">Amount</label>
                        <div class="input-group">
                            <div class="input-group-prepend">
                                <span class="input-group-text">$</span>
                            </div>
                            <input type="number" class="form-control" id="amount" name="amount" step="0.01" min="0.01" value="<?php echo $payment['amount']; ?>" required>
                        </div>
                    </div>
                </div>

                <div class="form-group row">
                    <div class="col-md-6">
                        <label for="payment_date">Payment Date</label>
                        <input type="date" class="form-control" id="payment_date" name="payment_date" value="<?php echo $payment['payment_date']; ?>" required>
                    </div>
                    <div class="col-md-6">
                        <label for="payment_method">Payment Method</label>
                        <select class="form-control" id="payment_method" name="payment_method" required>
                            <option value="">Select a payment method</option>
                            <option value="check" <?php echo ($payment['payment_method'] == 'check') ? 'selected' : ''; ?>>Check</option>
                            <option value="cash" <?php echo ($payment['payment_method'] == 'cash') ? 'selected' : ''; ?>>Cash</option>
                            <option value="online" <?php echo ($payment['payment_method'] == 'online') ? 'selected' : ''; ?>>Online</option>
                            <option value="bank transfer" <?php echo ($payment['payment_method'] == 'bank transfer') ? 'selected' : ''; ?>>Bank Transfer</option>
                            <option value="credit card" <?php echo ($payment['payment_method'] == 'credit card') ? 'selected' : ''; ?>>Credit Card</option>
                            <option value="other" <?php echo ($payment['payment_method'] == 'other') ? 'selected' : ''; ?>>Other</option>
                        </select>
                    </div>
                </div>

                <div class="form-group row">
                    <div class="col-md-6">
                        <label for="payment_type">Payment Type</label>
                        <select class="form-control" id="payment_type" name="payment_type" required>
                            <option value="">Select a payment type</option>
                            <option value="rent" <?php echo ($payment['payment_type'] == 'rent') ? 'selected' : ''; ?>>Rent</option>
                            <option value="deposit" <?php echo ($payment['payment_type'] == 'deposit') ? 'selected' : ''; ?>>Deposit</option>
                            <option value="fee" <?php echo ($payment['payment_type'] == 'fee') ? 'selected' : ''; ?>>Fee</option>
                            <option value="utility" <?php echo ($payment['payment_type'] == 'utility') ? 'selected' : ''; ?>>Utility</option>
                            <option value="other" <?php echo ($payment['payment_type'] == 'other') ? 'selected' : ''; ?>>Other</option>
                        </select>
                    </div>
                    <div class="col-md-6">
                        <label for="reference_number">Reference Number</label>
                        <input type="text" class="form-control" id="reference_number" name="reference_number" value="<?php echo $payment['reference_number']; ?>">
                    </div>
                </div>

                <div class="form-group">
                    <label for="notes">Notes</label>
                    <textarea class="form-control" id="notes" name="notes" rows="3"><?php echo $payment['notes']; ?></textarea>
                </div>

                <div class="form-group row">
                    <div class="col-md-6">
                        <button type="submit" class="btn btn-primary btn-block">
                            <i class="fas fa-save"></i> Update Payment
                        </button>
                    </div>
                    <div class="col-md-6">
                        <a href="view_payment.php?id=<?php echo $payment_id; ?>" class="btn btn-secondary btn-block">
                            <i class="fas fa-arrow-left"></i> Back to Payment Details
                        </a>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>

<?php require_once '../includes/footer.php'; ?>
