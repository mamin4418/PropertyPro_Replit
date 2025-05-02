import fs from "fs";
import path from "path";
import { Storage } from "node-storage";

class PropertyStorage {
  properties = new Map();
  tenants = new Map();
  units = new Map();
  leases = new Map();
  rents = new Map();
  companies = new Map();
  persons = new Map();
  contacts = new Map();
  vendors = new Map();
  applications = new Map();
  mortgages = new Map();
  charges = new Map();
  maintenance = new Map();
  appliances = new Map();
  insurance = new Map();
  bankAccounts = new Map();
  payments = new Map();
  utilityAccounts = new Map();
  utilityBills = new Map();
  inspections = new Map();
  scheduledInspections = new Map();
  completedInspections = new Map();
  tasks = new Map();

  propertyIdCounter = 1;
  tenantIdCounter = 1;
  unitIdCounter = 1;
  leaseIdCounter = 1;
  companyIdCounter = 1;
  personIdCounter = 1;
  contactIdCounter = 1;
  vendorIdCounter = 1;
  applicationIdCounter = 1;
  mortgageIdCounter = 1;
  chargeIdCounter = 1;
  maintenanceIdCounter = 1;
  applianceIdCounter = 1;
  insuranceIdCounter = 1;
  bankAccountIdCounter = 1;
  paymentIdCounter = 1;
  utilityAccountIdCounter = 1;
  utilityBillIdCounter = 1;
  inspectionIdCounter = 1;
  scheduledInspectionIdCounter = 1;
  completedInspectionIdCounter = 1;
  taskIdCounter = 1;

  constructor() {
    // Initialize empty maps
  }

  async set(key: string, value: any): Promise<void> {
    // Handle different data types appropriately
    if (key === 'utilityAccounts') {
      this.utilityAccounts.clear();
      value.forEach((account: any) => {
        this.utilityAccounts.set(account.id, account);
      });
      this.utilityAccountIdCounter = Math.max(...value.map((a: any) => a.id), 0) + 1;
    } 
    else if (key === 'utilityBills') {
      this.utilityBills.clear();
      value.forEach((bill: any) => {
        this.utilityBills.set(bill.id, bill);
      });
      this.utilityBillIdCounter = Math.max(...value.map((b: any) => b.id), 0) + 1;
    }
    else if (key === 'scheduledInspections') {
      this.scheduledInspections.clear();
      value.forEach((inspection: any) => {
        this.scheduledInspections.set(inspection.id, inspection);
      });
      this.scheduledInspectionIdCounter = Math.max(...value.map((i: any) => i.id), 0) + 1;
    }
    else if (key === 'completedInspections') {
      this.completedInspections.clear();
      value.forEach((inspection: any) => {
        this.completedInspections.set(inspection.id, inspection);
      });
      this.completedInspectionIdCounter = Math.max(...value.map((i: any) => i.id), 0) + 1;
    }
    else if (key === 'tasks') {
      this.tasks.clear();
      value.forEach((task: any) => {
        this.tasks.set(task.id, task);
      });
      this.taskIdCounter = Math.max(...value.map((t: any) => t.id), 0) + 1;
    }
  }

  async get(key: string): Promise<any> {
    if (key === 'utilityAccounts') {
      return Array.from(this.utilityAccounts.values());
    } 
    else if (key === 'utilityBills') {
      return Array.from(this.utilityBills.values());
    }
    else if (key === 'scheduledInspections') {
      return Array.from(this.scheduledInspections.values());
    }
    else if (key === 'completedInspections') {
      return Array.from(this.completedInspections.values());
    }
    else if (key === 'tasks') {
      return Array.from(this.tasks.values());
    }
    return null;
  }

  // Property methods
  async getProperties(): Promise<any[]> {
    return Array.from(this.properties.values());
  }

  async getProperty(id: number): Promise<any | undefined> {
    return this.properties.get(id);
  }

  async createProperty(property: any): Promise<any> {
    const id = this.propertyIdCounter++;
    const now = new Date();
    const newProperty = { ...property, id, createdAt: now, updatedAt: now };
    this.properties.set(id, newProperty);
    return newProperty;
  }

  async updateProperty(id: number, property: any): Promise<any | undefined> {
    const existingProperty = this.properties.get(id);
    if (!existingProperty) return undefined;

    const updatedProperty = { ...existingProperty, ...property, updatedAt: new Date() };
    this.properties.set(id, updatedProperty);
    return updatedProperty;
  }

  async deleteProperty(id: number): Promise<boolean> {
    return this.properties.delete(id);
  }

  // Tenant methods
  async getTenants(): Promise<any[]> {
    return Array.from(this.tenants.values());
  }

  async getTenant(id: number): Promise<any | undefined> {
    return this.tenants.get(id);
  }

  async createTenant(tenant: any): Promise<any> {
    const id = this.tenantIdCounter++;
    const now = new Date();
    const newTenant = { ...tenant, id, createdAt: now, updatedAt: now };
    this.tenants.set(id, newTenant);
    return newTenant;
  }

  async updateTenant(id: number, tenant: any): Promise<any | undefined> {
    const existingTenant = this.tenants.get(id);
    if (!existingTenant) return undefined;

    const updatedTenant = { ...existingTenant, ...tenant, updatedAt: new Date() };
    this.tenants.set(id, updatedTenant);
    return updatedTenant;
  }

  async deleteTenant(id: number): Promise<boolean> {
    return this.tenants.delete(id);
  }

  // Unit methods
  async getUnits(): Promise<any[]> {
    return Array.from(this.units.values());
  }

  async getUnit(id: number): Promise<any | undefined> {
    return this.units.get(id);
  }

  async createUnit(unit: any): Promise<any> {
    const id = this.unitIdCounter++;
    const now = new Date();
    const newUnit = { ...unit, id, createdAt: now, updatedAt: now };
    this.units.set(id, newUnit);
    return newUnit;
  }

  async updateUnit(id: number, unit: any): Promise<any | undefined> {
    const existingUnit = this.units.get(id);
    if (!existingUnit) return undefined;

    const updatedUnit = { ...existingUnit, ...unit, updatedAt: new Date() };
    this.units.set(id, updatedUnit);
    return updatedUnit;
  }

  async deleteUnit(id: number): Promise<boolean> {
    return this.units.delete(id);
  }

  // Lease methods
  async getLeases(): Promise<any[]> {
    return Array.from(this.leases.values());
  }

  async getLease(id: number): Promise<any | undefined> {
    return this.leases.get(id);
  }

  async createLease(lease: any): Promise<any> {
    const id = this.leaseIdCounter++;
    const now = new Date();
    const newLease = { ...lease, id, createdAt: now, updatedAt: now };
    this.leases.set(id, newLease);
    return newLease;
  }

  async updateLease(id: number, lease: any): Promise<any | undefined> {
    const existingLease = this.leases.get(id);
    if (!existingLease) return undefined;

    const updatedLease = { ...existingLease, ...lease, updatedAt: new Date() };
    this.leases.set(id, updatedLease);
    return updatedLease;
  }

  async deleteLease(id: number): Promise<boolean> {
    return this.leases.delete(id);
  }

  // Company methods
  async getCompanies(): Promise<any[]> {
    return Array.from(this.companies.values());
  }

  async getCompany(id: number): Promise<any | undefined> {
    return this.companies.get(id);
  }

  async createCompany(company: any): Promise<any> {
    const id = this.companyIdCounter++;
    const now = new Date();
    const newCompany = { ...company, id, createdAt: now, updatedAt: now };
    this.companies.set(id, newCompany);
    return newCompany;
  }

  async updateCompany(id: number, company: any): Promise<any | undefined> {
    const existingCompany = this.companies.get(id);
    if (!existingCompany) return undefined;

    const updatedCompany = { ...existingCompany, ...company, updatedAt: new Date() };
    this.companies.set(id, updatedCompany);
    return updatedCompany;
  }

  async deleteCompany(id: number): Promise<boolean> {
    return this.companies.delete(id);
  }

  // Person methods
  async getPersons(): Promise<any[]> {
    return Array.from(this.persons.values());
  }

  async getPerson(id: number): Promise<any | undefined> {
    return this.persons.get(id);
  }

  async createPerson(person: any): Promise<any> {
    const id = this.personIdCounter++;
    const now = new Date();
    const newPerson = { ...person, id, createdAt: now, updatedAt: now };
    this.persons.set(id, newPerson);
    return newPerson;
  }

  async updatePerson(id: number, person: any): Promise<any | undefined> {
    const existingPerson = this.persons.get(id);
    if (!existingPerson) return undefined;

    const updatedPerson = { ...existingPerson, ...person, updatedAt: new Date() };
    this.persons.set(id, updatedPerson);
    return updatedPerson;
  }

  async deletePerson(id: number): Promise<boolean> {
    return this.persons.delete(id);
  }

  // Contact methods
  async getContacts(): Promise<any[]> {
    return Array.from(this.contacts.values());
  }

  async getContact(id: number): Promise<any | undefined> {
    return this.contacts.get(id);
  }

  async createContact(contact: any): Promise<any> {
    const id = this.contactIdCounter++;
    const now = new Date();
    const newContact = { ...contact, id, createdAt: now, updatedAt: now };
    this.contacts.set(id, newContact);
    return newContact;
  }

  async updateContact(id: number, contact: any): Promise<any | undefined> {
    const existingContact = this.contacts.get(id);
    if (!existingContact) return undefined;

    const updatedContact = { ...existingContact, ...contact, updatedAt: new Date() };
    this.contacts.set(id, updatedContact);
    return updatedContact;
  }

  async deleteContact(id: number): Promise<boolean> {
    return this.contacts.delete(id);
  }

  // Vendor methods
  async getVendors(): Promise<any[]> {
    return Array.from(this.vendors.values());
  }

  async getVendor(id: number): Promise<any | undefined> {
    return this.vendors.get(id);
  }

  async createVendor(vendor: any): Promise<any> {
    const id = this.vendorIdCounter++;
    const now = new Date();
    const newVendor = { ...vendor, id, createdAt: now, updatedAt: now };
    this.vendors.set(id, newVendor);
    return newVendor;
  }

  async updateVendor(id: number, vendor: any): Promise<any | undefined> {
    const existingVendor = this.vendors.get(id);
    if (!existingVendor) return undefined;

    const updatedVendor = { ...existingVendor, ...vendor, updatedAt: new Date() };
    this.vendors.set(id, updatedVendor);
    return updatedVendor;
  }

  async deleteVendor(id: number): Promise<boolean> {
    return this.vendors.delete(id);
  }

  // Application methods
  async getApplications(): Promise<any[]> {
    return Array.from(this.applications.values());
  }

  async getApplication(id: number): Promise<any | undefined> {
    return this.applications.get(id);
  }

  async createApplication(application: any): Promise<any> {
    const id = this.applicationIdCounter++;
    const now = new Date();
    const newApplication = { ...application, id, createdAt: now, updatedAt: now };
    this.applications.set(id, newApplication);
    return newApplication;
  }

  async updateApplication(id: number, application: any): Promise<any | undefined> {
    const existingApplication = this.applications.get(id);
    if (!existingApplication) return undefined;

    const updatedApplication = { ...existingApplication, ...application, updatedAt: new Date() };
    this.applications.set(id, updatedApplication);
    return updatedApplication;
  }

  async deleteApplication(id: number): Promise<boolean> {
    return this.applications.delete(id);
  }

  // Mortgage methods
  async getMortgages(): Promise<any[]> {
    return Array.from(this.mortgages.values());
  }

  async getMortgage(id: number): Promise<any | undefined> {
    return this.mortgages.get(id);
  }

  async createMortgage(mortgage: any): Promise<any> {
    const id = this.mortgageIdCounter++;
    const now = new Date();
    const newMortgage = { ...mortgage, id, createdAt: now, updatedAt: now };
    this.mortgages.set(id, newMortgage);
    return newMortgage;
  }

  async updateMortgage(id: number, mortgage: any): Promise<any | undefined> {
    const existingMortgage = this.mortgages.get(id);
    if (!existingMortgage) return undefined;

    const updatedMortgage = { ...existingMortgage, ...mortgage, updatedAt: new Date() };
    this.mortgages.set(id, updatedMortgage);
    return updatedMortgage;
  }

  async deleteMortgage(id: number): Promise<boolean> {
    return this.mortgages.delete(id);
  }

  // Charge methods
  async getCharges(): Promise<any[]> {
    return Array.from(this.charges.values());
  }

  async getCharge(id: number): Promise<any | undefined> {
    return this.charges.get(id);
  }

  async createCharge(charge: any): Promise<any> {
    const id = this.chargeIdCounter++;
    const now = new Date();
    const newCharge = { ...charge, id, createdAt: now, updatedAt: now };
    this.charges.set(id, newCharge);
    return newCharge;
  }

  async updateCharge(id: number, charge: any): Promise<any | undefined> {
    const existingCharge = this.charges.get(id);
    if (!existingCharge) return undefined;

    const updatedCharge = { ...existingCharge, ...charge, updatedAt: new Date() };
    this.charges.set(id, updatedCharge);
    return updatedCharge;
  }

  async deleteCharge(id: number): Promise<boolean> {
    return this.charges.delete(id);
  }

  // Maintenance methods
  async getMaintenanceRequests(): Promise<any[]> {
    return Array.from(this.maintenance.values());
  }

  async getMaintenanceRequest(id: number): Promise<any | undefined> {
    return this.maintenance.get(id);
  }

  async createMaintenanceRequest(request: any): Promise<any> {
    const id = this.maintenanceIdCounter++;
    const now = new Date();
    const newRequest = { ...request, id, createdAt: now, updatedAt: now };
    this.maintenance.set(id, newRequest);
    return newRequest;
  }

  async updateMaintenanceRequest(id: number, request: any): Promise<any | undefined> {
    const existingRequest = this.maintenance.get(id);
    if (!existingRequest) return undefined;

    const updatedRequest = { ...existingRequest, ...request, updatedAt: new Date() };
    this.maintenance.set(id, updatedRequest);
    return updatedRequest;
  }

  async deleteMaintenanceRequest(id: number): Promise<boolean> {
    return this.maintenance.delete(id);
  }

  // Appliance methods
  async getAppliances(): Promise<any[]> {
    return Array.from(this.appliances.values());
  }

  async getAppliance(id: number): Promise<any | undefined> {
    return this.appliances.get(id);
  }

  async createAppliance(appliance: any): Promise<any> {
    const id = this.applianceIdCounter++;
    const now = new Date();
    const newAppliance = { ...appliance, id, createdAt: now, updatedAt: now };
    this.appliances.set(id, newAppliance);
    return newAppliance;
  }

  async updateAppliance(id: number, appliance: any): Promise<any | undefined> {
    const existingAppliance = this.appliances.get(id);
    if (!existingAppliance) return undefined;

    const updatedAppliance = { ...existingAppliance, ...appliance, updatedAt: new Date() };
    this.appliances.set(id, updatedAppliance);
    return updatedAppliance;
  }

  async deleteAppliance(id: number): Promise<boolean> {
    return this.appliances.delete(id);
  }

  // Insurance methods
  async getInsurances(): Promise<any[]> {
    return Array.from(this.insurance.values());
  }

  async getInsurance(id: number): Promise<any | undefined> {
    return this.insurance.get(id);
  }

  async createInsurance(insurance: any): Promise<any> {
    const id = this.insuranceIdCounter++;
    const now = new Date();
    const newInsurance = { ...insurance, id, createdAt: now, updatedAt: now };
    this.insurance.set(id, newInsurance);
    return newInsurance;
  }

  async updateInsurance(id: number, insurance: any): Promise<any | undefined> {
    const existingInsurance = this.insurance.get(id);
    if (!existingInsurance) return undefined;

    const updatedInsurance = { ...existingInsurance, ...insurance, updatedAt: new Date() };
    this.insurance.set(id, updatedInsurance);
    return updatedInsurance;
  }

  async deleteInsurance(id: number): Promise<boolean> {
    return this.insurance.delete(id);
  }

  // Bank Account methods
  async getBankAccounts(): Promise<any[]> {
    return Array.from(this.bankAccounts.values());
  }

  async getBankAccount(id: number): Promise<any | undefined> {
    return this.bankAccounts.get(id);
  }

  async createBankAccount(account: any): Promise<any> {
    const id = this.bankAccountIdCounter++;
    const now = new Date();
    const newAccount = { ...account, id, createdAt: now, updatedAt: now };
    this.bankAccounts.set(id, newAccount);
    return newAccount;
  }

  async updateBankAccount(id: number, account: any): Promise<any | undefined> {
    const existingAccount = this.bankAccounts.get(id);
    if (!existingAccount) return undefined;

    const updatedAccount = { ...existingAccount, ...account, updatedAt: new Date() };
    this.bankAccounts.set(id, updatedAccount);
    return updatedAccount;
  }

  async deleteBankAccount(id: number): Promise<boolean> {
    return this.bankAccounts.delete(id);
  }

  // Payment methods
  async getPayments(): Promise<any[]> {
    return Array.from(this.payments.values());
  }

  async getPayment(id: number): Promise<any | undefined> {
    return this.payments.get(id);
  }

  async createPayment(payment: any): Promise<any> {
    const id = this.paymentIdCounter++;
    const now = new Date();
    const newPayment = { ...payment, id, createdAt: now, updatedAt: now };
    this.payments.set(id, newPayment);
    return newPayment;
  }

  async updatePayment(id: number, payment: any): Promise<any | undefined> {
    const existingPayment = this.payments.get(id);
    if (!existingPayment) return undefined;

    const updatedPayment = { ...existingPayment, ...payment, updatedAt: new Date() };
    this.payments.set(id, updatedPayment);
    return updatedPayment;
  }

  async deletePayment(id: number): Promise<boolean> {
    return this.payments.delete(id);
  }

  // Utility account methods
  async getUtilityAccounts(): Promise<any[]> {
    return Array.from(this.utilityAccounts.values());
  }

  async getUtilityAccount(id: number): Promise<any | undefined> {
    return this.utilityAccounts.get(id);
  }

  async createUtilityAccount(account: any): Promise<any> {
    const id = this.utilityAccountIdCounter++;
    const now = new Date();
    const newAccount = { ...account, id, createdAt: now, updatedAt: now };
    this.utilityAccounts.set(id, newAccount);
    return newAccount;
  }

  async updateUtilityAccount(id: number, account: any): Promise<any | undefined> {
    const existingAccount = this.utilityAccounts.get(id);
    if (!existingAccount) return undefined;

    const updatedAccount = { ...existingAccount, ...account, updatedAt: new Date() };
    this.utilityAccounts.set(id, updatedAccount);
    return updatedAccount;
  }

  async deleteUtilityAccount(id: number): Promise<boolean> {
    return this.utilityAccounts.delete(id);
  }

  // Utility bill methods
  async getUtilityBills(): Promise<any[]> {
    return Array.from(this.utilityBills.values());
  }

  async getUtilityBill(id: number): Promise<any | undefined> {
    return this.utilityBills.get(id);
  }

  async createUtilityBill(bill: any): Promise<any> {
    const id = this.utilityBillIdCounter++;
    const now = new Date();
    const newBill = { ...bill, id, createdAt: now, updatedAt: now };
    this.utilityBills.set(id, newBill);
    return newBill;
  }

  async updateUtilityBill(id: number, bill: any): Promise<any | undefined> {
    const existingBill = this.utilityBills.get(id);
    if (!existingBill) return undefined;

    const updatedBill = { ...existingBill, ...bill, updatedAt: new Date() };
    this.utilityBills.set(id, updatedBill);
    return updatedBill;
  }

  async deleteUtilityBill(id: number): Promise<boolean> {
    return this.utilityBills.delete(id);
  }

  // Property inspection methods
  async getInspections(): Promise<any[]> {
    const scheduled = Array.from(this.scheduledInspections.values());
    const completed = Array.from(this.completedInspections.values());
    return [...scheduled, ...completed];
  }

  async getScheduledInspections(): Promise<any[]> {
    return Array.from(this.scheduledInspections.values());
  }

  async getCompletedInspections(): Promise<any[]> {
    return Array.from(this.completedInspections.values());
  }

  async getInspection(id: number): Promise<any | undefined> {
    return this.scheduledInspections.get(id) || this.completedInspections.get(id);
  }

  async createInspection(inspection: any): Promise<any> {
    const id = this.inspectionIdCounter++;
    const now = new Date();
    const newInspection = { ...inspection, id, createdAt: now, updatedAt: now };

    if (inspection.status === 'scheduled') {
      this.scheduledInspections.set(id, newInspection);
    } else {
      this.completedInspections.set(id, newInspection);
    }

    return newInspection;
  }

  async updateInspection(id: number, inspection: any): Promise<any | undefined> {
    let existingInspection = this.scheduledInspections.get(id) || this.completedInspections.get(id);
    if (!existingInspection) return undefined;

    const updatedInspection = { ...existingInspection, ...inspection, updatedAt: new Date() };

    // Handle status changes that might move inspection between collections
    if (existingInspection.status === 'scheduled' && inspection.status !== 'scheduled') {
      this.scheduledInspections.delete(id);
      this.completedInspections.set(id, updatedInspection);
    } else if (existingInspection.status !== 'scheduled' && inspection.status === 'scheduled') {
      this.completedInspections.delete(id);
      this.scheduledInspections.set(id, updatedInspection);
    } else if (existingInspection.status === 'scheduled') {
      this.scheduledInspections.set(id, updatedInspection);
    } else {
      this.completedInspections.set(id, updatedInspection);
    }

    return updatedInspection;
  }

  async deleteInspection(id: number): Promise<boolean> {
    return this.scheduledInspections.delete(id) || this.completedInspections.delete(id);
  }

  // Task methods
  async getTasks(): Promise<any[]> {
    return Array.from(this.tasks.values());
  }

  async getTask(id: number): Promise<any | undefined> {
    return this.tasks.get(id);
  }

  async createTask(task: any): Promise<any> {
    const id = this.taskIdCounter++;
    const now = new Date();
    const newTask = { ...task, id, createdAt: now, updatedAt: now };
    this.tasks.set(id, newTask);
    return newTask;
  }

  async updateTask(id: number, task: any): Promise<any | undefined> {
    const existingTask = this.tasks.get(id);
    if (!existingTask) return undefined;

    const updatedTask = { ...existingTask, ...task, updatedAt: new Date() };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async deleteTask(id: number): Promise<boolean> {
    return this.tasks.delete(id);
  }
}

export const storage = new PropertyStorage();