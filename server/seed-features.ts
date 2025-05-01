import { storage } from "./storage";

async function storeUtilityAccounts(accounts: any[]) {
  for (const account of accounts) {
    try {
      await storage.createUtilityAccount(account);
      console.log(`Created utility account: ${account.utilityType} for ${account.propertyName}`);
    } catch (error) {
      console.error(`Error creating utility account:`, error);
    }
  }
}

async function storeUtilityBills(bills: any[]) {
  for (const bill of bills) {
    try {
      await storage.createUtilityBill(bill);
      console.log(`Created utility bill: $${bill.amount} for account ID ${bill.utilityAccountId}`);
    } catch (error) {
      console.error(`Error creating utility bill:`, error);
    }
  }
}

async function storeInspections(inspections: any[]) {
  for (const inspection of inspections) {
    try {
      await storage.createInspection(inspection);
      console.log(`Created inspection: ${inspection.inspectionType} for ${inspection.propertyName}`);
    } catch (error) {
      console.error(`Error creating inspection:`, error);
    }
  }
}

async function storeCompletedInspections(inspections: any[]) {
  for (const inspection of inspections) {
    try {
      await storage.createCompletedInspection(inspection);
      console.log(`Created completed inspection: ${inspection.inspectionType} for ${inspection.propertyName}`);
    } catch (error) {
      console.error(`Error creating completed inspection:`, error);
    }
  }
}

export async function seedUtilitiesAndInspections() {
  try {
    console.log("Seeding utilities and inspections...");

    // Sample utility accounts
    const utilityAccounts = [
      {
        id: 1,
        propertyId: 1,
        propertyName: "Sunset Heights",
        utilityProvider: "City Power",
        accountNumber: "EL-123456",
        utilityType: "Electricity",
        status: "active"
      },
      {
        id: 2,
        propertyId: 1,
        propertyName: "Sunset Heights",
        utilityProvider: "City Water",
        accountNumber: "WT-789012",
        utilityType: "Water",
        status: "active"
      },
      {
        id: 3,
        propertyId: 2,
        propertyName: "Maple Gardens",
        utilityProvider: "SoCalGas",
        accountNumber: "G-345678",
        utilityType: "Gas",
        status: "active"
      }
    ];

    // Sample utility bills
    const utilityBills = [
      {
        id: 1,
        utilityAccountId: 1,
        propertyId: 1,
        amount: 150.75,
        dueDate: new Date("2024-02-15"),
        status: "unpaid"
      },
      {
        id: 2,
        utilityAccountId: 2,
        propertyId: 1,
        amount: 85.50,
        dueDate: new Date("2024-02-20"),
        status: "paid"
      },
      {
        id: 3,
        utilityAccountId: 3,
        propertyId: 2,
        amount: 95.22,
        dueDate: new Date("2024-02-25"),
        status: "unpaid"
      }
    ];

    // Sample scheduled inspections
    const scheduledInspections = [
      {
        id: 1,
        propertyId: 1,
        propertyName: "Sunset Heights",
        inspectionType: "Routine",
        scheduledDate: "2024-02-15",
        scheduledTime: "10:00 AM",
        inspector: "David Johnson",
        status: "scheduled",
        units: ["101", "102", "103"]
      },
      {
        id: 2,
        propertyId: 2,
        propertyName: "Maple Gardens",
        inspectionType: "Annual",
        scheduledDate: "2024-02-22",
        scheduledTime: "9:00 AM",
        inspector: "Michael Chen",
        status: "scheduled",
        units: ["A1", "A2", "B1", "B2"]
      }
    ];

    // Sample completed inspections
    const completedInspections = [
      {
        id: 3,
        propertyId: 1,
        propertyName: "Sunset Heights",
        inspectionType: "Move-in",
        inspectionDate: "2024-01-25",
        completedBy: "Sarah Williams",
        status: "passed",
        units: ["204"],
        reportLink: "/reports/inspection-3.pdf",
        findings: [
          { item: "Walls", condition: "Good", notes: "Freshly painted" },
          { item: "Flooring", condition: "Good", notes: "New carpet installed" },
          { item: "Kitchen", condition: "Good", notes: "All appliances working" }
        ]
      }
    ];

    // Store all sample data
    await storeUtilityAccounts(utilityAccounts);
    await storeUtilityBills(utilityBills);
    await storeInspections(scheduledInspections);
    await storeCompletedInspections(completedInspections);

    console.log("Utilities and Property Inspections seeding completed!");
  } catch (error) {
    console.error("Error seeding utilities and inspections:", error);
    throw error;
  }
}