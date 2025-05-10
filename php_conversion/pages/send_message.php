
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
<?php
require_once '../includes/header.php';
require_once '../models/Communication.php';
require_once '../models/CommunicationTemplate.php';
require_once '../models/Tenant.php';
require_once '../models/Property.php';

// Initialize models
$communicationModel = new Communication($mysqli);
$templateModel = new CommunicationTemplate($mysqli);
$tenantModel = new Tenant($mysqli);
$propertyModel = new Property($mysqli);

// Get all templates for dropdown
$templates = $templateModel->getAllTemplates();

// Get all tenants for recipient selection
$tenants = $tenantModel->getAllTenants();

// Get all properties for property-wide communication
$properties = $propertyModel->getAllProperties();

// Check if template_id was provided
$selected_template = null;
if (isset($_GET['template_id']) && !empty($_GET['template_id'])) {
    $template_id = intval($_GET['template_id']);
    $selected_template = $templateModel->getTemplateById($template_id);
}

// Check if resending a previous communication
$resend_communication = null;
if (isset($_GET['resend']) && !empty($_GET['resend'])) {
    $resend_id = intval($_GET['resend']);
    $resend_communication = $communicationModel->getCommunicationById($resend_id);
}

// Process form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $errors = [];
    
    // Validate input
    if (empty($_POST['type'])) {
        $errors[] = "Communication type is required";
    }
    
    if (empty($_POST['recipient_type'])) {
        $errors[] = "Recipient type is required";
    }
    
    if ($_POST['recipient_type'] === 'tenant' && (empty($_POST['tenant_ids']) || !is_array($_POST['tenant_ids']) || count($_POST['tenant_ids']) === 0)) {
        $errors[] = "Please select at least one tenant";
    }
    
    if ($_POST['recipient_type'] === 'property' && empty($_POST['property_id'])) {
        $errors[] = "Please select a property";
    }
    
    if (($_POST['type'] === 'email' || $_POST['type'] === 'letter') && empty($_POST['subject'])) {
        $errors[] = "Subject is required for email and letter communications";
    }
    
    if (empty($_POST['content'])) {
        $errors[] = "Message content is required";
    }
    
    // If no errors, send the communication
    if (empty($errors)) {
        try {
            $success_count = 0;
            $fail_count = 0;
            
            if ($_POST['recipient_type'] === 'tenant') {
                // Send to selected tenants
                foreach ($_POST['tenant_ids'] as $tenant_id) {
                    $tenant = $tenantModel->getTenantById($tenant_id);
                    if ($tenant) {
                        // Replace variables in content
                        $content = $_POST['content'];
                        $subject = isset($_POST['subject']) ? $_POST['subject'] : '';
                        
                        // Replace tenant variables
                        $content = str_replace('{{tenant.first_name}}', $tenant['first_name'], $content);
                        $content = str_replace('{{tenant.last_name}}', $tenant['last_name'], $content);
                        $content = str_replace('{{tenant.email}}', $tenant['email'], $content);
                        $content = str_replace('{{tenant.phone}}', $tenant['phone'], $content);
                        
                        // Replace subject variables too
                        $subject = str_replace('{{tenant.first_name}}', $tenant['first_name'], $subject);
                        $subject = str_replace('{{tenant.last_name}}', $tenant['last_name'], $subject);
                        
                        // Get property and unit info for this tenant if available
                        if ($tenant['unit_id']) {
                            $unitModel = new Unit($mysqli);
                            $unit = $unitModel->getUnitById($tenant['unit_id']);
                            if ($unit && $unit['property_id']) {
                                $property = $propertyModel->getPropertyById($unit['property_id']);
                                if ($property) {
                                    // Replace property variables
                                    $content = str_replace('{{property.name}}', $property['name'], $content);
                                    $content = str_replace('{{property.address}}', $property['address'], $content);
                                    $subject = str_replace('{{property.name}}', $property['name'], $subject);
                                    
                                    // Replace unit variables
                                    $content = str_replace('{{unit.number}}', $unit['unit_number'], $content);
                                    $subject = str_replace('{{unit.number}}', $unit['unit_number'], $subject);
                                }
                            }
                        }
                        
                        // Create communication record
                        $comm_data = [
                            'type' => $_POST['type'],
                            'recipient_type' => 'tenant',
                            'recipient_id' => $tenant_id,
                            'recipient_name' => $tenant['first_name'] . ' ' . $tenant['last_name'],
                            'recipient_contact' => $_POST['type'] === 'email' ? $tenant['email'] : $tenant['phone'],
                            'subject' => $subject,
                            'content' => $content,
                            'status' => 'sent', // In a real app, this would be set after actual sending
                            'sent_at' => date('Y-m-d H:i:s'),
                            'created_at' => date('Y-m-d H:i:s'),
                            'updated_at' => date('Y-m-d H:i:s')
                        ];
                        
                        // Handle actual sending based on type (integration with email/SMS services would go here)
                        $send_success = true; // Assume success for demo
                        
                        if ($send_success) {
                            // Save communication record
                            $result = $communicationModel->createCommunication($comm_data);
                            if ($result) {
                                $success_count++;
                            } else {
                                $fail_count++;
                            }
                        } else {
                            $fail_count++;
                        }
                    }
                }
            } elseif ($_POST['recipient_type'] === 'property') {
                // Get all tenants for the selected property
                $property_id = intval($_POST['property_id']);
                $property = $propertyModel->getPropertyById($property_id);
                $property_tenants = $tenantModel->getTenantsByPropertyId($property_id);
                
                if ($property_tenants && count($property_tenants) > 0) {
                    foreach ($property_tenants as $tenant) {
                        // Replace variables in content
                        $content = $_POST['content'];
                        $subject = isset($_POST['subject']) ? $_POST['subject'] : '';
                        
                        // Replace tenant variables
                        $content = str_replace('{{tenant.first_name}}', $tenant['first_name'], $content);
                        $content = str_replace('{{tenant.last_name}}', $tenant['last_name'], $content);
                        $content = str_replace('{{tenant.email}}', $tenant['email'], $content);
                        $content = str_replace('{{tenant.phone}}', $tenant['phone'], $content);
                        
                        // Replace subject variables too
                        $subject = str_replace('{{tenant.first_name}}', $tenant['first_name'], $subject);
                        $subject = str_replace('{{tenant.last_name}}', $tenant['last_name'], $subject);
                        
                        // Replace property variables
                        $content = str_replace('{{property.name}}', $property['name'], $content);
                        $content = str_replace('{{property.address}}', $property['address'], $content);
                        $subject = str_replace('{{property.name}}', $property['name'], $subject);
                        
                        // Get unit info for this tenant if available
                        if ($tenant['unit_id']) {
                            $unitModel = new Unit($mysqli);
                            $unit = $unitModel->getUnitById($tenant['unit_id']);
                            if ($unit) {
                                // Replace unit variables
                                $content = str_replace('{{unit.number}}', $unit['unit_number'], $content);
                                $subject = str_replace('{{unit.number}}', $unit['unit_number'], $subject);
                            }
                        }
                        
                        // Create communication record
                        $comm_data = [
                            'type' => $_POST['type'],
                            'recipient_type' => 'tenant',
                            'recipient_id' => $tenant['id'],
                            'recipient_name' => $tenant['first_name'] . ' ' . $tenant['last_name'],
                            'recipient_contact' => $_POST['type'] === 'email' ? $tenant['email'] : $tenant['phone'],
                            'subject' => $subject,
                            'content' => $content,
                            'status' => 'sent', // In a real app, this would be set after actual sending
                            'sent_at' => date('Y-m-d H:i:s'),
                            'created_at' => date('Y-m-d H:i:s'),
                            'updated_at' => date('Y-m-d H:i:s')
                        ];
                        
                        // Handle actual sending based on type (integration with email/SMS services would go here)
                        $send_success = true; // Assume success for demo
                        
                        if ($send_success) {
                            // Save communication record
                            $result = $communicationModel->createCommunication($comm_data);
                            if ($result) {
                                $success_count++;
                            } else {
                                $fail_count++;
                            }
                        } else {
                            $fail_count++;
                        }
                    }
                } else {
                    $errors[] = "No tenants found for the selected property";
                }
            }
            
            if ($success_count > 0) {
                $success_message = "Successfully sent to {$success_count} recipient(s)";
                if ($fail_count > 0) {
                    $success_message .= ", failed to send to {$fail_count} recipient(s)";
                }
                header("Location: communication_history.php?success=" . urlencode($success_message));
                exit;
            } elseif ($fail_count > 0) {
                $errors[] = "Failed to send to {$fail_count} recipient(s)";
            }
        } catch (Exception $e) {
            $errors[] = "Error sending communication: " . $e->getMessage();
        }
    }
}
?>

<div class="container-fluid">
    <h1 class="h3 mb-4 text-gray-800">Send Message</h1>
    
    <?php if (!empty($errors)): ?>
        <div class="alert alert-danger">
            <ul class="mb-0">
                <?php foreach ($errors as $error): ?>
                    <li><?php echo htmlspecialchars($error); ?></li>
                <?php endforeach; ?>
            </ul>
        </div>
    <?php endif; ?>
    
    <div class="row">
        <div class="col-lg-8">
            <div class="card shadow mb-4">
                <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">Compose Message</h6>
                </div>
                <div class="card-body">
                    <form method="POST" action="send_message.php">
                        <div class="form-group">
                            <label for="template_id">Use Template (Optional)</label>
                            <select class="form-control" id="template_id" name="template_id">
                                <option value="">Select a Template</option>
                                <?php if ($templates && count($templates) > 0): ?>
                                    <?php foreach ($templates as $template): ?>
                                        <option value="<?php echo $template['id']; ?>" <?php echo (isset($_GET['template_id']) && $_GET['template_id'] == $template['id']) ? 'selected' : ''; ?>>
                                            <?php echo htmlspecialchars($template['name']); ?> (<?php echo ucfirst(htmlspecialchars($template['type'])); ?>)
                                        </option>
                                    <?php endforeach; ?>
                                <?php endif; ?>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="type">Communication Type <span class="text-danger">*</span></label>
                            <select class="form-control" id="type" name="type" required>
                                <option value="">Select Type</option>
                                <option value="email" <?php echo (isset($_POST['type']) && $_POST['type'] === 'email') || ($selected_template && $selected_template['type'] === 'email') || ($resend_communication && $resend_communication['type'] === 'email') ? 'selected' : ''; ?>>
                                    Email
                                </option>
                                <option value="sms" <?php echo (isset($_POST['type']) && $_POST['type'] === 'sms') || ($selected_template && $selected_template['type'] === 'sms') || ($resend_communication && $resend_communication['type'] === 'sms') ? 'selected' : ''; ?>>
                                    SMS
                                </option>
                                <option value="letter" <?php echo (isset($_POST['type']) && $_POST['type'] === 'letter') || ($selected_template && $selected_template['type'] === 'letter') || ($resend_communication && $resend_communication['type'] === 'letter') ? 'selected' : ''; ?>>
                                    Letter
                                </option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="recipient_type">Recipient Type <span class="text-danger">*</span></label>
                            <select class="form-control" id="recipient_type" name="recipient_type" required>
                                <option value="">Select Recipient Type</option>
                                <option value="tenant" <?php echo (isset($_POST['recipient_type']) && $_POST['recipient_type'] === 'tenant') || ($resend_communication && $resend_communication['recipient_type'] === 'tenant') ? 'selected' : ''; ?>>
                                    Specific Tenant(s)
                                </option>
                                <option value="property" <?php echo (isset($_POST['recipient_type']) && $_POST['recipient_type'] === 'property') ? 'selected' : ''; ?>>
                                    All Tenants in a Property
                                </option>
                            </select>
                        </div>
                        
                        <div id="tenant_selection" class="form-group" style="display:none;">
                            <label for="tenant_ids">Select Tenant(s) <span class="text-danger">*</span></label>
                            <select class="form-control" id="tenant_ids" name="tenant_ids[]" multiple>
                                <?php if ($tenants && count($tenants) > 0): ?>
                                    <?php foreach ($tenants as $tenant): ?>
                                        <option value="<?php echo $tenant['id']; ?>" 
                                        <?php 
                                        // Check if this tenant was previously selected or is the original recipient
                                        if ((isset($_POST['tenant_ids']) && is_array($_POST['tenant_ids']) && in_array($tenant['id'], $_POST['tenant_ids'])) || 
                                            ($resend_communication && $resend_communication['recipient_id'] == $tenant['id'] && $resend_communication['recipient_type'] === 'tenant')) {
                                            echo 'selected';
                                        }
                                        ?>>
                                            <?php echo htmlspecialchars($tenant['first_name'] . ' ' . $tenant['last_name']); ?>
                                            (<?php echo htmlspecialchars($tenant['email']); ?>)
                                        </option>
                                    <?php endforeach; ?>
                                <?php endif; ?>
                            </select>
                        </div>
                        
                        <div id="property_selection" class="form-group" style="display:none;">
                            <label for="property_id">Select Property <span class="text-danger">*</span></label>
                            <select class="form-control" id="property_id" name="property_id">
                                <option value="">Select a Property</option>
                                <?php if ($properties && count($properties) > 0): ?>
                                    <?php foreach ($properties as $property): ?>
                                        <option value="<?php echo $property['id']; ?>" <?php echo (isset($_POST['property_id']) && $_POST['property_id'] == $property['id']) ? 'selected' : ''; ?>>
                                            <?php echo htmlspecialchars($property['name']); ?>
                                        </option>
                                    <?php endforeach; ?>
                                <?php endif; ?>
                            </select>
                        </div>
                        
                        <div id="subject_field" class="form-group">
                            <label for="subject">Subject <span class="text-danger">*</span></label>
                            <input type="text" class="form-control" id="subject" name="subject" 
                                   value="<?php echo isset($_POST['subject']) ? htmlspecialchars($_POST['subject']) : (
                                       $selected_template ? htmlspecialchars($selected_template['subject']) : (
                                           $resend_communication ? htmlspecialchars($resend_communication['subject']) : ''
                                       )
                                   ); ?>">
                        </div>
                        
                        <div class="form-group">
                            <label for="content">Message Content <span class="text-danger">*</span></label>
                            <textarea class="form-control" id="content" name="content" rows="10" required><?php 
                                echo isset($_POST['content']) ? htmlspecialchars($_POST['content']) : (
                                    $selected_template ? htmlspecialchars($selected_template['content']) : (
                                        $resend_communication ? htmlspecialchars($resend_communication['content']) : ''
                                    )
                                ); 
                            ?></textarea>
                        </div>
                        
                        <div class="form-group">
                            <button type="submit" class="btn btn-primary">Send Message</button>
                            <a href="communications.php" class="btn btn-secondary">Cancel</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        
        <div class="col-lg-4">
            <div class="card shadow mb-4">
                <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">Available Variables</h6>
                </div>
                <div class="card-body">
                    <h6 class="font-weight-bold">Tenant Variables</h6>
                    <ul class="list-group mb-4">
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            {{tenant.first_name}}
                            <button class="btn btn-sm btn-outline-primary copy-var" data-var="{{tenant.first_name}}">
                                <i class="fas fa-copy"></i>
                            </button>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            {{tenant.last_name}}
                            <button class="btn btn-sm btn-outline-primary copy-var" data-var="{{tenant.last_name}}">
                                <i class="fas fa-copy"></i>
                            </button>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            {{tenant.email}}
                            <button class="btn btn-sm btn-outline-primary copy-var" data-var="{{tenant.email}}">
                                <i class="fas fa-copy"></i>
                            </button>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            {{tenant.phone}}
                            <button class="btn btn-sm btn-outline-primary copy-var" data-var="{{tenant.phone}}">
                                <i class="fas fa-copy"></i>
                            </button>
                        </li>
                    </ul>
                    
                    <h6 class="font-weight-bold">Property Variables</h6>
                    <ul class="list-group mb-4">
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            {{property.name}}
                            <button class="btn btn-sm btn-outline-primary copy-var" data-var="{{property.name}}">
                                <i class="fas fa-copy"></i>
                            </button>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            {{property.address}}
                            <button class="btn btn-sm btn-outline-primary copy-var" data-var="{{property.address}}">
                                <i class="fas fa-copy"></i>
                            </button>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            {{unit.number}}
                            <button class="btn btn-sm btn-outline-primary copy-var" data-var="{{unit.number}}">
                                <i class="fas fa-copy"></i>
                            </button>
                        </li>
                    </ul>
                    
                    <h6 class="font-weight-bold">Payment Variables</h6>
                    <ul class="list-group mb-4">
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            {{payment.amount}}
                            <button class="btn btn-sm btn-outline-primary copy-var" data-var="{{payment.amount}}">
                                <i class="fas fa-copy"></i>
                            </button>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            {{payment.due_date}}
                            <button class="btn btn-sm btn-outline-primary copy-var" data-var="{{payment.due_date}}">
                                <i class="fas fa-copy"></i>
                            </button>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            {{lease.start_date}}
                            <button class="btn btn-sm btn-outline-primary copy-var" data-var="{{lease.start_date}}">
                                <i class="fas fa-copy"></i>
                            </button>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            {{lease.end_date}}
                            <button class="btn btn-sm btn-outline-primary copy-var" data-var="{{lease.end_date}}">
                                <i class="fas fa-copy"></i>
                            </button>
                        </li>
                    </ul>
                    
                    <div class="alert alert-info">
                        <i class="fas fa-info-circle"></i> Click on the copy button to insert the variable into your message.
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
$(document).ready(function() {
    // Toggle subject field based on selected type
    $('#type').change(function() {
        if ($(this).val() === 'sms') {
            $('#subject_field').hide();
            $('#subject').prop('required', false);
        } else {
            $('#subject_field').show();
            $('#subject').prop('required', true);
        }
    }).trigger('change');
    
    // Toggle recipient selection based on recipient type
    $('#recipient_type').change(function() {
        if ($(this).val() === 'tenant') {
            $('#tenant_selection').show();
            $('#property_selection').hide();
            $('#tenant_ids').prop('required', true);
            $('#property_id').prop('required', false);
        } else if ($(this).val() === 'property') {
            $('#tenant_selection').hide();
            $('#property_selection').show();
            $('#tenant_ids').prop('required', false);
            $('#property_id').prop('required', true);
        } else {
            $('#tenant_selection').hide();
            $('#property_selection').hide();
            $('#tenant_ids').prop('required', false);
            $('#property_id').prop('required', false);
        }
    }).trigger('change');
    
    // Load template content when template is selected
    $('#template_id').change(function() {
        var templateId = $(this).val();
        if (templateId) {
            $.ajax({
                url: '../api/get_template.php',
                type: 'GET',
                data: { id: templateId },
                dataType: 'json',
                success: function(data) {
                    if (data) {
                        $('#type').val(data.type).trigger('change');
                        $('#subject').val(data.subject);
                        $('#content').val(data.content);
                        
                        // If CKEDITOR is defined and initialized for content
                        if (typeof CKEDITOR !== 'undefined' && CKEDITOR.instances.content) {
                            CKEDITOR.instances.content.setData(data.content);
                        }
                    }
                },
                error: function() {
                    alert('Error loading template data');
                }
            });
        }
    });
    
    // Copy variables to clipboard
    $('.copy-var').click(function() {
        var variable = $(this).data('var');
        var editor = document.getElementById('content');
        
        // Insert at cursor position if supported
        if (document.selection) {
            editor.focus();
            sel = document.selection.createRange();
            sel.text = variable;
            editor.focus();
        } else if (editor.selectionStart || editor.selectionStart === 0) {
            var startPos = editor.selectionStart;
            var endPos = editor.selectionEnd;
            editor.value = editor.value.substring(0, startPos) + variable + editor.value.substring(endPos, editor.value.length);
            editor.selectionStart = startPos + variable.length;
            editor.selectionEnd = startPos + variable.length;
            editor.focus();
        } else {
            editor.value += variable;
            editor.focus();
        }
        
        // Show a notification
        toastr.success('Variable copied to message', 'Success', {
            timeOut: 2000
        });
    });
    
    // Initialize select2 for better dropdowns
    if ($.fn.select2) {
        $('#tenant_ids, #property_id, #template_id').select2({
            placeholder: "Select an option"
        });
    }
    
    // Initialize rich text editor if not SMS
    if ($('#type').val() !== 'sms') {
        if (typeof CKEDITOR !== 'undefined') {
            CKEDITOR.replace('content');
        }
    }
});
</script>

<?php require_once '../includes/footer.php'; ?>
