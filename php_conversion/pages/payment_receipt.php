
<?php
require_once '../database/init.php';
require_once '../models/Payment.php';
require_once '../models/Lease.php';
require_once '../models/Tenant.php';
require_once '../models/Property.php';
require_once '../models/Company.php';
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
$companyModel = new Company($conn);

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
    // Refresh payment details after generating receipt
    $payment = $paymentModel->getPaymentById($payment_id);
}

// Get lease details
$lease = $leaseModel->getLeaseById($payment['lease_id']);

// Get tenant details
$tenant = $tenantModel->getTenantById($payment['tenant_id']);

// Get property details
$property = $propertyModel->getPropertyById($payment['property_id']);

// Get company details
$company = $companyModel->getFirstCompany();

// Calculate payment period (assuming for rent)
$payment_period_start = date('Y-m-01', strtotime($payment['payment_date']));
$payment_period_end = date('Y-m-t', strtotime($payment['payment_date']));

// Format dates
$formatted_payment_date = date('F j, Y', strtotime($payment['payment_date']));
$formatted_period_start = date('F j, Y', strtotime($payment_period_start));
$formatted_period_end = date('F j, Y', strtotime($payment_period_end));

// Page title - don't include header for clean receipt
$pageTitle = "Payment Receipt";
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Receipt #<?= $payment['receipt_reference'] ?? $payment_id ?></title>
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 14px;
            line-height: 1.5;
            color: #333;
            background-color: #f8f9fc;
        }
        .receipt-container {
            max-width: 800px;
            margin: 30px auto;
            background-color: #fff;
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
            border-radius: 5px;
            overflow: hidden;
        }
        .receipt-header {
            padding: 20px;
            background-color: #4e73df;
            color: #fff;
        }
        .receipt-body {
            padding: 30px;
        }
        .receipt-footer {
            padding: 20px;
            background-color: #f8f9fc;
            text-align: center;
            font-size: 12px;
            color: #858796;
        }
        .receipt-title {
            font-size: 24px;
            font-weight: bold;
            margin: 0;
        }
        .receipt-subtitle {
            font-size: 14px;
            margin-top: 5px;
        }
        .receipt-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
        }
        .receipt-info-block {
            flex: 1;
        }
        .receipt-info-block h3 {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 10px;
            color: #4e73df;
        }
        .receipt-amount {
            font-size: 24px;
            font-weight: bold;
            color: #1cc88a;
            text-align: center;
            margin: 20px 0;
            padding: 15px;
            background-color: #f8f9fc;
            border-radius: 5px;
        }
        .receipt-table {
            width: 100%;
            margin-bottom: 30px;
        }
        .receipt-table th {
            background-color: #f8f9fc;
            padding: 10px;
            text-align: left;
        }
        .receipt-table td {
            padding: 10px;
            border-bottom: 1px solid #e3e6f0;
        }
        .receipt-signature {
            margin-top: 50px;
            text-align: center;
        }
        .signature-line {
            width: 200px;
            margin: 40px auto 10px;
            border-bottom: 1px solid #333;
        }
        .receipt-status {
            position: absolute;
            top: 60px;
            right: 30px;
            font-size: 24px;
            transform: rotate(-15deg);
            padding: 5px 15px;
            border: 2px solid;
            border-radius: 10px;
            text-transform: uppercase;
        }
        .status-completed {
            color: #1cc88a;
            border-color: #1cc88a;
        }
        .status-pending {
            color: #f6c23e;
            border-color: #f6c23e;
        }
        .status-failed {
            color: #e74a3b;
            border-color: #e74a3b;
        }
        .receipt-actions {
            margin-top: 30px;
            text-align: center;
        }
        @media print {
            body {
                background-color: #fff;
            }
            .receipt-container {
                box-shadow: none;
                margin: 0;
                max-width: 100%;
            }
            .receipt-actions {
                display: none;
            }
            .no-print {
                display: none;
            }
        }
    </style>
</head>
<body>
    <div class="receipt-container position-relative">
        <!-- Receipt Header -->
        <div class="receipt-header">
            <div class="receipt-title">Payment Receipt</div>
            <div class="receipt-subtitle">
                Receipt #: <?= $payment['receipt_reference'] ?? 'RCPT-' . $payment_id ?>
            </div>
        </div>
        
        <!-- Status Stamp -->
        <div class="receipt-status status-<?= $payment['status'] ?>">
            <?= ucfirst(htmlspecialchars($payment['status'])) ?>
        </div>
        
        <!-- Receipt Body -->
        <div class="receipt-body">
            <!-- From and To Information -->
            <div class="receipt-info">
                <div class="receipt-info-block">
                    <h3>From</h3>
                    <p>
                        <strong><?= htmlspecialchars($company['name'] ?? 'Property Management Company') ?></strong><br>
                        <?= nl2br(htmlspecialchars($company['address'] ?? '123 Main Street, City, State ZIP')) ?><br>
                        <?= htmlspecialchars($company['phone'] ?? 'Phone: (123) 456-7890') ?><br>
                        <?= htmlspecialchars($company['email'] ?? 'Email: info@propertymanagement.com') ?>
                    </p>
                </div>
                
                <div class="receipt-info-block">
                    <h3>To</h3>
                    <p>
                        <strong><?= htmlspecialchars($tenant['first_name'] . ' ' . $tenant['last_name']) ?></strong><br>
                        <?= htmlspecialchars($property['name']) ?><br>
                        Unit: <?= htmlspecialchars($payment['unit_number']) ?><br>
                        <?= htmlspecialchars($tenant['email']) ?><br>
                        <?= htmlspecialchars($tenant['phone']) ?>
                    </p>
                </div>
                
                <div class="receipt-info-block">
                    <h3>Receipt Details</h3>
                    <p>
                        <strong>Date: </strong><?= $formatted_payment_date ?><br>
                        <strong>Payment Method: </strong><?= htmlspecialchars($payment['payment_method']) ?><br>
                        <?php if (!empty($payment['reference_number'])): ?>
                            <strong>Reference: </strong><?= htmlspecialchars($payment['reference_number']) ?><br>
                        <?php endif; ?>
                    </p>
                </div>
            </div>
            
            <!-- Payment Amount -->
            <div class="receipt-amount">
                Payment Amount: $<?= number_format($payment['amount'], 2) ?>
            </div>
            
            <!-- Payment Details Table -->
            <table class="receipt-table">
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Period</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Rent Payment - <?= htmlspecialchars($property['name']) ?> (Unit <?= htmlspecialchars($payment['unit_number']) ?>)</td>
                        <td><?= $formatted_period_start ?> - <?= $formatted_period_end ?></td>
                        <td>$<?= number_format($payment['amount'], 2) ?></td>
                    </tr>
                    <?php if (!empty($payment['memo'])): ?>
                        <tr>
                            <td colspan="3">
                                <strong>Notes: </strong><?= nl2br(htmlspecialchars($payment['memo'])) ?>
                            </td>
                        </tr>
                    <?php endif; ?>
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="2" style="text-align: right;"><strong>Total</strong></td>
                        <td><strong>$<?= number_format($payment['amount'], 2) ?></strong></td>
                    </tr>
                </tfoot>
            </table>
            
            <!-- Signature -->
            <div class="receipt-signature">
                <div class="signature-line"></div>
                <div>Authorized Signature</div>
            </div>
            
            <!-- Actions (Only visible on screen) -->
            <div class="receipt-actions no-print">
                <button class="btn btn-primary" onclick="window.print();">Print Receipt</button>
                <a href="view_payment.php?id=<?= $payment_id ?>" class="btn btn-secondary">Back to Payment</a>
                <a href="payments.php" class="btn btn-light">All Payments</a>
            </div>
        </div>
        
        <!-- Receipt Footer -->
        <div class="receipt-footer">
            <p>This receipt was generated on <?= date('F j, Y, g:i a') ?>.</p>
            <p>Thank you for your payment!</p>
        </div>
    </div>
</body>
</html>
