
<?php
require_once '../config/database.php';
require_once '../models/Utility.php';
require_once '../includes/functions.php';

// Initialize the database connection
$database = new Database();
$db = $database->getConnection();

// Initialize models
$utility = new Utility($db);

// Get all utility accounts for the dropdown
$utilityAccounts = $utility->getAllUtilityAccounts();

$errorMsg = '';
$successMsg = '';

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Validate and sanitize input
    $utility_account_id = isset($_POST['utility_account_id']) ? intval($_POST['utility_account_id']) : 0;
    $amount = isset($_POST['amount']) ? floatval($_POST['amount']) : 0;
    $issue_date = isset($_POST['issue_date']) ? $_POST['issue_date'] : '';
    $due_date = isset($_POST['due_date']) ? $_POST['due_date'] : '';
    $status = isset($_POST['status']) ? $_POST['status'] : 'pending';
    
    // Basic validation
    if ($utility_account_id === 0) {
        $errorMsg = 'Please select a utility account.';
    } elseif ($amount <= 0) {
        $errorMsg = 'Please enter a valid amount greater than zero.';
    } elseif (empty($issue_date)) {
        $errorMsg = 'Please select an issue date.';
    } elseif (empty($due_date)) {
        $errorMsg = 'Please select a due date.';
    } else {
        // Create new utility bill
        $result = $utility->addUtilityBill($utility_account_id, $amount, $issue_date, $due_date, $status);
        
        if ($result) {
            $successMsg = 'Utility bill added successfully!';
            // Reset form
            $utility_account_id = 0;
            $amount = 0;
            $issue_date = '';
            $due_date = '';
            $status = 'pending';
        } else {
            $errorMsg = 'Error adding utility bill. Please try again.';
        }
    }
}

// Set page title
$pageTitle = "Add Utility Bill";
include_once '../includes/header.php';
?>

<div class="container-fluid">
    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 class="h2"><?php echo $pageTitle; ?></h1>
        <div class="btn-toolbar mb-2 mb-md-0">
            <a href="utilities.php" class="btn btn-sm btn-outline-secondary">
                <i class="fas fa-arrow-left"></i> Back to Utilities
            </a>
        </div>
    </div>

    <?php if (!empty($errorMsg)): ?>
        <div class="alert alert-danger"><?php echo $errorMsg; ?></div>
    <?php endif; ?>
    
    <?php if (!empty($successMsg)): ?>
        <div class="alert alert-success"><?php echo $successMsg; ?></div>
    <?php endif; ?>

    <div class="row">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">
                    <h5 class="card-title mb-0">Add New Utility Bill</h5>
                </div>
                <div class="card-body">
                    <form action="<?php echo htmlspecialchars($_SERVER['PHP_SELF']); ?>" method="post">
                        <div class="mb-3">
                            <label for="utility_account_id" class="form-label">Utility Account <span class="text-danger">*</span></label>
                            <select class="form-select" id="utility_account_id" name="utility_account_id" required>
                                <option value="">Select Utility Account</option>
                                <?php while ($account = $utilityAccounts->fetch_assoc()): ?>
                                    <option value="<?php echo $account['id']; ?>" <?php echo (isset($utility_account_id) && $utility_account_id == $account['id']) ? 'selected' : ''; ?>>
                                        <?php echo htmlspecialchars($account['property_name']); ?> - 
                                        <?php echo htmlspecialchars($account['provider_name']); ?> 
                                        (<?php echo htmlspecialchars($account['utility_type']); ?>)
                                    </option>
                                <?php endwhile; ?>
                            </select>
                        </div>
                        
                        <div class="mb-3">
                            <label for="amount" class="form-label">Amount <span class="text-danger">*</span></label>
                            <div class="input-group">
                                <span class="input-group-text">$</span>
                                <input type="number" class="form-control" id="amount" name="amount" value="<?php echo isset($amount) ? $amount : ''; ?>" min="0.01" step="0.01" required>
                            </div>
                        </div>
                        
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label for="issue_date" class="form-label">Issue Date <span class="text-danger">*</span></label>
                                <input type="date" class="form-control" id="issue_date" name="issue_date" value="<?php echo isset($issue_date) ? $issue_date : date('Y-m-d'); ?>" required>
                            </div>
                            <div class="col-md-6">
                                <label for="due_date" class="form-label">Due Date <span class="text-danger">*</span></label>
                                <input type="date" class="form-control" id="due_date" name="due_date" value="<?php echo isset($due_date) ? $due_date : date('Y-m-d', strtotime('+30 days')); ?>" required>
                            </div>
                        </div>
                        
                        <div class="mb-3">
                            <label for="status" class="form-label">Bill Status</label>
                            <select class="form-select" id="status" name="status">
                                <option value="pending" <?php echo (isset($status) && $status == 'pending') ? 'selected' : ''; ?>>Pending</option>
                                <option value="paid" <?php echo (isset($status) && $status == 'paid') ? 'selected' : ''; ?>>Paid</option>
                                <option value="overdue" <?php echo (isset($status) && $status == 'overdue') ? 'selected' : ''; ?>>Overdue</option>
                                <option value="disputed" <?php echo (isset($status) && $status == 'disputed') ? 'selected' : ''; ?>>Disputed</option>
                            </select>
                        </div>
                        
                        <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                            <button type="submit" class="btn btn-primary">Add Utility Bill</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        
        <div class="col-md-4">
            <div class="card">
                <div class="card-header">
                    <h5 class="card-title mb-0">Bill Management Tips</h5>
                </div>
                <div class="card-body">
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">Track all bills when they arrive</li>
                        <li class="list-group-item">Set reminders for upcoming due dates</li>
                        <li class="list-group-item">Keep digital copies of all bills</li>
                        <li class="list-group-item">Monitor for unusual increases in costs</li>
                        <li class="list-group-item">Apply for budget billing when available</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</div>

<?php include_once '../includes/footer.php'; ?>
