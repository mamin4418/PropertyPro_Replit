
<?php
require_once '../includes/header.php';
require_once '../models/CommunicationTemplate.php';

// Initialize the model
$templateModel = new CommunicationTemplate($mysqli);

// Process form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Validate input
    $errors = [];
    
    if (empty($_POST['name'])) {
        $errors[] = "Template name is required";
    }
    
    if (empty($_POST['type'])) {
        $errors[] = "Communication type is required";
    }
    
    if (empty($_POST['subject']) && $_POST['type'] !== 'sms') {
        $errors[] = "Subject is required for email and letter templates";
    }
    
    if (empty($_POST['content'])) {
        $errors[] = "Template content is required";
    }
    
    // If no errors, save the template
    if (empty($errors)) {
        try {
            $templateData = [
                'name' => $_POST['name'],
                'type' => $_POST['type'],
                'subject' => $_POST['subject'] ?? '',
                'content' => $_POST['content'],
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ];
            
            $result = $templateModel->createTemplate($templateData);
            
            if ($result) {
                header("Location: communication_templates.php?success=Template created successfully");
                exit;
            } else {
                $errors[] = "Failed to create template";
            }
        } catch (Exception $e) {
            $errors[] = "Error: " . $e->getMessage();
        }
    }
}
?>

<div class="container-fluid">
    <h1 class="h3 mb-4 text-gray-800">Add Communication Template</h1>
    
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
                    <h6 class="m-0 font-weight-bold text-primary">Template Details</h6>
                </div>
                <div class="card-body">
                    <form method="POST" action="add_communication_template.php">
                        <div class="form-group">
                            <label for="name">Template Name <span class="text-danger">*</span></label>
                            <input type="text" class="form-control" id="name" name="name" required 
                                   value="<?php echo isset($_POST['name']) ? htmlspecialchars($_POST['name']) : ''; ?>">
                        </div>
                        
                        <div class="form-group">
                            <label for="type">Communication Type <span class="text-danger">*</span></label>
                            <select class="form-control" id="type" name="type" required>
                                <option value="">Select Type</option>
                                <option value="email" <?php echo (isset($_POST['type']) && $_POST['type'] === 'email') ? 'selected' : ''; ?>>
                                    Email
                                </option>
                                <option value="sms" <?php echo (isset($_POST['type']) && $_POST['type'] === 'sms') ? 'selected' : ''; ?>>
                                    SMS
                                </option>
                                <option value="letter" <?php echo (isset($_POST['type']) && $_POST['type'] === 'letter') ? 'selected' : ''; ?>>
                                    Letter
                                </option>
                            </select>
                        </div>
                        
                        <div class="form-group" id="subjectField">
                            <label for="subject">Subject <span class="text-danger">*</span></label>
                            <input type="text" class="form-control" id="subject" name="subject" 
                                   value="<?php echo isset($_POST['subject']) ? htmlspecialchars($_POST['subject']) : ''; ?>">
                            <small class="form-text text-muted">Required for email and letter templates.</small>
                        </div>
                        
                        <div class="form-group">
                            <label for="content">Template Content <span class="text-danger">*</span></label>
                            <textarea class="form-control" id="content" name="content" rows="10" required><?php echo isset($_POST['content']) ? htmlspecialchars($_POST['content']) : ''; ?></textarea>
                            <small class="form-text text-muted">Use variables like {{tenant.first_name}} to create dynamic content.</small>
                        </div>
                        
                        <div class="form-group">
                            <button type="submit" class="btn btn-primary">Save Template</button>
                            <a href="communication_templates.php" class="btn btn-secondary">Cancel</a>
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
                        <i class="fas fa-info-circle"></i> Click on the copy button to insert the variable into your template.
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
            $('#subjectField').hide();
            $('#subject').prop('required', false);
        } else {
            $('#subjectField').show();
            $('#subject').prop('required', true);
        }
    }).trigger('change');
    
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
        toastr.success('Variable copied to template', 'Success', {
            timeOut: 2000
        });
    });
    
    // Initialize rich text editor if not SMS
    if ($('#type').val() !== 'sms') {
        if (typeof CKEDITOR !== 'undefined') {
            CKEDITOR.replace('content');
        }
    }
});
</script>

<?php require_once '../includes/footer.php'; ?>
