
<?php
// Include header and sidebar
include_once '../includes/header.php';
include_once '../includes/sidebar.php';

// Include the Company model
require_once '../models/Company.php';

// Check if ID is provided
if (!isset($_GET['id']) || empty($_GET['id'])) {
    header("Location: companies.php");
    exit;
}

// Initialize Company object
$company = new Company();
$company->id = $_GET['id'];

// Get company details
if (!$company->read_single()) {
    header("Location: companies.php");
    exit;
}
?>

<div class="content-wrapper">
    <div class="content-header">
        <div class="container-fluid">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h1 class="m-0">Company Details</h1>
                </div>
                <div class="col-sm-6">
                    <ol class="breadcrumb float-sm-right">
                        <li class="breadcrumb-item"><a href="../index.php">Home</a></li>
                        <li class="breadcrumb-item"><a href="companies.php">Companies</a></li>
                        <li class="breadcrumb-item active">View Company</li>
                    </ol>
                </div>
            </div>
        </div>
    </div>

    <div class="content">
        <div class="container-fluid">
            <div class="row mb-3">
                <div class="col-md-12">
                    <a href="companies.php" class="btn btn-default">
                        <i class="fas fa-arrow-left"></i> Back to Companies
                    </a>
                    <a href="edit_company.php?id=<?= $company->id ?>" class="btn btn-primary">
                        <i class="fas fa-edit"></i> Edit Company
                    </a>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3 class="card-title"><?= htmlspecialchars($company->name) ?></h3>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="info-box">
                                <span class="info-box-icon bg-info"><i class="fas fa-building"></i></span>
                                <div class="info-box-content">
                                    <span class="info-box-text">Contact Information</span>
                                    <span class="info-box-number"><?= htmlspecialchars($company->phone) ?></span>
                                    <span class="info-box-text"><?= htmlspecialchars($company->email) ?></span>
                                    <span class="info-box-text"><?= htmlspecialchars($company->website) ?></span>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="info-box">
                                <span class="info-box-icon bg-success"><i class="fas fa-map-marker-alt"></i></span>
                                <div class="info-box-content">
                                    <span class="info-box-text">Address</span>
                                    <span class="info-box-number"><?= htmlspecialchars($company->address) ?></span>
                                    <span class="info-box-text">
                                        <?= htmlspecialchars($company->city) ?>, 
                                        <?= htmlspecialchars($company->state) ?> 
                                        <?= htmlspecialchars($company->zip) ?>
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
                            <?= nl2br(htmlspecialchars($company->notes)) ?>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Associated Properties</h3>
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
