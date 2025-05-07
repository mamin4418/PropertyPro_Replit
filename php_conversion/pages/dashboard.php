
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
