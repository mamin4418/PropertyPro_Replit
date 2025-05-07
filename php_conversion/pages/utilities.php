
<?php
require_once '../config/database.php';
require_once '../models/Utility.php';
require_once '../includes/functions.php';

// Initialize the database connection
$database = new Database();
$db = $database->getConnection();

// Initialize the utility model
$utility = new Utility($db);

// Get all utility accounts
$utilityAccounts = $utility->getAllUtilityAccounts();

// Get all utility bills
$utilityBills = $utility->getAllUtilityBills();

// Set page title
$pageTitle = "Utilities Management";
include_once '../includes/header.php';
?>

<div class="container-fluid">
    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 class="h2"><?php echo $pageTitle; ?></h1>
        <div class="btn-toolbar mb-2 mb-md-0">
            <a href="add_utility_account.php" class="btn btn-sm btn-primary me-2">
                <i class="fas fa-plus"></i> Add Utility Account
            </a>
            <a href="add_utility_bill.php" class="btn btn-sm btn-secondary">
                <i class="fas fa-plus"></i> Add Utility Bill
            </a>
        </div>
    </div>

    <div class="row mb-4">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">
                    <ul class="nav nav-tabs card-header-tabs" id="utilityTabs" role="tablist">
                        <li class="nav-item" role="presentation">
                            <a class="nav-link active" id="accounts-tab" data-bs-toggle="tab" href="#accounts" role="tab" aria-controls="accounts" aria-selected="true">
                                Utility Accounts
                            </a>
                        </li>
                        <li class="nav-item" role="presentation">
                            <a class="nav-link" id="bills-tab" data-bs-toggle="tab" href="#bills" role="tab" aria-controls="bills" aria-selected="false">
                                Utility Bills
                            </a>
                        </li>
                    </ul>
                </div>
                <div class="card-body">
                    <div class="tab-content" id="utilityTabsContent">
                        <!-- Utility Accounts Tab -->
                        <div class="tab-pane fade show active" id="accounts" role="tabpanel" aria-labelledby="accounts-tab">
                            <?php if ($utilityAccounts->num_rows > 0): ?>
                                <div class="table-responsive">
                                    <table class="table table-striped table-sm">
                                        <thead>
                                            <tr>
                                                <th>Property</th>
                                                <th>Provider</th>
                                                <th>Type</th>
                                                <th>Account Number</th>
                                                <th>Billing Day</th>
                                                <th>Auto-Pay</th>
                                                <th>Avg. Cost</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <?php while ($account = $utilityAccounts->fetch_assoc()): ?>
                                                <tr>
                                                    <td><?php echo htmlspecialchars($account['property_name']); ?></td>
                                                    <td><?php echo htmlspecialchars($account['provider_name']); ?></td>
                                                    <td><?php echo htmlspecialchars($account['utility_type']); ?></td>
                                                    <td><?php echo htmlspecialchars($account['account_number']); ?></td>
                                                    <td><?php echo htmlspecialchars($account['billing_day']); ?></td>
                                                    <td>
                                                        <?php if ($account['auto_pay']): ?>
                                                            <span class="badge bg-success">Yes</span>
                                                        <?php else: ?>
                                                            <span class="badge bg-secondary">No</span>
                                                        <?php endif; ?>
                                                    </td>
                                                    <td>$<?php echo number_format($account['avg_cost'], 2); ?></td>
                                                    <td>
                                                        <a href="view_utility_account.php?id=<?php echo $account['id']; ?>" class="btn btn-sm btn-info">
                                                            <i class="fas fa-eye"></i>
                                                        </a>
                                                        <a href="edit_utility_account.php?id=<?php echo $account['id']; ?>" class="btn btn-sm btn-primary">
                                                            <i class="fas fa-edit"></i>
                                                        </a>
                                                        <button type="button" class="btn btn-sm btn-danger" 
                                                                onclick="confirmDelete('delete_utility_account.php?id=<?php echo $account['id']; ?>', 'utility account')">
                                                            <i class="fas fa-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            <?php endwhile; ?>
                                        </tbody>
                                    </table>
                                </div>
                            <?php else: ?>
                                <div class="alert alert-info">No utility accounts found. <a href="add_utility_account.php">Add your first utility account</a>.</div>
                            <?php endif; ?>
                        </div>
                        
                        <!-- Utility Bills Tab -->
                        <div class="tab-pane fade" id="bills" role="tabpanel" aria-labelledby="bills-tab">
                            <?php if ($utilityBills->num_rows > 0): ?>
                                <div class="table-responsive">
                                    <table class="table table-striped table-sm">
                                        <thead>
                                            <tr>
                                                <th>Property</th>
                                                <th>Provider</th>
                                                <th>Utility Type</th>
                                                <th>Issue Date</th>
                                                <th>Due Date</th>
                                                <th>Amount</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <?php while ($bill = $utilityBills->fetch_assoc()): ?>
                                                <tr>
                                                    <td><?php echo htmlspecialchars($bill['property_name']); ?></td>
                                                    <td><?php echo htmlspecialchars($bill['provider_name']); ?></td>
                                                    <td><?php echo htmlspecialchars($bill['utility_type']); ?></td>
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
                                                        <button type="button" class="btn btn-sm btn-danger" 
                                                                onclick="confirmDelete('delete_utility_bill.php?id=<?php echo $bill['id']; ?>', 'utility bill')">
                                                            <i class="fas fa-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            <?php endwhile; ?>
                                        </tbody>
                                    </table>
                                </div>
                            <?php else: ?>
                                <div class="alert alert-info">No utility bills found. <a href="add_utility_bill.php">Add your first utility bill</a>.</div>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Utility Stats -->
    <div class="row">
        <div class="col-md-6 col-lg-3 mb-4">
            <div class="card border-primary">
                <div class="card-body">
                    <h5 class="card-title">Total Accounts</h5>
                    <p class="card-text display-4"><?php echo $utilityAccounts->num_rows; ?></p>
                </div>
            </div>
        </div>
        <div class="col-md-6 col-lg-3 mb-4">
            <div class="card border-info">
                <div class="card-body">
                    <h5 class="card-title">Total Bills</h5>
                    <p class="card-text display-4"><?php echo $utilityBills->num_rows; ?></p>
                </div>
            </div>
        </div>
        <div class="col-md-6 col-lg-3 mb-4">
            <div class="card border-warning">
                <div class="card-body">
                    <h5 class="card-title">Pending Bills</h5>
                    <p class="card-text display-4">
                        <?php 
                        $pendingCount = 0;
                        $utilityBills->data_seek(0);
                        while ($bill = $utilityBills->fetch_assoc()) {
                            if ($bill['status'] == 'pending') {
                                $pendingCount++;
                            }
                        }
                        echo $pendingCount;
                        ?>
                    </p>
                </div>
            </div>
        </div>
        <div class="col-md-6 col-lg-3 mb-4">
            <div class="card border-danger">
                <div class="card-body">
                    <h5 class="card-title">Overdue Bills</h5>
                    <p class="card-text display-4">
                        <?php 
                        $overdueCount = 0;
                        $utilityBills->data_seek(0);
                        while ($bill = $utilityBills->fetch_assoc()) {
                            if ($bill['status'] == 'overdue') {
                                $overdueCount++;
                            }
                        }
                        echo $overdueCount;
                        ?>
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
function confirmDelete(url, itemType) {
    if (confirm(`Are you sure you want to delete this ${itemType}? This action cannot be undone.`)) {
        window.location.href = url;
    }
}
</script>

<?php include_once '../includes/footer.php'; ?>
