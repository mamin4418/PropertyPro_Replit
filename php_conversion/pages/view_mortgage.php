
<?php
// Include necessary files
require_once 'includes/header.php';
require_once 'includes/sidebar.php';
require_once 'models/Mortgage.php';
require_once 'models/Property.php';

// Initialize database connection
$db = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
if ($db->connect_error) {
    die("Connection failed: " . $db->connect_error);
}

// Initialize models
$mortgage = new Mortgage($db);
$property = new Property($db);

// Get mortgage ID from URL
$id = isset($_GET['id']) ? intval($_GET['id']) : 0;
if ($id <= 0) {
    echo "<script>alert('Invalid mortgage ID.'); window.location.href = 'mortgages.php';</script>";
    exit;
}

// Get mortgage data
$mortgageData = $mortgage->getMortgageById($id);
if (!$mortgageData) {
    echo "<script>alert('Mortgage not found.'); window.location.href = 'mortgages.php';</script>";
    exit;
}

// Get property details
$propertyData = $property->getPropertyById($mortgageData['property_id']);

// Calculate mortgage details
$startDate = new DateTime($mortgageData['start_date']);
$endDate = clone $startDate;
$endDate->modify('+' . $mortgageData['term_years'] . ' years');
$remainingMonths = $startDate->diff(new DateTime())->format('%a') / 30;
$totalMonths = $mortgageData['term_years'] * 12;
$elapsedMonths = min($remainingMonths, $totalMonths);
$progress = ($elapsedMonths / $totalMonths) * 100;

// Format dates
$formattedStartDate = $startDate->format('F j, Y');
$formattedEndDate = $endDate->format('F j, Y');
?>

<div class="content-wrapper">
    <div class="container-fluid">
        <div class="row mb-4">
            <div class="col-md-6">
                <h1 class="h3 mb-0 text-gray-800">View Mortgage</h1>
                <p class="mb-4">Detailed mortgage information</p>
            </div>
            <div class="col-md-6 text-md-end">
                <a href="mortgages.php" class="btn btn-secondary">
                    <i class="fas fa-arrow-left me-2"></i>Back to Mortgages
                </a>
                <a href="edit_mortgage.php?id=<?= $id ?>" class="btn btn-primary">
                    <i class="fas fa-edit me-2"></i>Edit Mortgage
                </a>
            </div>
        </div>
        
        <div class="row">
            <!-- Mortgage Details Card -->
            <div class="col-lg-8">
                <div class="card shadow mb-4">
                    <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                        <h6 class="m-0 font-weight-bold text-primary">Mortgage Details</h6>
                    </div>
                    <div class="card-body">
                        <div class="row mb-4">
                            <div class="col-md-6">
                                <h5 class="font-weight-bold">Property</h5>
                                <p><?= htmlspecialchars($mortgageData['property_name']) ?></p>
                                <?php if ($propertyData): ?>
                                    <p><?= htmlspecialchars($propertyData['address']) ?>, 
                                       <?= htmlspecialchars($propertyData['city']) ?>, 
                                       <?= htmlspecialchars($propertyData['state']) ?> 
                                       <?= htmlspecialchars($propertyData['zip']) ?></p>
                                <?php endif; ?>
                            </div>
                            <div class="col-md-6">
                                <h5 class="font-weight-bold">Lender</h5>
                                <p><?= htmlspecialchars($mortgageData['lender']) ?></p>
                                <?php if (!empty($mortgageData['loan_number'])): ?>
                                    <p>Loan #: <?= htmlspecialchars($mortgageData['loan_number']) ?></p>
                                <?php endif; ?>
                            </div>
                        </div>
                        
                        <div class="row mb-4">
                            <div class="col-md-4">
                                <h5 class="font-weight-bold">Loan Amount</h5>
                                <p>$<?= number_format($mortgageData['loan_amount'], 2) ?></p>
                            </div>
                            <div class="col-md-4">
                                <h5 class="font-weight-bold">Interest Rate</h5>
                                <p><?= number_format($mortgageData['interest_rate'], 2) ?>%</p>
                            </div>
                            <div class="col-md-4">
                                <h5 class="font-weight-bold">Term</h5>
                                <p><?= htmlspecialchars($mortgageData['term_years']) ?> years</p>
                            </div>
                        </div>
                        
                        <div class="row mb-4">
                            <div class="col-md-4">
                                <h5 class="font-weight-bold">Start Date</h5>
                                <p><?= $formattedStartDate ?></p>
                            </div>
                            <div class="col-md-4">
                                <h5 class="font-weight-bold">End Date</h5>
                                <p><?= $formattedEndDate ?></p>
                            </div>
                            <div class="col-md-4">
                                <h5 class="font-weight-bold">Payment</h5>
                                <p>$<?= number_format($mortgageData['payment_amount'], 2) ?> 
                                   (<?= htmlspecialchars($mortgageData['payment_frequency']) ?>)</p>
                            </div>
                        </div>
                        
                        <div class="row mb-4">
                            <div class="col-12">
                                <h5 class="font-weight-bold">Progress</h5>
                                <div class="progress mb-2">
                                    <div class="progress-bar" role="progressbar" style="width: <?= $progress ?>%;" 
                                         aria-valuenow="<?= $progress ?>" aria-valuemin="0" aria-valuemax="100">
                                        <?= round($progress) ?>%
                                    </div>
                                </div>
                                <p class="small text-muted">
                                    <?= round($elapsedMonths) ?> months elapsed out of <?= $totalMonths ?> months total
                                </p>
                            </div>
                        </div>
                        
                        <?php if (!empty($mortgageData['notes'])): ?>
                            <div class="row">
                                <div class="col-12">
                                    <h5 class="font-weight-bold">Notes</h5>
                                    <p><?= nl2br(htmlspecialchars($mortgageData['notes'])) ?></p>
                                </div>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
            
            <!-- Mortgage Summary Card -->
            <div class="col-lg-4">
                <div class="card shadow mb-4">
                    <div class="card-header py-3">
                        <h6 class="m-0 font-weight-bold text-primary">Mortgage Summary</h6>
                    </div>
                    <div class="card-body">
                        <div class="row no-gutters align-items-center mb-3">
                            <div class="col mr-2">
                                <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                    Total Principal</div>
                                <div class="h5 mb-0 font-weight-bold text-gray-800">
                                    $<?= number_format($mortgageData['loan_amount'], 2) ?>
                                </div>
                            </div>
                            <div class="col-auto">
                                <i class="fas fa-dollar-sign fa-2x text-gray-300"></i>
                            </div>
                        </div>
                        
                        <div class="row no-gutters align-items-center mb-3">
                            <div class="col mr-2">
                                <div class="text-xs font-weight-bold text-success text-uppercase mb-1">
                                    Monthly Payment</div>
                                <div class="h5 mb-0 font-weight-bold text-gray-800">
                                    $<?= number_format($mortgageData['payment_amount'], 2) ?>
                                </div>
                            </div>
                            <div class="col-auto">
                                <i class="fas fa-calendar fa-2x text-gray-300"></i>
                            </div>
                        </div>
                        
                        <?php
                        // Calculate estimated total interest
                        $totalPayments = $mortgageData['term_years'] * 12;
                        $totalCost = $mortgageData['payment_amount'] * $totalPayments;
                        $totalInterest = $totalCost - $mortgageData['loan_amount'];
                        ?>
                        <div class="row no-gutters align-items-center mb-3">
                            <div class="col mr-2">
                                <div class="text-xs font-weight-bold text-warning text-uppercase mb-1">
                                    Est. Total Interest</div>
                                <div class="h5 mb-0 font-weight-bold text-gray-800">
                                    $<?= number_format($totalInterest, 2) ?>
                                </div>
                            </div>
                            <div class="col-auto">
                                <i class="fas fa-percentage fa-2x text-gray-300"></i>
                            </div>
                        </div>
                        
                        <div class="row no-gutters align-items-center">
                            <div class="col mr-2">
                                <div class="text-xs font-weight-bold text-info text-uppercase mb-1">
                                    Est. Total Cost</div>
                                <div class="h5 mb-0 font-weight-bold text-gray-800">
                                    $<?= number_format($totalCost, 2) ?>
                                </div>
                            </div>
                            <div class="col-auto">
                                <i class="fas fa-calculator fa-2x text-gray-300"></i>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="card shadow mb-4">
                    <div class="card-header py-3">
                        <h6 class="m-0 font-weight-bold text-primary">Actions</h6>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-12">
                                <a href="edit_mortgage.php?id=<?= $id ?>" class="btn btn-primary btn-block mb-3">
                                    <i class="fas fa-edit me-2"></i>Edit Mortgage
                                </a>
                                <a href="mortgages.php?action=delete&id=<?= $id ?>" 
                                   class="btn btn-danger btn-block mb-3"
                                   onclick="return confirm('Are you sure you want to delete this mortgage?')">
                                    <i class="fas fa-trash me-2"></i>Delete Mortgage
                                </a>
                                <?php if (isset($propertyData['id'])): ?>
                                    <a href="view_property.php?id=<?= $propertyData['id'] ?>" class="btn btn-info btn-block">
                                        <i class="fas fa-home me-2"></i>View Property
                                    </a>
                                <?php endif; ?>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<?php
require_once 'includes/footer.php';
$db->close();
?>
