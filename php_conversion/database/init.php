<?php
// Initialize the database schema.  Using the original's database connection method
$mysqli = require __DIR__ . '/../config/database.php';

// Create database connection (from edited code, adapting to original's $mysqli)
//$database = new Database();
//$db = $database->getConnection();


// SQL statements to create tables (from edited code, replacing the original's table creation)
$tables = [
    // Properties table
    "CREATE TABLE IF NOT EXISTS properties (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        address VARCHAR(255) NOT NULL,
        city VARCHAR(100) NOT NULL,
        state VARCHAR(50) NOT NULL,
        zip VARCHAR(20) NOT NULL,
        type VARCHAR(50) NOT NULL,
        acquisition_date DATE,
        purchase_price DECIMAL(10, 2),
        current_value DECIMAL(10, 2),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )",

    // Units table
    "CREATE TABLE IF NOT EXISTS units (
        id INT AUTO_INCREMENT PRIMARY KEY,
        property_id INT NOT NULL,
        unit_number VARCHAR(50) NOT NULL,
        description VARCHAR(255),
        bedrooms INT,
        bathrooms DECIMAL(3, 1),
        square_feet INT,
        rent_amount DECIMAL(10, 2),
        status VARCHAR(50) DEFAULT 'vacant', -- vacant, occupied, maintenance
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
    )",

    // Tenants table
    "CREATE TABLE IF NOT EXISTS tenants (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(20),
        emergency_contact_name VARCHAR(200),
        emergency_contact_phone VARCHAR(20),
        date_of_birth DATE,
        social_security VARCHAR(20),
        id_type VARCHAR(50),
        id_number VARCHAR(50),
        income_source VARCHAR(100),
        monthly_income DECIMAL(10, 2),
        employment_status VARCHAR(50),
        employer_name VARCHAR(200),
        employer_phone VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )",

    // Leases table
    "CREATE TABLE IF NOT EXISTS leases (
        id INT AUTO_INCREMENT PRIMARY KEY,
        unit_id INT NOT NULL,
        tenant_id INT NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        rent_amount DECIMAL(10, 2) NOT NULL,
        security_deposit DECIMAL(10, 2),
        status VARCHAR(50) DEFAULT 'active', -- active, expired, terminated, pending
        lease_type VARCHAR(50) NOT NULL, -- month-to-month, fixed-term
        payment_due_day INT NOT NULL DEFAULT 1,
        late_fee_amount DECIMAL(10, 2),
        late_fee_days INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE,
        FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
    )",

    // Payments table
    "CREATE TABLE IF NOT EXISTS payments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        lease_id INT NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        payment_date DATE NOT NULL,
        payment_method VARCHAR(50) NOT NULL, -- check, cash, online, bank transfer
        payment_type VARCHAR(50) NOT NULL, -- rent, deposit, fee, utility, other
        reference_number VARCHAR(100),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (lease_id) REFERENCES leases(id) ON DELETE CASCADE
    )",

    // Maintenance requests table
    "CREATE TABLE IF NOT EXISTS maintenance_requests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        property_id INT NOT NULL,
        unit_id INT,
        tenant_id INT,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        priority VARCHAR(50) DEFAULT 'medium', -- low, medium, high, emergency
        status VARCHAR(50) DEFAULT 'open', -- open, in progress, completed, cancelled
        request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        scheduled_date DATE,
        completion_date DATE,
        cost DECIMAL(10, 2),
        assigned_to VARCHAR(100),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
        FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE SET NULL,
        FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE SET NULL
    )",

    // Utility accounts table
    "CREATE TABLE IF NOT EXISTS utility_accounts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        property_id INT NOT NULL,
        unit_id INT,
        provider_name VARCHAR(100) NOT NULL,
        utility_type VARCHAR(50) NOT NULL, -- electricity, water, gas, internet, etc.
        account_number VARCHAR(100) NOT NULL,
        billing_day INT NOT NULL DEFAULT 1,
        auto_pay BOOLEAN DEFAULT 0,
        avg_cost DECIMAL(10, 2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
        FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE SET NULL
    )",

    // Utility bills table
    "CREATE TABLE IF NOT EXISTS utility_bills (
        id INT AUTO_INCREMENT PRIMARY KEY,
        utility_account_id INT NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        issue_date DATE NOT NULL,
        due_date DATE NOT NULL,
        status VARCHAR(50) DEFAULT 'pending', -- pending, paid, overdue, disputed
        payment_date DATE,
        payment_reference VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (utility_account_id) REFERENCES utility_accounts(id) ON DELETE CASCADE
    )",

    // Inspections table
    "CREATE TABLE IF NOT EXISTS inspections (
        id INT AUTO_INCREMENT PRIMARY KEY,
        property_id INT NOT NULL,
        unit_id INT,
        type VARCHAR(50) NOT NULL, -- annual, move-in, move-out, maintenance, etc.
        scheduled_date DATE NOT NULL,
        completed_date DATE,
        inspector_name VARCHAR(100) NOT NULL,
        status VARCHAR(50) DEFAULT 'scheduled', -- scheduled, completed, cancelled
        findings TEXT,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
        FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE SET NULL
    )",

    // Documents table
    "CREATE TABLE IF NOT EXISTS documents (
        id INT AUTO_INCREMENT PRIMARY KEY,
        property_id INT,
        unit_id INT,
        tenant_id INT,
        lease_id INT,
        title VARCHAR(255) NOT NULL,
        file_path VARCHAR(255) NOT NULL,
        document_type VARCHAR(50) NOT NULL, -- lease, addendum, notice, receipt, etc.
        upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE SET NULL,
        FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE SET NULL,
        FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE SET NULL,
        FOREIGN KEY (lease_id) REFERENCES leases(id) ON DELETE SET NULL
    )"
];

// Execute each table creation statement
$success = true;
foreach ($tables as $sql) {
    if (!$mysqli->query($sql)) {
        echo "Error creating table: " . $mysqli->error . "<br>";
        $success = false;
    }
}

if ($success) {
    echo "Database tables created successfully!<br>";

    // Insert sample data for testing if needed
    $sampleData = [
        // Sample property
        "INSERT INTO properties (name, address, city, state, zip, type) 
         VALUES ('Oakwood Apartments', '123 Main St', 'Springfield', 'IL', '62701', 'Multi-family') 
         ON DUPLICATE KEY UPDATE name = name",

        // Sample units
        "INSERT INTO units (property_id, unit_number, description, bedrooms, bathrooms, square_feet, rent_amount) 
         VALUES (1, '101', '1-bedroom apartment on first floor', 1, 1, 750, 1200) 
         ON DUPLICATE KEY UPDATE property_id = property_id",

        "INSERT INTO units (property_id, unit_number, description, bedrooms, bathrooms, square_feet, rent_amount) 
         VALUES (1, '102', '2-bedroom apartment on first floor', 2, 1.5, 950, 1500) 
         ON DUPLICATE KEY UPDATE property_id = property_id",

        // Sample tenant
        "INSERT INTO tenants (first_name, last_name, email, phone) 
         VALUES ('John', 'Doe', 'john.doe@example.com', '555-123-4567') 
         ON DUPLICATE KEY UPDATE first_name = first_name",

        // Sample lease
        "INSERT INTO leases (unit_id, tenant_id, start_date, end_date, rent_amount, security_deposit, lease_type, payment_due_day) 
         VALUES (1, 1, '2023-01-01', '2024-01-01', 1200, 1200, 'fixed-term', 1) 
         ON DUPLICATE KEY UPDATE unit_id = unit_id",

        // Sample maintenance request
        "INSERT INTO maintenance_requests (property_id, unit_id, tenant_id, title, description, priority) 
         VALUES (1, 1, 1, 'Leaky Faucet', 'The bathroom faucet is leaking constantly', 'medium') 
         ON DUPLICATE KEY UPDATE property_id = property_id"
    ];

    foreach ($sampleData as $sql) {
        if (!$mysqli->query($sql)) {
            echo "Error inserting sample data: " . $mysqli->error . "<br>";
        }
    }

    echo "Sample data inserted successfully!<br>";
}


//The rest of the original code is removed because it is replaced by the edited code.


echo "Database initialization completed!";
?>