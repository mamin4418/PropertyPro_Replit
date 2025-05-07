
<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/Property.php';

// Initialize Property model
$propertyModel = new Property($mysqli);

// Get all properties with stats
$properties = $propertyModel->getPropertiesWithStats();

$pageTitle = "Properties";
require_once __DIR__ . '/../includes/header.php';
?>

<div class="container-fluid py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="h3 mb-0">Properties</h1>
        <a href="add_property.php" class="btn btn-primary">
            <i class="fas fa-plus"></i> Add Property
        </a>
    </div>

    <div class="card shadow mb-4">
        <div class="card-header py-3 d-flex justify-content-between align-items-center">
            <h6 class="m-0 font-weight-bold text-primary">Property List</h6>
            <div class="input-group w-25">
                <input type="text" id="propertySearch" class="form-control" placeholder="Search properties...">
                <div class="input-group-append">
                    <button class="btn btn-outline-secondary" type="button">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
            </div>
        </div>
        <div class="card-body">
            <?php if (empty($properties)): ?>
                <div class="alert alert-info">
                    No properties found. <a href="add_property.php">Add your first property</a>
                </div>
            <?php else: ?>
                <div class="table-responsive">
                    <table class="table table-hover" id="propertiesTable">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Address</th>
                                <th>Type</th>
                                <th>Units</th>
                                <th>Occupancy</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($properties as $property): ?>
                                <?php 
                                    $occupancyRate = 0;
                                    if (isset($property['unit_count']) && $property['unit_count'] > 0) {
                                        $occupancyRate = ($property['occupied_units'] / $property['unit_count']) * 100;
                                    }
                                ?>
                                <tr>
                                    <td>
                                        <a href="view_property.php?id=<?= $property['id'] ?>">
                                            <?= htmlspecialchars($property['name']) ?>
                                        </a>
                                    </td>
                                    <td>
                                        <?= htmlspecialchars($property['address']) ?>, 
                                        <?= htmlspecialchars($property['city']) ?>, 
                                        <?= htmlspecialchars($property['state']) ?> 
                                        <?= htmlspecialchars($property['zipcode']) ?>
                                    </td>
                                    <td><?= htmlspecialchars($property['type']) ?></td>
                                    <td>
                                        <?= isset($property['unit_count']) ? $property['unit_count'] : 0 ?> units
                                        <small class="d-block text-muted">
                                            <?= isset($property['occupied_units']) ? $property['occupied_units'] : 0 ?> occupied, 
                                            <?= isset($property['vacant_units']) ? $property['vacant_units'] : 0 ?> vacant
                                        </small>
                                    </td>
                                    <td>
                                        <div class="d-flex align-items-center">
                                            <div class="progress flex-grow-1 mr-2" style="height: 8px;">
                                                <div class="progress-bar" role="progressbar" 
                                                     style="width: <?= round($occupancyRate) ?>%;" 
                                                     aria-valuenow="<?= round($occupancyRate) ?>" 
                                                     aria-valuemin="0" 
                                                     aria-valuemax="100"></div>
                                            </div>
                                            <span><?= round($occupancyRate) ?>%</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span class="badge <?= $property['status'] === 'active' ? 'bg-success' : 'bg-warning' ?>">
                                            <?= ucfirst(htmlspecialchars($property['status'])) ?>
                                        </span>
                                    </td>
                                    <td>
                                        <div class="btn-group">
                                            <a href="view_property.php?id=<?= $property['id'] ?>" 
                                               class="btn btn-sm btn-outline-primary">
                                                <i class="fas fa-eye"></i>
                                            </a>
                                            <a href="edit_property.php?id=<?= $property['id'] ?>" 
                                               class="btn btn-sm btn-outline-secondary">
                                                <i class="fas fa-edit"></i>
                                            </a>
                                            <a href="manage_units.php?property_id=<?= $property['id'] ?>" 
                                               class="btn btn-sm btn-outline-info">
                                                <i class="fas fa-building"></i> Units
                                            </a>
                                            <button type="button" class="btn btn-sm btn-outline-danger delete-property" 
                                                    data-id="<?= $property['id'] ?>" 
                                                    data-name="<?= htmlspecialchars($property['name']) ?>">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            <?php endif; ?>
        </div>
    </div>
</div>

<!-- Delete Confirmation Modal -->
<div class="modal fade" id="deletePropertyModal" tabindex="-1" aria-labelledby="deletePropertyModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="deletePropertyModalLabel">Confirm Delete</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                Are you sure you want to delete the property "<span id="propertyNameToDelete"></span>"? 
                This action cannot be undone and will also delete all units, leases, and related data.
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <form id="deletePropertyForm" method="post" action="delete_property.php">
                    <input type="hidden" id="propertyIdToDelete" name="property_id">
                    <button type="submit" class="btn btn-danger">Delete Property</button>
                </form>
            </div>
        </div>
    </div>
</div>

<script>
    document.addEventListener('DOMContentLoaded', function() {
        // Property search functionality
        const searchInput = document.getElementById('propertySearch');
        const table = document.getElementById('propertiesTable');
        
        if (searchInput && table) {
            searchInput.addEventListener('keyup', function() {
                const searchTerm = this.value.toLowerCase();
                const rows = table.querySelectorAll('tbody tr');
                
                rows.forEach(row => {
                    const text = row.textContent.toLowerCase();
                    row.style.display = text.includes(searchTerm) ? '' : 'none';
                });
            });
        }
        
        // Delete property confirmation
        const deleteButtons = document.querySelectorAll('.delete-property');
        const propertyNameSpan = document.getElementById('propertyNameToDelete');
        const propertyIdInput = document.getElementById('propertyIdToDelete');
        
        deleteButtons.forEach(button => {
            button.addEventListener('click', function() {
                const propertyId = this.getAttribute('data-id');
                const propertyName = this.getAttribute('data-name');
                
                propertyNameSpan.textContent = propertyName;
                propertyIdInput.value = propertyId;
                
                // Show modal
                new bootstrap.Modal(document.getElementById('deletePropertyModal')).show();
            });
        });
    });
</script>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
