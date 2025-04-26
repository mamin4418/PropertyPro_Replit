import { users, type User, type InsertUser, type Contact, type InsertContact } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Contact methods
  getContact(id: number): Promise<Contact | undefined>;
  getContacts(): Promise<Contact[]>;
  getContactsByType(type: string): Promise<Contact[]>;
  createContact(contact: InsertContact): Promise<Contact>;
  updateContact(id: number, contact: Partial<InsertContact>): Promise<Contact | undefined>;
  deleteContact(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private contacts: Map<number, Contact>;
  private userIdCounter: number;
  private contactIdCounter: number;

  constructor() {
    this.users = new Map();
    this.contacts = new Map();
    this.userIdCounter = 1;
    this.contactIdCounter = 1;
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
      address: insertContact.address || null,
      city: insertContact.city || null,
      state: insertContact.state || null,
      zipcode: insertContact.zipcode || null,
      country: insertContact.country || null,
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
}

export const storage = new MemStorage();
