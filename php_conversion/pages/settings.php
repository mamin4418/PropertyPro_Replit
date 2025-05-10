
<?php
require_once '../includes/header.php';
require_once '../models/Setting.php';

// Initialize Settings model
$settingModel = new Setting($mysqli);

// Process form submission
$success = '';
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Validate and sanitize inputs
    $company_name = isset($_POST['company_name']) ? trim($_POST['company_name']) : '';
    $site_title = isset($_POST['site_title']) ? trim($_POST['site_title']) : '';
    $default_theme = isset($_POST['default_theme']) ? trim($_POST['default_theme']) : '';
    $date_format = isset($_POST['date_format']) ? trim($_POST['date_format']) : '';
    $currency_symbol = isset($_POST['currency_symbol']) ? trim($_POST['currency_symbol']) : '$';
    $items_per_page = isset($_POST['items_per_page']) ? intval($_POST['items_per_page']) : 10;
    $timezone = isset($_POST['timezone']) ? trim($_POST['timezone']) : 'UTC';
    $email_notifications = isset($_POST['email_notifications']) ? 1 : 0;
    $maintenance_mode = isset($_POST['maintenance_mode']) ? 1 : 0;

    // Update settings
    $result = $settingModel->updateSettings([
        'company_name' => $company_name,
        'site_title' => $site_title,
        'default_theme' => $default_theme,
        'date_format' => $date_format,
        'currency_symbol' => $currency_symbol,
        'items_per_page' => $items_per_page,
        'timezone' => $timezone,
        'email_notifications' => $email_notifications,
        'maintenance_mode' => $maintenance_mode
    ]);

    if ($result) {
        $success = "Settings updated successfully";
    } else {
        $error = "Failed to update settings. Please try again.";
    }
}

// Get current settings
$settings = $settingModel->getAllSettings();
?>

<div class="container-fluid">
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 class="h3 mb-0 text-gray-800">System Settings</h1>
    </div>

    <?php if (!empty($success)): ?>
        <div class="alert alert-success" role="alert">
            <?php echo $success; ?>
        </div>
    <?php endif; ?>

    <?php if (!empty($error)): ?>
        <div class="alert alert-danger" role="alert">
            <?php echo $error; ?>
        </div>
    <?php endif; ?>

    <div class="row">
        <div class="col-lg-12">
            <div class="card shadow mb-4">
                <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                    <h6 class="m-0 font-weight-bold text-primary">System Configuration</h6>
                </div>
                <div class="card-body">
                    <ul class="nav nav-tabs" id="settingsTabs" role="tablist">
                        <li class="nav-item">
                            <a class="nav-link active" id="general-tab" data-toggle="tab" href="#general" role="tab" aria-controls="general" aria-selected="true">General</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" id="appearance-tab" data-toggle="tab" href="#appearance" role="tab" aria-controls="appearance" aria-selected="false">Appearance</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" id="notifications-tab" data-toggle="tab" href="#notifications" role="tab" aria-controls="notifications" aria-selected="false">Notifications</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" id="system-tab" data-toggle="tab" href="#system" role="tab" aria-controls="system" aria-selected="false">System</a>
                        </li>
                    </ul>
                    <div class="tab-content" id="settingsTabContent">
                        <div class="tab-pane fade show active p-3" id="general" role="tabpanel" aria-labelledby="general-tab">
                            <form method="POST" action="">
                                <div class="form-group">
                                    <label for="company_name">Company Name</label>
                                    <input type="text" class="form-control" id="company_name" name="company_name" value="<?php echo isset($settings['company_name']) ? $settings['company_name'] : ''; ?>">
                                </div>
                                <div class="form-group">
                                    <label for="site_title">Site Title</label>
                                    <input type="text" class="form-control" id="site_title" name="site_title" value="<?php echo isset($settings['site_title']) ? $settings['site_title'] : ''; ?>">
                                </div>
                                <div class="form-group">
                                    <label for="timezone">Timezone</label>
                                    <select class="form-control" id="timezone" name="timezone">
                                        <?php
                                        $timezones = DateTimeZone::listIdentifiers(DateTimeZone::ALL);
                                        $currentTimezone = isset($settings['timezone']) ? $settings['timezone'] : 'UTC';
                                        foreach ($timezones as $tz) {
                                            echo '<option value="' . $tz . '"' . ($currentTimezone == $tz ? ' selected' : '') . '>' . $tz . '</option>';
                                        }
                                        ?>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="date_format">Date Format</label>
                                    <select class="form-control" id="date_format" name="date_format">
                                        <?php
                                        $dateFormats = [
                                            'Y-m-d' => date('Y-m-d') . ' (YYYY-MM-DD)',
                                            'm/d/Y' => date('m/d/Y') . ' (MM/DD/YYYY)',
                                            'd/m/Y' => date('d/m/Y') . ' (DD/MM/YYYY)',
                                            'M j, Y' => date('M j, Y') . ' (Month Day, Year)',
                                            'F j, Y' => date('F j, Y') . ' (Full Month Day, Year)',
                                        ];
                                        $currentFormat = isset($settings['date_format']) ? $settings['date_format'] : 'Y-m-d';
                                        foreach ($dateFormats as $format => $example) {
                                            echo '<option value="' . $format . '"' . ($currentFormat == $format ? ' selected' : '') . '>' . $example . '</option>';
                                        }
                                        ?>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="currency_symbol">Currency Symbol</label>
                                    <input type="text" class="form-control" id="currency_symbol" name="currency_symbol" value="<?php echo isset($settings['currency_symbol']) ? $settings['currency_symbol'] : '$'; ?>">
                                </div>
                                <div class="form-group">
                                    <label for="items_per_page">Items Per Page</label>
                                    <select class="form-control" id="items_per_page" name="items_per_page">
                                        <?php
                                        $options = [10, 25, 50, 100];
                                        $currentValue = isset($settings['items_per_page']) ? (int)$settings['items_per_page'] : 10;
                                        foreach ($options as $option) {
                                            echo '<option value="' . $option . '"' . ($currentValue == $option ? ' selected' : '') . '>' . $option . '</option>';
                                        }
                                        ?>
                                    </select>
                                </div>
                                <button type="submit" class="btn btn-primary">Save General Settings</button>
                            </form>
                        </div>
                        <div class="tab-pane fade p-3" id="appearance" role="tabpanel" aria-labelledby="appearance-tab">
                            <form method="POST" action="">
                                <div class="form-group">
                                    <label for="default_theme">Default Theme</label>
                                    <select class="form-control" id="default_theme" name="default_theme">
                                        <?php
                                        $themes = [
                                            'default' => 'Default (Light)',
                                            'dark' => 'Dark Theme',
                                            'blue' => 'Blue Theme',
                                            'green' => 'Green Theme',
                                            'purple' => 'Purple Theme',
                                            'orange' => 'Orange Theme',
                                            'red' => 'Red Theme',
                                            'teal' => 'Teal Theme',
                                            'indigo' => 'Indigo Theme',
                                            'custom' => 'Custom Theme'
                                        ];
                                        $currentTheme = isset($settings['default_theme']) ? $settings['default_theme'] : 'default';
                                        foreach ($themes as $value => $label) {
                                            echo '<option value="' . $value . '"' . ($currentTheme == $value ? ' selected' : '') . '>' . $label . '</option>';
                                        }
                                        ?>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>Theme Preview</label>
                                    <div class="theme-preview mt-2 p-3 border rounded" id="themePreview">
                                        <h4>Theme Preview</h4>
                                        <p>This is how your selected theme will appear to users.</p>
                                        <button class="btn btn-primary mr-2">Primary Button</button>
                                        <button class="btn btn-secondary mr-2">Secondary Button</button>
                                        <button class="btn btn-success mr-2">Success Button</button>
                                        <button class="btn btn-danger">Danger Button</button>
                                    </div>
                                </div>
                                <button type="submit" class="btn btn-primary">Save Appearance Settings</button>
                            </form>
                        </div>
                        <div class="tab-pane fade p-3" id="notifications" role="tabpanel" aria-labelledby="notifications-tab">
                            <form method="POST" action="">
                                <div class="form-group">
                                    <div class="custom-control custom-switch">
                                        <input type="checkbox" class="custom-control-input" id="email_notifications" name="email_notifications" <?php echo (isset($settings['email_notifications']) && $settings['email_notifications'] == 1) ? 'checked' : ''; ?>>
                                        <label class="custom-control-label" for="email_notifications">Enable Email Notifications</label>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label>Notification Events</label>
                                    <div class="custom-control custom-checkbox">
                                        <input type="checkbox" class="custom-control-input" id="notify_new_tenant" name="notify_new_tenant" <?php echo (isset($settings['notify_new_tenant']) && $settings['notify_new_tenant'] == 1) ? 'checked' : ''; ?>>
                                        <label class="custom-control-label" for="notify_new_tenant">New Tenant Registration</label>
                                    </div>
                                    <div class="custom-control custom-checkbox">
                                        <input type="checkbox" class="custom-control-input" id="notify_maintenance" name="notify_maintenance" <?php echo (isset($settings['notify_maintenance']) && $settings['notify_maintenance'] == 1) ? 'checked' : ''; ?>>
                                        <label class="custom-control-label" for="notify_maintenance">New Maintenance Request</label>
                                    </div>
                                    <div class="custom-control custom-checkbox">
                                        <input type="checkbox" class="custom-control-input" id="notify_payment" name="notify_payment" <?php echo (isset($settings['notify_payment']) && $settings['notify_payment'] == 1) ? 'checked' : ''; ?>>
                                        <label class="custom-control-label" for="notify_payment">New Payment Received</label>
                                    </div>
                                    <div class="custom-control custom-checkbox">
                                        <input type="checkbox" class="custom-control-input" id="notify_lease_expiry" name="notify_lease_expiry" <?php echo (isset($settings['notify_lease_expiry']) && $settings['notify_lease_expiry'] == 1) ? 'checked' : ''; ?>>
                                        <label class="custom-control-label" for="notify_lease_expiry">Lease Expiration</label>
                                    </div>
                                </div>
                                <button type="submit" class="btn btn-primary">Save Notification Settings</button>
                            </form>
                        </div>
                        <div class="tab-pane fade p-3" id="system" role="tabpanel" aria-labelledby="system-tab">
                            <form method="POST" action="">
                                <div class="form-group">
                                    <div class="custom-control custom-switch">
                                        <input type="checkbox" class="custom-control-input" id="maintenance_mode" name="maintenance_mode" <?php echo (isset($settings['maintenance_mode']) && $settings['maintenance_mode'] == 1) ? 'checked' : ''; ?>>
                                        <label class="custom-control-label" for="maintenance_mode">Enable Maintenance Mode</label>
                                    </div>
                                    <small class="form-text text-muted">When enabled, only administrators can access the system.</small>
                                </div>
                                <div class="form-group">
                                    <label for="backup_frequency">Database Backup Frequency</label>
                                    <select class="form-control" id="backup_frequency" name="backup_frequency">
                                        <?php
                                        $frequencies = [
                                            'daily' => 'Daily',
                                            'weekly' => 'Weekly',
                                            'monthly' => 'Monthly',
                                            'manual' => 'Manual Only'
                                        ];
                                        $currentFrequency = isset($settings['backup_frequency']) ? $settings['backup_frequency'] : 'weekly';
                                        foreach ($frequencies as $value => $label) {
                                            echo '<option value="' . $value . '"' . ($currentFrequency == $value ? ' selected' : '') . '>' . $label . '</option>';
                                        }
                                        ?>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <button type="button" class="btn btn-warning" id="backupNow">Backup Database Now</button>
                                    <button type="button" class="btn btn-info ml-2" id="checkUpdates">Check for Updates</button>
                                </div>
                                <div class="form-group">
                                    <label>System Information</label>
                                    <div class="table-responsive">
                                        <table class="table table-bordered">
                                            <tbody>
                                                <tr>
                                                    <th>PHP Version</th>
                                                    <td><?php echo phpversion(); ?></td>
                                                </tr>
                                                <tr>
                                                    <th>MySQL Version</th>
                                                    <td><?php echo $mysqli->server_info; ?></td>
                                                </tr>
                                                <tr>
                                                    <th>Server Software</th>
                                                    <td><?php echo $_SERVER['SERVER_SOFTWARE']; ?></td>
                                                </tr>
                                                <tr>
                                                    <th>System Path</th>
                                                    <td><?php echo $_SERVER['DOCUMENT_ROOT']; ?></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <button type="submit" class="btn btn-primary">Save System Settings</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
    // Theme preview functionality
    document.getElementById('default_theme').addEventListener('change', function() {
        const themePreview = document.getElementById('themePreview');
        themePreview.className = 'theme-preview mt-2 p-3 border rounded theme-' + this.value;
    });

    // Backup button functionality
    document.getElementById('backupNow').addEventListener('click', function() {
        if (confirm('Are you sure you want to create a database backup now?')) {
            alert('Database backup initiated. This may take a few moments.');
            // Here you would add AJAX code to trigger the backup process
        }
    });

    // Check for updates functionality
    document.getElementById('checkUpdates').addEventListener('click', function() {
        alert('Checking for system updates...');
        // Here you would add AJAX code to check for updates
    });
</script>

<?php require_once '../includes/footer.php'; ?>
