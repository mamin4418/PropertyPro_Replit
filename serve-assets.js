
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3333;

// First save/process any assets
require('./save-assets');

// Serve static files
app.use('/saved_assets', express.static(path.join(__dirname, 'saved_assets')));
app.use('/attached_assets', express.static(path.join(__dirname, 'attached_assets')));
app.use(express.static(__dirname));

// Main entry point
app.get('/', (req, res) => {
  const username = process.env.REPL_OWNER || '@mamin4418';
  const replUrl = `https://${process.env.REPL_SLUG}.${username}.repl.co`;

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Property Management System Assets</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
          }
          .card {
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 20px;
            margin-top: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .button {
            display: inline-block;
            background-color: #4CAF50;
            color: white;
            padding: 10px 20px;
            text-align: center;
            text-decoration: none;
            font-size: 16px;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 10px;
          }
          h1 {
            color: #333;
          }
          .file-list {
            list-style-type: none;
            padding: 0;
          }
          .file-list li {
            padding: 8px 0;
            border-bottom: 1px solid #eee;
          }
          .file-list a {
            color: #2563eb;
            text-decoration: none;
          }
          .file-list a:hover {
            text-decoration: underline;
          }
          .instructions {
            background-color: #f0f9ff;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #3b82f6;
          }
        </style>
      </head>
      <body>
        <h1>Property Management System Assets</h1>
        
        <div class="instructions">
          <h2>Access Instructions for ${username}</h2>
          <p>This server provides access to all assets from your Property Management System.</p>
          <p>Your assets are being served at: <a href="http://0.0.0.0:3333" target="_blank">http://0.0.0.0:3333</a></p>
          <p>If you're running this in Replit, you can access the server at: ${replUrl}</p>
        </div>

        <div class="card">
          <h2>Saved Assets</h2>
          <p>These are the assets that have been processed and saved for easy access:</p>
          ${listSavedAssets()}
        </div>

        <div class="card">
          <h2>Original Attached Assets</h2>
          <p>These are the original files from your attached_assets directory:</p>
          ${listAttachedAssets()}
        </div>

        <div class="card">
          <h2>Access Main Application</h2>
          <p>To access your Property Management System application:</p>
          <a href="${replUrl}" class="button" target="_blank">Open Application</a>
        </div>
      </body>
    </html>
  `);
});

function listSavedAssets() {
  const savedAssetsDir = path.join(__dirname, 'saved_assets');
  if (!fs.existsSync(savedAssetsDir)) {
    return '<p>No saved assets found. Try running save-assets.js first.</p>';
  }

  const files = fs.readdirSync(savedAssetsDir);
  if (files.length === 0) {
    return '<p>No saved assets found yet.</p>';
  }

  let html = '<ul class="file-list">';
  files.forEach(file => {
    html += `<li><a href="/saved_assets/${file}" target="_blank">${file}</a></li>`;
  });
  html += '</ul>';
  return html;
}

function listAttachedAssets() {
  const attachedAssetsDir = path.join(__dirname, 'attached_assets');
  if (!fs.existsSync(attachedAssetsDir)) {
    return '<p>No attached assets directory found.</p>';
  }

  const files = fs.readdirSync(attachedAssetsDir);
  if (files.length === 0) {
    return '<p>No attached assets found.</p>';
  }

  let html = '<ul class="file-list">';
  files.forEach(file => {
    html += `<li><a href="/attached_assets/${file}" target="_blank">${file}</a></li>`;
  });
  html += '</ul>';
  return html;
}

app.listen(port, '0.0.0.0', () => {
  console.log(`\n========== ASSET SERVER STARTED ==========`);
  console.log(`Asset server running at: http://0.0.0.0:${port}`);
  console.log(`Open this URL in your browser to view all assets`);
  console.log(`===========================================\n`);
});
