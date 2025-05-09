
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
    'includes',
    'models',
    'pages',
    'api'
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

// Step 5: Seed sample data (optional)
echo "<div class='step'>";
echo "<h3>Step 5: Sample Data (Optional)</h3>";

echo "<form method='post' action='" . $_SERVER['PHP_SELF'] . "'>";
echo "<div class='form-check mb-3'>";
echo "<input class='form-check-input' type='checkbox' name='seed_data' id='seed_data' " . (isset($_POST['seed_data']) ? 'checked' : '') . ">";
echo "<label class='form-check-label' for='seed_data'>Install sample data (recommended for testing)</label>";
echo "</div>";

if (isset($_POST['seed_data']) && $_POST['seed_data'] == 'on') {
    try {
        require_once 'config/database.php';
        $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
        
        if ($conn->connect_error) {
            throw new Exception("Connection failed: " . $conn->connect_error);
        }
        
        // Sample properties
        $properties = [
            ['Sunset Apartments', '123 Sunset Blvd', 'Los Angeles', 'CA', '90210', 'Apartment Complex', '2010-05-15', 15, 200000],
            ['Ocean View Condos', '456 Beach Dr', 'Miami', 'FL', '33139', 'Condominium', '2015-10-10', 8, 350000],
            ['Mountain Retreat', '789 Pine Rd', 'Denver', 'CO', '80202', 'Single Family', '2018-07-20', 1, 450000]
        ];
        
        foreach ($properties as $property) {
            $stmt = $conn->prepare("INSERT INTO properties (name, address, city, state, zip, type, acquisition_date, units, purchase_price) 
                                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->bind_param("sssssssid", $property[0], $property[1], $property[2], $property[3], $property[4], 
                              $property[5], $property[6], $property[7], $property[8]);
            $stmt->execute();
            $stmt->close();
        }
        
        // Sample tenants
        $tenants = [
            ['John', 'Doe', 'john.doe@example.com', '555-123-4567', '1980-01-15'],
            ['Jane', 'Smith', 'jane.smith@example.com', '555-987-6543', '1985-05-20'],
            ['Michael', 'Johnson', 'michael.johnson@example.com', '555-456-7890', '1975-11-30']
        ];
        
        foreach ($tenants as $tenant) {
            $stmt = $conn->prepare("INSERT INTO tenants (first_name, last_name, email, phone, date_of_birth) 
                                    VALUES (?, ?, ?, ?, ?)");
            $stmt->bind_param("sssss", $tenant[0], $tenant[1], $tenant[2], $tenant[3], $tenant[4]);
            $stmt->execute();
            $stmt->close();
        }
        
        // Sample units
        for ($i = 1; $i <= 3; $i++) {
            $unit_number = "Unit " . $i;
            $property_id = $i;
            $bedrooms = rand(1, 3);
            $bathrooms = $bedrooms > 1 ? 2 : 1;
            $sq_ft = $bedrooms * 500 + 200;
            $rent = $bedrooms * 800 + 400;
            
            $stmt = $conn->prepare("INSERT INTO units (property_id, unit_number, bedrooms, bathrooms, sq_feet, rent_amount, status) 
                                    VALUES (?, ?, ?, ?, ?, ?, 'vacant')");
            $stmt->bind_param("isiidi", $property_id, $unit_number, $bedrooms, $bathrooms, $sq_ft, $rent);
            $stmt->execute();
            $stmt->close();
        }
        
        // Sample leases
        for ($i = 1; $i <= 3; $i++) {
            $unit_id = $i;
            $tenant_id = $i;
            $start_date = date('Y-m-d', strtotime('-6 months'));
            $end_date = date('Y-m-d', strtotime('+6 months'));
            $rent_amount = ($i * 500) + 500;
            $security_deposit = $rent_amount;
            
            $stmt = $conn->prepare("INSERT INTO leases (unit_id, tenant_id, start_date, end_date, rent_amount, security_deposit, status, lease_type, payment_due_day) 
                                    VALUES (?, ?, ?, ?, ?, ?, 'active', 'fixed-term', 1)");
            $stmt->bind_param("iissdd", $unit_id, $tenant_id, $start_date, $end_date, $rent_amount, $security_deposit);
            $stmt->execute();
            $stmt->close();
            
            // Sample lease ID
            $lease_id = $i;
            
            // Sample payments for each lease (last 3 months)
            for ($j = 3; $j >= 1; $j--) {
                $payment_date = date('Y-m-d', strtotime('-'.$j.' months'));
                $amount = $rent_amount;
                $payment_method = ($j % 3 == 0) ? 'check' : (($j % 3 == 1) ? 'cash' : 'online');
                $payment_type = 'rent';
                $reference_number = 'REF'.rand(1000, 9999);
                
                $stmt = $conn->prepare("INSERT INTO payments (lease_id, amount, payment_date, payment_method, payment_type, reference_number) 
                                        VALUES (?, ?, ?, ?, ?, ?)");
                $stmt->bind_param("idssss", $lease_id, $amount, $payment_date, $payment_method, $payment_type, $reference_number);
                $stmt->execute();
                $stmt->close();
            }
        }
        
        $conn->close();
        echo "<p>Sample data installed successfully! ✓</p>";
        $messages[] = "Sample data installed successfully.";
    } catch (Exception $e) {
        echo "<p>Sample data installation failed: " . $e->getMessage() . " ✗</p>";
        $success = false;
    }
} else {
    echo "<p>No sample data will be installed. You can add this later manually.</p>";
}

echo "<button type='submit' class='btn btn-primary'>Install Sample Data</button>";
echo "</form>";
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
