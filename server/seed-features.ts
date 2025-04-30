
import { storage } from "./storage";

export async function seedUtilitiesAndInspections() {
  try {
    console.log("Seeding utilities and property inspections data...");
    
    // Sample utility accounts
    const utilityAccounts = [
      {
        id: 1,
        propertyId: 1,
        propertyName: "Sunset Heights",
        utilityType: "Electricity",
        provider: "PowerCo Energy",
        accountNumber: "EL-12345-789",
        meterNumber: "MT-98765",
        billingCycle: "Monthly",
        averageCost: 450,
        status: "active"
      },
      {
        id: 2,
        propertyId: 1,
        propertyName: "Sunset Heights",
        utilityType: "Water",
        provider: "City Water Services",
        accountNumber: "WT-56789-123",
        meterNumber: "MT-45678",
        billingCycle: "Quarterly",
        averageCost: 320,
        status: "active"
      },
      {
        id: 3,
        propertyId: 2,
        propertyName: "Maple Gardens",
        utilityType: "Gas",
        provider: "NaturalGas Co.",
        accountNumber: "GS-98765-432",
        meterNumber: "MT-34521",
        billingCycle: "Monthly",
        averageCost: 180,
        status: "active"
      },
      {
        id: 4,
        propertyId: 3,
        propertyName: "Urban Lofts",
        utilityType: "Internet",
        provider: "FastConnect ISP",
        accountNumber: "IN-54321-987",
        meterNumber: "N/A",
        billingCycle: "Monthly",
        averageCost: 89,
        status: "active"
      },
      {
        id: 5,
        propertyId: 2,
        propertyName: "Maple Gardens",
        utilityType: "Electricity",
        provider: "PowerCo Energy",
        accountNumber: "EL-67890-543",
        meterNumber: "MT-76543",
        billingCycle: "Monthly",
        averageCost: 380,
        status: "active"
      },
    ];
    
    // Sample utility bills
    const utilityBills = [
      {
        id: 1,
        utilityAccountId: 1,
        propertyName: "Sunset Heights",
        utilityType: "Electricity",
        billDate: "2023-06-01",
        dueDate: "2023-06-15",
        amount: 445.78,
        consumption: "4,823 kWh",
        status: "paid",
        paidDate: "2023-06-10"
      },
      {
        id: 2,
        utilityAccountId: 1,
        propertyName: "Sunset Heights",
        utilityType: "Electricity",
        billDate: "2023-07-01",
        dueDate: "2023-07-15",
        amount: 467.92,
        consumption: "5,102 kWh",
        status: "paid",
        paidDate: "2023-07-12"
      },
      {
        id: 3,
        utilityAccountId: 2,
        propertyName: "Sunset Heights",
        utilityType: "Water",
        billDate: "2023-06-01",
        dueDate: "2023-06-30",
        amount: 315.45,
        consumption: "28,450 gal",
        status: "paid",
        paidDate: "2023-06-25"
      },
      {
        id: 4,
        utilityAccountId: 3,
        propertyName: "Maple Gardens",
        utilityType: "Gas",
        billDate: "2023-07-01",
        dueDate: "2023-07-21",
        amount: 178.32,
        consumption: "148 therms",
        status: "due",
        paidDate: null
      },
      {
        id: 5,
        utilityAccountId: 5,
        propertyName: "Maple Gardens",
        utilityType: "Electricity",
        billDate: "2023-07-01",
        dueDate: "2023-07-25",
        amount: 392.17,
        consumption: "4,235 kWh",
        status: "overdue",
        paidDate: null
      },
    ];
    
    // Sample property inspections
    const inspections = [
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
      },
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
      },
    ];
    
    // Add data to storage
    await Promise.all([
      storeUtilityAccounts(utilityAccounts),
      storeUtilityBills(utilityBills),
      storeInspections(inspections),
      storeCompletedInspections(completedInspections)
    ]);
    
    console.log("Successfully seeded utilities and property inspections data");
  } catch (error) {
    console.error("Error seeding utilities and property inspections data:", error);
  }
}

// Helper functions to store data in the storage
async function storeUtilityAccounts(accounts) {
  try {
    if (!storage.utilityAccounts) {
      storage.utilityAccounts = new Map();
    }
    
    accounts.forEach(account => {
      storage.utilityAccounts.set(account.id, account);
    });
    
    return true;
  } catch (error) {
    console.error("Error storing utility accounts:", error);
    return false;
  }
}

async function storeUtilityBills(bills) {
  try {
    if (!storage.utilityBills) {
      storage.utilityBills = new Map();
    }
    
    bills.forEach(bill => {
      storage.utilityBills.set(bill.id, bill);
    });
    
    return true;
  } catch (error) {
    console.error("Error storing utility bills:", error);
    return false;
  }
}

async function storeInspections(inspections) {
  try {
    if (!storage.inspections) {
      storage.inspections = new Map();
    }
    
    inspections.forEach(inspection => {
      storage.inspections.set(inspection.id, inspection);
    });
    
    return true;
  } catch (error) {
    console.error("Error storing inspections:", error);
    return false;
  }
}

async function storeCompletedInspections(inspections) {
  try {
    if (!storage.completedInspections) {
      storage.completedInspections = new Map();
    }
    
    inspections.forEach(inspection => {
      storage.completedInspections.set(inspection.id, inspection);
    });
    
    return true;
  } catch (error) {
    console.error("Error storing completed inspections:", error);
    return false;
  }
}
