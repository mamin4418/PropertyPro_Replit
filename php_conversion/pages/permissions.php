
<?php
require_once '../includes/header.php';
require_once '../models/Permission.php';
require_once '../models/Role.php';

// Initialize models
$permissionModel = new Permission($mysqli);
$roleModel = new Role($mysqli);

// Get all roles and permissions
$roles = $roleModel->getAllRoles();
$permissions = $permissionModel->getAllPermissions();

// Process form submission
$success = '';
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['update_permissions'])) {
        // Handle role permissions update
        $role_id = isset($_POST['role_id']) ? intval($_POST['role_id']) : 0;
        $permission_ids = isset($_POST['permissions']) ? $_POST['permissions'] : [];
        
        if ($role_id > 0) {
            $result = $roleModel->updateRolePermissions($role_id, $permission_ids);
            
            if ($result) {
                $success = "Role permissions updated successfully";
            } else {
                $error = "Failed to update role permissions. Please try again.";
            }
        } else {
            $error = "Please select a valid role";
        }
    } elseif (isset($_POST['add_permission'])) {
        // Handle adding a new permission
        $name = isset($_POST['permission_name']) ? trim($_POST['permission_name']) : '';
        $description = isset($_POST['permission_description']) ? trim($_POST['permission_description']) : '';
        $resource = isset($_POST['resource']) ? trim($_POST['resource']) : '';
        $action = isset($_POST['action']) ? trim($_POST['action']) : '';
        
        if (empty($name) || empty($resource) || empty($action)) {
            $error = "Permission name, resource, and action are required";
        } else {
            $result = $permissionModel->addPermission([
                'name' => $name,
                'description' => $description,
                'resource' => $resource,
                'action' => $action
            ]);
            
            if ($result) {
                $success = "Permission added successfully";
                // Refresh permissions list
                $permissions = $permissionModel->getAllPermissions();
            } else {
                $error = "Failed to add permission. Please try again.";
            }
        }
    } elseif (isset($_POST['edit_permission'])) {
        // Handle editing an existing permission
        $permission_id = isset($_POST['permission_id']) ? intval($_POST['permission_id']) : 0;
        $name = isset($_POST['permission_name']) ? trim($_POST['permission_name']) : '';
        $description = isset($_POST['permission_description']) ? trim($_POST['permission_description']) : '';
        $resource = isset($_POST['resource']) ? trim($_POST['resource']) : '';
        $action = isset($_POST['action']) ? trim($_POST['action']) : '';
        
        if ($permission_id <= 0 || empty($name) || empty($resource) || empty($action)) {
            $error = "Permission ID, name, resource, and action are required";
        } else {
            $result = $permissionModel->updatePermission($permission_id, [
                'name' => $name,
                'description' => $description,
                'resource' => $resource,
                'action' => $action
            ]);
            
            if ($result) {
                $success = "Permission updated successfully";
                // Refresh permissions list
                $permissions = $permissionModel->getAllPermissions();
            } else {
                $error = "Failed to update permission. Please try again.";
            }
        }
    } elseif (isset($_POST['delete_permission'])) {
        // Handle deleting a permission
        $permission_id = isset($_POST['permission_id']) ? intval($_POST['permission_id']) : 0;
        
        if ($permission_id <= 0) {
            $error = "Invalid permission ID";
        } else {
            $result = $permissionModel->deletePermission($permission_id);
            
            if ($result) {
                $success = "Permission deleted successfully";
                // Refresh permissions list
                $permissions = $permissionModel->getAllPermissions();
            } else {
                $error = "Failed to delete permission. Please try again.";
            }
        }
    }
}

// Get permissions for a specific role if requested
$selected_role_id = isset($_GET['role_id']) ? intval($_GET['role_id']) : (isset($_POST['role_id']) ? intval($_POST['role_id']) : 0);
$role_permissions = [];

if ($selected_role_id > 0) {
    $role_permissions = $roleModel->getRolePermissions($selected_role_id);
}
?>

<div class="container-fluid">
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 class="h3 mb-0 text-gray-800">Permissions Management</h1>
    </div>

    <?php if (!empty($success)): ?>
        <div class="alert alert-success" role="alert">
            <?php echo $success; ?>
        </div>
    <?php endif; ?>

    <?php if (!empty($error)): ?>
        <div class="alert alert-danger" role="alert">
            <?php echo $error; ?>
        </div>
    <?php endif; ?>

    <div class="row">
        <div class="col-lg-12">
            <div class="card shadow mb-4">
                <div class="card-header py-3">
                    <ul class="nav nav-tabs card-header-tabs" id="permissionTabs" role="tablist">
                        <li class="nav-item">
                            <a class="nav-link active" id="role-permissions-tab" data-toggle="tab" href="#role-permissions" role="tab" aria-controls="role-permissions" aria-selected="true">Role Permissions</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" id="manage-permissions-tab" data-toggle="tab" href="#manage-permissions" role="tab" aria-controls="manage-permissions" aria-selected="false">Manage Permissions</a>
                        </li>
                    </ul>
                </div>
                <div class="card-body">
                    <div class="tab-content" id="permissionTabContent">
                        <!-- Role Permissions Tab -->
                        <div class="tab-pane fade show active" id="role-permissions" role="tabpanel" aria-labelledby="role-permissions-tab">
                            <form method="POST" action="">
                                <div class="form-group">
                                    <label for="role_id"><strong>Select Role</strong></label>
                                    <select class="form-control" id="role_id" name="role_id" onchange="this.form.submit()">
                                        <option value="">-- Select a role --</option>
                                        <?php foreach ($roles as $role): ?>
                                            <option value="<?php echo $role['id']; ?>" <?php echo ($selected_role_id == $role['id']) ? 'selected' : ''; ?>>
                                                <?php echo $role['name']; ?>
                                            </option>
                                        <?php endforeach; ?>
                                    </select>
                                </div>
                            </form>

                            <?php if ($selected_role_id > 0): ?>
                                <form method="POST" action="">
                                    <input type="hidden" name="role_id" value="<?php echo $selected_role_id; ?>">
                                    
                                    <div class="form-group">
                                        <label><strong>Assign Permissions</strong></label>
                                        <div class="table-responsive">
                                            <table class="table table-bordered permission-table">
                                                <thead>
                                                    <tr>
                                                        <th style="width: 10%;">Select</th>
                                                        <th style="width: 20%;">Permission</th>
                                                        <th style="width: 25%;">Resource</th>
                                                        <th style="width: 15%;">Action</th>
                                                        <th>Description</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <?php foreach ($permissions as $permission): ?>
                                                        <tr>
                                                            <td class="text-center">
                                                                <div class="custom-control custom-checkbox">
                                                                    <input type="checkbox" class="custom-control-input" id="permission_<?php echo $permission['id']; ?>" name="permissions[]" value="<?php echo $permission['id']; ?>" <?php echo (in_array($permission['id'], array_column($role_permissions, 'permission_id'))) ? 'checked' : ''; ?>>
                                                                    <label class="custom-control-label" for="permission_<?php echo $permission['id']; ?>"></label>
                                                                </div>
                                                            </td>
                                                            <td><?php echo $permission['name']; ?></td>
                                                            <td><?php echo $permission['resource']; ?></td>
                                                            <td><?php echo $permission['action']; ?></td>
                                                            <td><?php echo $permission['description']; ?></td>
                                                        </tr>
                                                    <?php endforeach; ?>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div class="form-group">
                                        <button type="submit" name="update_permissions" class="btn btn-primary">
                                            <i class="fas fa-save"></i> Update Role Permissions
                                        </button>
                                    </div>
                                </form>
                            <?php elseif (count($roles) > 0): ?>
                                <div class="alert alert-info">
                                    Please select a role to manage its permissions.
                                </div>
                            <?php else: ?>
                                <div class="alert alert-warning">
                                    No roles found. Please create roles first.
                                </div>
                            <?php endif; ?>
                        </div>

                        <!-- Manage Permissions Tab -->
                        <div class="tab-pane fade" id="manage-permissions" role="tabpanel" aria-labelledby="manage-permissions-tab">
                            <div class="d-flex justify-content-end mb-3">
                                <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#addPermissionModal">
                                    <i class="fas fa-plus"></i> Add New Permission
                                </button>
                            </div>

                            <div class="table-responsive">
                                <table class="table table-bordered" id="permissionsTable" width="100%" cellspacing="0">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Name</th>
                                            <th>Resource</th>
                                            <th>Action</th>
                                            <th>Description</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <?php foreach ($permissions as $permission): ?>
                                            <tr>
                                                <td><?php echo $permission['id']; ?></td>
                                                <td><?php echo $permission['name']; ?></td>
                                                <td><?php echo $permission['resource']; ?></td>
                                                <td><?php echo $permission['action']; ?></td>
                                                <td><?php echo $permission['description']; ?></td>
                                                <td>
                                                    <button type="button" class="btn btn-sm btn-info edit-permission" data-toggle="modal" data-target="#editPermissionModal" 
                                                        data-id="<?php echo $permission['id']; ?>" 
                                                        data-name="<?php echo $permission['name']; ?>" 
                                                        data-description="<?php echo $permission['description']; ?>" 
                                                        data-resource="<?php echo $permission['resource']; ?>" 
                                                        data-action="<?php echo $permission['action']; ?>">
                                                        <i class="fas fa-edit"></i>
                                                    </button>
                                                    <button type="button" class="btn btn-sm btn-danger delete-permission" data-toggle="modal" data-target="#deletePermissionModal" data-id="<?php echo $permission['id']; ?>" data-name="<?php echo $permission['name']; ?>">
                                                        <i class="fas fa-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        <?php endforeach; ?>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Add Permission Modal -->
<div class="modal fade" id="addPermissionModal" tabindex="-1" role="dialog" aria-labelledby="addPermissionModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="addPermissionModalLabel">Add New Permission</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <form method="POST" action="">
                <div class="modal-body">
                    <div class="form-group">
                        <label for="permission_name">Permission Name <span class="text-danger">*</span></label>
                        <input type="text" class="form-control" id="permission_name" name="permission_name" required>
                    </div>
                    <div class="form-group">
                        <label for="resource">Resource <span class="text-danger">*</span></label>
                        <select class="form-control" id="resource" name="resource" required>
                            <option value="">-- Select Resource --</option>
                            <option value="property">Property</option>
                            <option value="tenant">Tenant</option>
                            <option value="lease">Lease</option>
                            <option value="payment">Payment</option>
                            <option value="maintenance">Maintenance</option>
                            <option value="report">Report</option>
                            <option value="user">User</option>
                            <option value="role">Role</option>
                            <option value="setting">Setting</option>
                            <option value="document">Document</option>
                            <option value="all">All Resources</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="action">Action <span class="text-danger">*</span></label>
                        <select class="form-control" id="action" name="action" required>
                            <option value="">-- Select Action --</option>
                            <option value="create">Create</option>
                            <option value="read">Read</option>
                            <option value="update">Update</option>
                            <option value="delete">Delete</option>
                            <option value="view_all">View All</option>
                            <option value="manage">Manage</option>
                            <option value="admin">Administration</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="permission_description">Description</label>
                        <textarea class="form-control" id="permission_description" name="permission_description" rows="3"></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                    <button type="submit" name="add_permission" class="btn btn-primary">Add Permission</button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- Edit Permission Modal -->
<div class="modal fade" id="editPermissionModal" tabindex="-1" role="dialog" aria-labelledby="editPermissionModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="editPermissionModalLabel">Edit Permission</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <form method="POST" action="">
                <div class="modal-body">
                    <input type="hidden" id="edit_permission_id" name="permission_id">
                    <div class="form-group">
                        <label for="edit_permission_name">Permission Name <span class="text-danger">*</span></label>
                        <input type="text" class="form-control" id="edit_permission_name" name="permission_name" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_resource">Resource <span class="text-danger">*</span></label>
                        <select class="form-control" id="edit_resource" name="resource" required>
                            <option value="">-- Select Resource --</option>
                            <option value="property">Property</option>
                            <option value="tenant">Tenant</option>
                            <option value="lease">Lease</option>
                            <option value="payment">Payment</option>
                            <option value="maintenance">Maintenance</option>
                            <option value="report">Report</option>
                            <option value="user">User</option>
                            <option value="role">Role</option>
                            <option value="setting">Setting</option>
                            <option value="document">Document</option>
                            <option value="all">All Resources</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="edit_action">Action <span class="text-danger">*</span></label>
                        <select class="form-control" id="edit_action" name="action" required>
                            <option value="">-- Select Action --</option>
                            <option value="create">Create</option>
                            <option value="read">Read</option>
                            <option value="update">Update</option>
                            <option value="delete">Delete</option>
                            <option value="view_all">View All</option>
                            <option value="manage">Manage</option>
                            <option value="admin">Administration</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="edit_permission_description">Description</label>
                        <textarea class="form-control" id="edit_permission_description" name="permission_description" rows="3"></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                    <button type="submit" name="edit_permission" class="btn btn-primary">Update Permission</button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- Delete Permission Modal -->
<div class="modal fade" id="deletePermissionModal" tabindex="-1" role="dialog" aria-labelledby="deletePermissionModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="deletePermissionModalLabel">Confirm Delete</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <form method="POST" action="">
                <div class="modal-body">
                    <input type="hidden" id="delete_permission_id" name="permission_id">
                    <p>Are you sure you want to delete the permission: <strong><span id="delete_permission_name"></span></strong>?</p>
                    <p class="text-danger">This action cannot be undone and may affect users with roles using this permission.</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                    <button type="submit" name="delete_permission" class="btn btn-danger">Delete Permission</button>
                </div>
            </form>
        </div>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    // Initialize DataTable
    $('#permissionsTable').DataTable({
        order: [[0, 'asc']],
        columnDefs: [
            { orderable: false, targets: 5 }
        ]
    });

    // Handle edit permission button click
    $('.edit-permission').on('click', function() {
        var id = $(this).data('id');
        var name = $(this).data('name');
        var description = $(this).data('description');
        var resource = $(this).data('resource');
        var action = $(this).data('action');

        $('#edit_permission_id').val(id);
        $('#edit_permission_name').val(name);
        $('#edit_permission_description').val(description);
        $('#edit_resource').val(resource);
        $('#edit_action').val(action);
    });

    // Handle delete permission button click
    $('.delete-permission').on('click', function() {
        var id = $(this).data('id');
        var name = $(this).data('name');

        $('#delete_permission_id').val(id);
        $('#delete_permission_name').text(name);
    });
});
</script>

<?php require_once '../includes/footer.php'; ?>
