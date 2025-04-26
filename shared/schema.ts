import { pgTable, text, serial, integer, boolean, date, timestamp, numeric, json, foreignKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Properties Table
export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").notNull(), // apartment, house, condo, etc.
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipcode: text("zipcode").notNull(),
  country: text("country").notNull(),
  totalUnits: integer("total_units").notNull(),
  size: numeric("size"), // in square feet
  yearBuilt: integer("year_built"),
  purchasePrice: numeric("purchase_price"),
  purchaseDate: date("purchase_date"),
  mortgageAmount: numeric("mortgage_amount"),
  propertyTax: numeric("property_tax"),
  status: text("status").notNull().default("active"), // active, maintenance, vacant
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Units Table
export const units = pgTable("units", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").notNull().references(() => properties.id),
  unitNumber: text("unit_number").notNull(),
  type: text("type"), // studio, 1BR, 2BR, etc.
  bedrooms: integer("bedrooms").notNull(),
  bathrooms: numeric("bathrooms").notNull(),
  size: numeric("size"), // in square feet
  rent: numeric("rent").notNull(),
  status: text("status").notNull().default("vacant"), // occupied, vacant, maintenance
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Addresses Table (centralized for all address needs)
export const addresses = pgTable("addresses", {
  id: serial("id").primaryKey(),
  streetAddress: text("street_address").notNull(),
  unit: text("unit"),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipcode: text("zipcode").notNull(),
  country: text("country").notNull().default("USA"),
  latitude: numeric("latitude"),
  longitude: numeric("longitude"),
  addressType: text("address_type"), // home, work, mailing, property, etc.
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Contact-Address join table
export const contactAddresses = pgTable("contact_addresses", {
  id: serial("id").primaryKey(),
  contactId: integer("contact_id").notNull(),
  addressId: integer("address_id").notNull(),
  isPrimary: boolean("is_primary").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Contacts Table (centralized for Tenants, Vendors, Owners, etc.)
export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email"),
  phone: text("phone"),
  alternatePhone: text("alternate_phone"),
  companyName: text("company_name"),
  title: text("title"),
  website: text("website"),
  notes: text("notes"),
  contactType: text("contact_type").notNull(), // tenant, vendor, owner, employee, lead, applicant, other
  status: text("status").notNull().default("active"), // active, inactive, archived
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Tenants Table (now linked to contacts)
export const tenants = pgTable("tenants", {
  id: serial("id").primaryKey(),
  contactId: integer("contact_id").notNull().references(() => contacts.id),
  dateOfBirth: date("date_of_birth"),
  ssn: text("ssn"), // Consider encryption for production
  driverLicense: text("driver_license"),
  employerName: text("employer_name"),
  employerPhone: text("employer_phone"),
  income: numeric("income"),
  emergencyContactName: text("emergency_contact_name"),
  emergencyContactPhone: text("emergency_contact_phone"),
  emergencyContactRelationship: text("emergency_contact_relationship"),
  type: text("type").notNull().default("primary"), // primary, co-signer, dependent
  status: text("status").notNull().default("active"), // active, past, pending
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Leases Table
export const leases = pgTable("leases", {
  id: serial("id").primaryKey(),
  unitId: integer("unit_id").notNull().references(() => units.id),
  tenantId: integer("tenant_id").notNull().references(() => tenants.id),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  rentAmount: numeric("rent_amount").notNull(),
  securityDeposit: numeric("security_deposit"),
  status: text("status").notNull().default("active"), // active, expired, terminated
  termsAndConditions: text("terms_and_conditions"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Payments Table
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  leaseId: integer("lease_id").notNull().references(() => leases.id),
  amount: numeric("amount").notNull(),
  paymentDate: date("payment_date").notNull(),
  paymentType: text("payment_type").notNull(), // rent, deposit, fee, etc.
  paymentMethod: text("payment_method"), // credit card, check, cash, etc.
  status: text("status").notNull().default("pending"), // pending, completed, failed
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Maintenance Requests Table
export const maintenanceRequests = pgTable("maintenance_requests", {
  id: serial("id").primaryKey(),
  unitId: integer("unit_id").notNull().references(() => units.id),
  tenantId: integer("tenant_id").references(() => tenants.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  priority: text("priority").notNull().default("normal"), // urgent, normal, low
  status: text("status").notNull().default("open"), // open, in_progress, completed
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Property Amenities Table
export const propertyAmenities = pgTable("property_amenities", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").notNull().references(() => properties.id),
  hasParking: boolean("has_parking").default(false),
  hasPool: boolean("has_pool").default(false),
  hasGym: boolean("has_gym").default(false),
  hasElevator: boolean("has_elevator").default(false),
  hasLaundry: boolean("has_laundry").default(false),
  hasSecurity: boolean("has_security").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// New tables for tenant lead-to-lease process flow

// Vacancy Listings
export const vacancies = pgTable("vacancies", {
  id: serial("id").primaryKey(),
  unitId: integer("unit_id").notNull().references(() => units.id),
  title: text("title").notNull(),
  description: text("description"),
  rentAmount: numeric("rent_amount").notNull(),
  depositAmount: numeric("deposit_amount").notNull(),
  availableFrom: date("available_from").notNull(),
  leaseDuration: integer("lease_duration"), // in months
  minimumIncome: numeric("minimum_income"), // minimum required income
  creditScoreRequirement: integer("credit_score_requirement"),
  petPolicy: text("pet_policy"),
  petDeposit: numeric("pet_deposit"),
  smokingAllowed: boolean("smoking_allowed").default(false),
  includedUtilities: text("included_utilities").array(),
  advertisingChannels: text("advertising_channels").array(), // websites, social media, etc.
  images: text("images").array(), // URLs to property images
  status: text("status").notNull().default("active"), // active, rented, cancelled
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Leads - Track potential tenants from first contact through conversion
export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  contactId: integer("contact_id").notNull().references(() => contacts.id),
  vacancyId: integer("vacancy_id").references(() => vacancies.id),
  source: text("source"), // Where the lead came from (website, referral, etc.)
  status: text("status").notNull().default("new"), // new, contacted, qualified, disqualified, converted
  interestLevel: text("interest_level").default("medium"), // low, medium, high
  desiredMoveInDate: date("desired_move_in_date"),
  desiredRentRange: text("desired_rent_range"),
  desiredBedrooms: integer("desired_bedrooms"),
  desiredBathrooms: numeric("desired_bathrooms"),
  hasApplied: boolean("has_applied").default(false),
  preQualified: boolean("pre_qualified").default(false),
  assignedTo: integer("assigned_to"), // Staff member responsible for this lead
  notes: text("notes"),
  lastContactDate: timestamp("last_contact_date"),
  nextFollowUpDate: timestamp("next_follow_up_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Application Templates - Customizable application forms
export const applicationTemplates = pgTable("application_templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  applicationFee: numeric("application_fee"),
  fields: json("fields").notNull(), // JSON structure defining form fields and validations
  isDefault: boolean("is_default").default(false),
  createdBy: integer("created_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Custom Fields - Define custom fields for application templates
export const customFields = pgTable("custom_fields", {
  id: serial("id").primaryKey(),
  templateId: integer("template_id").references(() => applicationTemplates.id),
  fieldName: text("field_name").notNull(),
  displayName: text("display_name").notNull(),
  fieldType: text("field_type").notNull(), // text, number, date, boolean, select, etc.
  options: json("options"), // Options for select fields
  required: boolean("required").default(false),
  helpText: text("help_text"),
  validationRules: json("validation_rules"),
  displayOrder: integer("display_order").default(0),
  section: text("section"), // Group fields into sections
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Rental Applications
export const rentalApplications = pgTable("rental_applications", {
  id: serial("id").primaryKey(),
  contactId: integer("contact_id").notNull().references(() => contacts.id),
  vacancyId: integer("vacancy_id").references(() => vacancies.id),
  leadId: integer("lead_id").references(() => leads.id),
  templateId: integer("template_id").references(() => applicationTemplates.id),
  applicationData: json("application_data").notNull(), // Form responses in JSON format
  desiredMoveInDate: date("desired_move_in_date"),
  applicationFee: numeric("application_fee"),
  applicationFeePaid: boolean("application_fee_paid").default(false),
  status: text("status").notNull().default("submitted"), // submitted, under review, approved, denied, cancelled
  submissionDate: timestamp("submission_date").defaultNow(),
  // Background check and screening info
  backgroundCheckAuthorized: boolean("background_check_authorized").default(false),
  backgroundCheckComplete: boolean("background_check_complete").default(false),
  creditCheckComplete: boolean("credit_check_complete").default(false),
  creditScore: integer("credit_score"),
  incomeVerified: boolean("income_verified").default(false),
  rentalHistoryVerified: boolean("rental_history_verified").default(false),
  employmentVerified: boolean("employment_verified").default(false),
  criminalHistoryCheck: boolean("criminal_history_check").default(false),
  approvedBy: integer("approved_by"),
  approvalDate: timestamp("approval_date"),
  denialReason: text("denial_reason"),
  denialDate: timestamp("denial_date"),
  documents: json("documents"), // Array of document references (IDs or URLs)
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Communication Logs - Track all communications with leads/applicants
export const communicationLogs = pgTable("communication_logs", {
  id: serial("id").primaryKey(),
  contactId: integer("contact_id").notNull().references(() => contacts.id),
  leadId: integer("lead_id").references(() => leads.id),
  applicationId: integer("application_id").references(() => rentalApplications.id),
  communicationType: text("communication_type").notNull(), // email, call, text, in-person, portal
  direction: text("direction").notNull(), // inbound, outbound
  subject: text("subject"),
  content: text("content"),
  sentBy: integer("sent_by"),
  sentAt: timestamp("sent_at").defaultNow(),
  status: text("status").default("sent"), // sent, delivered, read, failed
  attachments: json("attachments"), // Array of attachment references
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Screening Criteria - Define criteria for tenant approval
export const screeningCriteria = pgTable("screening_criteria", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  minCreditScore: integer("min_credit_score"),
  minIncome: numeric("min_income"), // Minimum income as % of rent
  incomeVerificationRequired: boolean("income_verification_required").default(true),
  evictionThreshold: integer("eviction_threshold").default(0),
  criminalHistoryPolicy: text("criminal_history_policy"),
  rentalHistoryRequired: boolean("rental_history_required").default(true),
  rentalHistoryYears: integer("rental_history_years").default(2),
  isActive: boolean("is_active").default(true),
  createdBy: integer("created_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Application Documents - Track documents submitted with applications
export const appliances = pgTable("appliances", {
  id: serial("id").primaryKey(),
  unitId: integer("unit_id").notNull().references(() => units.id),
  type: text("type").notNull(), // Gas Water Boiler, Refrigerator, etc.
  make: text("make"),
  model: text("model"),
  serialNumber: text("serial_number"),
  purchaseDate: date("purchase_date"),
  installDate: date("install_date"),
  lastServiceDate: date("last_service_date"),
  warranty: text("warranty"),
  notes: text("notes"),
  images: text("images").array(),
  status: text("status").default("active"), // active, repair-needed, inactive
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const applicationDocuments = pgTable("application_documents", {
  id: serial("id").primaryKey(),
  applicationId: integer("application_id").notNull().references(() => rentalApplications.id),
  documentType: text("document_type").notNull(), // id, income_proof, rental_history, etc.
  documentName: text("document_name").notNull(),
  documentUrl: text("document_url").notNull(),
  uploadedBy: integer("uploaded_by"),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
  status: text("status").default("pending"), // pending, verified, rejected
  verifiedBy: integer("verified_by"),
  verifiedAt: timestamp("verified_at"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Define insert schemas
export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUnitSchema = createInsertSchema(units).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAddressSchema = createInsertSchema(addresses).omit({
  id: true,
  createdAt: true, 
  updatedAt: true,
});

export const insertContactAddressSchema = createInsertSchema(contactAddresses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTenantSchema = createInsertSchema(tenants).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLeaseSchema = createInsertSchema(leases).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMaintenanceRequestSchema = createInsertSchema(maintenanceRequests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPropertyAmenitySchema = createInsertSchema(propertyAmenities).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertVacancySchema = createInsertSchema(vacancies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertApplicationTemplateSchema = createInsertSchema(applicationTemplates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCustomFieldSchema = createInsertSchema(customFields).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertRentalApplicationSchema = createInsertSchema(rentalApplications).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCommunicationLogSchema = createInsertSchema(communicationLogs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertScreeningCriteriaSchema = createInsertSchema(screeningCriteria).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertApplianceSchema = createInsertSchema(appliances).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertApplicationDocumentSchema = createInsertSchema(applicationDocuments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Define types
export type Property = typeof properties.$inferSelect;
export type InsertProperty = z.infer<typeof insertPropertySchema>;

export type Unit = typeof units.$inferSelect;
export type InsertUnit = z.infer<typeof insertUnitSchema>;

export type Address = typeof addresses.$inferSelect;
export type InsertAddress = z.infer<typeof insertAddressSchema>;

export type ContactAddress = typeof contactAddresses.$inferSelect;
export type InsertContactAddress = z.infer<typeof insertContactAddressSchema>;

export type Contact = typeof contacts.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;

export type Tenant = typeof tenants.$inferSelect;
export type InsertTenant = z.infer<typeof insertTenantSchema>;

export type Lease = typeof leases.$inferSelect;
export type InsertLease = z.infer<typeof insertLeaseSchema>;

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;

export type MaintenanceRequest = typeof maintenanceRequests.$inferSelect;
export type InsertMaintenanceRequest = z.infer<typeof insertMaintenanceRequestSchema>;

export type PropertyAmenity = typeof propertyAmenities.$inferSelect;
export type InsertPropertyAmenity = z.infer<typeof insertPropertyAmenitySchema>;

export type Vacancy = typeof vacancies.$inferSelect;
export type InsertVacancy = z.infer<typeof insertVacancySchema>;

export type Lead = typeof leads.$inferSelect;
export type InsertLead = z.infer<typeof insertLeadSchema>;

export type ApplicationTemplate = typeof applicationTemplates.$inferSelect;
export type InsertApplicationTemplate = z.infer<typeof insertApplicationTemplateSchema>;

export type CustomField = typeof customFields.$inferSelect;
export type InsertCustomField = z.infer<typeof insertCustomFieldSchema>;

export type RentalApplication = typeof rentalApplications.$inferSelect;
export type InsertRentalApplication = z.infer<typeof insertRentalApplicationSchema>;

export type CommunicationLog = typeof communicationLogs.$inferSelect;
export type InsertCommunicationLog = z.infer<typeof insertCommunicationLogSchema>;

export type ScreeningCriteria = typeof screeningCriteria.$inferSelect;
export type InsertScreeningCriteria = z.infer<typeof insertScreeningCriteriaSchema>;

export type ApplicationDocument = typeof applicationDocuments.$inferSelect;
export type InsertApplicationDocument = z.infer<typeof insertApplicationDocumentSchema>;

export type Appliance = typeof appliances.$inferSelect;
export type InsertAppliance = z.infer<typeof insertApplianceSchema>;

// Also export the users table from the original schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("manager"), // manager, tenant
  // Tenants can have a reference to their contact info
  contactId: integer("contact_id"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true,
  contactId: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
