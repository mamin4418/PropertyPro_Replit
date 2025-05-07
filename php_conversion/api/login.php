
<?php
session_start();

// Check if the form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get database connection
    $mysqli = require __DIR__ . '/../config/database.php';
    
    // Get form data
    $username = trim($_POST['username']);
    $password = $_POST['password'];
    $remember = isset($_POST['remember']) ? true : false;
    
    // Validate input
    if (empty($username) || empty($password)) {
        header("Location: ../index.php?page=login&error=Please provide username and password");
        exit;
    }
    
    // Prepare a select statement
    $sql = "SELECT id, username, password, first_name, last_name, email, role FROM users WHERE username = ?";
    
    if ($stmt = $mysqli->prepare($sql)) {
        // Bind variables to the prepared statement as parameters
        $stmt->bind_param("s", $username);
        
        // Attempt to execute the prepared statement
        if ($stmt->execute()) {
            // Store result
            $result = $stmt->get_result();
            
            // Check if username exists
            if ($result->num_rows == 1) {
                // Fetch the record
                $user = $result->fetch_assoc();
                
                // Verify password
                if (password_verify($password, $user['password'])) {
                    // Password is correct, start a new session
                    
                    // Store data in session variables
                    $_SESSION['user_id'] = $user['id'];
                    $_SESSION['username'] = $user['username'];
                    $_SESSION['first_name'] = $user['first_name'];
                    $_SESSION['last_name'] = $user['last_name'];
                    $_SESSION['email'] = $user['email'];
                    $_SESSION['user_role'] = $user['role'];
                    
                    // If remember me is checked, set cookies
                    if ($remember) {
                        $token = bin2hex(random_bytes(16));
                        
                        // Set cookies for 30 days
                        setcookie('remember_me', $token, time() + (86400 * 30), "/");
                        
                        // Store token in database
                        $stmt = $mysqli->prepare("UPDATE users SET remember_token = ? WHERE id = ?");
                        $stmt->bind_param("si", $token, $user['id']);
                        $stmt->execute();
                    }
                    
                    // Update last login time
                    $stmt = $mysqli->prepare("UPDATE users SET last_login = NOW() WHERE id = ?");
                    $stmt->bind_param("i", $user['id']);
                    $stmt->execute();
                    
                    // Redirect to dashboard
                    header("Location: ../index.php?page=dashboard");
                    exit;
                } else {
                    // Password is not valid
                    header("Location: ../index.php?page=login&error=invalid");
                    exit;
                }
            } else {
                // Username doesn't exist
                header("Location: ../index.php?page=login&error=invalid");
                exit;
            }
        } else {
            // If there was an error executing the statement
            header("Location: ../index.php?page=login&error=Database error");
            exit;
        }
        
        // Close statement
        $stmt->close();
    }
    
    // Close connection
    $mysqli->close();
}
?>
