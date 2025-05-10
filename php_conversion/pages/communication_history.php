
<?php
require_once '../includes/header.php';
require_once '../models/Communication.php';

// Initialize model
$communicationModel = new Communication($mysqli);

// Get communication ID from URL
$communication_id = isset($_GET['id']) ? intval($_GET['id']) : 0;

// Verify communication exists
$communication = $communicationModel->getCommunicationById($communication_id);
if (!$communication) {
    // Communication not found, redirect to communications page
    header("Location: communications.php?error=Communication not found");
    exit;
}

// Get the detailed communication thread/history
$thread = $communicationModel->getCommunicationThread($communication_id);
?>

<div class="container-fluid">
    <h1 class="h3 mb-4 text-gray-800">Communication History</h1>
    
    <div class="card shadow mb-4">
        <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">
                <?php echo $communication['subject']; ?>
                <span class="float-right">
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
                </span>
            </h6>
        </div>
        <div class="card-body">
            <div class="row mb-3">
                <div class="col-md-6">
                    <p><strong>Recipient:</strong> <?php echo $communication['recipient_name']; ?></p>
                    <p><strong>Sent Date:</strong> <?php echo date('M d, Y h:i A', strtotime($communication['sent_date'])); ?></p>
                </div>
                <div class="col-md-6">
                    <p>
                        <strong>Status:</strong> 
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
                    </p>
                    <p><strong>Sender:</strong> <?php echo $communication['sender_name']; ?></p>
                </div>
            </div>
            
            <div class="card mb-4">
                <div class="card-header">
                    Original Message
                </div>
                <div class="card-body">
                    <p><?php echo nl2br($communication['message']); ?></p>
                </div>
            </div>
            
            <?php if (count($thread) > 0): ?>
                <h5>Communication Thread</h5>
                <div class="timeline">
                    <?php foreach ($thread as $message): ?>
                        <div class="card mb-3 <?php echo ($message['is_reply'] ? 'border-left-primary ml-4' : 'border-left-info'); ?>">
                            <div class="card-header bg-light">
                                <strong><?php echo ($message['is_reply'] ? $message['recipient_name'] . ' (Reply)' : $message['sender_name']); ?></strong>
                                <span class="float-right"><?php echo date('M d, Y h:i A', strtotime($message['sent_date'])); ?></span>
                            </div>
                            <div class="card-body">
                                <p><?php echo nl2br($message['message']); ?></p>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
            
            <div class="row mt-4">
                <div class="col-md-6">
                    <a href="send_message.php" class="btn btn-primary btn-block">
                        <i class="fas fa-reply"></i> Send New Message
                    </a>
                </div>
                <div class="col-md-6">
                    <a href="communications.php" class="btn btn-secondary btn-block">
                        <i class="fas fa-arrow-left"></i> Back to Communications
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>

<?php require_once '../includes/footer.php'; ?>
