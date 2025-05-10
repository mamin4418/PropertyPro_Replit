
<?php
require_once '../includes/header.php';
require_once '../models/CommunicationTemplate.php';

// Initialize model
$templateModel = new CommunicationTemplate($mysqli);

// Process form submission for adding/updating template
$success = '';
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['action']) && $_POST['action'] === 'add') {
        // Add new template
        $name = isset($_POST['name']) ? trim($_POST['name']) : '';
        $type = isset($_POST['type']) ? $_POST['type'] : '';
        $subject = isset($_POST['subject']) ? trim($_POST['subject']) : '';
        $content = isset($_POST['content']) ? trim($_POST['content']) : '';
        
        if (empty($name)) {
            $error = "Template name is required";
        } elseif (empty($type)) {
            $error = "Communication type is required";
        } elseif (empty($subject)) {
            $error = "Subject is required";
        } elseif (empty($content)) {
            $error = "Content is required";
        } else {
            $result = $templateModel->addTemplate($name, $type, $subject, $content);
            if ($result) {
                $success = "Template added successfully";
            } else {
                $error = "Failed to add template";
            }
        }
    } elseif (isset($_POST['action']) && $_POST['action'] === 'delete' && isset($_POST['template_id'])) {
        // Delete template
        $template_id = intval($_POST['template_id']);
        $result = $templateModel->deleteTemplate($template_id);
        if ($result) {
            $success = "Template deleted successfully";
        } else {
            $error = "Failed to delete template";
        }
    }
}

// Get all templates
$templates = $templateModel->getAllTemplates();
?>

<div class="container-fluid">
    <h1 class="h3 mb-4 text-gray-800">Communication Templates</h1>
    
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
        <div class="col-lg-8">
            <!-- Templates List -->
            <div class="card shadow mb-4">
                <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">Available Templates</h6>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-bordered" id="templatesTable" width="100%" cellspacing="0">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Type</th>
                                    <th>Subject</th>
                                    <th>Date Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php if (count($templates) > 0): ?>
                                    <?php foreach ($templates as $template): ?>
                                        <tr>
                                            <td><?php echo $template['name']; ?></td>
                                            <td>
                                                <?php 
                                                $type = $template['type'];
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
                                            <td><?php echo $template['subject']; ?></td>
                                            <td><?php echo date('M d, Y', strtotime($template['created_at'])); ?></td>
                                            <td>
                                                <button type="button" class="btn btn-info btn-sm view-template" 
                                                        data-id="<?php echo $template['id']; ?>"
                                                        data-name="<?php echo $template['name']; ?>"
                                                        data-type="<?php echo $template['type']; ?>"
                                                        data-subject="<?php echo $template['subject']; ?>"
                                                        data-content="<?php echo htmlspecialchars($template['content']); ?>">
                                                    <i class="fas fa-eye"></i>
                                                </button>
                                                <button type="button" class="btn btn-danger btn-sm delete-template" 
                                                        data-id="<?php echo $template['id']; ?>"
                                                        data-name="<?php echo $template['name']; ?>">
                                                    <i class="fas fa-trash"></i>
                                                </button>
                                                <a href="send_message.php?template_id=<?php echo $template['id']; ?>" class="btn btn-primary btn-sm">
                                                    <i class="fas fa-paper-plane"></i>
                                                </a>
                                            </td>
                                        </tr>
                                    <?php endforeach; ?>
                                <?php else: ?>
                                    <tr>
                                        <td colspan="5" class="text-center">No templates found</td>
                                    </tr>
                                <?php endif; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-lg-4">
            <!-- Add Template Form -->
            <div class="card shadow mb-4">
                <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">Add New Template</h6>
                </div>
                <div class="card-body">
                    <form method="POST" action="">
                        <input type="hidden" name="action" value="add">
                        
                        <div class="form-group">
                            <label for="name">Template Name</label>
                            <input type="text" class="form-control" id="name" name="name" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="type">Communication Type</label>
                            <select class="form-control" id="type" name="type" required>
                                <option value="">Select type</option>
                                <option value="email">Email</option>
                                <option value="sms">SMS</option>
                                <option value="notification">System Notification</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="subject">Subject</label>
                            <input type="text" class="form-control" id="subject" name="subject" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="content">Content</label>
                            <textarea class="form-control" id="content" name="content" rows="6" required></textarea>
                            <small class="form-text text-muted">
                                You can use placeholders like {tenant_name}, {property_name}, {unit_number}, etc.
                            </small>
                        </div>
                        
                        <button type="submit" class="btn btn-primary btn-block">
                            <i class="fas fa-save"></i> Save Template
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- View Template Modal -->
<div class="modal fade" id="viewTemplateModal" tabindex="-1" role="dialog" aria-labelledby="viewTemplateModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="viewTemplateModalLabel">View Template</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label>Template Name:</label>
                    <p id="view-name" class="form-control-static"></p>
                </div>
                <div class="form-group">
                    <label>Type:</label>
                    <p id="view-type" class="form-control-static"></p>
                </div>
                <div class="form-group">
                    <label>Subject:</label>
                    <p id="view-subject" class="form-control-static"></p>
                </div>
                <div class="form-group">
                    <label>Content:</label>
                    <div id="view-content" class="p-3 border rounded bg-light"></div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <a href="#" id="use-template-link" class="btn btn-primary">Use Template</a>
            </div>
        </div>
    </div>
</div>

<!-- Delete Template Modal -->
<div class="modal fade" id="deleteTemplateModal" tabindex="-1" role="dialog" aria-labelledby="deleteTemplateModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="deleteTemplateModalLabel">Delete Template</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <p>Are you sure you want to delete the template "<span id="delete-template-name"></span>"?</p>
                <p class="text-danger">This action cannot be undone.</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                <form method="POST" action="">
                    <input type="hidden" name="action" value="delete">
                    <input type="hidden" name="template_id" id="delete-template-id">
                    <button type="submit" class="btn btn-danger">Delete</button>
                </form>
            </div>
        </div>
    </div>
</div>

<script>
$(document).ready(function() {
    $('#templatesTable').DataTable();
    
    // View template modal
    $('.view-template').click(function() {
        const id = $(this).data('id');
        const name = $(this).data('name');
        const type = $(this).data('type');
        const subject = $(this).data('subject');
        const content = $(this).data('content');
        
        $('#view-name').text(name);
        $('#view-type').text(type.charAt(0).toUpperCase() + type.slice(1));
        $('#view-subject').text(subject);
        $('#view-content').html(content.replace(/\n/g, '<br>'));
        $('#use-template-link').attr('href', 'send_message.php?template_id=' + id);
        
        $('#viewTemplateModal').modal('show');
    });
    
    // Delete template modal
    $('.delete-template').click(function() {
        const id = $(this).data('id');
        const name = $(this).data('name');
        
        $('#delete-template-id').val(id);
        $('#delete-template-name').text(name);
        
        $('#deleteTemplateModal').modal('show');
    });
});
</script>

<?php require_once '../includes/footer.php'; ?>
