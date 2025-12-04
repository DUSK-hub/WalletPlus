<?php
$host = "localhost";
$user = "root";        // modify if needed
$pass = "";
$db   = "WalletPlus"; // your database name

$conn = mysqli_connect($host, $user, $pass, $db);

if(!$conn){
    die("Database connection failed: " . mysqli_connect_error());
}
?>
