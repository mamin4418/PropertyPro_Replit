
const fs = require('fs');
const path = require('path');

// Create directory for saved assets if it doesn't exist
const savedAssetsDir = path.join(__dirname, 'saved_assets');
if (!fs.existsSync(savedAssetsDir)) {
  fs.mkdirSync(savedAssetsDir);
}

// Function to copy files from attached_assets to saved_assets
function copyAttachedAssets() {
  const attachedAssetsDir = path.join(__dirname, 'attached_assets');
  
  if (!fs.existsSync(attachedAssetsDir)) {
    console.log('No attached_assets directory found');
    return;
  }
  
  // Get all files in the attached_assets directory
  const files = fs.readdirSync(attachedAssetsDir);
  
  if (files.length === 0) {
    console.log('No files found in attached_assets directory');
    return;
  }
  
  let copiedCount = 0;
  
  // Copy each file to the saved_assets directory
  files.forEach(file => {
    const sourcePath = path.join(attachedAssetsDir, file);
    const destPath = path.join(savedAssetsDir, file);
    
    // Check if the file is already in saved_assets
    if (!fs.existsSync(destPath)) {
      try {
        fs.copyFileSync(sourcePath, destPath);
        console.log(`Copied: ${file}`);
        copiedCount++;
      } catch (err) {
        console.error(`Error copying ${file}: ${err.message}`);
      }
    } else {
      console.log(`File already exists: ${file}`);
    }
  });
  
  console.log(`\nSummary: Copied ${copiedCount} files to saved_assets/`);
  console.log(`You can find all saved assets in the 'saved_assets' directory`);
}

// Copy all the assets
copyAttachedAssets();

// Create an HTML index page for easy viewing of assets
const createIndexPage = () => {
  // Make sure the directory exists
  if (!fs.existsSync(savedAssetsDir)) {
    fs.mkdirSync(savedAssetsDir, { recursive: true });
    console.log(`Created directory: ${savedAssetsDir}`);
  }
  
  const files = fs.existsSync(savedAssetsDir) ? fs.readdirSync(savedAssetsDir) : [];
  
  console.log(`Found ${files.length} saved assets to display in index`);
  
  let htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Property Management System Assets</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1 { color: #2563eb; }
    ul { list-style-type: none; padding: 0; }
    li { margin: 10px 0; padding: 10px; border: 1px solid #e5e7eb; border-radius: 4px; }
    a { color: #2563eb; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .type { font-size: 0.8em; color: #6b7280; margin-left: 10px; }
    .empty-state { text-align: center; padding: 30px; background: #f9fafb; border-radius: 8px; margin-top: 20px; }
    .instructions { background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6; }
  </style>
</head>
<body>
  <h1>Property Management System Assets</h1>
  <div class="instructions">
    <h3>Access Instructions for @mamin4418</h3>
    <p>This page shows all saved assets from your Property Management System. You can browse and download them below.</p>
    <p>Direct URL: <a href="http://0.0.0.0:3333" target="_blank">http://0.0.0.0:3333</a></p>
  </div>`;
  
  if (files.length === 0) {
    htmlContent += `
  <div class="empty-state">
    <h2>No assets found</h2>
    <p>No assets have been saved yet. If you expected to see files here, please check the 'attached_assets' directory.</p>
  </div>`;
  } else {
    htmlContent += `
  <p>Click on any file to view or download it</p>
  <ul>`;
    
    files.forEach(file => {
      const ext = path.extname(file).toLowerCase();
      let type = "Unknown";
      
      if (['.png', '.jpg', '.jpeg', '.gif'].includes(ext)) type = "Image";
      else if (['.html', '.htm'].includes(ext)) type = "HTML";
      else if (['.md'].includes(ext)) type = "Markdown";
      else if (['.docx', '.doc'].includes(ext)) type = "Word Document";
      else if (['.zip'].includes(ext)) type = "Archive";
      
      htmlContent += `
    <li>
      <a href="saved_assets/${file}" target="_blank">${file}</a>
      <span class="type">(${type})</span>
    </li>`;
    });
    
    htmlContent += `
  </ul>`;
  }
  
  htmlContent += `
</body>
</html>`;
  
  fs.writeFileSync(path.join(__dirname, 'assets-index.html'), htmlContent);
  console.log('Created assets-index.html for easy viewing of assets');
}

createIndexPage();
