
<?php
require_once '../includes/header.php';
require_once '../models/Document.php';

// Initialize document model
$documentModel = new Document($mysqli);

// Get all document templates
$templates = $documentModel->getDocumentTemplates();

// Process delete action
if (isset($_GET['action']) && $_GET['action'] == 'delete' && isset($_GET['id'])) {
    $template_id = intval($_GET['id']);
    $result = $documentModel->deleteDocumentTemplate($template_id);
    if ($result) {
        header("Location: document_templates.php?success=Template deleted successfully");
        exit;
    } else {
        header("Location: document_templates.php?error=Failed to delete template");
        exit;
    }
}
?>

<div class="container-fluid">
    <h1 class="h3 mb-4 text-gray-800">Document Templates</h1>

    <?php if (isset($_GET['success'])): ?>
        <div class="alert alert-success" role="alert">
            <?php echo htmlspecialchars($_GET['success']); ?>
        </div>
    <?php endif; ?>

    <?php if (isset($_GET['error'])): ?>
        <div class="alert alert-danger" role="alert">
            <?php echo htmlspecialchars($_GET['error']); ?>
        </div>
    <?php endif; ?>

    <div class="card shadow mb-4">
        <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
            <h6 class="m-0 font-weight-bold text-primary">Document Templates</h6>
            <a href="create_template.php" class="btn btn-primary btn-sm">
                <i class="fas fa-plus"></i> Create New Template
            </a>
        </div>
        <div class="card-body">
            <div class="table-responsive">
                <table class="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Created Date</th>
                            <th>Last Modified</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if ($templates): ?>
                            <?php foreach ($templates as $template): ?>
                                <tr>
                                    <td><?php echo $template['id']; ?></td>
                                    <td><?php echo htmlspecialchars($template['title']); ?></td>
                                    <td><?php echo htmlspecialchars($template['document_type']); ?></td>
                                    <td><?php echo date('M d, Y', strtotime($template['created_at'])); ?></td>
                                    <td><?php echo date('M d, Y', strtotime($template['updated_at'])); ?></td>
                                    <td>
                                        <a href="edit_template.php?id=<?php echo $template['id']; ?>" class="btn btn-info btn-sm">
                                            <i class="fas fa-edit"></i>
                                        </a>
                                        <a href="generate_document.php?template_id=<?php echo $template['id']; ?>" class="btn btn-success btn-sm">
                                            <i class="fas fa-file-alt"></i> Generate
                                        </a>
                                        <a href="document_templates.php?action=delete&id=<?php echo $template['id']; ?>" class="btn btn-danger btn-sm" onclick="return confirm('Are you sure you want to delete this template?')">
                                            <i class="fas fa-trash"></i>
                                        </a>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        <?php else: ?>
                            <tr>
                                <td colspan="6" class="text-center">No document templates found</td>
                            </tr>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<?php require_once '../includes/footer.php'; ?>
