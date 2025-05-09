
<?php
// Include necessary files
require_once 'includes/header.php';
require_once 'includes/sidebar.php';
require_once 'models/Insurance.php';
require_once 'models/Property.php';

// Initialize database connection
$db = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
if ($db->connect_error) {
    die("Connection failed: " . $db->connect_error);
}

// Initialize models
$insurance = new Insurance($db);
$property = new Property($db);

// Get insurance ID from URL
$id = isset($_GET['id']) ? intval($_GET['id']) : 0;
if ($id <= 0) {
    echo "<script>alert('Invalid insurance ID.'); window.location.href = 'insurances.php';</script>";
    exit;
}

// Get insurance data
$insuranceData = $insurance->getInsuranceById($id);
if (!$insuranceData) {
    echo "<script>alert('Insurance policy not found.'); window.location.href = 'insurances.php';</script>";
    exit;
}

// Get property details
$propertyData = $property->getPropertyById($insuranceData['property_id']);

// Calculate days until expiration
$expirationDate = new DateTime($insuranceData['expiration_date']);
$currentDate = new DateTime();
$daysUntilExpiration = $currentDate->diff($expirationDate)->format("%r%a");
$isExpiring = $daysUntilExpiration < 30 && $daysUntilExpiration >= 0;
$isExpired = $daysUntilExpiration < 0;

// Format dates
$formattedEffectiveDate = date('F j, Y', strtotime($insuranceData['effective_date']));
$formattedExpirationDate = date('F j, Y', strtotime($insuranceData['expiration_date']));
?>

<div class="content-wrapper">
    <div class="container-fluid">
        <div class="row mb-4">
            <div class="col-md-6">
                <h1 class="h3 mb-0 text-gray-800">View Insurance Policy</h1>
                <p class="mb-4">Detailed insurance policy information</p>
            </div>
            <div class="col-md-6 text-md-end">
                <a href="insurances.php" class="btn btn-secondary">
                    <i class="fas fa-arrow-left me-2"></i>Back to Insurance Policies
                </a>
                <a href="edit_insurance.php?id=<?= $id ?>" class="btn btn-primary">
                    <i class="fas fa-edit me-2"></i>Edit Insurance
                </a>
            </div>
        </div>
        
        <?php if ($isExpired): ?>
            <div class="alert alert-danger" role="alert">
                <i class="fas fa-exclamation-circle me-2"></i>
                <strong>Policy Expired!</strong> This insurance policy expired <?= abs($daysUntilExpiration) ?> days ago.
            </div>
        <?php elseif ($isExpiring): ?>
            <div class="alert alert-warning" role="alert">
                <i class="fas fa-exclamation-triangle me-2"></i>
                <strong>Policy Expiring Soon!</strong> This insurance policy will expire in <?= $daysUntilExpiration ?> days.
            </div>
        <?php endif; ?>
        
        <div class="row">
            <!-- Insurance Details Card -->
            <div class="col-lg-8">
                <div class="card shadow mb-4">
                    <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                        <h6 class="m-0 font-weight-bold text-primary">Insurance Policy Details</h6>
                    </div>
                    <div class="card-body">
                        <div class="row mb-4">
                            <div class="col-md-6">
                                <h5 class="font-weight-bold">Property</h5>
                                <p><?= htmlspecialchars($insuranceData['property_name']) ?></p>
                                <?php if ($propertyData): ?>
                                    <p><?= htmlspecialchars($propertyData['address']) ?>, 
                                       <?= htmlspecialchars($propertyData['city']) ?>, 
                                       <?= htmlspecialchars($propertyData['state']) ?> 
                                       <?= htmlspecialchars($propertyData['zip']) ?></p>
                                <?php endif; ?>
                            </div>
                            <div class="col-md-6">
                                <h5 class="font-weight-bold">Provider</h5>
                                <p><?= htmlspecialchars($insuranceData['provider']) ?></p>
                                <p>Policy #: <?= htmlspecialchars($insuranceData['policy_number']) ?></p>
                            </div>
                        </div>
                        
                        <div class="row mb-4">
                            <div class="col-md-6">
                                <h5 class="font-weight-bold">Coverage Type</h5>
                                <p><?= htmlspecialchars($insuranceData['coverage_type']) ?></p>
                            </div>
                            <div class="col-md-6">
                                <h5 class="font-weight-bold">Coverage Amount</h5>
                                <p>$<?= number_format($insuranceData['coverage_amount'], 2) ?></p>
                            </div>
                        </div>
                        
                        <div class="row mb-4">
                            <div class="col-md-4">
                                <h5 class="font-weight-bold">Premium</h5>
                                <p>$<?= number_format($insuranceData['premium_amount'], 2) ?> 
                                   (<?= htmlspecialchars($insuranceData['payment_frequency']) ?>)</p>
                            </div>
                            <div class="col-md-4">
                                <h5 class="font-weight-bold">Deductible</h5>
                                <p>$<?= number_format($insuranceData['deductible'], 2) ?></p>
                            </div>
                            <div class="col-md-4">
                                <h5 class="font-weight-bold">Status</h5>
                                <?php if ($isExpired): ?>
                                    <p class="text-danger">Expired</p>
                                <?php elseif ($isExpiring): ?>
                                    <p class="text-warning">Expiring Soon</p>
                                <?php else: ?>
                                    <p class="text-success">Active</p>
                                <?php endif; ?>
                            </div>
                        </div>
                        
                        <div class="row mb-4">
                            <div class="col-md-6">
                                <h5 class="font-weight-bold">Effective Date</h5>
                                <p><?= $formattedEffectiveDate ?></p>
                            </div>
                            <div class="col-md-6">
                                <h5 class="font-weight-bold">Expiration Date</h5>
                                <p <?= $isExpiring || $isExpired ? 'class="text-danger"' : '' ?>>
                                    <?= $formattedExpirationDate ?>
                                    <?php if ($isExpiring): ?>
                                        <span class="badge bg-warning text-dark">Expiring Soon</span>
                                    <?php elseif ($isExpired): ?>
                                        <span class="badge bg-danger">Expired</span>
                                    <?php endif; ?>
                                </p>
                            </div>
                        </div>
                        
                        <?php if (!empty($insuranceData['notes'])): ?>
                            <div class="row">
                                <div class="col-12">
                                    <h5 class="font-weight-bold">Notes</h5>
                                    <p><?= nl2br(htmlspecialchars($insuranceData['notes'])) ?></p>
                                </div>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
            
            <!-- Insurance Summary Card -->
            <div class="col-lg-4">
                <div class="card shadow mb-4">
                    <div class="card-header py-3">
                        <h6 class="m-0 font-weight-bold text-primary">Insurance Summary</h6>
                    </div>
                    <div class="card-body">
                        <div class="row no-gutters align-items-center mb-3">
                            <div class="col mr-2">
                                <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                    Coverage Amount</div>
                                <div class="h5 mb-0 font-weight-bold text-gray-800">
                                    $<?= number_format($insuranceData['coverage_amount'], 2) ?>
                                </div>
                            </div>
                            <div class="col-auto">
                                <i class="fas fa-shield-alt fa-2x text-gray-300"></i>
                            </div>
                        </div>
                        
                        <div class="row no-gutters align-items-center mb-3">
                            <div class="col mr-2">
                                <div class="text-xs font-weight-bold text-success text-uppercase mb-1">
                                    Premium Amount</div>
                                <div class="h5 mb-0 font-weight-bold text-gray-800">
                                    $<?= number_format($insuranceData['premium_amount'], 2) ?>
                                </div>
                            </div>
                            <div class="col-auto">
                                <i class="fas fa-dollar-sign fa-2x text-gray-300"></i>
                            </div>
                        </div>
                        
                        <div class="row no-gutters align-items-center mb-3">
                            <div class="col mr-2">
                                <div class="text-xs font-weight-bold text-info text-uppercase mb-1">
                                    Days Until Expiration</div>
                                <div class="h5 mb-0 font-weight-bold <?= $isExpiring ? 'text-warning' : ($isExpired ? 'text-danger' : 'text-gray-800') ?>">
                                    <?= $isExpired ? 'Expired' : $daysUntilExpiration . ' days' ?>
                                </div>
                            </div>
                            <div class="col-auto">
                                <i class="fas fa-calendar-alt fa-2x text-gray-300"></i>
                            </div>
                        </div>
                        
                        <?php
                        // Calculate annual cost
                        $annualCost = 0;
                        switch ($insuranceData['payment_frequency']) {
                            case 'Monthly':
                                $annualCost = $insuranceData['premium_amount'] * 12;
                                break;
                            case 'Quarterly':
                                $annualCost = $insuranceData['premium_amount'] * 4;
                                break;
                            case 'Semi-Annually':
                                $annualCost = $insuranceData['premium_amount'] * 2;
                                break;
                            case 'Annually':
                                $annualCost = $insuranceData['premium_amount'];
                                break;
                        }
                        ?>
                        <div class="row no-gutters align-items-center">
                            <div class="col mr-2">
                                <div class="text-xs font-weight-bold text-warning text-uppercase mb-1">
                                    Annual Cost</div>
                                <div class="h5 mb-0 font-weight-bold text-gray-800">
                                    $<?= number_format($annualCost, 2) ?>
                                </div>
                            </div>
                            <div class="col-auto">
                                <i class="fas fa-money-bill fa-2x text-gray-300"></i>
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
                                <a href="edit_insurance.php?id=<?= $id ?>" class="btn btn-primary btn-block mb-3">
                                    <i class="fas fa-edit me-2"></i>Edit Insurance
                                </a>
                                <a href="insurances.php?action=delete&id=<?= $id ?>" 
                                   class="btn btn-danger btn-block mb-3"
                                   onclick="return confirm('Are you sure you want to delete this insurance policy?')">
                                    <i class="fas fa-trash me-2"></i>Delete Insurance
                                </a>
                                <?php if (isset($propertyData['id'])): ?>
                                    <a href="view_property.php?id=<?= $propertyData['id'] ?>" class="btn btn-info btn-block">
                                        <i class="fas fa-home me-2"></i>View Property
                                    </a>
                                <?php endif; ?>
                                
                                <?php if ($isExpiring || $isExpired): ?>
                                    <a href="add_insurance.php" class="btn btn-warning btn-block mt-3">
                                        <i class="fas fa-plus me-2"></i>Add Renewal Policy
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
