
<div class="container-fluid px-4">
    <h1 class="mt-4">Dashboard</h1>
    <p class="text-muted">Welcome back, <?php echo htmlspecialchars($_SESSION['first_name']); ?>!</p>
    
    <!-- Summary Stats -->
    <div class="row mt-4">
        <div class="col-xl-3 col-md-6">
            <div class="card bg-primary text-white mb-4">
                <div class="card-body">
                    <?php
                    // Get total properties
                    $mysqli = require __DIR__ . '/../config/database.php';
                    $result = $mysqli->query("SELECT COUNT(*) as count FROM properties");
                    $row = $result->fetch_assoc();
                    $propertyCount = $row['count'];
                    ?>
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h3 class="mb-0"><?php echo $propertyCount; ?></h3>
                            <div>Properties</div>
                        </div>
                        <div>
                            <i class="fas fa-building fa-2x opacity-75"></i>
                        </div>
                    </div>
                </div>
                <div class="card-footer d-flex align-items-center justify-content-between">
                    <a class="small text-white stretched-link" href="index.php?page=properties">View Details</a>
                    <div class="small text-white"><i class="fas fa-angle-right"></i></div>
                </div>
            </div>
        </div>
        
        <div class="col-xl-3 col-md-6">
            <div class="card bg-success text-white mb-4">
                <div class="card-body">
                    <?php
                    // Get total units
                    $result = $mysqli->query("SELECT COUNT(*) as count FROM units WHERE status = 'occupied'");
                    $occupiedUnits = $result->fetch_assoc()['count'];
                    
                    $result = $mysqli->query("SELECT COUNT(*) as count FROM units");
                    $totalUnits = $result->fetch_assoc()['count'];
                    
                    $occupancyRate = $totalUnits > 0 ? round(($occupiedUnits / $totalUnits) * 100) : 0;
                    ?>
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h3 class="mb-0"><?php echo $occupancyRate; ?>%</h3>
                            <div>Occupancy Rate</div>
                        </div>
                        <div>
                            <i class="fas fa-home fa-2x opacity-75"></i>
                        </div>
                    </div>
                </div>
                <div class="card-footer d-flex align-items-center justify-content-between">
                    <a class="small text-white stretched-link" href="index.php?page=units">View Details</a>
                    <div class="small text-white"><i class="fas fa-angle-right"></i></div>
                </div>
            </div>
        </div>
        
        <div class="col-xl-3 col-md-6">
            <div class="card bg-warning text-white mb-4">
                <div class="card-body">
                    <?php
                    // Get open maintenance requests
                    $result = $mysqli->query("SELECT COUNT(*) as count FROM maintenance_requests WHERE status = 'open'");
                    $maintenanceCount = $result->fetch_assoc()['count'];
                    ?>
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h3 class="mb-0"><?php echo $maintenanceCount; ?></h3>
                            <div>Maintenance Requests</div>
                        </div>
                        <div>
                            <i class="fas fa-tools fa-2x opacity-75"></i>
                        </div>
                    </div>
                </div>
                <div class="card-footer d-flex align-items-center justify-content-between">
                    <a class="small text-white stretched-link" href="index.php?page=maintenance">View Details</a>
                    <div class="small text-white"><i class="fas fa-angle-right"></i></div>
                </div>
            </div>
        </div>
        
        <div class="col-xl-3 col-md-6">
            <div class="card bg-danger text-white mb-4">
                <div class="card-body">
                    <?php
                    // Get current month's income
                    $firstDayOfMonth = date('Y-m-01');
                    $lastDayOfMonth = date('Y-m-t');
                    
                    $stmt = $mysqli->prepare("SELECT SUM(amount) as total FROM payments WHERE payment_date BETWEEN ? AND ? AND status = 'completed'");
                    $stmt->bind_param("ss", $firstDayOfMonth, $lastDayOfMonth);
                    $stmt->execute();
                    $result = $stmt->get_result();
                    $row = $result->fetch_assoc();
                    $monthlyIncome = $row['total'] ? $row['total'] : 0;
                    ?>
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h3 class="mb-0">$<?php echo number_format($monthlyIncome, 2); ?></h3>
                            <div>Monthly Income</div>
                        </div>
                        <div>
                            <i class="fas fa-dollar-sign fa-2x opacity-75"></i>
                        </div>
                    </div>
                </div>
                <div class="card-footer d-flex align-items-center justify-content-between">
                    <a class="small text-white stretched-link" href="index.php?page=payments">View Details</a>
                    <div class="small text-white"><i class="fas fa-angle-right"></i></div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Charts Row -->
    <div class="row">
        <div class="col-xl-6">
            <div class="card mb-4">
                <div class="card-header">
                    <i class="fas fa-chart-area me-1"></i>
                    Rent Collection
                </div>
                <div class="card-body">
                    <canvas id="rentCollectionChart" width="100%" height="40"></canvas>
                </div>
            </div>
        </div>
        
        <div class="col-xl-6">
            <div class="card mb-4">
                <div class="card-header">
                    <i class="fas fa-chart-bar me-1"></i>
                    Expense Distribution
                </div>
                <div class="card-body">
                    <canvas id="expenseChart" width="100%" height="40"></canvas>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Recent Activity and Tasks -->
    <div class="row">
        <div class="col-xl-6">
            <div class="card mb-4">
                <div class="card-header">
                    <i class="fas fa-list me-1"></i>
                    Recent Activity
                </div>
                <div class="card-body">
                    <div class="activity-feed">
                        <?php
                        // Get recent activities (placeholder data for now)
                        $activities = [
                            [
                                'type' => 'payment',
                                'description' => 'John Doe made a payment of $1,200',
                                'time' => '2 hours ago',
                                'icon' => 'fas fa-dollar-sign'
                            ],
                            [
                                'type' => 'maintenance',
                                'description' => 'New maintenance request submitted: Leaking faucet',
                                'time' => '4 hours ago',
                                'icon' => 'fas fa-tools'
                            ],
                            [
                                'type' => 'lease',
                                'description' => 'Lease signed for Apartment 101',
                                'time' => '1 day ago',
                                'icon' => 'fas fa-file-signature'
                            ],
                            [
                                'type' => 'property',
                                'description' => 'New property added: Sunset Heights',
                                'time' => '2 days ago',
                                'icon' => 'fas fa-building'
                            ],
                            [
                                'type' => 'tenant',
                                'description' => 'Sarah Johnson submitted a rental application',
                                'time' => '3 days ago',
                                'icon' => 'fas fa-user'
                            ],
                        ];
                        
                        foreach ($activities as $activity) {
                            echo '<div class="activity-item mb-3">';
                            echo '<div class="d-flex">';
                            echo '<div class="me-3">';
                            echo '<span class="activity-icon">';
                            echo '<i class="' . $activity['icon'] . '"></i>';
                            echo '</span>';
                            echo '</div>';
                            echo '<div>';
                            echo '<div class="activity-description">' . htmlspecialchars($activity['description']) . '</div>';
                            echo '<div class="text-muted small">' . htmlspecialchars($activity['time']) . '</div>';
                            echo '</div>';
                            echo '</div>';
                            echo '</div>';
                        }
                        ?>
                    </div>
                </div>
                <div class="card-footer">
                    <a href="#" class="btn btn-sm btn-outline-primary">View All Activity</a>
                </div>
            </div>
        </div>
        
        <div class="col-xl-6">
            <div class="card mb-4">
                <div class="card-header">
                    <i class="fas fa-tasks me-1"></i>
                    Upcoming Tasks
                </div>
                <div class="card-body">
                    <ul class="list-group">
                        <?php
                        // Get upcoming tasks (placeholder data for now)
                        $tasks = [
                            [
                                'title' => 'Collect rent for Unit 201',
                                'due_date' => '2023-07-05',
                                'priority' => 'high'
                            ],
                            [
                                'title' => 'Schedule maintenance for Building A',
                                'due_date' => '2023-07-08',
                                'priority' => 'medium'
                            ],
                            [
                                'title' => 'Renew insurance policy',
                                'due_date' => '2023-07-15',
                                'priority' => 'high'
                            ],
                            [
                                'title' => 'Inspect vacant units',
                                'due_date' => '2023-07-20',
                                'priority' => 'medium'
                            ],
                            [
                                'title' => 'Pay property taxes',
                                'due_date' => '2023-07-31',
                                'priority' => 'high'
                            ],
                        ];
                        
                        foreach ($tasks as $task) {
                            $priorityClass = '';
                            switch ($task['priority']) {
                                case 'high':
                                    $priorityClass = 'text-danger';
                                    break;
                                case 'medium':
                                    $priorityClass = 'text-warning';
                                    break;
                                default:
                                    $priorityClass = 'text-info';
                            }
                            
                            echo '<li class="list-group-item">';
                            echo '<div class="d-flex justify-content-between align-items-center">';
                            echo '<div class="d-flex align-items-center">';
                            echo '<div class="form-check me-2">';
                            echo '<input class="form-check-input" type="checkbox" value="" id="task' . rand(1000, 9999) . '">';
                            echo '</div>';
                            echo '<span>' . htmlspecialchars($task['title']) . '</span>';
                            echo '</div>';
                            echo '<div>';
                            echo '<span class="badge bg-secondary me-2">' . htmlspecialchars($task['due_date']) . '</span>';
                            echo '<span class="badge ' . $priorityClass . '">' . ucfirst(htmlspecialchars($task['priority'])) . '</span>';
                            echo '</div>';
                            echo '</div>';
                            echo '</li>';
                        }
                        ?>
                    </ul>
                </div>
                <div class="card-footer">
                    <a href="index.php?page=tasks" class="btn btn-sm btn-outline-primary">View All Tasks</a>
                </div>
            </div>
        </div>
    </div>
</div>
<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/Property.php';
require_once __DIR__ . '/../models/Unit.php';
require_once __DIR__ . '/../models/Tenant.php';

// Initialize models
$propertyModel = new Property($mysqli);
$unitModel = new Unit($mysqli);
$tenantModel = new Tenant($mysqli);

// Get property statistics
$properties = $propertyModel->getPropertiesWithStats();
$propertyCount = count($properties);

// Get unit statistics
$unitStats = $unitModel->getUnitStatistics();
$totalUnits = $unitStats['total'] ?? 0;
$occupiedUnits = $unitStats['occupied'] ?? 0;
$vacantUnits = $unitStats['vacant'] ?? 0;
$occupancyRate = $totalUnits > 0 ? ($occupiedUnits / $totalUnits) * 100 : 0;

// Get recent properties (up to 5)
$recentProperties = array_slice($properties, 0, 5);

$pageTitle = "Dashboard";
require_once __DIR__ . '/../includes/header.php';
?>

<div class="container-fluid py-4">
    <h1 class="h3 mb-4">Dashboard</h1>

    <!-- Statistics Cards -->
    <div class="row">
        <div class="col-xl-3 col-md-6 mb-4">
            <div class="card border-left-primary shadow h-100 py-2">
                <div class="card-body">
                    <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                            <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                Properties
                            </div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800"><?= $propertyCount ?></div>
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
                                Units
                            </div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800"><?= $totalUnits ?></div>
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
                                Occupancy Rate
                            </div>
                            <div class="row no-gutters align-items-center">
                                <div class="col-auto">
                                    <div class="h5 mb-0 mr-3 font-weight-bold text-gray-800"><?= round($occupancyRate) ?>%</div>
                                </div>
                                <div class="col">
                                    <div class="progress progress-sm mr-2">
                                        <div class="progress-bar bg-info" role="progressbar" 
                                             style="width: <?= $occupancyRate ?>%" 
                                             aria-valuenow="<?= $occupancyRate ?>" 
                                             aria-valuemin="0" 
                                             aria-valuemax="100"></div>
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
                                Vacant Units
                            </div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800"><?= $vacantUnits ?></div>
                        </div>
                        <div class="col-auto">
                            <i class="fas fa-door-open fa-2x text-gray-300"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Content Row -->
    <div class="row">
        <!-- Property Overview Card -->
        <div class="col-lg-8">
            <div class="card shadow mb-4">
                <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                    <h6 class="m-0 font-weight-bold text-primary">Properties Overview</h6>
                    <a href="properties.php" class="btn btn-sm btn-primary shadow-sm">
                        <i class="fas fa-list fa-sm text-white-50"></i> View All
                    </a>
                </div>
                <div class="card-body">
                    <?php if (empty($properties)): ?>
                        <div class="alert alert-info">
                            No properties found. <a href="add_property.php">Add your first property</a>
                        </div>
                    <?php else: ?>
                        <div class="table-responsive">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Property</th>
                                        <th>Type</th>
                                        <th>Units</th>
                                        <th>Occupancy</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php foreach ($recentProperties as $property): ?>
                                        <?php 
                                            $propertyOccupancyRate = 0;
                                            if (isset($property['unit_count']) && $property['unit_count'] > 0) {
                                                $propertyOccupancyRate = ($property['occupied_units'] / $property['unit_count']) * 100;
                                            }
                                        ?>
                                        <tr>
                                            <td>
                                                <a href="view_property.php?id=<?= $property['id'] ?>">
                                                    <?= htmlspecialchars($property['name']) ?>
                                                </a>
                                            </td>
                                            <td><?= htmlspecialchars($property['type']) ?></td>
                                            <td>
                                                <?= isset($property['unit_count']) ? $property['unit_count'] : 0 ?> 
                                                <small class="text-muted">(<?= isset($property['occupied_units']) ? $property['occupied_units'] : 0 ?> occupied)</small>
                                            </td>
                                            <td>
                                                <div class="d-flex align-items-center">
                                                    <div class="progress flex-grow-1 mr-2" style="height: 8px; width: 100px;">
                                                        <div class="progress-bar bg-success" role="progressbar" 
                                                             style="width: <?= round($propertyOccupancyRate) ?>%;" 
                                                             aria-valuenow="<?= round($propertyOccupancyRate) ?>" 
                                                             aria-valuemin="0" 
                                                             aria-valuemax="100"></div>
                                                    </div>
                                                    <span><?= round($propertyOccupancyRate) ?>%</span>
                                                </div>
                                            </td>
                                        </tr>
                                    <?php endforeach; ?>
                                </tbody>
                            </table>
                        </div>
                    <?php endif; ?>
                </div>
            </div>
        </div>

        <!-- Quick Links Card -->
        <div class="col-lg-4">
            <div class="card shadow mb-4">
                <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">Quick Actions</h6>
                </div>
                <div class="card-body">
                    <div class="list-group">
                        <a href="add_property.php" class="list-group-item list-group-item-action">
                            <div class="d-flex w-100 justify-content-between align-items-center">
                                <h6 class="mb-1">Add New Property</h6>
                                <i class="fas fa-building"></i>
                            </div>
                            <small class="text-muted">Create a new property in the system</small>
                        </a>
                        <a href="add_tenant.php" class="list-group-item list-group-item-action">
                            <div class="d-flex w-100 justify-content-between align-items-center">
                                <h6 class="mb-1">Add New Tenant</h6>
                                <i class="fas fa-user"></i>
                            </div>
                            <small class="text-muted">Add a new tenant to the system</small>
                        </a>
                        <a href="create_lease.php" class="list-group-item list-group-item-action">
                            <div class="d-flex w-100 justify-content-between align-items-center">
                                <h6 class="mb-1">Create New Lease</h6>
                                <i class="fas fa-file-contract"></i>
                            </div>
                            <small class="text-muted">Create a new lease agreement</small>
                        </a>
                        <a href="add_maintenance.php" class="list-group-item list-group-item-action">
                            <div class="d-flex w-100 justify-content-between align-items-center">
                                <h6 class="mb-1">Report Maintenance Issue</h6>
                                <i class="fas fa-tools"></i>
                            </div>
                            <small class="text-muted">Report a new maintenance request</small>
                        </a>
                        <a href="utilities.php" class="list-group-item list-group-item-action">
                            <div class="d-flex w-100 justify-content-between align-items-center">
                                <h6 class="mb-1">Manage Utilities</h6>
                                <i class="fas fa-bolt"></i>
                            </div>
                            <small class="text-muted">View and manage utility accounts</small>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
