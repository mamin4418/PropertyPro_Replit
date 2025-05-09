
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

// Initialize models
$paymentModel = new Payment($conn);
$leaseModel = new Lease($conn);
$tenantModel = new Tenant($conn);
$propertyModel = new Property($conn);

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

// Initialize form errors array
$errors = [];

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Validate input
    $lease_id = trim($_POST['lease_id']);
    $amount = trim($_POST['amount']);
    $payment_date = trim($_POST['payment_date']);
    $payment_method = trim($_POST['payment_method']);
    $reference_number = trim($_POST['reference_number']);
    $memo = trim($_POST['memo']);
    $status = trim($_POST['status']);
    
    // Basic validation
    if (empty($lease_id)) {
        $errors[] = "Lease is required";
    }
    if (empty($amount) || !is_numeric($amount) || $amount <= 0) {
        $errors[] = "Valid amount is required";
    }
    if (empty($payment_date)) {
        $errors[] = "Payment date is required";
    }
    if (empty($payment_method)) {
        $errors[] = "Payment method is required";
    }
    
    // If no errors, create the payment
    if (empty($errors)) {
        $payment_data = [
            'lease_id' => $lease_id,
            'amount' => $amount,
            'payment_date' => $payment_date,
            'payment_method' => $payment_method,
            'reference_number' => $reference_number,
            'memo' => $memo,
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
            $errors[] = "Failed to record payment";
        }
    }
}

// Page title
$pageTitle = "Record Payment";
require_once '../includes/header.php';
?>

<div class="container-fluid">
    <h1 class="h3 mb-4 text-gray-800">Record New Payment</h1>
    
    <?php if (!empty($errors)): ?>
        <div class="alert alert-danger">
            <ul class="mb-0">
                <?php foreach ($errors as $error): ?>
                    <li><?= $error ?></li>
                <?php endforeach; ?>
            </ul>
        </div>
    <?php endif; ?>
    
    <div class="card shadow mb-4">
        <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">Payment Information</h6>
        </div>
        <div class="card-body">
            <form method="POST" action="add_payment.php">
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="lease_id">Lease <span class="text-danger">*</span></label>
                            <select class="form-control" id="lease_id" name="lease_id" required>
                                <option value="">Select Lease</option>
                                <?php foreach ($leases as $lease): ?>
                                    <option value="<?= $lease['id'] ?>" <?= ($lease_id == $lease['id']) ? 'selected' : '' ?>>
                                        <?= htmlspecialchars($lease['tenant_name'] . ' - ' . $lease['property_name'] . ' (Unit ' . $lease['unit_number'] . ')') ?>
                                    </option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="amount">Amount <span class="text-danger">*</span></label>
                            <div class="input-group">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">$</span>
                                </div>
                                <input type="number" class="form-control" id="amount" name="amount" min="0.01" step="0.01" 
                                       value="<?= isset($_POST['amount']) ? htmlspecialchars($_POST['amount']) : (isset($selected_lease) ? $selected_lease['rent_amount'] : '') ?>" required>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="payment_date">Payment Date <span class="text-danger">*</span></label>
                            <input type="date" class="form-control" id="payment_date" name="payment_date" 
                                   value="<?= isset($_POST['payment_date']) ? htmlspecialchars($_POST['payment_date']) : date('Y-m-d') ?>" required>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="payment_method">Payment Method <span class="text-danger">*</span></label>
                            <select class="form-control" id="payment_method" name="payment_method" required>
                                <option value="">Select Method</option>
                                <option value="Cash" <?= (isset($_POST['payment_method']) && $_POST['payment_method'] == 'Cash') ? 'selected' : '' ?>>Cash</option>
                                <option value="Check" <?= (isset($_POST['payment_method']) && $_POST['payment_method'] == 'Check') ? 'selected' : '' ?>>Check</option>
                                <option value="Credit Card" <?= (isset($_POST['payment_method']) && $_POST['payment_method'] == 'Credit Card') ? 'selected' : '' ?>>Credit Card</option>
                                <option value="Bank Transfer" <?= (isset($_POST['payment_method']) && $_POST['payment_method'] == 'Bank Transfer') ? 'selected' : '' ?>>Bank Transfer</option>
                                <option value="Money Order" <?= (isset($_POST['payment_method']) && $_POST['payment_method'] == 'Money Order') ? 'selected' : '' ?>>Money Order</option>
                                <option value="Other" <?= (isset($_POST['payment_method']) && $_POST['payment_method'] == 'Other') ? 'selected' : '' ?>>Other</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="reference_number">Reference/Check Number</label>
                            <input type="text" class="form-control" id="reference_number" name="reference_number" 
                                   value="<?= isset($_POST['reference_number']) ? htmlspecialchars($_POST['reference_number']) : '' ?>">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="status">Status <span class="text-danger">*</span></label>
                            <select class="form-control" id="status" name="status" required>
                                <option value="completed" <?= (isset($_POST['status']) && $_POST['status'] == 'completed') ? 'selected' : 'selected' ?>>Completed</option>
                                <option value="pending" <?= (isset($_POST['status']) && $_POST['status'] == 'pending') ? 'selected' : '' ?>>Pending</option>
                                <option value="failed" <?= (isset($_POST['status']) && $_POST['status'] == 'failed') ? 'selected' : '' ?>>Failed</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="memo">Memo/Notes</label>
                    <textarea class="form-control" id="memo" name="memo" rows="3"><?= isset($_POST['memo']) ? htmlspecialchars($_POST['memo']) : '' ?></textarea>
                </div>
                
                <div class="mt-4">
                    <button type="submit" class="btn btn-primary">Record Payment</button>
                    <a href="payments.php" class="btn btn-secondary">Cancel</a>
                </div>
            </form>
        </div>
    </div>
</div>

<script>
$(document).ready(function() {
    // On lease change, fetch lease details to update suggested amount
    $('#lease_id').change(function() {
        var leaseId = $(this).val();
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

<?php
require_once '../includes/footer.php';
?>
