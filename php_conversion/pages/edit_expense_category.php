
<?php
require_once '../includes/header.php';
require_once '../models/ExpenseCategory.php';

// Initialize the expense category model
$expenseCategoryModel = new ExpenseCategory($mysqli);

// Get category ID from URL
$category_id = isset($_GET['id']) ? intval($_GET['id']) : 0;

// Check if category exists
$category = $expenseCategoryModel->getExpenseCategoryById($category_id);
if (!$category) {
    // Redirect to categories list if category not found
    header('Location: expense_categories.php?error=Category not found');
    exit;
}

$success = '';
$error = '';

// Process form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = isset($_POST['name']) ? trim($_POST['name']) : '';
    $description = isset($_POST['description']) ? trim($_POST['description']) : '';
    
    // Validate input
    if (empty($name)) {
        $error = 'Category name is required';
    } else {
        // Update expense category
        $result = $expenseCategoryModel->updateExpenseCategory($category_id, $name, $description);
        
        if ($result) {
            $success = 'Expense category updated successfully';
            // Refresh category data
            $category = $expenseCategoryModel->getExpenseCategoryById($category_id);
        } else {
            $error = 'Failed to update expense category';
        }
    }
}
?>

<div class="container-fluid">
    <h1 class="h3 mb-4 text-gray-800">Edit Expense Category</h1>
    
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
            <h6 class="m-0 font-weight-bold text-primary">Edit Category Details</h6>
        </div>
        <div class="card-body">
            <form method="POST" action="">
                <div class="form-group">
                    <label for="name">Category Name <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="name" name="name" value="<?php echo htmlspecialchars($category['name']); ?>" required>
                </div>
                
                <div class="form-group">
                    <label for="description">Description</label>
                    <textarea class="form-control" id="description" name="description" rows="3"><?php echo htmlspecialchars($category['description']); ?></textarea>
                </div>
                
                <div class="form-group row">
                    <div class="col-sm-6">
                        <button type="submit" class="btn btn-primary btn-block">
                            <i class="fas fa-save"></i> Update Category
                        </button>
                    </div>
                    <div class="col-sm-6">
                        <a href="expense_categories.php" class="btn btn-secondary btn-block">
                            <i class="fas fa-arrow-left"></i> Back to Categories
                        </a>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>

<?php require_once '../includes/footer.php'; ?>
