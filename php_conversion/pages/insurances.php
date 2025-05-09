
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

// Get all insurances
$insurances = $insurance->getAllInsurances();
$properties = $property->getAllProperties();

// Filter by property if set
$property_filter = isset($_GET['property_id']) ? intval($_GET['property_id']) : 0;
if ($property_filter > 0) {
    $insurances = $insurance->getInsurancesByProperty($property_filter);
}

// Handle delete action
if (isset($_GET['action']) && $_GET['action'] == 'delete' && isset($_GET['id'])) {
    $id = intval($_GET['id']);
    if ($insurance->deleteInsurance($id)) {
        echo "<script>alert('Insurance deleted successfully.');</script>";
        echo "<script>window.location.href = 'insurances.php';</script>";
    } else {
        echo "<script>alert('Error deleting insurance.');</script>";
    }
}

// Get expiring insurances
$expiringInsurances = $insurance->getExpiringInsurances(30);
?>

<div class="content-wrapper">
    <div class="container-fluid">
        <div class="row mb-4">
            <div class="col-md-6">
                <h1 class="h3 mb-0 text-gray-800">Insurance Policies</h1>
                <p class="mb-4">Manage property insurance policies</p>
            </div>
            <div class="col-md-6 text-md-end">
                <a href="add_insurance.php" class="btn btn-primary">
                    <i class="fas fa-plus me-2"></i>Add New Insurance
                </a>
            </div>
        </div>
        
        <!-- Expiring Insurances Alert -->
        <?php if (!empty($expiringInsurances)): ?>
            <div class="alert alert-warning" role="alert">
                <h4 class="alert-heading"><i class="fas fa-exclamation-triangle me-2"></i>Expiring Insurance Policies</h4>
                <p>The following insurance policies are expiring within the next 30 days:</p>
                <hr>
                <ul class="mb-0">
                    <?php foreach ($expiringInsurances as $exp): ?>
                        <li>
                            <strong><?= htmlspecialchars($exp['provider']) ?></strong> for 
                            <strong><?= htmlspecialchars($exp['property_name']) ?></strong> - 
                            Expires on <?= date('M d, Y', strtotime($exp['expiration_date'])) ?>
                            <a href="view_insurance.php?id=<?= $exp['id'] ?>" class="ms-2 text-dark">View</a>
                        </li>
                    <?php endforeach; ?>
                </ul>
            </div>
        <?php endif; ?>
        
        <!-- Filter -->
        <div class="card mb-4">
            <div class="card-header bg-light">
                <h6 class="m-0 font-weight-bold">Filter Insurance Policies</h6>
            </div>
            <div class="card-body">
                <form method="get" action="insurances.php" class="row g-3 align-items-center">
                    <div class="col-md-4">
                        <label for="property_id" class="form-label">Property</label>
                        <select name="property_id" id="property_id" class="form-select">
                            <option value="0">All Properties</option>
                            <?php foreach ($properties as $p): ?>
                                <option value="<?= $p['id'] ?>" <?= $property_filter == $p['id'] ? 'selected' : '' ?>>
                                    <?= htmlspecialchars($p['name']) ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="col-md-4 d-flex align-items-end">
                        <button type="submit" class="btn btn-primary">Apply Filter</button>
                        <?php if ($property_filter > 0): ?>
                            <a href="insurances.php" class="btn btn-outline-secondary ms-2">Clear</a>
                        <?php endif; ?>
                    </div>
                </form>
            </div>
        </div>
        
        <!-- Insurance List -->
        <div class="card shadow mb-4">
            <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                <h6 class="m-0 font-weight-bold text-primary">Insurance Policy List</h6>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                        <thead>
                            <tr>
                                <th>Property</th>
                                <th>Provider</th>
                                <th>Policy Number</th>
                                <th>Coverage Type</th>
                                <th>Premium</th>
                                <th>Expiration Date</th>
                                <th>Coverage Amount</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (empty($insurances)): ?>
                                <tr>
                                    <td colspan="8" class="text-center">No insurance policies found</td>
                                </tr>
                            <?php else: ?>
                                <?php foreach ($insurances as $i): ?>
                                    <tr>
                                        <td><?= htmlspecialchars($i['property_name']) ?></td>
                                        <td><?= htmlspecialchars($i['provider']) ?></td>
                                        <td><?= htmlspecialchars($i['policy_number']) ?></td>
                                        <td><?= htmlspecialchars($i['coverage_type']) ?></td>
                                        <td>$<?= number_format($i['premium_amount'], 2) ?> 
                                            (<?= htmlspecialchars($i['payment_frequency']) ?>)</td>
                                        <td <?= strtotime($i['expiration_date']) < strtotime('+30 days') ? 'class="text-danger"' : '' ?>>
                                            <?= date('M d, Y', strtotime($i['expiration_date'])) ?>
                                        </td>
                                        <td>$<?= number_format($i['coverage_amount'], 2) ?></td>
                                        <td>
                                            <a href="view_insurance.php?id=<?= $i['id'] ?>" class="btn btn-info btn-sm">
                                                <i class="fas fa-eye"></i>
                                            </a>
                                            <a href="edit_insurance.php?id=<?= $i['id'] ?>" class="btn btn-primary btn-sm">
                                                <i class="fas fa-edit"></i>
                                            </a>
                                            <a href="insurances.php?action=delete&id=<?= $i['id'] ?>" 
                                               class="btn btn-danger btn-sm"
                                               onclick="return confirm('Are you sure you want to delete this insurance policy?')">
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
</div>

<script>
    $(document).ready(function() {
        $('#dataTable').DataTable();
    });
</script>

<?php
require_once 'includes/footer.php';
$db->close();
?>
