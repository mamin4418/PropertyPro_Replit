
import { storage } from "./storage";

// Function to seed the database with sample data
async function seedDatabase() {
  console.log("Seeding database with insurance and mortgage records...");
  
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

  console.log("Database seeding completed!");
}

// Call the function if this script is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => console.log("Seeding process finished successfully"))
    .catch(error => console.error("Error during seeding:", error));
}

export { seedDatabase };
