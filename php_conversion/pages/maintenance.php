
<?php
require_once '../includes/header.php';
require_once '../models/Maintenance.php';

// Get maintenance requests
$maintenance = new Maintenance($mysqli);
$requests = $maintenance->getAllRequests();

// Get counts by status
$counts = $maintenance->getRequestCountsByStatus();

// Get success message if exists
$success = isset($_GET['success']) ? $_GET['success'] : '';
?>

<div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="h3 mb-0 text-gray-800">Maintenance Requests</h1>
        <a href="add_maintenance.php" class="btn btn-primary">
            <i class="fas fa-plus"></i> Add Request
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
    
    <!-- Stats Cards -->
    <div class="row mb-4">
        <div class="col-xl-3 col-md-6 mb-4">
            <div class="card border-left-primary shadow h-100 py-2">
                <div class="card-body">
                    <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                            <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                Open Requests</div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800"><?= $counts['open'] ?></div>
                        </div>
                        <div class="col-auto">
                            <i class="fas fa-clipboard-list fa-2x text-gray-300"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="col-xl-3 col-md-6 mb-4">
            <div class="card border-left-warning shadow h-100 py-2">
                <div class="card-body">
                    <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                            <div class="text-xs font-weight-bold text-warning text-uppercase mb-1">
                                In Progress</div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800"><?= $counts['in-progress'] ?></div>
                        </div>
                        <div class="col-auto">
                            <i class="fas fa-tools fa-2x text-gray-300"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="col-xl-3 col-md-6 mb-4">
            <div class="card border-left-success shadow h-100 py-2">
                <div class="card-body">
                    <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                            <div class="text-xs font-weight-bold text-success text-uppercase mb-1">
                                Completed</div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800"><?= $counts['completed'] ?></div>
                        </div>
                        <div class="col-auto">
                            <i class="fas fa-check-circle fa-2x text-gray-300"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="col-xl-3 col-md-6 mb-4">
            <div class="card border-left-info shadow h-100 py-2">
                <div class="card-body">
                    <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                            <div class="text-xs font-weight-bold text-info text-uppercase mb-1">
                                Total</div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800"><?= $counts['total'] ?></div>
                        </div>
                        <div class="col-auto">
                            <i class="fas fa-clipboard fa-2x text-gray-300"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Maintenance Requests Table -->
    <div class="card shadow mb-4">
        <div class="card-header py-3 d-flex justify-content-between align-items-center">
            <h6 class="m-0 font-weight-bold text-primary">Maintenance Requests</h6>
            <div class="d-flex">
                <select id="statusFilter" class="form-control form-control-sm mr-2">
                    <option value="">All Statuses</option>
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
                <select id="priorityFilter" class="form-control form-control-sm mr-2">
                    <option value="">All Priorities</option>
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                </select>
                <input type="text" id="searchMaintenance" class="form-control form-control-sm" placeholder="Search...">
            </div>
        </div>
        <div class="card-body">
            <div class="table-responsive">
                <table class="table table-bordered" id="maintenanceTable" width="100%" cellspacing="0">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Property</th>
                            <th>Unit</th>
                            <th>Title</th>
                            <th>Tenant</th>
                            <th>Priority</th>
                            <th>Status</th>
                            <th>Created</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (empty($requests)): ?>
                            <tr>
                                <td colspan="9" class="text-center">No maintenance requests found</td>
                            </tr>
                        <?php else: ?>
                            <?php foreach ($requests as $request): ?>
                                <tr data-status="<?= $request['status'] ?>" data-priority="<?= $request['priority'] ?>">
                                    <td><?= $request['id'] ?></td>
                                    <td><?= htmlspecialchars($request['property_name'] ?? 'N/A') ?></td>
                                    <td><?= htmlspecialchars($request['unit_number'] ?? 'N/A') ?></td>
                                    <td><?= htmlspecialchars($request['title']) ?></td>
                                    <td><?= htmlspecialchars($request['tenant_first_name'] . ' ' . $request['tenant_last_name']) ?></td>
                                    <td>
                                        <?php 
                                        $priorityClass = '';
                                        switch($request['priority']) {
                                            case 'urgent':
                                                $priorityClass = 'badge-danger';
                                                break;
                                            case 'high':
                                                $priorityClass = 'badge-warning';
                                                break;
                                            case 'medium':
                                                $priorityClass = 'badge-info';
                                                break;
                                            case 'low':
                                                $priorityClass = 'badge-primary';
                                                break;
                                            default:
                                                $priorityClass = 'badge-secondary';
                                        }
                                        ?>
                                        <span class="badge <?= $priorityClass ?>"><?= ucfirst(htmlspecialchars($request['priority'])) ?></span>
                                    </td>
                                    <td>
                                        <?php 
                                        $statusClass = '';
                                        switch($request['status']) {
                                            case 'open':
                                                $statusClass = 'badge-primary';
                                                break;
                                            case 'in-progress':
                                                $statusClass = 'badge-warning';
                                                break;
                                            case 'completed':
                                                $statusClass = 'badge-success';
                                                break;
                                            case 'cancelled':
                                                $statusClass = 'badge-secondary';
                                                break;
                                            default:
                                                $statusClass = 'badge-info';
                                        }
                                        ?>
                                        <span class="badge <?= $statusClass ?>"><?= ucfirst(str_replace('-', ' ', htmlspecialchars($request['status']))) ?></span>
                                    </td>
                                    <td><?= date("m/d/Y", strtotime($request['created_at'])) ?></td>
                                    <td>
                                        <a href="view_maintenance.php?id=<?= $request['id'] ?>" class="btn btn-sm btn-info">
                                            <i class="fas fa-eye"></i>
                                        </a>
                                        <a href="edit_maintenance.php?id=<?= $request['id'] ?>" class="btn btn-sm btn-primary">
                                            <i class="fas fa-edit"></i>
                                        </a>
                                        <button class="btn btn-sm btn-danger delete-maintenance" data-id="<?= $request['id'] ?>">
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
<div class="modal fade" id="deleteMaintenanceModal" tabindex="-1" role="dialog" aria-labelledby="deleteModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="deleteModalLabel">Confirm Delete</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                Are you sure you want to delete this maintenance request? This action cannot be undone.
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                <form id="deleteMaintenanceForm" method="POST" action="../api/delete_maintenance.php">
                    <input type="hidden" id="deleteMaintenanceId" name="maintenance_id">
                    <button type="submit" class="btn btn-danger">Delete</button>
                </form>
            </div>
        </div>
    </div>
</div>

<script>
    $(document).ready(function() {
        // Initialize DataTable
        var table = $('#maintenanceTable').DataTable({
            "order": [[7, "desc"]] // Sort by created date by default
        });
        
        // Status filter
        $('#statusFilter').change(function() {
            var status = $(this).val();
            
            if (status) {
                table.columns(6).search(status).draw();
            } else {
                table.columns(6).search('').draw();
            }
        });
        
        // Priority filter
        $('#priorityFilter').change(function() {
            var priority = $(this).val();
            
            if (priority) {
                table.columns(5).search(priority).draw();
            } else {
                table.columns(5).search('').draw();
            }
        });
        
        // Search functionality
        $("#searchMaintenance").on("keyup", function() {
            table.search(this.value).draw();
        });
        
        // Delete maintenance
        $('.delete-maintenance').click(function() {
            var maintenanceId = $(this).data('id');
            $('#deleteMaintenanceId').val(maintenanceId);
            $('#deleteMaintenanceModal').modal('show');
        });
        
        // Auto hide alerts after 5 seconds
        setTimeout(function() {
            $('.alert-success').fadeOut('slow');
        }, 5000);
    });
</script>

<?php require_once '../includes/footer.php'; ?>
