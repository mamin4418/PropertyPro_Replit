
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

// Get all mortgages
$mortgages = $mortgage->getAllMortgages();
$properties = $property->getAllProperties();

// Filter by property if set
$property_filter = isset($_GET['property_id']) ? intval($_GET['property_id']) : 0;
if ($property_filter > 0) {
    $mortgages = $mortgage->getMortgagesByProperty($property_filter);
}

// Handle delete action
if (isset($_GET['action']) && $_GET['action'] == 'delete' && isset($_GET['id'])) {
    $id = intval($_GET['id']);
    if ($mortgage->deleteMortgage($id)) {
        echo "<script>alert('Mortgage deleted successfully.');</script>";
        echo "<script>window.location.href = 'mortgages.php';</script>";
    } else {
        echo "<script>alert('Error deleting mortgage.');</script>";
    }
}

// Get mortgage summary
$summary = $mortgage->getMortgageSummary();
?>

<div class="content-wrapper">
    <div class="container-fluid">
        <div class="row mb-4">
            <div class="col-md-6">
                <h1 class="h3 mb-0 text-gray-800">Mortgages</h1>
                <p class="mb-4">Manage property mortgages and financing</p>
            </div>
            <div class="col-md-6 text-md-end">
                <a href="add_mortgage.php" class="btn btn-primary">
                    <i class="fas fa-plus me-2"></i>Add New Mortgage
                </a>
            </div>
        </div>
        
        <!-- Mortgage Summary Cards -->
        <div class="row mb-4">
            <div class="col-md-4">
                <div class="card border-left-primary shadow h-100 py-2">
                    <div class="card-body">
                        <div class="row no-gutters align-items-center">
                            <div class="col mr-2">
                                <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                    Total Mortgage Debt</div>
                                <div class="h5 mb-0 font-weight-bold text-gray-800">
                                    $<?= number_format($summary['total_debt'] ?? 0, 2) ?>
                                </div>
                            </div>
                            <div class="col-auto">
                                <i class="fas fa-dollar-sign fa-2x text-gray-300"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-md-4">
                <div class="card border-left-success shadow h-100 py-2">
                    <div class="card-body">
                        <div class="row no-gutters align-items-center">
                            <div class="col mr-2">
                                <div class="text-xs font-weight-bold text-success text-uppercase mb-1">
                                    Average Interest Rate</div>
                                <div class="h5 mb-0 font-weight-bold text-gray-800">
                                    <?= number_format($summary['avg_interest_rate'] ?? 0, 2) ?>%
                                </div>
                            </div>
                            <div class="col-auto">
                                <i class="fas fa-percentage fa-2x text-gray-300"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-md-4">
                <div class="card border-left-info shadow h-100 py-2">
                    <div class="card-body">
                        <div class="row no-gutters align-items-center">
                            <div class="col mr-2">
                                <div class="text-xs font-weight-bold text-info text-uppercase mb-1">
                                    Total Mortgages</div>
                                <div class="h5 mb-0 font-weight-bold text-gray-800">
                                    <?= $summary['total_mortgages'] ?? 0 ?>
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
        
        <!-- Filter -->
        <div class="card mb-4">
            <div class="card-header bg-light">
                <h6 class="m-0 font-weight-bold">Filter Mortgages</h6>
            </div>
            <div class="card-body">
                <form method="get" action="mortgages.php" class="row g-3 align-items-center">
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
                            <a href="mortgages.php" class="btn btn-outline-secondary ms-2">Clear</a>
                        <?php endif; ?>
                    </div>
                </form>
            </div>
        </div>
        
        <!-- Mortgages List -->
        <div class="card shadow mb-4">
            <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                <h6 class="m-0 font-weight-bold text-primary">Mortgage List</h6>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                        <thead>
                            <tr>
                                <th>Property</th>
                                <th>Lender</th>
                                <th>Loan Amount</th>
                                <th>Interest Rate</th>
                                <th>Term</th>
                                <th>Payment</th>
                                <th>Start Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (empty($mortgages)): ?>
                                <tr>
                                    <td colspan="8" class="text-center">No mortgages found</td>
                                </tr>
                            <?php else: ?>
                                <?php foreach ($mortgages as $m): ?>
                                    <tr>
                                        <td><?= htmlspecialchars($m['property_name']) ?></td>
                                        <td><?= htmlspecialchars($m['lender']) ?></td>
                                        <td>$<?= number_format($m['loan_amount'], 2) ?></td>
                                        <td><?= number_format($m['interest_rate'], 2) ?>%</td>
                                        <td><?= htmlspecialchars($m['term_years']) ?> years</td>
                                        <td>$<?= number_format($m['payment_amount'], 2) ?> 
                                            (<?= htmlspecialchars($m['payment_frequency']) ?>)</td>
                                        <td><?= date('M d, Y', strtotime($m['start_date'])) ?></td>
                                        <td>
                                            <a href="view_mortgage.php?id=<?= $m['id'] ?>" class="btn btn-info btn-sm">
                                                <i class="fas fa-eye"></i>
                                            </a>
                                            <a href="edit_mortgage.php?id=<?= $m['id'] ?>" class="btn btn-primary btn-sm">
                                                <i class="fas fa-edit"></i>
                                            </a>
                                            <a href="mortgages.php?action=delete&id=<?= $m['id'] ?>" 
                                               class="btn btn-danger btn-sm"
                                               onclick="return confirm('Are you sure you want to delete this mortgage?')">
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
