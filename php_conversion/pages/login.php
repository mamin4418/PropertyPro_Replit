
<div class="auth-page">
    <div class="auth-card">
        <div class="auth-logo">
            <div class="d-inline-flex align-items-center gap-2 mb-2">
                <div class="p-2 rounded bg-primary text-white fw-bold fs-4">
                    PM
                </div>
            </div>
            <h1 class="fs-4 fw-bold">Property Management System</h1>
            <p class="text-muted small">Login for Property Owners & Managers</p>
        </div>
        
        <?php if (isset($_GET['error'])): ?>
            <div class="alert alert-danger" role="alert">
                <?php 
                    $error = htmlspecialchars($_GET['error']);
                    echo $error === 'invalid' ? 'Invalid username or password.' : $error;
                ?>
            </div>
        <?php endif; ?>
        
        <?php if (isset($_GET['registered'])): ?>
            <div class="alert alert-success" role="alert">
                Registration successful! You can now login.
            </div>
        <?php endif; ?>
        
        <?php if (isset($_GET['logout'])): ?>
            <div class="alert alert-info" role="alert">
                You have been logged out successfully.
            </div>
        <?php endif; ?>
        
        <form action="api/login.php" method="post" class="needs-validation" novalidate>
            <div class="mb-3">
                <label for="username" class="form-label">Username</label>
                <input type="text" class="form-control" id="username" name="username" required>
                <div class="invalid-feedback">
                    Please enter your username.
                </div>
            </div>
            
            <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input type="password" class="form-control" id="password" name="password" required>
                <div class="invalid-feedback">
                    Please enter your password.
                </div>
            </div>
            
            <div class="mb-3 form-check">
                <input type="checkbox" class="form-check-input" id="remember" name="remember">
                <label class="form-check-label" for="remember">Remember me</label>
            </div>
            
            <button type="submit" class="btn btn-primary w-100">Login</button>
        </form>
        
        <div class="mt-3 text-center">
            <a href="index.php?page=forgot_password" class="text-decoration-none">Forgot password?</a>
        </div>
        
        <hr>
        
        <div class="text-center">
            <p>Don't have an account?</p>
            <a href="index.php?page=register" class="btn btn-outline-primary">Register</a>
        </div>
    </div>
</div>
