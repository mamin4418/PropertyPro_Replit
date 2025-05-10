
<?php
require_once '../includes/header.php';
require_once '../models/Notification.php';

// Initialize model
$notificationModel = new Notification($mysqli);

// Get current user ID from session
$user_id = $_SESSION['user_id'] ?? 0;

// Process form submission for marking notifications as read
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['action']) && $_POST['action'] === 'mark_read' && isset($_POST['notification_id'])) {
        $notification_id = intval($_POST['notification_id']);
        $notificationModel->markAsRead($notification_id);
    } else if (isset($_POST['action']) && $_POST['action'] === 'mark_all_read') {
        $notificationModel->markAllAsRead($user_id);
    }
}

// Get notifications for current user
$notifications = $notificationModel->getNotificationsForUser($user_id);

// Get unread count
$unread_count = $notificationModel->getUnreadCount($user_id);
?>

<div class="container-fluid">
    <h1 class="h3 mb-4 text-gray-800">Notifications</h1>
    
    <div class="card shadow mb-4">
        <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
            <h6 class="m-0 font-weight-bold text-primary">Your Notifications</h6>
            <?php if ($unread_count > 0): ?>
                <form method="POST" action="">
                    <input type="hidden" name="action" value="mark_all_read">
                    <button type="submit" class="btn btn-primary btn-sm">
                        <i class="fas fa-check-double"></i> Mark All as Read
                    </button>
                </form>
            <?php endif; ?>
        </div>
        <div class="card-body">
            <?php if (count($notifications) > 0): ?>
                <div class="list-group">
                    <?php foreach ($notifications as $notification): ?>
                        <div class="list-group-item list-group-item-action <?php echo $notification['is_read'] ? '' : 'list-group-item-light'; ?>">
                            <div class="d-flex w-100 justify-content-between">
                                <h5 class="mb-1">
                                    <?php if (!$notification['is_read']): ?>
                                        <span class="badge badge-primary">New</span>
                                    <?php endif; ?>
                                    <?php echo $notification['title']; ?>
                                </h5>
                                <small><?php echo date('M d, Y h:i A', strtotime($notification['created_at'])); ?></small>
                            </div>
                            <p class="mb-1"><?php echo $notification['message']; ?></p>
                            <div class="d-flex justify-content-between align-items-center mt-2">
                                <?php if (!empty($notification['link'])): ?>
                                    <a href="<?php echo $notification['link']; ?>" class="btn btn-info btn-sm">
                                        <i class="fas fa-eye"></i> View
                                    </a>
                                <?php else: ?>
                                    <span></span>
                                <?php endif; ?>
                                
                                <?php if (!$notification['is_read']): ?>
                                    <form method="POST" action="">
                                        <input type="hidden" name="action" value="mark_read">
                                        <input type="hidden" name="notification_id" value="<?php echo $notification['id']; ?>">
                                        <button type="submit" class="btn btn-secondary btn-sm">
                                            <i class="fas fa-check"></i> Mark as Read
                                        </button>
                                    </form>
                                <?php endif; ?>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php else: ?>
                <div class="text-center py-4">
                    <i class="fas fa-bell-slash fa-3x text-muted mb-3"></i>
                    <p>You don't have any notifications.</p>
                </div>
            <?php endif; ?>
        </div>
    </div>
</div>

<script>
$(document).ready(function() {
    // Auto-update notification status
    $('.notification-link').on('click', function() {
        const notificationId = $(this).data('notification-id');
        $.post('notifications.php', {
            action: 'mark_read',
            notification_id: notificationId
        });
    });
});
</script>

<?php require_once '../includes/footer.php'; ?>
