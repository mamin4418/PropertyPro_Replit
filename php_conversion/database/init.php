<?php
// Initialize the database schema.  Using the original's database connection method
$mysqli = require __DIR__ . '/../config/database.php';

// Create database connection (from edited code, adapting to original's $mysqli)
//$database = new Database();
//$db = $database->getConnection();


// SQL statements to create tables (from edited code, replacing the original's table creation)
$tables = [
    // Users and roles tables
    "users" => "CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        role VARCHAR(50) NOT NULL DEFAULT 'user',
        status VARCHAR(20) NOT NULL DEFAULT 'active',
        last_login DATETIME,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )",

    "roles" => "CREATE TABLE IF NOT EXISTS roles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )",

    "permissions" => "CREATE TABLE IF NOT EXISTS permissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )",

    "role_permissions" => "CREATE TABLE IF NOT EXISTS role_permissions (
        role_id INT NOT NULL,
        permission_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (role_id, permission_id),
        FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
        FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
    )",

    "user_roles" => "CREATE TABLE IF NOT EXISTS user_roles (
        user_id INT NOT NULL,
        role_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, role_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
    )",

    // Companies table
    "companies" => "CREATE TABLE IF NOT EXISTS companies (
        id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        address VARCHAR(255),
        city VARCHAR(100),
        state VARCHAR(50),
        zip VARCHAR(20),
        phone VARCHAR(50),
        email VARCHAR(100),
        website VARCHAR(255),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )",

    "vendors" => "CREATE TABLE IF NOT EXISTS vendors (
        id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        contact_name VARCHAR(255),
        email VARCHAR(100),
        phone VARCHAR(50),
        service_type VARCHAR(100) NOT NULL,
        address VARCHAR(255),
        city VARCHAR(100),
        state VARCHAR(50),
        zip VARCHAR(20),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )",

    "properties" => "CREATE TABLE IF NOT EXISTS properties (
        id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        address VARCHAR(255) NOT NULL,
        city VARCHAR(100) NOT NULL,
        state VARCHAR(50) NOT NULL,
        zip VARCHAR(20) NOT NULL,
        property_type VARCHAR(50) NOT NULL,
        year_built INT(4),
        purchase_date DATE,
        purchase_price DECIMAL(12,2),
        market_value DECIMAL(12,2),
        status VARCHAR(50) DEFAULT 'Active',
        notes TEXT,
        company_id INT(11),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL
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

    // Payments table
    "CREATE TABLE IF NOT EXISTS payments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        lease_id INT NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        payment_date DATE NOT NULL,
        payment_method VARCHAR(50) NOT NULL, -- check, cash, online, bank transfer, credit card, other
        payment_type VARCHAR(50) NOT NULL, -- rent, deposit, fee, utility, other
        reference_number VARCHAR(100),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (lease_id) REFERENCES leases(id) ON DELETE CASCADE
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
    )",

    // Financial Management Tables
    "expense_categories" => "CREATE TABLE IF NOT EXISTS expense_categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        active BOOLEAN DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )",

    "expenses" => "CREATE TABLE IF NOT EXISTS expenses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        property_id INT,
        unit_id INT,
        category_id INT,
        amount DECIMAL(10, 2) NOT NULL,
        expense_date DATE NOT NULL,
        description TEXT,
        payment_method VARCHAR(50),
        reference_number VARCHAR(100),
        recurring BOOLEAN DEFAULT 0,
        recurring_interval VARCHAR(20), -- monthly, quarterly, yearly
        vendor_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE SET NULL,
        FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE SET NULL,
        FOREIGN KEY (category_id) REFERENCES expense_categories(id) ON DELETE SET NULL,
        FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE SET NULL
    )",

    "bank_accounts" => "CREATE TABLE IF NOT EXISTS bank_accounts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        account_name VARCHAR(100) NOT NULL,
        account_number VARCHAR(50),
        routing_number VARCHAR(50),
        bank_name VARCHAR(100) NOT NULL,
        account_type VARCHAR(50) NOT NULL, -- checking, savings, business
        opening_balance DECIMAL(10, 2) DEFAULT 0,
        current_balance DECIMAL(10, 2) DEFAULT 0,
        active BOOLEAN DEFAULT 1,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )",

    "transactions" => "CREATE TABLE IF NOT EXISTS transactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        bank_account_id INT NOT NULL,
        transaction_date DATE NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        description TEXT,
        type VARCHAR(20) NOT NULL, -- deposit, withdrawal, transfer
        category VARCHAR(50),
        reference_number VARCHAR(100),
        related_id INT, -- ID of related payment, expense, etc.
        related_type VARCHAR(50), -- payment, expense, mortgage, etc.
        reconciled BOOLEAN DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (bank_account_id) REFERENCES bank_accounts(id) ON DELETE CASCADE
    )",

    // Application and Screening System Tables
    "applications" => "CREATE TABLE IF NOT EXISTS applications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        property_id INT,
        unit_id INT,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        date_of_birth DATE,
        current_address VARCHAR(255),
        current_city VARCHAR(100),
        current_state VARCHAR(50),
        current_zip VARCHAR(20),
        current_landlord_name VARCHAR(100),
        current_landlord_phone VARCHAR(20),
        employment_status VARCHAR(50),
        employer_name VARCHAR(100),
        employer_phone VARCHAR(20),
        monthly_income DECIMAL(10, 2),
        additional_occupants INT DEFAULT 0,
        pets INT DEFAULT 0,
        pet_description TEXT,
        vehicle_make VARCHAR(50),
        vehicle_model VARCHAR(50),
        vehicle_year VARCHAR(4),
        license_plate VARCHAR(20),
        emergency_contact_name VARCHAR(100),
        emergency_contact_phone VARCHAR(20),
        emergency_contact_relation VARCHAR(50),
        status VARCHAR(50) DEFAULT 'pending', -- pending, approved, denied, cancelled
        screening_status VARCHAR(50) DEFAULT 'pending', -- pending, passed, failed
        application_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE SET NULL,
        FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE SET NULL
    )",

    "application_documents" => "CREATE TABLE IF NOT EXISTS application_documents (
        id INT AUTO_INCREMENT PRIMARY KEY,
        application_id INT NOT NULL,
        document_type VARCHAR(50) NOT NULL, -- id, paystub, bank statement, etc.
        file_path VARCHAR(255) NOT NULL,
        upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
    )",

    "screening_criteria" => "CREATE TABLE IF NOT EXISTS screening_criteria (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        min_credit_score INT,
        min_income_ratio DECIMAL(5, 2),
        criminal_check BOOLEAN DEFAULT 1,
        eviction_check BOOLEAN DEFAULT 1,
        employment_verification BOOLEAN DEFAULT 1,
        landlord_verification BOOLEAN DEFAULT 1,
        active BOOLEAN DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )",

    // Communication System Tables
    "communications" => "CREATE TABLE IF NOT EXISTS communications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sender_id INT,
        recipient_type VARCHAR(50) NOT NULL, -- tenant, vendor, owner, staff
        recipient_id INT NOT NULL,
        subject VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        communication_type VARCHAR(50) NOT NULL, -- email, sms, letter, notice, system
        status VARCHAR(50) DEFAULT 'sent', -- draft, sent, delivered, failed
        sent_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        attachment_path VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE SET NULL
    )",

    "communication_templates" => "CREATE TABLE IF NOT EXISTS communication_templates (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        template_type VARCHAR(50) NOT NULL, -- email, sms, letter, notice
        subject VARCHAR(255),
        body TEXT NOT NULL,
        placeholders TEXT, -- JSON string of available placeholders
        active BOOLEAN DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )",

    "notifications" => "CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        related_type VARCHAR(50), -- maintenance, payment, lease, application, etc.
        related_id INT,
        is_read BOOLEAN DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )",

    // System Settings Tables
    "settings" => "CREATE TABLE IF NOT EXISTS settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        setting_key VARCHAR(100) NOT NULL UNIQUE,
        setting_value TEXT,
        setting_group VARCHAR(50) NOT NULL, -- general, email, appearance, reports, etc.
        setting_type VARCHAR(50) NOT NULL, -- text, number, boolean, select, json, etc.
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )",

    "email_templates" => "CREATE TABLE IF NOT EXISTS email_templates (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        subject VARCHAR(255) NOT NULL,
        body TEXT NOT NULL,
        template_type VARCHAR(50) NOT NULL, -- welcome, receipt, maintenance, etc.
        placeholders TEXT, -- JSON string of available placeholders
        active BOOLEAN DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )",

    "system_logs" => "CREATE TABLE IF NOT EXISTS system_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        action VARCHAR(100) NOT NULL,
        entity_type VARCHAR(50), -- property, tenant, lease, etc.
        entity_id INT,
        description TEXT,
        ip_address VARCHAR(50),
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    )",

    // Reports table
    "saved_reports" => "CREATE TABLE IF NOT EXISTS saved_reports (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        name VARCHAR(100) NOT NULL,
        report_type VARCHAR(50) NOT NULL, -- financial, occupancy, maintenance, property, etc.
        parameters TEXT, -- JSON string of report parameters
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )",

    "report_templates" => "CREATE TABLE IF NOT EXISTS report_templates (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        report_type VARCHAR(50) NOT NULL, -- financial, occupancy, maintenance, property, etc.
        parameters TEXT, -- JSON string of default report parameters
        active BOOLEAN DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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
        "INSERT INTO properties (name, address, city, state, zip, property_type) 
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


echo "Database initialization completed!";
?>