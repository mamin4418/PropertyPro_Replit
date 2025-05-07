
// Main JavaScript for Property Management System

document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Initialize popovers
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
    
    // Handle toast notifications
    var toastElList = [].slice.call(document.querySelectorAll('.toast'));
    var toastList = toastElList.map(function (toastEl) {
        return new bootstrap.Toast(toastEl, {
            autohide: true,
            delay: 5000
        });
    });
    
    toastList.forEach(toast => toast.show());
    
    // Dashboard charts (if on dashboard page)
    if (document.getElementById('rentCollectionChart')) {
        renderRentCollectionChart();
    }
    
    if (document.getElementById('occupancyChart')) {
        renderOccupancyChart();
    }
    
    if (document.getElementById('expenseChart')) {
        renderExpenseChart();
    }
    
    // Initialize datepickers
    var datePickerElements = document.querySelectorAll('.datepicker');
    if (datePickerElements.length > 0) {
        datePickerElements.forEach(function(element) {
            // This assumes you're using a library like Flatpickr or similar
            // flatpickr(element, {
            //     dateFormat: "Y-m-d",
            // });
        });
    }
    
    // Toggle sidebar on mobile
    var sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            document.querySelector('.sidebar').classList.toggle('show');
        });
    }
    
    // Form validation
    var forms = document.querySelectorAll('.needs-validation');
    Array.prototype.slice.call(forms).forEach(function(form) {
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    });
    
    // Property image upload preview
    var propertyImageUpload = document.getElementById('property-image-upload');
    if (propertyImageUpload) {
        propertyImageUpload.addEventListener('change', function(event) {
            var preview = document.getElementById('property-image-preview');
            preview.src = URL.createObjectURL(event.target.files[0]);
            preview.style.display = 'block';
        });
    }
    
    // Confirm delete modal
    var deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(function(button) {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            var deleteUrl = this.getAttribute('data-delete-url');
            var deleteItemName = this.getAttribute('data-item-name');
            
            var modal = document.getElementById('deleteConfirmModal');
            if (modal) {
                var modalBody = modal.querySelector('.modal-body');
                var confirmButton = modal.querySelector('.confirm-delete-btn');
                
                modalBody.textContent = 'Are you sure you want to delete ' + deleteItemName + '?';
                confirmButton.setAttribute('data-delete-url', deleteUrl);
                
                var modalInstance = new bootstrap.Modal(modal);
                modalInstance.show();
            } else {
                if (confirm('Are you sure you want to delete ' + deleteItemName + '?')) {
                    window.location.href = deleteUrl;
                }
            }
        });
    });
    
    var confirmDeleteBtn = document.querySelector('.confirm-delete-btn');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', function() {
            var deleteUrl = this.getAttribute('data-delete-url');
            window.location.href = deleteUrl;
        });
    }
});

// Chart rendering functions
function renderRentCollectionChart() {
    var ctx = document.getElementById('rentCollectionChart').getContext('2d');
    
    var chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Collected',
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                data: [12500, 13200, 12800, 14100, 13500, 15000]
            }, {
                label: 'Expected',
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                data: [15000, 15000, 15000, 15000, 15000, 15000]
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': $' + context.parsed.y.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

function renderOccupancyChart() {
    var ctx = document.getElementById('occupancyChart').getContext('2d');
    
    var chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Occupied', 'Vacant'],
            datasets: [{
                data: [85, 15],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(255, 99, 132, 0.7)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + '%';
                        }
                    }
                }
            }
        }
    });
}

function renderExpenseChart() {
    var ctx = document.getElementById('expenseChart').getContext('2d');
    
    var chart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Maintenance', 'Utilities', 'Insurance', 'Taxes', 'Other'],
            datasets: [{
                data: [30, 25, 15, 20, 10],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + '%';
                        }
                    }
                }
            }
        }
    });
}

// Document signature pad initialization
function initializeSignaturePad() {
    var canvas = document.getElementById('signatureCanvas');
    if (canvas) {
        var signaturePad = new SignaturePad(canvas, {
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            penColor: 'rgb(0, 0, 0)'
        });
        
        // Clear button
        var clearButton = document.getElementById('clearSignature');
        if (clearButton) {
            clearButton.addEventListener('click', function() {
                signaturePad.clear();
            });
        }
        
        // Save signature button
        var saveButton = document.getElementById('saveSignature');
        if (saveButton) {
            saveButton.addEventListener('click', function() {
                if (signaturePad.isEmpty()) {
                    alert('Please provide a signature first.');
                } else {
                    var dataURL = signaturePad.toDataURL();
                    document.getElementById('signatureData').value = dataURL;
                    document.getElementById('signatureForm').submit();
                }
            });
        }
    }
}
