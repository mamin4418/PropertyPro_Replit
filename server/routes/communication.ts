import { Router } from "express";
import { storage } from "../storage";
import { insertCommunicationTemplateSchema, insertCommunicationLogSchema, insertNotificationSchema } from "../../shared/schema";

const router = Router();

// Communication Templates routes
router.get("/templates", async (req, res) => {
  try {
    const templates = await storage.getCommunicationTemplates();
    res.json(templates);
  } catch (error) {
    console.error("Error fetching communication templates:", error);
    res.status(500).json({ error: "Failed to fetch communication templates" });
  }
});

router.get("/templates/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const template = await storage.getCommunicationTemplate(id);
    
    if (!template) {
      return res.status(404).json({ error: "Communication template not found" });
    }
    
    res.json(template);
  } catch (error) {
    console.error("Error fetching communication template:", error);
    res.status(500).json({ error: "Failed to fetch communication template" });
  }
});

router.post("/templates", async (req, res) => {
  try {
    const templateData = insertCommunicationTemplateSchema.parse(req.body);
    const newTemplate = await storage.createCommunicationTemplate(templateData);
    res.status(201).json(newTemplate);
  } catch (error) {
    console.error("Error creating communication template:", error);
    res.status(400).json({ error: "Failed to create communication template" });
  }
});

router.put("/templates/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const templateData = insertCommunicationTemplateSchema.parse(req.body);
    const updatedTemplate = await storage.updateCommunicationTemplate(id, templateData);
    
    if (!updatedTemplate) {
      return res.status(404).json({ error: "Communication template not found" });
    }
    
    res.json(updatedTemplate);
  } catch (error) {
    console.error("Error updating communication template:", error);
    res.status(400).json({ error: "Failed to update communication template" });
  }
});

router.delete("/templates/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const success = await storage.deleteCommunicationTemplate(id);
    
    if (!success) {
      return res.status(404).json({ error: "Communication template not found" });
    }
    
    res.status(204).end();
  } catch (error) {
    console.error("Error deleting communication template:", error);
    res.status(500).json({ error: "Failed to delete communication template" });
  }
});

// Communication Logs routes
router.get("/logs", async (req, res) => {
  try {
    const logs = await storage.getCommunicationLogs();
    res.json(logs);
  } catch (error) {
    console.error("Error fetching communication logs:", error);
    res.status(500).json({ error: "Failed to fetch communication logs" });
  }
});

router.get("/logs/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const log = await storage.getCommunicationLog(id);
    
    if (!log) {
      return res.status(404).json({ error: "Communication log not found" });
    }
    
    res.json(log);
  } catch (error) {
    console.error("Error fetching communication log:", error);
    res.status(500).json({ error: "Failed to fetch communication log" });
  }
});

router.post("/logs", async (req, res) => {
  try {
    const logData = insertCommunicationLogSchema.parse(req.body);
    const newLog = await storage.createCommunicationLog(logData);
    res.status(201).json(newLog);
  } catch (error) {
    console.error("Error creating communication log:", error);
    res.status(400).json({ error: "Failed to create communication log" });
  }
});

router.put("/logs/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const logData = insertCommunicationLogSchema.parse(req.body);
    const updatedLog = await storage.updateCommunicationLog(id, logData);
    
    if (!updatedLog) {
      return res.status(404).json({ error: "Communication log not found" });
    }
    
    res.json(updatedLog);
  } catch (error) {
    console.error("Error updating communication log:", error);
    res.status(400).json({ error: "Failed to update communication log" });
  }
});

router.delete("/logs/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const success = await storage.deleteCommunicationLog(id);
    
    if (!success) {
      return res.status(404).json({ error: "Communication log not found" });
    }
    
    res.status(204).end();
  } catch (error) {
    console.error("Error deleting communication log:", error);
    res.status(500).json({ error: "Failed to delete communication log" });
  }
});

// Notifications routes
router.get("/notifications", async (req, res) => {
  try {
    const notifications = await storage.getNotifications();
    res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

router.get("/notifications/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const notification = await storage.getNotification(id);
    
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }
    
    res.json(notification);
  } catch (error) {
    console.error("Error fetching notification:", error);
    res.status(500).json({ error: "Failed to fetch notification" });
  }
});

router.post("/notifications", async (req, res) => {
  try {
    const notificationData = insertNotificationSchema.parse(req.body);
    const newNotification = await storage.createNotification(notificationData);
    res.status(201).json(newNotification);
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(400).json({ error: "Failed to create notification" });
  }
});

router.put("/notifications/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const notificationData = insertNotificationSchema.parse(req.body);
    const updatedNotification = await storage.updateNotification(id, notificationData);
    
    if (!updatedNotification) {
      return res.status(404).json({ error: "Notification not found" });
    }
    
    res.json(updatedNotification);
  } catch (error) {
    console.error("Error updating notification:", error);
    res.status(400).json({ error: "Failed to update notification" });
  }
});

router.delete("/notifications/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const success = await storage.deleteNotification(id);
    
    if (!success) {
      return res.status(404).json({ error: "Notification not found" });
    }
    
    res.status(204).end();
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ error: "Failed to delete notification" });
  }
});

export default router;