import { storage } from "./storage";

// Utility and Property Inspection Sample Data
let utilityAccountCounter = 1;
let utilityBillCounter = 1;
let inspectionCounter = 1;

export function seedUtilitiesAndInspections() {
  // Sample utility accounts
  const utilityAccounts = [
    {
      id: utilityAccountCounter++,
      propertyId: 1,
      utility: "Electricity",
      provider: "Power Corp",
      accountNumber: "ELEC-001",
      status: "active"
    },
    {
      id: utilityAccountCounter++,
      propertyId: 1,
      utility: "Water",
      provider: "City Water",
      accountNumber: "WAT-001",
      status: "active"
    }
  ];

  // Sample utility bills
  const utilityBills = [
    {
      id: utilityBillCounter++,
      utilityAccountId: 1,
      amount: 150.75,
      dueDate: new Date("2024-02-15"),
      status: "unpaid"
    },
    {
      id: utilityBillCounter++,
      utilityAccountId: 2,
      amount: 85.50,
      dueDate: new Date("2024-02-20"),
      status: "paid"
    }
  ];

  // Sample scheduled inspections
  const scheduledInspections = [
    {
      id: inspectionCounter++,
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
      id: inspectionCounter++,
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

  // Store the data
  for (const account of utilityAccounts) {
    storage.utilityAccounts.set(account.id, account);
  }

  for (const bill of utilityBills) {
    storage.utilityBills.set(bill.id, bill);
  }

  for (const inspection of scheduledInspections) {
    storage.inspections.set(inspection.id, inspection);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedUtilitiesAndInspections()
    .then(() => console.log("Utilities and inspections seeding completed successfully"))
    .catch(error => console.error("Error during seeding:", error));
}