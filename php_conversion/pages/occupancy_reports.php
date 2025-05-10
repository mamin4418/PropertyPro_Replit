
<?php
require_once '../includes/header.php';
require_once '../models/Report.php';
require_once '../models/Property.php';

// Initialize models
$reportModel = new Report($mysqli);
$propertyModel = new Property($mysqli);

// Get all properties for filter
$properties = $propertyModel->getAllProperties();

// Set default date range (last 12 months)
$end_date = date('Y-m-d');
$start_date = date('Y-m-d', strtotime('-12 months'));

// Process filter form
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $start_date = isset($_POST['start_date']) ? $_POST['start_date'] : $start_date;
    $end_date = isset($_POST['end_date']) ? $_POST['end_date'] : $end_date;
    $property_id = isset($_POST['property_id']) ? intval($_POST['property_id']) : 0;
    
    // Generate report data based on filters
    $occupancy_data = $reportModel->getOccupancyData($start_date, $end_date, $property_id);
    $monthly_occupancy = $reportModel->getMonthlyOccupancyRate($start_date, $end_date, $property_id);
    $property_occupancy = $reportModel->getOccupancyByProperty($start_date, $end_date);
    $unit_type_occupancy = $reportModel->getOccupancyByUnitType($start_date, $end_date, $property_id);
} else {
    // Default report data (all properties, last 12 months)
    $occupancy_data = $reportModel->getOccupancyData($start_date, $end_date);
    $monthly_occupancy = $reportModel->getMonthlyOccupancyRate($start_date, $end_date);
    $property_occupancy = $reportModel->getOccupancyByProperty($start_date, $end_date);
    $unit_type_occupancy = $reportModel->getOccupancyByUnitType($start_date, $end_date);
}

?>

<div class="container-fluid">
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 class="h3 mb-0 text-gray-800">Occupancy Reports</h1>
        <div>
            <a href="#" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm" id="printReport">
                <i class="fas fa-print fa-sm text-white-50"></i> Print Report
            </a>
            <a href="#" class="d-none d-sm-inline-block btn btn-sm btn-success shadow-sm ml-2" id="exportCSV">
                <i class="fas fa-file-csv fa-sm text-white-50"></i> Export CSV
            </a>
            <a href="#" class="d-none d-sm-inline-block btn btn-sm btn-info shadow-sm ml-2" id="exportPDF">
                <i class="fas fa-file-pdf fa-sm text-white-50"></i> Export PDF
            </a>
        </div>
    </div>

    <div class="row mb-4">
        <div class="col-lg-12">
            <div class="card shadow">
                <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">Report Filters</h6>
                </div>
                <div class="card-body">
                    <form method="POST" action="" class="form-inline">
                        <div class="form-group mr-3 mb-2">
                            <label for="property_id" class="mr-2">Property:</label>
                            <select class="form-control" id="property_id" name="property_id">
                                <option value="0">All Properties</option>
                                <?php foreach ($properties as $property): ?>
                                    <option value="<?php echo $property['id']; ?>" <?php echo (isset($_POST['property_id']) && $_POST['property_id'] == $property['id']) ? 'selected' : ''; ?>>
                                        <?php echo $property['name']; ?>
                                    </option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        <div class="form-group mr-3 mb-2">
                            <label for="start_date" class="mr-2">Start Date:</label>
                            <input type="date" class="form-control" id="start_date" name="start_date" value="<?php echo $start_date; ?>">
                        </div>
                        <div class="form-group mr-3 mb-2">
                            <label for="end_date" class="mr-2">End Date:</label>
                            <input type="date" class="form-control" id="end_date" name="end_date" value="<?php echo $end_date; ?>">
                        </div>
                        <button type="submit" class="btn btn-primary mb-2">Apply Filters</button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col-xl-4 col-md-6 mb-4">
            <div class="card border-left-primary shadow h-100 py-2">
                <div class="card-body">
                    <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                            <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">Current Occupancy Rate</div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800"><?php echo number_format($occupancy_data['current_rate'], 1); ?>%</div>
                        </div>
                        <div class="col-auto">
                            <i class="fas fa-percentage fa-2x text-gray-300"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-xl-4 col-md-6 mb-4">
            <div class="card border-left-success shadow h-100 py-2">
                <div class="card-body">
                    <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                            <div class="text-xs font-weight-bold text-success text-uppercase mb-1">Average Occupancy Rate</div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800"><?php echo number_format($occupancy_data['average_rate'], 1); ?>%</div>
                        </div>
                        <div class="col-auto">
                            <i class="fas fa-chart-line fa-2x text-gray-300"></i>
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
                            <div class="text-xs font-weight-bold text-info text-uppercase mb-1">Total Units</div>
                            <div class="row no-gutters align-items-center">
                                <div class="col-auto">
                                    <div class="h5 mb-0 mr-3 font-weight-bold text-gray-800"><?php echo $occupancy_data['total_units']; ?></div>
                                </div>
                                <div class="col">
                                    <div class="progress progress-sm mr-2">
                                        <div class="progress-bar bg-info" role="progressbar" style="width: <?php echo $occupancy_data['current_rate']; ?>%" aria-valuenow="<?php echo $occupancy_data['current_rate']; ?>" aria-valuemin="0" aria-valuemax="100"></div>
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
    </div>

    <div class="row">
        <div class="col-lg-8">
            <div class="card shadow mb-4">
                <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">Monthly Occupancy Rate</h6>
                </div>
                <div class="card-body">
                    <div class="chart-area">
                        <canvas id="monthlyOccupancyChart"></canvas>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-lg-4">
            <div class="card shadow mb-4">
                <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">Occupancy by Property</h6>
                </div>
                <div class="card-body">
                    <div class="chart-pie pt-4 pb-2">
                        <canvas id="propertyOccupancyChart"></canvas>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col-lg-6">
            <div class="card shadow mb-4">
                <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">Occupancy by Unit Type</h6>
                </div>
                <div class="card-body">
                    <div class="chart-bar">
                        <canvas id="unitTypeOccupancyChart"></canvas>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-lg-6">
            <div class="card shadow mb-4">
                <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">Occupancy Details</h6>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-bordered" id="occupancyTable" width="100%" cellspacing="0">
                            <thead>
                                <tr>
                                    <th>Property</th>
                                    <th>Total Units</th>
                                    <th>Occupied</th>
                                    <th>Vacant</th>
                                    <th>Occupancy Rate</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($property_occupancy as $row): ?>
                                    <tr>
                                        <td><?php echo $row['property_name']; ?></td>
                                        <td><?php echo $row['total_units']; ?></td>
                                        <td><?php echo $row['occupied_units']; ?></td>
                                        <td><?php echo $row['vacant_units']; ?></td>
                                        <td><?php echo number_format($row['occupancy_rate'], 1); ?>%</td>
                                    </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
document.addEventListener('DOMContentLoaded', function() {
    // Monthly Occupancy Rate Chart
    var monthlyData = <?php echo json_encode(array_column($monthly_occupancy, 'rate')); ?>;
    var monthlyLabels = <?php echo json_encode(array_column($monthly_occupancy, 'month')); ?>;
    
    var ctx1 = document.getElementById('monthlyOccupancyChart').getContext('2d');
    var monthlyOccupancyChart = new Chart(ctx1, {
        type: 'line',
        data: {
            labels: monthlyLabels,
            datasets: [{
                label: 'Occupancy Rate (%)',
                data: monthlyData,
                lineTension: 0.3,
                backgroundColor: "rgba(78, 115, 223, 0.05)",
                borderColor: "rgba(78, 115, 223, 1)",
                pointRadius: 3,
                pointBackgroundColor: "rgba(78, 115, 223, 1)",
                pointBorderColor: "rgba(78, 115, 223, 1)",
                pointHoverRadius: 3,
                pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
                pointHoverBorderColor: "rgba(78, 115, 223, 1)",
                pointHitRadius: 10,
                pointBorderWidth: 2
            }]
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false,
                    min: Math.max(0, Math.min.apply(null, monthlyData) - 10),
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });

    // Property Occupancy Chart
    var propertyData = <?php echo json_encode(array_column($property_occupancy, 'occupancy_rate')); ?>;
    var propertyLabels = <?php echo json_encode(array_column($property_occupancy, 'property_name')); ?>;
    
    var ctx2 = document.getElementById('propertyOccupancyChart').getContext('2d');
    var propertyOccupancyChart = new Chart(ctx2, {
        type: 'doughnut',
        data: {
            labels: propertyLabels,
            datasets: [{
                data: propertyData,
                backgroundColor: [
                    '#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b', '#858796', '#5a5c69'
                ],
                hoverBackgroundColor: [
                    '#2e59d9', '#17a673', '#2c9faf', '#dda20a', '#be2617', '#60616f', '#373840'
                ],
                hoverBorderColor: "rgba(234, 236, 244, 1)",
            }]
        },
        options: {
            maintainAspectRatio: false,
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        var indice = tooltipItem.index;
                        return data.labels[indice] + ': ' + data.datasets[0].data[indice] + '%';
                    }
                }
            }
        }
    });

    // Unit Type Occupancy Chart
    var unitTypeLabels = <?php echo json_encode(array_column($unit_type_occupancy, 'unit_type')); ?>;
    var unitTypeOccupied = <?php echo json_encode(array_column($unit_type_occupancy, 'occupied_units')); ?>;
    var unitTypeVacant = <?php echo json_encode(array_column($unit_type_occupancy, 'vacant_units')); ?>;
    
    var ctx3 = document.getElementById('unitTypeOccupancyChart').getContext('2d');
    var unitTypeOccupancyChart = new Chart(ctx3, {
        type: 'bar',
        data: {
            labels: unitTypeLabels,
            datasets: [
                {
                    label: 'Occupied',
                    backgroundColor: "#4e73df",
                    data: unitTypeOccupied
                },
                {
                    label: 'Vacant',
                    backgroundColor: "#e74a3b",
                    data: unitTypeVacant
                }
            ]
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                x: {
                    stacked: false
                },
                y: {
                    stacked: false,
                    beginAtZero: true
                }
            }
        }
    });

    // Initialize DataTable
    $('#occupancyTable').DataTable({
        order: [[4, 'desc']]
    });

    // Print Report
    document.getElementById('printReport').addEventListener('click', function(e) {
        e.preventDefault();
        window.print();
    });

    // Export to CSV
    document.getElementById('exportCSV').addEventListener('click', function(e) {
        e.preventDefault();
        exportTableToCSV('occupancy_report.csv');
    });

    // Export to PDF
    document.getElementById('exportPDF').addEventListener('click', function(e) {
        e.preventDefault();
        alert('PDF export functionality will be implemented here.');
    });

    // Function to export table to CSV
    function exportTableToCSV(filename) {
        var csv = [];
        var rows = document.querySelectorAll('table tr');
        
        for (var i = 0; i < rows.length; i++) {
            var row = [], cols = rows[i].querySelectorAll('td, th');
            
            for (var j = 0; j < cols.length; j++) {
                row.push('"' + cols[j].innerText + '"');
            }
            
            csv.push(row.join(','));
        }

        // Download CSV file
        downloadCSV(csv.join('\n'), filename);
    }

    function downloadCSV(csv, filename) {
        var csvFile;
        var downloadLink;

        csvFile = new Blob([csv], {type: 'text/csv'});
        downloadLink = document.createElement('a');
        downloadLink.download = filename;
        downloadLink.href = window.URL.createObjectURL(csvFile);
        downloadLink.style.display = 'none';
        document.body.appendChild(downloadLink);
        downloadLink.click();
    }
});
</script>

<?php require_once '../includes/footer.php'; ?>
