
<?php
// Database configuration
define('DB_SERVER', 'localhost');
define('DB_USERNAME', 'root');
define('DB_PASSWORD', '');
define('DB_NAME', 'property_manager');

// Connect to MySQL database
$mysqli = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD);

// Check connection
if($mysqli === false) {
    die("ERROR: Could not connect. " . $mysqli->connect_error);
}

// Create database if it doesn't exist
$sql = "CREATE DATABASE IF NOT EXISTS " . DB_NAME;
if($mysqli->query($sql) === false) {
    die("ERROR: Could not create database. " . $mysqli->error);
}

// Select the database
$mysqli->select_db(DB_NAME);

// Return database connection
return $mysqli;
?>
