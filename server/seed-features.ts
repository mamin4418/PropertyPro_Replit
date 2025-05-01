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
    // Seed utility accounts
    console.log("Seeding utility accounts and bills...");

    // Sample utility accounts
    const utilityAccounts = [
      {
        propertyId: 1,
        propertyName: "Sunset Heights",
        utilityType: "Electricity",
        provider: "PowerCo Energy",
        accountNumber: "EL-123456",
        serviceAddress: "123 Main St, Anytown, CA 91234",
        billingCycle: "Monthly",
        autopayEnabled: true,
        responsibleParty: "owner"
      },
      {
        propertyId: 1,
        propertyName: "Sunset Heights",
        utilityType: "Water",
        provider: "City Water Services",
        accountNumber: "WA-789012",
        serviceAddress: "123 Main St, Anytown, CA 91234",
        billingCycle: "Bi-monthly",
        autopayEnabled: false,
        responsibleParty: "owner"
      },
      {
        propertyId: 2,
        propertyName: "Maple Gardens",
        utilityType: "Gas",
        provider: "NaturalGas Corp",
        accountNumber: "GS-345678",
        serviceAddress: "456 Oak Lane, Anytown, CA 91234",
        billingCycle: "Monthly",
        autopayEnabled: true,
        responsibleParty: "tenant"
      },
      {
        propertyId: 3,
        propertyName: "Urban Lofts",
        utilityType: "Internet",
        provider: "HighSpeed Networks",
        accountNumber: "IN-901234",
        serviceAddress: "789 Broadway, Anytown, CA 91234",
        billingCycle: "Monthly",
        autopayEnabled: true,
        responsibleParty: "owner"
      }
    ];

    // Create utility accounts
    for (const account of utilityAccounts) {
      await storage.createUtilityAccount(account);
    }

    console.log("Utility accounts created successfully!");

    // Sample utility bills
    const utilityBills = [
      {
        utilityAccountId: 1,
        amount: 145.67,
        dueDate: "2023-08-15",
        billingPeriodStart: "2023-07-01",
        billingPeriodEnd: "2023-07-31",
        status: "paid",
        paymentDate: "2023-08-10"
      },
      {
        utilityAccountId: 1,
        amount: 162.34,
        dueDate: "2023-09-15",
        billingPeriodStart: "2023-08-01",
        billingPeriodEnd: "2023-08-31",
        status: "unpaid"
      },
      {
        utilityAccountId: 2,
        amount: 87.45,
        dueDate: "2023-09-20",
        billingPeriodStart: "2023-07-15",
        billingPeriodEnd: "2023-09-15",
        status: "unpaid"
      },
      {
        utilityAccountId: 3,
        amount: 95.22,
        dueDate: "2023-08-25",
        billingPeriodStart: "2023-08-01",
        billingPeriodEnd: "2023-08-31",
        status: "paid",
        paymentDate: "2023-08-22"
      }
    ];

    // Create utility bills
    for (const bill of utilityBills) {
      await storage.createUtilityBill(bill);
    }

    console.log("Utility bills created successfully!");

    // Now seed property inspections
    console.log("Seeding property inspections...");

    // Sample scheduled inspections
    const scheduledInspections = [
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

    // Create scheduled inspections
    for (const inspection of scheduledInspections) {
      await storage.createInspection(inspection);
    }

    console.log("Scheduled inspections created successfully!");

    // Sample completed inspections
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

    // Create utility accounts
    const utilityAccounts = [
      {
        id: 1,
        propertyId: 1,
        propertyName: "Sunset Heights",
        utilityProvider: "City Water",
        accountNumber: "W-123456",
        utilityType: "Water",
        status: "active"
      },
      {
        id: 2,
        propertyId: 1,
        propertyName: "Sunset Heights",
        utilityProvider: "Edison Electric",
        accountNumber: "E-789012",
        utilityType: "Electricity",
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
      },
      {
        id: 4,
        propertyId: 3,
        propertyName: "Urban Lofts",
        utilityProvider: "Metro Waste",
        accountNumber: "T-901234",
        utilityType: "Trash",
        status: "inactive"
      }
    ];

    // Create utility bills
    const utilityBills = [
      {
        id: 1,
        utilityAccountId: 1,
        propertyId: 1,
        amount: 125.50,
        dueDate: new Date("2023-08-15"),
        status: "paid"
      },
      {
        id: 2,
        utilityAccountId: 2,
        propertyId: 1,
        amount: 210.75,
        dueDate: new Date("2023-08-20"),
        status: "unpaid"
      },
      {
        id: 3,
        utilityAccountId: 3,
        propertyId: 2,
        amount: 85.30,
        dueDate: new Date("2023-08-10"),
        status: "overdue"
      },
      {
        id: 4,
        utilityAccountId: 1,
        propertyId: 1,
        amount: 118.45,
        dueDate: new Date("2023-07-15"),
        status: "paid"
      }
    ];

    // Add utility accounts and bills to storage
    for (const account of utilityAccounts) {
      await storage.createUtilityAccount(account);
    }
    console.log("Utility accounts created successfully!");

    for (const bill of utilityBills) {
      await storage.createUtilityBill(bill);
    }
    console.log("Utility bills created successfully!");

    // Sample scheduled inspections
    const scheduledInspections = [
      {
        id: 1,
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
        id: 2,
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
        id: 3,
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

    // Sample completed inspections
    const completedInspections = [
      {
        id: 4,
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
        id: 5,
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
        id: 6,
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

    // Add scheduled inspections to storage
    for (const inspection of scheduledInspections) {
      await storage.createInspection(inspection);
    }
    console.log("Scheduled inspections created successfully!");

    // Add completed inspections to storage
    for (const inspection of completedInspections) {
      await storage.createCompletedInspection(inspection);
    }
    console.log("Completed inspections created successfully!");

    console.log("Utilities and Property Inspections seeding completed!");
  } catch (error) {
    console.error("Error seeding utilities and inspections:", error);
  }
}