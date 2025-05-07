
<?php
session_start();

// Unset all session variables
$_SESSION = [];

// Remove the cookies
if (isset($_COOKIE[session_name()])) {
    setcookie(session_name(), '', time() - 42000, '/');
}

// Remove remember me cookie
if (isset($_COOKIE['remember_me'])) {
    setcookie('remember_me', '', time() - 42000, '/');
}

// Destroy the session
session_destroy();

// Redirect to login page
header("Location: ../index.php?page=login&logout=true");
exit;
?>
