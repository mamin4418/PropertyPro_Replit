
<?php
// Include necessary files
require_once 'includes/header.php';
require_once 'includes/sidebar.php';
require_once 'models/Mortgage.php';
require_once 'models/Property.php';

// Initialize database connection
$db = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
if ($db->connect_error) {
    die("Connection failed: " . $db->connect_error);
}

// Initialize models
$mortgage = new Mortgage($db);
$property = new Property($db);

// Get all properties
$properties = $property->getAllProperties();

// Initialize variables
$id = isset($_GET['id']) ? intval($_GET['id']) : 0;
$isEditing = ($id > 0);
$mortgageData = [];
$errors = [];

// If editing, get mortgage data
if ($isEditing) {
    $mortgageData = $mortgage->getMortgageById($id);
    if (!$mortgageData) {
        echo "<script>alert('Mortgage not found.'); window.location.href = 'mortgages.php';</script>";
        exit;
    }
}

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Validate and collect form data
    $data = [
        'property_id' => isset($_POST['property_id']) ? intval($_POST['property_id']) : 0,
        'lender' => isset($_POST['lender']) ? trim($_POST['lender']) : '',
        'loan_amount' => isset($_POST['loan_amount']) ? floatval($_POST['loan_amount']) : 0,
        'interest_rate' => isset($_POST['interest_rate']) ? floatval($_POST['interest_rate']) : 0,
        'term_years' => isset($_POST['term_years']) ? intval($_POST['term_years']) : 0,
        'start_date' => isset($_POST['start_date']) ? trim($_POST['start_date']) : '',
        'payment_amount' => isset($_POST['payment_amount']) ? floatval($_POST['payment_amount']) : 0,
        'payment_frequency' => isset($_POST['payment_frequency']) ? trim($_POST['payment_frequency']) : '',
        'loan_number' => isset($_POST['loan_number']) ? trim($_POST['loan_number']) : '',
        'notes' => isset($_POST['notes']) ? trim($_POST['notes']) : ''
    ];
    
    // Validate required fields
    if ($data['property_id'] <= 0) {
        $errors[] = "Property is required.";
    }
    if (empty($data['lender'])) {
        $errors[] = "Lender is required.";
    }
    if ($data['loan_amount'] <= 0) {
        $errors[] = "Loan amount must be greater than zero.";
    }
    if ($data['interest_rate'] <= 0) {
        $errors[] = "Interest rate must be greater than zero.";
    }
    if ($data['term_years'] <= 0) {
        $errors[] = "Term years must be greater than zero.";
    }
    if (empty($data['start_date'])) {
        $errors[] = "Start date is required.";
    }
    if ($data['payment_amount'] <= 0) {
        $errors[] = "Payment amount must be greater than zero.";
    }
    if (empty($data['payment_frequency'])) {
        $errors[] = "Payment frequency is required.";
    }
    
    // If no errors, save the data
    if (empty($errors)) {
        if ($isEditing) {
            // Update existing mortgage
            if ($mortgage->updateMortgage($id, $data)) {
                echo "<script>alert('Mortgage updated successfully.'); window.location.href = 'mortgages.php';</script>";
                exit;
            } else {
                $errors[] = "Error updating mortgage.";
            }
        } else {
            // Add new mortgage
            if ($newId = $mortgage->addMortgage($data)) {
                echo "<script>alert('Mortgage added successfully.'); window.location.href = 'mortgages.php';</script>";
                exit;
            } else {
                $errors[] = "Error adding mortgage.";
            }
        }
    }
}
?>

<div class="content-wrapper">
    <div class="container-fluid">
        <div class="row mb-4">
            <div class="col-md-6">
                <h1 class="h3 mb-0 text-gray-800"><?= $isEditing ? 'Edit' : 'Add' ?> Mortgage</h1>
                <p class="mb-4"><?= $isEditing ? 'Update existing' : 'Create new' ?> mortgage details</p>
            </div>
            <div class="col-md-6 text-md-end">
                <a href="mortgages.php" class="btn btn-secondary">
                    <i class="fas fa-arrow-left me-2"></i>Back to Mortgages
                </a>
            </div>
        </div>
        
        <?php if (!empty($errors)): ?>
            <div class="alert alert-danger">
                <ul class="mb-0">
                    <?php foreach ($errors as $error): ?>
                        <li><?= $error ?></li>
                    <?php endforeach; ?>
                </ul>
            </div>
        <?php endif; ?>
        
        <div class="card shadow mb-4">
            <div class="card-header py-3">
                <h6 class="m-0 font-weight-bold text-primary"><?= $isEditing ? 'Edit' : 'New' ?> Mortgage Information</h6>
            </div>
            <div class="card-body">
                <form method="post" action="<?= $isEditing ? "add_mortgage.php?id=$id" : "add_mortgage.php" ?>">
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label for="property_id" class="form-label">Property <span class="text-danger">*</span></label>
                            <select name="property_id" id="property_id" class="form-select" required>
                                <option value="">Select Property</option>
                                <?php foreach ($properties as $p): ?>
                                    <option value="<?= $p['id'] ?>" <?= (isset($mortgageData['property_id']) && $mortgageData['property_id'] == $p['id']) ? 'selected' : '' ?>>
                                        <?= htmlspecialchars($p['name']) ?> (<?= htmlspecialchars($p['address']) ?>)
                                    </option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label for="lender" class="form-label">Lender <span class="text-danger">*</span></label>
                            <input type="text" class="form-control" id="lender" name="lender" 
                                   value="<?= isset($mortgageData['lender']) ? htmlspecialchars($mortgageData['lender']) : '' ?>" required>
                        </div>
                    </div>
                    
                    <div class="row mb-3">
                        <div class="col-md-4">
                            <label for="loan_amount" class="form-label">Loan Amount ($) <span class="text-danger">*</span></label>
                            <input type="number" step="0.01" min="0" class="form-control" id="loan_amount" name="loan_amount" 
                                   value="<?= isset($mortgageData['loan_amount']) ? $mortgageData['loan_amount'] : '' ?>" required>
                        </div>
                        <div class="col-md-4">
                            <label for="interest_rate" class="form-label">Interest Rate (%) <span class="text-danger">*</span></label>
                            <input type="number" step="0.01" min="0" class="form-control" id="interest_rate" name="interest_rate" 
                                   value="<?= isset($mortgageData['interest_rate']) ? $mortgageData['interest_rate'] : '' ?>" required>
                        </div>
                        <div class="col-md-4">
                            <label for="term_years" class="form-label">Term (Years) <span class="text-danger">*</span></label>
                            <input type="number" step="1" min="1" class="form-control" id="term_years" name="term_years" 
                                   value="<?= isset($mortgageData['term_years']) ? $mortgageData['term_years'] : '' ?>" required>
                        </div>
                    </div>
                    
                    <div class="row mb-3">
                        <div class="col-md-4">
                            <label for="start_date" class="form-label">Start Date <span class="text-danger">*</span></label>
                            <input type="date" class="form-control" id="start_date" name="start_date" 
                                   value="<?= isset($mortgageData['start_date']) ? $mortgageData['start_date'] : '' ?>" required>
                        </div>
                        <div class="col-md-4">
                            <label for="payment_amount" class="form-label">Payment Amount ($) <span class="text-danger">*</span></label>
                            <input type="number" step="0.01" min="0" class="form-control" id="payment_amount" name="payment_amount" 
                                   value="<?= isset($mortgageData['payment_amount']) ? $mortgageData['payment_amount'] : '' ?>" required>
                        </div>
                        <div class="col-md-4">
                            <label for="payment_frequency" class="form-label">Payment Frequency <span class="text-danger">*</span></label>
                            <select name="payment_frequency" id="payment_frequency" class="form-select" required>
                                <option value="">Select Frequency</option>
                                <option value="Monthly" <?= (isset($mortgageData['payment_frequency']) && $mortgageData['payment_frequency'] == 'Monthly') ? 'selected' : '' ?>>Monthly</option>
                                <option value="Bi-Weekly" <?= (isset($mortgageData['payment_frequency']) && $mortgageData['payment_frequency'] == 'Bi-Weekly') ? 'selected' : '' ?>>Bi-Weekly</option>
                                <option value="Weekly" <?= (isset($mortgageData['payment_frequency']) && $mortgageData['payment_frequency'] == 'Weekly') ? 'selected' : '' ?>>Weekly</option>
                                <option value="Quarterly" <?= (isset($mortgageData['payment_frequency']) && $mortgageData['payment_frequency'] == 'Quarterly') ? 'selected' : '' ?>>Quarterly</option>
                                <option value="Semi-Annually" <?= (isset($mortgageData['payment_frequency']) && $mortgageData['payment_frequency'] == 'Semi-Annually') ? 'selected' : '' ?>>Semi-Annually</option>
                                <option value="Annually" <?= (isset($mortgageData['payment_frequency']) && $mortgageData['payment_frequency'] == 'Annually') ? 'selected' : '' ?>>Annually</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label for="loan_number" class="form-label">Loan Number</label>
                            <input type="text" class="form-control" id="loan_number" name="loan_number" 
                                   value="<?= isset($mortgageData['loan_number']) ? htmlspecialchars($mortgageData['loan_number']) : '' ?>">
                        </div>
                        <div class="col-md-6">
                            <label for="notes" class="form-label">Notes</label>
                            <textarea class="form-control" id="notes" name="notes" rows="3"><?= isset($mortgageData['notes']) ? htmlspecialchars($mortgageData['notes']) : '' ?></textarea>
                        </div>
                    </div>
                    
                    <hr>
                    
                    <div class="row">
                        <div class="col-12">
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-save me-2"></i><?= $isEditing ? 'Update' : 'Save' ?> Mortgage
                            </button>
                            <a href="mortgages.php" class="btn btn-secondary">Cancel</a>
                            
                            <?php if ($isEditing): ?>
                                <a href="view_mortgage.php?id=<?= $id ?>" class="btn btn-info">
                                    <i class="fas fa-eye me-2"></i>View Details
                                </a>
                            <?php endif; ?>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<script>
    // Calculate monthly payment based on loan details
    function calculatePayment() {
        const loanAmount = parseFloat(document.getElementById('loan_amount').value) || 0;
        const interestRate = parseFloat(document.getElementById('interest_rate').value) || 0;
        const termYears = parseInt(document.getElementById('term_years').value) || 0;
        const frequency = document.getElementById('payment_frequency').value;
        
        if (loanAmount > 0 && interestRate > 0 && termYears > 0 && frequency === 'Monthly') {
            // Convert annual interest rate to monthly
            const monthlyRate = interestRate / 100 / 12;
            const numPayments = termYears * 12;
            
            // Calculate monthly payment: P = (r*PV)/(1-(1+r)^-n)
            const payment = (monthlyRate * loanAmount) / (1 - Math.pow(1 + monthlyRate, -numPayments));
            
            if (!isNaN(payment) && isFinite(payment)) {
                document.getElementById('payment_amount').value = payment.toFixed(2);
            }
        }
    }
    
    // Add event listeners to loan inputs to auto-calculate payment
    document.addEventListener('DOMContentLoaded', function() {
        const inputs = ['loan_amount', 'interest_rate', 'term_years'];
        inputs.forEach(function(id) {
            document.getElementById(id).addEventListener('change', calculatePayment);
        });
        
        document.getElementById('payment_frequency').addEventListener('change', function() {
            if (this.value === 'Monthly') {
                calculatePayment();
            }
        });
    });
</script>

<?php
require_once 'includes/footer.php';
$db->close();
?>
