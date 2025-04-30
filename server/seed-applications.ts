
import { storage } from "./storage";

// Function to seed the database with sample application data
async function seedApplications() {
  console.log("Seeding database with sample application data...");
  
  // Sample application templates
  const applicationTemplates = [
    {
      id: 1,
      name: "Standard Rental Application",
      description: "Default application form for all rental properties",
      isActive: true,
      fields: [
        { id: 1, name: "firstName", label: "First Name", type: "text", required: true, order: 1 },
        { id: 2, name: "lastName", label: "Last Name", type: "text", required: true, order: 2 },
        { id: 3, name: "email", label: "Email", type: "email", required: true, order: 3 },
        { id: 4, name: "phone", label: "Phone Number", type: "tel", required: true, order: 4 },
        { id: 5, name: "currentAddress", label: "Current Address", type: "textarea", required: true, order: 5 },
        { id: 6, name: "employerName", label: "Current Employer", type: "text", required: true, order: 6 },
        { id: 7, name: "monthlyIncome", label: "Monthly Income", type: "number", required: true, order: 7 },
        { id: 8, name: "moveInDate", label: "Desired Move-in Date", type: "date", required: true, order: 8 },
        { id: 9, name: "creditCheck", label: "Authorize Credit Check", type: "checkbox", required: true, order: 9 },
        { id: 10, name: "backgroundCheck", label: "Authorize Background Check", type: "checkbox", required: true, order: 10 },
        { id: 11, name: "additionalNotes", label: "Additional Information", type: "textarea", required: false, order: 11 }
      ]
    },
    {
      id: 2,
      name: "Premium Property Application",
      description: "Extended application for high-end properties with additional verification",
      isActive: true,
      fields: [
        { id: 1, name: "firstName", label: "First Name", type: "text", required: true, order: 1 },
        { id: 2, name: "lastName", label: "Last Name", type: "text", required: true, order: 2 },
        { id: 3, name: "email", label: "Email", type: "email", required: true, order: 3 },
        { id: 4, name: "phone", label: "Phone Number", type: "tel", required: true, order: 4 },
        { id: 5, name: "currentAddress", label: "Current Address", type: "textarea", required: true, order: 5 },
        { id: 6, name: "employerName", label: "Current Employer", type: "text", required: true, order: 6 },
        { id: 7, name: "position", label: "Position/Title", type: "text", required: true, order: 7 },
        { id: 8, name: "employmentLength", label: "Length of Employment", type: "text", required: true, order: 8 },
        { id: 9, name: "monthlyIncome", label: "Monthly Income", type: "number", required: true, order: 9 },
        { id: 10, name: "additionalIncome", label: "Additional Income", type: "number", required: false, order: 10 },
        { id: 11, name: "moveInDate", label: "Desired Move-in Date", type: "date", required: true, order: 11 },
        { id: 12, name: "creditCheck", label: "Authorize Credit Check", type: "checkbox", required: true, order: 12 },
        { id: 13, name: "backgroundCheck", label: "Authorize Background Check", type: "checkbox", required: true, order: 13 },
        { id: 14, name: "previousLandlordName", label: "Previous Landlord Name", type: "text", required: true, order: 14 },
        { id: 15, name: "previousLandlordPhone", label: "Previous Landlord Phone", type: "tel", required: true, order: 15 },
        { id: 16, name: "bankStatements", label: "Upload Last 3 Bank Statements", type: "file", required: true, order: 16 },
        { id: 17, name: "proofOfIncome", label: "Upload Proof of Income", type: "file", required: true, order: 17 },
        { id: 18, name: "additionalNotes", label: "Additional Information", type: "textarea", required: false, order: 18 }
      ]
    },
    {
      id: 3,
      name: "Short-term Rental Application",
      description: "Simplified application for short-term and vacation rentals",
      isActive: true,
      fields: [
        { id: 1, name: "firstName", label: "First Name", type: "text", required: true, order: 1 },
        { id: 2, name: "lastName", label: "Last Name", type: "text", required: true, order: 2 },
        { id: 3, name: "email", label: "Email", type: "email", required: true, order: 3 },
        { id: 4, name: "phone", label: "Phone Number", type: "tel", required: true, order: 4 },
        { id: 5, name: "startDate", label: "Check-in Date", type: "date", required: true, order: 5 },
        { id: 6, name: "endDate", label: "Check-out Date", type: "date", required: true, order: 6 },
        { id: 7, name: "guests", label: "Number of Guests", type: "number", required: true, order: 7 },
        { id: 8, name: "purpose", label: "Purpose of Stay", type: "select", required: true, order: 8, options: ["Vacation", "Business", "Relocation", "Other"] },
        { id: 9, name: "idUpload", label: "Upload Government ID", type: "file", required: true, order: 9 },
        { id: 10, name: "additionalNotes", label: "Additional Requests", type: "textarea", required: false, order: 10 }
      ]
    }
  ];

  // Sample submitted applications
  const applications = [
    {
      id: 1,
      templateId: 1,
      propertyId: 1,
      unitId: 101,
      status: "pending",
      applicationFee: 50,
      applicationFeePaid: true,
      submittedAt: new Date("2023-04-10T14:30:00Z"),
      applicantInfo: {
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@example.com",
        phone: "555-123-4567",
        currentAddress: "123 Previous St, Old City, CA 90001",
        employerName: "Tech Solutions Inc.",
        monthlyIncome: 5800,
        moveInDate: "2023-05-01",
        creditCheck: true,
        backgroundCheck: true,
        additionalNotes: "Looking for a quiet neighborhood close to work."
      },
      screeningStatus: {
        creditCheck: {
          status: "completed",
          score: 720,
          reportId: "CR-2023-001",
          date: new Date("2023-04-12T09:15:00Z")
        },
        backgroundCheck: {
          status: "completed",
          criminalHistory: false,
          evictionHistory: false,
          reportId: "BG-2023-001",
          date: new Date("2023-04-12T11:30:00Z")
        },
        incomeVerification: {
          status: "completed",
          verified: true,
          incomeToRentRatio: 3.2,
          date: new Date("2023-04-12T14:45:00Z")
        }
      },
      notes: "Strong application with good credit score and income verification."
    },
    {
      id: 2,
      templateId: 2,
      propertyId: 3,
      unitId: 301,
      status: "approved",
      applicationFee: 75,
      applicationFeePaid: true,
      submittedAt: new Date("2023-03-25T10:45:00Z"),
      applicantInfo: {
        firstName: "Emma",
        lastName: "Johnson",
        email: "emma.johnson@example.com",
        phone: "555-987-6543",
        currentAddress: "456 Former Ave, Last Town, NY 10001",
        employerName: "Financial Advisors LLC",
        position: "Senior Financial Analyst",
        employmentLength: "5 years",
        monthlyIncome: 8500,
        additionalIncome: 1200,
        moveInDate: "2023-05-15",
        creditCheck: true,
        backgroundCheck: true,
        previousLandlordName: "Robert Thompson",
        previousLandlordPhone: "555-444-3333",
        additionalNotes: "Looking for a long-term rental in a premium building."
      },
      screeningStatus: {
        creditCheck: {
          status: "completed",
          score: 780,
          reportId: "CR-2023-002",
          date: new Date("2023-03-27T08:30:00Z")
        },
        backgroundCheck: {
          status: "completed",
          criminalHistory: false,
          evictionHistory: false,
          reportId: "BG-2023-002",
          date: new Date("2023-03-27T10:15:00Z")
        },
        incomeVerification: {
          status: "completed",
          verified: true,
          incomeToRentRatio: 4.3,
          date: new Date("2023-03-27T13:20:00Z")
        },
        landlordReference: {
          status: "completed",
          positive: true,
          comments: "Excellent tenant, always paid on time, kept unit in great condition.",
          date: new Date("2023-03-28T11:00:00Z")
        }
      },
      leaseId: 125, // Connected to generated lease
      approvedAt: new Date("2023-03-30T15:30:00Z"),
      notes: "Premium applicant with excellent credentials. Approved for immediate move-in."
    },
    {
      id: 3,
      templateId: 1,
      propertyId: 2,
      unitId: 202,
      status: "rejected",
      applicationFee: 50,
      applicationFeePaid: true,
      submittedAt: new Date("2023-04-05T16:20:00Z"),
      applicantInfo: {
        firstName: "Michael",
        lastName: "Smith",
        email: "michael.smith@example.com",
        phone: "555-222-3333",
        currentAddress: "789 Current Rd, Present City, TX 75001",
        employerName: "Retail Store",
        monthlyIncome: 3200,
        moveInDate: "2023-05-01",
        creditCheck: true,
        backgroundCheck: true,
        additionalNotes: "Need to move due to new job in the area."
      },
      screeningStatus: {
        creditCheck: {
          status: "completed",
          score: 580,
          reportId: "CR-2023-003",
          date: new Date("2023-04-07T10:00:00Z")
        },
        backgroundCheck: {
          status: "completed",
          criminalHistory: false,
          evictionHistory: true,
          evictionDetails: "Eviction in 2021 for non-payment",
          reportId: "BG-2023-003",
          date: new Date("2023-04-07T11:45:00Z")
        },
        incomeVerification: {
          status: "completed",
          verified: true,
          incomeToRentRatio: 2.1,
          date: new Date("2023-04-07T14:30:00Z")
        }
      },
      rejectedAt: new Date("2023-04-08T09:15:00Z"),
      rejectionReason: "Prior eviction history and insufficient income-to-rent ratio.",
      notes: "Applicant does not meet minimum requirements for income and rental history."
    },
    {
      id: 4,
      templateId: 3,
      propertyId: 1,
      unitId: 103,
      status: "pending",
      applicationFee: 35,
      applicationFeePaid: true,
      submittedAt: new Date("2023-04-15T12:00:00Z"),
      applicantInfo: {
        firstName: "Sarah",
        lastName: "Garcia",
        email: "sarah.garcia@example.com",
        phone: "555-333-4444",
        startDate: "2023-06-10",
        endDate: "2023-06-25",
        guests: 2,
        purpose: "Vacation",
        additionalNotes: "Looking forward to exploring the city during our summer vacation."
      },
      screeningStatus: {
        identityVerification: {
          status: "completed",
          verified: true,
          reportId: "ID-2023-001",
          date: new Date("2023-04-16T10:30:00Z")
        }
      },
      notes: "Short-term vacation rental application looks good. Awaiting final approval."
    },
    {
      id: 5,
      templateId: 1,
      propertyId: 1,
      unitId: 102,
      status: "in-progress",
      applicationFee: 50,
      applicationFeePaid: true,
      submittedAt: new Date("2023-04-18T09:45:00Z"),
      applicantInfo: {
        firstName: "David",
        lastName: "Wilson",
        email: "david.wilson@example.com",
        phone: "555-777-8888",
        currentAddress: "321 Living St, Current City, FL 33101",
        employerName: "Marketing Agency Inc.",
        monthlyIncome: 5200,
        moveInDate: "2023-06-01",
        creditCheck: true,
        backgroundCheck: true,
        additionalNotes: "Relocating for work, need housing close to downtown."
      },
      screeningStatus: {
        creditCheck: {
          status: "in-progress",
          reportId: "CR-2023-004",
          date: new Date("2023-04-19T14:00:00Z")
        },
        backgroundCheck: {
          status: "pending"
        },
        incomeVerification: {
          status: "pending"
        }
      },
      notes: "Application in processing. Credit check underway, waiting on background check."
    }
  ];

  // Try to add the application templates
  for (const template of applicationTemplates) {
    try {
      await storage.createApplicationTemplate(template);
      console.log(`Created application template: ${template.name}`);
    } catch (error) {
      console.log(`Template ${template.name} may already exist, continuing...`);
    }
  }

  // Add the applications
  for (const application of applications) {
    try {
      await storage.createApplication(application);
      console.log(`Created application #${application.id} for ${application.applicantInfo.firstName} ${application.applicantInfo.lastName}`);
    } catch (error) {
      console.log(`Error creating application #${application.id}: ${error}`);
    }
  }

  console.log("Application data seeding completed!");
}

// Call the function if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedApplications()
    .then(() => console.log("Application seeding process finished successfully"))
    .catch(error => console.error("Error during application seeding:", error));
}

export { seedApplications };
