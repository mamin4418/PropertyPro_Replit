import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
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
      // For now, return an empty array since we don't have full implementation
      res.json([]);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve applications' });
    }
  });

  // Application Templates API endpoints
  app.get('/api/application-templates', async (req: Request, res: Response) => {
    try {
      // For now, return an empty array since we don't have full implementation
      res.json([]);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve application templates' });
    }
  });

  app.post('/api/application-templates', async (req: Request, res: Response) => {
    try {
      // Mock response for now
      const template = {
        id: Date.now(),
        ...req.body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      res.status(201).json(template);
    } catch (error) {
      res.status(400).json({ error: 'Invalid template data' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
