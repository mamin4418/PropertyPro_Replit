
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
<?php
require_once '../includes/header.php';
require_once '../models/Report.php';
require_once '../models/Property.php';
require_once '../models/Tenant.php';
require_once '../models/Lease.php';
require_once '../models/Payment.php';
require_once '../models/Maintenance.php';

// Initialize models
$reportModel = new Report($mysqli);
$propertyModel = new Property($mysqli);
$tenantModel = new Tenant($mysqli);
$leaseModel = new Lease($mysqli);
$paymentModel = new Payment($mysqli);
$maintenanceModel = new Maintenance($mysqli);

// Get dashboard statistics
$propertyCount = $propertyModel->getPropertyCount();
$unitCount = $propertyModel->getTotalUnitCount();
$tenantCount = $tenantModel->getTenantCount();
$vacancyCount = $propertyModel->getVacancyCount();

// Get occupancy rate
$occupancyRate = $unitCount > 0 ? ((($unitCount - $vacancyCount) / $unitCount) * 100) : 0;

// Get financial overview
$currentMonth = date('Y-m');
$monthlyIncome = $paymentModel->getTotalIncomeForPeriod($currentMonth . '-01', date('Y-m-t', strtotime($currentMonth . '-01')));
$overdueAmount = $paymentModel->getTotalOverdueAmount();
$upcomingPayments = $paymentModel->getUpcomingPayments(7); // Next 7 days

// Get maintenance overview
$openMaintenance = $maintenanceModel->getRequestCountsByStatus()['open'];
$inProgressMaintenance = $maintenanceModel->getRequestCountsByStatus()['in-progress'];
$completedMaintenance = $maintenanceModel->getRequestCountsByStatus()['completed'];

// Get recently generated reports
$recentReports = $reportModel->getRecentReports(5);

// Get favorite reports
$favoriteReports = $reportModel->getFavoriteReports();
?>

<div class="container-fluid">
    <h1 class="h3 mb-4 text-gray-800">Report Dashboard</h1>
    
    <!-- Stats Overview Cards -->
    <div class="row">
        <div class="col-xl-3 col-md-6 mb-4">
            <div class="card border-left-primary shadow h-100 py-2">
                <div class="card-body">
                    <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                            <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                Properties</div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800"><?php echo $propertyCount; ?></div>
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
                            <div class="text-xs font-weight-bold text-success text-uppercase mb-1">
                                Units</div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800"><?php echo $unitCount; ?></div>
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
                            <div class="text-xs font-weight-bold text-info text-uppercase mb-1">
                                Occupancy Rate</div>
                            <div class="row no-gutters align-items-center">
                                <div class="col-auto">
                                    <div class="h5 mb-0 mr-3 font-weight-bold text-gray-800"><?php echo round($occupancyRate); ?>%</div>
                                </div>
                                <div class="col">
                                    <div class="progress progress-sm mr-2">
                                        <div class="progress-bar bg-info" role="progressbar" style="width: <?php echo $occupancyRate; ?>%"
                                            aria-valuenow="<?php echo $occupancyRate; ?>" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-auto">
                            <i class="fas fa-clipboard-list fa-2x text-gray-300"></i>
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
                            <div class="text-xs font-weight-bold text-warning text-uppercase mb-1">
                                Tenants</div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800"><?php echo $tenantCount; ?></div>
                        </div>
                        <div class="col-auto">
                            <i class="fas fa-users fa-2x text-gray-300"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Report Categories -->
    <div class="row mb-4">
        <div class="col-lg-12">
            <div class="card shadow mb-4">
                <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">Report Categories</h6>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-lg-3 col-md-6 mb-4">
                            <a href="financial_reports.php" class="card lift h-100">
                                <div class="card-body text-center">
                                    <div class="mb-3">
                                        <i class="fas fa-dollar-sign fa-3x text-primary"></i>
                                    </div>
                                    <h5>Financial Reports</h5>
                                    <p class="small text-muted mb-0">
                                        Income, expenses, and financial analysis reports
                                    </p>
                                </div>
                            </a>
                        </div>
                        
                        <div class="col-lg-3 col-md-6 mb-4">
                            <a href="occupancy_reports.php" class="card lift h-100">
                                <div class="card-body text-center">
                                    <div class="mb-3">
                                        <i class="fas fa-chart-pie fa-3x text-success"></i>
                                    </div>
                                    <h5>Occupancy Reports</h5>
                                    <p class="small text-muted mb-0">
                                        Vacancy rates, turnover, and occupancy statistics
                                    </p>
                                </div>
                            </a>
                        </div>
                        
                        <div class="col-lg-3 col-md-6 mb-4">
                            <a href="maintenance_reports.php" class="card lift h-100">
                                <div class="card-body text-center">
                                    <div class="mb-3">
                                        <i class="fas fa-wrench fa-3x text-info"></i>
                                    </div>
                                    <h5>Maintenance Reports</h5>
                                    <p class="small text-muted mb-0">
                                        Maintenance requests, costs, and resolution times
                                    </p>
                                </div>
                            </a>
                        </div>
                        
                        <div class="col-lg-3 col-md-6 mb-4">
                            <a href="create_custom_report.php" class="card lift h-100">
                                <div class="card-body text-center">
                                    <div class="mb-3">
                                        <i class="fas fa-cogs fa-3x text-warning"></i>
                                    </div>
                                    <h5>Custom Reports</h5>
                                    <p class="small text-muted mb-0">
                                        Build custom reports with specific parameters
                                    </p>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Report Overview -->
    <div class="row">
        <!-- Recent Reports -->
        <div class="col-lg-8">
            <div class="card shadow mb-4">
                <div class="card-header py-3 d-flex justify-content-between align-items-center">
                    <h6 class="m-0 font-weight-bold text-primary">Recently Generated Reports</h6>
                    <a href="reports.php" class="btn btn-sm btn-primary">
                        <i class="fas fa-list"></i> View All Reports
                    </a>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-bordered" width="100%" cellspacing="0">
                            <thead>
                                <tr>
                                    <th>Report Name</th>
                                    <th>Type</th>
                                    <th>Generated</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php if ($recentReports && count($recentReports) > 0): ?>
                                    <?php foreach ($recentReports as $report): ?>
                                        <tr>
                                            <td><?php echo htmlspecialchars($report['name']); ?></td>
                                            <td>
                                                <?php
                                                $type_badge = '';
                                                switch($report['type']) {
                                                    case 'financial':
                                                        $type_badge = 'badge-success';
                                                        break;
                                                    case 'occupancy':
                                                        $type_badge = 'badge-primary';
                                                        break;
                                                    case 'maintenance':
                                                        $type_badge = 'badge-info';
                                                        break;
                                                    case 'custom':
                                                        $type_badge = 'badge-warning';
                                                        break;
                                                    default:
                                                        $type_badge = 'badge-secondary';
                                                }
                                                ?>
                                                <span class="badge <?php echo $type_badge; ?>">
                                                    <?php echo ucfirst(htmlspecialchars($report['type'])); ?>
                                                </span>
                                            </td>
                                            <td><?php echo date('M d, Y g:i A', strtotime($report['created_at'])); ?></td>
                                            <td>
                                                <a href="view_report.php?id=<?php echo $report['id']; ?>" class="btn btn-info btn-sm">
                                                    <i class="fas fa-eye"></i> View
                                                </a>
                                                <a href="../reports/<?php echo $report['file_path']; ?>" download class="btn btn-primary btn-sm">
                                                    <i class="fas fa-download"></i> Download
                                                </a>
                                            </td>
                                        </tr>
                                    <?php endforeach; ?>
                                <?php else: ?>
                                    <tr>
                                        <td colspan="4" class="text-center">No reports generated yet</td>
                                    </tr>
                                <?php endif; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Financial & Maintenance Snapshot -->
        <div class="col-lg-4">
            <!-- Financial Snapshot -->
            <div class="card shadow mb-4">
                <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">Financial Snapshot</h6>
                </div>
                <div class="card-body">
                    <div class="mb-4">
                        <h4 class="small font-weight-bold">Monthly Income <span class="float-right">$<?php echo number_format($monthlyIncome, 2); ?></span></h4>
                        <div class="progress mb-4">
                            <div class="progress-bar bg-success" role="progressbar" style="width: 100%"></div>
                        </div>
                    </div>
                    
                    <div class="mb-4">
                        <h4 class="small font-weight-bold">Overdue Payments <span class="float-right">$<?php echo number_format($overdueAmount, 2); ?></span></h4>
                        <div class="progress mb-4">
                            <div class="progress-bar bg-danger" role="progressbar" style="width: 100%"></div>
                        </div>
                    </div>
                    
                    <div class="text-center">
                        <a href="financial_reports.php" class="btn btn-primary btn-sm">
                            <i class="fas fa-file-invoice-dollar"></i> Generate Financial Report
                        </a>
                    </div>
                </div>
            </div>
            
            <!-- Maintenance Snapshot -->
            <div class="card shadow mb-4">
                <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">Maintenance Snapshot</h6>
                </div>
                <div class="card-body">
                    <div class="d-flex justify-content-between mb-2">
                        <span>Open Requests:</span>
                        <span class="font-weight-bold"><?php echo $openMaintenance; ?></span>
                    </div>
                    <div class="d-flex justify-content-between mb-2">
                        <span>In Progress:</span>
                        <span class="font-weight-bold"><?php echo $inProgressMaintenance; ?></span>
                    </div>
                    <div class="d-flex justify-content-between mb-4">
                        <span>Completed (30 days):</span>
                        <span class="font-weight-bold"><?php echo $completedMaintenance; ?></span>
                    </div>
                    
                    <div class="text-center">
                        <a href="maintenance_reports.php" class="btn btn-info btn-sm">
                            <i class="fas fa-tools"></i> Generate Maintenance Report
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Favorite Reports & Quick Generate -->
    <div class="row">
        <!-- Favorite Reports -->
        <div class="col-lg-6">
            <div class="card shadow mb-4">
                <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">Favorite Reports</h6>
                </div>
                <div class="card-body">
                    <?php if ($favoriteReports && count($favoriteReports) > 0): ?>
                        <div class="list-group">
                            <?php foreach ($favoriteReports as $report): ?>
                                <a href="view_report.php?id=<?php echo $report['id']; ?>" class="list-group-item list-group-item-action">
                                    <div class="d-flex w-100 justify-content-between">
                                        <h5 class="mb-1"><?php echo htmlspecialchars($report['name']); ?></h5>
                                        <small><?php echo date('M d, Y', strtotime($report['created_at'])); ?></small>
                                    </div>
                                    <p class="mb-1">
                                        <span class="badge badge-<?php 
                                            echo $report['type'] === 'financial' ? 'success' : 
                                                ($report['type'] === 'occupancy' ? 'primary' : 
                                                ($report['type'] === 'maintenance' ? 'info' : 'warning')); 
                                        ?>">
                                            <?php echo ucfirst(htmlspecialchars($report['type'])); ?>
                                        </span>
                                        <?php echo htmlspecialchars($report['description']); ?>
                                    </p>
                                </a>
                            <?php endforeach; ?>
                        </div>
                    <?php else: ?>
                        <div class="text-center py-4">
                            <i class="fas fa-star fa-3x text-warning mb-3"></i>
                            <p>No favorite reports yet.</p>
                            <p>Mark reports as favorites to see them here.</p>
                        </div>
                    <?php endif; ?>
                </div>
            </div>
        </div>
        
        <!-- Quick Generate -->
        <div class="col-lg-6">
            <div class="card shadow mb-4">
                <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">Quick Generate Report</h6>
                </div>
                <div class="card-body">
                    <form method="POST" action="generate_report.php">
                        <div class="form-group">
                            <label for="report_type">Report Type</label>
                            <select class="form-control" id="report_type" name="report_type" required>
                                <option value="">Select Report Type</option>
                                <option value="financial">Financial Report</option>
                                <option value="occupancy">Occupancy Report</option>
                                <option value="maintenance">Maintenance Report</option>
                                <option value="tenant">Tenant Report</option>
                                <option value="property">Property Report</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="report_period">Time Period</label>
                            <select class="form-control" id="report_period" name="report_period" required>
                                <option value="current_month">Current Month</option>
                                <option value="previous_month">Previous Month</option>
                                <option value="current_quarter">Current Quarter</option>
                                <option value="current_year">Current Year</option>
                                <option value="previous_year">Previous Year</option>
                                <option value="custom">Custom Range</option>
                            </select>
                        </div>
                        
                        <div id="custom_date_range" style="display:none;">
                            <div class="form-row">
                                <div class="form-group col-md-6">
                                    <label for="start_date">Start Date</label>
                                    <input type="date" class="form-control" id="start_date" name="start_date">
                                </div>
                                <div class="form-group col-md-6">
                                    <label for="end_date">End Date</label>
                                    <input type="date" class="form-control" id="end_date" name="end_date">
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="report_format">Output Format</label>
                            <select class="form-control" id="report_format" name="report_format" required>
                                <option value="pdf">PDF</option>
                                <option value="excel">Excel</option>
                                <option value="csv">CSV</option>
                            </select>
                        </div>
                        
                        <div class="text-center">
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-file-alt"></i> Generate Report
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
$(document).ready(function() {
    // Toggle custom date range based on report period selection
    $('#report_period').change(function() {
        if ($(this).val() === 'custom') {
            $('#custom_date_range').show();
        } else {
            $('#custom_date_range').hide();
        }
    });
    
    // Initialize date pickers with default dates
    var today = new Date();
    var firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    
    $('#start_date').val(firstDay.toISOString().split('T')[0]);
    $('#end_date').val(today.toISOString().split('T')[0]);
});
</script>

<?php require_once '../includes/footer.php'; ?>
