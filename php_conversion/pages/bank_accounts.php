
<?php
require_once '../includes/header.php';
require_once '../models/BankAccount.php';

// Initialize the bank account model
$bankAccountModel = new BankAccount($mysqli);

// Handle deletion if requested
if (isset($_GET['delete']) && is_numeric($_GET['delete'])) {
    $account_id = intval($_GET['delete']);
    $success = $bankAccountModel->deleteBankAccount($account_id);
    if ($success) {
        $message = "Bank account deleted successfully.";
    } else {
        $error = "Unable to delete bank account. It may have associated transactions.";
    }
}

// Get all bank accounts
$accounts = $bankAccountModel->getAllBankAccounts();
?>

<div class="container-fluid">
    <h1 class="h3 mb-4 text-gray-800">Bank Accounts</h1>
    
    <?php if (isset($message)): ?>
        <div class="alert alert-success" role="alert">
            <?php echo $message; ?>
        </div>
    <?php endif; ?>
    
    <?php if (isset($error)): ?>
        <div class="alert alert-danger" role="alert">
            <?php echo $error; ?>
        </div>
    <?php endif; ?>
    
    <div class="card shadow mb-4">
        <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
            <h6 class="m-0 font-weight-bold text-primary">All Bank Accounts</h6>
            <a href="add_bank_account.php" class="btn btn-primary btn-sm">
                <i class="fas fa-plus"></i> Add Bank Account
            </a>
        </div>
        <div class="card-body">
            <div class="table-responsive">
                <table class="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Account Name</th>
                            <th>Bank Name</th>
                            <th>Account Type</th>
                            <th>Account Number</th>
                            <th>Balance</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (empty($accounts)): ?>
                            <tr>
                                <td colspan="7" class="text-center">No bank accounts found</td>
                            </tr>
                        <?php else: ?>
                            <?php foreach ($accounts as $account): ?>
                                <tr>
                                    <td><?php echo $account['id']; ?></td>
                                    <td><?php echo htmlspecialchars($account['account_name']); ?></td>
                                    <td><?php echo htmlspecialchars($account['bank_name']); ?></td>
                                    <td><?php echo htmlspecialchars($account['account_type']); ?></td>
                                    <td><?php echo htmlspecialchars(substr($account['account_number'], -4, 4)); ?></td>
                                    <td>$<?php echo number_format($account['current_balance'], 2); ?></td>
                                    <td>
                                        <a href="view_bank_account.php?id=<?php echo $account['id']; ?>" class="btn btn-info btn-sm">
                                            <i class="fas fa-eye"></i>
                                        </a>
                                        <a href="edit_bank_account.php?id=<?php echo $account['id']; ?>" class="btn btn-primary btn-sm">
                                            <i class="fas fa-edit"></i>
                                        </a>
                                        <a href="bank_accounts.php?delete=<?php echo $account['id']; ?>" 
                                           class="btn btn-danger btn-sm" 
                                           onclick="return confirm('Are you sure you want to delete this bank account?');">
                                            <i class="fas fa-trash"></i>
                                        </a>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<?php require_once '../includes/footer.php'; ?>
