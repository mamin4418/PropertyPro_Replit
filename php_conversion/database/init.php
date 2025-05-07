
<?php
// Initialize the database schema
$mysqli = require __DIR__ . '/../config/database.php';

// Create tables

// Companies table
$mysqli->query("CREATE TABLE IF NOT EXISTS companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    legal_name VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    ein VARCHAR(20),
    email VARCHAR(255),
    phone VARCHAR(20),
    type VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)");

// Properties table
$mysqli->query("CREATE TABLE IF NOT EXISTS properties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zipcode VARCHAR(20) NOT NULL,
    country VARCHAR(50) NOT NULL,
    total_units INT NOT NULL,
    size DECIMAL(10,2),
    year_built INT,
    purchase_price DECIMAL(12,2),
    purchase_date DATE,
    mortgage_amount DECIMAL(12,2),
    property_tax DECIMAL(10,2),
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL
)");

// Units table
$mysqli->query("CREATE TABLE IF NOT EXISTS units (
    id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT NOT NULL,
    unit_number VARCHAR(50) NOT NULL,
    type VARCHAR(50),
    bedrooms INT NOT NULL,
    bathrooms DECIMAL(3,1) NOT NULL,
    size DECIMAL(10,2),
    rent DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'vacant',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
)");

// Addresses table
$mysqli->query("CREATE TABLE IF NOT EXISTS addresses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    street_address VARCHAR(255) NOT NULL,
    unit VARCHAR(50),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zipcode VARCHAR(20) NOT NULL,
    country VARCHAR(50) NOT NULL DEFAULT 'USA',
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    address_type VARCHAR(50),
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)");

// Contacts table
$mysqli->query("CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    alternate_phone VARCHAR(20),
    company_name VARCHAR(255),
    title VARCHAR(100),
    website VARCHAR(255),
    notes TEXT,
    contact_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)");

// Contact Addresses join table
$mysqli->query("CREATE TABLE IF NOT EXISTS contact_addresses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    contact_id INT NOT NULL,
    address_id INT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE,
    FOREIGN KEY (address_id) REFERENCES addresses(id) ON DELETE CASCADE
)");

// Tenants table
$mysqli->query("CREATE TABLE IF NOT EXISTS tenants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    contact_id INT NOT NULL,
    date_of_birth DATE,
    ssn VARCHAR(20),
    driver_license VARCHAR(50),
    employer_name VARCHAR(255),
    employer_phone VARCHAR(20),
    income DECIMAL(10,2),
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    emergency_contact_relationship VARCHAR(100),
    type VARCHAR(50) NOT NULL DEFAULT 'primary',
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE
)");

// Leases table
$mysqli->query("CREATE TABLE IF NOT EXISTS leases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    unit_id INT NOT NULL,
    tenant_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    rent_amount DECIMAL(10,2) NOT NULL,
    security_deposit DECIMAL(10,2),
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    terms_and_conditions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
)");

// Payments table
$mysqli->query("CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lease_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_date DATE NOT NULL,
    payment_type VARCHAR(50) NOT NULL,
    payment_method VARCHAR(50),
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (lease_id) REFERENCES leases(id) ON DELETE CASCADE
)");

// Maintenance Requests table
$mysqli->query("CREATE TABLE IF NOT EXISTS maintenance_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    unit_id INT NOT NULL,
    tenant_id INT,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(20) NOT NULL DEFAULT 'normal',
    status VARCHAR(20) NOT NULL DEFAULT 'open',
    reported_date DATE NOT NULL,
    completed_date DATE,
    reported_by VARCHAR(255),
    assigned_to VARCHAR(255),
    notes TEXT,
    images TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE SET NULL
)");

// Property Amenities table
$mysqli->query("CREATE TABLE IF NOT EXISTS property_amenities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT NOT NULL,
    has_parking BOOLEAN DEFAULT FALSE,
    has_pool BOOLEAN DEFAULT FALSE,
    has_gym BOOLEAN DEFAULT FALSE,
    has_elevator BOOLEAN DEFAULT FALSE,
    has_laundry BOOLEAN DEFAULT FALSE,
    has_security BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
)");

// Vacancies table
$mysqli->query("CREATE TABLE IF NOT EXISTS vacancies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    unit_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    rent_amount DECIMAL(10,2) NOT NULL,
    deposit_amount DECIMAL(10,2) NOT NULL,
    available_from DATE NOT NULL,
    lease_duration INT,
    minimum_income DECIMAL(10,2),
    credit_score_requirement INT,
    pet_policy TEXT,
    pet_deposit DECIMAL(10,2),
    smoking_allowed BOOLEAN DEFAULT FALSE,
    included_utilities TEXT,
    advertising_channels TEXT,
    images TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE
)");

// Leads table
$mysqli->query("CREATE TABLE IF NOT EXISTS leads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    contact_id INT NOT NULL,
    vacancy_id INT,
    source VARCHAR(100),
    status VARCHAR(20) NOT NULL DEFAULT 'new',
    interest_level VARCHAR(20) DEFAULT 'medium',
    desired_move_in_date DATE,
    desired_rent_range VARCHAR(50),
    desired_bedrooms INT,
    desired_bathrooms DECIMAL(3,1),
    has_applied BOOLEAN DEFAULT FALSE,
    pre_qualified BOOLEAN DEFAULT FALSE,
    assigned_to INT,
    notes TEXT,
    last_contact_date TIMESTAMP,
    next_follow_up_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE,
    FOREIGN KEY (vacancy_id) REFERENCES vacancies(id) ON DELETE SET NULL
)");

// Application Templates table
$mysqli->query("CREATE TABLE IF NOT EXISTS application_templates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    application_fee DECIMAL(10,2),
    fields JSON NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)");

// Custom Fields table
$mysqli->query("CREATE TABLE IF NOT EXISTS custom_fields (
    id INT AUTO_INCREMENT PRIMARY KEY,
    template_id INT,
    field_name VARCHAR(100) NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    field_type VARCHAR(50) NOT NULL,
    options JSON,
    required BOOLEAN DEFAULT FALSE,
    help_text TEXT,
    validation_rules JSON,
    display_order INT DEFAULT 0,
    section VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (template_id) REFERENCES application_templates(id) ON DELETE SET NULL
)");

// Rental Applications table
$mysqli->query("CREATE TABLE IF NOT EXISTS rental_applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    contact_id INT NOT NULL,
    vacancy_id INT,
    lead_id INT,
    template_id INT,
    application_data JSON NOT NULL,
    desired_move_in_date DATE,
    application_fee DECIMAL(10,2),
    application_fee_paid BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) NOT NULL DEFAULT 'submitted',
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    background_check_authorized BOOLEAN DEFAULT FALSE,
    background_check_complete BOOLEAN DEFAULT FALSE,
    credit_check_complete BOOLEAN DEFAULT FALSE,
    credit_score INT,
    income_verified BOOLEAN DEFAULT FALSE,
    rental_history_verified BOOLEAN DEFAULT FALSE,
    employment_verified BOOLEAN DEFAULT FALSE,
    criminal_history_check BOOLEAN DEFAULT FALSE,
    approved_by INT,
    approval_date TIMESTAMP,
    denial_reason TEXT,
    denial_date TIMESTAMP,
    documents JSON,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE,
    FOREIGN KEY (vacancy_id) REFERENCES vacancies(id) ON DELETE SET NULL,
    FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE SET NULL,
    FOREIGN KEY (template_id) REFERENCES application_templates(id) ON DELETE SET NULL
)");

// Communication Logs table
$mysqli->query("CREATE TABLE IF NOT EXISTS communication_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    contact_id INT NOT NULL,
    lead_id INT,
    application_id INT,
    communication_type VARCHAR(50) NOT NULL,
    direction VARCHAR(20) NOT NULL,
    subject VARCHAR(255),
    content TEXT,
    sent_by INT,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'sent',
    attachments JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE,
    FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE SET NULL,
    FOREIGN KEY (application_id) REFERENCES rental_applications(id) ON DELETE SET NULL
)");

// Screening Criteria table
$mysqli->query("CREATE TABLE IF NOT EXISTS screening_criteria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    min_credit_score INT,
    min_income DECIMAL(10,2),
    income_verification_required BOOLEAN DEFAULT TRUE,
    eviction_threshold INT DEFAULT 0,
    criminal_history_policy TEXT,
    rental_history_required BOOLEAN DEFAULT TRUE,
    rental_history_years INT DEFAULT 2,
    is_active BOOLEAN DEFAULT TRUE,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)");

// Application Documents table
$mysqli->query("CREATE TABLE IF NOT EXISTS application_documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_id INT NOT NULL,
    document_type VARCHAR(50) NOT NULL,
    document_name VARCHAR(255) NOT NULL,
    document_url VARCHAR(255) NOT NULL,
    uploaded_by INT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending',
    verified_by INT,
    verified_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES rental_applications(id) ON DELETE CASCADE
)");

// Appliances table
$mysqli->query("CREATE TABLE IF NOT EXISTS appliances (
    id INT AUTO_INCREMENT PRIMARY KEY,
    unit_id INT NOT NULL,
    property_id INT NOT NULL,
    type VARCHAR(100) NOT NULL,
    make VARCHAR(100),
    model VARCHAR(100),
    serial_number VARCHAR(100),
    purchase_date DATE,
    install_date DATE,
    last_service_date DATE,
    warranty TEXT,
    notes TEXT,
    images TEXT,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
)");

// Insurances table
$mysqli->query("CREATE TABLE IF NOT EXISTS insurances (
    id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT NOT NULL,
    insurance_provider VARCHAR(255) NOT NULL,
    policy_number VARCHAR(100) NOT NULL,
    policy_type VARCHAR(50) NOT NULL,
    coverage_amount DECIMAL(12,2) NOT NULL,
    premium DECIMAL(10,2) NOT NULL,
    deductible DECIMAL(10,2),
    start_date DATE NOT NULL,
    end_date DATE,
    contact_name VARCHAR(255),
    contact_phone VARCHAR(20),
    contact_email VARCHAR(255),
    coverage_details TEXT,
    documents TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
)");

// Mortgages table
$mysqli->query("CREATE TABLE IF NOT EXISTS mortgages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT NOT NULL,
    lender VARCHAR(255) NOT NULL,
    loan_number VARCHAR(100) NOT NULL,
    loan_type VARCHAR(50) NOT NULL,
    original_amount DECIMAL(12,2) NOT NULL,
    current_balance DECIMAL(12,2) NOT NULL,
    interest_rate DECIMAL(5,3) NOT NULL,
    monthly_payment DECIMAL(10,2) NOT NULL,
    start_date DATE NOT NULL,
    maturity_date DATE,
    escrow_included BOOLEAN DEFAULT FALSE,
    escrow_amount DECIMAL(10,2),
    contact_name VARCHAR(255),
    contact_phone VARCHAR(20),
    contact_email VARCHAR(255),
    documents TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
)");

// Users table
$mysqli->query("CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(20) NOT NULL DEFAULT 'manager',
    contact_id INT,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE SET NULL
)");

// Permissions table
$mysqli->query("CREATE TABLE IF NOT EXISTS permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    permission_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)");

// User Permissions table
$mysqli->query("CREATE TABLE IF NOT EXISTS user_permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    permission_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
    UNIQUE KEY (user_id, permission_id)
)");

// Property Inspections table
$mysqli->query("CREATE TABLE IF NOT EXISTS property_inspections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT NOT NULL,
    property_name VARCHAR(255) NOT NULL,
    inspection_type VARCHAR(50) NOT NULL,
    scheduled_date DATE NOT NULL,
    scheduled_time VARCHAR(20) NOT NULL,
    inspector VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'scheduled',
    units TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
)");

// Completed Inspections table
$mysqli->query("CREATE TABLE IF NOT EXISTS completed_inspections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT NOT NULL,
    property_name VARCHAR(255) NOT NULL,
    inspection_type VARCHAR(50) NOT NULL,
    inspection_date DATE NOT NULL,
    completed_by VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL,
    units TEXT NOT NULL,
    report_link VARCHAR(255),
    findings JSON,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
)");

// Utility Accounts table
$mysqli->query("CREATE TABLE IF NOT EXISTS utility_accounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT NOT NULL,
    unit_id INT,
    utility_type VARCHAR(50) NOT NULL,
    account_number VARCHAR(100) NOT NULL,
    provider VARCHAR(255) NOT NULL,
    billing_address VARCHAR(255),
    service_address VARCHAR(255) NOT NULL,
    account_holder VARCHAR(255) NOT NULL,
    monthly_average DECIMAL(10,2),
    is_active BOOLEAN DEFAULT TRUE,
    auto_pay BOOLEAN DEFAULT FALSE,
    auto_pay_method VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE SET NULL
)");

// Utility Bills table
$mysqli->query("CREATE TABLE IF NOT EXISTS utility_bills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    utility_account_id INT NOT NULL,
    property_id INT NOT NULL,
    bill_date DATE NOT NULL,
    due_date DATE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    past_due_amount DECIMAL(10,2) DEFAULT 0.00,
    statement_date DATE,
    start_period DATE,
    end_period DATE,
    status VARCHAR(20) DEFAULT 'unpaid',
    payment_date DATE,
    payment_method VARCHAR(50),
    confirmation_number VARCHAR(100),
    notes TEXT,
    file_path VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (utility_account_id) REFERENCES utility_accounts(id) ON DELETE CASCADE,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
)");

// Document Signing table
$mysqli->query("CREATE TABLE IF NOT EXISTS document_signing (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    document_type VARCHAR(50) NOT NULL,
    recipient VARCHAR(255) NOT NULL,
    recipient_email VARCHAR(255) NOT NULL,
    sent_date DATE,
    status VARCHAR(20) DEFAULT 'pending',
    expires_on DATE,
    signed_date DATE,
    content TEXT NOT NULL,
    signing_fields JSON,
    sender_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE SET NULL
)");

// Document Templates table
$mysqli->query("CREATE TABLE IF NOT EXISTS document_templates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    description TEXT,
    created DATE NOT NULL,
    last_used DATE,
    usage_count INT DEFAULT 0,
    content TEXT NOT NULL,
    fields JSON,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
)");

// Tasks table
$mysqli->query("CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATE,
    priority VARCHAR(20) DEFAULT 'medium',
    status VARCHAR(20) DEFAULT 'pending',
    assigned_to INT,
    related_to VARCHAR(50),
    related_id INT,
    created_by INT,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
)");

// Late Fee Rules table
$mysqli->query("CREATE TABLE IF NOT EXISTS late_fee_rules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT,
    days_late INT NOT NULL,
    fee_type VARCHAR(20) NOT NULL,
    fee_amount DECIMAL(10,2) NOT NULL,
    fee_percentage DECIMAL(5,2),
    max_fee DECIMAL(10,2),
    is_active BOOLEAN DEFAULT TRUE,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
)");

// Charges table
$mysqli->query("CREATE TABLE IF NOT EXISTS charges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lease_id INT NOT NULL,
    tenant_id INT NOT NULL,
    unit_id INT NOT NULL,
    charge_type VARCHAR(50) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    due_date DATE NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'unpaid',
    payment_id INT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (lease_id) REFERENCES leases(id) ON DELETE CASCADE,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
)");

// Deposits table
$mysqli->query("CREATE TABLE IF NOT EXISTS deposits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lease_id INT NOT NULL,
    tenant_id INT NOT NULL,
    deposit_type VARCHAR(50) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    paid_date DATE,
    refundable BOOLEAN DEFAULT TRUE,
    refunded_amount DECIMAL(10,2),
    refund_date DATE,
    status VARCHAR(20) DEFAULT 'held',
    notes TEXT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (lease_id) REFERENCES leases(id) ON DELETE CASCADE,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
)");

// Add Admin user
$password_hash = password_hash('admin123', PASSWORD_DEFAULT);

$stmt = $mysqli->prepare("INSERT INTO users (username, password, email, first_name, last_name, role) 
                         VALUES (?, ?, ?, ?, ?, ?)
                         ON DUPLICATE KEY UPDATE id=id");

$username = 'admin';
$email = 'admin@example.com';
$first_name = 'System';
$last_name = 'Administrator';
$role = 'admin';

$stmt->bind_param('ssssss', $username, $password_hash, $email, $first_name, $last_name, $role);
$stmt->execute();

echo "Database initialization completed successfully!";
?>
