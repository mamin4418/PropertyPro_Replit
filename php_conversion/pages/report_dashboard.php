
<?php
require_once '../includes/header.php';
require_once '../models/Report.php';
require_once '../models/Property.php';
require_once '../models/Lease.php';
require_once '../models/Payment.php';
require_once '../models/Expense.php';

// Initialize models
$reportModel = new Report($mysqli);
$propertyModel = new Property($mysqli);
$leaseModel = new Lease($mysqli);
$paymentModel = new Payment($mysqli);
$expenseModel = new Expense($mysqli);

// Get available reports
$reports = $reportModel->getAllReports();

// Get some key metrics for dashboard
$total_properties = $propertyModel->getTotalPropertiesCount();
$total_units = $propertyModel->getTotalUnitsCount();
$occupied_units = $propertyModel->getOccupiedUnitsCount();
$occupancy_rate = ($total_units > 0) ? round(($occupied_units / $total_units) * 100, 2) : 0;

// Get financial metrics
$current_month = date('m');
$current_year = date('Y');
$monthly_income = $paymentModel->getMonthlyIncome($current_month, $current_year);
$monthly_expenses = $expenseModel->getMonthlyExpenses($current_month, $current_year);
$net_income = $monthly_income - $monthly_expenses;

// Get recently generated reports
$recent_reports = $reportModel->getRecentReports(5);
?>

<div class="container-fluid">
    <h1 class="h3 mb-4 text-gray-800">Report Dashboard</h1>
    
    <!-- Overview Cards -->
    <div class="row">
        <div class="col-xl-3 col-md-6 mb-4">
            <div class="card border-left-primary shadow h-100 py-2">
                <div class="card-body">
                    <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                            <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">Properties</div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800"><?php echo $total_properties; ?></div>
                        </div>
                        <div class="col-auto">
                            <i class="fas fa-building fa-2x text-gray-300"></i>
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
                            <div class="text-xs font-weight-bold text-success text-uppercase mb-1">Occupancy Rate</div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800"><?php echo $occupancy_rate; ?>%</div>
                        </div>
                        <div class="col-auto">
                            <i class="fas fa-home fa-2x text-gray-300"></i>
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
                            <div class="text-xs font-weight-bold text-info text-uppercase mb-1">Monthly Income</div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800">$<?php echo number_format($monthly_income, 2); ?></div>
                        </div>
                        <div class="col-auto">
                            <i class="fas fa-dollar-sign fa-2x text-gray-300"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-xl-3 col-md-6 mb-4">
            <div class="card border-left-warning shadow h-100 py-2">
                <div class="card-body">
                    <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                            <div class="text-xs font-weight-bold text-warning text-uppercase mb-1">Net Income (MTD)</div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800">$<?php echo number_format($net_income, 2); ?></div>
                        </div>
                        <div class="col-auto">
                            <i class="fas fa-chart-line fa-2x text-gray-300"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col-lg-8">
            <!-- Report Catalog -->
            <div class="card shadow mb-4">
                <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                    <h6 class="m-0 font-weight-bold text-primary">Available Reports</h6>
                    <a href="create_custom_report.php" class="btn btn-primary btn-sm">
                        <i class="fas fa-plus"></i> Create Custom Report
                    </a>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-xl-6 mb-4">
                            <div class="card h-100">
                                <div class="card-header bg-primary text-white">
                                    <h6 class="m-0 font-weight-bold">Financial Reports</h6>
                                </div>
                                <div class="card-body">
                                    <div class="list-group">
                                        <a href="financial_reports.php?type=income" class="list-group-item list-group-item-action">
                                            <i class="fas fa-chart-pie mr-2"></i> Income Report
                                        </a>
                                        <a href="financial_reports.php?type=expense" class="list-group-item list-group-item-action">
                                            <i class="fas fa-chart-area mr-2"></i> Expense Report
                                        </a>
                                        <a href="financial_reports.php?type=profit_loss" class="list-group-item list-group-item-action">
                                            <i class="fas fa-file-invoice-dollar mr-2"></i> Profit & Loss Statement
                                        </a>
                                        <a href="financial_reports.php?type=rent_roll" class="list-group-item list-group-item-action">
                                            <i class="fas fa-file-alt mr-2"></i> Rent Roll
                                        </a>
                                        <a href="financial_reports.php?type=cash_flow" class="list-group-item list-group-item-action">
                                            <i class="fas fa-money-bill-wave mr-2"></i> Cash Flow Analysis
                                        </a>
                                    </div>
                                </div>
                                <div class="card-footer">
                                    <a href="financial_reports.php" class="text-primary">View All Financial Reports</a>
                                </div>
                            </div>
                        </div>

                        <div class="col-xl-6 mb-4">
                            <div class="card h-100">
                                <div class="card-header bg-success text-white">
                                    <h6 class="m-0 font-weight-bold">Property Reports</h6>
                                </div>
                                <div class="card-body">
                                    <div class="list-group">
                                        <a href="occupancy_reports.php?type=current" class="list-group-item list-group-item-action">
                                            <i class="fas fa-home mr-2"></i> Occupancy Summary
                                        </a>
                                        <a href="occupancy_reports.php?type=vacancy" class="list-group-item list-group-item-action">
                                            <i class="fas fa-door-open mr-2"></i> Vacancy Report
                                        </a>
                                        <a href="maintenance_reports.php?type=summary" class="list-group-item list-group-item-action">
                                            <i class="fas fa-tools mr-2"></i> Maintenance Summary
                                        </a>
                                        <a href="occupancy_reports.php?type=lease_expiration" class="list-group-item list-group-item-action">
                                            <i class="fas fa-calendar-alt mr-2"></i> Lease Expiration Report
                                        </a>
                                        <a href="maintenance_reports.php?type=detailed" class="list-group-item list-group-item-action">
                                            <i class="fas fa-clipboard-list mr-2"></i> Maintenance Detailed Report
                                        </a>
                                    </div>
                                </div>
                                <div class="card-footer d-flex justify-content-between">
                                    <a href="occupancy_reports.php" class="text-success">Occupancy Reports</a>
                                    <a href="maintenance_reports.php" class="text-success">Maintenance Reports</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-lg-4">
            <!-- Recent Reports -->
            <div class="card shadow mb-4">
                <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">Recently Generated Reports</h6>
                </div>
                <div class="card-body">
                    <?php if (count($recent_reports) > 0): ?>
                        <div class="list-group">
                            <?php foreach ($recent_reports as $report): ?>
                                <a href="<?php echo $report['file_path']; ?>" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                                    <div>
                                        <div class="font-weight-bold"><?php echo $report['name']; ?></div>
                                        <small class="text-muted">Generated: <?php echo date('M d, Y h:i A', strtotime($report['generated_at'])); ?></small>
                                    </div>
                                    <span class="badge badge-primary badge-pill">
                                        <i class="fas fa-download"></i>
                                    </span>
                                </a>
                            <?php endforeach; ?>
                        </div>
                    <?php else: ?>
                        <div class="text-center py-4">
                            <i class="fas fa-file-alt fa-3x text-muted mb-3"></i>
                            <p>No recent reports found</p>
                        </div>
                    <?php endif; ?>
                </div>
            </div>

            <!-- Report Schedule -->
            <div class="card shadow mb-4">
                <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">Scheduled Reports</h6>
                </div>
                <div class="card-body">
                    <div class="list-group">
                        <div class="list-group-item list-group-item-action">
                            <div class="d-flex w-100 justify-content-between">
                                <h6 class="mb-1">Monthly Financial Summary</h6>
                                <small class="text-muted">Monthly</small>
                            </div>
                            <p class="mb-1">Sent on the 1st to admin@example.com</p>
                        </div>
                        <div class="list-group-item list-group-item-action">
                            <div class="d-flex w-100 justify-content-between">
                                <h6 class="mb-1">Occupancy Report</h6>
                                <small class="text-muted">Weekly</small>
                            </div>
                            <p class="mb-1">Sent every Monday to property managers</p>
                        </div>
                    </div>
                    <div class="mt-3">
                        <a href="#" class="btn btn-primary btn-sm">
                            <i class="fas fa-plus"></i> Schedule New Report
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<?php require_once '../includes/footer.php'; ?>
