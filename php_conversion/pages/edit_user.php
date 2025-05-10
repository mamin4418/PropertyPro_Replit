
<?php
require_once '../includes/header.php';
require_once '../models/User.php';
require_once '../models/Role.php';

// Initialize classes
$userModel = new User($mysqli);
$roleModel = new Role($mysqli);

// Get user ID from URL
$user_id = isset($_GET['id']) ? intval($_GET['id']) : 0;

// Verify user exists
$user = $userModel->getUserById($user_id);
if (!$user) {
    // User not found, redirect to users page
    header("Location: users.php?error=User not found");
    exit;
}

// Get all roles for dropdown
$roles = $roleModel->getAllRoles();

// Process form submission
$success = '';
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Validate and sanitize inputs
    $username = isset($_POST['username']) ? trim($_POST['username']) : '';
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $first_name = isset($_POST['first_name']) ? trim($_POST['first_name']) : '';
    $last_name = isset($_POST['last_name']) ? trim($_POST['last_name']) : '';
    $role_id = isset($_POST['role_id']) ? intval($_POST['role_id']) : 0;
    $status = isset($_POST['status']) ? trim($_POST['status']) : 'active';
    $password = isset($_POST['password']) ? $_POST['password'] : '';
    $confirm_password = isset($_POST['confirm_password']) ? $_POST['confirm_password'] : '';

    // Validate required fields
    if (empty($username) || empty($email) || empty($first_name) || empty($last_name) || $role_id <= 0) {
        $error = "Please fill out all required fields";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = "Please enter a valid email address";
    } elseif (!empty($password) && $password !== $confirm_password) {
        $error = "Passwords do not match";
    } else {
        // Check if username or email already exists for another user
        $existingUser = $userModel->getUserByUsername($username);
        if ($existingUser && $existingUser['id'] != $user_id) {
            $error = "Username already exists";
        } else {
            $existingEmail = $userModel->getUserByEmail($email);
            if ($existingEmail && $existingEmail['id'] != $user_id) {
                $error = "Email already exists";
            } else {
                // Update user
                $userData = [
                    'username' => $username,
                    'email' => $email,
                    'first_name' => $first_name,
                    'last_name' => $last_name,
                    'role_id' => $role_id,
                    'status' => $status
                ];

                // Only include password if it's being changed
                if (!empty($password)) {
                    $userData['password'] = $password;
                }

                $result = $userModel->updateUser($user_id, $userData);

                if ($result) {
                    $success = "User updated successfully";
                    // Refresh user data
                    $user = $userModel->getUserById($user_id);
                } else {
                    $error = "Failed to update user. Please try again.";
                }
            }
        }
    }
}
?>

<div class="container-fluid">
    <h1 class="h3 mb-4 text-gray-800">Edit User</h1>

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
                    <h6 class="m-0 font-weight-bold text-primary">User Information</h6>
                </div>
                <div class="card-body">
                    <form method="POST" action="">
                        <div class="form-group row">
                            <div class="col-md-6">
                                <label for="username">Username <span class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="username" name="username" value="<?php echo $user['username']; ?>" required>
                            </div>
                            <div class="col-md-6">
                                <label for="email">Email <span class="text-danger">*</span></label>
                                <input type="email" class="form-control" id="email" name="email" value="<?php echo $user['email']; ?>" required>
                            </div>
                        </div>

                        <div class="form-group row">
                            <div class="col-md-6">
                                <label for="first_name">First Name <span class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="first_name" name="first_name" value="<?php echo $user['first_name']; ?>" required>
                            </div>
                            <div class="col-md-6">
                                <label for="last_name">Last Name <span class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="last_name" name="last_name" value="<?php echo $user['last_name']; ?>" required>
                            </div>
                        </div>

                        <div class="form-group row">
                            <div class="col-md-6">
                                <label for="role_id">Role <span class="text-danger">*</span></label>
                                <select class="form-control" id="role_id" name="role_id" required>
                                    <option value="">Select a role</option>
                                    <?php foreach ($roles as $role): ?>
                                        <option value="<?php echo $role['id']; ?>" <?php echo ($role['id'] == $user['role_id']) ? 'selected' : ''; ?>>
                                            <?php echo $role['name']; ?>
                                        </option>
                                    <?php endforeach; ?>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label for="status">Status</label>
                                <select class="form-control" id="status" name="status">
                                    <option value="active" <?php echo ($user['status'] == 'active') ? 'selected' : ''; ?>>Active</option>
                                    <option value="inactive" <?php echo ($user['status'] == 'inactive') ? 'selected' : ''; ?>>Inactive</option>
                                    <option value="locked" <?php echo ($user['status'] == 'locked') ? 'selected' : ''; ?>>Locked</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-group row">
                            <div class="col-md-6">
                                <label for="password">Password <small class="text-muted">(Leave blank to keep current password)</small></label>
                                <input type="password" class="form-control" id="password" name="password">
                            </div>
                            <div class="col-md-6">
                                <label for="confirm_password">Confirm Password</label>
                                <input type="password" class="form-control" id="confirm_password" name="confirm_password">
                            </div>
                        </div>

                        <div class="form-group row">
                            <div class="col-md-12">
                                <label>User Information</label>
                                <div class="table-responsive">
                                    <table class="table table-bordered">
                                        <tbody>
                                            <tr>
                                                <th style="width: 30%;">Last Login</th>
                                                <td><?php echo !empty($user['last_login']) ? date('Y-m-d H:i:s', strtotime($user['last_login'])) : 'Never'; ?></td>
                                            </tr>
                                            <tr>
                                                <th>Created At</th>
                                                <td><?php echo date('Y-m-d H:i:s', strtotime($user['created_at'])); ?></td>
                                            </tr>
                                            <tr>
                                                <th>Updated At</th>
                                                <td><?php echo date('Y-m-d H:i:s', strtotime($user['updated_at'])); ?></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div class="form-group row">
                            <div class="col-md-6">
                                <button type="submit" class="btn btn-primary btn-block">
                                    <i class="fas fa-save"></i> Update User
                                </button>
                            </div>
                            <div class="col-md-6">
                                <a href="users.php" class="btn btn-secondary btn-block">
                                    <i class="fas fa-arrow-left"></i> Back to Users
                                </a>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    // Form validation
    const form = document.querySelector('form');
    form.addEventListener('submit', function(event) {
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm_password').value;
        
        // Check if passwords match when a new password is being set
        if (password !== '' && password !== confirmPassword) {
            event.preventDefault();
            alert('Passwords do not match');
        }
    });
});
</script>

<?php require_once '../includes/footer.php'; ?>
