
<?php
// Include header and sidebar
include_once '../includes/header.php';
include_once '../includes/sidebar.php';

// Include the Vendor model
require_once '../models/Vendor.php';

// Check if ID is provided
if (!isset($_GET['id']) || empty($_GET['id'])) {
    header("Location: vendors.php");
    exit;
}

// Initialize Vendor object
$vendor = new Vendor();
$vendor->id = $_GET['id'];

// Get vendor details
if (!$vendor->read_single()) {
    header("Location: vendors.php");
    exit;
}
?>

<div class="content-wrapper">
    <div class="content-header">
        <div class="container-fluid">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h1 class="m-0">Vendor Details</h1>
                </div>
                <div class="col-sm-6">
                    <ol class="breadcrumb float-sm-right">
                        <li class="breadcrumb-item"><a href="../index.php">Home</a></li>
                        <li class="breadcrumb-item"><a href="vendors.php">Vendors</a></li>
                        <li class="breadcrumb-item active">View Vendor</li>
                    </ol>
                </div>
            </div>
        </div>
    </div>

    <div class="content">
        <div class="container-fluid">
            <div class="row mb-3">
                <div class="col-md-12">
                    <a href="vendors.php" class="btn btn-default">
                        <i class="fas fa-arrow-left"></i> Back to Vendors
                    </a>
                    <a href="edit_vendor.php?id=<?= $vendor->id ?>" class="btn btn-primary">
                        <i class="fas fa-edit"></i> Edit Vendor
                    </a>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3 class="card-title"><?= htmlspecialchars($vendor->name) ?></h3>
                    <div class="card-tools">
                        <span class="badge badge-primary"><?= htmlspecialchars($vendor->service_type) ?></span>
                    </div>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="info-box">
                                <span class="info-box-icon bg-info"><i class="fas fa-user"></i></span>
                                <div class="info-box-content">
                                    <span class="info-box-text">Contact Information</span>
                                    <span class="info-box-number"><?= htmlspecialchars($vendor->contact_name) ?></span>
                                    <span class="info-box-text"><?= htmlspecialchars($vendor->phone) ?></span>
                                    <span class="info-box-text"><?= htmlspecialchars($vendor->email) ?></span>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="info-box">
                                <span class="info-box-icon bg-success"><i class="fas fa-map-marker-alt"></i></span>
                                <div class="info-box-content">
                                    <span class="info-box-text">Address</span>
                                    <span class="info-box-number"><?= htmlspecialchars($vendor->address) ?></span>
                                    <span class="info-box-text">
                                        <?= htmlspecialchars($vendor->city) ?>, 
                                        <?= htmlspecialchars($vendor->state) ?> 
                                        <?= htmlspecialchars($vendor->zip) ?>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Notes</h3>
                        </div>
                        <div class="card-body">
                            <?= nl2br(htmlspecialchars($vendor->notes)) ?>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Recent Maintenance Requests</h3>
                        </div>
                        <div class="card-body">
                            <p class="text-muted">Feature coming soon.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<?php include_once '../includes/footer.php'; ?>
