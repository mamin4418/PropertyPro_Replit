
import { storage } from "./storage";
import { seedApplications } from "./seed-applications";

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
      documents: ["https://images.unsplash.com/photo-1611937864996-52b13c9d8fdf?auto=format&w=400"],
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
      documents: ["https://images.unsplash.com/photo-1547473078-cbffc59a1c28?auto=format&w=400"],
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
      documents: ["https://images.unsplash.com/photo-1630927239596-9b7ebd94a8ba?auto=format&w=400"],
      isActive: true
    },
    {
      propertyId: 3,
      insuranceProvider: "Progressive",
      policyNumber: "PRO-98765-D",
      policyType: "liability",
      coverageAmount: 500000,
      premium: 950.00,
      deductible: 1000,
      startDate: new Date("2023-04-01"),
      endDate: new Date("2024-04-01"),
      contactName: "Laura Chen",
      contactPhone: "555-789-0123",
      contactEmail: "lchen@progressive.example.com",
      coverageDetails: "Umbrella liability policy for additional protection beyond standard coverage",
      documents: ["https://images.unsplash.com/photo-1622560480654-d96214fdc887?auto=format&w=400"],
      isActive: true
    },
    {
      propertyId: 2,
      insuranceProvider: "Nationwide",
      policyNumber: "NW-23456-E",
      policyType: "earthquake",
      coverageAmount: 200000,
      premium: 1500.00,
      deductible: 2500,
      startDate: new Date("2023-02-15"),
      endDate: new Date("2024-02-15"),
      contactName: "Tom Anderson",
      contactPhone: "555-345-6789",
      contactEmail: "tanderson@nationwide.example.com",
      coverageDetails: "Specialized earthquake insurance for high-risk areas",
      documents: ["https://images.unsplash.com/photo-1558403194-611308249627?auto=format&w=400"],
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
      documents: ["https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&w=400"],
      notes: "30-year fixed-rate mortgage with favorable terms. Annual review scheduled for June each year.",
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
      documents: ["https://images.unsplash.com/photo-1618044733300-9472054094ee?auto=format&w=400"],
      notes: "5/1 ARM with initial fixed period ending March 2027. Rate caps at 2% per adjustment, 6% lifetime.",
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
      documents: ["https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&w=400"],
      notes: "No escrow account; owner responsible for paying property taxes and insurance separately.",
      isActive: true
    },
    {
      propertyId: 1,
      lender: "Quicken Loans",
      loanNumber: "QL-567890",
      loanType: "fixed",
      originalAmount: 150000,
      currentBalance: 0,
      interestRate: 4.5,
      monthlyPayment: 760.03,
      startDate: new Date("2015-04-20"),
      maturityDate: new Date("2030-04-20"),
      escrowIncluded: true,
      escrowAmount: 300.00,
      contactName: "Maria Garcia",
      contactPhone: "555-888-9999",
      contactEmail: "mgarcia@quicken.example.com",
      documents: ["https://images.unsplash.com/photo-1601597111158-2fceff292cdc?auto=format&w=400"],
      notes: "Mortgage refinanced with Bank of America in 2020. This record is for historical tracking.",
      isActive: false
    },
    {
      propertyId: 3,
      lender: "Citibank",
      loanNumber: "CITI-901234",
      loanType: "balloon",
      originalAmount: 180000,
      currentBalance: 160000,
      interestRate: 3.5,
      monthlyPayment: 808.56,
      startDate: new Date("2021-09-15"),
      maturityDate: new Date("2031-09-15"),
      escrowIncluded: true,
      escrowAmount: 375.00,
      contactName: "Alex Thompson",
      contactPhone: "555-111-2222",
      contactEmail: "athompson@citi.example.com",
      documents: ["https://images.unsplash.com/photo-1434626881859-194d67b2b86f?auto=format&w=400"],
      notes: "10-year balloon mortgage with balloon payment due at maturity. Consider refinancing options by 2029.",
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
      unitId: 101,
      propertyId: 1,
      type: "Stove",
      make: "GE",
      model: "JB750SJSS",
      serialNumber: "GE20217654321",
      purchaseDate: new Date("2021-04-15"),
      installationDate: new Date("2021-05-20"),
      lastServiceDate: new Date("2023-03-18"),
      warranty: "1 year full warranty",
      warrantyExpiration: new Date("2022-04-15"),
      notes: "Electric range with convection oven. One small burner needs replacement.",
      status: "repair-needed",
      images: ["https://images.unsplash.com/photo-1574269923091-14b401d9c92b?auto=format&w=400"]
    },
    {
      unitId: 101,
      propertyId: 1,
      type: "Microwave",
      make: "Whirlpool",
      model: "WMH31017HS",
      serialNumber: "WP20210987654",
      purchaseDate: new Date("2021-04-10"),
      installationDate: new Date("2021-05-20"),
      lastServiceDate: null,
      warranty: "1 year full warranty",
      warrantyExpiration: new Date("2022-04-10"),
      notes: "Over-the-range microwave. No issues reported.",
      status: "active",
      images: ["https://images.unsplash.com/photo-1585659722983-3a681d8fde89?auto=format&w=400"]
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
      unitId: 202,
      propertyId: 2,
      type: "Water Heater",
      make: "Rheem",
      model: "XE40M06ST45U1",
      serialNumber: "RH20190123456",
      purchaseDate: new Date("2019-08-22"),
      installationDate: new Date("2019-08-25"),
      lastServiceDate: new Date("2022-09-10"),
      warranty: "6 years limited",
      warrantyExpiration: new Date("2025-08-22"),
      notes: "40-gallon electric water heater. Anode rod replaced during last service.",
      status: "active",
      images: ["https://images.unsplash.com/photo-1585814240392-2a6e46f0f5ac?auto=format&w=400"]
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
    },
    {
      unitId: 301,
      propertyId: 3,
      type: "Refrigerator",
      make: "Whirlpool",
      model: "WRF535SWHZ",
      serialNumber: "WP2021RF789012",
      purchaseDate: new Date("2021-10-05"),
      installationDate: new Date("2021-10-10"),
      lastServiceDate: null,
      warranty: "1 year full warranty",
      warrantyExpiration: new Date("2022-10-05"),
      notes: "French door refrigerator with bottom freezer. Energy Star rated.",
      status: "active",
      images: ["https://images.unsplash.com/photo-1584568499811-37a6a6be272b?auto=format&w=400"]
    },
    {
      unitId: 202,
      propertyId: 2,
      type: "Garbage Disposal",
      make: "InSinkErator",
      model: "Evolution Compact",
      serialNumber: "ISE2020GD345678",
      purchaseDate: new Date("2020-11-15"),
      installationDate: new Date("2020-11-20"),
      lastServiceDate: new Date("2022-12-05"),
      warranty: "4 years in-home service",
      warrantyExpiration: new Date("2024-11-15"),
      notes: "3/4 HP compact garbage disposal. Had jam cleared during last service.",
      status: "active",
      images: ["https://images.unsplash.com/photo-1585845328561-dbaec8956b60?auto=format&w=400"]
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
    try {
      await storage.createAppliance(appliance);
      console.log(`Created appliance: ${appliance.type} ${appliance.make} ${appliance.model} for unit ${appliance.unitId}`);
    } catch (error) {
      console.log(`Error creating appliance, may already exist: ${error}`);
    }
  }
  
  // Add some additional test appliances with explicit IDs for testing
  const testAppliances = [
    {
      id: 9999,
      unitId: 101,
      propertyId: 1,
      type: "Refrigerator",
      make: "Samsung",
      model: "RS8000",
      serialNumber: "SN123456789",
      purchaseDate: new Date("2022-05-15"),
      installDate: new Date("2022-05-20"),
      lastServiceDate: new Date("2023-06-15"),
      warranty: "5 year limited",
      notes: "Energy Star certified. Works perfectly.",
      status: "active",
      images: ["https://images.unsplash.com/photo-1584568499811-37a6a6be272b?auto=format&w=400"],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 9998,
      unitId: 202,
      propertyId: 2,
      type: "Dishwasher",
      make: "Bosch",
      model: "SHX88PZ55N",
      serialNumber: "BDW987654321",
      purchaseDate: new Date("2022-01-10"),
      installDate: new Date("2022-01-15"),
      lastServiceDate: new Date("2023-02-20"),
      warranty: "2 years parts and labor",
      notes: "Ultra quiet operation. 3rd rack for utensils.",
      status: "active",
      images: ["https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&w=400"],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
  
  for (const appliance of testAppliances) {
    try {
      await storage.createAppliance(appliance);
      console.log(`Created test appliance ID ${appliance.id}: ${appliance.make} ${appliance.model}`);
    } catch (error) {
      console.log(`Error creating test appliance, may already exist: ${error}`);
    }
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
  
  // Seed application data
  await seedApplications();
}

// Call the function if this script is executed directly
// Using ESM-compatible approach to check if file is directly executed
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  seedDatabase()
    .then(() => console.log("Seeding process finished successfully"))
    .catch(error => console.error("Error during seeding:", error));
}

export { seedDatabase };
