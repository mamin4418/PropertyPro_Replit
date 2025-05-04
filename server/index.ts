import express from "express";
import { registerRoutes } from "./routes";
import { seedDatabase } from "./seed-data";
import { seedApplications } from "./seed-applications";
import { seedUtilitiesAndInspections, setupUtilitiesAndInspectionsRoutes } from "./seed-features";
import { Server } from "http";
import { createServer as createViteServer } from "vite";
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
    res.setHeader('Upgrade-Insecure-Requests', '1');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Accept-Encoding', 'gzip, deflate, br');
    next();
  });

  // Setup API routes
  await registerRoutes(app); 
  setupUtilitiesAndInspectionsRoutes(app);

  // Seed data
  try {
    seedDatabase();
    seedApplications();
    await seedUtilitiesAndInspections(); // Added await to handle potential async operations within seedUtilitiesAndInspections
  } catch (error) {
    console.error("Error seeding data:", error);
    // Consider more robust error handling, like halting server startup or using a process manager.
  }


  // In development mode, setup Vite for HMR
  if (process.env.NODE_ENV === "development") {
    await setupVite(app); 
  }

  // Catch-all route to serve the frontend for all other requests
  app.get("*", (req, res) => {
    if (process.env.NODE_ENV === "development") {
      res.redirect(`http://localhost:3001${req.originalUrl}`);
    } else {
      res.sendFile(path.resolve("client/dist/index.html"));
    }
  });

  // Create HTTP server with enhanced protocol support
  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server started on port ${PORT}`);
    console.log(`Mode: ${process.env.NODE_ENV || "development"}`);
    console.log(`Server accessible at http://0.0.0.0:${PORT}`);
  });
  
  // Add proper error handling
  server.on('error', (error) => {
    console.error('Server error:', error);
  });
}


startServer().catch(console.error);