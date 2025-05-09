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

  // Serve static files from client/dist
  const clientDistPath = path.resolve(__dirname, "../client/dist");
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Serving static files from: ${clientDistPath}`);
  console.log(`Server port: ${PORT}`);

  // Make sure the dist directory exists
  try {
    if (!fs.existsSync(clientDistPath)) {
      fs.mkdirSync(clientDistPath, { recursive: true });
      console.log(`Created client/dist directory`);
    }
    const distExists = fs.existsSync(clientDistPath);
    console.log(`Client dist directory exists: ${distExists}`);
    if (distExists) {
      const distFiles = fs.readdirSync(clientDistPath);
      console.log(`Files in dist directory: ${distFiles.join(', ')}`);
      
      // Check for index.html specifically
      const hasIndexHtml = distFiles.includes('index.html');
      console.log(`index.html exists in dist: ${hasIndexHtml}`);
      
      if (!hasIndexHtml) {
        console.warn("WARNING: index.html not found in client/dist. The client may not have been built properly.");
      }
    } else {
      console.warn("WARNING: client/dist directory does not exist. Please build the client application first.");
    }
  } catch (error) {
    console.error("Error checking dist directory:", error);
  }

  // First check if client/dist exists and log its contents for debugging
  try {
    const distExists = fs.existsSync(clientDistPath);
    console.log(`Client dist directory exists: ${distExists}`);
    if (distExists) {
      const distFiles = fs.readdirSync(clientDistPath);
      console.log(`Files in dist directory: ${distFiles.join(', ')}`);
      
      // Check for index.html specifically
      const hasIndexHtml = distFiles.includes('index.html');
      console.log(`index.html exists in dist: ${hasIndexHtml}`);
      
      if (hasIndexHtml) {
        console.log(`Found index.html in: ${path.join(clientDistPath, 'index.html')}`);
      } else {
        console.warn("WARNING: index.html not found in client/dist. The client may not have been built properly.");
      }
    } else {
      console.warn("WARNING: client/dist directory does not exist. Please build the client application first.");
    }
  } catch (error) {
    console.error("Error checking dist directory:", error);
  }

  // Configure static files with proper cache headers and MIME types
  app.use(express.static(clientDistPath, {
    etag: true,
    lastModified: true,
    maxAge: process.env.NODE_ENV === 'production' ? '1d' : 0,
    setHeaders: (res, filePath) => {
      // Set proper MIME types for common files
      if (filePath.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
      } else if (filePath.endsWith('.mjs')) {
        res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
      } else if (filePath.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css; charset=UTF-8');
      } else if (filePath.endsWith('.html')) {
        res.setHeader('Content-Type', 'text/html; charset=UTF-8');
      } else if (filePath.endsWith('.svg')) {
        res.setHeader('Content-Type', 'image/svg+xml');
      } else if (filePath.endsWith('.png')) {
        res.setHeader('Content-Type', 'image/png');
      } else if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) {
        res.setHeader('Content-Type', 'image/jpeg');
      } else if (filePath.endsWith('.json')) {
        res.setHeader('Content-Type', 'application/json; charset=UTF-8');
      } else if (filePath.endsWith('.woff2')) {
        res.setHeader('Content-Type', 'font/woff2');
      } else if (filePath.endsWith('.woff')) {
        res.setHeader('Content-Type', 'font/woff');
      } else if (filePath.endsWith('.ttf')) {
        res.setHeader('Content-Type', 'font/ttf');
      }
      
      // Don't cache HTML in development
      if (process.env.NODE_ENV !== 'production' && filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      }
    }
  }));

  // Specifically handle assets folder with proper cache headers
  app.use('/assets', express.static(path.join(clientDistPath, 'assets'), {
    etag: true,
    immutable: true,
    maxAge: '1y',
    setHeaders: (res, filePath) => {
      // Set proper content types for assets
      if (filePath.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
      } else if (filePath.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css; charset=UTF-8');
      } else if (filePath.endsWith('.svg')) {
        res.setHeader('Content-Type', 'image/svg+xml');
      }
      console.log(`Serving asset: ${filePath}`);
    }
  }));

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

  // API routes
  app.use('/api', (req, res, next) => {
    console.log(`API Request: ${req.method} ${req.url}`);
    next();
  });

  // Simple diagnostic endpoint
  app.get('/api/time', (req, res) => {
    res.json({ time: new Date().toISOString(), env: process.env.NODE_ENV });
  });

  // API routes
  app.use('/api', (req, res, next) => {
    console.log(`API Request: ${req.method} ${req.url}`);
    next();
  });

  // Simple diagnostic endpoint
  app.get('/api/time', (req, res) => {
    res.json({ time: new Date().toISOString(), env: process.env.NODE_ENV });
  });

  // Handle client-side routing - must be after API routes but before error handlers
  app.get('*', (req, res, next) => {
    // Skip API routes
    if (req.url.startsWith('/api/')) {
      return next();
    }

    console.log(`Client-side route requested: ${req.originalUrl}`);

    // Send the index.html file for client-side routing
    const clientDistIndexPath = path.resolve(clientDistPath, "index.html");
    console.log(`Attempting to serve SPA from: ${clientDistIndexPath}`);

    // Create a fallback index.html if it doesn't exist
    if (!fs.existsSync(clientDistIndexPath)) {
      console.log("Creating fallback index.html for client-side routing");
      try {
        // Create a simple fallback index.html
        const fallbackHTML = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Property Management System</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; text-align: center; max-width: 800px; margin: 0 auto; }
              .message { margin: 20px 0; padding: 15px; background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 5px; }
              .info { background-color: #cce5ff; border: 1px solid #b8daff; }
              h1 { color: #333; }
              button { padding: 10px 20px; background: #007bff; color: white; border: none; cursor: pointer; border-radius: 5px; }
              button:hover { background: #0069d9; }
              .instructions { text-align: left; background: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 20px; }
              .instructions code { background: #e9ecef; padding: 2px 5px; border-radius: 3px; }
            </style>
          </head>
          <body>
            <h1>Property Management System</h1>
            <div class="message">The client application needs to be built before viewing.</div>
            
            <div class="message info">
              <p><strong>Current Status:</strong> Server is running but client build is missing.</p>
              <p>Server Time: ${new Date().toLocaleString()}</p>
            </div>
            
            <button onclick="location.reload()">Refresh Page</button>
            
            <div class="instructions">
              <h3>How to fix:</h3>
              <ol>
                <li>Run the workflow named "Complete Build and Start" from the Run menu</li>
                <li>This will build the client app and restart the server</li>
                <li>After the build completes, refresh this page</li>
              </ol>
            </div>
          </body>
          </html>
        `;
        
        // Write the fallback HTML to the client/dist directory
        try {
          if (!fs.existsSync(clientDistPath)) {
            fs.mkdirSync(clientDistPath, { recursive: true });
            console.log(`Created client/dist directory`);
          }
          fs.writeFileSync(clientDistIndexPath, fallbackHTML);
          console.log(`Created fallback index.html at ${clientDistIndexPath}`);
          return res.sendFile(clientDistIndexPath);
        } catch (writeError) {
          console.error('Error creating fallback index.html:', writeError);
          return res.send(fallbackHTML);
        }
      }
    } catch (error) {
      console.error('Error handling SPA route:', error);
      return res.status(500).send('Server error while serving the application.');
    }
  });

  const server = httpServer || createServer(app);

  // Add error handler middleware
  app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred'
    });
  });

  // Start the server
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