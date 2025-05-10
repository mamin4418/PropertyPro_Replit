
<?php
require_once '../includes/header.php';
require_once '../models/Role.php';
require_once '../models/Permission.php';

// Initialize models
$roleModel = new Role($mysqli);
$permissionModel = new Permission($mysqli);

// Handle role deletion
if (isset($_GET['delete']) && is_numeric($_GET['delete'])) {
    $role_id = intval($_GET['delete']);
    $result = $roleModel->deleteRole($role_id);
    if ($result) {
        $message = "Role deleted successfully.";
    } else {
        $error = "Failed to delete role. It may be assigned to users.";
    }
}

// Get all roles with user counts
$roles = $roleModel->getAllRolesWithUserCount();
?>

<div class="container-fluid">
    <h1 class="h3 mb-4 text-gray-800">User Roles</h1>
    
    <?php if (isset($message)): ?>
        <div class="alert alert-success" role="alert">
            <?php echo $message; ?>
        </div>
    <?php endif; ?>
    
    <?php if (isset($error)): ?>
        <div class="alert alert-danger" role="alert">
            <?php echo $error; ?>
        </div>
    <?php endif; ?>
    
    <div class="card shadow mb-4">
        <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
            <h6 class="m-0 font-weight-bold text-primary">All Roles</h6>
            <button type="button" class="btn btn-primary btn-sm" data-toggle="modal" data-target="#addRoleModal">
                <i class="fas fa-plus"></i> Add Role
            </button>
        </div>
        <div class="card-body">
            <div class="table-responsive">
                <table class="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Role Name</th>
                            <th>Description</th>
                            <th>Users</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (empty($roles)): ?>
                            <tr>
                                <td colspan="5" class="text-center">No roles found</td>
                            </tr>
                        <?php else: ?>
                            <?php foreach ($roles as $role): ?>
                                <tr>
                                    <td><?php echo $role['id']; ?></td>
                                    <td><?php echo htmlspecialchars($role['name']); ?></td>
                                    <td><?php echo htmlspecialchars($role['description']); ?></td>
                                    <td><?php echo $role['user_count']; ?></td>
                                    <td>
                                        <a href="permissions.php?role_id=<?php echo $role['id']; ?>" class="btn btn-info btn-sm">
                                            <i class="fas fa-key"></i> Permissions
                                        </a>
                                        <button type="button" class="btn btn-primary btn-sm edit-role-btn" 
                                                data-id="<?php echo $role['id']; ?>"
                                                data-name="<?php echo htmlspecialchars($role['name']); ?>"
                                                data-description="<?php echo htmlspecialchars($role['description']); ?>"
                                                data-toggle="modal" data-target="#editRoleModal">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <?php if ($role['user_count'] == 0): ?>
                                            <a href="user_roles.php?delete=<?php echo $role['id']; ?>" 
                                               class="btn btn-danger btn-sm" 
                                               onclick="return confirm('Are you sure you want to delete this role?');">
                                                <i class="fas fa-trash"></i>
                                            </a>
                                        <?php endif; ?>
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

<!-- Add Role Modal -->
<div class="modal fade" id="addRoleModal" tabindex="-1" role="dialog" aria-labelledby="addRoleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="addRoleModalLabel">Add New Role</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <form id="addRoleForm" action="user_roles.php" method="POST">
                <div class="modal-body">
                    <div class="form-group">
                        <label for="role_name">Role Name <span class="text-danger">*</span></label>
                        <input type="text" class="form-control" id="role_name" name="role_name" required>
                    </div>
                    <div class="form-group">
                        <label for="role_description">Description</label>
                        <textarea class="form-control" id="role_description" name="role_description" rows="3"></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                    <button type="submit" name="add_role" class="btn btn-primary">Add Role</button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- Edit Role Modal -->
<div class="modal fade" id="editRoleModal" tabindex="-1" role="dialog" aria-labelledby="editRoleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="editRoleModalLabel">Edit Role</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <form id="editRoleForm" action="user_roles.php" method="POST">
                <div class="modal-body">
                    <input type="hidden" id="edit_role_id" name="role_id">
                    <div class="form-group">
                        <label for="edit_role_name">Role Name <span class="text-danger">*</span></label>
                        <input type="text" class="form-control" id="edit_role_name" name="role_name" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_role_description">Description</label>
                        <textarea class="form-control" id="edit_role_description" name="role_description" rows="3"></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                    <button type="submit" name="edit_role" class="btn btn-primary">Update Role</button>
                </div>
            </form>
        </div>
    </div>
</div>

<script>
    // Set up edit role modal data
    document.addEventListener('DOMContentLoaded', function() {
        const editButtons = document.querySelectorAll('.edit-role-btn');
        editButtons.forEach(button => {
            button.addEventListener('click', function() {
                const roleId = this.getAttribute('data-id');
                const roleName = this.getAttribute('data-name');
                const roleDescription = this.getAttribute('data-description');
                
                document.getElementById('edit_role_id').value = roleId;
                document.getElementById('edit_role_name').value = roleName;
                document.getElementById('edit_role_description').value = roleDescription;
            });
        });
    });
</script>

<?php
// Process add role form
if (isset($_POST['add_role'])) {
    $role_name = isset($_POST['role_name']) ? trim($_POST['role_name']) : '';
    $role_description = isset($_POST['role_description']) ? trim($_POST['role_description']) : '';
    
    if (empty($role_name)) {
        echo '<script>alert("Role name is required");</script>';
    } else {
        $result = $roleModel->createRole($role_name, $role_description);
        if ($result) {
            echo '<script>
                alert("Role created successfully");
                window.location.href = "user_roles.php";
            </script>';
        } else {
            echo '<script>alert("Failed to create role");</script>';
        }
    }
}

// Process edit role form
if (isset($_POST['edit_role'])) {
    $role_id = isset($_POST['role_id']) ? intval($_POST['role_id']) : 0;
    $role_name = isset($_POST['role_name']) ? trim($_POST['role_name']) : '';
    $role_description = isset($_POST['role_description']) ? trim($_POST['role_description']) : '';
    
    if (empty($role_name) || $role_id <= 0) {
        echo '<script>alert("Role name and ID are required");</script>';
    } else {
        $result = $roleModel->updateRole($role_id, $role_name, $role_description);
        if ($result) {
            echo '<script>
                alert("Role updated successfully");
                window.location.href = "user_roles.php";
            </script>';
        } else {
            echo '<script>alert("Failed to update role");</script>';
        }
    }
}
?>

<?php require_once '../includes/footer.php'; ?>
