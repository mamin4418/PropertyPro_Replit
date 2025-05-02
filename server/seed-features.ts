
import { storage } from "./storage";

// Utility and Property Inspection Sample Data
let utilityAccountCounter = 1;
let utilityBillCounter = 1;
let inspectionCounter = 1;

async function seedUtilitiesAndInspections() {
  try {
    console.log("Seeding utilities and property inspections data...");
    
    // Utility Accounts Data
    const utilityAccounts = [
      {
        id: utilityAccountCounter++,
        propertyId: 1,
        propertyName: "Sunset Heights",
        utilityProvider: "City Water",
        accountNumber: "W-123456",
        utilityType: "Water",
        status: "active"
      },
      {
        id: utilityAccountCounter++,
        propertyId: 1,
        propertyName: "Sunset Heights",
        utilityProvider: "Edison Electric",
        accountNumber: "E-789012",
        utilityType: "Electricity",
        status: "active"
      },
      {
        id: utilityAccountCounter++,
        propertyId: 2,
        propertyName: "Maple Gardens",
        utilityProvider: "Natural Gas Co",
        accountNumber: "G-345678",
        utilityType: "Gas",
        status: "active"
      }
    ];
    
    // Utility Bills Data
    const utilityBills = [
      {
        id: utilityBillCounter++,
        utilityAccountId: 1,
        propertyId: 1,
        amount: 125.50,
        dueDate: "2023-08-15",
        status: "paid"
      },
      {
        id: utilityBillCounter++,
        utilityAccountId: 2,
        propertyId: 1,
        amount: 210.75,
        dueDate: "2023-08-20",
        status: "unpaid"
      },
      {
        id: utilityBillCounter++,
        utilityAccountId: 3,
        propertyId: 2,
        amount: 85.25,
        dueDate: "2023-08-25",
        status: "overdue"
      }
    ];
    
    // Scheduled Property Inspections
    const scheduledInspections = [
      {
        id: inspectionCounter++,
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
        id: inspectionCounter++,
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
        id: inspectionCounter++,
        propertyId: 2,
        propertyName: "Maple Gardens",
        inspectionType: "Maintenance",
        scheduledDate: "2023-08-18",
        scheduledTime: "11:30 AM",
        inspector: "Michael Brown",
        status: "scheduled",
        units: ["B2", "C1"]
      }
    ];
    
    // Completed Property Inspections
    const completedInspections = [
      {
        id: inspectionCounter++,
        propertyId: 1,
        propertyName: "Sunset Heights",
        inspectionType: "Move-in",
        inspectionDate: "2023-07-25",
        completedBy: "Sarah Williams",
        status: "passed",
        units: ["204"],
        findings: [
          { item: "Walls", condition: "Good", notes: "Freshly painted" },
          { item: "Flooring", condition: "Good", notes: "New carpet installed" }
        ]
      },
      {
        id: inspectionCounter++,
        propertyId: 2,
        propertyName: "Maple Gardens",
        inspectionType: "Routine",
        inspectionDate: "2023-07-20",
        completedBy: "David Johnson",
        status: "issues",
        units: ["A1"],
        findings: [
          { item: "Kitchen Sink", condition: "Fair", notes: "Slight leakage, needs repair" },
          { item: "Windows", condition: "Good", notes: "All functional" }
        ]
      }
    ];
    
    // Store the data
    await storage.set('utilityAccounts', utilityAccounts);
    await storage.set('utilityBills', utilityBills);
    await storage.set('scheduledInspections', scheduledInspections);
    await storage.set('completedInspections', completedInspections);
    
    console.log("Utilities and inspections data seeded successfully");
  } catch (error) {
    console.error("Error seeding utilities and inspections data:", error);
    throw error;
  }
}

// Add API routes for the data
async function setupUtilitiesAndInspectionsRoutes(app) {
  app.get('/api/utilities/accounts', async (req, res) => {
    try {
      const accounts = await storage.get('utilityAccounts') || [];
      res.json(accounts);
    } catch (error) {
      console.error("Error fetching utility accounts:", error);
      res.status(500).json({ error: "Failed to fetch utility accounts" });
    }
  });
  
  app.get('/api/utilities/bills', async (req, res) => {
    try {
      const bills = await storage.get('utilityBills') || [];
      res.json(bills);
    } catch (error) {
      console.error("Error fetching utility bills:", error);
      res.status(500).json({ error: "Failed to fetch utility bills" });
    }
  });
  
  app.get('/api/property-inspections/scheduled', async (req, res) => {
    try {
      const inspections = await storage.get('scheduledInspections') || [];
      res.json(inspections);
    } catch (error) {
      console.error("Error fetching scheduled inspections:", error);
      res.status(500).json({ error: "Failed to fetch scheduled inspections" });
    }
  });
  
  app.get('/api/property-inspections/completed', async (req, res) => {
    try {
      const inspections = await storage.get('completedInspections') || [];
      res.json(inspections);
    } catch (error) {
      console.error("Error fetching completed inspections:", error);
      res.status(500).json({ error: "Failed to fetch completed inspections" });
    }
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedUtilitiesAndInspections()
    .then(() => console.log("Utilities and inspections seeding completed successfully"))
    .catch(error => console.error("Error during seeding:", error));
}

export { seedUtilitiesAndInspections, setupUtilitiesAndInspectionsRoutes };
