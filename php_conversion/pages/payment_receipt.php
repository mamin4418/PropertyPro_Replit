
<?php
require_once '../models/Payment.php';
require_once '../models/Lease.php';
require_once '../models/Tenant.php';
require_once '../models/Unit.php';
require_once '../models/Property.php';

// Initialize database connection
$mysqli = require_once '../config/database.php';

// Initialize models
$paymentModel = new Payment($mysqli);
$leaseModel = new Lease($mysqli);
$tenantModel = new Tenant($mysqli);
$unitModel = new Unit($mysqli);
$propertyModel = new Property($mysqli);

// Get payment ID from URL
$payment_id = isset($_GET['id']) ? intval($_GET['id']) : 0;

// Verify payment exists
$payment = $paymentModel->getPaymentById($payment_id);
if (!$payment) {
    // Payment not found, redirect to payments page
    header("Location: payments.php?error=Payment not found");
    exit;
}

// Get lease details
$lease = $leaseModel->getLeaseById($payment['lease_id']);

// Get tenant details
$tenant = $tenantModel->getTenantById($lease['tenant_id']);

// Get unit details
$unit = $unitModel->getUnitById($lease['unit_id']);

// Get property details
$property = $propertyModel->getPropertyById($unit['property_id']);

// Format payment date
$payment_date = date('F j, Y', strtotime($payment['payment_date']));

// Generate receipt number
$receipt_number = 'RCP-' . str_pad($payment['id'], 6, '0', STR_PAD_LEFT);

// Format amount
$amount_formatted = number_format($payment['amount'], 2);

// Function to convert number to words
function numberToWords($num) {
    $ones = array(
        0 => "ZERO",
        1 => "ONE",
        2 => "TWO",
        3 => "THREE",
        4 => "FOUR",
        5 => "FIVE",
        6 => "SIX",
        7 => "SEVEN",
        8 => "EIGHT",
        9 => "NINE",
        10 => "TEN",
        11 => "ELEVEN",
        12 => "TWELVE",
        13 => "THIRTEEN",
        14 => "FOURTEEN",
        15 => "FIFTEEN",
        16 => "SIXTEEN",
        17 => "SEVENTEEN",
        18 => "EIGHTEEN",
        19 => "NINETEEN"
    );
    $tens = array(
        0 => "",
        1 => "",
        2 => "TWENTY",
        3 => "THIRTY",
        4 => "FORTY",
        5 => "FIFTY",
        6 => "SIXTY",
        7 => "SEVENTY",
        8 => "EIGHTY",
        9 => "NINETY"
    );
    $hundreds = array(
        "HUNDRED",
        "THOUSAND",
        "MILLION",
        "BILLION",
        "TRILLION",
        "QUADRILLION"
    );

    $num = number_format($num, 2, ".", ",");
    $num_arr = explode(".", $num);
    $wholenum = $num_arr[0];
    $decnum = $num_arr[1];
    $whole_arr = array_reverse(explode(",", $wholenum));
    krsort($whole_arr);
    $rettxt = "";

    foreach($whole_arr as $key => $i) {
        if($i < 20) {
            $rettxt .= $ones[$i];
        } elseif($i < 100) {
            $rettxt .= $tens[substr($i, 0, 1)];
            $rettxt .= " " . $ones[substr($i, 1, 1)];
        } else {
            $rettxt .= $ones[substr($i, 0, 1)] . " " . $hundreds[0];
            $rettxt .= " " . $tens[substr($i, 1, 1)];
            $rettxt .= " " . $ones[substr($i, 2, 1)];
        }
        
        if($key > 0) {
            $rettxt .= " " . $hundreds[$key] . " ";
        }
    }
    
    if($decnum > 0) {
        $rettxt .= " AND ";
        if($decnum < 20) {
            $rettxt .= $ones[$decnum];
        } elseif($decnum < 100) {
            $rettxt .= $tens[substr($decnum, 0, 1)];
            $rettxt .= " " . $ones[substr($decnum, 1, 1)];
        }
        $rettxt .= " CENTS";
    }
    
    return $rettxt;
}

// Convert amount to words
$amount_in_words = numberToWords($payment['amount']);

// Handle print request
$print = isset($_GET['print']) && $_GET['print'] == 'true';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Receipt #<?php echo $receipt_number; ?></title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .receipt-container {
            max-width: 800px;
            margin: 0 auto;
            background-color: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .receipt-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
            border-bottom: 2px solid #ddd;
            padding-bottom: 20px;
        }
        .company-info h2 {
            color: #333;
            margin: 0;
        }
        .receipt-title {
            font-size: 24px;
            margin-bottom: 20px;
            color: #333;
            text-align: center;
        }
        .receipt-details {
            margin-bottom: 20px;
        }
        .receipt-details table {
            width: 100%;
            border-collapse: collapse;
        }
        .receipt-details th, .receipt-details td {
            padding: 8px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        .amount-section {
            margin: 20px 0;
            padding: 15px;
            background-color: #f9f9f9;
            border-radius: 5px;
            border: 1px solid #ddd;
        }
        .amount-box {
            font-size: 18px;
            font-weight: bold;
            text-align: center;
            margin: 10px 0;
        }
        .amount-words {
            font-style: italic;
            text-align: center;
            margin-bottom: 15px;
        }
        .signature-section {
            margin-top: 50px;
            display: flex;
            justify-content: space-between;
        }
        .signature-line {
            border-top: 1px solid #333;
            width: 200px;
            margin-top: 50px;
            text-align: center;
        }
        .receipt-footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 1px solid #ddd;
            font-size: 12px;
            text-align: center;
            color: #777;
        }
        .print-button {
            text-align: center;
            margin-top: 20px;
        }
        @media print {
            .print-button, .back-button {
                display: none;
            }
            body {
                background-color: white;
                padding: 0;
            }
            .receipt-container {
                box-shadow: none;
                padding: 0;
            }
        }
    </style>
</head>
<body>
    <div class="receipt-container">
        <div class="receipt-header">
            <div class="company-info">
                <h2>Property Management System</h2>
                <p>123 Main Street<br>Anytown, CA 12345<br>Phone: (123) 456-7890</p>
            </div>
            <div class="receipt-info">
                <h3>RECEIPT</h3>
                <p><strong>Receipt #:</strong> <?php echo $receipt_number; ?><br>
                <strong>Date:</strong> <?php echo $payment_date; ?></p>
            </div>
        </div>
        
        <div class="receipt-title">
            PAYMENT RECEIPT
        </div>
        
        <div class="receipt-details">
            <table>
                <tr>
                    <td><strong>Received From:</strong></td>
                    <td><?php echo $tenant['first_name'] . ' ' . $tenant['last_name']; ?></td>
                    <td><strong>Property:</strong></td>
                    <td><?php echo $property['name']; ?></td>
                </tr>
                <tr>
                    <td><strong>Unit:</strong></td>
                    <td><?php echo $unit['unit_number']; ?></td>
                    <td><strong>Payment Method:</strong></td>
                    <td><?php echo ucfirst($payment['payment_method']); ?></td>
                </tr>
                <tr>
                    <td><strong>Payment Type:</strong></td>
                    <td><?php echo ucfirst($payment['payment_type']); ?></td>
                    <td><strong>Reference #:</strong></td>
                    <td><?php echo $payment['reference_number']; ?></td>
                </tr>
            </table>
        </div>
        
        <div class="amount-section">
            <div class="amount-box">
                AMOUNT PAID: $<?php echo $amount_formatted; ?>
            </div>
            <div class="amount-words">
                <?php echo $amount_in_words; ?>
            </div>
        </div>
        
        <?php if (!empty($payment['notes'])): ?>
        <div class="notes-section">
            <h5>Notes:</h5>
            <p><?php echo $payment['notes']; ?></p>
        </div>
        <?php endif; ?>
        
        <div class="signature-section">
            <div>
                <div class="signature-line">
                    Tenant Signature
                </div>
            </div>
            <div>
                <div class="signature-line">
                    Management Signature
                </div>
            </div>
        </div>
        
        <div class="receipt-footer">
            <p>This receipt is evidence of payment received. Please retain for your records.</p>
            <p>Thank you for your prompt payment.</p>
        </div>
    </div>
    
    <?php if (!$print): ?>
    <div class="print-button">
        <a href="payment_receipt.php?id=<?php echo $payment_id; ?>&print=true" class="btn btn-primary" onclick="window.print(); return false;">
            <i class="fas fa-print"></i> Print Receipt
        </a>
        <a href="view_payment.php?id=<?php echo $payment_id; ?>" class="btn btn-secondary">
            <i class="fas fa-arrow-left"></i> Back to Payment Details
        </a>
    </div>
    <?php endif; ?>

    <script>
        <?php if ($print): ?>
        window.onload = function() {
            window.print();
        }
        <?php endif; ?>
    </script>
</body>
</html>
