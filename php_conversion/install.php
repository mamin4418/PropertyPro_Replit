
<?php
// Installation script for Property Management System

// Display header
echo "<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Property Management System Installation</title>
    <link rel='stylesheet' href='assets/css/style.css'>
    <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'>
    <link href='https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css' rel='stylesheet'>
    <style>
        body { padding: 20px; }
        .step { margin-bottom: 20px; padding: 15px; border-radius: 5px; }
        .step-pending { background-color: #f8f9fa; }
        .step-success { background-color: #d1e7dd; }
        .step-error { background-color: #f8d7da; }
        .install-container { max-width: 800px; margin: 0 auto; }
    </style>
</head>
<body>
    <div class='install-container'>
        <h1 class='mb-4'>Property Management System Installation</h1>";

$success = true;
$messages = [];

// Step 1: Check PHP version
echo "<div class='step " . (version_compare(PHP_VERSION, '7.4.0', '>=') ? 'step-success' : 'step-error') . "'>";
echo "<h3>Step 1: Checking PHP Version</h3>";
if (version_compare(PHP_VERSION, '7.4.0', '>=')) {
    echo "<p>PHP Version: " . PHP_VERSION . " ✓</p>";
} else {
    echo "<p>PHP Version: " . PHP_VERSION . " ✗ - PHP 7.4 or higher is required.</p>";
    $success = false;
}
echo "</div>";

// Step 2: Check required extensions
echo "<div class='step " . (extension_loaded('mysqli') ? 'step-success' : 'step-error') . "'>";
echo "<h3>Step 2: Checking Required Extensions</h3>";
if (extension_loaded('mysqli')) {
    echo "<p>MySQLi Extension: Installed ✓</p>";
} else {
    echo "<p>MySQLi Extension: Not Installed ✗ - Please install the MySQLi extension.</p>";
    $success = false;
}
echo "</div>";

// Step 3: Check folder permissions
$folders_to_check = [
    'assets',
    'config',
    'includes'
];

echo "<div class='step'>";
echo "<h3>Step 3: Checking Folder Permissions</h3>";
$all_permissions_ok = true;

foreach ($folders_to_check as $folder) {
    if (is_writable($folder)) {
        echo "<p>$folder: Writable ✓</p>";
    } else {
        echo "<p>$folder: Not Writable ✗ - Please set proper permissions.</p>";
        $all_permissions_ok = false;
        $success = false;
    }
}

echo "</div>";

// Step 4: Database connection and setup
echo "<div class='step'>";
echo "<h3>Step 4: Database Setup</h3>";

if (file_exists('config/database.php')) {
    require_once 'config/database.php';
    try {
        $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
        
        if ($conn->connect_error) {
            throw new Exception("Connection failed: " . $conn->connect_error);
        }
        
        echo "<p>Database Connection: Successful ✓</p>";
        
        // Run the initialization script
        if (file_exists('database/init.php')) {
            require_once 'database/init.php';
            echo "<p>Database Initialization: Completed ✓</p>";
            $messages[] = "Database tables created successfully.";
        } else {
            echo "<p>Database Initialization: Failed ✗ - init.php not found</p>";
            $success = false;
        }
        
        $conn->close();
    } catch (Exception $e) {
        echo "<p>Database Connection: Failed ✗ - " . $e->getMessage() . "</p>";
        echo "<p>Please check your database configuration in config/database.php</p>";
        $success = false;
    }
} else {
    echo "<p>Database Configuration: Not Found ✗ - config/database.php does not exist</p>";
    $success = false;
}
echo "</div>";

// Final status
echo "<div class='step " . ($success ? 'step-success' : 'step-error') . "'>";
echo "<h3>Installation " . ($success ? 'Completed' : 'Failed') . "</h3>";

if ($success) {
    echo "<p>The Property Management System has been successfully installed!</p>";
    echo "<p>You can now <a href='index.php'>access the system</a>.</p>";
    
    // Create a file to indicate successful installation
    file_put_contents('.installed', date('Y-m-d H:i:s'));
} else {
    echo "<p>Installation failed. Please address the issues above and try again.</p>";
}

foreach ($messages as $message) {
    echo "<p>$message</p>";
}

echo "</div>";

// Footer
echo "</div>
    <script src='https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js'></script>
</body>
</html>";
?>
