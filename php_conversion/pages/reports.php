
<?php
require_once '../includes/header.php';
require_once '../models/Property.php';
require_once '../models/Tenant.php';
require_once '../models/Lease.php';

// Get current date and default start/end dates for reports
$currentDate = date('Y-m-d');
$defaultStartDate = date('Y-m-01'); // First day of current month
$defaultEndDate = date('Y-m-t'); // Last day of current month

// Get report parameters from form submission
$startDate = isset($_GET['start_date']) ? $_GET['start_date'] : $defaultStartDate;
$endDate = isset($_GET['end_date']) ? $_GET['end_date'] : $defaultEndDate;
$reportType = isset($_GET['report_type']) ? $_GET['report_type'] : 'rent_roll';
$propertyId = isset($_GET['property_id']) ? (int)$_GET['property_id'] : 0;

// Get all properties for the filter dropdown
$property = new Property($mysqli);
$properties = $property->getAllProperties();

// Initialize data arrays
$rentRollData = [];
$incomeExpenseData = [];
$vacancyData = [];
$maintenanceData = [];

// Function to get random data for demonstration purposes
// In a real app, this would come from the database
function getRandomAmount($min, $max) {
    return round(mt_rand($min * 100, $max * 100) / 100, 2);
}

// Generate demo report data based on report type
if ($reportType == 'rent_roll') {
    // Get actual lease data if available
    $lease = new Lease($mysqli);
    $leases = $propertyId ? $lease->getLeasesByProperty($propertyId) : $lease->getAllLeases();
    
    foreach ($leases as $lease) {
        $rentRollData[] = [
            'property' => $lease['property_name'],
            'unit' => $lease['unit_number'],
            'tenant' => $lease['first_name'] . ' ' . $lease['last_name'],
            'lease_start' => $lease['start_date'],
            'lease_end' => $lease['end_date'],
            'rent' => $lease['rent_amount'],
            'status' => $lease['status'],
            'last_payment' => date('Y-m-d', strtotime('-' . mt_rand(1, 30) . ' days')),
            'balance' => getRandomAmount(0, 500)
        ];
    }
    
    // If no actual data, generate demo data
    if (empty($rentRollData)) {
        $demoProperties = ['Parkside Apartments', 'Riverfront Condos', 'Highland Townhomes'];
        for ($i = 1; $i <= 10; $i++) {
            $rentRollData[] = [
                'property' => $demoProperties[array_rand($demoProperties)],
                'unit' => 'Unit ' . mt_rand(100, 999),
                'tenant' => 'Tenant ' . $i,
                'lease_start' => date('Y-m-d', strtotime('-' . mt_rand(1, 12) . ' months')),
                'lease_end' => date('Y-m-d', strtotime('+' . mt_rand(1, 12) . ' months')),
                'rent' => getRandomAmount(800, 2000),
                'status' => mt_rand(0, 10) > 1 ? 'active' : 'pending',
                'last_payment' => date('Y-m-d', strtotime('-' . mt_rand(1, 30) . ' days')),
                'balance' => getRandomAmount(0, 500)
            ];
        }
    }
} elseif ($reportType == 'income_expense') {
    $months = [];
    $startMonth = date('Y-m', strtotime($startDate));
    $endMonth = date('Y-m', strtotime($endDate));
    
    $current = $startMonth;
    while ($current <= $endMonth) {
        $months[] = $current;
        $current = date('Y-m', strtotime($current . '-01 +1 month'));
    }
    
    foreach ($months as $month) {
        $incomeExpenseData[$month] = [
            'rent_income' => getRandomAmount(8000, 12000),
            'other_income' => getRandomAmount(500, 1500),
            'total_income' => 0,
            'maintenance' => getRandomAmount(1000, 2500),
            'utilities' => getRandomAmount(800, 1500),
            'property_tax' => getRandomAmount(1500, 2000),
            'insurance' => getRandomAmount(500, 900),
            'management_fees' => getRandomAmount(600, 1000),
            'other_expenses' => getRandomAmount(300, 800),
            'total_expenses' => 0,
            'net_income' => 0
        ];
        
        // Calculate totals
        $incomeExpenseData[$month]['total_income'] = 
            $incomeExpenseData[$month]['rent_income'] + 
            $incomeExpenseData[$month]['other_income'];
            
        $incomeExpenseData[$month]['total_expenses'] = 
            $incomeExpenseData[$month]['maintenance'] + 
            $incomeExpenseData[$month]['utilities'] + 
            $incomeExpenseData[$month]['property_tax'] + 
            $incomeExpenseData[$month]['insurance'] + 
            $incomeExpenseData[$month]['management_fees'] + 
            $incomeExpenseData[$month]['other_expenses'];
            
        $incomeExpenseData[$month]['net_income'] = 
            $incomeExpenseData[$month]['total_income'] - 
            $incomeExpenseData[$month]['total_expenses'];
    }
} elseif ($reportType == 'vacancy') {
    $demoProperties = ['Parkside Apartments', 'Riverfront Condos', 'Highland Townhomes'];
    
    foreach ($demoProperties as $propertyName) {
        $totalUnits = mt_rand(20, 40);
        $occupiedUnits = mt_rand(15, $totalUnits);
        $vacantUnits = $totalUnits - $occupiedUnits;
        $occupancyRate = round(($occupiedUnits / $totalUnits) * 100, 1);
        
        $vacancyData[] = [
            'property' => $propertyName,
            'total_units' => $totalUnits,
            'occupied_units' => $occupiedUnits,
            'vacant_units' => $vacantUnits,
            'occupancy_rate' => $occupancyRate,
            'avg_rent' => getRandomAmount(900, 1500),
            'potential_income' => $totalUnits * getRandomAmount(900, 1500),
            'actual_income' => $occupiedUnits * getRandomAmount(900, 1500)
        ];
    }
} elseif ($reportType == 'maintenance') {
    $categories = ['Plumbing', 'Electrical', 'HVAC', 'Appliance', 'Structural', 'Other'];
    $statuses = ['open', 'in-progress', 'completed', 'cancelled'];
    
    foreach ($categories as $category) {
        $totalRequests = mt_rand(5, 20);
        $completedRequests = mt_rand(1, $totalRequests);
        $openRequests = $totalRequests - $completedRequests;
        $avgResolutionDays = mt_rand(1, 14);
        
        $maintenanceData[] = [
            'category' => $category,
            'total_requests' => $totalRequests,
            'open_requests' => $openRequests,
            'completed_requests' => $completedRequests,
            'avg_resolution_days' => $avgResolutionDays,
            'total_cost' => getRandomAmount(500, 3000)
        ];
    }
}
?>

<div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="h3 mb-0 text-gray-800">Financial Reports</h1>
        <div>
            <button type="button" class="btn btn-success" id="exportReport">
                <i class="fas fa-file-excel"></i> Export to Excel
            </button>
            <button type="button" class="btn btn-info ml-2" id="printReport">
                <i class="fas fa-print"></i> Print
            </button>
        </div>
    </div>
    
    <!-- Report Filters -->
    <div class="card shadow mb-4">
        <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">Report Filters</h6>
        </div>
        <div class="card-body">
            <form method="GET" action="">
                <div class="row">
                    <div class="col-md-3">
                        <div class="form-group">
                            <label for="report_type">Report Type</label>
                            <select class="form-control" id="report_type" name="report_type">
                                <option value="rent_roll" <?= $reportType == 'rent_roll' ? 'selected' : '' ?>>Rent Roll</option>
                                <option value="income_expense" <?= $reportType == 'income_expense' ? 'selected' : '' ?>>Income & Expenses</option>
                                <option value="vacancy" <?= $reportType == 'vacancy' ? 'selected' : '' ?>>Vacancy Report</option>
                                <option value="maintenance" <?= $reportType == 'maintenance' ? 'selected' : '' ?>>Maintenance Report</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="form-group">
                            <label for="property_id">Property</label>
                            <select class="form-control" id="property_id" name="property_id">
                                <option value="0">All Properties</option>
                                <?php foreach ($properties as $prop): ?>
                                    <option value="<?= $prop['id'] ?>" <?= $propertyId == $prop['id'] ? 'selected' : '' ?>>
                                        <?= htmlspecialchars($prop['name']) ?>
                                    </option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-2">
                        <div class="form-group">
                            <label for="start_date">Start Date</label>
                            <input type="date" class="form-control" id="start_date" name="start_date" value="<?= $startDate ?>">
                        </div>
                    </div>
                    <div class="col-md-2">
                        <div class="form-group">
                            <label for="end_date">End Date</label>
                            <input type="date" class="form-control" id="end_date" name="end_date" value="<?= $endDate ?>">
                        </div>
                    </div>
                    <div class="col-md-2">
                        <div class="form-group">
                            <label class="d-block">&nbsp;</label>
                            <button type="submit" class="btn btn-primary btn-block">
                                <i class="fas fa-search"></i> Generate Report
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
    
    <!-- Report Content -->
    <div class="card shadow mb-4" id="reportContent">
        <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">
                <?php
                switch ($reportType) {
                    case 'rent_roll':
                        echo 'Rent Roll Report';
                        break;
                    case 'income_expense':
                        echo 'Income & Expense Report';
                        break;
                    case 'vacancy':
                        echo 'Vacancy Report';
                        break;
                    case 'maintenance':
                        echo 'Maintenance Report';
                        break;
                }
                ?>
                (<?= date('M d, Y', strtotime($startDate)) ?> - <?= date('M d, Y', strtotime($endDate)) ?>)
            </h6>
        </div>
        <div class="card-body">
            <?php if ($reportType == 'rent_roll'): ?>
                <!-- Rent Roll Report -->
                <div class="table-responsive">
                    <table class="table table-bordered" id="rentRollTable" width="100%" cellspacing="0">
                        <thead>
                            <tr>
                                <th>Property</th>
                                <th>Unit</th>
                                <th>Tenant</th>
                                <th>Lease Start</th>
                                <th>Lease End</th>
                                <th>Monthly Rent</th>
                                <th>Status</th>
                                <th>Last Payment</th>
                                <th>Balance</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (empty($rentRollData)): ?>
                                <tr>
                                    <td colspan="9" class="text-center">No data available for the selected criteria</td>
                                </tr>
                            <?php else: ?>
                                <?php foreach ($rentRollData as $row): ?>
                                    <tr>
                                        <td><?= htmlspecialchars($row['property']) ?></td>
                                        <td><?= htmlspecialchars($row['unit']) ?></td>
                                        <td><?= htmlspecialchars($row['tenant']) ?></td>
                                        <td><?= date('m/d/Y', strtotime($row['lease_start'])) ?></td>
                                        <td><?= date('m/d/Y', strtotime($row['lease_end'])) ?></td>
                                        <td>$<?= number_format($row['rent'], 2) ?></td>
                                        <td>
                                            <span class="badge badge-<?= $row['status'] == 'active' ? 'success' : 'warning' ?>">
                                                <?= ucfirst($row['status']) ?>
                                            </span>
                                        </td>
                                        <td><?= date('m/d/Y', strtotime($row['last_payment'])) ?></td>
                                        <td>$<?= number_format($row['balance'], 2) ?></td>
                                    </tr>
                                <?php endforeach; ?>
                                <tr class="font-weight-bold bg-light">
                                    <td colspan="5" class="text-right">Total:</td>
                                    <td>
                                        $<?= number_format(array_sum(array_column($rentRollData, 'rent')), 2) ?>
                                    </td>
                                    <td colspan="2" class="text-right">Total Balance:</td>
                                    <td>
                                        $<?= number_format(array_sum(array_column($rentRollData, 'balance')), 2) ?>
                                    </td>
                                </tr>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
                
            <?php elseif ($reportType == 'income_expense'): ?>
                <!-- Income & Expense Report -->
                <div class="row mb-4">
                    <div class="col-lg-8 col-md-10 mx-auto">
                        <div id="incomeExpenseChart" style="height: 400px;"></div>
                    </div>
                </div>
                
                <div class="table-responsive">
                    <table class="table table-bordered" id="incomeExpenseTable" width="100%" cellspacing="0">
                        <thead>
                            <tr>
                                <th>Month</th>
                                <th>Rent Income</th>
                                <th>Other Income</th>
                                <th>Total Income</th>
                                <th>Maintenance</th>
                                <th>Utilities</th>
                                <th>Property Tax</th>
                                <th>Insurance</th>
                                <th>Management Fees</th>
                                <th>Other Expenses</th>
                                <th>Total Expenses</th>
                                <th>Net Income</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (empty($incomeExpenseData)): ?>
                                <tr>
                                    <td colspan="12" class="text-center">No data available for the selected criteria</td>
                                </tr>
                            <?php else: ?>
                                <?php 
                                $totalRentIncome = 0;
                                $totalOtherIncome = 0;
                                $totalIncome = 0;
                                $totalMaintenance = 0;
                                $totalUtilities = 0;
                                $totalPropertyTax = 0;
                                $totalInsurance = 0;
                                $totalManagementFees = 0;
                                $totalOtherExpenses = 0;
                                $totalExpenses = 0;
                                $totalNetIncome = 0;
                                
                                foreach ($incomeExpenseData as $month => $data): 
                                    $totalRentIncome += $data['rent_income'];
                                    $totalOtherIncome += $data['other_income'];
                                    $totalIncome += $data['total_income'];
                                    $totalMaintenance += $data['maintenance'];
                                    $totalUtilities += $data['utilities'];
                                    $totalPropertyTax += $data['property_tax'];
                                    $totalInsurance += $data['insurance'];
                                    $totalManagementFees += $data['management_fees'];
                                    $totalOtherExpenses += $data['other_expenses'];
                                    $totalExpenses += $data['total_expenses'];
                                    $totalNetIncome += $data['net_income'];
                                ?>
                                    <tr>
                                        <td><?= date('F Y', strtotime($month . '-01')) ?></td>
                                        <td>$<?= number_format($data['rent_income'], 2) ?></td>
                                        <td>$<?= number_format($data['other_income'], 2) ?></td>
                                        <td>$<?= number_format($data['total_income'], 2) ?></td>
                                        <td>$<?= number_format($data['maintenance'], 2) ?></td>
                                        <td>$<?= number_format($data['utilities'], 2) ?></td>
                                        <td>$<?= number_format($data['property_tax'], 2) ?></td>
                                        <td>$<?= number_format($data['insurance'], 2) ?></td>
                                        <td>$<?= number_format($data['management_fees'], 2) ?></td>
                                        <td>$<?= number_format($data['other_expenses'], 2) ?></td>
                                        <td>$<?= number_format($data['total_expenses'], 2) ?></td>
                                        <td class="<?= $data['net_income'] >= 0 ? 'text-success' : 'text-danger' ?>">
                                            $<?= number_format($data['net_income'], 2) ?>
                                        </td>
                                    </tr>
                                <?php endforeach; ?>
                                <tr class="font-weight-bold bg-light">
                                    <td>Total</td>
                                    <td>$<?= number_format($totalRentIncome, 2) ?></td>
                                    <td>$<?= number_format($totalOtherIncome, 2) ?></td>
                                    <td>$<?= number_format($totalIncome, 2) ?></td>
                                    <td>$<?= number_format($totalMaintenance, 2) ?></td>
                                    <td>$<?= number_format($totalUtilities, 2) ?></td>
                                    <td>$<?= number_format($totalPropertyTax, 2) ?></td>
                                    <td>$<?= number_format($totalInsurance, 2) ?></td>
                                    <td>$<?= number_format($totalManagementFees, 2) ?></td>
                                    <td>$<?= number_format($totalOtherExpenses, 2) ?></td>
                                    <td>$<?= number_format($totalExpenses, 2) ?></td>
                                    <td class="<?= $totalNetIncome >= 0 ? 'text-success' : 'text-danger' ?>">
                                        $<?= number_format($totalNetIncome, 2) ?>
                                    </td>
                                </tr>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
                
            <?php elseif ($reportType == 'vacancy'): ?>
                <!-- Vacancy Report -->
                <div class="row mb-4">
                    <div class="col-lg-8 col-md-10 mx-auto">
                        <div id="vacancyChart" style="height: 400px;"></div>
                    </div>
                </div>
                
                <div class="table-responsive">
                    <table class="table table-bordered" id="vacancyTable" width="100%" cellspacing="0">
                        <thead>
                            <tr>
                                <th>Property</th>
                                <th>Total Units</th>
                                <th>Occupied Units</th>
                                <th>Vacant Units</th>
                                <th>Occupancy Rate</th>
                                <th>Avg. Rent</th>
                                <th>Potential Income</th>
                                <th>Actual Income</th>
                                <th>Loss from Vacancy</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (empty($vacancyData)): ?>
                                <tr>
                                    <td colspan="9" class="text-center">No data available for the selected criteria</td>
                                </tr>
                            <?php else: ?>
                                <?php 
                                $totalUnits = 0;
                                $totalOccupied = 0;
                                $totalVacant = 0;
                                $totalPotentialIncome = 0;
                                $totalActualIncome = 0;
                                
                                foreach ($vacancyData as $row): 
                                    $totalUnits += $row['total_units'];
                                    $totalOccupied += $row['occupied_units'];
                                    $totalVacant += $row['vacant_units'];
                                    $totalPotentialIncome += $row['potential_income'];
                                    $totalActualIncome += $row['actual_income'];
                                    $vacancyLoss = $row['potential_income'] - $row['actual_income'];
                                ?>
                                    <tr>
                                        <td><?= htmlspecialchars($row['property']) ?></td>
                                        <td><?= $row['total_units'] ?></td>
                                        <td><?= $row['occupied_units'] ?></td>
                                        <td><?= $row['vacant_units'] ?></td>
                                        <td><?= $row['occupancy_rate'] ?>%</td>
                                        <td>$<?= number_format($row['avg_rent'], 2) ?></td>
                                        <td>$<?= number_format($row['potential_income'], 2) ?></td>
                                        <td>$<?= number_format($row['actual_income'], 2) ?></td>
                                        <td class="text-danger">$<?= number_format($vacancyLoss, 2) ?></td>
                                    </tr>
                                <?php endforeach; ?>
                                <tr class="font-weight-bold bg-light">
                                    <td>Total</td>
                                    <td><?= $totalUnits ?></td>
                                    <td><?= $totalOccupied ?></td>
                                    <td><?= $totalVacant ?></td>
                                    <td><?= $totalUnits > 0 ? round(($totalOccupied / $totalUnits) * 100, 1) : 0 ?>%</td>
                                    <td>-</td>
                                    <td>$<?= number_format($totalPotentialIncome, 2) ?></td>
                                    <td>$<?= number_format($totalActualIncome, 2) ?></td>
                                    <td class="text-danger">$<?= number_format($totalPotentialIncome - $totalActualIncome, 2) ?></td>
                                </tr>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
                
            <?php elseif ($reportType == 'maintenance'): ?>
                <!-- Maintenance Report -->
                <div class="row mb-4">
                    <div class="col-lg-6">
                        <div id="maintenanceCategoryChart" style="height: 300px;"></div>
                    </div>
                    <div class="col-lg-6">
                        <div id="maintenanceStatusChart" style="height: 300px;"></div>
                    </div>
                </div>
                
                <div class="table-responsive">
                    <table class="table table-bordered" id="maintenanceTable" width="100%" cellspacing="0">
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th>Total Requests</th>
                                <th>Open Requests</th>
                                <th>Completed Requests</th>
                                <th>Avg. Resolution (Days)</th>
                                <th>Total Cost</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (empty($maintenanceData)): ?>
                                <tr>
                                    <td colspan="6" class="text-center">No data available for the selected criteria</td>
                                </tr>
                            <?php else: ?>
                                <?php 
                                $totalRequests = 0;
                                $totalOpen = 0;
                                $totalCompleted = 0;
                                $totalCost = 0;
                                $avgResolutionSum = 0;
                                $categoryCount = count($maintenanceData);
                                
                                foreach ($maintenanceData as $row): 
                                    $totalRequests += $row['total_requests'];
                                    $totalOpen += $row['open_requests'];
                                    $totalCompleted += $row['completed_requests'];
                                    $totalCost += $row['total_cost'];
                                    $avgResolutionSum += $row['avg_resolution_days'];
                                ?>
                                    <tr>
                                        <td><?= htmlspecialchars($row['category']) ?></td>
                                        <td><?= $row['total_requests'] ?></td>
                                        <td><?= $row['open_requests'] ?></td>
                                        <td><?= $row['completed_requests'] ?></td>
                                        <td><?= $row['avg_resolution_days'] ?></td>
                                        <td>$<?= number_format($row['total_cost'], 2) ?></td>
                                    </tr>
                                <?php endforeach; ?>
                                <tr class="font-weight-bold bg-light">
                                    <td>Total</td>
                                    <td><?= $totalRequests ?></td>
                                    <td><?= $totalOpen ?></td>
                                    <td><?= $totalCompleted ?></td>
                                    <td><?= $categoryCount > 0 ? round($avgResolutionSum / $categoryCount, 1) : 0 ?></td>
                                    <td>$<?= number_format($totalCost, 2) ?></td>
                                </tr>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            <?php endif; ?>
        </div>
    </div>
</div>

<!-- Load Charts.js for reports -->
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<script>
    $(document).ready(function() {
        // Initialize DataTables
        $('.table').DataTable({
            "paging": false,
            "searching": false
        });
        
        // Print report
        $('#printReport').click(function() {
            window.print();
        });
        
        // Export to Excel (simplified version - in a real app this would use a proper library)
        $('#exportReport').click(function() {
            let tableId;
            switch('<?= $reportType ?>') {
                case 'rent_roll':
                    tableId = 'rentRollTable';
                    break;
                case 'income_expense':
                    tableId = 'incomeExpenseTable';
                    break;
                case 'vacancy':
                    tableId = 'vacancyTable';
                    break;
                case 'maintenance':
                    tableId = 'maintenanceTable';
                    break;
            }
            
            if (tableId) {
                exportTableToCSV(tableId, '<?= $reportType ?>_report.csv');
            }
        });
        
        <?php if ($reportType == 'income_expense' && !empty($incomeExpenseData)): ?>
            // Income & Expense Chart
            const months = [];
            const incomeData = [];
            const expenseData = [];
            const netIncomeData = [];
            
            <?php foreach ($incomeExpenseData as $month => $data): ?>
                months.push('<?= date('M Y', strtotime($month . '-01')) ?>');
                incomeData.push(<?= $data['total_income'] ?>);
                expenseData.push(<?= $data['total_expenses'] ?>);
                netIncomeData.push(<?= $data['net_income'] ?>);
            <?php endforeach; ?>
            
            const ctx = document.getElementById('incomeExpenseChart').getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: months,
                    datasets: [
                        {
                            label: 'Income',
                            data: incomeData,
                            backgroundColor: 'rgba(75, 192, 192, 0.7)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1
                        },
                        {
                            label: 'Expenses',
                            data: expenseData,
                            backgroundColor: 'rgba(255, 99, 132, 0.7)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1
                        },
                        {
                            label: 'Net Income',
                            data: netIncomeData,
                            backgroundColor: 'rgba(54, 162, 235, 0.7)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1,
                            type: 'line'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Income vs Expenses'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return '$' + value.toLocaleString();
                                }
                            }
                        }
                    }
                }
            });
        <?php endif; ?>
        
        <?php if ($reportType == 'vacancy' && !empty($vacancyData)): ?>
            // Vacancy Chart
            const properties = [];
            const occupiedData = [];
            const vacantData = [];
            
            <?php foreach ($vacancyData as $row): ?>
                properties.push('<?= $row['property'] ?>');
                occupiedData.push(<?= $row['occupied_units'] ?>);
                vacantData.push(<?= $row['vacant_units'] ?>);
            <?php endforeach; ?>
            
            const vacancyCtx = document.getElementById('vacancyChart').getContext('2d');
            new Chart(vacancyCtx, {
                type: 'bar',
                data: {
                    labels: properties,
                    datasets: [
                        {
                            label: 'Occupied Units',
                            data: occupiedData,
                            backgroundColor: 'rgba(75, 192, 192, 0.7)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1
                        },
                        {
                            label: 'Vacant Units',
                            data: vacantData,
                            backgroundColor: 'rgba(255, 99, 132, 0.7)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Property Occupancy'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Number of Units'
                            }
                        }
                    }
                }
            });
        <?php endif; ?>
        
        <?php if ($reportType == 'maintenance' && !empty($maintenanceData)): ?>
            // Maintenance Category Chart
            const categories = [];
            const requestsData = [];
            const costsData = [];
            
            <?php foreach ($maintenanceData as $row): ?>
                categories.push('<?= $row['category'] ?>');
                requestsData.push(<?= $row['total_requests'] ?>);
                costsData.push(<?= $row['total_cost'] ?>);
            <?php endforeach; ?>
            
            const categoryCtx = document.getElementById('maintenanceCategoryChart').getContext('2d');
            new Chart(categoryCtx, {
                type: 'pie',
                data: {
                    labels: categories,
                    datasets: [
                        {
                            data: requestsData,
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.7)',
                                'rgba(54, 162, 235, 0.7)',
                                'rgba(255, 206, 86, 0.7)',
                                'rgba(75, 192, 192, 0.7)',
                                'rgba(153, 102, 255, 0.7)',
                                'rgba(255, 159, 64, 0.7)'
                            ],
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Maintenance Requests by Category'
                        }
                    }
                }
            });
            
            // Maintenance Status Chart
            const statusCtx = document.getElementById('maintenanceStatusChart').getContext('2d');
            new Chart(statusCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Open', 'Completed'],
                    datasets: [
                        {
                            data: [
                                <?= array_sum(array_column($maintenanceData, 'open_requests')) ?>,
                                <?= array_sum(array_column($maintenanceData, 'completed_requests')) ?>
                            ],
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.7)',
                                'rgba(75, 192, 192, 0.7)'
                            ],
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Maintenance Request Status'
                        }
                    }
                }
            });
        <?php endif; ?>
        
        // Function to export table to CSV
        function exportTableToCSV(tableId, filename) {
            const table = document.getElementById(tableId);
            let csv = [];
            let rows = table.querySelectorAll('tr');
            
            for (let i = 0; i < rows.length; i++) {
                let row = [], cols = rows[i].querySelectorAll('td, th');
                
                for (let j = 0; j < cols.length; j++) {
                    // Replace HTML with plain text and handle quotes for CSV
                    let text = cols[j].innerText;
                    text = text.replace(/"/g, '""'); // Escape quotes
                    row.push('"' + text + '"');
                }
                
                csv.push(row.join(','));
            }
            
            // Download CSV file
            downloadCSV(csv.join('\n'), filename);
        }
        
        function downloadCSV(csv, filename) {
            let csvFile = new Blob([csv], {type: "text/csv"});
            let downloadLink = document.createElement("a");
            
            downloadLink.download = filename;
            downloadLink.href = window.URL.createObjectURL(csvFile);
            downloadLink.style.display = "none";
            
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
    });
</script>

<?php require_once '../includes/footer.php'; ?>
