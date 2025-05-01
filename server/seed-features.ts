import { storage } from "./storage";

// Function to store utility accounts in storage
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

// Function to store utility bills in storage
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

// Function to store inspections in storage
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

// Function to store completed inspections in storage
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

// Seed utilities and property inspections
export async function seedUtilitiesAndInspections() {
  try {
    // Sample utility accounts
    const utilityAccounts = [
      {
        propertyId: 1,
        utilityProvider: "City Power & Light",
        accountNumber: "EL-12345678",
        serviceType: "Electricity",
        billingCycle: "Monthly",
        autoPayEnabled: true,
        status: "active"
      },
      {
        propertyId: 1,
        utilityProvider: "Metro Water Services",
        accountNumber: "WT-87654321",
        serviceType: "Water",
        billingCycle: "Quarterly",
        autoPayEnabled: false,
        status: "active"
      },
      {
        propertyId: 2,
        utilityProvider: "Natural Gas Co.",
        accountNumber: "GS-98765432",
        serviceType: "Gas",
        billingCycle: "Monthly",
        autoPayEnabled: true,
        status: "active"
      }
    ];

    // Sample utility bills
    const utilityBills = [
      {
        utilityAccountId: 1,
        propertyId: 1,
        amount: 157.89,
        dueDate: new Date("2023-08-15"),
        startDate: new Date("2023-07-01"),
        endDate: new Date("2023-07-31"),
        status: "unpaid"
      },
      {
        utilityAccountId: 2,
        propertyId: 1,
        amount: 98.45,
        dueDate: new Date("2023-08-20"),
        startDate: new Date("2023-04-01"),
        endDate: new Date("2023-06-30"),
        status: "unpaid"
      },
      {
        utilityAccountId: 3,
        propertyId: 2,
        amount: 45.32,
        dueDate: new Date("2023-08-10"),
        startDate: new Date("2023-07-01"),
        endDate: new Date("2023-07-31"),
        isPaid: true,
        paidDate: new Date("2023-08-08"),
        paidAmount: 45.32,
        status: "paid"
      }
    ];

    // Clear existing utility accounts before seeding
    const existingAccounts = await storage.getUtilityAccounts();
    if (existingAccounts.length === 0) {
      // Seed utility accounts
      for (const util of utilityAccounts) {
        await storage.createUtilityAccount(util);
      }

      // Seed utility bills
      for (const bill of utilityBills) {
        await storage.createUtilityBill(bill);
      }
    }

    // Sample scheduled property inspections
    const inspections = [
      {
        propertyId: 1,
        propertyName: "Sunset Heights",
        inspectionType: "Routine",
        scheduledDate: "2023-08-15",
        scheduledTime: "10:00 AM",
        inspector: "David Johnson",
        status: "scheduled",
        units: ["101", "102", "103"]
      },
      {
        propertyId: 1,
        propertyName: "Sunset Heights",
        inspectionType: "Move-out",
        scheduledDate: "2023-08-10",
        scheduledTime: "2:00 PM",
        inspector: "Sarah Williams",
        status: "scheduled",
        units: ["305"]
      },
      {
        propertyId: 2,
        propertyName: "Maple Gardens",
        inspectionType: "Annual",
        scheduledDate: "2023-08-22",
        scheduledTime: "9:00 AM",
        inspector: "Michael Chen",
        status: "scheduled",
        units: ["A1", "A2", "B1", "B2"]
      }
    ];

    // Sample completed property inspections
    const completedInspections = [
      {
        propertyId: 1,
        propertyName: "Sunset Heights",
        inspectionType: "Move-in",
        inspectionDate: "2023-07-25",
        completedBy: "Sarah Williams",
        status: "passed",
        units: ["204"],
        reportLink: "/reports/inspection-4.pdf",
        findings: [
          { item: "Walls", condition: "Good", notes: "Freshly painted", images: ["wall1.jpg", "wall2.jpg"] },
          { item: "Flooring", condition: "Good", notes: "New carpet installed", images: ["floor1.jpg"] },
          { item: "Kitchen", condition: "Good", notes: "All appliances working", images: ["kitchen1.jpg"] },
          { item: "Bathroom", condition: "Good", notes: "No leaks or issues found", images: ["bathroom1.jpg"] }
        ]
      },
      {
        propertyId: 3,
        propertyName: "Urban Lofts",
        inspectionType: "Maintenance",
        inspectionDate: "2023-07-20",
        completedBy: "David Johnson",
        status: "issues",
        units: ["2B"],
        reportLink: "/reports/inspection-5.pdf",
        findings: [
          { item: "Walls", condition: "Good", notes: "No issues", images: [] },
          { item: "Flooring", condition: "Fair", notes: "Some wear in high traffic areas", images: ["floor-wear.jpg"] },
          { item: "Kitchen", condition: "Poor", notes: "Dishwasher leaking, needs repair", images: ["dishwasher-leak.jpg"] },
          { item: "Bathroom", condition: "Good", notes: "Recent renovation, all fixtures working", images: [] }
        ]
      },
      {
        propertyId: 2,
        propertyName: "Maple Gardens",
        inspectionType: "Routine",
        inspectionDate: "2023-07-15",
        completedBy: "Michael Chen",
        status: "passed",
        units: ["C3"],
        reportLink: "/reports/inspection-6.pdf",
        findings: [
          { item: "Walls", condition: "Good", notes: "No issues", images: [] },
          { item: "Flooring", condition: "Good", notes: "No issues", images: [] },
          { item: "Kitchen", condition: "Good", notes: "All appliances working", images: [] },
          { item: "Bathroom", condition: "Good", notes: "No leaks or issues found", images: [] }
        ]
      }
    ];

    // Check if inspections already exist
    const existingInspections = await storage.getInspections();
    if (existingInspections.length === 0) {
      // Seed inspections
      for (const inspection of inspections) {
        await storage.createInspection(inspection);
      }
    }

    // Check if completed inspections already exist
    const existingCompletedInspections = await storage.getCompletedInspections();
    if (existingCompletedInspections.length === 0) {
      // Seed completed inspections
      for (const inspection of completedInspections) {
        await storage.createCompletedInspection(inspection);
      }
    }

    console.log("Utilities and property inspections data seeded successfully!");
  } catch (error) {
    console.error("Error seeding utilities and property inspections data:", error);
  }
}