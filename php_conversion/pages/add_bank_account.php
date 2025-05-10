
<?php
require_once '../includes/header.php';
require_once '../models/BankAccount.php';

// Initialize the bank account model
$bankAccountModel = new BankAccount($mysqli);

$success = '';
$error = '';

// Process form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get form data
    $account_name = isset($_POST['account_name']) ? trim($_POST['account_name']) : '';
    $bank_name = isset($_POST['bank_name']) ? trim($_POST['bank_name']) : '';
    $account_type = isset($_POST['account_type']) ? trim($_POST['account_type']) : '';
    $account_number = isset($_POST['account_number']) ? trim($_POST['account_number']) : '';
    $routing_number = isset($_POST['routing_number']) ? trim($_POST['routing_number']) : '';
    $current_balance = isset($_POST['current_balance']) ? floatval($_POST['current_balance']) : 0;
    $notes = isset($_POST['notes']) ? trim($_POST['notes']) : '';
    
    // Validate input
    if (empty($account_name) || empty($bank_name) || empty($account_type) || empty($account_number)) {
        $error = 'Please fill in all required fields';
    } else {
        // Create new bank account
        $result = $bankAccountModel->createBankAccount(
            $account_name,
            $bank_name,
            $account_type,
            $account_number,
            $routing_number,
            $current_balance,
            $notes
        );
        
        if ($result) {
            $success = 'Bank account created successfully';
            // Reset form fields after successful submission
            $account_name = $bank_name = $account_type = $account_number = $routing_number = $notes = '';
            $current_balance = 0;
        } else {
            $error = 'Failed to create bank account';
        }
    }
}
?>

<div class="container-fluid">
    <h1 class="h3 mb-4 text-gray-800">Add Bank Account</h1>
    
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
            <h6 class="m-0 font-weight-bold text-primary">Bank Account Details</h6>
        </div>
        <div class="card-body">
            <form method="POST" action="">
                <div class="form-group row">
                    <div class="col-md-6">
                        <label for="account_name">Account Name <span class="text-danger">*</span></label>
                        <input type="text" class="form-control" id="account_name" name="account_name" value="<?php echo isset($account_name) ? htmlspecialchars($account_name) : ''; ?>" required>
                    </div>
                    <div class="col-md-6">
                        <label for="bank_name">Bank Name <span class="text-danger">*</span></label>
                        <input type="text" class="form-control" id="bank_name" name="bank_name" value="<?php echo isset($bank_name) ? htmlspecialchars($bank_name) : ''; ?>" required>
                    </div>
                </div>
                
                <div class="form-group row">
                    <div class="col-md-6">
                        <label for="account_type">Account Type <span class="text-danger">*</span></label>
                        <select class="form-control" id="account_type" name="account_type" required>
                            <option value="">Select Account Type</option>
                            <option value="Checking" <?php echo (isset($account_type) && $account_type === 'Checking') ? 'selected' : ''; ?>>Checking</option>
                            <option value="Savings" <?php echo (isset($account_type) && $account_type === 'Savings') ? 'selected' : ''; ?>>Savings</option>
                            <option value="Business" <?php echo (isset($account_type) && $account_type === 'Business') ? 'selected' : ''; ?>>Business</option>
                            <option value="Investment" <?php echo (isset($account_type) && $account_type === 'Investment') ? 'selected' : ''; ?>>Investment</option>
                            <option value="Other" <?php echo (isset($account_type) && $account_type === 'Other') ? 'selected' : ''; ?>>Other</option>
                        </select>
                    </div>
                    <div class="col-md-6">
                        <label for="current_balance">Current Balance</label>
                        <div class="input-group">
                            <div class="input-group-prepend">
                                <span class="input-group-text">$</span>
                            </div>
                            <input type="number" step="0.01" class="form-control" id="current_balance" name="current_balance" value="<?php echo isset($current_balance) ? $current_balance : '0.00'; ?>">
                        </div>
                    </div>
                </div>
                
                <div class="form-group row">
                    <div class="col-md-6">
                        <label for="account_number">Account Number <span class="text-danger">*</span></label>
                        <input type="text" class="form-control" id="account_number" name="account_number" value="<?php echo isset($account_number) ? htmlspecialchars($account_number) : ''; ?>" required>
                    </div>
                    <div class="col-md-6">
                        <label for="routing_number">Routing Number</label>
                        <input type="text" class="form-control" id="routing_number" name="routing_number" value="<?php echo isset($routing_number) ? htmlspecialchars($routing_number) : ''; ?>">
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="notes">Notes</label>
                    <textarea class="form-control" id="notes" name="notes" rows="3"><?php echo isset($notes) ? htmlspecialchars($notes) : ''; ?></textarea>
                </div>
                
                <div class="form-group row">
                    <div class="col-sm-6">
                        <button type="submit" class="btn btn-primary btn-block">
                            <i class="fas fa-plus-circle"></i> Add Bank Account
                        </button>
                    </div>
                    <div class="col-sm-6">
                        <a href="bank_accounts.php" class="btn btn-secondary btn-block">
                            <i class="fas fa-arrow-left"></i> Back to Bank Accounts
                        </a>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>

<?php require_once '../includes/footer.php'; ?>
