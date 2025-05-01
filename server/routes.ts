import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import rbacRoutes from "./routes/rbac";
import { 
  insertContactSchema, 
  insertAddressSchema, 
  insertApplianceSchema,
  insertRentalApplicationSchema, 
  insertApplicationTemplateSchema,
  insertInsuranceSchema,
  insertMortgageSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app);

  // Register RBAC routes
  app.use('/api/rbac', rbacRoutes);
  // Contacts API endpoints
  app.get('/api/contacts', async (req: Request, res: Response) => {
    try {
      const contacts = await storage.getContacts();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve contacts' });
    }
  });

  app.get('/api/contacts/:id', async (req: Request, res: Response) => {
    try {
      const contact = await storage.getContact(parseInt(req.params.id));
      if (!contact) {
        return res.status(404).json({ error: 'Contact not found' });
      }
      res.json(contact);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve contact' });
    }
  });

  app.get('/api/contacts/type/:type', async (req: Request, res: Response) => {
    try {
      const contacts = await storage.getContactsByType(req.params.type);
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve contacts' });
    }
  });

  app.post('/api/contacts', async (req: Request, res: Response) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(validatedData);
      res.status(201).json(contact);
    } catch (error) {
      res.status(400).json({ error: 'Invalid contact data' });
    }
  });

  app.put('/api/contacts/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const contact = await storage.updateContact(id, req.body);
      if (!contact) {
        return res.status(404).json({ error: 'Contact not found' });
      }
      res.json(contact);
    } catch (error) {
      res.status(400).json({ error: 'Failed to update contact' });
    }
  });

  app.delete('/api/contacts/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteContact(id);
      if (!success) {
        return res.status(404).json({ error: 'Contact not found' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete contact' });
    }
  });

  // Leads API endpoints
  app.get('/api/leads', async (req: Request, res: Response) => {
    try {
      // For now, use contacts with lead type as leads
      const leads = await storage.getContactsByType("lead");
      // Transform to match Lead interface
      const enhancedLeads = leads.map(lead => ({
        id: lead.id,
        contactId: lead.id,
        source: "Website", // Default source
        status: "new",
        interestLevel: "medium",
        desiredMoveInDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        hasApplied: false,
        preQualified: false,
        assignedTo: null,
        lastContactDate: new Date().toISOString(),
        nextFollowUpDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      }));
      res.json(enhancedLeads);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve leads' });
    }
  });

  app.post('/api/leads', async (req: Request, res: Response) => {
    try {
      // Create a contact with lead type
      const contactData = {
        ...req.body,
        contactType: "lead" 
      };
      const validatedData = insertContactSchema.parse(contactData);
      const contact = await storage.createContact(validatedData);

      // Return lead format
      const lead = {
        id: contact.id,
        contactId: contact.id,
        source: req.body.source || "Website",
        status: "new",
        interestLevel: req.body.interestLevel || "medium",
        desiredMoveInDate: req.body.desiredMoveInDate,
        hasApplied: false,
        preQualified: false,
        assignedTo: null,
        lastContactDate: new Date().toISOString(),
        nextFollowUpDate: null
      };

      res.status(201).json(lead);
    } catch (error) {
      res.status(400).json({ error: 'Invalid lead data' });
    }
  });

  // Applications API endpoints
  app.get('/api/applications', async (req: Request, res: Response) => {
    try {
      const applications = await storage.getRentalApplications();
      res.json(applications);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve applications' });
    }
  });

  app.get('/api/applications/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid ID format' });
      }

      const application = await storage.getRentalApplication(id);
      if (!application) {
        return res.status(404).json({ error: 'Application not found' });
      }

      res.json(application);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve application' });
    }
  });

  app.post('/api/applications', async (req: Request, res: Response) => {
    try {
      const validatedData = insertRentalApplicationSchema.safeParse(req.body);

      if (!validatedData.success) {
        return res.status(400).json({ 
          error: 'Invalid application data', 
          details: validatedData.error.format() 
        });
      }

      const newApplication = await storage.createRentalApplication(validatedData.data);
      res.status(201).json(newApplication);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create application' });
    }
  });

  app.patch('/api/applications/:id/status', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid ID format' });
      }

      const { status } = req.body;
      if (!status || typeof status !== 'string') {
        return res.status(400).json({ error: 'Status is required' });
      }

      const application = await storage.getRentalApplication(id);
      if (!application) {
        return res.status(404).json({ error: 'Application not found' });
      }

      const updatedApplication = await storage.updateRentalApplication(id, { status });
      res.json(updatedApplication);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update application status' });
    }
  });

  app.delete('/api/applications/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid ID format' });
      }

      const application = await storage.getRentalApplication(id);
      if (!application) {
        return res.status(404).json({ error: 'Application not found' });
      }

      await storage.deleteRentalApplication(id);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete application' });
    }
  });

  // Application Templates API endpoints
  app.get('/api/application-templates', async (req: Request, res: Response) => {
    try {
      const templates = await storage.getApplicationTemplates();
      res.json(templates);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve application templates' });
    }
  });

  app.get('/api/application-templates/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid ID format' });
      }

      const template = await storage.getApplicationTemplate(id);
      if (!template) {
        return res.status(404).json({ error: 'Application template not found' });
      }

      res.json(template);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve application template' });
    }
  });

  app.post('/api/application-templates', async (req: Request, res: Response) => {
    try {
      const validatedData = insertApplicationTemplateSchema.safeParse(req.body);

      if (!validatedData.success) {
        return res.status(400).json({ 
          error: 'Invalid application template data', 
          details: validatedData.error.format() 
        });
      }

      const newTemplate = await storage.createApplicationTemplate(validatedData.data);
      res.status(201).json(newTemplate);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create application template' });
    }
  });

  app.put('/api/application-templates/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid ID format' });
      }

      const validatedData = insertApplicationTemplateSchema.partial().safeParse(req.body);

      if (!validatedData.success) {
        return res.status(400).json({ 
          error: 'Invalid application template data', 
          details: validatedData.error.format() 
        });
      }

      const template = await storage.getApplicationTemplate(id);
      if (!template) {
        return res.status(404).json({ error: 'Application template not found' });
      }

      const updatedTemplate = await storage.updateApplicationTemplate(id, validatedData.data);
      res.json(updatedTemplate);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update application template' });
    }
  });

  app.delete('/api/application-templates/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid ID format' });
      }

      const template = await storage.getApplicationTemplate(id);
      if (!template) {
        return res.status(404).json({ error: 'Application template not found' });
      }

      await storage.deleteApplicationTemplate(id);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete application template' });
    }
  });

  // Vacancy API endpoints
  app.get('/api/vacancies', async (req: Request, res: Response) => {
    try {
      // In a real implementation, fetch from database
      // For now, return mock data
      const vacancies = [
        {
          id: 1,
          unitId: 101,
          propertyId: 1,
          propertyName: "Parkside Apartments",
          propertyAddress: "123 Main St, Anytown, CA 91234",
          title: "Modern 1 Bedroom Apartment",
          description: "Beautiful renovated 1 bedroom apartment with hardwood floors, stainless steel appliances, and a private balcony.",
          rentAmount: 1250,
          depositAmount: 1250,
          availableFrom: "2023-06-01",
          leaseDuration: 12,
          bedrooms: 1,
          bathrooms: 1,
          sqft: 750,
          amenities: ["Dishwasher", "A/C", "In-unit Laundry", "Balcony"],
          petPolicy: "Cats only, $500 pet deposit",
          includedUtilities: ["Water", "Trash"],
          images: [
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688"
          ],
          status: "active"
        },
        {
          id: 2,
          unitId: 203,
          propertyId: 1,
          propertyName: "Parkside Apartments",
          propertyAddress: "123 Main St, Anytown, CA 91234",
          title: "Spacious 2 Bedroom Apartment",
          description: "Spacious 2 bedroom apartment with modern finishes and open floor plan.",
          rentAmount: 1650,
          depositAmount: 1650,
          availableFrom: "2023-05-15",
          leaseDuration: 12,
          bedrooms: 2,
          bathrooms: 2,
          sqft: 1050,
          amenities: ["Dishwasher", "A/C", "In-unit Laundry", "Walk-in Closets", "Fireplace"],
          petPolicy: "Pet friendly, $750 pet deposit",
          includedUtilities: ["Water", "Trash", "Internet"],
          images: [
            "https://images.unsplash.com/photo-1493809842364-78817add7ffb",
            "https://images.unsplash.com/photo-1484154218962-a197022b5858"
          ],
          status: "active"
        }
      ];

      res.json(vacancies);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve vacancies' });
    }
  });

  app.get('/api/vacancies/manage', async (req: Request, res: Response) => {
    try {
      // This endpoint would normally include more management data
      // For now, return similar data to the regular endpoint
      const vacancies = [
        {
          id: 1,
          unitId: 101,
          propertyId: 1,
          propertyName: "Parkside Apartments",
          propertyAddress: "123 Main St, Anytown, CA 91234",
          title: "Modern 1 Bedroom Apartment",
          description: "Beautiful renovated 1 bedroom apartment with hardwood floors.",
          rentAmount: 1250,
          depositAmount: 1250,
          availableFrom: "2023-06-01",
          leaseDuration: 12,
          bedrooms: 1,
          bathrooms: 1,
          sqft: 750,
          amenities: ["Dishwasher", "A/C", "In-unit Laundry", "Balcony"],
          petPolicy: "Cats only, $500 pet deposit",
          includedUtilities: ["Water", "Trash"],
          images: [
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"
          ],
          status: "active",
          inquiries: 7,
          applications: 3,
          createdAt: "2023-04-15T10:30:00Z",
          updatedAt: "2023-04-20T15:45:00Z"
        },
        {
          id: 2,
          unitId: 203,
          propertyId: 1,
          propertyName: "Parkside Apartments",
          propertyAddress: "123 Main St, Anytown, CA 91234",
          title: "Spacious 2 Bedroom Apartment",
          description: "Spacious 2 bedroom apartment with modern finishes.",
          rentAmount: 1650,
          depositAmount: 1650,
          availableFrom: "2023-05-15",
          leaseDuration: 12,
          bedrooms: 2,
          bathrooms: 2,
          sqft: 1050,
          amenities: ["Dishwasher", "A/C", "In-unit Laundry", "Walk-in Closets"],
          petPolicy: "Pet friendly, $750 pet deposit",
          includedUtilities: ["Water", "Trash", "Internet"],
          images: [
            "https://images.unsplash.com/photo-1493809842364-78817add7ffb"
          ],
          status: "active",
          inquiries: 4,
          applications: 1,
          createdAt: "2023-04-10T09:15:00Z",
          updatedAt: "2023-04-18T11:20:00Z"
        },
        {
          id: 3,
          unitId: 305,
          propertyId: 2,
          propertyName: "The Willows",
          propertyAddress: "456 Oak Lane, Anytown, CA 91234",
          title: "Luxury Studio Apartment",
          description: "Compact but luxurious studio apartment with full kitchen.",
          rentAmount: 1050,
          depositAmount: 1050,
          availableFrom: "2023-06-15",
          leaseDuration: 12,
          bedrooms: 0,
          bathrooms: 1,
          sqft: 550,
          amenities: ["Dishwasher", "A/C", "Gym Access", "Rooftop Terrace"],
          petPolicy: "No pets allowed",
          includedUtilities: ["Water", "Trash", "Heat"],
          images: [
            "https://images.unsplash.com/photo-1502672023488-70e25813eb80"
          ],
          status: "inactive",
          inquiries: 2,
          applications: 0,
          createdAt: "2023-04-05T14:20:00Z",
          updatedAt: "2023-04-12T16:30:00Z"
        }
      ];

      res.json(vacancies);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve vacancies' });
    }
  });

  app.get('/api/vacancies/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);

      // In a real implementation, fetch from database
      // For now, return mock data for this specific ID
      const mockVacancies = {
        1: {
          id: 1,
          unitId: 101,
          propertyId: 1,
          propertyName: "Parkside Apartments",
          propertyAddress: "123 Main St, Anytown, CA 91234",
          title: "Modern 1 Bedroom Apartment",
          description: "Beautiful renovated 1 bedroom apartment with hardwood floors, stainless steel appliances, and a private balcony. Plenty of natural light and storage space. Located in a quiet neighborhood with easy access to shopping, restaurants, and public transportation.",
          rentAmount: 1250,
          depositAmount: 1250,
          availableFrom: "2023-06-01",
          leaseDuration: 12,
          bedrooms: 1,
          bathrooms: 1,
          sqft: 750,
          minimumIncome: 3000,
          creditScoreRequirement: 650,
          petPolicy: "Cats only, $500 pet deposit",
          petDeposit: 500,
          smokingAllowed: false,
          includedUtilities: ["Water", "Trash"],
          advertisingChannels: ["Website", "Zillow"],
          amenities: ["Dishwasher", "A/C", "In-unit Laundry", "Balcony", "Hardwood Floors", "Stainless Steel Appliances"],
          images: [
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
            "https://images.unsplash.com/photo-1493809842364-78817add7ffb"
          ],
          status: "active",
          inquiries: 7,
          applications: 3,
          createdAt: "2023-04-15T10:30:00Z",
          updatedAt: "2023-04-20T15:45:00Z",
        },
        2: {
          id: 2,
          unitId: 203,
          propertyId: 1,
          propertyName: "Parkside Apartments",
          propertyAddress: "123 Main St, Anytown, CA 91234",
          title: "Spacious 2 Bedroom Apartment",
          description: "Spacious 2 bedroom apartment with modern finishes, open floor plan, and mountain views. Features a chef's kitchen and walk-in closets.",
          rentAmount: 1650,
          depositAmount: 1650,
          availableFrom: "2023-05-15",
          leaseDuration: 12,
          bedrooms: 2,
          bathrooms: 2,
          sqft: 1050,
          minimumIncome: 4000,
          creditScoreRequirement: 650,
          petPolicy: "Pet friendly, $750 pet deposit",
          petDeposit: 750,
          smokingAllowed: false,
          includedUtilities: ["Water", "Trash", "Internet"],
          advertisingChannels: ["Website", "Zillow", "Apartments.com"],
          amenities: ["Dishwasher", "A/C", "In-unit Laundry", "Walk-in Closets", "Fireplace"],
          images: [
            "https://images.unsplash.com/photo-1493809842364-78817add7ffb",
            "https://images.unsplash.com/photo-1484154218962-a197022b5858"
          ],
          status: "active",
          inquiries: 4,
          applications: 1,
          createdAt: "2023-04-10T09:15:00Z",
          updatedAt: "2023-04-18T11:20:00Z",
        },
        3: {
          id: 3,
          unitId: 305,
          propertyId: 2,
          propertyName: "The Willows",
          propertyAddress: "456 Oak Lane, Anytown, CA 91234",
          title: "Luxury Studio Apartment",
          description: "Compact but luxurious studio apartment with high-end finishes, full kitchen, and city views. Perfect for professionals.",
          rentAmount: 1050,
          depositAmount: 1050,
          availableFrom: "2023-06-15",
          leaseDuration: 12,
          bedrooms: 0,
          bathrooms: 1,
          sqft: 550,
          minimumIncome: 2500,
          creditScoreRequirement: 620,
          petPolicy: "No pets allowed",
          petDeposit: 0,
          smokingAllowed: false,
          includedUtilities: ["Water", "Trash", "Heat"],
          advertisingChannels: ["Website", "Craigslist"],
          amenities: ["Dishwasher", "A/C", "Gym Access", "Rooftop Terrace"],
          images: [
            "https://images.unsplash.com/photo-1502672023488-70e25813eb80",
            "https://images.unsplash.com/photo-1518481612222-68bbe828ecd1"
          ],
          status: "inactive",
          inquiries: 2,
          applications: 0,
          createdAt: "2023-04-05T14:20:00Z",
          updatedAt: "2023-04-12T16:30:00Z",
        }
      };

      const vacancy = mockVacancies[id as keyof typeof mockVacancies];

      if (!vacancy) {
        res.status(404).json({ error: 'Vacancy not found' });
        return;
      }

      res.json(vacancy);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve vacancy' });
    }
  });

  app.post('/api/vacancies', async (req: Request, res: Response) => {
    try {
      // In a real implementation, validate and save to database
      const vacancy = {
        id: Date.now(),
        ...req.body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        inquiries: 0,
        applications: 0
      };

      res.status(201).json(vacancy);
    } catch (error) {
      res.status(400).json({ error: 'Invalid vacancy data' });
    }
  });

  app.put('/api/vacancies/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);

      // In a real implementation, validate, check if exists, and update in database
      const updatedVacancy = {
        id,
        ...req.body,
        updatedAt: new Date().toISOString()
      };

      res.json(updatedVacancy);
    } catch (error) {
      res.status(400).json({ error: 'Failed to update vacancy' });
    }
  });

  app.patch('/api/vacancies/:id/status', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;

      if (!status || !['active', 'inactive', 'rented'].includes(status)) {
        res.status(400).json({ error: 'Invalid status value' });
        return;
      }

      // In a real implementation, update in database
      res.json({ id, status, updatedAt: new Date().toISOString() });
    } catch (error) {
      res.status(400).json({ error: 'Failed to update vacancy status' });
    }
  });

  app.delete('/api/vacancies/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);

      // In a real implementation, check if exists and delete from database
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete vacancy' });
    }
  });

  // Lead inquiry endpoints
  app.post('/api/leads/inquiry', async (req: Request, res: Response) => {
    try {
      const { firstName, lastName, email, phone, moveInDate, message, contactPreference, vacancyId, unitId, propertyId } = req.body;

      // Create a contact with lead type
      const contactData = {
        firstName,
        lastName,
        email,
        phone,
        contactType: "lead",
        notes: `Inquiry for Property ID: ${propertyId}, Unit: ${unitId}\nDesired Move-in: ${moveInDate}\nMessage: ${message || 'No message provided'}`
      };

      const validatedData = insertContactSchema.parse(contactData);
      const contact = await storage.createContact(validatedData);

      // In a real app, you'd store the inquiry details and link to the vacancy

      // Return lead format with inquiry info
      const lead = {
        id: contact.id,
        contactId: contact.id,
        source: "Website Inquiry",
        status: "new",
        interestLevel: "high",
        vacancyId,
        unitId,
        propertyId,
        desiredMoveInDate: moveInDate,
        hasApplied: false,
        preQualified: false,
        assignedTo: null,
        lastContactDate: new Date().toISOString(),
        nextFollowUpDate: null,
        preferredContactMethod: contactPreference
      };

      res.status(201).json(lead);
    } catch (error) {
      console.error("Error processing inquiry:", error);
      res.status(400).json({ error: 'Invalid inquiry data' });
    }
  });

  // Send application endpoint
  app.post('/api/applications/send', async (req: Request, res: Response) => {
    try {
      const { applicantEmail, message, templateId, dueDate, vacancyId, unitId, propertyId } = req.body;

      // In a real implementation, you would:
      // 1. Generate a unique application link
      // 2. Send an email to the applicant
      // 3. Track the application in the database

      const applicationSent = {
        id: Date.now(),
        applicantEmail,
        message,
        templateId,
        dueDate,
        vacancyId,
        unitId,
        propertyId,
        status: "sent",
        sentAt: new Date().toISOString(),
        completedAt: null,
        expiresAt: dueDate ? new Date(dueDate).toISOString() : null
      };

      res.status(201).json(applicationSent);
    } catch (error) {
      res.status(400).json({ error: 'Failed to send application' });
    }
  });

  // Address routes
  app.get('/api/addresses', async (req: Request, res: Response) => {
    try {
      const addresses = await storage.getAddresses();
      res.json(addresses);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve addresses' });
    }
  });

  app.get('/api/addresses/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const address = await storage.getAddress(id);
      if (!address) {
        return res.status(404).json({ error: 'Address not found' });
      }
      res.json(address);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve address' });
    }
  });

  app.post('/api/addresses', async (req: Request, res: Response) => {
    try {
      const validatedData = insertAddressSchema.parse(req.body);
      const address = await storage.createAddress(validatedData);
      res.status(201).json(address);
    } catch (error) {
      res.status(400).json({ error: 'Invalid address data' });
    }
  });

  app.put('/api/addresses/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertAddressSchema.partial().parse(req.body);
      const address = await storage.updateAddress(id, validatedData);
      if (!address) {
        return res.status(404).json({ error: 'Address not found' });
      }
      res.json(address);
    } catch (error) {
      res.status(400).json({ error: 'Invalid address data' });
    }
  });

  app.delete('/api/addresses/:id', async (req: Request, resResponse) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteAddress(id);
      if (!success) {
        return res.status(404).json({ error: 'Address not found' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete address' });
    }
  });

  // Contact-Address routes
  app.get('/api/contacts/:contactId/addresses', async (req: Request, res: Response) => {
    try {
      const contactId = parseInt(req.params.contactId);
      const contactAddresses = await storage.getContactAddresses(contactId);
      res.json(contactAddresses);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve contact addresses' });
    }
  });

  app.post('/api/contacts/:contactId/addresses', async (req: Request, res: Response) => {
    try {
      const contactId = parseInt(req.params.contactId);
      // Create a new address and link it to the contact
      const validatedAddress = insertAddressSchema.parse(req.body.address);
      const isPrimary = req.body.isPrimary === true;

      const address = await storage.createAddress(validatedAddress);
      const contactAddress = await storage.addAddressToContact(contactId, address.id, isPrimary);

      res.status(201).json({ ...contactAddress, address });
    } catch (error) {
      res.status(400).json({ error: 'Invalid data' });
    }
  });

  app.post('/api/contacts/:contactId/addresses/:addressId', async (req: Request, res: Response) => {
    try {
      const contactId = parseInt(req.params.contactId);
      const addressId = parseInt(req.params.addressId);
      const isPrimary = req.body.isPrimary === true;

      const contactAddress = await storage.addAddressToContact(contactId, addressId, isPrimary);
      res.status(201).json(contactAddress);
    } catch (error) {
      res.status(400).json({ error: 'Failed to link address to contact' });
    }
  });

  app.delete('/api/contacts/:contactId/addresses/:addressId', async (req: Request, res: Response) => {
    try {
      const contactId = parseInt(req.params.contactId);
      const addressId = parseInt(req.params.addressId);

      const success = await storage.removeAddressFromContact(contactId, addressId);
      if (!success) {
        return res.status(404).json({ error: 'Address link not found' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to remove address from contact' });
    }
  });

  // Appliance endpoints
  app.get('/api/appliances', async (req: Request, res: Response) => {
    try {
      const appliances = await storage.getAllAppliances();
      console.log('Fetched appliances:', appliances);
      res.status(200).json(appliances);
    } catch (error) {
      console.error('Error getting appliances:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/appliances/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const appliance = await storage.getAppliance(id);

      if (!appliance) {
        return res.status(404).json({ error: "Appliance not found" });
      }

      res.status(200).json(appliance);
    } catch (error) {
      console.error('Error getting appliance:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/units/:unitId/appliances', async (req: Request, res: Response) => {
    try {
      const unitId = parseInt(req.params.unitId);
      const appliances = await storage.getAppliancesByUnit(unitId);
      res.status(200).json(appliances);
    } catch (error) {
      console.error('Error getting unit appliances:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/appliances', async (req: Request, res: Response) => {
    try {
      const applianceData = insertApplianceSchema.parse(req.body);
      const appliance = await storage.createAppliance(applianceData);
      res.status(201).json(appliance);
    } catch (error) {
      console.error('Error creating appliance:', error);
      res.status(400).json({ error: 'Invalid appliance data' });
    }
  });

  app.put('/api/appliances/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const applianceData = insertApplianceSchema.partial().parse(req.body);

      const updatedAppliance = await storage.updateAppliance(id, applianceData);

      if (!updatedAppliance) {
        return res.status(404).json({ error: "Appliance not found" });
      }

      res.status(200).json(updatedAppliance);
    } catch (error) {
      console.error('Error updating appliance:', error);
      res.status(400).json({ error: 'Invalid appliance data' });
    }
  });

  app.delete('/api/appliances/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteAppliance(id);

      if (!success) {
        return res.status(404).json({ error: "Appliance not found" });
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting appliance:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Insurance API endpoints
  app.get('/api/insurances', async (req: Request, res: Response) => {
    try {
      const insurances = await storage.getAllInsurances();
      console.log('Fetched insurances:', insurances);
      res.setHeader('Content-Type', 'application/json');
      res.json(insurances);
    } catch (error) {
      console.error('Error retrieving all insurances:', error);
      res.status(500).json({ error: 'Failed to retrieve insurances' });
    }
  });

  app.get('/api/insurances/property/:propertyId', async (req: Request, res: Response) => {
    try {
      const propertyId = parseInt(req.params.propertyId);
      if (isNaN(propertyId)) {
        return res.status(400).json({ error: 'Invalid property ID' });
      }

      const insurances = await storage.getInsurancesByPropertyId(propertyId);
      console.log(`Fetched insurances for property ${propertyId}:`, insurances);
      res.setHeader('Content-Type', 'application/json');
      res.json(insurances);
    } catch (error) {
      console.error('Error retrieving insurances:', error);
      res.status(500).json({ error: 'Failed to retrieve insurances' });
    }
  });

  app.get('/api/insurances/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid ID format' });
      }

      const insurance = await storage.getInsurance(id);
      if (!insurance) {
        return res.status(404).json({ error: 'Insurance not found' });
      }

      res.setHeader('Content-Type', 'application/json');
      res.json(insurance);
    } catch (error) {
      console.error('Error retrieving insurance:', error);
      res.status(500).json({ error: 'Failed to retrieve insurance' });
    }
  });

  app.post('/api/insurances', async (req: Request, res: Response) => {
    try {
      const validatedData = insertInsuranceSchema.safeParse(req.body);

      if (!validatedData.success) {
        return res.status(400).json({ 
          error: 'Invalid insurance data', 
          details: validatedData.error.format() 
        });
      }

      const newInsurance = await storage.createInsurance(validatedData.data);
      res.status(201).json(newInsurance);
    } catch (error) {
      console.error('Error creating insurance:', error);
      res.status(500).json({ error: 'Failed to create insurance' });
    }
  });

  app.put('/api/insurances/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid ID format' });
      }

      const validatedData = insertInsuranceSchema.partial().safeParse(req.body);

      if (!validatedData.success) {
        return res.status(400).json({ 
          error: 'Invalid insurance data', 
          details: validatedData.error.format() 
        });
      }

      const updatedInsurance = await storage.updateInsurance(id, validatedData.data);
      if (!updatedInsurance) {
        return res.status(404).json({ error: 'Insurance not found' });
      }

      res.json(updatedInsurance);
    } catch (error) {
      console.error('Error updating insurance:', error);
      res.status(500).json({ error: 'Failed to update insurance' });
    }
  });

  app.delete('/api/insurances/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid ID format' });
      }

      const success = await storage.deleteInsurance(id);
      if (!success) {
        return res.status(404).json({ error: 'Insurance not found' });
      }

      res.status(204).end();
    } catch (error) {
      console.error('Error deleting insurance:', error);
      res.status(500).json({ error: 'Failed to delete insurance' });
    }
  });

  // Mortgage API endpoints
  app.get('/api/mortgages', async (req: Request, res: Response) => {
    try {
      const mortgages = await storage.getAllMortgages();
      console.log('Fetched mortgages:', mortgages);
      res.setHeader('Content-Type', 'application/json');
      res.json(mortgages);
    } catch (error) {
      console.error('Error retrieving all mortgages:', error);
      res.status(500).json({ error: 'Failed to retrieve mortgages' });
    }
  });

  app.get('/api/mortgages/property/:propertyId', async (req: Request, res: Response) => {
    try {
      const propertyId = parseInt(req.params.propertyId);
      if (isNaN(propertyId)) {
        return res.status(400).json({ error: 'Invalid property ID' });
      }

      const mortgages = await storage.getMortgagesByPropertyId(propertyId);
      console.log(`Fetched mortgages for property ${propertyId}:`, mortgages);
      res.setHeader('Content-Type', 'application/json');
      res.json(mortgages);
    } catch (error) {
      console.error('Error retrieving mortgages:', error);
      res.status(500).json({ error: 'Failed to retrieve mortgages' });
    }
  });

  app.get('/api/mortgages/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid ID format' });
      }

      const mortgage = await storage.getMortgage(id);
      if (!mortgage) {
        return res.status(404).json({ error: 'Mortgage not found' });
      }

      res.setHeader('Content-Type', 'application/json');
      res.json(mortgage);
    } catch (error) {
      console.error('Error retrieving mortgage:', error);
      res.status(500).json({ error: 'Failed to retrieve mortgage' });
    }
  });

  app.post('/api/mortgages', async (req: Request, res: Response) => {
    try {
      const validatedData = insertMortgageSchema.safeParse(req.body);

      if (!validatedData.success) {
        return res.status(400).json({ 
          error: 'Invalid mortgage data', 
          details: validatedData.error.format() 
        });
      }

      const newMortgage = await storage.createMortgage(validatedData.data);
      res.status(201).json(newMortgage);
    } catch (error) {
      console.error('Error creating mortgage:', error);
      res.status(500).json({ error: 'Failed to create mortgage' });
    }
  });

  app.put('/api/mortgages/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid ID format' });
      }

      const validatedData = insertMortgageSchema.partial().safeParse(req.body);

      if (!validatedData.success) {
        return res.status(400).json({ 
          error: 'Invalid mortgage data', 
          details: validatedData.error.format() 
        });
      }

      const updatedMortgage = await storage.updateMortgage(id, validatedData.data);
      if (!updatedMortgage) {
        return res.status(404).json({ error: 'Mortgage not found' });
      }

      res.json(updatedMortgage);
    } catch (error) {
      console.error('Error updating mortgage:', error);
      res.status(500).json({ error: 'Failed to update mortgage' });
    }
  });

  app.delete('/api/mortgages/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid ID format' });
      }

      const success = await storage.deleteMortgage(id);
      if (!success) {
        return res.status(404).json({ error: 'Mortgage not found' });
      }

      res.status(204).end();
    } catch (error) {
      console.error('Error deleting mortgage:', error);
      res.status(500).json({ error: 'Failed to delete mortgage' });
    }
  });

  // Utilities API endpoints
  app.get('/api/utilities/accounts', async (req: Request, res: Response) => {
    try {
      const accounts = Array.from(storage.utilityAccounts?.values() || []);
      res.json(accounts);
    } catch (error) {
      console.error('Error retrieving utility accounts:', error);
      res.status(500).json({ error: 'Failed to retrieve utility accounts' });
    }
  });

  app.get('/api/utilities/bills', async (req: Request, res: Response) => {
    try {
      const bills = Array.from(storage.utilityBills?.values() || []);
      res.json(bills);
    } catch (error) {
      console.error('Error retrieving utility bills:', error);
      res.status(500).json({ error: 'Failed to retrieve utility bills' });
    }
  });

  // Property Inspections API endpoints
  app.get('/api/property-inspections/scheduled', async (req: Request, res: Response) => {
    try {
      const inspections = Array.from(storage.inspections?.values() || []);

      // If no inspections are found, use sample data from seed-features
      if (!inspections.length) {
        // Import sample data
        const sampleInspections = [
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

        // Seed the inspections
        for (const inspection of sampleInspections) {
          await storage.createInspection(inspection);
        }

        return res.json(sampleInspections);
      }

      res.json(inspections);
    } catch (error) {
      console.error('Error retrieving scheduled inspections:', error);
      res.status(500).json({ error: 'Failed to retrieve scheduled inspections' });
    }
  });

  app.get('/api/property-inspections/completed', async (req: Request, res: Response) => {
    try {
      const inspections = Array.from(storage.completedInspections?.values() || []);

      // If no inspections are found, use sample data
      if (!inspections.length) {
        // Import sample data
        const sampleCompletedInspections = [
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

        // Seed the completed inspections
        for (const inspection of sampleCompletedInspections) {
          await storage.createCompletedInspection(inspection);
        }

        return res.json(sampleCompletedInspections);
      }

      res.json(inspections);
    } catch (error) {
      console.error('Error retrieving completed inspections:', error);
      res.status(500).json({ error: 'Failed to retrieve completed inspections' });
    }
  });

  // Document Signing API endpoints
  app.get('/api/document-signing/documents', async (req: Request, res: Response) => {
    try {
      // In a real implementation, fetch signing documents from database
      // Return mock data for now
      const documents = [
        {
          id: 1,
          title: "Sunset Heights Lease Agreement",
          documentType: "Lease",
          recipient: "John Doe",
          recipientEmail: "john.doe@example.com",
          sentDate: "2023-05-15",
          status: "pending",
          expiresOn: "2023-05-30",
        },
        {
          id: 2,
          title: "Maple Gardens Maintenance Contract",
          documentType: "Vendor Contract",
          recipient: "ABC Plumbing",
          recipientEmail: "service@abcplumbing.com",
          sentDate: "2023-05-14",
          status: "viewed",
          expiresOn: "2023-05-29",
        },
        {
          id: 3,
          title: "Riverfront Condos Lease Renewal",
          documentType: "Lease",
          recipient: "Sarah Johnson",
          recipientEmail: "sarah.j@example.com",
          sentDate: "2023-05-01",
          signedDate: "2023-05-03",
          status: "completed",
        },
        {
          id: 4,
          title: "Urban Lofts Cleaning Service Agreement",
          documentType: "Vendor Contract",
          recipient: "CleanPro Services",
          recipientEmail: "contracts@cleanpro.com",
          sentDate: "2023-04-28",
          signedDate: "2023-05-02",
          status: "completed",
        }
      ];

      res.json(documents);
    } catch (error) {
      console.error('Error retrieving documents:', error);
      res.status(500).json({ error: 'Failed to retrieve documents' });
    }
  });

  app.get('/api/document-signing/documents/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      // In a real implementation, fetch document from database
      // Return enhanced mock data for now based on ID

      // Sample documents with different statuses for testing
      const documents = {
        1: {
          id: 1,
          title: "Sunset Heights Lease Agreement",
          documentType: "Lease",
          status: "pending",
          sentDate: "2023-05-15",
          expiresOn: "2023-05-30",
          sender: {
            name: "Property Management Inc.",
            email: "admin@propertymanagement.com"
          },
          recipient: {
            name: "John Doe",
            email: "john.doe@example.com",
            phone: "555-123-4567"
          },
          content: `
            <h1>RESIDENTIAL LEASE AGREEMENT</h1>
            <p>This Residential Lease Agreement ("Agreement") is made and entered into on May 15, 2023, by and between Property Management Inc. ("Landlord") and John Doe ("Tenant").</p>

            <h2>1. PROPERTY</h2>
            <p>Landlord hereby leases to Tenant and Tenant hereby leases from Landlord, solely for residential purposes, the premises located at: 123 Main St, Apt 101, Anytown, ST 12345 ("Premises").</p>

            <h2>2. TERM</h2>
            <p>The term of this Agreement shall be for a period of 12 months, commencing on June 1, 2023, and ending on May 31, 2024.</p>

            <h2>3. RENT</h2>
            <p>Tenant agrees to pay, without demand, to Landlord as rent for the Premises the sum of $1,200.00 per month in advance on the 1st day of each month.</p>

            <h2>4. SECURITY DEPOSIT</h2>
            <p>Upon execution of this Agreement, Tenant shall deposit with Landlord the sum of $1,200.00 as a security deposit.</p>

            <h2>5. UTILITIES</h2>
            <p>Tenant will be responsible for payment of all utilities and services, except for the following which shall be paid by Landlord: Water and trash collection.</p>

            <h2>6. SIGNATURES</h2>
            <p>By signing below, Tenant acknowledges having read and understood all the terms and conditions of this Agreement and agrees to be bound thereby.</p>

            <div style="margin-top: 30px;">
              <div style="display: inline-block; min-width: 200px; margin-right: 50px;">
                <p style="border-bottom: 1px solid #000; min-height: 40px;" class="signature-field" data-field="landlord_signature"></p>
                <p>Landlord Signature</p>
              </div>

              <div style="display: inline-block; min-width: 200px;">
                <p style="border-bottom: 1px solid #000; min-height: 40px;" class="signature-field" data-field="tenant_signature"></p>
                <p>Tenant Signature</p>
              </div>
            </div>
          `,
          signingFields: [
            { id: "tenant_signature", type: "signature", label: "Signature", required: true, signed: false },
            { id: "tenant_initials_1", type: "initials", label: "Initials - Page 1", required: true, signed: false },
            { id: "tenant_initials_2", type: "initials", label: "Initials - Page 2", required: true, signed: false }
          ]
        },
        2: {
          id: 2,
          title: "Maple Gardens Maintenance Contract",
          documentType: "Vendor Contract",
          status: "viewed",
          sentDate: "2023-05-14",
          expiresOn: "2023-05-29",
          sender: {
            name: "Property Management Inc.",
            email: "admin@propertymanagement.com"
          },
          recipient: {
            name: "ABC Plumbing",
            email: "service@abcplumbing.com",
            phone: "555-789-1234"
          },
          content: `
            <h1>VENDOR MAINTENANCE AGREEMENT</h1>
            <p>This Maintenance Agreement ("Agreement") is made and entered into on May 14, 2023, by and between Property Management Inc. ("Client") and ABC Plumbing ("Vendor").</p>

            <h2>1. SERVICES</h2>
            <p>Vendor agrees to provide plumbing maintenance and repair services for the following properties: Maple Gardens Apartments located at 456 Oak Ave, Anytown, ST 12345.</p>

            <h2>2. TERM</h2>
            <p>The term of this Agreement shall be for a period of 12 months, commencing on June 1, 2023, and ending on May 31, 2024.</p>

            <h2>3. COMPENSATION</h2>
            <p>Client agrees to pay Vendor for services at the rate of $85.00 per hour for standard services, and $125.00 per hour for emergency services.</p>

            <h2>4. RESPONSE TIMES</h2>
            <p>Vendor agrees to respond to standard service calls within 24 hours and emergency service calls within 4 hours.</p>

            <h2>5. SIGNATURES</h2>
            <p>By signing below, both parties acknowledge having read and understood all the terms and conditions of this Agreement and agree to be bound thereby.</p>

            <div style="margin-top: 30px;">
              <div style="display: inline-block; min-width: 200px; margin-right: 50px;">
                <p style="border-bottom: 1px solid #000; min-height: 40px;" class="signature-field" data-field="client_signature"></p>
                <p>Client Signature</p>
              </div>

              <div style="display: inline-block; min-width: 200px;">
                <p style="border-bottom: 1px solid #000; min-height: 40px;" class="signature-field" data-field="vendor_signature"></p>
                <p>Vendor Signature</p>
              </div>
            </div>
          `,
          signingFields: [
            { id: "vendor_signature", type: "signature", label: "Signature", required: true, signed: false },
            { id: "vendor_initials_1", type: "initials", label: "Initials - Page 1", required: true, signed: false }
          ]
        },
        3: {
          id: 3,
          title: "Riverfront Condos Lease Renewal",
          documentType: "Lease",
          status: "completed",
          sentDate: "2023-05-01",
          signedDate: "2023-05-03",
          sender: {
            name: "Property Management Inc.",
            email: "admin@propertymanagement.com"
          },
          recipient: {
            name: "Sarah Johnson",
            email: "sarah.j@example.com",
            phone: "555-456-7890"
          },
          content: `
            <h1>LEASE RENEWAL AGREEMENT</h1>
            <p>This Lease Renewal Agreement ("Agreement") is made and entered into on May 1, 2023, by and between Property Management Inc. ("Landlord") and Sarah Johnson ("Tenant").</p>

            <h2>1. RENEWAL TERM</h2>
            <p>The parties agree to renew the existing lease for the property located at 789 River Rd, Unit 303, Anytown, ST 12345 for an additional period of 12 months, commencing on June 15, 2023, and ending on June 14, 2024.</p>

            <h2>2. RENT</h2>
            <p>Tenant agrees to pay, without demand, to Landlord as rent for the Premises the sum of $1,450.00 per month in advance on the 1st day of each month.</p>

            <h2>3. DEPOSIT</h2>
            <p>The existing security deposit of $1,400.00 shall continue to be held by Landlord in accordance with the terms of the original lease agreement.</p>

            <h2>4. SIGNATURES</h2>
            <p>By signing below, Tenant acknowledges having read and understood all the terms and conditions of this Agreement and agrees to be bound thereby.</p>

            <div style="margin-top: 30px;">
              <div style="display: inline-block; min-width: 200px; margin-right: 50px;">
                <p style="border-bottom: 1px solid #000; min-height: 40px;" class="signature-field" data-field="landlord_signature"></p>
                <p>Landlord Signature</p>
              </div>

              <div style="display: inline-block; min-width: 200px;">
                <p style="border-bottom: 1px solid #000; min-height: 40px;" class="signature-field" data-field="tenant_signature"></p>
                <p>Tenant Signature</p>
              </div>
            </div>
          `,
          signingFields: [
            { id: "tenant_signature", type: "signature", label: "Signature", required: true, signed: true, signedAt: "2023-05-03T14:30:45Z" },
            { id: "tenant_initials_1", type: "initials", label: ""Initials - Page1", required: true, signed: true, signedAt: "2023-05-03T14:29:20Z" }
          ]
        },
        4: {
          id: 4,
          title: "Urban Lofts Cleaning Service Agreement",
          documentType: "Vendor Contract",
          status: "completed",
          sentDate: "2023-04-28",
          signedDate: "2023-05-02",
          sender: {
            name: "Property Management Inc.",
            email: "admin@propertymanagement.com"
          },
          recipient: {
            name: "CleanPro Services",
            email: "contracts@cleanpro.com",
            phone: "555-987-6543"
          },
          content: `
            <h1>CLEANING SERVICE AGREEMENT</h1>
            <p>This Cleaning Service Agreement ("Agreement") is made and entered into on April 28, 2023, by and between Property Management Inc. ("Client") and CleanPro Services ("Vendor").</p>

            <h2>1. SERVICES</h2>
            <p>Vendor agrees to provide weekly cleaning services for common areas at the Urban Lofts property located at 101 Downtown Blvd, Anytown, ST 12345.</p>

            <h2>2. TERM</h2>
            <p>The term of this Agreement shall be for a period of 6 months, commencing on May 15, 2023, and ending on November 14, 2023.</p>

            <h2>3. COMPENSATION</h2>
            <p>Client agrees to pay Vendor for services at the rate of $250.00 per week, payable on the 1st and 15th of each month.</p>

            <h2>4. SIGNATURES</h2>
            <p>By signing below, both parties acknowledge having read and understood all the terms and conditions of this Agreement and agree to be bound thereby.</p>

            <div style="margin-top: 30px;">
              <div style="display: inline-block; min-width: 200px; margin-right: 50px;">
                <p style="border-bottom: 1px solid #000; min-height: 40px;" class="signature-field" data-field="client_signature"></p>
                <p>Client Signature</p>
              </div>

              <div style="display: inline-block; min-width: 200px;">
                <p style="border-bottom: 1px solid #000; min-height: 40px;" class="signature-field" data-field="vendor_signature"></p>
                <p>Vendor Signature</p>
              </div>
            </div>
          `,
          signingFields: [
            { id: "vendor_signature", type: "signature", label: "Signature", required: true, signed: true, signedAt: "2023-05-02T10:15:33Z" },
            { id: "vendor_initials_1", type: "initials", label: "Initials - Page 1", required: true, signed: true, signedAt: "2023-05-02T10:14:20Z" }
          ]
        }
      };

      // Get the document based on ID
      const document = documents[id as keyof typeof documents];

      if (!document) {
        return res.status(404).json({ error: 'Document not found' });
      }

      res.json(document);
    } catch (error) {
      console.error('Error retrieving document:', error);
      res.status(500).json({ error: 'Failed to retrieve document' });
    }
  });

  app.post('/api/document-signing/documents', async (req: Request, res: Response) => {
    try {
      // In a real implementation, create document in database
      const document = {
        id: Date.now(),
        ...req.body,
        sentDate: new Date().toISOString().split('T')[0],
        status: "pending"
      };

      res.status(201).json(document);
    } catch (error) {
      console.error('Error creating document:', error);
      res.status(500).json({ error: 'Failed to create document' });
    }
  });

  app.post('/api/document-signing/documents/:id/sign', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { fieldId, signatureData } = req.body;

      // In a real implementation, update the document in database with signature data
      res.json({ 
        success: true, 
        message: "Field signed successfully" 
      });
    } catch (error) {
      console.error('Error signing document:', error);
      res.status(500).json({ error: 'Failed to sign document' });
    }
  });

  app.post('/api/document-signing/documents/:id/complete', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);

      // In a real implementation, mark document as completed in database
      res.json({ 
        success: true, 
        message: "Document completed successfully" 
      });
    } catch (error) {
      console.error('Error completing document:', error);
      res.status(500).json({ error: 'Failed to complete document' });
    }
  });

  // Document delivery endpoints
  app.post('/api/document-signing/documents/:id/send', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { method, recipient, message } = req.body;

      if (!method || !recipient) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // In a real implementation, this would:
      // 1. Get the document from database
      // 2. Generate a unique secure link with token
      // 3. Send the document via the specified method
      // 4. Log the delivery for compliance

      // For demonstration, return a mock response
      const deliveryRecord = {
        id: Date.now(),
        documentId: id,
        method,
        recipient,
        message: message || null,
        sentAt: new Date().toISOString(),
        status: "sent",
        deliveryId: `DEL-${Math.floor(100000 + Math.random() * 900000)}`,
        // Track IP, timestamp, delivery method for UETA/ESIGN compliance
        compliance: {
          senderIp: req.ip || "127.0.0.1",
          timestamp: new Date().toISOString(),
          consent: true
        }
      };

      res.status(200).json({
        success: true,
        message: `Document sent via ${method} to ${recipient}`,
        delivery: deliveryRecord
      });
    } catch (error) {
      console.error('Error sending document:', error);
      res.status(500).json({ error: 'Failed to send document' });
    }
  });

  // Document verification endpoint (for UETA/ESIGN compliance)
  app.get('/api/document-signing/verify/:token', async (req: Request, res: Response) => {
    try {
      const { token } = req.params;

      // In a real implementation:
      // 1. Verify the token
      // 2. Return the verification details

      res.json({
        verified: true,
        documentId: 1, // Example
        title: "Sunset Heights Lease Agreement",
        verificationTimestamp: new Date().toISOString(),
        signers: [
          {
            name: "John Doe",
            email: "john.doe@example.com",
            signedAt: "2023-05-15T14:30:45Z",
            ipAddress: "192.168.1.1",
            verificationMethod: "email"
          }
        ]
      });
    } catch (error) {
      console.error('Error verifying document:', error);
      res.status(500).json({ error: 'Failed to verify document' });
    }
  });

  app.get('/api/document-signing/templates', async (req: Request, res: Response) => {
    try {
      // In a real implementation, fetch templates from database
      // Return mock data for now
      const templates = [
        {
          id: 1,
          name: "Standard Lease Agreement",
          type: "lease",
          description: "Default lease agreement for residential properties",
          created: "2023-01-15",
          lastUsed: "2023-05-10",
          usageCount: 24
        },
        {
          id: 2,
          name: "Month-to-Month Lease",
          type: "lease",
          description: "Short-term lease agreement with monthly renewal",
          created: "2023-02-03",
          lastUsed: "2023-05-01",
          usageCount: 8
        },
        {
          id: 3,
          name: "Commercial Lease",
          type: "lease",
          description: "Lease agreement for commercial properties",
          created: "2023-01-20",
          lastUsed: "2023-04-15",
          usageCount: 5
        },
        {
          id: 4,
          name: "Vendor Service Contract",
          type: "vendor",
          description: "Standard contract for service vendors",
          created: "2023-03-05",
          lastUsed: "2023-05-12",
          usageCount: 12
        },
        {
          id: 5,
          name: "Maintenance Agreement",
          type: "maintenance",
          description: "Agreement for recurring property maintenance",
          created: "2023-03-10",
          lastUsed: "2023-04-20",
          usageCount: 7
        }
      ];

      res.json(templates);
    } catch (error) {
      console.error('Error retrieving templates:', error);
      res.status(500).json({ error: 'Failed to retrieve templates' });
    }
  });

  // Maintenance requests routes
  app.get('/api/maintenance-requests', async (req: Request, res: Response) => {
    try {
      const maintenanceRequests = await storage.getAllMaintenanceRequests();
      res.json(maintenanceRequests);
    } catch (error) {
      console.error('Error fetching maintenance requests:', error);
      res.status(500).json({ error: 'Failed to fetch maintenance requests' });
    }
  });

  app.get('/api/maintenance-requests/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const maintenanceRequest = await storage.getMaintenanceRequest(id);
      if (!maintenanceRequest) {
        return res.status(404).json({ error: 'Maintenance request not found' });
      }
      res.json(maintenanceRequest);
    } catch (error) {
      console.error('Error fetching maintenance request:', error);
      res.status(500).json({ error: 'Failed to fetch maintenance request' });
    }
  });

  app.get('/api/maintenance-requests/property/:propertyId', async (req: Request, res: Response) => {
    try {
      const propertyId = parseInt(req.params.propertyId);
      const maintenanceRequests = await storage.getMaintenanceRequestsByProperty(propertyId);
      res.json(maintenanceRequests);
    } catch (error) {
      console.error('Error fetching property maintenance requests:', error);
      res.status(500).json({ error: 'Failed to fetch property maintenance requests' });
    }
  });

  app.post('/api/maintenance-requests', async (req: Request, res: Response) => {
    try {
      const maintenanceRequest = await storage.createMaintenanceRequest(req.body);
      res.status(201).json(maintenanceRequest);
    } catch (error) {
      console.error('Error creating maintenance request:', error);
      res.status(500).json({ error: 'Failed to create maintenance request' });
    }
  });

  app.put('/api/maintenance-requests/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const maintenanceRequest = await storage.updateMaintenanceRequest(id, req.body);
      if (!maintenanceRequest) {
        return res.status(404).json({ error: 'Maintenance request not found' });
      }
      res.json(maintenanceRequest);
    } catch (error) {
      console.error('Error updating maintenance request:', error);
      res.status(500).json({ error: 'Failed to update maintenance request' });
    }
  });

  app.delete('/api/maintenance-requests/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteMaintenanceRequest(id);
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting maintenance request:', error);
      res.status(500).json({ error: 'Failed to delete maintenance request' });
    }
  });

  // Authentication routes
  app.post('/api/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await storage.findUser(username);
      if (!user || user.password !== password) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!);
      res.json({ token });
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ error: 'Failed to log in' });
    }
  });

  //Protected route for testing
  // Remove the authenticateToken middleware since it's not defined
  app.get('/api/profile', async (req: Request, res: Response) => {
    // Check if user is authenticated using the session
    if (!req.isAuthenticated?.()) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    res.json({message: 'Welcome to the protected route'});
  });

  // Appliances API endpoints
  app.get('/api/appliances', async (req: Request, res: Response) => {
    try {
      const appliances = await storage.getAllAppliances();
      console.log('Fetched appliances:', appliances);
      res.setHeader('Content-Type', 'application/json');
      res.json(appliances);
    } catch (error) {
      console.error('Error fetching appliances:', error);
      res.status(500).json({ error: 'Failed to fetch appliances' });
    }
  });

  app.get('/api/appliances/property/:propertyId', async (req: Request, res: Response) => {
    try {
      const propertyId = parseInt(req.params.propertyId);
      // Since we don't have a direct method for this, we'll filter from all appliances
      const allAppliances = await storage.getAppliances();
      const propertyAppliances = allAppliances.filter(a => a.propertyId === propertyId);
      console.log(`Fetched appliances for property ${propertyId}:`, propertyAppliances);
      res.setHeader('Content-Type', 'application/json');
      res.json(propertyAppliances);
    } catch (error) {
      console.error('Error fetching property appliances:', error);
      res.status(500).json({ error: 'Failed to fetch property appliances' });
    }
  });
  // Utility management endpoints
  app.get('/api/utility-accounts', async (req: Request, res: Response) => {
    try {
      const utilityAccounts = await storage.getUtilityAccounts();
      res.json(utilityAccounts);
    } catch (error) {
      console.error('Error retrieving utility accounts:', error);
      res.status(500).json({ error: 'Failed to retrieve utility accounts' });
    }
  });
  app.get('/api/utility-bills', async (req: Request, res: Response) => {
    try {
      const utilityBills = await storage.getUtilityBills();
      res.json(utilityBills);
    } catch (error) {
      console.error('Error retrieving utility bills:', error);
      res.status(500).json({ error: 'Failed to retrieve utility bills' });
    }
  });
  // Property inspections endpoints
  app.get('/api/inspections', async (req: Request, res: Response) => {
    try {
      const inspections = await storage.getInspections();
      res.json(inspections);
    } catch (error) {
      console.error('Error retrieving inspections:', error);
      res.status(500).json({ error: 'Failed to retrieve inspections' });
    }
  });
  app.get('/api/completed-inspections', async (req: Request, res: Response) => {
    try {
      const completedInspections = await storage.getCompletedInspections();
      res.json(completedInspections);
    } catch (error) {
      console.error('Error retrieving completed inspections:', error);
      res.status(500).json({ error: 'Failed to retrieve completed inspections' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}