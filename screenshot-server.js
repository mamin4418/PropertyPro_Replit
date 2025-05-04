
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3333;

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Screenshot Download</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
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
        </style>
      </head>
      <body>
        <h1>Property Management System Screenshots</h1>
        <div class="card">
          <h2>Screenshots Available</h2>
          <p>A ZIP file containing screenshots of all pages in the application is ready for download.</p>
          <a href="/download" class="button">Download Screenshots</a>
        </div>
      </body>
    </html>
  `);
});

app.get('/download', (req, res) => {
  const zipPath = path.join(__dirname, 'app-screenshots.zip');
  
  if (fs.existsSync(zipPath)) {
    res.download(zipPath);
  } else {
    res.status(404).send('Screenshots ZIP file not found. Please run the capture script first.');
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Screenshot server running at http://0.0.0.0:${port}`);
});
