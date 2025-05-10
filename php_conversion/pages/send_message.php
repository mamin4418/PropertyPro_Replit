
<?php
require_once '../includes/header.php';
require_once '../models/Communication.php';
require_once '../models/CommunicationTemplate.php';
require_once '../models/Tenant.php';
require_once '../models/User.php';

// Initialize models
$communicationModel = new Communication($mysqli);
$templateModel = new CommunicationTemplate($mysqli);
$tenantModel = new Tenant($mysqli);
$userModel = new User($mysqli);

// Get all communication templates for the dropdown
$templates = $templateModel->getAllTemplates();

// Get all tenants for recipient dropdown
$tenants = $tenantModel->getAllTenants();

// Get all users (staff) for recipient dropdown
$users = $userModel->getAllUsers();

// Process form submission
$success = '';
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Validate and sanitize inputs
    $type = isset($_POST['type']) ? $_POST['type'] : '';
    $recipient_type = isset($_POST['recipient_type']) ? $_POST['recipient_type'] : '';
    $recipient_id = isset($_POST['recipient_id']) ? intval($_POST['recipient_id']) : 0;
    $subject = isset($_POST['subject']) ? trim($_POST['subject']) : '';
    $message = isset($_POST['message']) ? trim($_POST['message']) : '';
    $template_id = isset($_POST['template_id']) ? intval($_POST['template_id']) : 0;
    
    // Validation
    if (empty($type)) {
        $error = "Please select a communication type";
    } elseif (empty($recipient_type)) {
        $error = "Please select a recipient type";
    } elseif ($recipient_id <= 0) {
        $error = "Please select a recipient";
    } elseif (empty($subject)) {
        $error = "Please enter a subject";
    } elseif (empty($message)) {
        $error = "Please enter a message";
    } else {
        // Send the communication
        $result = $communicationModel->sendCommunication($type, $recipient_type, $recipient_id, $subject, $message);
        
        if ($result) {
            $success = "Message sent successfully";
        } else {
            $error = "Failed to send message. Please try again.";
        }
    }
}

// If the template is selected, get the template content
if (isset($_GET['template_id']) && !empty($_GET['template_id'])) {
    $template_id = intval($_GET['template_id']);
    $template = $templateModel->getTemplateById($template_id);
    if ($template) {
        $subject = $template['subject'];
        $message = $template['content'];
    }
}
?>

<div class="container-fluid">
    <h1 class="h3 mb-4 text-gray-800">Send Message</h1>
    
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
        <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">Message Details</h6>
        </div>
        <div class="card-body">
            <form method="POST" action="">
                <div class="form-group row">
                    <div class="col-md-6">
                        <label for="type">Communication Type</label>
                        <select class="form-control" id="type" name="type" required>
                            <option value="">Select type</option>
                            <option value="email">Email</option>
                            <option value="sms">SMS</option>
                            <option value="notification">System Notification</option>
                        </select>
                    </div>
                    <div class="col-md-6">
                        <label for="template_id">Use Template (Optional)</label>
                        <select class="form-control" id="template_id" name="template_id">
                            <option value="">Select a template</option>
                            <?php foreach ($templates as $template): ?>
                                <option value="<?php echo $template['id']; ?>">
                                    <?php echo $template['name']; ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                </div>

                <div class="form-group row">
                    <div class="col-md-6">
                        <label for="recipient_type">Recipient Type</label>
                        <select class="form-control" id="recipient_type" name="recipient_type" required>
                            <option value="">Select recipient type</option>
                            <option value="tenant">Tenant</option>
                            <option value="user">Staff Member</option>
                        </select>
                    </div>
                    <div class="col-md-6">
                        <label for="recipient_id">Recipient</label>
                        <select class="form-control" id="recipient_id" name="recipient_id" required disabled>
                            <option value="">Select a recipient</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label for="subject">Subject</label>
                    <input type="text" class="form-control" id="subject" name="subject" 
                           value="<?php echo isset($subject) ? $subject : ''; ?>" required>
                </div>

                <div class="form-group">
                    <label for="message">Message</label>
                    <textarea class="form-control" id="message" name="message" rows="6" required><?php echo isset($message) ? $message : ''; ?></textarea>
                </div>

                <div class="form-group row">
                    <div class="col-md-6">
                        <button type="submit" class="btn btn-primary btn-block">
                            <i class="fas fa-paper-plane"></i> Send Message
                        </button>
                    </div>
                    <div class="col-md-6">
                        <a href="communications.php" class="btn btn-secondary btn-block">
                            <i class="fas fa-arrow-left"></i> Back to Communications
                        </a>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>

<script>
$(document).ready(function() {
    // Handle template selection
    $('#template_id').change(function() {
        const templateId = $(this).val();
        if (templateId) {
            window.location.href = 'send_message.php?template_id=' + templateId;
        }
    });
    
    // Handle recipient type change
    $('#recipient_type').change(function() {
        const recipientType = $(this).val();
        const recipientSelect = $('#recipient_id');
        
        recipientSelect.empty().append('<option value="">Select a recipient</option>');
        
        if (recipientType === 'tenant') {
            <?php foreach ($tenants as $tenant): ?>
                recipientSelect.append('<option value="<?php echo $tenant['id']; ?>"><?php echo htmlspecialchars($tenant['first_name'] . ' ' . $tenant['last_name']); ?></option>');
            <?php endforeach; ?>
        } else if (recipientType === 'user') {
            <?php foreach ($users as $user): ?>
                recipientSelect.append('<option value="<?php echo $user['id']; ?>"><?php echo htmlspecialchars($user['first_name'] . ' ' . $user['last_name']); ?></option>');
            <?php endforeach; ?>
        }
        
        recipientSelect.prop('disabled', !recipientType);
    });
});
</script>

<?php require_once '../includes/footer.php'; ?>
