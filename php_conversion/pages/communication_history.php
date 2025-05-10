
<?php
require_once '../includes/header.php';
require_once '../models/Communication.php';

// Initialize model
$communicationModel = new Communication($mysqli);

// Get communication ID from URL
$communication_id = isset($_GET['id']) ? intval($_GET['id']) : 0;

// Verify communication exists
$communication = $communicationModel->getCommunicationById($communication_id);
if (!$communication) {
    // Communication not found, redirect to communications page
    header("Location: communications.php?error=Communication not found");
    exit;
}

// Get the detailed communication thread/history
$thread = $communicationModel->getCommunicationThread($communication_id);
?>

<div class="container-fluid">
    <h1 class="h3 mb-4 text-gray-800">Communication History</h1>
    
    <div class="card shadow mb-4">
        <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">
                <?php echo $communication['subject']; ?>
                <span class="float-right">
                    <?php 
                    $type = $communication['type'];
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
                </span>
            </h6>
        </div>
        <div class="card-body">
            <div class="row mb-3">
                <div class="col-md-6">
                    <p><strong>Recipient:</strong> <?php echo $communication['recipient_name']; ?></p>
                    <p><strong>Sent Date:</strong> <?php echo date('M d, Y h:i A', strtotime($communication['sent_date'])); ?></p>
                </div>
                <div class="col-md-6">
                    <p>
                        <strong>Status:</strong> 
                        <?php if ($communication['status'] == 'sent'): ?>
                            <span class="badge badge-success">Sent</span>
                        <?php elseif ($communication['status'] == 'delivered'): ?>
                            <span class="badge badge-info">Delivered</span>
                        <?php elseif ($communication['status'] == 'read'): ?>
                            <span class="badge badge-primary">Read</span>
                        <?php elseif ($communication['status'] == 'failed'): ?>
                            <span class="badge badge-danger">Failed</span>
                        <?php else: ?>
                            <span class="badge badge-secondary">Pending</span>
                        <?php endif; ?>
                    </p>
                    <p><strong>Sender:</strong> <?php echo $communication['sender_name']; ?></p>
                </div>
            </div>
            
            <div class="card mb-4">
                <div class="card-header">
                    Original Message
                </div>
                <div class="card-body">
                    <p><?php echo nl2br($communication['message']); ?></p>
                </div>
            </div>
            
            <?php if (count($thread) > 0): ?>
                <h5>Communication Thread</h5>
                <div class="timeline">
                    <?php foreach ($thread as $message): ?>
                        <div class="card mb-3 <?php echo ($message['is_reply'] ? 'border-left-primary ml-4' : 'border-left-info'); ?>">
                            <div class="card-header bg-light">
                                <strong><?php echo ($message['is_reply'] ? $message['recipient_name'] . ' (Reply)' : $message['sender_name']); ?></strong>
                                <span class="float-right"><?php echo date('M d, Y h:i A', strtotime($message['sent_date'])); ?></span>
                            </div>
                            <div class="card-body">
                                <p><?php echo nl2br($message['message']); ?></p>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
            
            <div class="row mt-4">
                <div class="col-md-6">
                    <a href="send_message.php" class="btn btn-primary btn-block">
                        <i class="fas fa-reply"></i> Send New Message
                    </a>
                </div>
                <div class="col-md-6">
                    <a href="communications.php" class="btn btn-secondary btn-block">
                        <i class="fas fa-arrow-left"></i> Back to Communications
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>

<?php require_once '../includes/footer.php'; ?>
<?php
require_once '../includes/header.php';
require_once '../models/Communication.php';
require_once '../models/Tenant.php';
require_once '../models/Property.php';

// Initialize the model
$communicationModel = new Communication($mysqli);
$tenantModel = new Tenant($mysqli);
$propertyModel = new Property($mysqli);

// Get filter parameters
$type = isset($_GET['type']) ? $_GET['type'] : null;
$status = isset($_GET['status']) ? $_GET['status'] : null;
$tenant_id = isset($_GET['tenant_id']) ? intval($_GET['tenant_id']) : null;
$property_id = isset($_GET['property_id']) ? intval($_GET['property_id']) : null;
$start_date = isset($_GET['start_date']) ? $_GET['start_date'] : null;
$end_date = isset($_GET['end_date']) ? $_GET['end_date'] : null;

// Get communications with filters
$communications = $communicationModel->getCommunications($type, $status, $tenant_id, $property_id, $start_date, $end_date);

// Get tenants for filter dropdown
$tenants = $tenantModel->getAllTenants();

// Get properties for filter dropdown
$properties = $propertyModel->getAllProperties();

// Get communication stats
$stats = $communicationModel->getCommunicationStats();
?>

<div class="container-fluid">
    <h1 class="h3 mb-4 text-gray-800">Communication History</h1>
    
    <?php if (isset($_GET['success'])): ?>
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            <?php echo htmlspecialchars($_GET['success']); ?>
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
    <?php endif; ?>
    
    <!-- Stats Cards -->
    <div class="row mb-4">
        <div class="col-xl-3 col-md-6 mb-4">
            <div class="card border-left-primary shadow h-100 py-2">
                <div class="card-body">
                    <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                            <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                Total Communications</div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800"><?php echo $stats['total']; ?></div>
                        </div>
                        <div class="col-auto">
                            <i class="fas fa-comments fa-2x text-gray-300"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="col-xl-3 col-md-6 mb-4">
            <div class="card border-left-success shadow h-100 py-2">
                <div class="card-body">
                    <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                            <div class="text-xs font-weight-bold text-success text-uppercase mb-1">
                                Emails Sent</div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800"><?php echo $stats['email']; ?></div>
                        </div>
                        <div class="col-auto">
                            <i class="fas fa-envelope fa-2x text-gray-300"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="col-xl-3 col-md-6 mb-4">
            <div class="card border-left-info shadow h-100 py-2">
                <div class="card-body">
                    <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                            <div class="text-xs font-weight-bold text-info text-uppercase mb-1">
                                SMS Sent</div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800"><?php echo $stats['sms']; ?></div>
                        </div>
                        <div class="col-auto">
                            <i class="fas fa-sms fa-2x text-gray-300"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="col-xl-3 col-md-6 mb-4">
            <div class="card border-left-warning shadow h-100 py-2">
                <div class="card-body">
                    <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                            <div class="text-xs font-weight-bold text-warning text-uppercase mb-1">
                                Letters Generated</div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800"><?php echo $stats['letter']; ?></div>
                        </div>
                        <div class="col-auto">
                            <i class="fas fa-file-alt fa-2x text-gray-300"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Filters Card -->
    <div class="card shadow mb-4">
        <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">Filter Communications</h6>
        </div>
        <div class="card-body">
            <form method="GET" action="communication_history.php" class="form-inline">
                <div class="form-group mb-2 mr-2">
                    <label for="type" class="sr-only">Type</label>
                    <select class="form-control" id="type" name="type">
                        <option value="">All Types</option>
                        <option value="email" <?php echo isset($_GET['type']) && $_GET['type'] === 'email' ? 'selected' : ''; ?>>Email</option>
                        <option value="sms" <?php echo isset($_GET['type']) && $_GET['type'] === 'sms' ? 'selected' : ''; ?>>SMS</option>
                        <option value="letter" <?php echo isset($_GET['type']) && $_GET['type'] === 'letter' ? 'selected' : ''; ?>>Letter</option>
                    </select>
                </div>
                
                <div class="form-group mb-2 mr-2">
                    <label for="status" class="sr-only">Status</label>
                    <select class="form-control" id="status" name="status">
                        <option value="">All Statuses</option>
                        <option value="sent" <?php echo isset($_GET['status']) && $_GET['status'] === 'sent' ? 'selected' : ''; ?>>Sent</option>
                        <option value="delivered" <?php echo isset($_GET['status']) && $_GET['status'] === 'delivered' ? 'selected' : ''; ?>>Delivered</option>
                        <option value="failed" <?php echo isset($_GET['status']) && $_GET['status'] === 'failed' ? 'selected' : ''; ?>>Failed</option>
                    </select>
                </div>
                
                <div class="form-group mb-2 mr-2">
                    <label for="tenant_id" class="sr-only">Tenant</label>
                    <select class="form-control" id="tenant_id" name="tenant_id">
                        <option value="">All Tenants</option>
                        <?php if ($tenants): ?>
                            <?php foreach ($tenants as $tenant): ?>
                                <option value="<?php echo $tenant['id']; ?>" <?php echo isset($_GET['tenant_id']) && $_GET['tenant_id'] == $tenant['id'] ? 'selected' : ''; ?>>
                                    <?php echo htmlspecialchars($tenant['first_name'] . ' ' . $tenant['last_name']); ?>
                                </option>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </select>
                </div>
                
                <div class="form-group mb-2 mr-2">
                    <label for="property_id" class="sr-only">Property</label>
                    <select class="form-control" id="property_id" name="property_id">
                        <option value="">All Properties</option>
                        <?php if ($properties): ?>
                            <?php foreach ($properties as $property): ?>
                                <option value="<?php echo $property['id']; ?>" <?php echo isset($_GET['property_id']) && $_GET['property_id'] == $property['id'] ? 'selected' : ''; ?>>
                                    <?php echo htmlspecialchars($property['name']); ?>
                                </option>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </select>
                </div>
                
                <div class="form-group mb-2 mr-2">
                    <label for="start_date" class="sr-only">Start Date</label>
                    <input type="date" class="form-control" id="start_date" name="start_date" 
                           value="<?php echo isset($_GET['start_date']) ? htmlspecialchars($_GET['start_date']) : ''; ?>" 
                           placeholder="Start Date">
                </div>
                
                <div class="form-group mb-2 mr-2">
                    <label for="end_date" class="sr-only">End Date</label>
                    <input type="date" class="form-control" id="end_date" name="end_date" 
                           value="<?php echo isset($_GET['end_date']) ? htmlspecialchars($_GET['end_date']) : ''; ?>" 
                           placeholder="End Date">
                </div>
                
                <button type="submit" class="btn btn-primary mb-2 mr-2">Apply Filters</button>
                <a href="communication_history.php" class="btn btn-secondary mb-2">Reset</a>
            </form>
        </div>
    </div>
    
    <!-- Communications Table -->
    <div class="card shadow mb-4">
        <div class="card-header py-3 d-flex justify-content-between align-items-center">
            <h6 class="m-0 font-weight-bold text-primary">Communication History</h6>
            <a href="send_message.php" class="btn btn-primary btn-sm">
                <i class="fas fa-paper-plane"></i> Send New Message
            </a>
        </div>
        <div class="card-body">
            <div class="table-responsive">
                <table class="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Date</th>
                            <th>Type</th>
                            <th>Recipient</th>
                            <th>Subject/Title</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if ($communications && count($communications) > 0): ?>
                            <?php foreach ($communications as $communication): ?>
                                <tr>
                                    <td><?php echo $communication['id']; ?></td>
                                    <td><?php echo date('M d, Y H:i', strtotime($communication['sent_at'])); ?></td>
                                    <td>
                                        <?php
                                        $type_badge = '';
                                        $type_icon = '';
                                        switch($communication['type']) {
                                            case 'email':
                                                $type_badge = 'badge-primary';
                                                $type_icon = 'fa-envelope';
                                                break;
                                            case 'sms':
                                                $type_badge = 'badge-success';
                                                $type_icon = 'fa-sms';
                                                break;
                                            case 'letter':
                                                $type_badge = 'badge-info';
                                                $type_icon = 'fa-file-alt';
                                                break;
                                            default:
                                                $type_badge = 'badge-secondary';
                                                $type_icon = 'fa-comment';
                                        }
                                        ?>
                                        <span class="badge <?php echo $type_badge; ?>">
                                            <i class="fas <?php echo $type_icon; ?> mr-1"></i>
                                            <?php echo ucfirst(htmlspecialchars($communication['type'])); ?>
                                        </span>
                                    </td>
                                    <td><?php echo htmlspecialchars($communication['recipient_name']); ?></td>
                                    <td><?php echo htmlspecialchars($communication['subject']); ?></td>
                                    <td>
                                        <?php
                                        $status_badge = '';
                                        switch($communication['status']) {
                                            case 'sent':
                                                $status_badge = 'badge-primary';
                                                break;
                                            case 'delivered':
                                                $status_badge = 'badge-success';
                                                break;
                                            case 'read':
                                                $status_badge = 'badge-info';
                                                break;
                                            case 'failed':
                                                $status_badge = 'badge-danger';
                                                break;
                                            default:
                                                $status_badge = 'badge-secondary';
                                        }
                                        ?>
                                        <span class="badge <?php echo $status_badge; ?>">
                                            <?php echo ucfirst(htmlspecialchars($communication['status'])); ?>
                                        </span>
                                    </td>
                                    <td>
                                        <a href="view_communication.php?id=<?php echo $communication['id']; ?>" class="btn btn-info btn-sm">
                                            <i class="fas fa-eye"></i>
                                        </a>
                                        <a href="send_message.php?resend=<?php echo $communication['id']; ?>" class="btn btn-primary btn-sm">
                                            <i class="fas fa-sync-alt"></i> Resend
                                        </a>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        <?php else: ?>
                            <tr>
                                <td colspan="7" class="text-center">No communications found</td>
                            </tr>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<script>
$(document).ready(function() {
    // Initialize DataTable
    $('#dataTable').DataTable({
        "order": [[1, "desc"]] // Sort by date descending
    });
    
    // Initialize select2 for better dropdowns
    if ($.fn.select2) {
        $('#tenant_id, #property_id').select2({
            placeholder: "Select an option"
        });
    }
    
    // Auto-hide alerts after 5 seconds
    setTimeout(function() {
        $('.alert-success').fadeOut('slow');
    }, 5000);
});
</script>

<?php require_once '../includes/footer.php'; ?>
