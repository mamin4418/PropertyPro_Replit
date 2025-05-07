
<?php
require_once '../includes/header.php';
require_once '../models/Lease.php';

// Get all leases
$lease = new Lease($mysqli);
$leases = $lease->getAllLeases();

// Get upcoming renewals
$upcomingRenewals = $lease->getUpcomingRenewals(30);

// Get success message if exists
$success = isset($_GET['success']) ? $_GET['success'] : '';
?>

<div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="h3 mb-0 text-gray-800">Leases</h1>
        <a href="add_lease.php" class="btn btn-primary">
            <i class="fas fa-plus"></i> Add Lease
        </a>
    </div>
    
    <?php if (!empty($success)): ?>
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            <?= htmlspecialchars($success) ?>
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
    <?php endif; ?>
    
    <!-- Upcoming Renewals Card -->
    <?php if (!empty($upcomingRenewals)): ?>
    <div class="card shadow mb-4">
        <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-warning">Upcoming Renewals (Next 30 Days)</h6>
        </div>
        <div class="card-body">
            <div class="table-responsive">
                <table class="table table-bordered" width="100%" cellspacing="0">
                    <thead>
                        <tr>
                            <th>Property</th>
                            <th>Unit</th>
                            <th>Tenant</th>
                            <th>End Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($upcomingRenewals as $renewal): ?>
                            <tr>
                                <td><?= htmlspecialchars($renewal['property_name']) ?></td>
                                <td><?= htmlspecialchars($renewal['unit_number']) ?></td>
                                <td><?= htmlspecialchars($renewal['first_name'] . ' ' . $renewal['last_name']) ?></td>
                                <td><?= date("m/d/Y", strtotime($renewal['end_date'])) ?></td>
                                <td><span class="badge badge-warning">Renewal Needed</span></td>
                                <td>
                                    <a href="view_lease.php?id=<?= $renewal['id'] ?>" class="btn btn-sm btn-info">
                                        <i class="fas fa-eye"></i>
                                    </a>
                                    <a href="renew_lease.php?id=<?= $renewal['id'] ?>" class="btn btn-sm btn-success">
                                        <i class="fas fa-sync-alt"></i> Renew
                                    </a>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <?php endif; ?>
    
    <!-- All Leases Card -->
    <div class="card shadow mb-4">
        <div class="card-header py-3 d-flex justify-content-between align-items-center">
            <h6 class="m-0 font-weight-bold text-primary">Lease Management</h6>
            <div>
                <input type="text" id="searchLease" class="form-control form-control-sm" placeholder="Search...">
            </div>
        </div>
        <div class="card-body">
            <div class="table-responsive">
                <table class="table table-bordered" id="leasesTable" width="100%" cellspacing="0">
                    <thead>
                        <tr>
                            <th>Property</th>
                            <th>Unit</th>
                            <th>Tenant</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Rent</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (empty($leases)): ?>
                            <tr>
                                <td colspan="8" class="text-center">No leases found</td>
                            </tr>
                        <?php else: ?>
                            <?php foreach ($leases as $lease): ?>
                                <tr>
                                    <td><?= htmlspecialchars($lease['property_name']) ?></td>
                                    <td><?= htmlspecialchars($lease['unit_number']) ?></td>
                                    <td><?= htmlspecialchars($lease['first_name'] . ' ' . $lease['last_name']) ?></td>
                                    <td><?= date("m/d/Y", strtotime($lease['start_date'])) ?></td>
                                    <td><?= date("m/d/Y", strtotime($lease['end_date'])) ?></td>
                                    <td>$<?= number_format($lease['rent_amount'], 2) ?></td>
                                    <td>
                                        <?php 
                                        $statusClass = '';
                                        switch($lease['status']) {
                                            case 'active':
                                                $statusClass = 'badge-success';
                                                break;
                                            case 'pending':
                                                $statusClass = 'badge-warning';
                                                break;
                                            case 'expired':
                                                $statusClass = 'badge-danger';
                                                break;
                                            case 'terminated':
                                                $statusClass = 'badge-dark';
                                                break;
                                            default:
                                                $statusClass = 'badge-secondary';
                                        }
                                        ?>
                                        <span class="badge <?= $statusClass ?>"><?= ucfirst(htmlspecialchars($lease['status'])) ?></span>
                                    </td>
                                    <td>
                                        <a href="view_lease.php?id=<?= $lease['id'] ?>" class="btn btn-sm btn-info">
                                            <i class="fas fa-eye"></i>
                                        </a>
                                        <a href="edit_lease.php?id=<?= $lease['id'] ?>" class="btn btn-sm btn-primary">
                                            <i class="fas fa-edit"></i>
                                        </a>
                                        <button class="btn btn-sm btn-danger delete-lease" data-id="<?= $lease['id'] ?>">
                                            <i class="fas fa-trash"></i>
                                        </button>
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

<!-- Delete Confirmation Modal -->
<div class="modal fade" id="deleteLeaseModal" tabindex="-1" role="dialog" aria-labelledby="deleteModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="deleteModalLabel">Confirm Delete</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                Are you sure you want to delete this lease? This action cannot be undone.
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                <form id="deleteLeaseForm" method="POST" action="../api/delete_lease.php">
                    <input type="hidden" id="deleteLeaseId" name="lease_id">
                    <button type="submit" class="btn btn-danger">Delete</button>
                </form>
            </div>
        </div>
    </div>
</div>

<script>
    $(document).ready(function() {
        // Initialize DataTable
        $('#leasesTable').DataTable();
        
        // Search functionality
        $("#searchLease").on("keyup", function() {
            var value = $(this).val().toLowerCase();
            $("#leasesTable tbody tr").filter(function() {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            });
        });
        
        // Delete lease
        $('.delete-lease').click(function() {
            var leaseId = $(this).data('id');
            $('#deleteLeaseId').val(leaseId);
            $('#deleteLeaseModal').modal('show');
        });
        
        // Auto hide alerts after 5 seconds
        setTimeout(function() {
            $('.alert-success').fadeOut('slow');
        }, 5000);
    });
</script>

<?php require_once '../includes/footer.php'; ?>
