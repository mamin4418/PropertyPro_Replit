
<?php
require_once '../includes/header.php';
require_once '../models/Tenant.php';

// Get all tenants
$tenant = new Tenant($mysqli);
$tenants = $tenant->getAllTenants();
?>

<div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="h3 mb-0 text-gray-800">Tenants</h1>
        <a href="add_tenant.php" class="btn btn-primary">
            <i class="fas fa-plus"></i> Add Tenant
        </a>
    </div>

    <div class="card shadow mb-4">
        <div class="card-header py-3 d-flex justify-content-between align-items-center">
            <h6 class="m-0 font-weight-bold text-primary">Tenant Management</h6>
            <div>
                <input type="text" id="searchTenant" class="form-control form-control-sm" placeholder="Search...">
            </div>
        </div>
        <div class="card-body">
            <div class="table-responsive">
                <table class="table table-bordered" id="tenantsTable" width="100%" cellspacing="0">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Property</th>
                            <th>Unit</th>
                            <th>Status</th>
                            <th>Lease End</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (empty($tenants)): ?>
                            <tr>
                                <td colspan="8" class="text-center">No tenants found</td>
                            </tr>
                        <?php else: ?>
                            <?php foreach ($tenants as $tenant): ?>
                                <tr>
                                    <td><?= htmlspecialchars($tenant['first_name'] . ' ' . $tenant['last_name']) ?></td>
                                    <td><?= htmlspecialchars($tenant['email']) ?></td>
                                    <td><?= htmlspecialchars($tenant['phone']) ?></td>
                                    <td><?= htmlspecialchars($tenant['property_name'] ?? 'N/A') ?></td>
                                    <td><?= htmlspecialchars($tenant['unit_number'] ?? 'N/A') ?></td>
                                    <td>
                                        <?php 
                                        $statusClass = '';
                                        switch($tenant['status']) {
                                            case 'active':
                                                $statusClass = 'badge-success';
                                                break;
                                            case 'pending':
                                                $statusClass = 'badge-warning';
                                                break;
                                            case 'inactive':
                                                $statusClass = 'badge-danger';
                                                break;
                                            default:
                                                $statusClass = 'badge-secondary';
                                        }
                                        ?>
                                        <span class="badge <?= $statusClass ?>"><?= ucfirst(htmlspecialchars($tenant['status'])) ?></span>
                                    </td>
                                    <td><?= isset($tenant['lease_end']) ? date("m/d/Y", strtotime($tenant['lease_end'])) : 'N/A' ?></td>
                                    <td>
                                        <a href="view_tenant.php?id=<?= $tenant['id'] ?>" class="btn btn-sm btn-info">
                                            <i class="fas fa-eye"></i>
                                        </a>
                                        <a href="edit_tenant.php?id=<?= $tenant['id'] ?>" class="btn btn-sm btn-primary">
                                            <i class="fas fa-edit"></i>
                                        </a>
                                        <button class="btn btn-sm btn-danger delete-tenant" data-id="<?= $tenant['id'] ?>">
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
<div class="modal fade" id="deleteTenantModal" tabindex="-1" role="dialog" aria-labelledby="deleteModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="deleteModalLabel">Confirm Delete</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                Are you sure you want to delete this tenant? This action cannot be undone.
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                <form id="deleteTenantForm" method="POST" action="../api/delete_tenant.php">
                    <input type="hidden" id="deleteTenantId" name="tenant_id">
                    <button type="submit" class="btn btn-danger">Delete</button>
                </form>
            </div>
        </div>
    </div>
</div>

<script>
    $(document).ready(function() {
        // Initialize DataTable
        $('#tenantsTable').DataTable();
        
        // Search functionality
        $("#searchTenant").on("keyup", function() {
            var value = $(this).val().toLowerCase();
            $("#tenantsTable tbody tr").filter(function() {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            });
        });
        
        // Delete tenant
        $('.delete-tenant').click(function() {
            var tenantId = $(this).data('id');
            $('#deleteTenantId').val(tenantId);
            $('#deleteTenantModal').modal('show');
        });
    });
</script>

<?php require_once '../includes/footer.php'; ?>
