Skip to content
 
Search Gists
Search...
All gists
Back to GitHub
@mamin4418
mamin4418/PropertyPro_Specification_Grok.txt
Created 1 hour ago
Code
Revisions
1
Clone this repository at &lt;script src=&quot;https://gist.github.com/mamin4418/7b371bf19769f8c4565a84e714502620.js&quot;&gt;&lt;/script&gt;
<script src="https://gist.github.com/mamin4418/7b371bf19769f8c4565a84e714502620.js"></script>
PropertyPro_Specification_Grok.txt
Technical Specification for PropertyPro (PropManager) Application
•	Overview Purpose: PropManager is a full-stack web application for property and rental management, enabling property managers (admins) and tenants to manage properties, tenants, leases, payments, maintenance, vacancies, applications, financials, and documents. Target Users:
•	Admins/Property Managers: Manage properties, tenants, leases, payments, maintenance, vacancies, financials.
•	Tenants: Access a portal to view leases, make payments, submit maintenance requests, sign documents. Deployment Platform: Hosted on Replit with a public URL, using Node.js for backend and Vite for frontend builds.
•	System Architecture Type: Client-server, single-page application (SPA) with RESTful API backend. Components:
•	Frontend: React-based SPA with TypeScript, served via Express.js.
•	Backend: Express.js with TypeScript, connected to Neon PostgreSQL.
•	Database: Neon serverless PostgreSQL, managed via Drizzle ORM.
•	Build Tools: Vite (frontend), esbuild (backend).
•	Authentication: Passport.js with session-based authentication.
•	Styling: Tailwind CSS with Radix UI components.
•	Functional Requirements 3.1 Dashboard
•	Purpose: Admin overview with key metrics (properties, leases, payments).
•	Routes: /dashboard, / (redirects to /dashboard).
•	Features: Show stats (properties, tenants, revenue), quick links, charts (recharts).
3.2 Properties
•	Purpose: Manage property listings, units.
•	Routes: /properties, /add-property, /view-property/:id, /edit-property/:id, /manage-units/:id.
•	Features: CRUD for properties (name, address, units), unit management, link to vacancies/leases.
3.3 Tenants
•	Purpose: Manage tenant profiles.
•	Routes: /tenants, /add-tenant, /view-tenant/:id, /edit-tenant/:id.
•	Features: CRUD for tenants (name, contact, lease history), link to properties/leases.
3.4 Leases
•	Purpose: Manage lease agreements, templates.
•	Routes: /leases, /add-lease, /view-lease/:id, /edit-lease/:id, /generate-lease-template.
•	Features: CRUD for leases (tenant, property, terms), template generation.
3.5 Payments
•	Purpose: Track rent payments.
•	Routes: /payments, /add-payment, /view-payment/:id, /edit-payment/:id.
•	Features: Record payments (amount, date), track status, generate reports.
3.6 Maintenance
•	Purpose: Manage maintenance requests.
•	Routes: /maintenance, /add-maintenance, /view-maintenance/:id, /edit-maintenance/:id.
•	Features: CRUD for requests (description, property, status), assign to vendors.
3.7 Vacancies and Applications
•	Purpose: Manage vacant units, rental applications.
•	Routes: /vacancy-listing, /manage-vacancies, /create-vacancy, /view-vacancy/:id, /edit-vacancy/:id, /applications, /applications/new, /application-templates, /create-template.
•	Features: CRUD for vacancies (unit, rent), public listings, application submission (react-hook-form, zod), track status.
3.8 Leads and Contacts
•	Purpose: Manage prospective tenants, contacts.
•	Routes: /leads, /add-lead, /view-lead/:id, /edit-lead/:id, /contacts, /add-contact, /view-contact/:id, /edit-contact/:id.
•	Features: CRUD for contacts (name, email, type), lead fields (source, move-in date), link to inquiries.
3.9 Financials
•	Purpose: Manage mortgages, insurances, banking.
•	Routes: /mortgages, /mortgages/:propertyId, /add-mortgage, /view-mortgage/:id, /edit-mortgage/:id, /insurances, /insurances/:propertyId, /add-insurance, /view-insurance/:id, /edit-insurance/:id, /banking, /banking/accounts, /banking/accounts/add, /banking/accounts/:id, /banking/transactions, /banking/transactions/:id, /banking/reconciliation, /banking/transactions/rules.
•	Features: CRUD for mortgages (lender, amount), insurances (provider, premium), manage bank accounts, reconcile transactions.
3.10 Document Signing
•	Purpose: Create, send, sign documents (leases, contracts).
•	Routes: /document-signing, /create-document, /document-templates, /view-document/:id.
•	Features: Create HTML documents with signature fields, send to recipients, track status, UETA/ESIGN compliance.
3.11 Utilities and Inspections
•	Purpose: Manage utility accounts, bills, inspections.
•	Routes: /utilities, /add-utility-account, /property-inspections, /schedule-inspection.
•	Features: CRUD for utility accounts, track bills, schedule inspections, record findings.
3.12 Rent Management
•	Purpose: Manage rent charges, deposits, late fees.
•	Routes: /rent/charges, /rent/deposits, /rent/add-charge, /rent/late-fee-rules, /rent/late-fee-rules/new, /rent/export, /rent/roll.
•	Features: Record charges/deposits, automate late fees, generate rent roll, export data.
3.13 Tasks
•	Purpose: Manage property manager tasks.
•	Routes: /tasks, /tasks/add, /tasks/all.
•	Features: CRUD for tasks (title, due date), track status.
3.14 Authentication
•	Purpose: Secure access for admins, tenants.
•	Routes: /auth, /tenant-auth, /tenant-dashboard.
•	Features: Username/password auth (Passport.js), session management, role-based access.
3.15 Settings and Help
•	Purpose: Configure app, provide support.
•	Routes: /settings, /help-center, /documentation, /tutorial, /faq, /support.
•	Features: Configure themes, notifications, provide documentation/FAQs.
3.16 Vendors and Companies
•	Purpose: Manage vendor/company relationships.
•	Routes: /vendors, /add-vendor, /view-vendor/:id, /edit-vendor/:id, /companies, /add-company, /view-company/:id, /edit-company/:id.
•	Features: CRUD for vendors (services, contact), companies, link to maintenance.
3.17 Appliances
•	Purpose: Track appliances in properties.
•	Routes: /appliances, /add-appliance, /view-appliance/:id, /edit-appliance/:id.
•	Features: CRUD for appliances (type, brand), link to units, track maintenance.
•	Non-Functional Requirements
•	Performance: Page load <2s, API response <500ms (GET), <1s (POST/PUT/DELETE).
•	Scalability: Support 1,000 properties, 10,000 tenants.
•	Security: HTTPS, session auth, Zod validation, CORS headers.
•	Usability: Responsive design, accessible UI, light/dark themes.
•	Reliability: Neon DB backups, error handling with toasts.
•	Maintainability: TypeScript, modular code, documentation.
•	Technology Stack Frontend:
•	React 18.3.1, Wouter 3.3.5, Tanstack React Query 5.60.5, React Hook Form 7.55.0.
•	Tailwind CSS 3.4.17, Radix UI, Lucide React 0.503.0, Framer Motion 11.13.1.
•	Zustand 5.0.3, Zod 3.24.2, Vite 5.4.14. Backend:
•	Express.js 4.21.2, Neon PostgreSQL 0.10.4, Drizzle ORM 0.39.1.
•	Passport.js 0.7.0, Express Session 1.18.1, Dotenv 16.5.0, CORS 2.8.5, ws 8.18.0.
•	esbuild 0.25.0. Dev Tools: TypeScript 5.6.3, Node.js. Other: pdf-parse 1.1.1, Recharts 2.15.2, date-fns 3.6.0, Embla Carousel 8.6.0.
•	Database Schema
•	contacts: id (PK), firstName, lastName, email, phone, contactType, notes.
•	addresses: id (PK), street, city, state, zip, country.
•	contact_addresses: contactId (FK), addressId (FK), isPrimary.
•	rental_applications: id (PK), tenantId (FK), propertyId, unitId, status, submittedAt.
•	application_templates: id (PK), name, fields (JSON).
•	properties: id (PK), name, addressId (FK), type.
•	units: id (PK), propertyId (FK), unitNumber, rentAmount.
•	vacancies: id (PK), unitId (FK), propertyId (FK), title, description, rentAmount, availableFrom, status.
•	leases: id (PK), tenantId (FK), unitId (FK), startDate, endDate, rentAmount.
•	payments: id (PK), leaseId (FK), amount, date, status.
•	maintenance_requests: id (PK), propertyId, unitId, description, status, vendorId (FK).
•	appliances: id (PK), unitId (FK), type, brand, model.
•	insurances: id (PK), propertyId (FK), provider, policyNumber, premium.
•	mortgages: id (PK), propertyId (FK), lender, amount, interestRate.
•	utility_accounts: id (PK), propertyId, provider, accountNumber.
•	utility_bills: id (PK), utilityAccountId (FK), amount, dueDate, status.
•	inspections: id (PK), propertyId, type, scheduledDate, status.
•	documents: id (PK), title, type, content (HTML), status, sentDate, signedDate.
•	users: id (PK), username, password (hashed), role.
•	API Specification
•	Contacts: GET/POST/PUT/DELETE /api/contacts, GET /api/contacts/:id.
•	Leads: GET/POST /api/leads, POST /api/leads/inquiry.
•	Applications: GET/POST/PATCH/DELETE /api/applications, GET /api/applications/:id.
•	Vacancies: GET/POST/PUT/PATCH/DELETE /api/vacancies, GET /api/vacancies/:id.
•	Appliances: GET/POST/PUT/DELETE /api/appliances, GET /api/appliances/:id.
•	Insurances: GET/POST/PUT/DELETE /api/insurances, GET /api/insurances/:id.
•	Mortgages: GET/POST/PUT/DELETE /api/mortgages, GET /api/mortgages/:id.
•	Utilities: GET /api/utilities/accounts, GET /api/utilities/bills.
•	Inspections: GET /api/property-inspections/scheduled, GET /api/property-inspections/completed.
•	Documents: GET/POST /api/document-signing/documents, GET /api/document-signing/documents/:id, POST /api/document-signing/documents/:id/sign, GET /api/document-signing/templates.
•	Maintenance: GET/POST/PUT/DELETE /api/maintenance-requests, GET /api/maintenance-requests/:id.
•	Auth: POST /api/login, GET /api/profile. Headers: Content-Type: application/json, Access-Control-Allow-Origin: *, Authorization: session-based.
•	User Interface
•	Layout: Collapsible sidebar, header with user actions, dynamic main content.
•	Components: Radix UI (Accordion, Dialog, Toast), custom forms/tables, Lucide icons.
•	Themes: Light/dark modes (next-themes).
•	Responsive: Tailwind CSS, mobile-first.
•	Animations: Framer Motion.
•	Deployment
•	Platform: Replit.
•	Scripts: npm run dev (development), npm run build (Vite/esbuild), npm start (production).
•	Env Vars: PORT (3000), NODE_ENV, DATABASE_URL, JWT_SECRET.
•	Hosting: Replit temporary .replit.dev URL, production serves client/dist/index.html.
•	Development Guidelines
•	Folder Structure: /PropertyPro_Replit ├── /client/dist ├── /dist ├── /server (index.ts, routes.ts, seed-data.ts, seed-applications.ts, seed-features.ts) ├── /src │ ├── /components (/layout/Sidebar.tsx, Header.tsx, /ui) │ ├── /pages (Dashboard.tsx, Properties.tsx) │ ├── /context (ThemeProvider.tsx, AuthProvider.tsx) │ ├── /lib (queryClient.ts) │ ├── main.tsx, App.tsx, index.css ├── index.html ├── package.json, tsconfig.json, vite.config.ts, .env
•	Standards: TypeScript, REST conventions, Zod validation, functional React components.
•	Build: vite build (frontend), esbuild (backend).
•	Migrations: Drizzle Kit (npm run db:push).
•	Rebuilding in New Language
•	Frontend: Use Vue.js/Angular/Svelte, retain Tailwind or use Bootstrap, implement routing (React Router), data fetching (Axios).
•	Backend: Use Django REST/Spring Boot/FastAPI, ORM (SQLAlchemy/Hibernate), PostgreSQL, session auth (Django sessions).
•	Database: Reuse schema, migrate with SQL dumps.
•	API: Reimplement endpoints, retain CORS/security headers.
•	UI: Recreate sidebar/header/pages, retain responsive design/themes.
•	Troubleshooting
•	Replit URL: Inaccessible due to temporary URLs or dev mode redirects. Use Share link, NODE_ENV=production, or deploy to Vercel.
•	Build: Ensure client/dist (npm run build), check vite.config.ts.
•	Seeding: Handle errors in seed-data.ts, seed-applications.ts, seed-features.ts, verify DATABASE_URL.
•	Additional Files
•	src/components/layout/Sidebar.tsx: Navigation.
•	src/pages/Dashboard.tsx: Dashboard UI.
•	server/seed-features.ts: Utility/inspection routes.
•	vite.config.ts: Vite config.
•	tsconfig.json: TypeScript settings.
•	server/seed-data.ts, server/seed-applications.ts: Seeding logic.
•	Implementation Plan (e.g., Python/FastAPI + React)
•	Setup: Initialize FastAPI + PostgreSQL, React + Vite + Tailwind.
•	Database: Define SQLAlchemy models, run migrations.
•	Backend: Implement API endpoints, use FastAPI Users for auth.
•	Frontend: Recreate routes with React Router, build components, integrate API with Axios.
•	Deployment: Backend to Render, frontend to Vercel, set env vars.
________________________________________
@mamin4418
Comment
 
Leave a comment
 
Footer
© 2025 GitHub, Inc.
Footer navigation
Terms
Privacy
Security
Status
Docs
Contact
Manage cookies
Do not share my personal information
