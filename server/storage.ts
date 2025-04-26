import { users, type User, type InsertUser, type Contact, type InsertContact, type Address, type InsertAddress, type ContactAddress, type Appliance, type InsertAppliance, type RentalApplication, type InsertRentalApplication, type ApplicationTemplate, type InsertApplicationTemplate } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private contacts: Map<number, Contact>;
  private addresses: Map<number, Address>;
  private contactAddresses: Map<string, ContactAddress>; // key is contactId-addressId
  private appliances: Map<number, Appliance>;
  private userIdCounter: number;
  private contactIdCounter: number;
  private addressIdCounter: number;
  private contactAddressIdCounter: number;
  private applianceIdCounter: number;

  constructor() {
    this.users = new Map();
    this.contacts = new Map();
    this.addresses = new Map();
    this.contactAddresses = new Map();
    this.appliances = new Map();
    this.userIdCounter = 1;
    this.contactIdCounter = 1;
    this.addressIdCounter = 1;
    this.contactAddressIdCounter = 1;
    this.applianceIdCounter = 1;
    
    this.rentalApplications = new Map();
    this.applicationTemplates = new Map();
    this.rentalApplicationIdCounter = 1;
    this.applicationTemplateIdCounter = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
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
    
    // Create a contact with all fields explicitly set to ensure type safety
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
    const entries = Array.from(this.contactAddresses.entries());
    for (const [key, contactAddress] of entries) {
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
    // Check if contact and address exist
    const contact = this.contacts.get(contactId);
    const address = this.addresses.get(addressId);
    
    if (!contact || !address) {
      throw new Error('Contact or address does not exist');
    }
    
    const key = `${contactId}-${addressId}`;
    const now = new Date();
    
    // If this is the primary address, make all other addresses for this contact non-primary
    if (isPrimary) {
      const entries = Array.from(this.contactAddresses.entries());
      for (const [existingKey, existingRel] of entries) {
        if (existingRel.contactId === contactId && existingRel.isPrimary) {
          const updated = { ...existingRel, isPrimary: false, updatedAt: now };
          this.contactAddresses.set(existingKey, updated);
        }
      }
    }
    
    // Create new relationship or update existing one
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
  private rentalApplications: Map<number, RentalApplication> = new Map();
  private rentalApplicationIdCounter: number = 1;
  
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
  private applicationTemplates: Map<number, ApplicationTemplate> = new Map();
  private applicationTemplateIdCounter: number = 1;
  
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
}

export const storage = new MemStorage();
