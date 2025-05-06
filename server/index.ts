
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
  
  // Import fs at the top level
  import * as fs from 'fs';
  
  // Create client/dist if it doesn't exist
  const clientDistPath = path.resolve(__dirname, "../client/dist");
  if (!fs.existsSync(clientDistPath)) {
    console.log(`Creating directory: ${clientDistPath}`);
    fs.mkdirSync(clientDistPath, { recursive: true });
  }
  
  // Create a simple index.html if it doesn't exist
  const indexHtmlPath = path.resolve(clientDistPath, "index.html");
  if (!fs.existsSync(indexHtmlPath)) {
    console.log(`Creating simple index.html in: ${indexHtmlPath}`);
    const simpleHtml = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Property Management System</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; color: #333; }
            .container { max-width: 1200px; margin: 0 auto; }
            header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 20px; border-bottom: 1px solid #eee; margin-bottom: 20px; }
            nav { display: flex; gap: 20px; }
            nav a { text-decoration: none; color: #0066cc; }
            main { min-height: 500px; }
            .card { border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .card-title { margin-top: 0; }
            button { background: #0066cc; color: white; border: none; padding: 10px 15px; border-radius: 4px; cursor: pointer; }
            button:hover { background: #0055aa; }
          </style>
        </head>
        <body>
          <div class="container">
            <header>
              <h1>Property Management System</h1>
              <nav>
                <a href="#">Dashboard</a>
                <a href="#">Properties</a>
                <a href="#">Tenants</a>
                <a href="#">Maintenance</a>
              </nav>
            </header>
            <main>
              <div class="card">
                <h2 class="card-title">Welcome to your Property Management System</h2>
                <p>The system is running in production mode with a simplified interface.</p>
                <p>This is a temporary page while the full application builds.</p>
                <button onclick="location.reload()">Refresh Page</button>
              </div>
            </main>
          </div>
        </body>
      </html>
    `;
    fs.writeFileSync(indexHtmlPath, simpleHtml.trim());
  }
  
  // Properly serve static files from client/dist
  console.log(`Serving static files from: ${clientDistPath}`);
  app.use(express.static(clientDistPath));
  
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
      // Try client/dist first, then client/public, then fallback to dist
      let indexPath = path.resolve(__dirname, "../client/dist/index.html");
      let publicPath = path.resolve(__dirname, "../client/public/index.html");
      let fallbackPath = path.resolve(__dirname, "../dist/index.html");
      
      console.log(`Production mode: Attempting to serve SPA from: ${indexPath} for route: ${req.originalUrl}`);
      console.log(`Current directory: ${__dirname}`);
      // Import fs at the top level to avoid require in the middle of code
      import * as fs from 'fs';
      
      console.log(`Available files in client: ${fs.existsSync(path.resolve(__dirname, "../client")) ? 
        fs.readdirSync(path.resolve(__dirname, "../client")).join(", ") : "client dir not found"}`);
      
      try {
        console.log(`Looking for index.html at paths:
          1. ${indexPath}
          2. ${publicPath}
          3. ${fallbackPath}`);
          
        // Always return the index.html we've created earlier
        // This ensures we always have a valid index.html to return
        const clientDistIndexPath = path.resolve(__dirname, "../client/dist/index.html");
        console.log(`Serving index.html from: ${clientDistIndexPath}`);
        return res.sendFile(clientDistIndexPath);
      } catch (error) {
        console.error('Error handling SPA route:', error);
        
        // Return a simple HTML response as ultimate fallback
        return res.status(200).send(`
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Property Management System</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; text-align: center; }
              .message { margin: 20px 0; }
              button { padding: 10px 20px; background: #3498db; color: white; border: none; cursor: pointer; }
            </style>
          </head>
          <body>
            <h1>Property Management System</h1>
            <div class="message">The application is starting up.</div>
            <p>Please wait a moment while the system initializes...</p>
            <a href="/"><button>Refresh Page</button></a>
          </body>
          </html>
        `);
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
