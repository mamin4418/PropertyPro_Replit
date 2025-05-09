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
import * as fs from 'fs';  // ✅ moved to top-level

dotenv.config();

const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function startServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  const clientDistPath = path.resolve(__dirname, "../client/dist");
  if (!fs.existsSync(clientDistPath)) {
    console.log(`Creating directory: ${clientDistPath}`);
    fs.mkdirSync(clientDistPath, { recursive: true });
  }

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

  console.log(`Serving static files from: ${clientDistPath}`);
  app.use(express.static(clientDistPath));

  const altStaticPath = path.resolve(__dirname, "../dist");
  console.log(`Also serving static files from: ${altStaticPath}`);
  app.use(express.static(altStaticPath));

  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });

  app.use((req, res, next) => {
    res.setHeader('Connection', 'upgrade, keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

  const httpServer = await registerRoutes(app);
  setupUtilitiesAndInspectionsRoutes(app);

  try {
    seedDatabase();
    seedApplications();
    await seedUtilitiesAndInspections();
  } catch (error) {
    console.error("Error seeding data:", error);
  }

  if (process.env.NODE_ENV === "development") {
    await setupVite(app);
  }

  app.get("*", (req, res) => {
    if (req.url.startsWith('/api/')) {
      return res.status(404).json({ error: 'API endpoint not found' });
    }

    // Send the index.html file for client-side routing
    const clientDistIndexPath = path.resolve(__dirname, "../client/dist/index.html");
    console.log(`Attempting to serve SPA from: ${clientDistIndexPath} for route: ${req.originalUrl}`);
    
    try {
      if (fs.existsSync(clientDistIndexPath)) {
        return res.sendFile(clientDistIndexPath);
      } else {
        console.warn(`Index file not found at ${clientDistIndexPath}, creating a simple one`);
        // Serve a fallback page if the main index.html doesn't exist
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
            <div class="message">The application is being built...</div>
            <p>Please wait a moment or try refreshing the page.</p>
            <a href="/"><button>Refresh Page</button></a>
          </body>
          </html>
        `);
      }
    } catch (error) {
      console.error('Error handling SPA route:', error);
      return res.status(500).send('Server error while serving the application.');
    }
  });

  const server = httpServer || createServer(app);

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`\n======================================`);
    console.log(`Server started on port ${PORT}`);
    console.log(`Mode: ${process.env.NODE_ENV || "development"}`);

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

  server.on('error', (error) => {
    console.error('Server error:', error);
    if (error.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Try a different port or restart the Repl.`);
    }
  });

  process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  });

  process.on('uncaughtException', (error) => {
    console.error('Uncaught exception:', error);
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  });

  server.on('upgrade', (request, socket, head) => {
    console.log('WebSocket upgrade request received');
  });

  return server;
}

startServer().catch(console.error);
