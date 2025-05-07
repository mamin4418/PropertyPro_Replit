
<?php
// Include header and sidebar
include_once '../includes/header.php';
include_once '../includes/sidebar.php';

// Include the Vendor model
require_once '../models/Vendor.php';

// Initialize Vendor object
$vendor = new Vendor();

// Delete vendor if requested
if (isset($_GET['delete']) && !empty($_GET['delete'])) {
    $vendor->id = $_GET['delete'];
    if ($vendor->delete()) {
        echo "<div class='alert alert-success'>Vendor deleted successfully.</div>";
    } else {
        echo "<div class='alert alert-danger'>Unable to delete vendor.</div>";
    }
}

// Get all vendors
$result = $vendor->read();
$count = $result ? $result->num_rows : 0;
?>

<div class="content-wrapper">
    <div class="content-header">
        <div class="container-fluid">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h1 class="m-0">Vendors</h1>
                </div>
                <div class="col-sm-6">
                    <ol class="breadcrumb float-sm-right">
                        <li class="breadcrumb-item"><a href="../index.php">Home</a></li>
                        <li class="breadcrumb-item active">Vendors</li>
                    </ol>
                </div>
            </div>
        </div>
    </div>

    <div class="content">
        <div class="container-fluid">
            <div class="row mb-3">
                <div class="col-md-12">
                    <a href="add_vendor.php" class="btn btn-primary">
                        <i class="fas fa-plus"></i> Add New Vendor
                    </a>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Vendor List</h3>
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
                                    <th>Vendor Name</th>
                                    <th>Contact Person</th>
                                    <th>Service Type</th>
                                    <th>Phone</th>
                                    <th>Email</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php while ($row = $result->fetch_assoc()) : ?>
                                    <tr>
                                        <td><?= htmlspecialchars($row['name']) ?></td>
                                        <td><?= htmlspecialchars($row['contact_name']) ?></td>
                                        <td><?= htmlspecialchars($row['service_type']) ?></td>
                                        <td><?= htmlspecialchars($row['phone']) ?></td>
                                        <td><?= htmlspecialchars($row['email']) ?></td>
                                        <td>
                                            <a href="view_vendor.php?id=<?= $row['id'] ?>" class="btn btn-info btn-sm">
                                                <i class="fas fa-eye"></i>
                                            </a>
                                            <a href="edit_vendor.php?id=<?= $row['id'] ?>" class="btn btn-warning btn-sm">
                                                <i class="fas fa-edit"></i>
                                            </a>
                                            <a href="vendors.php?delete=<?= $row['id'] ?>" class="btn btn-danger btn-sm" onclick="return confirm('Are you sure you want to delete this vendor?')">
                                                <i class="fas fa-trash"></i>
                                            </a>
                                        </td>
                                    </tr>
                                <?php endwhile; ?>
                            </tbody>
                        </table>
                    <?php else : ?>
                        <div class="alert alert-info m-3">No vendors found. <a href="add_vendor.php">Add a vendor</a>.</div>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </div>
</div>

<?php include_once '../includes/footer.php'; ?>
