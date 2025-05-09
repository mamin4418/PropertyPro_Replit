<?php
require_once '../includes/header.php';
require_once '../models/Payment.php';
require_once '../models/Lease.php';
require_once '../models/Tenant.php';
require_once '../models/Unit.php';
require_once '../models/Property.php';

// Initialize models
$paymentModel = new Payment($mysqli);
$leaseModel = new Lease($mysqli);
$tenantModel = new Tenant($mysqli);
$unitModel = new Unit($mysqli);
$propertyModel = new Property($mysqli);

// Get payment ID from URL
$payment_id = isset($_GET['id']) ? intval($_GET['id']) : 0;

// Verify payment exists
$payment = $paymentModel->getPaymentById($payment_id);
if (!$payment) {
    // Payment not found, redirect to payments page
    header("Location: payments.php?error=Payment not found");
    exit;
}

// Get lease details
$lease = $leaseModel->getLeaseById($payment['lease_id']);

// Get tenant details
$tenant = $tenantModel->getTenantById($lease['tenant_id']);

// Get unit details
$unit = $unitModel->getUnitById($lease['unit_id']);

// Get property details
$property = $propertyModel->getPropertyById($unit['property_id']);

// Format payment date
$payment_date = date('F j, Y', strtotime($payment['payment_date']));

// Format created/updated dates
$created_at = date('M d, Y h:i A', strtotime($payment['created_at']));
$updated_at = date('M d, Y h:i A', strtotime($payment['updated_at']));
?>

<div class="container-fluid">
    <h1 class="h3 mb-4 text-gray-800">View Payment</h1>

    <?php if (isset($_GET['success'])): ?>
        <div class="alert alert-success" role="alert">
            <?php echo $_GET['success']; ?>
        </div>
    <?php endif; ?>

    <div class="row">
        <div class="col-lg-8">
            <!-- Payment Details Card -->
            <div class="card shadow mb-4">
                <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                    <h6 class="m-0 font-weight-bold text-primary">Payment Details</h6>
                    <div>
                        <a href="edit_payment.php?id=<?php echo $payment_id; ?>" class="btn btn-primary btn-sm">
                            <i class="fas fa-edit"></i> Edit
                        </a>
                        <a href="payment_receipt.php?id=<?php echo $payment_id; ?>" class="btn btn-success btn-sm ml-2">
                            <i class="fas fa-file-invoice-dollar"></i> View Receipt
                        </a>
                    </div>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <p><strong>Payment ID:</strong> <?php echo $payment['id']; ?></p>
                            <p><strong>Amount:</strong> $<?php echo number_format($payment['amount'], 2); ?></p>
                            <p><strong>Payment Date:</strong> <?php echo $payment_date; ?></p>
                            <p><strong>Payment Method:</strong> <?php echo ucfirst($payment['payment_method']); ?></p>
                        </div>
                        <div class="col-md-6">
                            <p><strong>Payment Type:</strong> <?php echo ucfirst($payment['payment_type']); ?></p>
                            <p><strong>Reference Number:</strong> <?php echo $payment['reference_number'] ?: 'N/A'; ?></p>
                            <p><strong>Created:</strong> <?php echo $created_at; ?></p>
                            <p><strong>Last Updated:</strong> <?php echo $updated_at; ?></p>
                        </div>
                    </div>

                    <?php if (!empty($payment['notes'])): ?>
                        <div class="row mt-3">
                            <div class="col-12">
                                <h6 class="font-weight-bold">Notes:</h6>
                                <p><?php echo $payment['notes']; ?></p>
                            </div>
                        </div>
                    <?php endif; ?>
                </div>
            </div>

            <!-- Related Information Card -->
            <div class="card shadow mb-4">
                <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">Related Information</h6>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <h6 class="font-weight-bold">Tenant Information</h6>
                            <p><strong>Name:</strong> <?php echo $tenant['first_name'] . ' ' . $tenant['last_name']; ?></p>
                            <p><strong>Email:</strong> <?php echo $tenant['email']; ?></p>
                            <p><strong>Phone:</strong> <?php echo $tenant['phone']; ?></p>
                            <p><a href="view_tenant.php?id=<?php echo $tenant['id']; ?>" class="btn btn-info btn-sm">
                                <i class="fas fa-user"></i> View Tenant
                            </a></p>
                        </div>
                        <div class="col-md-6">
                            <h6 class="font-weight-bold">Lease Information</h6>
                            <p><strong>Lease ID:</strong> <?php echo $lease['id']; ?></p>
                            <p><strong>Start Date:</strong> <?php echo date('M d, Y', strtotime($lease['start_date'])); ?></p>
                            <p><strong>End Date:</strong> <?php echo date('M d, Y', strtotime($lease['end_date'])); ?></p>
                            <p><strong>Rent Amount:</strong> $<?php echo number_format($lease['rent_amount'], 2); ?></p>
                            <p><a href="leases.php?id=<?php echo $lease['id']; ?>" class="btn btn-info btn-sm">
                                <i class="fas fa-file-contract"></i> View Lease
                            </a></p>
                        </div>
                    </div>

                    <div class="row mt-4">
                        <div class="col-md-6">
                            <h6 class="font-weight-bold">Property Information</h6>
                            <p><strong>Name:</strong> <?php echo $property['name']; ?></p>
                            <p><strong>Address:</strong> <?php echo $property['address']; ?></p>
                            <p><strong>City:</strong> <?php echo $property['city'] . ', ' . $property['state'] . ' ' . $property['zip']; ?></p>
                            <p><a href="view_property.php?id=<?php echo $property['id']; ?>" class="btn btn-info btn-sm">
                                <i class="fas fa-building"></i> View Property
                            </a></p>
                        </div>
                        <div class="col-md-6">
                            <h6 class="font-weight-bold">Unit Information</h6>
                            <p><strong>Unit Number:</strong> <?php echo $unit['unit_number']; ?></p>
                            <p><strong>Bedrooms:</strong> <?php echo $unit['bedrooms']; ?></p>
                            <p><strong>Bathrooms:</strong> <?php echo $unit['bathrooms']; ?></p>
                            <p><strong>Rent Amount:</strong> $<?php echo number_format($unit['rent_amount'], 2); ?></p>
                            <p><a href="view_unit.php?id=<?php echo $unit['id']; ?>" class="btn btn-info btn-sm">
                                <i class="fas fa-home"></i> View Unit
                            </a></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-lg-4">
            <!-- Actions Card -->
            <div class="card shadow mb-4">
                <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">Actions</h6>
                </div>
                <div class="card-body">
                    <a href="payment_receipt.php?id=<?php echo $payment_id; ?>" class="btn btn-success btn-block mb-3">
                        <i class="fas fa-file-invoice-dollar"></i> Generate Receipt
                    </a>
                    <a href="edit_payment.php?id=<?php echo $payment_id; ?>" class="btn btn-primary btn-block mb-3">
                        <i class="fas fa-edit"></i> Edit Payment
                    </a>
                    <a href="#" class="btn btn-danger btn-block mb-3" data-toggle="modal" data-target="#deletePaymentModal">
                        <i class="fas fa-trash"></i> Delete Payment
                    </a>
                    <a href="payments.php" class="btn btn-secondary btn-block">
                        <i class="fas fa-arrow-left"></i> Back to Payments
                    </a>
                </div>
            </div>

            <!-- Payment Summary Card -->
            <div class="card shadow mb-4">
                <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">Payment Summary</h6>
                </div>
                <div class="card-body">
                    <div class="text-center mb-4">
                        <h1 class="text-primary">$<?php echo number_format($payment['amount'], 2); ?></h1>
                        <p class="text-muted">Payment made on <?php echo $payment_date; ?></p>
                        <div class="badge badge-primary mb-2">
                            <?php echo ucfirst($payment['payment_type']); ?>
                        </div>
                        <div class="badge badge-info">
                            <?php echo ucfirst($payment['payment_method']); ?>
                        </div>
                    </div>

                    <hr>

                    <div class="text-center">
                        <p><strong>Reference:</strong> <?php echo $payment['reference_number'] ?: 'N/A'; ?></p>
                        <p><strong>Status:</strong> <span class="badge badge-success">Completed</span></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Delete Payment Modal -->
<div class="modal fade" id="deletePaymentModal" tabindex="-1" role="dialog" aria-labelledby="deletePaymentModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="deletePaymentModalLabel">Confirm Delete</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                Are you sure you want to delete this payment? This action cannot be undone.
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                <form action="delete_payment.php" method="POST">
                    <input type="hidden" name="payment_id" value="<?php echo $payment_id; ?>">
                    <button type="submit" class="btn btn-danger">Delete Payment</button>
                </form>
            </div>
        </div>
    </div>
</div>

<?php require_once '../includes/footer.php'; ?>