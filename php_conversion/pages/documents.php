
<?php
// Include necessary files
require_once 'includes/header.php';
require_once 'includes/sidebar.php';
require_once 'models/Document.php';
require_once 'models/Property.php';
require_once 'models/Tenant.php';

// Initialize database connection
$db = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
if ($db->connect_error) {
    die("Connection failed: " . $db->connect_error);
}

// Initialize models
$document = new Document($db);
$property = new Property($db);
$tenant = new Tenant($db);

// Get all documents
$documents = $document->getAllDocuments();
$properties = $property->getAllProperties();
$tenants = $tenant->getAllTenants();

// Filter options
$property_filter = isset($_GET['property_id']) ? intval($_GET['property_id']) : 0;
$tenant_filter = isset($_GET['tenant_id']) ? intval($_GET['tenant_id']) : 0;
$type_filter = isset($_GET['document_type']) ? trim($_GET['document_type']) : '';

// Apply filters
if ($property_filter > 0) {
    $documents = $document->getDocumentsByPropertyId($property_filter);
}
if ($tenant_filter > 0) {
    $documents = $document->getDocumentsByTenantId($tenant_filter);
}
if (!empty($type_filter)) {
    $documents = $document->getDocumentsByType($type_filter);
}

// Handle delete action
if (isset($_GET['action']) && $_GET['action'] == 'delete' && isset($_GET['id'])) {
    $id = intval($_GET['id']);
    if ($document->deleteDocument($id)) {
        echo "<script>alert('Document deleted successfully.');</script>";
        echo "<script>window.location.href = 'documents.php';</script>";
    } else {
        echo "<script>alert('Error deleting document.');</script>";
    }
}
?>

<div class="content-wrapper">
    <div class="container-fluid">
        <div class="row mb-4">
            <div class="col-md-6">
                <h1 class="h3 mb-0 text-gray-800">Documents</h1>
                <p class="mb-4">Manage property and tenant documents</p>
            </div>
            <div class="col-md-6 text-md-end">
                <a href="add_document.php" class="btn btn-primary">
                    <i class="fas fa-plus me-2"></i>Add New Document
                </a>
            </div>
        </div>
        
        <!-- Filter -->
        <div class="card mb-4">
            <div class="card-header bg-light">
                <h6 class="m-0 font-weight-bold">Filter Documents</h6>
            </div>
            <div class="card-body">
                <form method="get" action="documents.php" class="row g-3 align-items-center">
                    <div class="col-md-3">
                        <label for="property_id" class="form-label">Property</label>
                        <select name="property_id" id="property_id" class="form-select">
                            <option value="0">All Properties</option>
                            <?php foreach ($properties as $p): ?>
                                <option value="<?= $p['id'] ?>" <?= $property_filter == $p['id'] ? 'selected' : '' ?>>
                                    <?= htmlspecialchars($p['name']) ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="col-md-3">
                        <label for="tenant_id" class="form-label">Tenant</label>
                        <select name="tenant_id" id="tenant_id" class="form-select">
                            <option value="0">All Tenants</option>
                            <?php foreach ($tenants as $t): ?>
                                <option value="<?= $t['id'] ?>" <?= $tenant_filter == $t['id'] ? 'selected' : '' ?>>
                                    <?= htmlspecialchars($t['first_name'] . ' ' . $t['last_name']) ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="col-md-3">
                        <label for="document_type" class="form-label">Document Type</label>
                        <select name="document_type" id="document_type" class="form-select">
                            <option value="">All Types</option>
                            <option value="Lease" <?= $type_filter == 'Lease' ? 'selected' : '' ?>>Lease</option>
                            <option value="Contract" <?= $type_filter == 'Contract' ? 'selected' : '' ?>>Contract</option>
                            <option value="Notice" <?= $type_filter == 'Notice' ? 'selected' : '' ?>>Notice</option>
                            <option value="Receipt" <?= $type_filter == 'Receipt' ? 'selected' : '' ?>>Receipt</option>
                            <option value="Invoice" <?= $type_filter == 'Invoice' ? 'selected' : '' ?>>Invoice</option>
                            <option value="Insurance" <?= $type_filter == 'Insurance' ? 'selected' : '' ?>>Insurance</option>
                            <option value="Inspection" <?= $type_filter == 'Inspection' ? 'selected' : '' ?>>Inspection</option>
                            <option value="Other" <?= $type_filter == 'Other' ? 'selected' : '' ?>>Other</option>
                        </select>
                    </div>
                    <div class="col-md-3 d-flex align-items-end">
                        <button type="submit" class="btn btn-primary">Apply Filter</button>
                        <?php if ($property_filter > 0 || $tenant_filter > 0 || !empty($type_filter)): ?>
                            <a href="documents.php" class="btn btn-outline-secondary ms-2">Clear</a>
                        <?php endif; ?>
                    </div>
                </form>
            </div>
        </div>
        
        <!-- Documents List -->
        <div class="card shadow mb-4">
            <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                <h6 class="m-0 font-weight-bold text-primary">Document List</h6>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Document Type</th>
                                <th>Property</th>
                                <th>Tenant</th>
                                <th>Date Added</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (empty($documents)): ?>
                                <tr>
                                    <td colspan="7" class="text-center">No documents found</td>
                                </tr>
                            <?php else: ?>
                                <?php foreach ($documents as $doc): ?>
                                    <tr>
                                        <td><?= htmlspecialchars($doc['title']) ?></td>
                                        <td><?= htmlspecialchars($doc['document_type']) ?></td>
                                        <td><?= htmlspecialchars($doc['property_name'] ?? 'N/A') ?></td>
                                        <td>
                                            <?php if (!empty($doc['first_name']) && !empty($doc['last_name'])): ?>
                                                <?= htmlspecialchars($doc['first_name'] . ' ' . $doc['last_name']) ?>
                                            <?php else: ?>
                                                N/A
                                            <?php endif; ?>
                                        </td>
                                        <td><?= date('M d, Y', strtotime($doc['created_at'])) ?></td>
                                        <td>
                                            <?php 
                                            switch ($doc['status']) {
                                                case 'signed':
                                                    echo '<span class="badge bg-success">Signed</span>';
                                                    break;
                                                case 'pending':
                                                    echo '<span class="badge bg-warning text-dark">Pending</span>';
                                                    break;
                                                case 'draft':
                                                    echo '<span class="badge bg-secondary">Draft</span>';
                                                    break;
                                                default:
                                                    echo '<span class="badge bg-primary">' . htmlspecialchars($doc['status']) . '</span>';
                                            }
                                            ?>
                                        </td>
                                        <td>
                                            <a href="view_document.php?id=<?= $doc['id'] ?>" class="btn btn-info btn-sm">
                                                <i class="fas fa-eye"></i>
                                            </a>
                                            <a href="edit_document.php?id=<?= $doc['id'] ?>" class="btn btn-primary btn-sm">
                                                <i class="fas fa-edit"></i>
                                            </a>
                                            <a href="<?= htmlspecialchars($doc['file_path']) ?>" class="btn btn-success btn-sm" target="_blank">
                                                <i class="fas fa-download"></i>
                                            </a>
                                            <a href="documents.php?action=delete&id=<?= $doc['id'] ?>" 
                                               class="btn btn-danger btn-sm"
                                               onclick="return confirm('Are you sure you want to delete this document?')">
                                                <i class="fas fa-trash"></i>
                                            </a>
                                        </td>
                                    </tr>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
    $(document).ready(function() {
        $('#dataTable').DataTable();
    });
</script>

<?php
require_once 'includes/footer.php';
$db->close();
?>
