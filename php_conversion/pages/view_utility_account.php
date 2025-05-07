
<?php
require_once '../config/database.php';
require_once '../models/Utility.php';
require_once '../models/Property.php';
require_once '../models/Unit.php';
require_once '../includes/functions.php';

// Initialize the database connection
$database = new Database();
$db = $database->getConnection();

// Initialize models
$utility = new Utility($db);
$property = new Property($db);
$unit = new Unit($db);

// Check if ID is set
if (!isset($_GET['id']) || empty($_GET['id'])) {
    header('Location: utilities.php');
    exit;
}

$id = intval($_GET['id']);
$utilityAccount = $utility->getUtilityById($id);

if (!$utilityAccount) {
    header('Location: utilities.php');
    exit;
}

// Get property details
$propertyData = $property->getPropertyById($utilityAccount['property_id']);

// Get unit details if applicable
$unitData = null;
if (!empty($utilityAccount['unit_id'])) {
    $unitData = $unit->getUnitById($utilityAccount['unit_id']);
}

// Get bills for this account
$bills = $utility->getBillsByAccountId($id);

// Calculate stats
$totalBills = 0;
$totalPaid = 0;
$totalPending = 0;
$totalAmount = 0;
$paidAmount = 0;

while ($bill = $bills->fetch_assoc()) {
    $totalBills++;
    $totalAmount += $bill['amount'];
    
    if ($bill['status'] === 'paid') {
        $totalPaid++;
        $paidAmount += $bill['amount'];
    } elseif ($bill['status'] === 'pending') {
        $totalPending++;
    }
}

// Reset pointer to beginning for later use
$bills->data_seek(0);

// Set page title
$pageTitle = $utilityAccount['provider_name'] . " - " . $utilityAccount['utility_type'];
include_once '../includes/header.php';
?>

<div class="container-fluid">
    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 class="h2"><?php echo $pageTitle; ?></h1>
        <div class="btn-toolbar mb-2 mb-md-0">
            <a href="utilities.php" class="btn btn-sm btn-outline-secondary me-2">
                <i class="fas fa-arrow-left"></i> Back to Utilities
            </a>
            <a href="edit_utility_account.php?id=<?php echo $id; ?>" class="btn btn-sm btn-primary me-2">
                <i class="fas fa-edit"></i> Edit
            </a>
            <a href="add_utility_bill.php?account_id=<?php echo $id; ?>" class="btn btn-sm btn-success">
                <i class="fas fa-plus"></i> Add Bill
            </a>
        </div>
    </div>

    <div class="row">
        <!-- Account Details -->
        <div class="col-md-8">
            <div class="card mb-4">
                <div class="card-header">
                    <h5 class="card-title mb-0">Utility Account Details</h5>
                </div>
                <div class="card-body">
                    <div class="row mb-3">
                        <div class="col-md-4 fw-bold">Provider:</div>
                        <div class="col-md-8"><?php echo htmlspecialchars($utilityAccount['provider_name']); ?></div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-md-4 fw-bold">Utility Type:</div>
                        <div class="col-md-8"><?php echo htmlspecialchars($utilityAccount['utility_type']); ?></div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-md-4 fw-bold">Account Number:</div>
                        <div class="col-md-8"><?php echo htmlspecialchars($utilityAccount['account_number']); ?></div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-md-4 fw-bold">Property:</div>
                        <div class="col-md-8">
                            <a href="view_property.php?id=<?php echo $propertyData['id']; ?>">
                                <?php echo htmlspecialchars($propertyData['name']); ?>
                            </a>
                            <div class="text-muted">
                                <?php echo htmlspecialchars($propertyData['address']); ?>,
                                <?php echo htmlspecialchars($propertyData['city']); ?>,
                                <?php echo htmlspecialchars($propertyData['state']); ?>
                                <?php echo htmlspecialchars($propertyData['zip']); ?>
                            </div>
                        </div>
                    </div>
                    
                    <?php if ($unitData): ?>
                    <div class="row mb-3">
                        <div class="col-md-4 fw-bold">Unit:</div>
                        <div class="col-md-8">
                            Unit <?php echo htmlspecialchars($unitData['unit_number']); ?>
                            <?php if (!empty($unitData['description'])): ?>
                                - <?php echo htmlspecialchars($unitData['description']); ?>
                            <?php endif; ?>
                        </div>
                    </div>
                    <?php endif; ?>
                    
                    <div class="row mb-3">
                        <div class="col-md-4 fw-bold">Billing Day:</div>
                        <div class="col-md-8"><?php echo htmlspecialchars($utilityAccount['billing_day']); ?> of each month</div>
                    </div>
                    
                    <div class="row mb-3">
                        <div class="col-md-4 fw-bold">Auto-Pay:</div>
                        <div class="col-md-8">
                            <?php if ($utilityAccount['auto_pay']): ?>
                                <span class="badge bg-success">Enabled</span>
                            <?php else: ?>
                                <span class="badge bg-secondary">Disabled</span>
                            <?php endif; ?>
                        </div>
                    </div>
                    
                    <div class="row mb-3">
                        <div class="col-md-4 fw-bold">Average Monthly Cost:</div>
                        <div class="col-md-8">$<?php echo number_format($utilityAccount['avg_cost'], 2); ?></div>
                    </div>
                </div>
            </div>
            
            <!-- Bills History -->
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h5 class="card-title mb-0">Billing History</h5>
                    <a href="add_utility_bill.php?account_id=<?php echo $id; ?>" class="btn btn-sm btn-success">
                        <i class="fas fa-plus"></i> Add Bill
                    </a>
                </div>
                <div class="card-body">
                    <?php if ($bills->num_rows > 0): ?>
                        <div class="table-responsive">
                            <table class="table table-striped table-hover">
                                <thead>
                                    <tr>
                                        <th>Issue Date</th>
                                        <th>Due Date</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php while ($bill = $bills->fetch_assoc()): ?>
                                        <tr>
                                            <td><?php echo formatDate($bill['issue_date']); ?></td>
                                            <td><?php echo formatDate($bill['due_date']); ?></td>
                                            <td>$<?php echo number_format($bill['amount'], 2); ?></td>
                                            <td>
                                                <?php if ($bill['status'] == 'paid'): ?>
                                                    <span class="badge bg-success">Paid</span>
                                                <?php elseif ($bill['status'] == 'pending'): ?>
                                                    <span class="badge bg-warning">Pending</span>
                                                <?php elseif ($bill['status'] == 'overdue'): ?>
                                                    <span class="badge bg-danger">Overdue</span>
                                                <?php else: ?>
                                                    <span class="badge bg-secondary"><?php echo ucfirst($bill['status']); ?></span>
                                                <?php endif; ?>
                                            </td>
                                            <td>
                                                <a href="view_utility_bill.php?id=<?php echo $bill['id']; ?>" class="btn btn-sm btn-info">
                                                    <i class="fas fa-eye"></i>
                                                </a>
                                                <a href="edit_utility_bill.php?id=<?php echo $bill['id']; ?>" class="btn btn-sm btn-primary">
                                                    <i class="fas fa-edit"></i>
                                                </a>
                                                <?php if ($bill['status'] == 'pending'): ?>
                                                    <a href="mark_bill_paid.php?id=<?php echo $bill['id']; ?>" class="btn btn-sm btn-success">
                                                        <i class="fas fa-check"></i>
                                                    </a>
                                                <?php endif; ?>
                                            </td>
                                        </tr>
                                    <?php endwhile; ?>
                                </tbody>
                            </table>
                        </div>
                    <?php else: ?>
                        <div class="alert alert-info">No billing history found for this account.</div>
                    <?php endif; ?>
                </div>
            </div>
        </div>
        
        <!-- Account Stats and Actions -->
        <div class="col-md-4">
            <!-- Account Stats -->
            <div class="card mb-4">
                <div class="card-header">
                    <h5 class="card-title mb-0">Account Statistics</h5>
                </div>
                <div class="card-body">
                    <div class="row g-3">
                        <div class="col-md-6">
                            <div class="p-3 border rounded text-center">
                                <div class="fs-1 fw-bold text-primary"><?php echo $totalBills; ?></div>
                                <div>Total Bills</div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="p-3 border rounded text-center">
                                <div class="fs-1 fw-bold text-success"><?php echo $totalPaid; ?></div>
                                <div>Paid Bills</div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="p-3 border rounded text-center">
                                <div class="fs-1 fw-bold text-warning"><?php echo $totalPending; ?></div>
                                <div>Pending Bills</div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="p-3 border rounded text-center">
                                <div class="fs-1 fw-bold text-danger"><?php echo $totalBills - $totalPaid - $totalPending; ?></div>
                                <div>Overdue Bills</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="mt-4">
                        <h6>Financial Summary</h6>
                        <div class="row mb-2">
                            <div class="col-8">Total Billed Amount:</div>
                            <div class="col-4 text-end fw-bold">$<?php echo number_format($totalAmount, 2); ?></div>
                        </div>
                        <div class="row mb-2">
                            <div class="col-8">Total Paid Amount:</div>
                            <div class="col-4 text-end fw-bold text-success">$<?php echo number_format($paidAmount, 2); ?></div>
                        </div>
                        <div class="row">
                            <div class="col-8">Outstanding Balance:</div>
                            <div class="col-4 text-end fw-bold text-danger">$<?php echo number_format($totalAmount - $paidAmount, 2); ?></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Actions -->
            <div class="card mb-4">
                <div class="card-header">
                    <h5 class="card-title mb-0">Actions</h5>
                </div>
                <div class="card-body">
                    <div class="d-grid gap-2">
                        <a href="add_utility_bill.php?account_id=<?php echo $id; ?>" class="btn btn-success">
                            <i class="fas fa-plus"></i> Add New Bill
                        </a>
                        <a href="edit_utility_account.php?id=<?php echo $id; ?>" class="btn btn-primary">
                            <i class="fas fa-edit"></i> Edit Account
                        </a>
                        <?php if (!$utilityAccount['auto_pay']): ?>
                            <a href="enable_autopay.php?id=<?php echo $id; ?>" class="btn btn-warning">
                                <i class="fas fa-money-check-alt"></i> Enable Auto-Pay
                            </a>
                        <?php else: ?>
                            <a href="disable_autopay.php?id=<?php echo $id; ?>" class="btn btn-outline-warning">
                                <i class="fas fa-money-check-alt"></i> Disable Auto-Pay
                            </a>
                        <?php endif; ?>
                        <button type="button" class="btn btn-danger" 
                                onclick="confirmDelete('delete_utility_account.php?id=<?php echo $id; ?>')">
                            <i class="fas fa-trash"></i> Delete Account
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- Upcoming Bill Prediction -->
            <?php 
            // Calculate next billing date based on billing day
            $today = new DateTime();
            $billingDay = $utilityAccount['billing_day'];
            $currentDay = (int)$today->format('j');
            $currentMonth = (int)$today->format('n');
            $currentYear = (int)$today->format('Y');
            
            // If current day is past billing day, move to next month
            if ($currentDay > $billingDay) {
                $currentMonth++;
                // If we're past December, move to next year
                if ($currentMonth > 12) {
                    $currentMonth = 1;
                    $currentYear++;
                }
            }
            
            // Create next billing date
            $nextBillingDate = DateTime::createFromFormat('Y-n-j', "$currentYear-$currentMonth-$billingDay");
            // If invalid day for month (e.g., Feb 30), use last day of month
            if (!$nextBillingDate) {
                $lastDay = cal_days_in_month(CAL_GREGORIAN, $currentMonth, $currentYear);
                $nextBillingDate = DateTime::createFromFormat('Y-n-j', "$currentYear-$currentMonth-$lastDay");
            }
            $daysUntilNextBill = $today->diff($nextBillingDate)->days;
            ?>
            
            <div class="card">
                <div class="card-header">
                    <h5 class="card-title mb-0">Next Bill Prediction</h5>
                </div>
                <div class="card-body">
                    <div class="text-center mb-3">
                        <span class="display-6">$<?php echo number_format($utilityAccount['avg_cost'], 2); ?></span>
                        <div class="text-muted">Estimated Amount</div>
                    </div>
                    
                    <div class="text-center mb-3">
                        <span class="fs-5"><?php echo $nextBillingDate->format('F j, Y'); ?></span>
                        <div class="text-muted">Expected Issue Date</div>
                    </div>
                    
                    <div class="alert <?php echo ($daysUntilNextBill <= 7) ? 'alert-warning' : 'alert-info'; ?> text-center">
                        <?php if ($daysUntilNextBill === 0): ?>
                            <i class="fas fa-calendar-day"></i> Bill expected today!
                        <?php elseif ($daysUntilNextBill === 1): ?>
                            <i class="fas fa-calendar-day"></i> Bill expected tomorrow!
                        <?php else: ?>
                            <i class="fas fa-calendar-alt"></i> <?php echo $daysUntilNextBill; ?> days until next bill
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
function confirmDelete(url) {
    if (confirm('Are you sure you want to delete this utility account? This will also delete all associated bills. This action cannot be undone.')) {
        window.location.href = url;
    }
}
</script>

<?php include_once '../includes/footer.php'; ?>
