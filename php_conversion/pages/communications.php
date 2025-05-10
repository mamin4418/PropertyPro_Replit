
<?php
require_once '../includes/header.php';
require_once '../models/Communication.php';
require_once '../models/User.php';

// Initialize models
$communicationModel = new Communication($mysqli);
$userModel = new User($mysqli);

// Get communications
$communications = $communicationModel->getAllCommunications();

// Get success message if exists
$success = isset($_GET['success']) ? $_GET['success'] : '';
$error = isset($_GET['error']) ? $_GET['error'] : '';
?>

<div class="container-fluid">
    <h1 class="h3 mb-4 text-gray-800">Communications</h1>
    
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

    <div class="card shadow mb-4">
        <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
            <h6 class="m-0 font-weight-bold text-primary">Communication History</h6>
            <div>
                <a href="send_message.php" class="btn btn-primary btn-sm">
                    <i class="fas fa-envelope"></i> Send New Message
                </a>
                <a href="communication_templates.php" class="btn btn-info btn-sm ml-2">
                    <i class="fas fa-file-alt"></i> Templates
                </a>
            </div>
        </div>
        <div class="card-body">
            <div class="table-responsive">
                <table class="table table-bordered" id="communicationsTable" width="100%" cellspacing="0">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Type</th>
                            <th>Recipient</th>
                            <th>Subject</th>
                            <th>Date Sent</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (count($communications) > 0): ?>
                            <?php foreach ($communications as $communication): ?>
                                <tr>
                                    <td><?php echo $communication['id']; ?></td>
                                    <td>
                                        <?php 
                                        $type = $communication['type'];
                                        $badge_class = 'badge-primary';
                                        switch($type) {
                                            case 'email':
                                                $badge_class = 'badge-info';
                                                break;
                                            case 'sms':
                                                $badge_class = 'badge-success';
                                                break;
                                            case 'notification':
                                                $badge_class = 'badge-warning';
                                                break;
                                        }
                                        ?>
                                        <span class="badge <?php echo $badge_class; ?>"><?php echo ucfirst($type); ?></span>
                                    </td>
                                    <td><?php echo $communication['recipient_name']; ?></td>
                                    <td><?php echo $communication['subject']; ?></td>
                                    <td><?php echo date('M d, Y h:i A', strtotime($communication['sent_date'])); ?></td>
                                    <td>
                                        <?php if ($communication['status'] == 'sent'): ?>
                                            <span class="badge badge-success">Sent</span>
                                        <?php elseif ($communication['status'] == 'delivered'): ?>
                                            <span class="badge badge-info">Delivered</span>
                                        <?php elseif ($communication['status'] == 'read'): ?>
                                            <span class="badge badge-primary">Read</span>
                                        <?php elseif ($communication['status'] == 'failed'): ?>
                                            <span class="badge badge-danger">Failed</span>
                                        <?php else: ?>
                                            <span class="badge badge-secondary">Pending</span>
                                        <?php endif; ?>
                                    </td>
                                    <td>
                                        <a href="communication_history.php?id=<?php echo $communication['id']; ?>" class="btn btn-info btn-sm">
                                            <i class="fas fa-eye"></i> View
                                        </a>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        <?php else: ?>
                            <tr>
                                <td colspan="7" class="text-center">No communications found</td>
                            </tr>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<script>
$(document).ready(function() {
    $('#communicationsTable').DataTable({
        order: [[4, 'desc']]
    });
});
</script>

<?php require_once '../includes/footer.php'; ?>
