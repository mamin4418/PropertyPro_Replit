<div class="sidebar">
    <div class="sidebar-header">
        <h3>Property Pro</h3>
    </div>
    <div class="sidebar-content">
        <ul class="nav flex-column">
            <li class="nav-item">
                <a class="nav-link <?php echo ($currentPage == 'dashboard') ? 'active' : ''; ?>" href="dashboard.php">
                    <i class="fas fa-tachometer-alt"></i> Dashboard
                </a>
            </li>

            <li class="nav-heading">Properties</li>
            <li class="nav-item">
                <a class="nav-link <?php echo ($currentPage == 'properties') ? 'active' : ''; ?>" href="properties.php">
                    <i class="fas fa-building"></i> Properties
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link <?php echo ($currentPage == 'add_property') ? 'active' : ''; ?>" href="add_property.php">
                    <i class="fas fa-plus-circle"></i> Add Property
                </a>
            </li>

            <li class="nav-heading">Tenants & Leases</li>
            <li class="nav-item">
                <a class="nav-link <?php echo ($currentPage == 'tenants') ? 'active' : ''; ?>" href="tenants.php">
                    <i class="fas fa-users"></i> Tenants
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link <?php echo ($currentPage == 'add_tenant') ? 'active' : ''; ?>" href="add_tenant.php">
                    <i class="fas fa-user-plus"></i> Add Tenant
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link <?php echo ($currentPage == 'leases') ? 'active' : ''; ?>" href="leases.php">
                    <i class="fas fa-file-contract"></i> Leases
                </a>
            </li>

            <li class="nav-heading">Maintenance</li>
            <li class="nav-item">
                <a class="nav-link <?php echo ($currentPage == 'maintenance') ? 'active' : ''; ?>" href="maintenance.php">
                    <i class="fas fa-tools"></i> Maintenance Requests
                </a>
            </li>

            <li class="nav-heading">Property Management</li>
            <li class="nav-item">
                <a class="nav-link <?php echo ($currentPage == 'inspections') ? 'active' : ''; ?>" href="inspections.php">
                    <i class="fas fa-clipboard-check"></i> Inspections
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link <?php echo ($currentPage == 'utilities') ? 'active' : ''; ?>" href="utilities.php">
                    <i class="fas fa-bolt"></i> Utilities
                </a>
            </li>

            <li class="nav-heading">Financial</li>
            <li class="nav-item">
                <a class="nav-link <?php echo ($currentPage == 'payments') ? 'active' : ''; ?>" href="payments.php">
                    <i class="fas fa-money-bill-wave"></i> Payments
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link <?php echo ($currentPage == 'expenses') ? 'active' : ''; ?>" href="expenses.php">
                    <i class="fas fa-file-invoice-dollar"></i> Expenses
                </a>
            </li>

            <li class="nav-heading">Reports & Documents</li>
            <li class="nav-item">
                <a class="nav-link <?php echo ($currentPage == 'reports') ? 'active' : ''; ?>" href="reports.php">
                    <i class="fas fa-chart-bar"></i> Reports
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link <?php echo ($currentPage == 'documents') ? 'active' : ''; ?>" href="documents.php">
                    <i class="fas fa-file-alt"></i> Documents
                </a>
            </li>

            <li class="nav-heading">Administration</li>
            <li class="nav-item">
                <a class="nav-link <?php echo ($currentPage == 'settings') ? 'active' : ''; ?>" href="settings.php">
                    <i class="fas fa-cog"></i> Settings
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="logout.php">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </a>
            </li>
        </ul>
    </div>
</div>