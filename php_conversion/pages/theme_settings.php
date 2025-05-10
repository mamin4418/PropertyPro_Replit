
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
    $theme = isset($_POST['theme']) ? trim($_POST['theme']) : 'default';
    $primary_color = isset($_POST['primary_color']) ? trim($_POST['primary_color']) : '#4e73df';
    $secondary_color = isset($_POST['secondary_color']) ? trim($_POST['secondary_color']) : '#858796';
    $sidebar_bg = isset($_POST['sidebar_bg']) ? trim($_POST['sidebar_bg']) : '#4e73df';
    $sidebar_text = isset($_POST['sidebar_text']) ? trim($_POST['sidebar_text']) : '#ffffff';
    $header_bg = isset($_POST['header_bg']) ? trim($_POST['header_bg']) : '#ffffff';
    $header_text = isset($_POST['header_text']) ? trim($_POST['header_text']) : '#5a5c69';
    $footer_bg = isset($_POST['footer_bg']) ? trim($_POST['footer_bg']) : '#f8f9fc';
    $footer_text = isset($_POST['footer_text']) ? trim($_POST['footer_text']) : '#858796';
    $font_family = isset($_POST['font_family']) ? trim($_POST['font_family']) : 'Nunito';
    $font_size = isset($_POST['font_size']) ? trim($_POST['font_size']) : 'medium';
    $button_style = isset($_POST['button_style']) ? trim($_POST['button_style']) : 'rounded';
    $card_style = isset($_POST['card_style']) ? trim($_POST['card_style']) : 'shadow';
    $custom_css = isset($_POST['custom_css']) ? trim($_POST['custom_css']) : '';

    // Update theme settings
    $result = $settingModel->updateThemeSettings([
        'theme' => $theme,
        'primary_color' => $primary_color,
        'secondary_color' => $secondary_color,
        'sidebar_bg' => $sidebar_bg,
        'sidebar_text' => $sidebar_text,
        'header_bg' => $header_bg,
        'header_text' => $header_text,
        'footer_bg' => $footer_bg,
        'footer_text' => $footer_text,
        'font_family' => $font_family,
        'font_size' => $font_size,
        'button_style' => $button_style,
        'card_style' => $card_style,
        'custom_css' => $custom_css
    ]);

    if ($result) {
        $success = "Theme settings updated successfully";
    } else {
        $error = "Failed to update theme settings. Please try again.";
    }
}

// Get current theme settings
$theme_settings = $settingModel->getThemeSettings();
?>

<div class="container-fluid">
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 class="h3 mb-0 text-gray-800">Theme Settings</h1>
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
        <div class="col-lg-8">
            <div class="card shadow mb-4">
                <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                    <h6 class="m-0 font-weight-bold text-primary">Customize Theme</h6>
                </div>
                <div class="card-body">
                    <form method="POST" action="">
                        <div class="form-group">
                            <label for="theme">Select Theme</label>
                            <select class="form-control" id="theme" name="theme">
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
                                $currentTheme = isset($theme_settings['theme']) ? $theme_settings['theme'] : 'default';
                                foreach ($themes as $value => $label) {
                                    echo '<option value="' . $value . '"' . ($currentTheme == $value ? ' selected' : '') . '>' . $label . '</option>';
                                }
                                ?>
                            </select>
                        </div>

                        <div id="customThemeOptions" <?php echo ($currentTheme != 'custom') ? 'style="display:none;"' : ''; ?>>
                            <div class="form-row">
                                <div class="form-group col-md-6">
                                    <label for="primary_color">Primary Color</label>
                                    <div class="input-group">
                                        <input type="color" class="form-control" id="primary_color" name="primary_color" value="<?php echo isset($theme_settings['primary_color']) ? $theme_settings['primary_color'] : '#4e73df'; ?>" style="height: 38px;">
                                        <div class="input-group-append">
                                            <span class="input-group-text" id="primary_color_hex"><?php echo isset($theme_settings['primary_color']) ? $theme_settings['primary_color'] : '#4e73df'; ?></span>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group col-md-6">
                                    <label for="secondary_color">Secondary Color</label>
                                    <div class="input-group">
                                        <input type="color" class="form-control" id="secondary_color" name="secondary_color" value="<?php echo isset($theme_settings['secondary_color']) ? $theme_settings['secondary_color'] : '#858796'; ?>" style="height: 38px;">
                                        <div class="input-group-append">
                                            <span class="input-group-text" id="secondary_color_hex"><?php echo isset($theme_settings['secondary_color']) ? $theme_settings['secondary_color'] : '#858796'; ?></span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <h5 class="mt-4">Navigation</h5>
                            <div class="form-row">
                                <div class="form-group col-md-6">
                                    <label for="sidebar_bg">Sidebar Background</label>
                                    <div class="input-group">
                                        <input type="color" class="form-control" id="sidebar_bg" name="sidebar_bg" value="<?php echo isset($theme_settings['sidebar_bg']) ? $theme_settings['sidebar_bg'] : '#4e73df'; ?>" style="height: 38px;">
                                        <div class="input-group-append">
                                            <span class="input-group-text" id="sidebar_bg_hex"><?php echo isset($theme_settings['sidebar_bg']) ? $theme_settings['sidebar_bg'] : '#4e73df'; ?></span>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group col-md-6">
                                    <label for="sidebar_text">Sidebar Text</label>
                                    <div class="input-group">
                                        <input type="color" class="form-control" id="sidebar_text" name="sidebar_text" value="<?php echo isset($theme_settings['sidebar_text']) ? $theme_settings['sidebar_text'] : '#ffffff'; ?>" style="height: 38px;">
                                        <div class="input-group-append">
                                            <span class="input-group-text" id="sidebar_text_hex"><?php echo isset($theme_settings['sidebar_text']) ? $theme_settings['sidebar_text'] : '#ffffff'; ?></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group col-md-6">
                                    <label for="header_bg">Header Background</label>
                                    <div class="input-group">
                                        <input type="color" class="form-control" id="header_bg" name="header_bg" value="<?php echo isset($theme_settings['header_bg']) ? $theme_settings['header_bg'] : '#ffffff'; ?>" style="height: 38px;">
                                        <div class="input-group-append">
                                            <span class="input-group-text" id="header_bg_hex"><?php echo isset($theme_settings['header_bg']) ? $theme_settings['header_bg'] : '#ffffff'; ?></span>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group col-md-6">
                                    <label for="header_text">Header Text</label>
                                    <div class="input-group">
                                        <input type="color" class="form-control" id="header_text" name="header_text" value="<?php echo isset($theme_settings['header_text']) ? $theme_settings['header_text'] : '#5a5c69'; ?>" style="height: 38px;">
                                        <div class="input-group-append">
                                            <span class="input-group-text" id="header_text_hex"><?php echo isset($theme_settings['header_text']) ? $theme_settings['header_text'] : '#5a5c69'; ?></span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <h5 class="mt-4">Typography</h5>
                            <div class="form-row">
                                <div class="form-group col-md-6">
                                    <label for="font_family">Font Family</label>
                                    <select class="form-control" id="font_family" name="font_family">
                                        <?php
                                        $fonts = [
                                            'Nunito' => 'Nunito (Default)',
                                            'Roboto' => 'Roboto',
                                            'Open Sans' => 'Open Sans',
                                            'Lato' => 'Lato',
                                            'Montserrat' => 'Montserrat',
                                            'Source Sans Pro' => 'Source Sans Pro',
                                            'Raleway' => 'Raleway',
                                            'PT Sans' => 'PT Sans',
                                            'Arial' => 'Arial',
                                            'Helvetica' => 'Helvetica'
                                        ];
                                        $currentFont = isset($theme_settings['font_family']) ? $theme_settings['font_family'] : 'Nunito';
                                        foreach ($fonts as $value => $label) {
                                            echo '<option value="' . $value . '"' . ($currentFont == $value ? ' selected' : '') . '>' . $label . '</option>';
                                        }
                                        ?>
                                    </select>
                                </div>
                                <div class="form-group col-md-6">
                                    <label for="font_size">Font Size</label>
                                    <select class="form-control" id="font_size" name="font_size">
                                        <?php
                                        $sizes = [
                                            'small' => 'Small',
                                            'medium' => 'Medium (Default)',
                                            'large' => 'Large'
                                        ];
                                        $currentSize = isset($theme_settings['font_size']) ? $theme_settings['font_size'] : 'medium';
                                        foreach ($sizes as $value => $label) {
                                            echo '<option value="' . $value . '"' . ($currentSize == $value ? ' selected' : '') . '>' . $label . '</option>';
                                        }
                                        ?>
                                    </select>
                                </div>
                            </div>

                            <h5 class="mt-4">Components</h5>
                            <div class="form-row">
                                <div class="form-group col-md-6">
                                    <label for="button_style">Button Style</label>
                                    <select class="form-control" id="button_style" name="button_style">
                                        <?php
                                        $buttonStyles = [
                                            'rounded' => 'Rounded (Default)',
                                            'square' => 'Square',
                                            'pill' => 'Pill Shaped',
                                            'shadow' => 'With Shadow'
                                        ];
                                        $currentButtonStyle = isset($theme_settings['button_style']) ? $theme_settings['button_style'] : 'rounded';
                                        foreach ($buttonStyles as $value => $label) {
                                            echo '<option value="' . $value . '"' . ($currentButtonStyle == $value ? ' selected' : '') . '>' . $label . '</option>';
                                        }
                                        ?>
                                    </select>
                                </div>
                                <div class="form-group col-md-6">
                                    <label for="card_style">Card Style</label>
                                    <select class="form-control" id="card_style" name="card_style">
                                        <?php
                                        $cardStyles = [
                                            'shadow' => 'With Shadow (Default)',
                                            'border' => 'With Border',
                                            'flat' => 'Flat',
                                            'rounded' => 'Rounded Corners'
                                        ];
                                        $currentCardStyle = isset($theme_settings['card_style']) ? $theme_settings['card_style'] : 'shadow';
                                        foreach ($cardStyles as $value => $label) {
                                            echo '<option value="' . $value . '"' . ($currentCardStyle == $value ? ' selected' : '') . '>' . $label . '</option>';
                                        }
                                        ?>
                                    </select>
                                </div>
                            </div>

                            <div class="form-group mt-4">
                                <label for="custom_css">Custom CSS</label>
                                <textarea class="form-control" id="custom_css" name="custom_css" rows="6"><?php echo isset($theme_settings['custom_css']) ? $theme_settings['custom_css'] : ''; ?></textarea>
                                <small class="form-text text-muted">Add your custom CSS code here. Be careful as improper CSS can break the layout.</small>
                            </div>
                        </div>

                        <button type="submit" class="btn btn-primary mt-3">Save Theme Settings</button>
                        <button type="button" class="btn btn-secondary mt-3 ml-2" id="previewTheme">Preview</button>
                        <button type="button" class="btn btn-danger mt-3 ml-2" id="resetTheme">Reset to Default</button>
                    </form>
                </div>
            </div>
        </div>
        <div class="col-lg-4">
            <div class="card shadow mb-4">
                <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">Theme Preview</h6>
                </div>
                <div class="card-body">
                    <div id="themePreview" class="border rounded p-3">
                        <div class="preview-header" style="background-color: <?php echo isset($theme_settings['header_bg']) ? $theme_settings['header_bg'] : '#ffffff'; ?>; color: <?php echo isset($theme_settings['header_text']) ? $theme_settings['header_text'] : '#5a5c69'; ?>; padding: 10px; border-bottom: 1px solid #e3e6f0;">
                            <h5 style="margin: 0;">Header</h5>
                        </div>
                        <div class="d-flex">
                            <div class="preview-sidebar" style="background-color: <?php echo isset($theme_settings['sidebar_bg']) ? $theme_settings['sidebar_bg'] : '#4e73df'; ?>; color: <?php echo isset($theme_settings['sidebar_text']) ? $theme_settings['sidebar_text'] : '#ffffff'; ?>; width: 80px; padding: 10px;">
                                <div class="text-center">
                                    <i class="fas fa-home mb-2"></i>
                                    <p style="font-size: 10px; margin: 0;">Dashboard</p>
                                </div>
                                <div class="text-center mt-3">
                                    <i class="fas fa-building mb-2"></i>
                                    <p style="font-size: 10px; margin: 0;">Properties</p>
                                </div>
                            </div>
                            <div class="preview-content" style="flex-grow: 1; padding: 10px;">
                                <h5>Content Area</h5>
                                <div class="preview-card mb-3 p-2" style="border: 1px solid #e3e6f0; border-radius: 5px;">
                                    <h6>Sample Card</h6>
                                    <p style="font-size: 12px;">This is a sample content area to demonstrate the theme.</p>
                                </div>
                                <button class="preview-btn" style="background-color: <?php echo isset($theme_settings['primary_color']) ? $theme_settings['primary_color'] : '#4e73df'; ?>; color: white; border: none; padding: 5px 10px; border-radius: 4px; font-size: 12px;">Primary Button</button>
                                <button class="preview-btn ml-2" style="background-color: <?php echo isset($theme_settings['secondary_color']) ? $theme_settings['secondary_color'] : '#858796'; ?>; color: white; border: none; padding: 5px 10px; border-radius: 4px; font-size: 12px;">Secondary Button</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card shadow mb-4">
                <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">Theme Gallery</h6>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-6 mb-3">
                            <div class="theme-thumbnail default-theme p-2 border rounded text-center" data-theme="default">
                                <div style="height: 60px; background: linear-gradient(to right, #4e73df, #224abe);"></div>
                                <div class="mt-2">Default</div>
                            </div>
                        </div>
                        <div class="col-6 mb-3">
                            <div class="theme-thumbnail dark-theme p-2 border rounded text-center" data-theme="dark">
                                <div style="height: 60px; background: linear-gradient(to right, #5a5c69, #36394a);"></div>
                                <div class="mt-2">Dark</div>
                            </div>
                        </div>
                        <div class="col-6 mb-3">
                            <div class="theme-thumbnail blue-theme p-2 border rounded text-center" data-theme="blue">
                                <div style="height: 60px; background: linear-gradient(to right, #1cc88a, #13855c);"></div>
                                <div class="mt-2">Green</div>
                            </div>
                        </div>
                        <div class="col-6 mb-3">
                            <div class="theme-thumbnail purple-theme p-2 border rounded text-center" data-theme="purple">
                                <div style="height: 60px; background: linear-gradient(to right, #6f42c1, #4e2b89);"></div>
                                <div class="mt-2">Purple</div>
                            </div>
                        </div>
                        <div class="col-6 mb-3">
                            <div class="theme-thumbnail orange-theme p-2 border rounded text-center" data-theme="orange">
                                <div style="height: 60px; background: linear-gradient(to right, #fd7e14, #c25e02);"></div>
                                <div class="mt-2">Orange</div>
                            </div>
                        </div>
                        <div class="col-6 mb-3">
                            <div class="theme-thumbnail red-theme p-2 border rounded text-center" data-theme="red">
                                <div style="height: 60px; background: linear-gradient(to right, #e74a3b, #a52f26);"></div>
                                <div class="mt-2">Red</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
    // Show/hide custom theme options
    document.getElementById('theme').addEventListener('change', function() {
        const customOptions = document.getElementById('customThemeOptions');
        if (this.value === 'custom') {
            customOptions.style.display = 'block';
        } else {
            customOptions.style.display = 'none';
        }
    });

    // Update color input hex display
    const colorInputs = ['primary_color', 'secondary_color', 'sidebar_bg', 'sidebar_text', 'header_bg', 'header_text'];
    colorInputs.forEach(function(id) {
        document.getElementById(id).addEventListener('input', function() {
            document.getElementById(id + '_hex').textContent = this.value;
            updateThemePreview();
        });
    });

    // Theme gallery selection
    document.querySelectorAll('.theme-thumbnail').forEach(function(thumbnail) {
        thumbnail.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            document.getElementById('theme').value = theme;
            
            // Trigger the change event
            const event = new Event('change');
            document.getElementById('theme').dispatchEvent(event);
            
            // Apply preset colors based on theme
            if (theme === 'default') {
                setThemeColors('#4e73df', '#858796', '#4e73df', '#ffffff', '#ffffff', '#5a5c69');
            } else if (theme === 'dark') {
                setThemeColors('#5a5c69', '#858796', '#36394a', '#ffffff', '#2c2f3f', '#ffffff');
            } else if (theme === 'blue') {
                setThemeColors('#1cc88a', '#36b9cc', '#1cc88a', '#ffffff', '#ffffff', '#5a5c69');
            } else if (theme === 'purple') {
                setThemeColors('#6f42c1', '#6610f2', '#6f42c1', '#ffffff', '#ffffff', '#5a5c69');
            } else if (theme === 'orange') {
                setThemeColors('#fd7e14', '#f6c23e', '#fd7e14', '#ffffff', '#ffffff', '#5a5c69');
            } else if (theme === 'red') {
                setThemeColors('#e74a3b', '#e83e8c', '#e74a3b', '#ffffff', '#ffffff', '#5a5c69');
            }
            
            updateThemePreview();
        });
    });

    // Set theme colors helper function
    function setThemeColors(primary, secondary, sidebarBg, sidebarText, headerBg, headerText) {
        document.getElementById('primary_color').value = primary;
        document.getElementById('secondary_color').value = secondary;
        document.getElementById('sidebar_bg').value = sidebarBg;
        document.getElementById('sidebar_text').value = sidebarText;
        document.getElementById('header_bg').value = headerBg;
        document.getElementById('header_text').value = headerText;
        
        // Update hex displays
        document.getElementById('primary_color_hex').textContent = primary;
        document.getElementById('secondary_color_hex').textContent = secondary;
        document.getElementById('sidebar_bg_hex').textContent = sidebarBg;
        document.getElementById('sidebar_text_hex').textContent = sidebarText;
        document.getElementById('header_bg_hex').textContent = headerBg;
        document.getElementById('header_text_hex').textContent = headerText;
    }

    // Update theme preview
    function updateThemePreview() {
        const primary = document.getElementById('primary_color').value;
        const secondary = document.getElementById('secondary_color').value;
        const sidebarBg = document.getElementById('sidebar_bg').value;
        const sidebarText = document.getElementById('sidebar_text').value;
        const headerBg = document.getElementById('header_bg').value;
        const headerText = document.getElementById('header_text').value;
        
        // Update preview elements
        document.querySelector('.preview-header').style.backgroundColor = headerBg;
        document.querySelector('.preview-header').style.color = headerText;
        document.querySelector('.preview-sidebar').style.backgroundColor = sidebarBg;
        document.querySelector('.preview-sidebar').style.color = sidebarText;
        document.querySelectorAll('.preview-btn')[0].style.backgroundColor = primary;
        document.querySelectorAll('.preview-btn')[1].style.backgroundColor = secondary;
    }

    // Preview button functionality
    document.getElementById('previewTheme').addEventListener('click', function() {
        alert('This would apply the theme temporarily for preview. For now, refer to the theme preview panel.');
    });

    // Reset button functionality
    document.getElementById('resetTheme').addEventListener('click', function() {
        if (confirm('Are you sure you want to reset all theme settings to default?')) {
            document.getElementById('theme').value = 'default';
            setThemeColors('#4e73df', '#858796', '#4e73df', '#ffffff', '#ffffff', '#5a5c69');
            document.getElementById('font_family').value = 'Nunito';
            document.getElementById('font_size').value = 'medium';
            document.getElementById('button_style').value = 'rounded';
            document.getElementById('card_style').value = 'shadow';
            document.getElementById('custom_css').value = '';
            
            // Hide custom options
            document.getElementById('customThemeOptions').style.display = 'none';
            
            // Update preview
            updateThemePreview();
        }
    });

    // Initialize theme preview
    updateThemePreview();
</script>

<?php require_once '../includes/footer.php'; ?>
