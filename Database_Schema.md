
# Property Management System - Database Schema

This document outlines the database schema for the Property Management System, detailing tables, fields, and relationships.

## Core Tables

### Account
```sql
CREATE TABLE Account (
  id SERIAL PRIMARY KEY,
  role_id INT NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone_number VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INT,
  updated_by INT,
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMP
);
```

### Company
```sql
CREATE TABLE Company (
  id SERIAL PRIMARY KEY,
  account_id INT REFERENCES Account(id),
  legal_name VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  company_type_id INT,
  ein VARCHAR(20),
  business_license VARCHAR(100),
  incorporation_date DATE,
  tax_classification_id INT,
  email VARCHAR(255),
  phone_primary VARCHAR(20),
  phone_secondary VARCHAR(20),
  fax_number VARCHAR(20),
  website VARCHAR(255),
  street_address VARCHAR(255),
  city VARCHAR(100),
  state_id INT,
  zip_code VARCHAR(20),
  country_id INT,
  description TEXT,
  is_description_private BOOLEAN DEFAULT FALSE,
  status_id INT,
  owner_name VARCHAR(255),
  partner_names TEXT,
  partner_emails TEXT,
  percentage_partnerships TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INT,
  updated_by INT,
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMP
);
```

### Property
```sql
CREATE TABLE Property (
  id SERIAL PRIMARY KEY,
  company_id INT REFERENCES Company(id),
  name VARCHAR(255) NOT NULL,
  property_type_id INT,
  street_address VARCHAR(255),
  city VARCHAR(100),
  state_id INT,
  zip_code VARCHAR(20),
  country_id INT,
  year_built INT,
  square_feet INT,
  bedrooms INT,
  bathrooms DECIMAL(3,1),
  parcel_number VARCHAR(100),
  zoning_type VARCHAR(100),
  latitude DECIMAL(9,6),
  longitude DECIMAL(9,6),
  parking_type VARCHAR(100),
  number_of_parking_spaces INT,
  lead_compliance BOOLEAN,
  hoa_fees DECIMAL(10,2),
  tax_assessed_value DECIMAL(12,2),
  description TEXT,
  status_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INT,
  updated_by INT,
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMP
);
```

### Unit
```sql
CREATE TABLE Unit (
  id SERIAL PRIMARY KEY,
  property_id INT REFERENCES Property(id),
  name VARCHAR(100) NOT NULL,
  unit_type_id INT,
  floor INT,
  square_feet INT,
  bedrooms INT,
  bathrooms DECIMAL(3,1),
  rent_amount DECIMAL(10,2),
  occupancy_status_id INT,
  utilities_included BOOLEAN DEFAULT FALSE,
  availability_date DATE,
  smoke_co_detector_last_replaced DATE,
  heat_type VARCHAR(100),
  heat_source VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INT,
  updated_by INT,
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMP
);
```

### Tenant
```sql
CREATE TABLE Tenant (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(255),
  phone_number VARCHAR(20),
  alternate_phone VARCHAR(20),
  emergency_contact_name VARCHAR(200),
  emergency_contact_phone VARCHAR(20),
  employment_status VARCHAR(100),
  annual_income DECIMAL(12,2),
  credit_score INT CHECK (credit_score BETWEEN 300 AND 850),
  background_check_status VARCHAR(50),
  gender_id INT,
  date_of_birth DATE,
  ssn VARCHAR(20),
  preferred_contact_method VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INT,
  updated_by INT,
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMP
);
```

### TenantUnit
```sql
CREATE TABLE TenantUnit (
  id SERIAL PRIMARY KEY,
  tenant_id INT REFERENCES Tenant(id),
  unit_id INT REFERENCES Unit(id),
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INT,
  updated_by INT,
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMP
);
```

### Lease
```sql
CREATE TABLE Lease (
  id SERIAL PRIMARY KEY,
  tenant_id INT REFERENCES Tenant(id),
  unit_id INT REFERENCES Unit(id),
  lease_period_id INT,
  start_date DATE,
  end_date DATE,
  rent_amount DECIMAL(10,2),
  security_deposit DECIMAL(10,2),
  lease_signed_date TIMESTAMP,
  lease_status_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INT,
  updated_by INT,
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMP
);
```

### Payment
```sql
CREATE TABLE Payment (
  id SERIAL PRIMARY KEY,
  tenant_id INT REFERENCES Tenant(id),
  vendor_id INT REFERENCES Vendor(id),
  amount DECIMAL(10,2) NOT NULL,
  payment_date DATE,
  payment_method_id INT,
  payment_type_id INT,
  late_fee DECIMAL(10,2),
  payment_notes VARCHAR(255),
  status_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INT,
  updated_by INT,
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMP
);
```

### Vendor
```sql
CREATE TABLE Vendor (
  id SERIAL PRIMARY KEY,
  company_id INT REFERENCES Company(id),
  name VARCHAR(255) NOT NULL,
  vendor_type_id INT,
  contact_name VARCHAR(200),
  email VARCHAR(255),
  phone_number VARCHAR(20),
  street_address VARCHAR(255),
  city VARCHAR(100),
  state_id INT,
  zip_code VARCHAR(20),
  country_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INT,
  updated_by INT,
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMP
);
```

### Maintenance
```sql
CREATE TABLE Maintenance (
  id SERIAL PRIMARY KEY,
  property_id INT REFERENCES Property(id),
  unit_id INT REFERENCES Unit(id),
  description VARCHAR(255),
  maintenance_type_id INT,
  status_id INT,
  reported_date DATE,
  completed_date DATE,
  cost DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INT,
  updated_by INT,
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMP
);
```

### Media
```sql
CREATE TABLE Media (
  id SERIAL PRIMARY KEY,
  context_type VARCHAR(50),
  context_id INT,
  file_type VARCHAR(50),
  file_path VARCHAR(255),
  media_name VARCHAR(255),
  media_notes VARCHAR(255),
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INT,
  updated_by INT
);
```

### Appliance
```sql
CREATE TABLE Appliance (
  id SERIAL PRIMARY KEY,
  unit_id INT REFERENCES Unit(id),
  property_id INT REFERENCES Property(id),
  name VARCHAR(100),
  appliance_type_id INT,
  brand VARCHAR(100),
  model VARCHAR(100),
  serial_number VARCHAR(100),
  purchase_date DATE,
  warranty_expiry_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INT,
  updated_by INT,
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMP
);
```

### DropdownType
```sql
CREATE TABLE DropdownType (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INT,
  updated_by INT,
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMP
);
```

### DropdownValue
```sql
CREATE TABLE DropdownValue (
  id SERIAL PRIMARY KEY,
  dropdown_type_id INT REFERENCES DropdownType(id),
  value VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INT,
  updated_by INT,
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMP
);
```

## Relationship Diagram

The database follows these key relationships:
- Company has many Properties
- Property has many Units
- Unit can have many Tenants (through TenantUnit)
- Tenant can be in many Units (through TenantUnit)
- Lease connects Tenant to Unit
- Property/Unit can have many Maintenance entries
- Tenant makes Payments
- Vendor can receive Payments
- Media can be attached to multiple entity types

This schema implements a robust property management system with support for multi-tenancy, comprehensive record-keeping, and business operations tracking.
