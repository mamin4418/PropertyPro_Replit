
<nav id="sidebarMenu" class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
    <div class="position-sticky pt-3">
        <ul class="nav flex-column">
            <li class="nav-item">
                <a class="nav-link <?php echo $page === 'dashboard' ? 'active' : ''; ?>" href="index.php?page=dashboard">
                    <i class="fas fa-tachometer-alt me-2"></i>
                    Dashboard
                </a>
            </li>
            
            <!-- Properties Section -->
            <li class="nav-item">
                <a class="nav-link <?php echo in_array($page, ['properties', 'add_property', 'edit_property', 'view_property']) ? 'active' : ''; ?>" 
                   data-bs-toggle="collapse" href="#propertiesSubMenu">
                    <i class="fas fa-building me-2"></i>
                    Properties
                </a>
                <div class="collapse <?php echo in_array($page, ['properties', 'add_property', 'edit_property', 'view_property']) ? 'show' : ''; ?>" id="propertiesSubMenu">
                    <ul class="nav flex-column ms-3">
                        <li class="nav-item">
                            <a class="nav-link <?php echo $page === 'properties' ? 'active' : ''; ?>" href="index.php?page=properties">
                                All Properties
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link <?php echo $page === 'add_property' ? 'active' : ''; ?>" href="index.php?page=add_property">
                                Add Property
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link <?php echo $page === 'units' ? 'active' : ''; ?>" href="index.php?page=units">
                                Units
                            </a>
                        </li>
                    </ul>
                </div>
            </li>
            
            <!-- Tenants Section -->
            <li class="nav-item">
                <a class="nav-link <?php echo in_array($page, ['tenants', 'add_tenant', 'edit_tenant', 'view_tenant']) ? 'active' : ''; ?>" 
                   data-bs-toggle="collapse" href="#tenantsSubMenu">
                    <i class="fas fa-users me-2"></i>
                    Tenants
                </a>
                <div class="collapse <?php echo in_array($page, ['tenants', 'add_tenant', 'edit_tenant', 'view_tenant']) ? 'show' : ''; ?>" id="tenantsSubMenu">
                    <ul class="nav flex-column ms-3">
                        <li class="nav-item">
                            <a class="nav-link <?php echo $page === 'tenants' ? 'active' : ''; ?>" href="index.php?page=tenants">
                                All Tenants
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link <?php echo $page === 'add_tenant' ? 'active' : ''; ?>" href="index.php?page=add_tenant">
                                Add Tenant
                            </a>
                        </li>
                    </ul>
                </div>
            </li>
            
            <!-- Leases Section -->
            <li class="nav-item">
                <a class="nav-link <?php echo in_array($page, ['leases', 'add_lease', 'edit_lease', 'view_lease']) ? 'active' : ''; ?>" 
                   data-bs-toggle="collapse" href="#leasesSubMenu">
                    <i class="fas fa-file-contract me-2"></i>
                    Leases
                </a>
                <div class="collapse <?php echo in_array($page, ['leases', 'add_lease', 'edit_lease', 'view_lease']) ? 'show' : ''; ?>" id="leasesSubMenu">
                    <ul class="nav flex-column ms-3">
                        <li class="nav-item">
                            <a class="nav-link <?php echo $page === 'leases' ? 'active' : ''; ?>" href="index.php?page=leases">
                                All Leases
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link <?php echo $page === 'add_lease' ? 'active' : ''; ?>" href="index.php?page=add_lease">
                                Add Lease
                            </a>
                        </li>
                    </ul>
                </div>
            </li>
            
            <!-- Financial Section -->
            <li class="nav-item">
                <a class="nav-link <?php echo in_array($page, ['payments', 'add_payment', 'edit_payment', 'view_payment', 'mortgages', 'insurances']) ? 'active' : ''; ?>" 
                   data-bs-toggle="collapse" href="#financialSubMenu">
                    <i class="fas fa-dollar-sign me-2"></i>
                    Financial
                </a>
                <div class="collapse <?php echo in_array($page, ['payments', 'add_payment', 'edit_payment', 'view_payment', 'mortgages', 'insurances']) ? 'show' : ''; ?>" id="financialSubMenu">
                    <ul class="nav flex-column ms-3">
                        <li class="nav-item">
                            <a class="nav-link <?php echo $page === 'payments' ? 'active' : ''; ?>" href="index.php?page=payments">
                                Payments
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link <?php echo $page === 'mortgages' ? 'active' : ''; ?>" href="index.php?page=mortgages">
                                Mortgages
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link <?php echo $page === 'insurances' ? 'active' : ''; ?>" href="index.php?page=insurances">
                                Insurances
                            </a>
                        </li>
                    </ul>
                </div>
            </li>
            
            <!-- Maintenance Section -->
            <li class="nav-item">
                <a class="nav-link <?php echo in_array($page, ['maintenance', 'add_maintenance', 'edit_maintenance', 'view_maintenance']) ? 'active' : ''; ?>" 
                   data-bs-toggle="collapse" href="#maintenanceSubMenu">
                    <i class="fas fa-tools me-2"></i>
                    Maintenance
                </a>
                <div class="collapse <?php echo in_array($page, ['maintenance', 'add_maintenance', 'edit_maintenance', 'view_maintenance']) ? 'show' : ''; ?>" id="maintenanceSubMenu">
                    <ul class="nav flex-column ms-3">
                        <li class="nav-item">
                            <a class="nav-link <?php echo $page === 'maintenance' ? 'active' : ''; ?>" href="index.php?page=maintenance">
                                Requests
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link <?php echo $page === 'add_maintenance' ? 'active' : ''; ?>" href="index.php?page=add_maintenance">
                                Add Request
                            </a>
                        </li>
                    </ul>
                </div>
            </li>
            
            <!-- Utilities Section -->
            <li class="nav-item">
                <a class="nav-link <?php echo in_array($page, ['utilities', 'add_utility_account']) ? 'active' : ''; ?>" 
                   data-bs-toggle="collapse" href="#utilitiesSubMenu">
                    <i class="fas fa-bolt me-2"></i>
                    Utilities
                </a>
                <div class="collapse <?php echo in_array($page, ['utilities', 'add_utility_account']) ? 'show' : ''; ?>" id="utilitiesSubMenu">
                    <ul class="nav flex-column ms-3">
                        <li class="nav-item">
                            <a class="nav-link <?php echo $page === 'utilities' ? 'active' : ''; ?>" href="index.php?page=utilities">
                                Utility Accounts
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link <?php echo $page === 'add_utility_account' ? 'active' : ''; ?>" href="index.php?page=add_utility_account">
                                Add Account
                            </a>
                        </li>
                    </ul>
                </div>
            </li>
            
            <!-- Inspections Section -->
            <li class="nav-item">
                <a class="nav-link <?php echo in_array($page, ['property_inspections', 'schedule_inspection']) ? 'active' : ''; ?>" 
                   data-bs-toggle="collapse" href="#inspectionsSubMenu">
                    <i class="fas fa-clipboard-check me-2"></i>
                    Inspections
                </a>
                <div class="collapse <?php echo in_array($page, ['property_inspections', 'schedule_inspection']) ? 'show' : ''; ?>" id="inspectionsSubMenu">
                    <ul class="nav flex-column ms-3">
                        <li class="nav-item">
                            <a class="nav-link <?php echo $page === 'property_inspections' ? 'active' : ''; ?>" href="index.php?page=property_inspections">
                                All Inspections
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link <?php echo $page === 'schedule_inspection' ? 'active' : ''; ?>" href="index.php?page=schedule_inspection">
                                Schedule Inspection
                            </a>
                        </li>
                    </ul>
                </div>
            </li>
            
            <!-- Document Signing Section -->
            <li class="nav-item">
                <a class="nav-link <?php echo in_array($page, ['document_signing', 'create_document', 'document_templates']) ? 'active' : ''; ?>" 
                   data-bs-toggle="collapse" href="#documentsSubMenu">
                    <i class="fas fa-file-signature me-2"></i>
                    Documents
                </a>
                <div class="collapse <?php echo in_array($page, ['document_signing', 'create_document', 'document_templates']) ? 'show' : ''; ?>" id="documentsSubMenu">
                    <ul class="nav flex-column ms-3">
                        <li class="nav-item">
                            <a class="nav-link <?php echo $page === 'document_signing' ? 'active' : ''; ?>" href="index.php?page=document_signing">
                                Documents
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link <?php echo $page === 'create_document' ? 'active' : ''; ?>" href="index.php?page=create_document">
                                Create Document
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link <?php echo $page === 'document_templates' ? 'active' : ''; ?>" href="index.php?page=document_templates">
                                Templates
                            </a>
                        </li>
                    </ul>
                </div>
            </li>
            
            <!-- Vacancy Section -->
            <li class="nav-item">
                <a class="nav-link <?php echo in_array($page, ['vacancies', 'create_vacancy', 'applications']) ? 'active' : ''; ?>" 
                   data-bs-toggle="collapse" href="#vacanciesSubMenu">
                    <i class="fas fa-home me-2"></i>
                    Vacancies
                </a>
                <div class="collapse <?php echo in_array($page, ['vacancies', 'create_vacancy', 'applications']) ? 'show' : ''; ?>" id="vacanciesSubMenu">
                    <ul class="nav flex-column ms-3">
                        <li class="nav-item">
                            <a class="nav-link <?php echo $page === 'vacancies' ? 'active' : ''; ?>" href="index.php?page=vacancies">
                                Manage Vacancies
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link <?php echo $page === 'create_vacancy' ? 'active' : ''; ?>" href="index.php?page=create_vacancy">
                                Create Vacancy
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link <?php echo $page === 'applications' ? 'active' : ''; ?>" href="index.php?page=applications">
                                Applications
                            </a>
                        </li>
                    </ul>
                </div>
            </li>
            
            <!-- Leads and Contacts -->
            <li class="nav-item">
                <a class="nav-link <?php echo in_array($page, ['leads', 'contacts']) ? 'active' : ''; ?>" 
                   data-bs-toggle="collapse" href="#contactsSubMenu">
                    <i class="fas fa-address-book me-2"></i>
                    Contacts
                </a>
                <div class="collapse <?php echo in_array($page, ['leads', 'contacts']) ? 'show' : ''; ?>" id="contactsSubMenu">
                    <ul class="nav flex-column ms-3">
                        <li class="nav-item">
                            <a class="nav-link <?php echo $page === 'leads' ? 'active' : ''; ?>" href="index.php?page=leads">
                                Leads
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link <?php echo $page === 'contacts' ? 'active' : ''; ?>" href="index.php?page=contacts">
                                Contacts
                            </a>
                        </li>
                    </ul>
                </div>
            </li>
            
            <!-- Reports -->
            <li class="nav-item">
                <a class="nav-link <?php echo $page === 'reports' ? 'active' : ''; ?>" href="index.php?page=reports">
                    <i class="fas fa-chart-bar me-2"></i>
                    Reports
                </a>
            </li>
            
            <!-- Settings -->
            <li class="nav-item">
                <a class="nav-link <?php echo $page === 'settings' ? 'active' : ''; ?>" href="index.php?page=settings">
                    <i class="fas fa-cog me-2"></i>
                    Settings
                </a>
            </li>
            
            <!-- Help Center -->
            <li class="nav-item">
                <a class="nav-link <?php echo $page === 'help_center' ? 'active' : ''; ?>" href="index.php?page=help_center">
                    <i class="fas fa-question-circle me-2"></i>
                    Help Center
                </a>
            </li>
        </ul>
    </div>
</nav>
