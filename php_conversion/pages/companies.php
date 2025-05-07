
<?php
// Include header and sidebar
include_once '../includes/header.php';
include_once '../includes/sidebar.php';

// Include the Company model
require_once '../models/Company.php';

// Initialize Company object
$company = new Company();

// Delete company if requested
if (isset($_GET['delete']) && !empty($_GET['delete'])) {
    $company->id = $_GET['delete'];
    if ($company->delete()) {
        echo "<div class='alert alert-success'>Company deleted successfully.</div>";
    } else {
        echo "<div class='alert alert-danger'>Unable to delete company.</div>";
    }
}

// Get all companies
$result = $company->read();
$count = $result ? $result->num_rows : 0;
?>

<div class="content-wrapper">
    <div class="content-header">
        <div class="container-fluid">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h1 class="m-0">Companies</h1>
                </div>
                <div class="col-sm-6">
                    <ol class="breadcrumb float-sm-right">
                        <li class="breadcrumb-item"><a href="../index.php">Home</a></li>
                        <li class="breadcrumb-item active">Companies</li>
                    </ol>
                </div>
            </div>
        </div>
    </div>

    <div class="content">
        <div class="container-fluid">
            <div class="row mb-3">
                <div class="col-md-12">
                    <a href="add_company.php" class="btn btn-primary">
                        <i class="fas fa-plus"></i> Add New Company
                    </a>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Company List</h3>
                    <div class="card-tools">
                        <div class="input-group input-group-sm" style="width: 150px;">
                            <input type="text" name="table_search" class="form-control float-right" placeholder="Search">
                            <div class="input-group-append">
                                <button type="submit" class="btn btn-default">
                                    <i class="fas fa-search"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card-body table-responsive p-0">
                    <?php if ($count > 0) : ?>
                        <table class="table table-hover text-nowrap">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>City</th>
                                    <th>State</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php while ($row = $result->fetch_assoc()) : ?>
                                    <tr>
                                        <td><?= htmlspecialchars($row['name']) ?></td>
                                        <td><?= htmlspecialchars($row['email']) ?></td>
                                        <td><?= htmlspecialchars($row['phone']) ?></td>
                                        <td><?= htmlspecialchars($row['city']) ?></td>
                                        <td><?= htmlspecialchars($row['state']) ?></td>
                                        <td>
                                            <a href="view_company.php?id=<?= $row['id'] ?>" class="btn btn-info btn-sm">
                                                <i class="fas fa-eye"></i>
                                            </a>
                                            <a href="edit_company.php?id=<?= $row['id'] ?>" class="btn btn-warning btn-sm">
                                                <i class="fas fa-edit"></i>
                                            </a>
                                            <a href="companies.php?delete=<?= $row['id'] ?>" class="btn btn-danger btn-sm" onclick="return confirm('Are you sure you want to delete this company?')">
                                                <i class="fas fa-trash"></i>
                                            </a>
                                        </td>
                                    </tr>
                                <?php endwhile; ?>
                            </tbody>
                        </table>
                    <?php else : ?>
                        <div class="alert alert-info m-3">No companies found. <a href="add_company.php">Add a company</a>.</div>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </div>
</div>

<?php include_once '../includes/footer.php'; ?>
