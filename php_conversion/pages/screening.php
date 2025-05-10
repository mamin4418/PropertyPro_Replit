
<?php
require_once '../includes/header.php';
require_once '../models/ScreeningCriteria.php';
require_once '../models/Application.php';

// Initialize models
$screeningModel = new ScreeningCriteria($mysqli);
$applicationModel = new Application($mysqli);

// Process form submission for adding/updating criteria
$success = '';
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['action']) && $_POST['action'] === 'add') {
        // Add new screening criteria
        $name = isset($_POST['name']) ? trim($_POST['name']) : '';
        $description = isset($_POST['description']) ? trim($_POST['description']) : '';
        $weight = isset($_POST['weight']) ? intval($_POST['weight']) : 1;
        
        if (empty($name)) {
            $error = "Criterion name is required";
        } elseif (empty($description)) {
            $error = "Description is required";
        } else {
            $result = $screeningModel->addCriterion($name, $description, $weight);
            if ($result) {
                $success = "Screening criterion added successfully";
            } else {
                $error = "Failed to add screening criterion";
            }
        }
    } elseif (isset($_POST['action']) && $_POST['action'] === 'delete' && isset($_POST['criterion_id'])) {
        // Delete screening criterion
        $criterion_id = intval($_POST['criterion_id']);
        $result = $screeningModel->deleteCriterion($criterion_id);
        if ($result) {
            $success = "Screening criterion deleted successfully";
        } else {
            $error = "Failed to delete screening criterion";
        }
    } elseif (isset($_POST['action']) && $_POST['action'] === 'update' && isset($_POST['criterion_id'])) {
        // Update screening criterion
        $criterion_id = intval($_POST['criterion_id']);
        $name = isset($_POST['name']) ? trim($_POST['name']) : '';
        $description = isset($_POST['description']) ? trim($_POST['description']) : '';
        $weight = isset($_POST['weight']) ? intval($_POST['weight']) : 1;
        
        if (empty($name)) {
            $error = "Criterion name is required";
        } elseif (empty($description)) {
            $error = "Description is required";
        } else {
            $result = $screeningModel->updateCriterion($criterion_id, $name, $description, $weight);
            if ($result) {
                $success = "Screening criterion updated successfully";
            } else {
                $error = "Failed to update screening criterion";
            }
        }
    }
}

// Get all screening criteria
$criteria = $screeningModel->getAllCriteria();

// Get applications requiring screening
$applications = $applicationModel->getPendingApplications();
?>

<div class="container-fluid">
    <h1 class="h3 mb-4 text-gray-800">Applicant Screening</h1>
    
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
            <!-- Applications requiring screening -->
            <div class="card shadow mb-4">
                <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">Applications Requiring Screening</h6>
                </div>
                <div class="card-body">
                    <?php if (count($applications) > 0): ?>
                        <div class="table-responsive">
                            <table class="table table-bordered" id="applicationsTable" width="100%" cellspacing="0">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Applicant</th>
                                        <th>Property/Unit</th>
                                        <th>Date Applied</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php foreach ($applications as $application): ?>
                                        <tr>
                                            <td><?php echo $application['id']; ?></td>
                                            <td><?php echo $application['first_name'] . ' ' . $application['last_name']; ?></td>
                                            <td><?php echo $application['property_name'] . ' / ' . $application['unit_number']; ?></td>
                                            <td><?php echo date('M d, Y', strtotime($application['application_date'])); ?></td>
                                            <td>
                                                <span class="badge badge-<?php 
                                                    if ($application['status'] == 'pending') echo 'warning';
                                                    elseif ($application['status'] == 'under_review') echo 'info';
                                                    else echo 'secondary';
                                                ?>">
                                                    <?php echo ucfirst(str_replace('_', ' ', $application['status'])); ?>
                                                </span>
                                            </td>
                                            <td>
                                                <a href="review_application.php?id=<?php echo $application['id']; ?>" class="btn btn-primary btn-sm">
                                                    <i class="fas fa-search"></i> Review
                                                </a>
                                            </td>
                                        </tr>
                                    <?php endforeach; ?>
                                </tbody>
                            </table>
                        </div>
                    <?php else: ?>
                        <div class="text-center py-4">
                            <i class="fas fa-clipboard-check fa-3x text-muted mb-3"></i>
                            <p>No applications awaiting screening at this time.</p>
                        </div>
                    <?php endif; ?>
                </div>
            </div>
            
            <!-- Screening Criteria List -->
            <div class="card shadow mb-4">
                <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">Screening Criteria</h6>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-bordered" id="criteriaTable" width="100%" cellspacing="0">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Weight</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php if (count($criteria) > 0): ?>
                                    <?php foreach ($criteria as $criterion): ?>
                                        <tr>
                                            <td><?php echo $criterion['name']; ?></td>
                                            <td><?php echo $criterion['description']; ?></td>
                                            <td><?php echo $criterion['weight']; ?></td>
                                            <td>
                                                <button type="button" class="btn btn-info btn-sm edit-criterion" 
                                                        data-id="<?php echo $criterion['id']; ?>"
                                                        data-name="<?php echo $criterion['name']; ?>"
                                                        data-description="<?php echo $criterion['description']; ?>"
                                                        data-weight="<?php echo $criterion['weight']; ?>">
                                                    <i class="fas fa-edit"></i>
                                                </button>
                                                <button type="button" class="btn btn-danger btn-sm delete-criterion" 
                                                        data-id="<?php echo $criterion['id']; ?>"
                                                        data-name="<?php echo $criterion['name']; ?>">
                                                    <i class="fas fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    <?php endforeach; ?>
                                <?php else: ?>
                                    <tr>
                                        <td colspan="4" class="text-center">No screening criteria found</td>
                                    </tr>
                                <?php endif; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="col-lg-4">
            <!-- Add Criterion Form -->
            <div class="card shadow mb-4">
                <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">Add Screening Criterion</h6>
                </div>
                <div class="card-body">
                    <form method="POST" action="">
                        <input type="hidden" name="action" value="add">
                        
                        <div class="form-group">
                            <label for="name">Criterion Name</label>
                            <input type="text" class="form-control" id="name" name="name" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="description">Description</label>
                            <textarea class="form-control" id="description" name="description" rows="3" required></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label for="weight">Weight (Importance)</label>
                            <select class="form-control" id="weight" name="weight">
                                <option value="1">Low (1)</option>
                                <option value="2">Medium (2)</option>
                                <option value="3" selected>High (3)</option>
                                <option value="4">Critical (4)</option>
                                <option value="5">Mandatory (5)</option>
                            </select>
                        </div>
                        
                        <button type="submit" class="btn btn-primary btn-block">
                            <i class="fas fa-save"></i> Add Criterion
                        </button>
                    </form>
                </div>
            </div>
            
            <!-- Screening Guidelines -->
            <div class="card shadow mb-4">
                <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">Screening Guidelines</h6>
                </div>
                <div class="card-body">
                    <div class="alert alert-info" role="alert">
                        <h5>How to use this system:</h5>
                        <ol>
                            <li>Define screening criteria with appropriate weights</li>
                            <li>Review pending applications using these criteria</li>
                            <li>Mark each criterion as passed/failed during review</li>
                            <li>Make final decision based on overall score</li>
                        </ol>
                    </div>
                    
                    <h6 class="font-weight-bold mt-3">Weight Significance:</h6>
                    <ul class="list-group mb-3">
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            Low (1)
                            <span class="badge badge-primary badge-pill">1</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            Medium (2)
                            <span class="badge badge-primary badge-pill">2</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            High (3)
                            <span class="badge badge-primary badge-pill">3</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            Critical (4)
                            <span class="badge badge-danger badge-pill">4</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            Mandatory (5)
                            <span class="badge badge-danger badge-pill">5</span>
                        </li>
                    </ul>
                    
                    <p><strong>Note:</strong> Failure on a Mandatory criterion results in automatic application rejection.</p>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Edit Criterion Modal -->
<div class="modal fade" id="editCriterionModal" tabindex="-1" role="dialog" aria-labelledby="editCriterionModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="editCriterionModalLabel">Edit Screening Criterion</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <form method="POST" action="">
                <div class="modal-body">
                    <input type="hidden" name="action" value="update">
                    <input type="hidden" name="criterion_id" id="edit_criterion_id">
                    
                    <div class="form-group">
                        <label for="edit_name">Criterion Name</label>
                        <input type="text" class="form-control" id="edit_name" name="name" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="edit_description">Description</label>
                        <textarea class="form-control" id="edit_description" name="description" rows="3" required></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="edit_weight">Weight (Importance)</label>
                        <select class="form-control" id="edit_weight" name="weight">
                            <option value="1">Low (1)</option>
                            <option value="2">Medium (2)</option>
                            <option value="3">High (3)</option>
                            <option value="4">Critical (4)</option>
                            <option value="5">Mandatory (5)</option>
                        </select>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-primary">Save Changes</button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- Delete Criterion Modal -->
<div class="modal fade" id="deleteCriterionModal" tabindex="-1" role="dialog" aria-labelledby="deleteCriterionModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="deleteCriterionModalLabel">Delete Screening Criterion</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <p>Are you sure you want to delete the criterion "<span id="delete_criterion_name"></span>"?</p>
                <p class="text-danger">This action cannot be undone.</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                <form method="POST" action="">
                    <input type="hidden" name="action" value="delete">
                    <input type="hidden" name="criterion_id" id="delete_criterion_id">
                    <button type="submit" class="btn btn-danger">Delete</button>
                </form>
            </div>
        </div>
    </div>
</div>

<script>
$(document).ready(function() {
    $('#applicationsTable').DataTable();
    $('#criteriaTable').DataTable();
    
    // Edit criterion modal
    $('.edit-criterion').click(function() {
        const id = $(this).data('id');
        const name = $(this).data('name');
        const description = $(this).data('description');
        const weight = $(this).data('weight');
        
        $('#edit_criterion_id').val(id);
        $('#edit_name').val(name);
        $('#edit_description').val(description);
        $('#edit_weight').val(weight);
        
        $('#editCriterionModal').modal('show');
    });
    
    // Delete criterion modal
    $('.delete-criterion').click(function() {
        const id = $(this).data('id');
        const name = $(this).data('name');
        
        $('#delete_criterion_id').val(id);
        $('#delete_criterion_name').text(name);
        
        $('#deleteCriterionModal').modal('show');
    });
});
</script>

<?php require_once '../includes/footer.php'; ?>
