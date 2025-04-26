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

  const httpServer = createServer(app);
  return httpServer;
}
