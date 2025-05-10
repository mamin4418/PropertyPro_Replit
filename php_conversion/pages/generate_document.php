<?php
require_once '../includes/header.php';
require_once '../models/Document.php';
require_once '../models/Property.php';
require_once '../models/Tenant.php';
require_once '../models/Lease.php';

// Initialize models
$documentModel = new Document($mysqli);
$propertyModel = new Property($mysqli);
$tenantModel = new Tenant($mysqli);
$leaseModel = new Lease($mysqli);

// Get template ID from URL
$template_id = isset($_GET['template_id']) ? intval($_GET['template_id']) : 0;

// Verify template exists
$template = $documentModel->getDocumentTemplateById($template_id);
if (!$template) {
    // Template not found, redirect
    header("Location: document_templates.php?error=Template not found");
    exit;
}

// Parse variables from template
preg_match_all('/{{(.*?)}}/', $template['content'], $matches);
$templateVariables = array_unique($matches[1]);

// Get data for dropdown lists
$properties = $propertyModel->getAllProperties();
$tenants = $tenantModel->getAllTenants();
$leases = $leaseModel->getAllLeases();

// Process form submission
$success = '';
$error = '';
$generatedDocument = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get template content
    $content = $template['content'];

    // Replace variables with form values
    foreach ($_POST as $key => $value) {
        if (strpos($key, 'var_') === 0) {
            $varName = substr($key, 4); // Remove 'var_' prefix
            $content = str_replace('{{'.$varName.'}}', $value, $content);
        }
    }

    // Generate document ID
    $documentName = $_POST['document_name'] ?? $template['title'] . ' - Generated';
    $related_entity_type = $_POST['related_entity_type'] ?? '';
    $related_entity_id = intval($_POST['related_entity_id'] ?? 0);

    // Save generated document to database
    $documentId = $documentModel->createDocument(
        $documentName,
        $template['document_type'],
        $related_entity_type,
        $related_entity_id,
        $content
    );

    if ($documentId) {
        $success = "Document generated successfully";
        $generatedDocument = $content;
    } else {
        $error = "Failed to generate document. Please try again.";
    }
}
?>

<div class="container-fluid">
    <h1 class="h3 mb-4 text-gray-800">Generate Document</h1>

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
        <?php if (empty($generatedDocument)): ?>
            <!-- Form to fill in template variables -->
            <div class="col-md-12">
                <div class="card shadow mb-4">
                    <div class="card-header py-3">
                        <h6 class="m-0 font-weight-bold text-primary">
                            Generate: <?php echo htmlspecialchars($template['title']); ?>
                        </h6>
                    </div>
                    <div class="card-body">
                        <form method="POST" action="">
                            <div class="form-group row">
                                <div class="col-md-6">
                                    <label for="document_name">Document Name</label>
                                    <input type="text" class="form-control" id="document_name" name="document_name" 
                                           value="<?php echo htmlspecialchars($template['title']); ?> - Generated" required>
                                </div>
                                <div class="col-md-6">
                                    <label for="related_entity_type">Related To</label>
                                    <select class="form-control" id="related_entity_type" name="related_entity_type">
                                        <option value="">None</option>
                                        <option value="property">Property</option>
                                        <option value="tenant">Tenant</option>
                                        <option value="lease">Lease</option>
                                    </select>
                                </div>
                            </div>

                            <div class="form-group" id="property_section" style="display: none;">
                                <label for="related_entity_id_property">Select Property</label>
                                <select class="form-control" id="related_entity_id_property" name="related_entity_id">
                                    <option value="">Select Property</option>
                                    <?php foreach ($properties as $property): ?>
                                        <option value="<?php echo $property['id']; ?>">
                                            <?php echo htmlspecialchars($property['name'] . ' - ' . $property['address']); ?>
                                        </option>
                                    <?php endforeach; ?>
                                </select>
                            </div>

                            <div class="form-group" id="tenant_section" style="display: none;">
                                <label for="related_entity_id_tenant">Select Tenant</label>
                                <select class="form-control" id="related_entity_id_tenant" name="related_entity_id">
                                    <option value="">Select Tenant</option>
                                    <?php foreach ($tenants as $tenant): ?>
                                        <option value="<?php echo $tenant['id']; ?>">
                                            <?php echo htmlspecialchars($tenant['first_name'] . ' ' . $tenant['last_name']); ?>
                                        </option>
                                    <?php endforeach; ?>
                                </select>
                            </div>

                            <div class="form-group" id="lease_section" style="display: none;">
                                <label for="related_entity_id_lease">Select Lease</label>
                                <select class="form-control" id="related_entity_id_lease" name="related_entity_id">
                                    <option value="">Select Lease</option>
                                    <?php foreach ($leases as $lease): ?>
                                        <option value="<?php echo $lease['id']; ?>">
                                            Lease #<?php echo $lease['id']; ?> - 
                                            Unit: <?php echo htmlspecialchars($lease['unit_number']); ?> - 
                                            Tenant: <?php echo htmlspecialchars($lease['tenant_name']); ?>
                                        </option>
                                    <?php endforeach; ?>
                                </select>
                            </div>

                            <hr>
                            <h5>Template Variables</h5>

                            <?php if (!empty($templateVariables)): ?>
                                <?php foreach ($templateVariables as $variable): ?>
                                    <div class="form-group">
                                        <label for="var_<?php echo $variable; ?>">
                                            <?php echo ucwords(str_replace('_', ' ', $variable)); ?>
                                        </label>
                                        <input type="text" class="form-control" 
                                               id="var_<?php echo $variable; ?>" 
                                               name="var_<?php echo $variable; ?>" required>
                                    </div>
                                <?php endforeach; ?>
                            <?php else: ?>
                                <div class="alert alert-info">
                                    This template has no variables to fill.
                                </div>
                            <?php endif; ?>

                            <div class="form-group row">
                                <div class="col-md-6">
                                    <button type="submit" class="btn btn-primary btn-block">
                                        <i class="fas fa-file-alt"></i> Generate Document
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
        <?php else: ?>
            <!-- Display generated document -->
            <div class="col-md-12">
                <div class="card shadow mb-4">
                    <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                        <h6 class="m-0 font-weight-bold text-primary">Generated Document</h6>
                        <div>
                            <button onclick="printDocument()" class="btn btn-info btn-sm">
                                <i class="fas fa-print"></i> Print
                            </button>
                            <a href="document_signing.php?id=<?php echo $documentId; ?>" class="btn btn-success btn-sm">
                                <i class="fas fa-signature"></i> Get Signatures
                            </a>
                            <a href="documents.php" class="btn btn-primary btn-sm">
                                <i class="fas fa-file"></i> View All Documents
                            </a>
                        </div>
                    </div>
                    <div class="card-body">
                        <div id="document-content">
                            <?php echo $generatedDocument; ?>
                        </div>
                    </div>
                </div>
            </div>
        <?php endif; ?>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    // Handle related entity type change
    const relatedEntityType = document.getElementById('related_entity_type');
    const propertySect = document.getElementById('property_section');
    const tenantSect = document.getElementById('tenant_section');
    const leaseSect = document.getElementById('lease_section');

    relatedEntityType.addEventListener('change', function() {
        propertySect.style.display = 'none';
        tenantSect.style.display = 'none';
        leaseSect.style.display = 'none';

        const value = this.value;

        if (value === 'property') {
            propertySect.style.display = 'block';
        } else if (value === 'tenant') {
            tenantSect.style.display = 'block';
        } else if (value === 'lease') {
            leaseSect.style.display = 'block';
        }
    });
});

function printDocument() {
    const content = document.getElementById('document-content').innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.open();
    printWindow.document.write(`
        <html>
        <head>
            <title>Print Document</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; }
                @media print {
                    body { padding: 20px; }
                }
            </style>
        </head>
        <body>
            ${content}
            <script>
                window.onload = function() { window.print(); }
            <\/script>
        </body>
        </html>
    `);
    printWindow.document.close();
}
</script>

<?php require_once '../includes/footer.php'; ?>
