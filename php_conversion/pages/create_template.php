
<?php
require_once '../includes/header.php';
require_once '../models/Document.php';

// Initialize document model
$documentModel = new Document($mysqli);

// Process form submission
$success = '';
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Validate and sanitize inputs
    $title = isset($_POST['title']) ? trim($_POST['title']) : '';
    $document_type = isset($_POST['document_type']) ? trim($_POST['document_type']) : '';
    $content = isset($_POST['content']) ? $_POST['content'] : '';
    $variables = isset($_POST['variables']) ? trim($_POST['variables']) : '';

    // Validate inputs
    if (empty($title)) {
        $error = "Template title is required";
    } elseif (empty($document_type)) {
        $error = "Document type is required";
    } elseif (empty($content)) {
        $error = "Template content is required";
    } else {
        // Insert template into database
        $result = $documentModel->createDocumentTemplate($title, $document_type, $content, $variables);

        if ($result) {
            $success = "Template created successfully";
        } else {
            $error = "Failed to create template. Please try again.";
        }
    }
}

// Get document types
$documentTypes = ['lease', 'contract', 'notice', 'disclosure', 'other'];
?>

<div class="container-fluid">
    <h1 class="h3 mb-4 text-gray-800">Create Document Template</h1>

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
            <h6 class="m-0 font-weight-bold text-primary">Template Details</h6>
        </div>
        <div class="card-body">
            <form method="POST" action="">
                <div class="form-group row">
                    <div class="col-md-6">
                        <label for="title">Template Title</label>
                        <input type="text" class="form-control" id="title" name="title" required>
                    </div>
                    <div class="col-md-6">
                        <label for="document_type">Document Type</label>
                        <select class="form-control" id="document_type" name="document_type" required>
                            <option value="">Select Document Type</option>
                            <?php foreach ($documentTypes as $type): ?>
                                <option value="<?php echo $type; ?>"><?php echo ucfirst($type); ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label for="variables">Template Variables (comma separated)</label>
                    <input type="text" class="form-control" id="variables" name="variables" 
                           placeholder="e.g. tenant_name, property_address, start_date">
                    <small class="form-text text-muted">
                        Use these variables in your template content by wrapping them in double curly braces, 
                        e.g. {{tenant_name}}
                    </small>
                </div>

                <div class="form-group">
                    <label for="content">Template Content</label>
                    <textarea class="form-control" id="content" name="content" rows="15" required></textarea>
                </div>

                <div class="form-group row">
                    <div class="col-md-6">
                        <button type="submit" class="btn btn-primary btn-block">
                            <i class="fas fa-save"></i> Save Template
                        </button>
                    </div>
                    <div class="col-md-6">
                        <a href="document_templates.php" class="btn btn-secondary btn-block">
                            <i class="fas fa-arrow-left"></i> Back to Templates
                        </a>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>

<script>
// Initialize a rich text editor for the content textarea
document.addEventListener('DOMContentLoaded', function() {
    if (typeof CKEDITOR !== 'undefined') {
        CKEDITOR.replace('content');
    }
});
</script>

<?php require_once '../includes/footer.php'; ?>