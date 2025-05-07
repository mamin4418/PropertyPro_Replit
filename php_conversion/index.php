
<?php
session_start();
require_once 'includes/functions.php';

// Get page from URL parameter
$page = isset($_GET['page']) ? $_GET['page'] : 'dashboard';

// Check if user is logged in (except for login and register pages)
if (!isset($_SESSION['user_id']) && !in_array($page, ['login', 'register'])) {
    // Redirect to login page
    header("Location: index.php?page=login");
    exit;
}

// Include header
include 'includes/header.php';

// Include sidebar for logged-in users
if (isset($_SESSION['user_id'])) {
    include 'includes/sidebar.php';
}

// Include the requested page
$file_path = 'pages/' . $page . '.php';
if (file_exists($file_path)) {
    include $file_path;
} else {
    include 'pages/404.php';
}

// Include footer
include 'includes/footer.php';
?>
