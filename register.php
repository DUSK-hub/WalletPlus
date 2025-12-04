<?php
session_start();
require "includes/db.php";

if(isset($_POST['register'])){
    $username = $_POST['username'];
    $email = $_POST['email'];
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);

    mysqli_query($conn,"INSERT INTO users(username,email,password) VALUES('$username','$email','$password')");
    header("Location: index.php");
    exit;
}
?>

<form method="POST">
<h2>Register</h2>
<input name="username" placeholder="Username" required><br><br>
<input type="email" name="email" placeholder="Email" required><br><br>
<input type="password" name="password" placeholder="Password" required><br><br>
<button name="register">Sign Up</button>
<p><a href="index.php">Login</a></p>
</form>
