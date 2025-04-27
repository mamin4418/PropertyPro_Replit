
import { storage } from "./storage";

// Function to seed the database with sample data
async function seedDatabase() {
  console.log("Seeding database with insurance, mortgage, and appliance records...");
  
  // Sample properties for reference (if they don't exist yet)
  const properties = [
    {
      id: 1,
      name: "Sunset Heights",
      address: "123 Main St",
      city: "Springfield",
      state: "IL",
      zipCode: "62701",
      type: "apartment",
      units: 8,
      acquisitionDate: new Date("2020-01-15"),
      purchasePrice: 750000,
      currentValue: 850000,
      maintenanceRequests: { open: 2, inProgress: 1, completed: 4 }
    },
    {
      id: 2,
      name: "Maple Gardens",
      address: "456 Elm St",
      city: "Riverside",
      state: "CA",
      zipCode: "92501",
      type: "multi-family",
      units: 4,
      acquisitionDate: new Date("2021-03-10"),
      purchasePrice: 650000,
      currentValue: 700000,
      maintenanceRequests: { open: 1, inProgress: 1, completed: 2 }
    },
    {
      id: 3,
      name: "Urban Lofts",
      address: "789 Oak Ave",
      city: "Portland",
      state: "OR",
      zipCode: "97205",
      type: "condo",
      units: 6,
      acquisitionDate: new Date("2019-08-22"),
      purchasePrice: 900000,
      currentValue: 1050000,
      maintenanceRequests: { open: 0, inProgress: 1, completed: 3 }
    }
  ];

  // Try to add properties if they don't exist
  for (const property of properties) {
    try {
      await storage.createProperty(property);
      console.log(`Created property: ${property.name}`);
    } catch (error) {
      console.log(`Property ${property.name} may already exist, continuing...`);
    }
  }
  
  // Sample insurance records
  const insurances = [
    {
      propertyId: 1,
      insuranceProvider: "AllState Insurance",
      policyNumber: "INS-12345-A",
      policyType: "landlord",
      coverageAmount: 250000,
      premium: 1250.00,
      deductible: 500,
      startDate: new Date("2023-01-15"),
      endDate: new Date("2024-01-15"),
      contactName: "John Smith",
      contactPhone: "555-123-4567",
      contactEmail: "jsmith@allstate.example.com",
      coverageDetails: "Full coverage including liability, property damage, and natural disasters",
      isActive: true
    },
    {
      propertyId: 1,
      insuranceProvider: "Liberty Mutual",
      policyNumber: "LM-78901-B",
      policyType: "flood",
      coverageAmount: 100000,
      premium: 850.00,
      deductible: 1000,
      startDate: new Date("2023-03-10"),
      endDate: new Date("2024-03-10"),
      contactName: "Sarah Johnson",
      contactPhone: "555-987-6543",
      contactEmail: "sjohnson@libertymutual.example.com",
      coverageDetails: "Flood insurance coverage",
      isActive: true
    },
    {
      propertyId: 2,
      insuranceProvider: "State Farm",
      policyNumber: "SF-34567-C",
      policyType: "homeowner",
      coverageAmount: 350000,
      premium: 1800.00,
      deductible: 750,
      startDate: new Date("2023-05-20"),
      endDate: new Date("2024-05-20"),
      contactName: "Mike Williams",
      contactPhone: "555-456-7890",
      contactEmail: "mwilliams@statefarm.example.com",
      coverageDetails: "Comprehensive homeowner's insurance with additional coverage for high-value items",
      isActive: true
    }
  ];

  // Sample mortgage records
  const mortgages = [
    {
      propertyId: 1,
      lender: "Bank of America",
      loanNumber: "BOA-123456",
      loanType: "fixed",
      originalAmount: 200000,
      currentBalance: 175000,
      interestRate: 3.75,
      monthlyPayment: 926.23,
      startDate: new Date("2020-06-15"),
      maturityDate: new Date("2050-06-15"),
      escrowIncluded: true,
      escrowAmount: 350.00,
      contactName: "Robert Johnson",
      contactPhone: "555-222-3333",
      contactEmail: "rjohnson@bofa.example.com",
      isActive: true
    },
    {
      propertyId: 2,
      lender: "Wells Fargo",
      loanNumber: "WF-789012",
      loanType: "adjustable",
      originalAmount: 300000,
      currentBalance: 290000,
      interestRate: 4.25,
      monthlyPayment: 1476.90,
      startDate: new Date("2022-03-10"),
      maturityDate: new Date("2052-03-10"),
      escrowIncluded: true,
      escrowAmount: 450.00,
      contactName: "Lisa Brown",
      contactPhone: "555-444-5555",
      contactEmail: "lbrown@wellsfargo.example.com",
      isActive: true
    },
    {
      propertyId: 3,
      lender: "Chase Bank",
      loanNumber: "CHASE-345678",
      loanType: "fixed",
      originalAmount: 250000,
      currentBalance: 245000,
      interestRate: 4.0,
      monthlyPayment: 1193.54,
      startDate: new Date("2022-11-05"),
      maturityDate: new Date("2052-11-05"),
      escrowIncluded: false,
      contactName: "David Wilson",
      contactPhone: "555-666-7777",
      contactEmail: "dwilson@chase.example.com",
      isActive: true
    }
  ];

  // Add insurance records
  for (const insurance of insurances) {
    await storage.createInsurance(insurance);
    console.log(`Created insurance: ${insurance.policyNumber} for property ${insurance.propertyId}`);
  }

  // Add mortgage records
  for (const mortgage of mortgages) {
    await storage.createMortgage(mortgage);
    console.log(`Created mortgage: ${mortgage.loanNumber} for property ${mortgage.propertyId}`);
  }

  // Sample appliance records
  const appliances = [
    {
      unitId: 101,
      propertyId: 1,
      type: "Refrigerator",
      make: "Samsung",
      model: "RF28R7351SR",
      serialNumber: "XYZ123456789",
      purchaseDate: new Date("2021-05-15"),
      installationDate: new Date("2021-05-20"),
      lastServiceDate: new Date("2023-02-10"),
      warranty: "5 years limited",
      warrantyExpiration: new Date("2026-05-15"),
      notes: "Energy Star certified. Ice maker occasionally needs reset.",
      status: "active",
      images: ["https://images.unsplash.com/photo-1594225513730-530f4b603784?auto=format&w=400"]
    },
    {
      unitId: 101,
      propertyId: 1,
      type: "Dishwasher",
      make: "Bosch",
      model: "SHEM63W55N",
      serialNumber: "BDW987654321",
      purchaseDate: new Date("2021-04-10"),
      installationDate: new Date("2021-05-20"),
      lastServiceDate: new Date("2023-01-25"),
      warranty: "2 years parts and labor",
      warrantyExpiration: new Date("2023-04-10"),
      notes: "Ultra quiet operation. Needs rinse aid refill monthly.",
      status: "active",
      images: ["https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&w=400"]
    },
    {
      unitId: 202,
      propertyId: 2,
      type: "HVAC System",
      make: "Carrier",
      model: "Infinity 24ANB1",
      serialNumber: "CAR2021H78945",
      purchaseDate: new Date("2020-06-15"),
      installationDate: new Date("2020-06-30"),
      lastServiceDate: new Date("2023-03-15"),
      warranty: "10 years on parts, 1 year labor",
      warrantyExpiration: new Date("2030-06-15"),
      notes: "Annual maintenance required to maintain warranty.",
      status: "repair-needed",
      images: ["https://images.unsplash.com/photo-1627131590668-07bb784f89ab?auto=format&w=400"]
    },
    {
      unitId: 301,
      propertyId: 3,
      type: "Washer",
      make: "LG",
      model: "WM3600HWA",
      serialNumber: "LGW2022987654",
      purchaseDate: new Date("2022-02-10"),
      installationDate: new Date("2022-02-15"),
      warranty: "1 year parts and labor",
      warrantyExpiration: new Date("2023-02-10"),
      notes: "High efficiency. Front loading.",
      status: "active",
      images: ["https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&w=400"]
    },
    {
      unitId: 301,
      propertyId: 3,
      type: "Dryer",
      make: "LG",
      model: "DLEX3600W",
      serialNumber: "LGD2022123456",
      purchaseDate: new Date("2022-02-10"),
      installationDate: new Date("2022-02-15"),
      warranty: "1 year parts and labor",
      warrantyExpiration: new Date("2023-02-10"),
      notes: "Electric. Matching washer unit.",
      status: "inactive",
      images: ["https://images.unsplash.com/photo-1626806787467-19b796d8b650?auto=format&w=400"]
    }
  ];

  // Sample maintenance requests
  const maintenanceRequests = [
    {
      propertyId: 1,
      unitId: 101,
      title: "Leaking faucet",
      description: "Kitchen sink faucet is leaking at the base when turned on.",
      priority: "normal",
      status: "open",
      reportedDate: new Date("2023-04-15"),
      reportedBy: "John Smith",
      assignedTo: null,
      notes: "Tenant mentioned it started after the recent cold snap.",
      images: ["https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&w=400"]
    },
    {
      propertyId: 2,
      unitId: 202,
      title: "HVAC not working",
      description: "Air conditioning is not cooling properly. Unit is blowing warm air.",
      priority: "urgent",
      status: "in-progress",
      reportedDate: new Date("2023-04-18"),
      reportedBy: "Sarah Johnson",
      assignedTo: "James Wilson",
      notes: "Tech scheduled for tomorrow morning between 9-11am.",
      images: ["https://images.unsplash.com/photo-1627131590668-07bb784f89ab?auto=format&w=400"]
    },
    {
      propertyId: 3,
      unitId: 301,
      title: "Broken window",
      description: "Bedroom window has a crack in the bottom right corner.",
      priority: "urgent",
      status: "in-progress",
      reportedDate: new Date("2023-04-10"),
      reportedBy: "Mike Smith",
      assignedTo: "Maria Garcia",
      notes: "Temporary patch applied. Glass replacement ordered.",
      images: ["https://images.unsplash.com/photo-1560269583-50479ce7eb4c?auto=format&w=400"]
    },
    {
      propertyId: 1,
      unitId: 103,
      title: "Bathroom door won't lock",
      description: "The bathroom door lock mechanism is not engaging when turned.",
      priority: "normal",
      status: "open",
      reportedDate: new Date("2023-04-08"),
      reportedBy: "Jennifer Lee",
      assignedTo: null,
      notes: "Tenant says it's been an issue for about a week.",
      images: []
    },
    {
      propertyId: 3,
      unitId: 302,
      title: "Dishwasher repair",
      description: "Dishwasher not draining completely after cycle completes.",
      priority: "normal",
      status: "completed",
      reportedDate: new Date("2023-04-05"),
      completedDate: new Date("2023-04-12"),
      reportedBy: "Robert Taylor",
      assignedTo: "David Chen",
      notes: "Clog in drain line removed. Tested and working properly now.",
      images: ["https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&w=400"]
    }
  ];

  // Add appliance records
  for (const appliance of appliances) {
    await storage.createAppliance(appliance);
    console.log(`Created appliance: ${appliance.type} ${appliance.make} ${appliance.model} for unit ${appliance.unitId}`);
  }

  // Add maintenance request records
  for (const request of maintenanceRequests) {
    try {
      await storage.createMaintenanceRequest(request);
      console.log(`Created maintenance request: ${request.title} for property ${request.propertyId}`);
    } catch (error) {
      console.log(`Error creating maintenance request: ${error}`);
    }
  }

  console.log("Database seeding completed!");
}

// Call the function if this script is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => console.log("Seeding process finished successfully"))
    .catch(error => console.error("Error during seeding:", error));
}

export { seedDatabase };
