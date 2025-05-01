import { users, type User, type InsertUser, type Contact, type InsertContact, type Address, type InsertAddress, type ContactAddress, type Appliance, type InsertAppliance, type RentalApplication, type InsertRentalApplication, type ApplicationTemplate, type InsertApplicationTemplate, type Insurance, type InsertInsurance, type Mortgage, type InsertMortgage, type MaintenanceRequest, type InsertMaintenanceRequest } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // Session store
  sessionStore: session.Store;

  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Address methods
  getAddress(id: number): Promise<Address | undefined>;
  getAddresses(): Promise<Address[]>;
  createAddress(address: InsertAddress): Promise<Address>;
  updateAddress(id: number, address: Partial<InsertAddress>): Promise<Address | undefined>;
  deleteAddress(id: number): Promise<boolean>;

  // Contact-Address methods
  getContactAddresses(contactId: number): Promise<(ContactAddress & { address: Address })[]>;
  addAddressToContact(contactId: number, addressId: number, isPrimary?: boolean): Promise<ContactAddress>;
  removeAddressFromContact(contactId: number, addressId: number): Promise<boolean>;

  // Contact methods
  getContact(id: number): Promise<Contact | undefined>;
  getContacts(): Promise<Contact[]>;
  getContactsByType(type: string): Promise<Contact[]>;
  createContact(contact: InsertContact): Promise<Contact>;
  updateContact(id: number, contact: Partial<InsertContact>): Promise<Contact | undefined>;
  deleteContact(id: number): Promise<boolean>;

  // Appliance methods
  getAppliance(id: number): Promise<Appliance | undefined>;
  getAppliances(): Promise<Appliance[]>;
  getAppliancesByUnit(unitId: number): Promise<Appliance[]>;
  createAppliance(appliance: InsertAppliance): Promise<Appliance>;
  updateAppliance(id: number, appliance: Partial<InsertAppliance>): Promise<Appliance | undefined>;
  deleteAppliance(id: number): Promise<boolean>;

  // Application methods
  getRentalApplication(id: number): Promise<RentalApplication | undefined>;
  getRentalApplications(): Promise<RentalApplication[]>;
  createRentalApplication(application: InsertRentalApplication): Promise<RentalApplication>;
  updateRentalApplication(id: number, application: Partial<InsertRentalApplication>): Promise<RentalApplication | undefined>;
  deleteRentalApplication(id: number): Promise<boolean>;

  // Application Template methods
  getApplicationTemplate(id: number): Promise<ApplicationTemplate | undefined>;
  getApplicationTemplates(): Promise<ApplicationTemplate[]>;
  createApplicationTemplate(template: InsertApplicationTemplate): Promise<ApplicationTemplate>;
  updateApplicationTemplate(id: number, template: Partial<InsertApplicationTemplate>): Promise<ApplicationTemplate | undefined>;
  deleteApplicationTemplate(id: number): Promise<boolean>;

  // Insurance methods
  getInsurance(id: number): Promise<Insurance | undefined>;
  getInsurancesByProperty(propertyId: number): Promise<Insurance[]>;
  createInsurance(insurance: InsertInsurance): Promise<Insurance>;
  updateInsurance(id: number, insurance: Partial<InsertInsurance>): Promise<Insurance | undefined>;
  deleteInsurance(id: number): Promise<boolean>;

  // Mortgage methods
  getMortgage(id: number): Promise<Mortgage | undefined>;
  getMortgagesByProperty(propertyId: number): Promise<Mortgage[]>;
  createMortgage(mortgage: InsertMortgage): Promise<Mortgage>;
  updateMortgage(id: number, mortgage: Partial<InsertMortgage>): Promise<Mortgage | undefined>;
  deleteMortgage(id: number): Promise<boolean>;

  // Maintenance Request methods
  getAllMaintenanceRequests(): Promise<MaintenanceRequest[]>;
  getMaintenanceRequest(id: number): Promise<MaintenanceRequest | null>;
  getMaintenanceRequestsByProperty(propertyId: number): Promise<MaintenanceRequest[]>;
  createMaintenanceRequest(data: InsertMaintenanceRequest): Promise<MaintenanceRequest>;
  updateMaintenanceRequest(id: number, data: Partial<InsertMaintenanceRequest>): Promise<MaintenanceRequest | null>;
  deleteMaintenanceRequest(id: number): Promise<boolean>;

  // Appliance methods added
  getAppliances(): Promise<Appliance[]>;
  getAppliance(id: number): Promise<Appliance | undefined>;
  createAppliance(appliance: InsertAppliance): Promise<Appliance>;
  updateAppliance(id: number, appliance: Partial<InsertAppliance>): Promise<Appliance | undefined>;
  deleteAppliance(id: number): Promise<boolean>;
  getUtilityAccounts(): Promise<any[]>;
  getUtilityAccount(id: number): Promise<any | undefined>;
  createUtilityAccount(account: any): Promise<any>;
  updateUtilityAccount(id: number, account: any): Promise<any | undefined>;
  deleteUtilityAccount(id: number): Promise<boolean>;
  getUtilityBills(): Promise<any[]>;
  getUtilityBill(id: number): Promise<any | undefined>;
  createUtilityBill(bill: any): Promise<any>;
  updateUtilityBill(id: number, bill: any): Promise<any | undefined>;
  deleteUtilityBill(id: number): Promise<boolean>;
  getInspections():Promise<any[]>;
  getInspection(id: number): Promise<any | undefined>;
  createInspection(inspection: any): Promise<any>;
  updateInspection(id: number, inspection: any): Promise<any | undefined>;
  deleteInspection(id: number): Promise<boolean>;
  getCompletedInspections(): Promise<any[]>;
  getCompletedInspection(id: number): Promise<any | undefined>;
  createCompletedInspection(inspection: any): Promise<any>;
  updateCompletedInspection(id: number, inspection: any): Promise<any | undefined>;
  deleteCompletedInspection(id: number): Promise<boolean>;
  
  // Added missing methods
  createUtility(utility: any): Promise<any>;
  createApplication(application: any): Promise<any>;
}

export class MemStorage implements IStorage {
  // Session store for auth
  public sessionStore: session.Store;

  private users: Map<number, User> = new Map();
  private contacts: Map<number, Contact> = new Map();
  private addresses: Map<number, Address> = new Map();
  private contactAddresses: Map<string, ContactAddress> = new Map(); // key is contactId-addressId
  private appliances: Map<number, Appliance> = new Map();
  private rentalApplications: Map<number, RentalApplication> = new Map();
  private applicationTemplates: Map<number, ApplicationTemplate> = new Map();
  private insurances: Map<number, Insurance> = new Map();
  private mortgages: Map<number, Mortgage> = new Map();
  private maintenanceRequests: Map<number, MaintenanceRequest> = new Map();
  public utilityAccounts: Map<number, any> = new Map();
  public utilityBills: Map<number, any> = new Map();
  public inspections: Map<number, any> = new Map();
  public completedInspections: Map<number, any> = new Map();

  private userIdCounter: number = 1;
  private contactIdCounter: number = 1;
  private addressIdCounter: number = 1;
  private contactAddressIdCounter: number = 1;
  private applianceIdCounter: number = 1;
  private rentalApplicationIdCounter: number = 1;
  private applicationTemplateIdCounter: number = 1;
  private insuranceIdCounter: number = 1;
  private mortgageIdCounter: number = 1;
  private maintenanceRequestIdCounter: number = 1;
  private utilityAccountIdCounter: number = 1;
  private utilityBillIdCounter: number = 1;
  private inspectionIdCounter: number = 1;
  private completedInspectionIdCounter: number = 1;


  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
    // Add sample data here to fix the empty array issue
    this.addSampleData();

  }

  addSampleData() {
    this.createInsurance({propertyId: 1, insuranceProvider: "Sample Insurer", policyNumber: "12345", policyType: "Homeowners", coverageAmount: 250000, premium: 1000, startDate: new Date()});
    this.createMortgage({propertyId: 1, lender: "Sample Lender", loanNumber: "67890", loanType: "Fixed", originalAmount: 300000, currentBalance: 200000, interestRate: 0.04, monthlyPayment: 1500, startDate: new Date()});
    this.createAppliance({unitId: 1, type: "Refrigerator", make: "Whirlpool", model: "WRT511CZDM", serialNumber: "1234567890"});
    this.createAppliance({unitId: 1, type: "Oven", make: "LG", model: "LFXS28968S", serialNumber: "9876543210"});
    this.createAppliance({unitId: 2, type: "Washer", make: "Samsung", model: "WF45R6300AW", serialNumber: "1357913579"});
    this.createAppliance({unitId: 2, type: "Dryer", make: "Samsung", model: "DV45R6300AW", serialNumber: "2468024680"});
    this.createUtilityAccount({propertyId: 1, utilityProvider: "Sample Electric", accountNumber: "11111"});
    this.createUtilityBill({propertyId: 1, utilityAccountId: 1, amount: 100, dueDate: new Date()});
    this.createInspection({propertyId: 1, inspector: "John Doe", date: new Date(), notes: "All good"});
    this.createCompletedInspection({propertyId: 1, inspectionId: 1, dateCompleted: new Date(), notes: "Inspection completed successfully"});

  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.username === username) return user;
    }
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { 
      id,
      username: insertUser.username,
      password: insertUser.password,
      role: insertUser.role || 'manager', 
      contactId: insertUser.contactId || null
    };
    this.users.set(id, user);
    return user;
  }

  // Contact methods
  async getContact(id: number): Promise<Contact | undefined> {
    return this.contacts.get(id);
  }

  async getContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values());
  }

  async getContactsByType(type: string): Promise<Contact[]> {
    return Array.from(this.contacts.values()).filter(
      (contact) => contact.contactType === type
    );
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = this.contactIdCounter++;
    const now = new Date();
    const contact: Contact = {
      id,
      firstName: insertContact.firstName,
      lastName: insertContact.lastName,
      email: insertContact.email || null,
      phone: insertContact.phone || null,
      alternatePhone: insertContact.alternatePhone || null,
      companyName: insertContact.companyName || null,
      title: insertContact.title || null,
      website: insertContact.website || null,
      notes: insertContact.notes || null,
      contactType: insertContact.contactType,
      status: insertContact.status || 'active',
      createdAt: now,
      updatedAt: now
    };
    this.contacts.set(id, contact);
    return contact;
  }

  async updateContact(id: number, updateData: Partial<InsertContact>): Promise<Contact | undefined> {
    const contact = this.contacts.get(id);
    if (!contact) {
      return undefined;
    }
    const updatedContact: Contact = {
      ...contact,
      ...updateData,
      updatedAt: new Date()
    };
    this.contacts.set(id, updatedContact);
    return updatedContact;
  }

  async deleteContact(id: number): Promise<boolean> {
    return this.contacts.delete(id);
  }

  // Address methods
  async getAddress(id: number): Promise<Address | undefined> {
    return this.addresses.get(id);
  }

  async getAddresses(): Promise<Address[]> {
    return Array.from(this.addresses.values());
  }

  async createAddress(insertAddress: InsertAddress): Promise<Address> {
    const id = this.addressIdCounter++;
    const now = new Date();
    const address: Address = {
      id,
      streetAddress: insertAddress.streetAddress,
      unit: insertAddress.unit || null,
      city: insertAddress.city,
      state: insertAddress.state,
      zipcode: insertAddress.zipcode,
      country: insertAddress.country || "USA",
      latitude: insertAddress.latitude || null,
      longitude: insertAddress.longitude || null,
      addressType: insertAddress.addressType || null,
      isDefault: insertAddress.isDefault || false,
      createdAt: now,
      updatedAt: now
    };
    this.addresses.set(id, address);
    return address;
  }

  async updateAddress(id: number, updateData: Partial<InsertAddress>): Promise<Address | undefined> {
    const address = this.addresses.get(id);
    if (!address) {
      return undefined;
    }
    const updatedAddress: Address = {
      ...address,
      ...updateData,
      updatedAt: new Date()
    };
    this.addresses.set(id, updatedAddress);
    return updatedAddress;
  }

  async deleteAddress(id: number): Promise<boolean> {
    // First, remove any contact-address relationships
    for (const [key, contactAddress] of this.contactAddresses.entries()) {
      if (contactAddress.addressId === id) {
        this.contactAddresses.delete(key);
      }
    }
    return this.addresses.delete(id);
  }

  // Contact-Address methods
  async getContactAddresses(contactId: number): Promise<(ContactAddress & { address: Address })[]> {
    const relationships = Array.from(this.contactAddresses.values())
      .filter(rel => rel.contactId === contactId);
    const result: (ContactAddress & { address: Address })[] = [];
    for (const relationship of relationships) {
      const address = this.addresses.get(relationship.addressId);
      if (address) {
        result.push({
          ...relationship,
          address
        });
      }
    }
    return result;
  }

  async addAddressToContact(contactId: number, addressId: number, isPrimary: boolean = false): Promise<ContactAddress> {
    const contact = this.contacts.get(contactId);
    const address = this.addresses.get(addressId);
    if (!contact || !address) {
      throw new Error('Contact or address does not exist');
    }
    const key = `${contactId}-${addressId}`;
    const now = new Date();
    if (isPrimary) {
      for (const [existingKey, existingRel] of this.contactAddresses.entries()) {
        if (existingRel.contactId === contactId && existingRel.isPrimary) {
          const updated = { ...existingRel, isPrimary: false, updatedAt: now };
          this.contactAddresses.set(existingKey, updated);
        }
      }
    }
    const id = this.contactAddresses.has(key) 
      ? this.contactAddresses.get(key)!.id
      : this.contactAddressIdCounter++;
    const contactAddress: ContactAddress = {
      id,
      contactId,
      addressId,
      isPrimary,
      createdAt: now,
      updatedAt: now
    };
    this.contactAddresses.set(key, contactAddress);
    return contactAddress;
  }

  async removeAddressFromContact(contactId: number, addressId: number): Promise<boolean> {
    const key = `${contactId}-${addressId}`;
    return this.contactAddresses.delete(key);
  }

  // Appliance methods
  async getAppliance(id: number): Promise<Appliance | undefined> {
    return this.appliances.get(id);
  }

  async getAppliances(): Promise<Appliance[]> {
    return Array.from(this.appliances.values());
  }

  async getAppliancesByUnit(unitId: number): Promise<Appliance[]> {
    return Array.from(this.appliances.values()).filter(
      (appliance) => appliance.unitId === unitId
    );
  }

  async createAppliance(insertAppliance: InsertAppliance): Promise<Appliance> {
    const id = this.applianceIdCounter++;
    const now = new Date();
    const appliance: Appliance = {
      id,
      unitId: insertAppliance.unitId,
      type: insertAppliance.type,
      make: insertAppliance.make || null,
      model: insertAppliance.model || null,
      serialNumber: insertAppliance.serialNumber || null,
      purchaseDate: insertAppliance.purchaseDate || null,
      installDate: insertAppliance.installDate || null,
      lastServiceDate: insertAppliance.lastServiceDate || null,
      warranty: insertAppliance.warranty || null,
      notes: insertAppliance.notes || null,
      images: insertAppliance.images || [],
      status: insertAppliance.status || 'active',
      createdAt: now,
      updatedAt: now
    };
    this.appliances.set(id, appliance);
    return appliance;
  }

  async updateAppliance(id: number, updateData: Partial<InsertAppliance>): Promise<Appliance | undefined> {
    const appliance = this.appliances.get(id);
    if (!appliance) {
      return undefined;
    }
    const updatedAppliance: Appliance = {
      ...appliance,
      ...updateData,
      updatedAt: new Date()
    };
    this.appliances.set(id, updatedAppliance);
    return updatedAppliance;
  }

  async deleteAppliance(id: number): Promise<boolean> {
    return this.appliances.delete(id);
  }

  // Application methods
  async getRentalApplication(id: number): Promise<RentalApplication | undefined> {
    return this.rentalApplications.get(id);
  }

  async getRentalApplications(): Promise<RentalApplication[]> {
    return Array.from(this.rentalApplications.values());
  }

  async createRentalApplication(insertApplication: InsertRentalApplication): Promise<RentalApplication> {
    const id = this.rentalApplicationIdCounter++;
    const now = new Date();
    const application: RentalApplication = {
      id,
      contactId: insertApplication.contactId,
      vacancyId: insertApplication.vacancyId || null,
      leadId: insertApplication.leadId || null,
      templateId: insertApplication.templateId || null,
      applicationData: insertApplication.applicationData,
      desiredMoveInDate: insertApplication.desiredMoveInDate || null,
      applicationFee: insertApplication.applicationFee || null,
      applicationFeePaid: insertApplication.applicationFeePaid || false,
      status: insertApplication.status || 'submitted',
      submissionDate: now,
      backgroundCheckAuthorized: insertApplication.backgroundCheckAuthorized || false,
      backgroundCheckComplete: insertApplication.backgroundCheckComplete || false,
      creditCheckComplete: insertApplication.creditCheckComplete || false,
      creditScore: insertApplication.creditScore || null,
      incomeVerified: insertApplication.incomeVerified || false,
      rentalHistoryVerified: insertApplication.rentalHistoryVerified || false,
      employmentVerified: insertApplication.employmentVerified || false,
      criminalHistoryCheck: insertApplication.criminalHistoryCheck || false,
      approvedBy: insertApplication.approvedBy || null,
      approvalDate: insertApplication.approvalDate || null,
      denialReason: insertApplication.denialReason || null,
      denialDate: insertApplication.denialDate || null,
      documents: insertApplication.documents || null,
      notes: insertApplication.notes || null,
      createdAt: now,
      updatedAt: now
    };
    this.rentalApplications.set(id, application);
    return application;
  }

  async updateRentalApplication(id: number, updateData: Partial<InsertRentalApplication>): Promise<RentalApplication | undefined> {
    const application = this.rentalApplications.get(id);
    if (!application) {
      return undefined;
    }
    const updatedApplication: RentalApplication = {
      ...application,
      ...updateData,
      updatedAt: new Date()
    };
    this.rentalApplications.set(id, updatedApplication);
    return updatedApplication;
  }

  async deleteRentalApplication(id: number): Promise<boolean> {
    return this.rentalApplications.delete(id);
  }

  // Application Template methods
  async getApplicationTemplate(id: number): Promise<ApplicationTemplate | undefined> {
    return this.applicationTemplates.get(id);
  }

  async getApplicationTemplates(): Promise<ApplicationTemplate[]> {
    return Array.from(this.applicationTemplates.values());
  }

  async createApplicationTemplate(insertTemplate: InsertApplicationTemplate): Promise<ApplicationTemplate> {
    const id = this.applicationTemplateIdCounter++;
    const now = new Date();
    const template: ApplicationTemplate = {
      id,
      name: insertTemplate.name,
      description: insertTemplate.description || null,
      isDefault: insertTemplate.isDefault || false,
      fields: insertTemplate.fields,
      applicationFee: insertTemplate.applicationFee || null,
      createdBy: insertTemplate.createdBy || null,
      createdAt: now,
      updatedAt: now
    };
    this.applicationTemplates.set(id, template);
    return template;
  }

  async updateApplicationTemplate(id: number, updateData: Partial<InsertApplicationTemplate>): Promise<ApplicationTemplate | undefined> {
    const template = this.applicationTemplates.get(id);
    if (!template) {
      return undefined;
    }
    const updatedTemplate: ApplicationTemplate = {
      ...template,
      ...updateData,
      updatedAt: new Date()
    };
    this.applicationTemplates.set(id, updatedTemplate);
    return updatedTemplate;
  }

  async deleteApplicationTemplate(id: number): Promise<boolean> {
    return this.applicationTemplates.delete(id);
  }

  // Insurance methods
  async getInsurance(id: number): Promise<Insurance | undefined> {
    return this.insurances.get(id);
  }

  async getInsurancesByProperty(propertyId: number): Promise<Insurance[]> {
    return Array.from(this.insurances.values()).filter(
      (insurance) => insurance.propertyId === propertyId
    );
  }

  async createInsurance(insertInsurance: InsertInsurance): Promise<Insurance> {
    const id = this.insuranceIdCounter++;
    const now = new Date();
    const insurance: Insurance = {
      id,
      propertyId: insertInsurance.propertyId,
      insuranceProvider: insertInsurance.insuranceProvider,
      policyNumber: insertInsurance.policyNumber,
      policyType: insertInsurance.policyType,
      coverageAmount: insertInsurance.coverageAmount,
      premium: insertInsurance.premium,
      deductible: insertInsurance.deductible || null,
      startDate: insertInsurance.startDate,
      endDate: insertInsurance.endDate || null,
      contactName: insertInsurance.contactName || null,
      contactPhone: insertInsurance.contactPhone || null,
      contactEmail: insertInsurance.contactEmail || null,
      coverageDetails: insertInsurance.coverageDetails || null,
      documents: insertInsurance.documents || [],
      isActive: insertInsurance.isActive !== undefined ? insertInsurance.isActive : true,
      notes: insertInsurance.notes || null,
      createdAt: now,
      updatedAt: now
    };
    this.insurances.set(id, insurance);
    return insurance;
  }

  async updateInsurance(id: number, updateData: Partial<InsertInsurance>): Promise<Insurance | undefined> {
    const insurance = this.insurances.get(id);
    if (!insurance) {
      return undefined;
    }
    const updatedInsurance: Insurance = {
      ...insurance,
      ...updateData,
      updatedAt: new Date()
    };
    this.insurances.set(id, updatedInsurance);
    return updatedInsurance;
  }

  async deleteInsurance(id: number): Promise<boolean> {
    return this.insurances.delete(id);
  }

  // Mortgage methods
  async getMortgage(id: number): Promise<Mortgage | undefined> {
    return this.mortgages.get(id);
  }

  async getMortgagesByProperty(propertyId: number): Promise<Mortgage[]> {
    return Array.from(this.mortgages.values()).filter(
      (mortgage) => mortgage.propertyId === propertyId
    );
  }

  async createMortgage(insertMortgage: InsertMortgage): Promise<Mortgage> {
    const id = this.mortgageIdCounter++;
    const now = new Date();
    const mortgage: Mortgage = {
      id,
      propertyId: insertMortgage.propertyId,
      lender: insertMortgage.lender,
      loanNumber: insertMortgage.loanNumber,
      loanType: insertMortgage.loanType,
      originalAmount: insertMortgage.originalAmount,
      currentBalance: insertMortgage.currentBalance,
      interestRate: insertMortgage.interestRate,
      monthlyPayment: insertMortgage.monthlyPayment,
      startDate: insertMortgage.startDate,
      maturityDate: insertMortgage.maturityDate || null,
      escrowIncluded: insertMortgage.escrowIncluded !== undefined ? insertMortgage.escrowIncluded : false,
      escrowAmount: insertMortgage.escrowAmount || null,
      contactName: insertMortgage.contactName || null,
      contactPhone: insertMortgage.contactPhone || null,
      contactEmail: insertMortgage.contactEmail || null,
      documents: insertMortgage.documents || [],
      isActive: insertMortgage.isActive !== undefined ? insertMortgage.isActive : true,
      notes: insertMortgage.notes || null,
      createdAt: now,
      updatedAt: now
    };
    this.mortgages.set(id, mortgage);
    return mortgage;
  }

  async updateMortgage(id: number, updateData: Partial<InsertMortgage>): Promise<Mortgage | undefined> {
    const mortgage = this.mortgages.get(id);
    if (!mortgage) {
      return undefined;
    }
    const updatedMortgage: Mortgage = {
      ...mortgage,
      ...updateData,
      updatedAt: new Date()
    };
    this.mortgages.set(id, updatedMortgage);
    return updatedMortgage;
  }

  async deleteMortgage(id: number): Promise<boolean> {
    return this.mortgages.delete(id);
  }

  // Maintenance Request methods
  async getAllMaintenanceRequests(): Promise<MaintenanceRequest[]> {
    return Array.from(this.maintenanceRequests.values());
  }

  async getMaintenanceRequest(id: number): Promise<MaintenanceRequest | null> {
    return this.maintenanceRequests.get(id) || null;
  }

  async getMaintenanceRequestsByProperty(propertyId: number): Promise<MaintenanceRequest[]> {
    return Array.from(this.maintenanceRequests.values()).filter(m => m.propertyId === propertyId);
  }

  async createMaintenanceRequest(data: InsertMaintenanceRequest): Promise<MaintenanceRequest> {
    const id = this.maintenanceRequestIdCounter++;
    const now = new Date();
    const newRequest: MaintenanceRequest = {
      id,
      ...data,
      createdAt: now,
      updatedAt: now
    };
    this.maintenanceRequests.set(id, newRequest);
    return newRequest;
  }

  async updateMaintenanceRequest(id: number, data: Partial<InsertMaintenanceRequest>): Promise<MaintenanceRequest | null> {
    const request = this.maintenanceRequests.get(id);
    if (!request) return null;
    const updatedRequest: MaintenanceRequest = {
      ...request,
      ...data,
      updatedAt: new Date()
    };
    this.maintenanceRequests.set(id, updatedRequest);
    return updatedRequest;
  }

  async deleteMaintenanceRequest(id: number): Promise<boolean> {
    return this.maintenanceRequests.delete(id);
  }


  // Added Appliance methods
  async getAppliances(): Promise<Appliance[]> {
    return Array.from(this.appliances.values());
  }

  async createAppliance(appliance: InsertAppliance): Promise<Appliance> {
    const id = this.applianceIdCounter++;
    const now = new Date();
    const newAppliance: Appliance = { ...appliance, id, createdAt: now, updatedAt: now };
    this.appliances.set(id, newAppliance);
    return newAppliance;
  }

  async updateAppliance(id: number, appliance: Partial<InsertAppliance>): Promise<Appliance | undefined> {
    const existingAppliance = this.appliances.get(id);
    if (!existingAppliance) return undefined;
    const updatedAppliance: Appliance = { ...existingAppliance, ...appliance, updatedAt: new Date() };
    this.appliances.set(id, updatedAppliance);
    return updatedAppliance;
  }

  async deleteAppliance(id: number): Promise<boolean> {
    return this.appliances.delete(id);
  }

  // Additional methods needed for API endpoints
  async getAllInsurances(): Promise<Insurance[]> {
    return this.getInsurances();
  }

  async getInsurances(): Promise<Insurance[]> {
    return Array.from(this.insurances.values());
  }

  async getInsurancesByPropertyId(propertyId: number): Promise<Insurance[]> {
    return this.getInsurancesByProperty(propertyId);
  }

  async getAllMortgages(): Promise<Mortgage[]> {
    return this.getMortgages();
  }

  async getMortgages(): Promise<Mortgage[]> {
    return Array.from(this.mortgages.values());
  }

  async getMortgagesByPropertyId(propertyId: number): Promise<Mortgage[]> {
    return this.getMortgagesByProperty(propertyId);
  }

  async getAllAppliances(): Promise<Appliance[]> {
    return this.getAppliances();
  }
  // Get a specific appliance by ID
  async getAppliance(id: number): Promise<Appliance | null> {
    const appliances = await this.getAppliances();
    const appliance = appliances.find(a => a.id === id);
    console.log(`Fetching appliance with ID ${id}:`, appliance);
    return appliance || null;
  }

  async getUtilityAccounts(): Promise<any[]> {
    return Array.from(this.utilityAccounts.values());
  }

  async getUtilityAccount(id: number): Promise<any | undefined> {
    return this.utilityAccounts.get(id);
  }

  async createUtilityAccount(account: any): Promise<any> {
    const id = this.utilityAccountIdCounter++;
    this.utilityAccounts.set(id, { ...account, id });
    return this.utilityAccounts.get(id);
  }

  async updateUtilityAccount(id: number, account: any): Promise<any | undefined> {
    const existingAccount = this.utilityAccounts.get(id);
    if (!existingAccount) return undefined;
    this.utilityAccounts.set(id, { ...existingAccount, ...account });
    return this.utilityAccounts.get(id);
  }

  async deleteUtilityAccount(id: number): Promise<boolean> {
    return this.utilityAccounts.delete(id);
  }

  async getUtilityBills(): Promise<any[]> {
    return Array.from(this.utilityBills.values());
  }

  async getUtilityBill(id: number): Promise<any | undefined> {
    return this.utilityBills.get(id);
  }

  async createUtilityBill(bill: any): Promise<any> {
    const id = this.utilityBillIdCounter++;
    this.utilityBills.set(id, { ...bill, id });
    return this.utilityBills.get(id);
  }

  async updateUtilityBill(id: number, bill: any): Promise<any | undefined> {
    const existingBill = this.utilityBills.get(id);
    if (!existingBill) return undefined;
    this.utilityBills.set(id, { ...existingBill, ...bill });
    return this.utilityBills.get(id);
  }

  async deleteUtilityBill(id: number): Promise<boolean> {
    return this.utilityBills.delete(id);
  }

  async getInspections(): Promise<any[]> {
    return Array.from(this.inspections.values());
  }

  async getInspection(id: number): Promise<any | undefined> {
    return this.inspections.get(id);
  }

  async createInspection(inspection: any): Promise<any> {
    const id = this.inspectionIdCounter++;
    this.inspections.set(id, { ...inspection, id });
    return this.inspections.get(id);
  }

  async updateInspection(id: number, inspection: any): Promise<any | undefined> {
    const existingInspection = this.inspections.get(id);
    if (!existingInspection) return undefined;
    this.inspections.set(id, { ...existingInspection, ...inspection });
    return this.inspections.get(id);
  }

  async deleteInspection(id: number): Promise<boolean> {
    return this.inspections.delete(id);
  }

  async getCompletedInspections(): Promise<any[]> {
    return Array.from(this.completedInspections.values());
  }

  async getCompletedInspection(id: number): Promise<any | undefined> {
    return this.completedInspections.get(id);
  }

  async createCompletedInspection(inspection: any): Promise<any> {
    const id = this.completedInspectionIdCounter++;
    this.completedInspections.set(id, { ...inspection, id });
    return this.completedInspections.get(id);
  }

  async updateCompletedInspection(id: number, inspection: any): Promise<any | undefined> {
    const existingInspection = this.completedInspections.get(id);
    if (!existingInspection) return undefined;
    this.completedInspections.set(id, { ...existingInspection, ...inspection });
    return this.completedInspections.get(id);
  }

  async deleteCompletedInspection(id: number): Promise<boolean> {
    return this.completedInspections.delete(id);
  }
  
  // Add missing utility function
  async createUtility(utility: any): Promise<any> {
    const id = this.utilityAccountIdCounter++;
    const now = new Date();
    const newUtility = { ...utility, id, createdAt: now, updatedAt: now };
    this.utilityAccounts.set(id, newUtility);
    return newUtility;
  }
  
  // Add missing application function
  async createApplication(application: any): Promise<any> {
    return this.createRentalApplication(application);
  }
  
  // Property inspection methods
  async createPropertyInspection(inspection: any): Promise<any> {
    const id = this.inspectionIdCounter++;
    const now = new Date();
    const newInspection = { ...inspection, id, createdAt: now, updatedAt: now };
    this.inspections.set(id, newInspection);
    return newInspection;
  }
  
  async getAllPropertyInspections(): Promise<any[]> {
    return Array.from(this.inspections.values());
  }
  
  async getPropertyInspectionsByProperty(propertyId: number): Promise<any[]> {
    return Array.from(this.inspections.values()).filter(
      (inspection) => inspection.propertyId === propertyId
    );
  }
}

export const storage = new MemStorage();