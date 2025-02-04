<?php
$servername = "167.71.27.149"; 
$username = "root"; 
$password = "test1Test";
$dbname = "contact"; 

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
