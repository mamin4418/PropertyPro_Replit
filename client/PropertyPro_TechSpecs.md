
# Property Management System - Technical and Business Specification

## 1. System Overview

The Property Management System (PMS) is a comprehensive web application designed to help property managers and property owners efficiently manage their real estate portfolios. The system handles all aspects of property management, including properties, units, tenants, leases, maintenance, payments, financial management, utilities, inspections, and administrative functions.

### 1.1 Purpose and Scope

This system aims to streamline property management operations by:
- Centralizing property portfolio management
- Automating tenant and lease management
- Tracking maintenance requests and property upkeep
- Managing financial aspects including payments, mortgages, and insurance
- Generating reports and analytics
- Handling document signing and storage
- Tracking utility accounts and inspections

### 1.2 Target Users

1. **Property Managers**: Manage multiple properties, tenants, maintenance, and financial aspects
2. **Property Owners**: Track property performance, financials, and overall portfolio status
3. **Tenants**: Access leases, make payments, submit maintenance requests
4. **Administrative Staff**: Handle day-to-day operations and communication
5. **Vendors/Contractors**: Receive maintenance assignments and update work status

## 2. Architecture and Technology Stack

### 2.1 System Architecture

The application follows a client-server architecture:

- **Frontend**: React Single Page Application (SPA) with component-based UI
- **Backend**: RESTful API serving data to the frontend
- **Database**: Relational database for data storage
- **Authentication**: JWT-based authentication for secure access

### 2.2 Technology Stack Options

#### 2.2.1 TypeScript/JavaScript Stack (Current Implementation)

- **Frontend**:
  - React 18.x
  - TypeScript 5.x
  - Tailwind CSS for styling
  - Radix UI for accessible components
  - React Router for client-side routing
  - React Query for data fetching
  - Vite for build tooling

- **Backend**:
  - Express.js with TypeScript
  - PostgreSQL with Drizzle ORM
  - JSON Web Tokens for authentication
  - Passport.js for authentication strategies

#### 2.2.2 Alternative Stack Options

##### PHP Stack
- **Frontend**: 
  - PHP templates with Tailwind CSS
  - JavaScript for interactivity
  - jQuery for DOM manipulation

- **Backend**:
  - PHP 8.x
  - MySQL or PostgreSQL
  - Laravel/Symfony framework (optional)

##### Python Stack
- **Frontend**:
  - React (same as TypeScript stack) or
  - Django templates with Tailwind CSS

- **Backend**:
  - Django/Flask/FastAPI
  - PostgreSQL with SQLAlchemy
  - JWT or session-based authentication

##### Java Stack
- **Frontend**:
  - React (same as TypeScript stack) or
  - Thymeleaf templates

- **Backend**:
  - Spring Boot
  - Hibernate ORM
  - PostgreSQL or MySQL
  - Spring Security for authentication

## 3. Database Schema

The database schema consists of the following core entities and their relationships:

### 3.1 Core Entities

#### Companies
```sql
CREATE TABLE companies (
  id SERIAL PRIMARY KEY,
  legal_name VARCHAR(255) NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  ein VARCHAR(50),  -- Employer Identification Number
  email VARCHAR(255),
  phone VARCHAR(50),
  type VARCHAR(50) NOT NULL, -- LLC, Corporation, etc.
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Properties
```sql
CREATE TABLE properties (
  id SERIAL PRIMARY KEY,
  company_id INTEGER REFERENCES companies(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL, -- apartment, house, condo, etc.
  address VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(50) NOT NULL,
  zipcode VARCHAR(20) NOT NULL,
  country VARCHAR(100) NOT NULL,
  total_units INTEGER NOT NULL,
  size NUMERIC, -- in square feet
  year_built INTEGER,
  purchase_price NUMERIC,
  purchase_date DATE,
  mortgage_amount NUMERIC,
  property_tax NUMERIC,
  status VARCHAR(50) NOT NULL DEFAULT 'active', -- active, maintenance, vacant
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Units
```sql
CREATE TABLE units (
  id SERIAL PRIMARY KEY,
  property_id INTEGER NOT NULL REFERENCES properties(id),
  unit_number VARCHAR(50) NOT NULL,
  type VARCHAR(50), -- studio, 1BR, 2BR, etc.
  bedrooms INTEGER NOT NULL,
  bathrooms NUMERIC NOT NULL,
  size NUMERIC, -- in square feet
  rent NUMERIC NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'vacant', -- occupied, vacant, maintenance
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Contacts (Universal contact system)
```sql
CREATE TABLE contacts (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  alternate_phone VARCHAR(50),
  company_name VARCHAR(255),
  title VARCHAR(100),
  website VARCHAR(255),
  notes TEXT,
  contact_type VARCHAR(50) NOT NULL, -- tenant, vendor, owner, employee, lead, applicant, other
  status VARCHAR(50) NOT NULL DEFAULT 'active', -- active, inactive, archived
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Addresses
```sql
CREATE TABLE addresses (
  id SERIAL PRIMARY KEY,
  street_address VARCHAR(255) NOT NULL,
  unit VARCHAR(50),
  city VARCHAR(100) NOT NULL,
  state VARCHAR(50) NOT NULL,
  zipcode VARCHAR(20) NOT NULL,
  country VARCHAR(100) NOT NULL DEFAULT 'USA',
  latitude NUMERIC,
  longitude NUMERIC,
  address_type VARCHAR(50), -- home, work, mailing, property, etc.
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Contact Addresses (Junction table)
```sql
CREATE TABLE contact_addresses (
  id SERIAL PRIMARY KEY,
  contact_id INTEGER NOT NULL REFERENCES contacts(id),
  address_id INTEGER NOT NULL REFERENCES addresses(id),
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Tenants
```sql
CREATE TABLE tenants (
  id SERIAL PRIMARY KEY,
  contact_id INTEGER NOT NULL REFERENCES contacts(id),
  date_of_birth DATE,
  ssn VARCHAR(50), -- Social Security Number (should be encrypted in production)
  driver_license VARCHAR(50),
  employer_name VARCHAR(100),
  employer_phone VARCHAR(50),
  income NUMERIC,
  emergency_contact_name VARCHAR(100),
  emergency_contact_phone VARCHAR(50),
  emergency_contact_relationship VARCHAR(50),
  type VARCHAR(50) NOT NULL DEFAULT 'primary', -- primary, co-signer, dependent
  status VARCHAR(50) NOT NULL DEFAULT 'active', -- active, past, pending
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Leases
```sql
CREATE TABLE leases (
  id SERIAL PRIMARY KEY,
  unit_id INTEGER NOT NULL REFERENCES units(id),
  tenant_id INTEGER NOT NULL REFERENCES tenants(id),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  rent_amount NUMERIC NOT NULL,
  security_deposit NUMERIC,
  status VARCHAR(50) NOT NULL DEFAULT 'active', -- active, expired, terminated
  terms_and_conditions TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Payments
```sql
CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  lease_id INTEGER NOT NULL REFERENCES leases(id),
  amount NUMERIC NOT NULL,
  payment_date DATE NOT NULL,
  payment_type VARCHAR(50) NOT NULL, -- rent, deposit, fee, etc.
  payment_method VARCHAR(50), -- credit card, check, cash, etc.
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, completed, failed
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Maintenance Requests
```sql
CREATE TABLE maintenance_requests (
  id SERIAL PRIMARY KEY,
  unit_id INTEGER NOT NULL REFERENCES units(id),
  tenant_id INTEGER REFERENCES tenants(id),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  priority VARCHAR(50) NOT NULL DEFAULT 'normal', -- urgent, normal, low
  status VARCHAR(50) NOT NULL DEFAULT 'open', -- open, in_progress, completed
  reported_date DATE NOT NULL,
  completed_date DATE,
  reported_by VARCHAR(100),
  assigned_to VARCHAR(100),
  notes TEXT,
  images TEXT[], -- Array of image URLs
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Property Amenities
```sql
CREATE TABLE property_amenities (
  id SERIAL PRIMARY KEY,
  property_id INTEGER NOT NULL REFERENCES properties(id),
  has_parking BOOLEAN DEFAULT FALSE,
  has_pool BOOLEAN DEFAULT FALSE,
  has_gym BOOLEAN DEFAULT FALSE, 
  has_elevator BOOLEAN DEFAULT FALSE,
  has_laundry BOOLEAN DEFAULT FALSE,
  has_security BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3.2 Financial Management Entities

#### Mortgages
```sql
CREATE TABLE mortgages (
  id SERIAL PRIMARY KEY,
  property_id INTEGER NOT NULL REFERENCES properties(id),
  lender VARCHAR(100) NOT NULL,
  loan_number VARCHAR(100) NOT NULL,
  loan_type VARCHAR(50) NOT NULL, -- fixed, adjustable, etc.
  original_amount NUMERIC NOT NULL,
  current_balance NUMERIC NOT NULL,
  interest_rate NUMERIC NOT NULL,
  monthly_payment NUMERIC NOT NULL,
  start_date DATE NOT NULL,
  maturity_date DATE,
  escrow_included BOOLEAN DEFAULT FALSE,
  escrow_amount NUMERIC,
  contact_name VARCHAR(100),
  contact_phone VARCHAR(50),
  contact_email VARCHAR(255),
  documents TEXT[], -- Array of document URLs
  is_active BOOLEAN DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Insurance Policies
```sql
CREATE TABLE insurances (
  id SERIAL PRIMARY KEY,
  property_id INTEGER NOT NULL REFERENCES properties(id),
  insurance_provider VARCHAR(100) NOT NULL,
  policy_number VARCHAR(100) NOT NULL,
  policy_type VARCHAR(50) NOT NULL, -- homeowner, landlord, flood, etc.
  coverage_amount NUMERIC NOT NULL,
  premium NUMERIC NOT NULL,
  deductible NUMERIC,
  start_date DATE NOT NULL,
  end_date DATE,
  contact_name VARCHAR(100),
  contact_phone VARCHAR(50),
  contact_email VARCHAR(255),
  coverage_details TEXT,
  documents TEXT[], -- Array of document URLs
  is_active BOOLEAN DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Expenses
```sql
CREATE TABLE expenses (
  id SERIAL PRIMARY KEY,
  property_id INTEGER REFERENCES properties(id),
  category VARCHAR(50) NOT NULL, -- maintenance, utilities, taxes, insurance, etc.
  amount NUMERIC NOT NULL,
  date DATE NOT NULL,
  description TEXT,
  vendor_id INTEGER REFERENCES vendors(id),
  receipt_url TEXT,
  payment_method VARCHAR(50),
  recurring BOOLEAN DEFAULT FALSE,
  recurring_frequency VARCHAR(50), -- monthly, quarterly, annual, etc.
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3.3 Property Management Entities

#### Appliances
```sql
CREATE TABLE appliances (
  id SERIAL PRIMARY KEY,
  unit_id INTEGER NOT NULL REFERENCES units(id),
  type VARCHAR(50) NOT NULL, -- refrigerator, stove, dishwasher, etc.
  make VARCHAR(100),
  model VARCHAR(100),
  serial_number VARCHAR(100),
  purchase_date DATE,
  install_date DATE,
  last_service_date DATE,
  warranty VARCHAR(255),
  warranty_expiration DATE,
  notes TEXT,
  status VARCHAR(50) DEFAULT 'active', -- active, repair-needed, inactive
  images TEXT[], -- Array of image URLs
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Utility Accounts
```sql
CREATE TABLE utility_accounts (
  id SERIAL PRIMARY KEY,
  property_id INTEGER REFERENCES properties(id),
  utility_type VARCHAR(50) NOT NULL, -- water, gas, electricity, internet, etc.
  provider VARCHAR(100) NOT NULL,
  account_number VARCHAR(100) NOT NULL,
  service_address TEXT,
  billing_address TEXT,
  auto_pay BOOLEAN DEFAULT FALSE,
  payment_method VARCHAR(50),
  payment_day INTEGER,
  last_bill_amount NUMERIC,
  next_due_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Utility Bills
```sql
CREATE TABLE utility_bills (
  id SERIAL PRIMARY KEY,
  utility_account_id INTEGER NOT NULL REFERENCES utility_accounts(id),
  amount NUMERIC NOT NULL,
  billing_period_start DATE,
  billing_period_end DATE,
  due_date DATE NOT NULL,
  payment_date DATE,
  status VARCHAR(50) DEFAULT 'unpaid', -- unpaid, paid, overdue
  bill_document TEXT, -- URL to bill document
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Inspections
```sql
CREATE TABLE inspections (
  id SERIAL PRIMARY KEY,
  property_id INTEGER NOT NULL REFERENCES properties(id),
  unit_id INTEGER REFERENCES units(id),
  inspection_type VARCHAR(50) NOT NULL, -- move-in, move-out, annual, maintenance, etc.
  scheduled_date DATE NOT NULL,
  completed_date DATE,
  inspector_name VARCHAR(100),
  status VARCHAR(50) DEFAULT 'scheduled', -- scheduled, completed, cancelled
  findings TEXT,
  images TEXT[], -- Array of image URLs
  follow_up_required BOOLEAN DEFAULT FALSE,
  follow_up_notes TEXT,
  report_url TEXT, -- URL to inspection report
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3.4 Document Management Entities

#### Documents
```sql
CREATE TABLE documents (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  document_type VARCHAR(50) NOT NULL, -- lease, contract, receipt, identification, etc.
  related_entity_type VARCHAR(50), -- property, tenant, lease, etc.
  related_entity_id INTEGER,
  file_url TEXT NOT NULL,
  file_type VARCHAR(50), -- pdf, docx, jpg, etc.
  file_size INTEGER, -- in bytes
  uploader_id INTEGER REFERENCES users(id),
  date_uploaded DATE NOT NULL,
  expiration_date DATE,
  is_template BOOLEAN DEFAULT FALSE,
  is_signed BOOLEAN DEFAULT FALSE,
  signatures JSON, -- Information about signatures
  notes TEXT,
  tags TEXT[], -- Array of tags for search
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3.5 Tenant Management Entities

#### Vacancies
```sql
CREATE TABLE vacancies (
  id SERIAL PRIMARY KEY,
  unit_id INTEGER NOT NULL REFERENCES units(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  rent_amount NUMERIC NOT NULL,
  deposit_amount NUMERIC NOT NULL,
  available_from DATE NOT NULL,
  lease_duration INTEGER, -- in months
  minimum_income NUMERIC, -- minimum required income
  credit_score_requirement INTEGER,
  pet_policy TEXT,
  pet_deposit NUMERIC,
  smoking_allowed BOOLEAN DEFAULT FALSE,
  included_utilities TEXT[],
  advertising_channels TEXT[], -- websites, social media, etc.
  images TEXT[], -- Array of URLs to property images
  status VARCHAR(50) NOT NULL DEFAULT 'active', -- active, rented, cancelled
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Leads
```sql
CREATE TABLE leads (
  id SERIAL PRIMARY KEY,
  contact_id INTEGER NOT NULL REFERENCES contacts(id),
  vacancy_id INTEGER REFERENCES vacancies(id),
  source VARCHAR(50), -- Where the lead came from (website, referral, etc.)
  status VARCHAR(50) NOT NULL DEFAULT 'new', -- new, contacted, qualified, disqualified, converted
  interest_level VARCHAR(50) DEFAULT 'medium', -- low, medium, high
  desired_move_in_date DATE,
  desired_rent_range VARCHAR(50),
  desired_bedrooms INTEGER,
  desired_bathrooms NUMERIC,
  has_applied BOOLEAN DEFAULT FALSE,
  pre_qualified BOOLEAN DEFAULT FALSE,
  assigned_to INTEGER, -- Staff member responsible for this lead
  notes TEXT,
  last_contact_date TIMESTAMP,
  next_follow_up_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Application Templates
```sql
CREATE TABLE application_templates (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  application_fee NUMERIC,
  fields JSON NOT NULL, -- JSON structure defining form fields and validations
  is_default BOOLEAN DEFAULT FALSE,
  created_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Rental Applications
```sql
CREATE TABLE rental_applications (
  id SERIAL PRIMARY KEY,
  contact_id INTEGER NOT NULL REFERENCES contacts(id),
  vacancy_id INTEGER REFERENCES vacancies(id),
  lead_id INTEGER REFERENCES leads(id),
  template_id INTEGER REFERENCES application_templates(id),
  application_data JSON NOT NULL, -- Form responses in JSON format
  desired_move_in_date DATE,
  application_fee NUMERIC,
  application_fee_paid BOOLEAN DEFAULT FALSE,
  status VARCHAR(50) NOT NULL DEFAULT 'submitted', -- submitted, under review, approved, denied, cancelled
  submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  background_check_authorized BOOLEAN DEFAULT FALSE,
  background_check_complete BOOLEAN DEFAULT FALSE,
  credit_check_complete BOOLEAN DEFAULT FALSE,
  credit_score INTEGER,
  income_verified BOOLEAN DEFAULT FALSE,
  rental_history_verified BOOLEAN DEFAULT FALSE,
  employment_verified BOOLEAN DEFAULT FALSE,
  criminal_history_check BOOLEAN DEFAULT FALSE,
  approved_by INTEGER,
  approval_date TIMESTAMP,
  denial_reason TEXT,
  denial_date TIMESTAMP,
  documents JSON, -- Array of document references (IDs or URLs)
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3.6 Vendor Management Entities

#### Vendors
```sql
CREATE TABLE vendors (
  id SERIAL PRIMARY KEY,
  company_name VARCHAR(255) NOT NULL,
  contact_name VARCHAR(100),
  email VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  services TEXT[], -- Array of services provided
  tax_id VARCHAR(50),
  insurance_info TEXT,
  license_info TEXT,
  rating INTEGER, -- 1-5 rating
  notes TEXT,
  status VARCHAR(50) DEFAULT 'active', -- active, inactive
  documents TEXT[], -- Array of document URLs
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3.7 User Management Entities

#### Users
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role VARCHAR(50) NOT NULL DEFAULT 'manager', -- admin, manager, tenant, vendor, etc.
  contact_id INTEGER REFERENCES contacts(id),
  status VARCHAR(50) DEFAULT 'active', -- active, inactive, locked
  last_login TIMESTAMP,
  password_reset_token VARCHAR(255),
  password_reset_expires TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### User Roles and Permissions
```sql
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE permissions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  resource VARCHAR(50), -- The resource this permission applies to (e.g., 'property', 'tenant')
  action VARCHAR(50), -- The action this permission allows (e.g., 'create', 'read', 'update', 'delete')
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE role_permissions (
  role_id INTEGER NOT NULL REFERENCES roles(id),
  permission_id INTEGER NOT NULL REFERENCES permissions(id),
  PRIMARY KEY (role_id, permission_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_roles (
  user_id INTEGER NOT NULL REFERENCES users(id),
  role_id INTEGER NOT NULL REFERENCES roles(id),
  PRIMARY KEY (user_id, role_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 4. Functional Specifications

### 4.1 Core Modules

#### 4.1.1 Dashboard
- **Description**: Main overview screen providing key metrics and quick access to important information
- **Features**:
  - Property portfolio summary (total properties, units, occupancy rate)
  - Financial overview (revenue, expenses, outstanding payments)
  - Maintenance request status (open, in-progress, completed)
  - Recent activities and notifications
  - Quick-access links to common tasks
  - Charts and graphs for visualizing data trends

#### 4.1.2 Property Management
- **Description**: Module for managing properties and units
- **Features**:
  - Property listing with filtering and sorting
  - Property details (address, size, purchase info, tax info)
  - Unit management within properties
  - Property amenities tracking
  - Property documents
  - Property financial information (mortgage, insurance, taxes)
  - Property maintenance history
  - Property inspection scheduling and history

#### 4.1.3 Tenant Management
- **Description**: Module for managing tenants and lease agreements
- **Features**:
  - Tenant profile management
  - Tenant screening and application processing
  - Lease creation and management
  - Rent collection and payment tracking
  - Tenant communication logs
  - Tenant document management
  - Move-in/move-out process handling

#### 4.1.4 Maintenance Management
- **Description**: Module for handling property maintenance and repairs
- **Features**:
  - Maintenance request submission
  - Request prioritization and assignment
  - Vendor management for service providers
  - Work order tracking
  - Maintenance history by property/unit
  - Scheduled/preventive maintenance planning
  - Maintenance expense tracking

#### 4.1.5 Financial Management
- **Description**: Module for handling all financial aspects of property management
- **Features**:
  - Rent collection and tracking
  - Expense tracking and categorization
  - Mortgage management
  - Insurance policy tracking
  - Financial reporting (income, expenses, profit/loss)
  - Bank account integration
  - Transaction reconciliation
  - Late fee management

### 4.2 Advanced Modules

#### 4.2.1 Vacancy Management
- **Description**: Module for managing vacant units and rental listings
- **Features**:
  - Vacancy listing creation and publishing
  - Lead tracking from inquiries
  - Showing schedule management
  - Rental application processing
  - Tenant screening (background/credit checks)
  - Lease conversion from approved applications

#### 4.2.2 Document Management
- **Description**: Module for handling all property-related documents
- **Features**:
  - Document storage and organization
  - Document template creation
  - Electronic signature collection (leases, contracts)
  - Document expiration tracking
  - Secure document sharing
  - Document version control

#### 4.2.3 Utilities and Inspections
- **Description**: Module for managing utility accounts and property inspections
- **Features**:
  - Utility account tracking
  - Utility bill management
  - Property inspection scheduling
  - Inspection report generation
  - Follow-up task creation from inspections
  - Compliance tracking for required inspections

#### 4.2.4 Reporting and Analytics
- **Description**: Module for generating reports and insights
- **Features**:
  - Standard report templates (occupancy, financial, maintenance)
  - Custom report builder
  - Data export (CSV, Excel, PDF)
  - Dashboard visualization
  - Trend analysis
  - Performance benchmarking

#### 4.2.5 Communication
- **Description**: Module for communications with tenants, vendors, and owners
- **Features**:
  - Email and SMS notifications
  - Communication templates
  - Communication history tracking
  - Announcement broadcasting
  - Automated reminders (rent due, lease expiration, etc.)
  - Communication scheduling

### 4.3 User Interface Specifications

#### 4.3.1 Layout Components
- **DashboardLayout**: Main application layout with header and sidebar
- **Header**: Top navigation with user profile, notifications, and quick actions
- **Sidebar**: Main navigation menu with collapsible sections
- **PageContent**: Main content area with breadcrumbs and page-specific content
- **Footer**: Application footer with version info and legal links

#### 4.3.2 Core UI Components
- **Tables**: For data display with sorting, filtering, and pagination
- **Forms**: For data input with validation and error handling
- **Cards**: For displaying summarized information
- **Modals**: For displaying forms and confirmations
- **Tabs**: For organizing content in sections
- **Alerts**: For notifications and messages
- **Tooltips**: For providing additional information
- **Dropdowns**: For selection menus and actions
- **Buttons**: For actions with various states and variants
- **Charts**: For data visualization

#### 4.3.3 Page Types
- **List Pages**: Display collections of items with actions (e.g., Properties list)
- **Detail Pages**: Display detailed information about a single item (e.g., Property details)
- **Form Pages**: Input forms for creating or editing items (e.g., Add Property)
- **Dashboard Pages**: Overview pages with metrics and summaries
- **Report Pages**: Pages displaying generated reports and analytics

### 4.4 API Specifications

The system provides a RESTful API for all core functionality. API endpoints follow these conventions:

#### 4.4.1 Authentication Endpoints
- `POST /api/auth/login`: User login
- `POST /api/auth/register`: User registration
- `GET /api/auth/profile`: Get current user profile
- `POST /api/auth/logout`: User logout
- `POST /api/auth/forgot-password`: Password reset request
- `POST /api/auth/reset-password`: Password reset

#### 4.4.2 Property Management Endpoints
- `GET /api/properties`: List properties
- `POST /api/properties`: Create property
- `GET /api/properties/:id`: Get property details
- `PUT /api/properties/:id`: Update property
- `DELETE /api/properties/:id`: Delete property
- `GET /api/properties/:id/units`: Get units for a property
- `POST /api/properties/:id/units`: Create unit for a property

#### 4.4.3 Tenant Management Endpoints
- `GET /api/tenants`: List tenants
- `POST /api/tenants`: Create tenant
- `GET /api/tenants/:id`: Get tenant details
- `PUT /api/tenants/:id`: Update tenant
- `DELETE /api/tenants/:id`: Delete tenant
- `GET /api/tenants/:id/leases`: Get leases for a tenant

#### 4.4.4 Lease Management Endpoints
- `GET /api/leases`: List leases
- `POST /api/leases`: Create lease
- `GET /api/leases/:id`: Get lease details
- `PUT /api/leases/:id`: Update lease
- `DELETE /api/leases/:id`: Delete lease
- `POST /api/leases/generate`: Generate lease document

#### 4.4.5 Maintenance Management Endpoints
- `GET /api/maintenance`: List maintenance requests
- `POST /api/maintenance`: Create maintenance request
- `GET /api/maintenance/:id`: Get maintenance request details
- `PUT /api/maintenance/:id`: Update maintenance request
- `DELETE /api/maintenance/:id`: Delete maintenance request
- `PUT /api/maintenance/:id/assign`: Assign maintenance request

#### 4.4.6 Financial Management Endpoints
- `GET /api/payments`: List payments
- `POST /api/payments`: Create payment
- `GET /api/payments/:id`: Get payment details
- `PUT /api/payments/:id`: Update payment
- `DELETE /api/payments/:id`: Delete payment
- `GET /api/expenses`: List expenses
- `POST /api/expenses`: Create expense
- `GET /api/mortgages`: List mortgages
- `POST /api/mortgages`: Create mortgage
- `GET /api/insurances`: List insurances
- `POST /api/insurances`: Create insurance

#### 4.4.7 Document Management Endpoints
- `GET /api/documents`: List documents
- `POST /api/documents`: Upload document
- `GET /api/documents/:id`: Get document details
- `DELETE /api/documents/:id`: Delete document
- `POST /api/documents/sign`: Request signature on document
- `GET /api/document-templates`: List document templates
- `POST /api/document-templates`: Create document template

#### 4.4.8 Utility Management Endpoints
- `GET /api/utilities/accounts`: List utility accounts
- `POST /api/utilities/accounts`: Create utility account
- `GET /api/utilities/bills`: List utility bills
- `POST /api/utilities/bills`: Create utility bill

#### 4.4.9 Inspection Management Endpoints
- `GET /api/inspections`: List inspections
- `POST /api/inspections`: Schedule inspection
- `GET /api/inspections/:id`: Get inspection details
- `PUT /api/inspections/:id/complete`: Complete inspection

## 5. Non-Functional Requirements

### 5.1 Performance Requirements
- **Page Load Time**: < 2 seconds for most pages
- **API Response Time**: < 500ms for GET requests, < 1s for POST/PUT/DELETE
- **Concurrent Users**: Support for at least 100 concurrent users
- **Database Performance**: Optimized queries with proper indexing
- **Scalability**: Ability to handle at least 1,000 properties and 10,000 tenants

### 5.2 Security Requirements
- **Authentication**: Secure login with password hashing and salting
- **Authorization**: Role-based access control (RBAC)
- **Data Protection**: Encryption for sensitive data (SSNs, financial information)
- **API Security**: Token-based authentication for all API requests
- **Input Validation**: Validation of all user inputs to prevent injection attacks
- **HTTPS**: Secured communication with TLS/SSL
- **Audit Logging**: Logging of all security-relevant events
- **Session Management**: Secure session handling with timeouts

### 5.3 Usability Requirements
- **Responsive Design**: Support for desktop, tablet, and mobile devices
- **Accessibility**: WCAG 2.1 AA compliance
- **Internationalization**: Support for multiple languages and locales
- **Intuitive Navigation**: Clear organization of features and functions
- **Consistent UI**: Consistent design patterns throughout the application
- **Helpful Feedback**: Clear error messages and confirmation for actions
- **Documentation**: Comprehensive help documentation

### 5.4 Reliability Requirements
- **Availability**: 99.9% uptime during business hours
- **Data Backup**: Daily automated backups
- **Disaster Recovery**: Ability to restore from backups within 4 hours
- **Error Handling**: Graceful handling of errors with informative messages
- **Fault Tolerance**: Minimization of single points of failure

### 5.5 Maintainability Requirements
- **Code Quality**: Adherence to coding standards and best practices
- **Documentation**: Comprehensive code documentation
- **Testability**: Automated test coverage of at least 70%
- **Modularity**: Modular architecture for easier maintenance
- **Version Control**: Use of version control system for code management

## 6. Implementation Guidelines

### 6.1 Development Phases

#### 6.1.1 Phase 1: Core Structure and Foundation
- Database schema implementation
- Authentication system setup
- Basic UI framework and layout
- Property and unit management implementation
- User management and RBAC implementation

#### 6.1.2 Phase 2: Main Features
- Tenant management implementation
- Lease management implementation
- Maintenance management implementation
- Financial management (basic) implementation
- Document storage implementation

#### 6.1.3 Phase 3: Advanced Features
- Vacancy and application management
- Advanced financial management (mortgages, insurance)
- Utilities and inspections management
- Reporting and analytics implementation
- Communication system implementation

#### 6.1.4 Phase 4: Integration and Refinement
- Third-party service integrations (payment gateways, credit checks)
- Mobile responsiveness refinement
- Performance optimization
- Security hardening
- User experience enhancement

### 6.2 Coding Standards

#### 6.2.1 General Standards
- Follow naming conventions for the chosen language/framework
- Use consistent indentation and formatting
- Include comments for complex logic
- Write self-documenting code with clear variable/function names
- Implement proper error handling
- Follow SOLID principles

#### 6.2.2 Frontend Standards
- Component-based architecture
- Separation of concerns (UI, logic, state)
- Responsive design implementation
- Consistent styling approach
- Accessibility implementation

#### 6.2.3 Backend Standards
- RESTful API design
- Proper validation of inputs
- Efficient database queries
- Transaction management for data integrity
- Appropriate error responses

### 6.3 Testing Strategy

#### 6.3.1 Unit Testing
- Test individual components and functions
- Use mocking for external dependencies
- Ensure high code coverage

#### 6.3.2 Integration Testing
- Test the integration between components
- Verify database interactions
- Test API endpoints

#### 6.3.3 UI Testing
- Test user interfaces for functionality
- Verify responsive design
- Test accessibility compliance

#### 6.3.4 Performance Testing
- Test system performance under load
- Identify bottlenecks
- Verify scalability

#### 6.3.5 Security Testing
- Test for common vulnerabilities
- Perform penetration testing
- Verify authorization controls

## 7. Deployment and Operations

### 7.1 Deployment Strategy

#### 7.1.1 Environment Setup
- Development environment
- Testing/QA environment
- Staging environment
- Production environment

#### 7.1.2 Deployment Process
- Automated build process
- Version management
- Database migration handling
- Rollback procedures

#### 7.1.3 Infrastructure Requirements
- Web server requirements
- Database server requirements
- Storage requirements
- Networking requirements

### 7.2 Monitoring and Operations

#### 7.2.1 System Monitoring
- Performance monitoring
- Error tracking
- User activity monitoring
- Security monitoring

#### 7.2.2 Backup and Recovery
- Database backup strategy
- File backup strategy
- Disaster recovery procedures

#### 7.2.3 Maintenance Procedures
- Regular maintenance schedule
- Update/patch management
- Performance tuning
- Security updates

## 8. User Documentation

### 8.1 Help Center Structure
- Getting started guides
- Feature-specific documentation
- Video tutorials
- FAQ sections
- Troubleshooting guides

### 8.2 User Guides
- Administrator guide
- Property manager guide
- Tenant portal guide
- Vendor portal guide

### 8.3 Training Materials
- Training videos
- Step-by-step tutorials
- Interactive guides
- Webinar recordings

## 9. Glossary

- **Property**: A real estate asset managed in the system
- **Unit**: An individual rentable space within a property
- **Tenant**: An individual or entity renting a unit
- **Lease**: A contractual agreement between property owner and tenant
- **Maintenance Request**: A request for repairs or service
- **Vacancy**: An available unit for rent
- **Lead**: A potential tenant expressing interest
- **Application**: A formal request to rent a unit
- **Vendor**: A service provider for maintenance or other services
- **Mortgage**: A loan secured by a property
- **Insurance**: A policy covering property risks
- **Utility**: Services such as water, electricity, gas, etc.
- **Inspection**: A formal examination of a property's condition
- **Document**: Any file stored in the system (lease, contract, etc.)

---

This technical specification provides a comprehensive blueprint for implementing a Property Management System. It covers all aspects of the system including database design, functionality, API specifications, and implementation guidelines. This document can be used as a reference for developing the system in any programming language or technology stack.
