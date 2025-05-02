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

  // Setup API routes
  await registerRoutes(app); // Assuming registerRoutes now handles all routes, including utilities and inspections.
  setupUtilitiesAndInspectionsRoutes(app);

  // Seed data
  seedDatabase();
  seedApplications();
  seedUtilitiesAndInspections();

  // In development mode, setup Vite for HMR
  if (process.env.NODE_ENV === "development") {
    await setupVite(app); //Simplified Vite setup - assuming it handles the server integration correctly.
  }

  // Catch-all route to serve the frontend for all other requests
  app.get("*", (req, res) => {
    if (process.env.NODE_ENV === "development") {
      res.redirect(`http://localhost:3001${req.originalUrl}`);
    } else {
      res.sendFile(path.resolve("client/dist/index.html"));
    }
  });

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server started on port ${PORT}`);
    console.log(`Mode: ${process.env.NODE_ENV || "development"}`);
  });
}


startServer().catch(console.error);