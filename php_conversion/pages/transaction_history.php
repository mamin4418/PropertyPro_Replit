
<?php
require_once '../includes/header.php';
require_once '../models/Transaction.php';
require_once '../models/BankAccount.php';
require_once '../models/ExpenseCategory.php';

// Initialize models
$transactionModel = new Transaction($mysqli);
$bankAccountModel = new BankAccount($mysqli);
$categoryModel = new ExpenseCategory($mysqli);

// Get filter parameters
$account_id = isset($_GET['account_id']) ? intval($_GET['account_id']) : 0;
$category_id = isset($_GET['category_id']) ? intval($_GET['category_id']) : 0;
$start_date = isset($_GET['start_date']) ? $_GET['start_date'] : '';
$end_date = isset($_GET['end_date']) ? $_GET['end_date'] : '';
$type = isset($_GET['type']) ? $_GET['type'] : '';

// Set default date range if not provided (last 30 days)
if (empty($start_date)) {
    $start_date = date('Y-m-d', strtotime('-30 days'));
}
if (empty($end_date)) {
    $end_date = date('Y-m-d');
}

// Get transactions based on filters
$transactions = $transactionModel->getFilteredTransactions($account_id, $category_id, $start_date, $end_date, $type);

// Get all bank accounts and categories for filter dropdowns
$accounts = $bankAccountModel->getAllBankAccounts();
$categories = $categoryModel->getAllExpenseCategories();

// Calculate totals
$total_income = 0;
$total_expense = 0;
foreach ($transactions as $transaction) {
    if ($transaction['amount'] > 0) {
        $total_income += $transaction['amount'];
    } else {
        $total_expense += abs($transaction['amount']);
    }
}
$net_change = $total_income - $total_expense;
?>

<div class="container-fluid">
    <h1 class="h3 mb-4 text-gray-800">Transaction History</h1>
    
    <!-- Filter Card -->
    <div class="card shadow mb-4">
        <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">Filter Transactions</h6>
        </div>
        <div class="card-body">
            <form method="GET" action="">
                <div class="form-row">
                    <div class="col-md-3 mb-3">
                        <label for="account_id">Bank Account</label>
                        <select class="form-control" id="account_id" name="account_id">
                            <option value="0">All Accounts</option>
                            <?php foreach ($accounts as $account): ?>
                                <option value="<?php echo $account['id']; ?>" <?php echo ($account_id == $account['id']) ? 'selected' : ''; ?>>
                                    <?php echo htmlspecialchars($account['account_name']); ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="col-md-3 mb-3">
                        <label for="category_id">Category</label>
                        <select class="form-control" id="category_id" name="category_id">
                            <option value="0">All Categories</option>
                            <?php foreach ($categories as $category): ?>
                                <option value="<?php echo $category['id']; ?>" <?php echo ($category_id == $category['id']) ? 'selected' : ''; ?>>
                                    <?php echo htmlspecialchars($category['name']); ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="col-md-2 mb-3">
                        <label for="type">Type</label>
                        <select class="form-control" id="type" name="type">
                            <option value="">All Types</option>
                            <option value="income" <?php echo ($type == 'income') ? 'selected' : ''; ?>>Income</option>
                            <option value="expense" <?php echo ($type == 'expense') ? 'selected' : ''; ?>>Expense</option>
                        </select>
                    </div>
                    <div class="col-md-2 mb-3">
                        <label for="start_date">Start Date</label>
                        <input type="date" class="form-control" id="start_date" name="start_date" value="<?php echo $start_date; ?>">
                    </div>
                    <div class="col-md-2 mb-3">
                        <label for="end_date">End Date</label>
                        <input type="date" class="form-control" id="end_date" name="end_date" value="<?php echo $end_date; ?>">
                    </div>
                </div>
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-filter"></i> Apply Filters
                </button>
                <a href="transaction_history.php" class="btn btn-secondary">
                    <i class="fas fa-sync-alt"></i> Reset Filters
                </a>
            </form>
        </div>
    </div>
    
    <!-- Summary Cards -->
    <div class="row mb-4">
        <div class="col-xl-4 col-md-6 mb-4">
            <div class="card border-left-success shadow h-100 py-2">
                <div class="card-body">
                    <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                            <div class="text-xs font-weight-bold text-success text-uppercase mb-1">
                                Total Income
                            </div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800">$<?php echo number_format($total_income, 2); ?></div>
                        </div>
                        <div class="col-auto">
                            <i class="fas fa-dollar-sign fa-2x text-gray-300"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="col-xl-4 col-md-6 mb-4">
            <div class="card border-left-danger shadow h-100 py-2">
                <div class="card-body">
                    <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                            <div class="text-xs font-weight-bold text-danger text-uppercase mb-1">
                                Total Expenses
                            </div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800">$<?php echo number_format($total_expense, 2); ?></div>
                        </div>
                        <div class="col-auto">
                            <i class="fas fa-dollar-sign fa-2x text-gray-300"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="col-xl-4 col-md-6 mb-4">
            <div class="card border-left-info shadow h-100 py-2">
                <div class="card-body">
                    <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                            <div class="text-xs font-weight-bold text-info text-uppercase mb-1">
                                Net Change
                            </div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800">
                                $<?php echo number_format($net_change, 2); ?>
                                <?php if ($net_change > 0): ?>
                                    <span class="text-success">▲</span>
                                <?php elseif ($net_change < 0): ?>
                                    <span class="text-danger">▼</span>
                                <?php endif; ?>
                            </div>
                        </div>
                        <div class="col-auto">
                            <i class="fas fa-dollar-sign fa-2x text-gray-300"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Transactions Table -->
    <div class="card shadow mb-4">
        <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
            <h6 class="m-0 font-weight-bold text-primary">Transactions</h6>
            <div>
                <a href="#" class="btn btn-success btn-sm">
                    <i class="fas fa-plus-circle"></i> Add Transaction
                </a>
                <button class="btn btn-info btn-sm ml-2">
                    <i class="fas fa-file-export"></i> Export
                </button>
            </div>
        </div>
        <div class="card-body">
            <div class="table-responsive">
                <table class="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Account</th>
                            <th>Description</th>
                            <th>Category</th>
                            <th>Reference</th>
                            <th>Amount</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (empty($transactions)): ?>
                            <tr>
                                <td colspan="7" class="text-center">No transactions found</td>
                            </tr>
                        <?php else: ?>
                            <?php foreach ($transactions as $transaction): ?>
                                <tr>
                                    <td><?php echo date('M d, Y', strtotime($transaction['transaction_date'])); ?></td>
                                    <td><?php echo htmlspecialchars($transaction['account_name']); ?></td>
                                    <td><?php echo htmlspecialchars($transaction['description']); ?></td>
                                    <td><?php echo htmlspecialchars($transaction['category_name']); ?></td>
                                    <td><?php echo htmlspecialchars($transaction['reference_number']); ?></td>
                                    <td class="<?php echo $transaction['amount'] < 0 ? 'text-danger' : 'text-success'; ?>">
                                        <?php echo '$' . number_format(abs($transaction['amount']), 2); ?>
                                        <?php echo $transaction['amount'] < 0 ? '(Debit)' : '(Credit)'; ?>
                                    </td>
                                    <td>
                                        <a href="view_transaction.php?id=<?php echo $transaction['id']; ?>" class="btn btn-info btn-sm">
                                            <i class="fas fa-eye"></i>
                                        </a>
                                        <a href="edit_transaction.php?id=<?php echo $transaction['id']; ?>" class="btn btn-primary btn-sm">
                                            <i class="fas fa-edit"></i>
                                        </a>
                                        <a href="transaction_history.php?delete=<?php echo $transaction['id']; ?>" 
                                           class="btn btn-danger btn-sm" 
                                           onclick="return confirm('Are you sure you want to delete this transaction?');">
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
