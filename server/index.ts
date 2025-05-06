
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
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

const PORT = process.env.PORT || 3000;

// Create __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function startServer() {
  const app = express();
  
  // Middleware
  app.use(cors());
  app.use(express.json());
  
  // Properly serve static files from client/dist
  const staticPath = path.resolve(__dirname, "../client/dist");
  console.log(`Serving static files from: ${staticPath}`);
  app.use(express.static(staticPath));
  
  // Also serve from dist directory for compatibility
  const altStaticPath = path.resolve(__dirname, "../dist");
  console.log(`Also serving static files from: ${altStaticPath}`);
  app.use(express.static(altStaticPath));
  
  // Debug logging middleware to see what requests are coming in
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
  
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
    // Skip API routes - they should be handled by their own handlers
    if (req.url.startsWith('/api/')) {
      return res.status(404).json({ error: 'API endpoint not found' });
    }
    
    if (process.env.NODE_ENV === "development") {
      // In development, the Vite server should be set up by setupVite
      console.log(`Development mode: Redirecting ${req.originalUrl} to Vite dev server`);
      return res.redirect(`http://localhost:${PORT}${req.originalUrl}`);
    } else {
      // In production, serve the static files
      // Try client/dist first, then fallback to dist
      let indexPath = path.resolve(__dirname, "../client/dist/index.html");
      let fallbackPath = path.resolve(__dirname, "../dist/index.html");
      
      console.log(`Production mode: Attempting to serve SPA from: ${indexPath} for route: ${req.originalUrl}`);
      
      const fs = require('fs');
      
      try {
        // Check if the file exists before sending
        if (fs.existsSync(indexPath)) {
          console.log(`Serving index.html from: ${indexPath}`);
          return res.sendFile(indexPath);
        } else if (fs.existsSync(fallbackPath)) {
          console.log(`Falling back to: ${fallbackPath}`);
          return res.sendFile(fallbackPath);
        } else {
          // If both paths fail, try to build the client on the fly
          console.warn(`No index.html found. Returning simple HTML page.`);
          return res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Property Management System</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; text-align: center; }
                .error { color: #e74c3c; margin: 20px 0; }
                .message { margin: 20px 0; }
                button { padding: 10px 20px; background: #3498db; color: white; border: none; cursor: pointer; }
              </style>
            </head>
            <body>
              <h1>Property Management System</h1>
              <div class="error">The application frontend wasn't built properly.</div>
              <div class="message">The server is running, but the client files are missing.</div>
              <p>Please build the client files by running:</p>
              <pre>cd client && npm run build</pre>
              <a href="/"><button>Refresh Page</button></a>
            </body>
            </html>
          `);
        }
      } catch (error) {
        console.error('Error handling SPA route:', error);
        return res.status(500).send('Server error while serving frontend');
      }
    }
  });

  // Create HTTP server with enhanced protocol support
  const server = httpServer || createServer(app);
  
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`\n======================================`);
    console.log(`Server started on port ${PORT}`);
    console.log(`Mode: ${process.env.NODE_ENV || "development"}`);
    
    // Check if running in Replit environment
    if (process.env.REPL_ID) {
      console.log(`\n📱 ACCESS YOUR APPLICATION:`);
      console.log(`1. Direct URL: https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`);
      console.log(`2. Replit Preview: Click the "webview" tab above`);
      console.log(`3. Fallback URL: https://${process.env.REPL_ID}.id.repl.co`);
      console.log(`\nMake sure to keep this server running to maintain access`);
    } else {
      console.log(`Server accessible at http://0.0.0.0:${PORT}`);
    }
    console.log(`======================================\n`);
  });
  
  // Add comprehensive error handling
  server.on('error', (error) => {
    console.error('Server error:', error);
    if (error.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Try a different port or restart the Repl.`);
    }
  });
  
  // Handle process termination gracefully
  process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  });
  
  process.on('uncaughtException', (error) => {
    console.error('Uncaught exception:', error);
    // Keep the server running despite uncaught exceptions
  });
  
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Keep the server running despite unhandled promise rejections
  });

  // Handle WebSocket upgrade events
  server.on('upgrade', (request, socket, head) => {
    console.log('WebSocket upgrade request received');
  });

  // Return server for testing or further extension
  return server;
}

startServer().catch(console.error);
