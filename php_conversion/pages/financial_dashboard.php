
<?php
require_once '../includes/header.php';
require_once '../models/BankAccount.php';
require_once '../models/Transaction.php';
require_once '../models/ExpenseCategory.php';

// Initialize models
$bankAccountModel = new BankAccount($mysqli);
$transactionModel = new Transaction($mysqli);
$categoryModel = new ExpenseCategory($mysqli);

// Get all bank accounts
$accounts = $bankAccountModel->getAllBankAccounts();

// Calculate total balance across all accounts
$total_balance = 0;
foreach ($accounts as $account) {
    $total_balance += $account['current_balance'];
}

// Get recent transactions (across all accounts)
$recent_transactions = $transactionModel->getRecentTransactions(5);

// Get income vs expenses for the current month
$current_month = date('Y-m');
$current_month_transactions = $transactionModel->getTransactionsByMonth($current_month);

$month_income = 0;
$month_expense = 0;
foreach ($current_month_transactions as $transaction) {
    if ($transaction['amount'] > 0) {
        $month_income += $transaction['amount'];
    } else {
        $month_expense += abs($transaction['amount']);
    }
}

// Get expense categories breakdown for the current month
$expense_categories = $categoryModel->getCategoryExpensesForMonth($current_month);
?>

<div class="container-fluid">
    <h1 class="h3 mb-4 text-gray-800">Financial Dashboard</h1>
    
    <!-- Financial Summary Cards -->
    <div class="row">
        <div class="col-xl-3 col-md-6 mb-4">
            <div class="card border-left-primary shadow h-100 py-2">
                <div class="card-body">
                    <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                            <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                Total Balance
                            </div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800">$<?php echo number_format($total_balance, 2); ?></div>
                        </div>
                        <div class="col-auto">
                            <i class="fas fa-dollar-sign fa-2x text-gray-300"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="col-xl-3 col-md-6 mb-4">
            <div class="card border-left-success shadow h-100 py-2">
                <div class="card-body">
                    <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                            <div class="text-xs font-weight-bold text-success text-uppercase mb-1">
                                Monthly Income
                            </div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800">$<?php echo number_format($month_income, 2); ?></div>
                        </div>
                        <div class="col-auto">
                            <i class="fas fa-arrow-up fa-2x text-gray-300"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="col-xl-3 col-md-6 mb-4">
            <div class="card border-left-danger shadow h-100 py-2">
                <div class="card-body">
                    <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                            <div class="text-xs font-weight-bold text-danger text-uppercase mb-1">
                                Monthly Expenses
                            </div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800">$<?php echo number_format($month_expense, 2); ?></div>
                        </div>
                        <div class="col-auto">
                            <i class="fas fa-arrow-down fa-2x text-gray-300"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="col-xl-3 col-md-6 mb-4">
            <div class="card border-left-info shadow h-100 py-2">
                <div class="card-body">
                    <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                            <div class="text-xs font-weight-bold text-info text-uppercase mb-1">
                                Monthly Net
                            </div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800">
                                $<?php echo number_format($month_income - $month_expense, 2); ?>
                                <?php if ($month_income - $month_expense >= 0): ?>
                                    <span class="text-success">▲</span>
                                <?php else: ?>
                                    <span class="text-danger">▼</span>
                                <?php endif; ?>
                            </div>
                        </div>
                        <div class="col-auto">
                            <i class="fas fa-balance-scale fa-2x text-gray-300"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <div class="row">
        <!-- Bank Accounts Card -->
        <div class="col-lg-6">
            <div class="card shadow mb-4">
                <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                    <h6 class="m-0 font-weight-bold text-primary">Bank Accounts</h6>
                    <a href="bank_accounts.php" class="btn btn-primary btn-sm">
                        <i class="fas fa-list"></i> View All
                    </a>
                </div>
                <div class="card-body">
                    <?php if (empty($accounts)): ?>
                        <p class="text-center">No bank accounts found</p>
                        <div class="text-center mt-3">
                            <a href="add_bank_account.php" class="btn btn-primary">
                                <i class="fas fa-plus-circle"></i> Add Bank Account
                            </a>
                        </div>
                    <?php else: ?>
                        <div class="table-responsive">
                            <table class="table table-bordered" width="100%" cellspacing="0">
                                <thead>
                                    <tr>
                                        <th>Account</th>
                                        <th>Bank</th>
                                        <th>Balance</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php foreach ($accounts as $account): ?>
                                        <tr>
                                            <td><?php echo htmlspecialchars($account['account_name']); ?></td>
                                            <td><?php echo htmlspecialchars($account['bank_name']); ?></td>
                                            <td>$<?php echo number_format($account['current_balance'], 2); ?></td>
                                            <td>
                                                <a href="view_bank_account.php?id=<?php echo $account['id']; ?>" class="btn btn-info btn-sm">
                                                    <i class="fas fa-eye"></i>
                                                </a>
                                            </td>
                                        </tr>
                                    <?php endforeach; ?>
                                </tbody>
                            </table>
                        </div>
                        <div class="text-center mt-3">
                            <a href="add_bank_account.php" class="btn btn-success">
                                <i class="fas fa-plus-circle"></i> Add Bank Account
                            </a>
                        </div>
                    <?php endif; ?>
                </div>
            </div>
        </div>
        
        <!-- Recent Transactions Card -->
        <div class="col-lg-6">
            <div class="card shadow mb-4">
                <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                    <h6 class="m-0 font-weight-bold text-primary">Recent Transactions</h6>
                    <a href="transaction_history.php" class="btn btn-primary btn-sm">
                        <i class="fas fa-list"></i> View All
                    </a>
                </div>
                <div class="card-body">
                    <?php if (empty($recent_transactions)): ?>
                        <p class="text-center">No recent transactions found</p>
                    <?php else: ?>
                        <div class="table-responsive">
                            <table class="table table-bordered" width="100%" cellspacing="0">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Description</th>
                                        <th>Account</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php foreach ($recent_transactions as $transaction): ?>
                                        <tr>
                                            <td><?php echo date('M d', strtotime($transaction['transaction_date'])); ?></td>
                                            <td><?php echo htmlspecialchars($transaction['description']); ?></td>
                                            <td><?php echo htmlspecialchars($transaction['account_name']); ?></td>
                                            <td class="<?php echo $transaction['amount'] < 0 ? 'text-danger' : 'text-success'; ?>">
                                                $<?php echo number_format(abs($transaction['amount']), 2); ?>
                                            </td>
                                        </tr>
                                    <?php endforeach; ?>
                                </tbody>
                            </table>
                        </div>
                    <?php endif; ?>
                    <div class="text-center mt-3">
                        <a href="#" class="btn btn-success">
                            <i class="fas fa-plus-circle"></i> Add Transaction
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <div class="row">
        <!-- Expense Categories Card -->
        <div class="col-lg-6">
            <div class="card shadow mb-4">
                <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">Expense Categories (This Month)</h6>
                </div>
                <div class="card-body">
                    <?php if (empty($expense_categories)): ?>
                        <p class="text-center">No expense data for this month</p>
                    <?php else: ?>
                        <div class="chart-container" style="position: relative; height:300px;">
                            <canvas id="expenseCategoriesChart"></canvas>
                        </div>
                    <?php endif; ?>
                </div>
            </div>
        </div>
        
        <!-- Income vs Expenses Card -->
        <div class="col-lg-6">
            <div class="card shadow mb-4">
                <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">Income vs Expenses (This Month)</h6>
                </div>
                <div class="card-body">
                    <div class="chart-container" style="position: relative; height:300px;">
                        <canvas id="incomeExpensesChart"></canvas>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Chart.js -->
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<script>
document.addEventListener('DOMContentLoaded', function() {
    // Income vs Expenses Chart
    var incomeExpensesCtx = document.getElementById('incomeExpensesChart').getContext('2d');
    var incomeExpensesChart = new Chart(incomeExpensesCtx, {
        type: 'bar',
        data: {
            labels: ['Current Month'],
            datasets: [
                {
                    label: 'Income',
                    data: [<?php echo $month_income; ?>],
                    backgroundColor: 'rgba(40, 167, 69, 0.5)',
                    borderColor: 'rgba(40, 167, 69, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Expenses',
                    data: [<?php echo $month_expense; ?>],
                    backgroundColor: 'rgba(220, 53, 69, 0.5)',
                    borderColor: 'rgba(220, 53, 69, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': $' + context.raw.toLocaleString();
                        }
                    }
                }
            }
        }
    });
    
    <?php if (!empty($expense_categories)): ?>
    // Expense Categories Chart
    var expenseCategoriesCtx = document.getElementById('expenseCategoriesChart').getContext('2d');
    var expenseCategoriesChart = new Chart(expenseCategoriesCtx, {
        type: 'pie',
        data: {
            labels: [
                <?php 
                foreach ($expense_categories as $category) {
                    echo "'" . htmlspecialchars($category['name']) . "', ";
                }
                ?>
            ],
            datasets: [{
                data: [
                    <?php 
                    foreach ($expense_categories as $category) {
                        echo abs($category['total']) . ", ";
                    }
                    ?>
                ],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(255, 159, 64, 0.7)',
                    'rgba(199, 199, 199, 0.7)',
                    'rgba(83, 102, 255, 0.7)',
                    'rgba(40, 159, 64, 0.7)',
                    'rgba(210, 199, 199, 0.7)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            var label = context.label || '';
                            var value = context.raw;
                            var total = context.dataset.data.reduce((a, b) => a + b, 0);
                            var percentage = Math.round((value / total) * 100);
                            return label + ': $' + value.toLocaleString() + ' (' + percentage + '%)';
                        }
                    }
                }
            }
        }
    });
    <?php endif; ?>
});
</script>

<?php require_once '../includes/footer.php'; ?>
