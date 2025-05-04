
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');

// Create screenshots directory if it doesn't exist
const screenshotsDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

// Define all the routes to capture
const routes = [
  '/',
  '/properties',
  '/properties/add',
  '/tenants',
  '/tenants/add',
  '/leases',
  '/leases/add',
  '/maintenance',
  '/maintenance/add',
  '/vendors',
  '/appliances',
  '/companies',
  '/contacts',
  '/banking',
  '/banking/accounts',
  '/banking/transactions',
  '/documents',
  '/applications',
  '/settings',
  '/reports',
  '/help'
];

async function captureScreenshots() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  
  console.log('Starting screenshot capture...');
  
  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];
    const pageName = route === '/' ? 'dashboard' : route.replace(/\//g, '-').substring(1);
    const screenshotPath = path.join(screenshotsDir, `${pageName}.png`);
    
    try {
      console.log(`Capturing ${route}...`);
      await page.goto(`http://localhost:3000${route}`, { waitUntil: 'networkidle2', timeout: 60000 });
      
      // Wait a bit for any animations to complete
      await page.waitForTimeout(1000);
      
      // Take screenshot
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`Saved screenshot: ${screenshotPath}`);
    } catch (error) {
      console.error(`Error capturing ${route}:`, error.message);
    }
  }
  
  await browser.close();
  console.log('Screenshots captured, creating ZIP file...');
  
  // Create ZIP file
  const zip = new JSZip();
  const screenshotFiles = fs.readdirSync(screenshotsDir);
  
  screenshotFiles.forEach(file => {
    const filePath = path.join(screenshotsDir, file);
    const fileContent = fs.readFileSync(filePath);
    zip.file(file, fileContent);
  });
  
  zip.generateAsync({ type: 'nodebuffer' })
    .then(content => {
      const zipPath = path.join(__dirname, 'app-screenshots.zip');
      fs.writeFileSync(zipPath, content);
      console.log(`ZIP file created: ${zipPath}`);
    });
}

captureScreenshots().catch(console.error);
