
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
        
        // Set up default roles and permissions
        $roles = [
            ['admin', 'Administrator with full access to the system'],
            ['property_manager', 'Property manager with access to assigned properties'],
            ['owner', 'Property owner with limited access'],
            ['tenant', 'Tenant with access to their own information'],
            ['maintenance', 'Maintenance staff with access to maintenance requests'],
            ['accountant', 'Accountant with access to financial information']
        ];
        
        foreach ($roles as $role) {
            $stmt = $conn->prepare("INSERT IGNORE INTO roles (name, description) VALUES (?, ?)");
            $stmt->bind_param("ss", $role[0], $role[1]);
            $stmt->execute();
            $stmt->close();
        }
        
        // Create default admin user
        $username = 'admin';
        $password = password_hash('admin123', PASSWORD_DEFAULT);
        $email = 'admin@example.com';
        $first_name = 'System';
        $last_name = 'Administrator';
        $role = 'admin';
        
        $stmt = $conn->prepare("INSERT IGNORE INTO users (username, password, email, first_name, last_name, role) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssss", $username, $password, $email, $first_name, $last_name, $role);
        $stmt->execute();
        $stmt->close();
        
        // Set up default expense categories
        $expenseCategories = [
            ['Maintenance', 'Regular maintenance expenses'],
            ['Utilities', 'Utility bills including water, electricity, gas, etc.'],
            ['Insurance', 'Property insurance expenses'],
            ['Taxes', 'Property taxes'],
            ['Mortgage', 'Mortgage payments'],
            ['Management', 'Property management fees'],
            ['Legal', 'Legal and professional fees'],
            ['Advertising', 'Marketing and advertising expenses'],
            ['Supplies', 'Office and maintenance supplies'],
            ['Other', 'Miscellaneous expenses']
        ];
        
        foreach ($expenseCategories as $category) {
            $stmt = $conn->prepare("INSERT IGNORE INTO expense_categories (name, description) VALUES (?, ?)");
            $stmt->bind_param("ss", $category[0], $category[1]);
            $stmt->execute();
            $stmt->close();
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
        
        // Sample bank accounts
        $bankAccounts = [
            ['Operating Account', '123456789', '987654321', 'First National Bank', 'checking', 10000, 10000],
            ['Reserve Account', '987654321', '123456789', 'First National Bank', 'savings', 5000, 5000]
        ];
        
        foreach ($bankAccounts as $account) {
            $stmt = $conn->prepare("INSERT INTO bank_accounts (account_name, account_number, routing_number, bank_name, account_type, opening_balance, current_balance) 
                                    VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->bind_param("sssssdd", $account[0], $account[1], $account[2], $account[3], $account[4], $account[5], $account[6]);
            $stmt->execute();
            $stmt->close();
        }
        
        // Sample applications
        $applications = [
            [1, 1, 'John', 'Smith', 'john.smith@example.com', '555-111-2222', '1985-06-15', '123 Current St', 'Springfield', 'IL', '62701', 'Jane Landlord', '555-333-4444', 'employed', 'Acme Corp', '555-555-6666', 4000],
            [1, 2, 'Sarah', 'Johnson', 'sarah.johnson@example.com', '555-777-8888', '1990-03-22', '456 Present Ave', 'Springfield', 'IL', '62702', 'Tom Owner', '555-999-0000', 'employed', 'XYZ Inc', '555-111-3333', 3500]
        ];
        
        foreach ($applications as $app) {
            $stmt = $conn->prepare("INSERT INTO applications (property_id, unit_id, first_name, last_name, email, phone, date_of_birth, current_address, current_city, current_state, current_zip, current_landlord_name, current_landlord_phone, employment_status, employer_name, employer_phone, monthly_income) 
                                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->bind_param("iisssssssssssssd", $app[0], $app[1], $app[2], $app[3], $app[4], $app[5], $app[6], $app[7], $app[8], $app[9], $app[10], $app[11], $app[12], $app[13], $app[14], $app[15], $app[16]);
            $stmt->execute();
            $stmt->close();
        }
        
        // Sample screening criteria
        $stmt = $conn->prepare("INSERT INTO screening_criteria (name, description, min_credit_score, min_income_ratio, criminal_check, eviction_check, employment_verification, landlord_verification) 
                               VALUES ('Standard Screening', 'Default screening criteria for all applicants', 650, 3.0, 1, 1, 1, 1)");
        $stmt->execute();
        $stmt->close();
        
        // Sample expenses
        $expenses = [
            [1, 1, 1, 250, '2023-01-15', 'Repair leaky faucet', 'check', 'CHK1001', 0, NULL, 1],
            [1, NULL, 2, 450, '2023-01-10', 'Electric bill for January', 'bank transfer', 'BT1002', 1, 'monthly', NULL],
            [2, NULL, 4, 1200, '2023-01-05', 'Property tax Q1', 'check', 'CHK1003', 1, 'quarterly', NULL]
        ];
        
        foreach ($expenses as $expense) {
            $stmt = $conn->prepare("INSERT INTO expenses (property_id, unit_id, category_id, amount, expense_date, description, payment_method, reference_number, recurring, recurring_interval, vendor_id) 
                                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->bind_param("iiidssssssi", $expense[0], $expense[1], $expense[2], $expense[3], $expense[4], $expense[5], $expense[6], $expense[7], $expense[8], $expense[9], $expense[10]);
            $stmt->execute();
            $stmt->close();
        }
        
        // Sample settings
        $settings = [
            ['company_name', 'Property Management System', 'general', 'text', 'Company name displayed in the system'],
            ['company_logo', 'assets/images/logo.png', 'general', 'text', 'Path to company logo'],
            ['date_format', 'Y-m-d', 'general', 'select', 'Default date format for the system'],
            ['currency_symbol', '$', 'general', 'text', 'Currency symbol for financial amounts'],
            ['default_theme', 'light', 'appearance', 'select', 'Default theme for the system'],
            ['email_from', 'noreply@propertymgmt.com', 'email', 'text', 'Default from email address'],
            ['smtp_host', 'smtp.example.com', 'email', 'text', 'SMTP server hostname'],
            ['smtp_port', '587', 'email', 'number', 'SMTP server port'],
            ['smtp_secure', 'tls', 'email', 'select', 'SMTP security protocol'],
            ['smtp_auth', '1', 'email', 'boolean', 'SMTP authentication required'],
            ['smtp_username', 'username', 'email', 'text', 'SMTP username'],
            ['smtp_password', 'password', 'email', 'text', 'SMTP password'],
            ['maintenance_notification', '1', 'notifications', 'boolean', 'Send notifications for maintenance requests'],
            ['payment_notification', '1', 'notifications', 'boolean', 'Send notifications for payments'],
            ['lease_expiration_notice', '30', 'notifications', 'number', 'Days before lease expiration to send notice']
        ];
        
        foreach ($settings as $setting) {
            $stmt = $conn->prepare("INSERT INTO settings (setting_key, setting_value, setting_group, setting_type, description) 
                                   VALUES (?, ?, ?, ?, ?)");
            $stmt->bind_param("sssss", $setting[0], $setting[1], $setting[2], $setting[3], $setting[4]);
            $stmt->execute();
            $stmt->close();
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
