<?php
require_once '../includes/header.php';
require_once '../models/Document.php';
require_once '../models/User.php';
require_once '../models/Tenant.php';

// Initialize models
$documentModel = new Document($mysqli);
$userModel = new User($mysqli);
$tenantModel = new Tenant($mysqli);

// Get document ID from URL
$document_id = isset($_GET['id']) ? intval($_GET['id']) : 0;

// Verify document exists
$document = $documentModel->getDocumentById($document_id);
if (!$document) {
    // Document not found, redirect
    header("Location: documents.php?error=Document not found");
    exit;
}

// Get possible signers (users and tenants)
$users = $userModel->getAllUsers();
$tenants = $tenantModel->getAllTenants();

// Process form submission
$success = '';
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $signer_type = $_POST['signer_type'] ?? '';
    $signer_id = intval($_POST['signer_id'] ?? 0);
    $email = $_POST['email'] ?? '';
    $sign_by_date = $_POST['sign_by_date'] ?? '';

    // Validate inputs
    if (empty($signer_type)) {
        $error = "Please select a signer type";
    } elseif ($signer_id <= 0) {
        $error = "Please select a signer";
    } elseif (empty($email)) {
        $error = "Email is required";
    } elseif (empty($sign_by_date)) {
        $error = "Sign by date is required";
    } else {
        // Create signing request
        $result = $documentModel->createSigningRequest(
            $document_id,
            $signer_type,
            $signer_id,
            $email,
            $sign_by_date
        );

        if ($result) {
            $success = "Signing request created successfully. An email has been sent to the signer.";
        } else {
            $error = "Failed to create signing request. Please try again.";
        }
    }
}

// Get current signing requests for this document
$signingRequests = $documentModel->getDocumentSigningRequests($document_id);
?>

<div class="container-fluid">
    <h1 class="h3 mb-4 text-gray-800">Document Signing</h1>

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
        <!-- Document Information -->
        <div class="col-md-4">
            <div class="card shadow mb-4">
                <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">Document Information</h6>
                </div>
                <div class="card-body">
                    <h5><?php echo htmlspecialchars($document['title']); ?></h5>
                    <p><strong>Type:</strong> <?php echo ucfirst(htmlspecialchars($document['document_type'])); ?></p>
                    <p><strong>Created:</strong> <?php echo date('M d, Y', strtotime($document['created_at'])); ?></p>
                    <p><strong>Status:</strong> 
                        <span class="badge <?php echo $document['is_signed'] ? 'badge-success' : 'badge-warning'; ?>">
                            <?php echo $document['is_signed'] ? 'Signed' : 'Awaiting Signatures'; ?>
                        </span>
                    </p>
                    <hr>
                    <div class="text-center">
                        <a href="view_document.php?id=<?php echo $document_id; ?>" class="btn btn-info btn-sm">
                            <i class="fas fa-eye"></i> View Document
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <!-- Add Signer Form -->
        <div class="col-md-8">
            <div class="card shadow mb-4">
                <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">Request Signature</h6>
                </div>
                <div class="card-body">
                    <form method="POST" action="">
                        <div class="form-group row">
                            <div class="col-md-6">
                                <label for="signer_type">Signer Type</label>
                                <select class="form-control" id="signer_type" name="signer_type" required>
                                    <option value="">Select Signer Type</option>
                                    <option value="user">Staff User</option>
                                    <option value="tenant">Tenant</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label for="signer_id">Select Signer</label>
                                <select class="form-control" id="signer_id" name="signer_id" required disabled>
                                    <option value="">Please select a signer type first</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-group row">
                            <div class="col-md-6">
                                <label for="email">Email</label>
                                <input type="email" class="form-control" id="email" name="email" required readonly>
                            </div>
                            <div class="col-md-6">
                                <label for="sign_by_date">Sign By Date</label>
                                <input type="date" class="form-control" id="sign_by_date" name="sign_by_date" 
                                       value="<?php echo date('Y-m-d', strtotime('+7 days')); ?>" required>
                            </div>
                        </div>

                        <div class="form-group">
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-paper-plane"></i> Send Signing Request
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Current Signing Requests -->
            <div class="card shadow mb-4">
                <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">Current Signing Requests</h6>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-bordered" width="100%" cellspacing="0">
                            <thead>
                                <tr>
                                    <th>Signer</th>
                                    <th>Email</th>
                                    <th>Requested On</th>
                                    <th>Sign By</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php if ($signingRequests): ?>
                                    <?php foreach ($signingRequests as $request): ?>
                                        <tr>
                                            <td><?php echo htmlspecialchars($request['signer_name']); ?></td>
                                            <td><?php echo htmlspecialchars($request['email']); ?></td>
                                            <td><?php echo date('M d, Y', strtotime($request['created_at'])); ?></td>
                                            <td><?php echo date('M d, Y', strtotime($request['sign_by_date'])); ?></td>
                                            <td>
                                                <?php if ($request['is_signed']): ?>
                                                    <span class="badge badge-success">Signed</span>
                                                <?php elseif (strtotime($request['sign_by_date']) < time()): ?>
                                                    <span class="badge badge-danger">Overdue</span>
                                                <?php else: ?>
                                                    <span class="badge badge-warning">Pending</span>
                                                <?php endif; ?>
                                            </td>
                                            <td>
                                                <?php if (!$request['is_signed']): ?>
                                                    <button class="btn btn-info btn-sm resend-btn" 
                                                            data-id="<?php echo $request['id']; ?>">
                                                        <i class="fas fa-paper-plane"></i> Resend
                                                    </button>
                                                    <button class="btn btn-danger btn-sm cancel-btn" 
                                                            data-id="<?php echo $request['id']; ?>">
                                                        <i class="fas fa-times"></i> Cancel
                                                    </button>
                                                <?php else: ?>
                                                    <button class="btn btn-secondary btn-sm" disabled>
                                                        <i class="fas fa-check"></i> Completed
                                                    </button>
                                                <?php endif; ?>
                                            </td>
                                        </tr>
                                    <?php endforeach; ?>
                                <?php else: ?>
                                    <tr>
                                        <td colspan="6" class="text-center">No signing requests found</td>
                                    </tr>
                                <?php endif; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    // Handle signer type change
    const signerType = document.getElementById('signer_type');
    const signerId = document.getElementById('signer_id');
    const emailInput = document.getElementById('email');

    // Store users and tenants for quick access
    const users = <?php echo json_encode($users); ?>;
    const tenants = <?php echo json_encode($tenants); ?>;

    signerType.addEventListener('change', function() {
        // Clear previous options
        signerId.innerHTML = '<option value="">Select Signer</option>';
        emailInput.value = '';

        const type = this.value;

        if (type === 'user') {
            // Populate with users
            users.forEach(user => {
                const option = document.createElement('option');
                option.value = user.id;
                option.textContent = user.first_name + ' ' + user.last_name;
                option.dataset.email = user.email;
                signerId.appendChild(option);
            });
            signerId.disabled = false;
        } else if (type === 'tenant') {
            // Populate with tenants
            tenants.forEach(tenant => {
                const option = document.createElement('option');
                option.value = tenant.id;
                option.textContent = tenant.first_name + ' ' + tenant.last_name;
                option.dataset.email = tenant.email;
                signerId.appendChild(option);
            });
            signerId.disabled = false;
        } else {
            signerId.disabled = true;
        }
    });

    // Handle signer selection to auto-fill email
    signerId.addEventListener('change', function() {
        const selectedOption = this.options[this.selectedIndex];
        if (selectedOption && selectedOption.dataset.email) {
            emailInput.value = selectedOption.dataset.email;
        } else {
            emailInput.value = '';
        }
    });

    // Handle resend button
    document.querySelectorAll('.resend-btn').forEach(button => {
        button.addEventListener('click', function() {
            const requestId = this.dataset.id;
            if (confirm('Are you sure you want to resend this signing request?')) {
                // Send AJAX request to resend
                alert('Signing request has been resent.');
            }
        });
    });

    // Handle cancel button
    document.querySelectorAll('.cancel-btn').forEach(button => {
        button.addEventListener('click', function() {
            const requestId = this.dataset.id;
            if (confirm('Are you sure you want to cancel this signing request?')) {
                // Send AJAX request to cancel
                alert('Signing request has been cancelled.');
            }
        });
    });
});
</script>

<?php require_once '../includes/footer.php'; ?>
