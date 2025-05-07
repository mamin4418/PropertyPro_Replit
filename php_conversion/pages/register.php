
<div class="auth-page">
    <div class="auth-card">
        <div class="auth-logo">
            <div class="d-inline-flex align-items-center gap-2 mb-2">
                <div class="p-2 rounded bg-primary text-white fw-bold fs-4">
                    PM
                </div>
            </div>
            <h1 class="fs-4 fw-bold">Property Management System</h1>
            <p class="text-muted small">Create a new account</p>
        </div>
        
        <?php if (isset($_GET['error'])): ?>
            <div class="alert alert-danger" role="alert">
                <?php echo htmlspecialchars($_GET['error']); ?>
            </div>
        <?php endif; ?>
        
        <form action="api/register.php" method="post" class="needs-validation" novalidate>
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label for="first_name" class="form-label">First Name</label>
                    <input type="text" class="form-control" id="first_name" name="first_name" required>
                    <div class="invalid-feedback">
                        Please enter your first name.
                    </div>
                </div>
                
                <div class="col-md-6 mb-3">
                    <label for="last_name" class="form-label">Last Name</label>
                    <input type="text" class="form-control" id="last_name" name="last_name" required>
                    <div class="invalid-feedback">
                        Please enter your last name.
                    </div>
                </div>
            </div>
            
            <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input type="email" class="form-control" id="email" name="email" required>
                <div class="invalid-feedback">
                    Please enter a valid email address.
                </div>
            </div>
            
            <div class="mb-3">
                <label for="username" class="form-label">Username</label>
                <input type="text" class="form-control" id="username" name="username" required>
                <div class="invalid-feedback">
                    Please choose a username.
                </div>
            </div>
            
            <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input type="password" class="form-control" id="password" name="password" required minlength="8">
                <div class="invalid-feedback">
                    Password must be at least 8 characters long.
                </div>
            </div>
            
            <div class="mb-3">
                <label for="confirm_password" class="form-label">Confirm Password</label>
                <input type="password" class="form-control" id="confirm_password" name="confirm_password" required>
                <div class="invalid-feedback">
                    Passwords do not match.
                </div>
            </div>
            
            <div class="mb-3 form-check">
                <input type="checkbox" class="form-check-input" id="terms" name="terms" required>
                <label class="form-check-label" for="terms">I agree to the <a href="#" data-bs-toggle="modal" data-bs-target="#termsModal">Terms and Conditions</a></label>
                <div class="invalid-feedback">
                    You must agree to the terms and conditions.
                </div>
            </div>
            
            <button type="submit" class="btn btn-primary w-100">Register</button>
        </form>
        
        <hr>
        
        <div class="text-center">
            <p>Already have an account?</p>
            <a href="index.php?page=login" class="btn btn-outline-primary">Login</a>
        </div>
    </div>
</div>

<!-- Terms and Conditions Modal -->
<div class="modal fade" id="termsModal" tabindex="-1" aria-labelledby="termsModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="termsModalLabel">Terms and Conditions</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <h6>1. Acceptance of Terms</h6>
                <p>By registering for and using the Property Management System, you agree to be bound by these Terms and Conditions.</p>
                
                <h6>2. User Accounts</h6>
                <p>You are responsible for maintaining the confidentiality of your account information and password.</p>
                
                <h6>3. Privacy Policy</h6>
                <p>Your use of this system is also governed by our Privacy Policy, which is incorporated into these Terms by reference.</p>
                
                <h6>4. Data Security</h6>
                <p>You agree to ensure the security and confidentiality of all tenant, property, and financial data accessed through this system.</p>
                
                <h6>5. Limitation of Liability</h6>
                <p>The system is provided "as is" without warranties of any kind, either express or implied.</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal">I Understand</button>
            </div>
        </div>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirm_password');
    
    // Function to validate passwords match
    function validatePassword() {
        if (password.value !== confirmPassword.value) {
            confirmPassword.setCustomValidity('Passwords do not match.');
        } else {
            confirmPassword.setCustomValidity('');
        }
    }
    
    // Event listeners
    password.addEventListener('change', validatePassword);
    confirmPassword.addEventListener('keyup', validatePassword);
});
</script>
