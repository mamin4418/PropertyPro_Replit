
import express from "express";
import { registerRoutes } from "./routes";
import { seedDatabase } from "./seed-data";
import { seedApplications } from "./seed-applications";
import { seedUtilitiesAndInspections, setupUtilitiesAndInspectionsRoutes } from "./seed-features";
import { createServer } from "http";
import path from "path";
import { setupVite } from "./vite";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;

async function startServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.static(path.resolve("client/dist")));
  
  // Set proper headers for protocol support
  app.use((req, res, next) => {
    res.setHeader('Connection', 'upgrade, keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

  // Setup API routes
  const httpServer = await registerRoutes(app); 
  setupUtilitiesAndInspectionsRoutes(app);

  // Seed data
  try {
    seedDatabase();
    seedApplications();
    await seedUtilitiesAndInspections();
  } catch (error) {
    console.error("Error seeding data:", error);
  }

  // In development mode, setup Vite for HMR
  if (process.env.NODE_ENV === "development") {
    await setupVite(app);
  }

  // Catch-all route to serve the frontend for all other requests
  app.get("*", (req, res) => {
    if (process.env.NODE_ENV === "development") {
      res.redirect(`http://localhost:${PORT}${req.originalUrl}`);
    } else {
      res.sendFile(path.resolve("client/dist/index.html"));
    }
  });

  // Create HTTP server with enhanced protocol support
  const server = httpServer || createServer(app);
  
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server started on port ${PORT}`);
    console.log(`Mode: ${process.env.NODE_ENV || "development"}`);
    console.log(`Server accessible at http://0.0.0.0:${PORT}`);
    
    // Check if running in Replit environment
    if (process.env.REPL_ID) {
      console.log(`\n======= ACCESS INFORMATION FOR @mamin4418 =======`);
      console.log(`Your application is available at: https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`);
      console.log(`Make sure to click the 'Run' button to start the server`);
      console.log(`================================================\n`);
    }
  });
  
  // Add proper error handling
  server.on('error', (error) => {
    console.error('Server error:', error);
  });

  // Handle WebSocket upgrade events
  server.on('upgrade', (request, socket, head) => {
    console.log('WebSocket upgrade request received');
  });

  // Return server for testing or further extension
  return server;
}

startServer().catch(console.error);
