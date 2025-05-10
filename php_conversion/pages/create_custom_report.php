
<?php
require_once '../includes/header.php';
require_once '../models/Report.php';
require_once '../models/Property.php';
require_once '../models/Unit.php';
require_once '../models/Tenant.php';
require_once '../models/Payment.php';
require_once '../models/Maintenance.php';

// Initialize models
$reportModel = new Report($mysqli);
$propertyModel = new Property($mysqli);
$unitModel = new Unit($mysqli);
$tenantModel = new Tenant($mysqli);
$paymentModel = new Payment($mysqli);
$maintenanceModel = new Maintenance($mysqli);

// Get available data sources for reports
$dataSources = [
    'properties' => [
        'name' => 'Properties',
        'fields' => ['id', 'property_name', 'address', 'city', 'state', 'zip', 'purchase_price', 'purchase_date', 'status']
    ],
    'units' => [
        'name' => 'Units',
        'fields' => ['id', 'property_id', 'unit_number', 'bedrooms', 'bathrooms', 'square_feet', 'rent_amount', 'status']
    ],
    'tenants' => [
        'name' => 'Tenants',
        'fields' => ['id', 'first_name', 'last_name', 'email', 'phone', 'status']
    ],
    'leases' => [
        'name' => 'Leases',
        'fields' => ['id', 'property_id', 'unit_id', 'tenant_id', 'start_date', 'end_date', 'rent_amount', 'security_deposit', 'status']
    ],
    'payments' => [
        'name' => 'Payments',
        'fields' => ['id', 'lease_id', 'amount', 'payment_date', 'payment_method', 'payment_type', 'status']
    ],
    'maintenance' => [
        'name' => 'Maintenance Requests',
        'fields' => ['id', 'property_id', 'unit_id', 'title', 'description', 'priority', 'status', 'reported_date', 'completed_date']
    ]
];

// Get saved report templates
$reportTemplates = $reportModel->getReportTemplates();

// Process form submission
$success = '';
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Check if we're saving a report template
    if (isset($_POST['save_template'])) {
        $templateName = isset($_POST['template_name']) ? trim($_POST['template_name']) : '';
        $dataSource = isset($_POST['data_source']) ? $_POST['data_source'] : '';
        $selectedFields = isset($_POST['selected_fields']) ? $_POST['selected_fields'] : [];
        $filterField = isset($_POST['filter_field']) ? $_POST['filter_field'] : '';
        $filterOperator = isset($_POST['filter_operator']) ? $_POST['filter_operator'] : '';
        $filterValue = isset($_POST['filter_value']) ? $_POST['filter_value'] : '';
        $sortField = isset($_POST['sort_field']) ? $_POST['sort_field'] : '';
        $sortDirection = isset($_POST['sort_direction']) ? $_POST['sort_direction'] : 'ASC';
        
        // Validation
        if (empty($templateName)) {
            $error = "Please enter a template name";
        } elseif (empty($dataSource)) {
            $error = "Please select a data source";
        } elseif (empty($selectedFields)) {
            $error = "Please select at least one field";
        } else {
            // Save the template
            $templateData = [
                'data_source' => $dataSource,
                'fields' => $selectedFields,
                'filter' => [
                    'field' => $filterField,
                    'operator' => $filterOperator,
                    'value' => $filterValue
                ],
                'sort' => [
                    'field' => $sortField,
                    'direction' => $sortDirection
                ]
            ];
            
            $result = $reportModel->saveReportTemplate($templateName, json_encode($templateData));
            
            if ($result) {
                $success = "Report template saved successfully";
                // Refresh report templates
                $reportTemplates = $reportModel->getReportTemplates();
            } else {
                $error = "Failed to save report template";
            }
        }
    }
    // Check if we're generating a report
    elseif (isset($_POST['generate_report'])) {
        $reportTemplateId = isset($_POST['report_template_id']) ? intval($_POST['report_template_id']) : 0;
        $dataSource = isset($_POST['data_source']) ? $_POST['data_source'] : '';
        $selectedFields = isset($_POST['selected_fields']) ? $_POST['selected_fields'] : [];
        $filterField = isset($_POST['filter_field']) ? $_POST['filter_field'] : '';
        $filterOperator = isset($_POST['filter_operator']) ? $_POST['filter_operator'] : '';
        $filterValue = isset($_POST['filter_value']) ? $_POST['filter_value'] : '';
        $sortField = isset($_POST['sort_field']) ? $_POST['sort_field'] : '';
        $sortDirection = isset($_POST['sort_direction']) ? $_POST['sort_direction'] : 'ASC';
        
        // If using a template, load its settings
        if ($reportTemplateId > 0) {
            $template = $reportModel->getReportTemplateById($reportTemplateId);
            if ($template) {
                $templateData = json_decode($template['template_data'], true);
                $dataSource = $templateData['data_source'];
                $selectedFields = $templateData['fields'];
                $filterField = $templateData['filter']['field'];
                $filterOperator = $templateData['filter']['operator'];
                $filterValue = $templateData['filter']['value'];
                $sortField = $templateData['sort']['field'];
                $sortDirection = $templateData['sort']['direction'];
            }
        }
        
        // Validation
        if (empty($dataSource)) {
            $error = "Please select a data source";
        } elseif (empty($selectedFields)) {
            $error = "Please select at least one field";
        } else {
            // Generate report based on selected criteria
            $reportData = [];
            
            // Build query conditions
            $conditions = '';
            if (!empty($filterField) && !empty($filterOperator) && $filterValue !== '') {
                switch ($filterOperator) {
                    case 'equals':
                        $conditions = "$filterField = '$filterValue'";
                        break;
                    case 'contains':
                        $conditions = "$filterField LIKE '%$filterValue%'";
                        break;
                    case 'greater_than':
                        $conditions = "$filterField > '$filterValue'";
                        break;
                    case 'less_than':
                        $conditions = "$filterField < '$filterValue'";
                        break;
                    default:
                        break;
                }
            }
            
            // Build sort clause
            $sortClause = '';
            if (!empty($sortField)) {
                $sortClause = "ORDER BY $sortField $sortDirection";
            }
            
            // Get report data based on data source
            switch ($dataSource) {
                case 'properties':
                    $reportData = $propertyModel->getPropertiesReport($selectedFields, $conditions, $sortClause);
                    break;
                case 'units':
                    $reportData = $unitModel->getUnitsReport($selectedFields, $conditions, $sortClause);
                    break;
                case 'tenants':
                    $reportData = $tenantModel->getTenantsReport($selectedFields, $conditions, $sortClause);
                    break;
                case 'payments':
                    $reportData = $paymentModel->getPaymentsReport($selectedFields, $conditions, $sortClause);
                    break;
                case 'maintenance':
                    $reportData = $maintenanceModel->getMaintenanceReport($selectedFields, $conditions, $sortClause);
                    break;
                default:
                    $error = "Invalid data source selected";
                    break;
            }
        }
    }
}
?>

<div class="container-fluid">
    <h1 class="h3 mb-4 text-gray-800">Create Custom Report</h1>
    
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
                    <h6 class="m-0 font-weight-bold text-primary">Report Builder</h6>
                    <div class="dropdown no-arrow">
                        <a class="dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i class="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
                        </a>
                        <div class="dropdown-menu dropdown-menu-right shadow animated--fade-in" aria-labelledby="dropdownMenuLink">
                            <div class="dropdown-header">Report Actions:</div>
                            <a class="dropdown-item" href="#" data-toggle="modal" data-target="#saveTemplateModal"><i class="fas fa-save fa-sm fa-fw mr-2 text-gray-400"></i>Save as Template</a>
                            <a class="dropdown-item" href="#" data-toggle="modal" data-target="#loadTemplateModal"><i class="fas fa-folder-open fa-sm fa-fw mr-2 text-gray-400"></i>Load Template</a>
                            <div class="dropdown-divider"></div>
                            <a class="dropdown-item" href="report_dashboard.php"><i class="fas fa-chart-bar fa-sm fa-fw mr-2 text-gray-400"></i>Report Dashboard</a>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <form method="POST" action="">
                        <!-- Data Source Selection -->
                        <div class="form-group row">
                            <div class="col-md-6">
                                <label for="data_source">Data Source</label>
                                <select class="form-control" id="data_source" name="data_source" required>
                                    <option value="">Select Data Source</option>
                                    <?php foreach ($dataSources as $key => $source): ?>
                                    <option value="<?php echo $key; ?>" <?php echo (isset($_POST['data_source']) && $_POST['data_source'] == $key) ? 'selected' : ''; ?>>
                                        <?php echo $source['name']; ?>
                                    </option>
                                    <?php endforeach; ?>
                                </select>
                            </div>
                        </div>
                        
                        <!-- Field Selection -->
                        <div class="form-group">
                            <label>Select Fields</label>
                            <div id="fieldsContainer" class="border p-3 rounded">
                                <div class="row">
                                    <div class="col-12 mb-2">
                                        <div class="custom-control custom-checkbox">
                                            <input type="checkbox" class="custom-control-input" id="select-all-fields">
                                            <label class="custom-control-label" for="select-all-fields"><strong>Select All</strong></label>
                                        </div>
                                    </div>
                                    
                                    <?php foreach ($dataSources as $sourceKey => $source): ?>
                                    <div class="col-12 data-fields-group" id="fields-<?php echo $sourceKey; ?>" style="display: none;">
                                        <div class="row">
                                            <?php foreach ($source['fields'] as $field): ?>
                                            <div class="col-md-3 mb-2">
                                                <div class="custom-control custom-checkbox">
                                                    <input type="checkbox" class="custom-control-input field-checkbox" 
                                                           id="field-<?php echo $sourceKey; ?>-<?php echo $field; ?>" 
                                                           name="selected_fields[]" 
                                                           value="<?php echo $field; ?>"
                                                           <?php echo (isset($_POST['selected_fields']) && in_array($field, $_POST['selected_fields'])) ? 'checked' : ''; ?>>
                                                    <label class="custom-control-label" for="field-<?php echo $sourceKey; ?>-<?php echo $field; ?>"><?php echo ucwords(str_replace('_', ' ', $field)); ?></label>
                                                </div>
                                            </div>
                                            <?php endforeach; ?>
                                        </div>
                                    </div>
                                    <?php endforeach; ?>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Filtering -->
                        <div class="form-group">
                            <label>Filter Data (Optional)</label>
                            <div class="row">
                                <div class="col-md-4">
                                    <select class="form-control" id="filter_field" name="filter_field">
                                        <option value="">Select Field</option>
                                        <!-- Filter fields will be populated via JavaScript -->
                                    </select>
                                </div>
                                <div class="col-md-3">
                                    <select class="form-control" id="filter_operator" name="filter_operator">
                                        <option value="">Select Operator</option>
                                        <option value="equals" <?php echo (isset($_POST['filter_operator']) && $_POST['filter_operator'] == 'equals') ? 'selected' : ''; ?>>Equals</option>
                                        <option value="contains" <?php echo (isset($_POST['filter_operator']) && $_POST['filter_operator'] == 'contains') ? 'selected' : ''; ?>>Contains</option>
                                        <option value="greater_than" <?php echo (isset($_POST['filter_operator']) && $_POST['filter_operator'] == 'greater_than') ? 'selected' : ''; ?>>Greater Than</option>
                                        <option value="less_than" <?php echo (isset($_POST['filter_operator']) && $_POST['filter_operator'] == 'less_than') ? 'selected' : ''; ?>>Less Than</option>
                                    </select>
                                </div>
                                <div class="col-md-5">
                                    <input type="text" class="form-control" id="filter_value" name="filter_value" placeholder="Value" value="<?php echo isset($_POST['filter_value']) ? $_POST['filter_value'] : ''; ?>">
                                </div>
                            </div>
                        </div>
                        
                        <!-- Sorting -->
                        <div class="form-group">
                            <label>Sort Data (Optional)</label>
                            <div class="row">
                                <div class="col-md-6">
                                    <select class="form-control" id="sort_field" name="sort_field">
                                        <option value="">Select Field</option>
                                        <!-- Sort fields will be populated via JavaScript -->
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <select class="form-control" id="sort_direction" name="sort_direction">
                                        <option value="ASC" <?php echo (isset($_POST['sort_direction']) && $_POST['sort_direction'] == 'ASC') ? 'selected' : ''; ?>>Ascending</option>
                                        <option value="DESC" <?php echo (isset($_POST['sort_direction']) && $_POST['sort_direction'] == 'DESC') ? 'selected' : ''; ?>>Descending</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <button type="submit" name="generate_report" class="btn btn-primary">
                                <i class="fas fa-chart-pie"></i> Generate Report
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    
    <?php if (isset($_POST['generate_report']) && empty($error) && !empty($reportData)): ?>
    <div class="row">
        <div class="col-lg-12">
            <div class="card shadow mb-4">
                <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                    <h6 class="m-0 font-weight-bold text-primary">Report Results</h6>
                    <div class="dropdown no-arrow">
                        <a class="dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i class="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
                        </a>
                        <div class="dropdown-menu dropdown-menu-right shadow animated--fade-in" aria-labelledby="dropdownMenuLink">
                            <div class="dropdown-header">Export Options:</div>
                            <a class="dropdown-item" href="#" id="exportCsv"><i class="fas fa-file-csv fa-sm fa-fw mr-2 text-gray-400"></i>Export CSV</a>
                            <a class="dropdown-item" href="#" id="exportPdf"><i class="fas fa-file-pdf fa-sm fa-fw mr-2 text-gray-400"></i>Export PDF</a>
                            <a class="dropdown-item" href="#" id="printReport"><i class="fas fa-print fa-sm fa-fw mr-2 text-gray-400"></i>Print</a>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-bordered" id="reportTable" width="100%" cellspacing="0">
                            <thead>
                                <tr>
                                    <?php if (!empty($reportData) && count($reportData) > 0): ?>
                                        <?php foreach (array_keys($reportData[0]) as $key): ?>
                                            <th><?php echo ucwords(str_replace('_', ' ', $key)); ?></th>
                                        <?php endforeach; ?>
                                    <?php endif; ?>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($reportData as $row): ?>
                                    <tr>
                                        <?php foreach ($row as $value): ?>
                                            <td><?php echo $value; ?></td>
                                        <?php endforeach; ?>
                                    </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <?php endif; ?>
</div>

<!-- Save Template Modal -->
<div class="modal fade" id="saveTemplateModal" tabindex="-1" role="dialog" aria-labelledby="saveTemplateModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="saveTemplateModalLabel">Save Report Template</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <form method="POST" action="">
                <div class="modal-body">
                    <div class="form-group">
                        <label for="template_name">Template Name</label>
                        <input type="text" class="form-control" id="template_name" name="template_name" required>
                    </div>
                    <p class="text-muted">This will save your current report configuration for future use.</p>
                    
                    <!-- Hidden fields to carry over the current report configuration -->
                    <input type="hidden" name="data_source" id="save_data_source" value="">
                    <div id="save_selected_fields_container"></div>
                    <input type="hidden" name="filter_field" id="save_filter_field" value="">
                    <input type="hidden" name="filter_operator" id="save_filter_operator" value="">
                    <input type="hidden" name="filter_value" id="save_filter_value" value="">
                    <input type="hidden" name="sort_field" id="save_sort_field" value="">
                    <input type="hidden" name="sort_direction" id="save_sort_direction" value="">
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                    <button type="submit" name="save_template" class="btn btn-primary">Save Template</button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- Load Template Modal -->
<div class="modal fade" id="loadTemplateModal" tabindex="-1" role="dialog" aria-labelledby="loadTemplateModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="loadTemplateModalLabel">Load Report Template</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <form method="POST" action="">
                <div class="modal-body">
                    <div class="form-group">
                        <label for="report_template_id">Select Template</label>
                        <select class="form-control" id="report_template_id" name="report_template_id" required>
                            <option value="">Select a Template</option>
                            <?php foreach ($reportTemplates as $template): ?>
                            <option value="<?php echo $template['id']; ?>"><?php echo $template['template_name']; ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                    <button type="submit" name="generate_report" class="btn btn-primary">Load & Generate</button>
                </div>
            </form>
        </div>
    </div>
</div>

<script>
    document.addEventListener('DOMContentLoaded', function() {
        // Handle data source selection change
        const dataSourceSelect = document.getElementById('data_source');
        dataSourceSelect.addEventListener('change', function() {
            // Hide all field groups
            document.querySelectorAll('.data-fields-group').forEach(group => {
                group.style.display = 'none';
            });
            
            const selectedSource = this.value;
            if (selectedSource) {
                // Show fields for selected data source
                document.getElementById('fields-' + selectedSource).style.display = 'block';
                
                // Update filter and sort field dropdowns
                updateFieldDropdowns(selectedSource);
            }
        });
        
        // Initialize field groups on page load
        const initialDataSource = dataSourceSelect.value;
        if (initialDataSource) {
            document.getElementById('fields-' + initialDataSource).style.display = 'block';
            updateFieldDropdowns(initialDataSource);
        }
        
        // Select all fields functionality
        document.getElementById('select-all-fields').addEventListener('change', function() {
            const visibleGroup = document.querySelector('.data-fields-group[style="display: block;"]');
            if (visibleGroup) {
                const checkboxes = visibleGroup.querySelectorAll('.field-checkbox');
                checkboxes.forEach(checkbox => {
                    checkbox.checked = this.checked;
                });
            }
        });
        
        // Handle save template modal open
        document.querySelector('[data-target="#saveTemplateModal"]').addEventListener('click', function() {
            // Copy current form values to hidden fields in the save template form
            document.getElementById('save_data_source').value = document.getElementById('data_source').value;
            
            // Clear previous selected fields
            document.getElementById('save_selected_fields_container').innerHTML = '';
            
            // Copy selected fields
            const selectedFields = Array.from(document.querySelectorAll('input[name="selected_fields[]"]:checked'));
            selectedFields.forEach(field => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = 'selected_fields[]';
                input.value = field.value;
                document.getElementById('save_selected_fields_container').appendChild(input);
            });
            
            document.getElementById('save_filter_field').value = document.getElementById('filter_field').value;
            document.getElementById('save_filter_operator').value = document.getElementById('filter_operator').value;
            document.getElementById('save_filter_value').value = document.getElementById('filter_value').value;
            document.getElementById('save_sort_field').value = document.getElementById('sort_field').value;
            document.getElementById('save_sort_direction').value = document.getElementById('sort_direction').value;
        });
        
        // Export to CSV functionality
        document.getElementById('exportCsv').addEventListener('click', function(e) {
            e.preventDefault();
            exportTableToCSV('report_data.csv');
        });
        
        // Print functionality
        document.getElementById('printReport').addEventListener('click', function(e) {
            e.preventDefault();
            window.print();
        });
        
        // Function to update filter and sort field dropdowns
        function updateFieldDropdowns(dataSource) {
            // Get field checkboxes for the selected data source
            const fieldCheckboxes = document.querySelectorAll('#fields-' + dataSource + ' .field-checkbox');
            
            // Get filter and sort field dropdowns
            const filterFieldSelect = document.getElementById('filter_field');
            const sortFieldSelect = document.getElementById('sort_field');
            
            // Clear current options
            filterFieldSelect.innerHTML = '<option value="">Select Field</option>';
            sortFieldSelect.innerHTML = '<option value="">Select Field</option>';
            
            // Add new options based on the fields of the selected data source
            fieldCheckboxes.forEach(checkbox => {
                const fieldValue = checkbox.value;
                const fieldLabel = checkbox.nextElementSibling.textContent;
                
                // Add to filter field dropdown
                const filterOption = document.createElement('option');
                filterOption.value = fieldValue;
                filterOption.textContent = fieldLabel;
                filterFieldSelect.appendChild(filterOption);
                
                // Add to sort field dropdown
                const sortOption = document.createElement('option');
                sortOption.value = fieldValue;
                sortOption.textContent = fieldLabel;
                sortFieldSelect.appendChild(sortOption);
            });
        }
        
        // Function to export table to CSV
        function exportTableToCSV(filename) {
            const csv = [];
            const rows = document.querySelectorAll('#reportTable tr');
            
            for (let i = 0; i < rows.length; i++) {
                const row = [], cols = rows[i].querySelectorAll('td, th');
                
                for (let j = 0; j < cols.length; j++) {
                    // Escape double quotes with double quotes
                    let cellText = cols[j].innerText;
                    cellText = cellText.replace(/"/g, '""');
                    // Add quotes to contain any commas
                    row.push('"' + cellText + '"');
                }
                
                csv.push(row.join(','));
            }
            
            // Download CSV file
            downloadCSV(csv.join('\n'), filename);
        }
        
        function downloadCSV(csv, filename) {
            const csvFile = new Blob([csv], {type: 'text/csv'});
            const downloadLink = document.createElement('a');
            
            // Set file name
            downloadLink.download = filename;
            
            // Create a link to the file
            downloadLink.href = window.URL.createObjectURL(csvFile);
            
            // Hide the link
            downloadLink.style.display = 'none';
            
            // Add the link to the DOM
            document.body.appendChild(downloadLink);
            
            // Click the download link
            downloadLink.click();
            
            // Remove the link from the DOM
            document.body.removeChild(downloadLink);
        }
    });
</script>

<?php require_once '../includes/footer.php'; ?>
