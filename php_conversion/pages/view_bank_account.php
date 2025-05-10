
<?php
require_once '../includes/header.php';
require_once '../models/BankAccount.php';
require_once '../models/Transaction.php';

// Initialize models
$bankAccountModel = new BankAccount($mysqli);
$transactionModel = new Transaction($mysqli);

// Get account ID from URL
$account_id = isset($_GET['id']) ? intval($_GET['id']) : 0;

// Check if account exists
$account = $bankAccountModel->getBankAccountById($account_id);
if (!$account) {
    // Redirect to bank accounts list if account not found
    header('Location: bank_accounts.php?error=Account not found');
    exit;
}

// Get recent transactions for this account
$transactions = $transactionModel->getTransactionsByAccountId($account_id, 10);
?>

<div class="container-fluid">
    <h1 class="h3 mb-4 text-gray-800">Bank Account Details</h1>
    
    <div class="row">
        <div class="col-lg-8">
            <div class="card shadow mb-4">
                <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                    <h6 class="m-0 font-weight-bold text-primary">Account Information</h6>
                    <div>
                        <a href="edit_bank_account.php?id=<?php echo $account_id; ?>" class="btn btn-primary btn-sm">
                            <i class="fas fa-edit"></i> Edit
                        </a>
                        <a href="bank_accounts.php" class="btn btn-secondary btn-sm">
                            <i class="fas fa-arrow-left"></i> Back
                        </a>
                    </div>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <p><strong>Account Name:</strong> <?php echo htmlspecialchars($account['account_name']); ?></p>
                            <p><strong>Bank Name:</strong> <?php echo htmlspecialchars($account['bank_name']); ?></p>
                            <p><strong>Account Type:</strong> <?php echo htmlspecialchars($account['account_type']); ?></p>
                        </div>
                        <div class="col-md-6">
                            <p><strong>Account Number:</strong> ****<?php echo htmlspecialchars(substr($account['account_number'], -4, 4)); ?></p>
                            <p><strong>Routing Number:</strong> <?php echo !empty($account['routing_number']) ? htmlspecialchars($account['routing_number']) : 'N/A'; ?></p>
                            <p><strong>Current Balance:</strong> $<?php echo number_format($account['current_balance'], 2); ?></p>
                        </div>
                    </div>
                    <?php if (!empty($account['notes'])): ?>
                        <div class="row mt-3">
                            <div class="col-md-12">
                                <h6 class="font-weight-bold">Notes:</h6>
                                <p><?php echo nl2br(htmlspecialchars($account['notes'])); ?></p>
                            </div>
                        </div>
                    <?php endif; ?>
                </div>
            </div>
        </div>
        
        <div class="col-lg-4">
            <div class="card shadow mb-4">
                <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">Account Summary</h6>
                </div>
                <div class="card-body">
                    <div class="text-center mb-4">
                        <h4>$<?php echo number_format($account['current_balance'], 2); ?></h4>
                        <p class="text-muted">Current Balance</p>
                    </div>
                    
                    <div class="text-center">
                        <a href="transaction_history.php?account_id=<?php echo $account_id; ?>" class="btn btn-primary btn-sm mb-2 w-100">
                            <i class="fas fa-history"></i> View All Transactions
                        </a>
                        <a href="#" class="btn btn-success btn-sm mb-2 w-100">
                            <i class="fas fa-plus-circle"></i> Add Transaction
                        </a>
                        <a href="#" class="btn btn-info btn-sm w-100">
                            <i class="fas fa-file-export"></i> Export Transactions
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <div class="card shadow mb-4">
        <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
            <h6 class="m-0 font-weight-bold text-primary">Recent Transactions</h6>
            <a href="transaction_history.php?account_id=<?php echo $account_id; ?>" class="btn btn-primary btn-sm">
                <i class="fas fa-list"></i> View All
            </a>
        </div>
        <div class="card-body">
            <div class="table-responsive">
                <table class="table table-bordered" width="100%" cellspacing="0">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Description</th>
                            <th>Category</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (empty($transactions)): ?>
                            <tr>
                                <td colspan="4" class="text-center">No transactions found</td>
                            </tr>
                        <?php else: ?>
                            <?php foreach ($transactions as $transaction): ?>
                                <tr>
                                    <td><?php echo date('M d, Y', strtotime($transaction['transaction_date'])); ?></td>
                                    <td><?php echo htmlspecialchars($transaction['description']); ?></td>
                                    <td><?php echo htmlspecialchars($transaction['category_name']); ?></td>
                                    <td class="<?php echo $transaction['amount'] < 0 ? 'text-danger' : 'text-success'; ?>">
                                        <?php echo '$' . number_format(abs($transaction['amount']), 2); ?>
                                        <?php echo $transaction['amount'] < 0 ? '(Debit)' : '(Credit)'; ?>
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
