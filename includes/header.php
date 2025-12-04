<?php require "auth.php"; ?>
<!DOCTYPE html>
<html>
<head>
<link rel="stylesheet" href="css/style.css">
</head>
<body class="<?=$_SESSION['theme'] ?? 'light'?>">
<nav>
<a href="home.php">Home</a>
<a href="expenses.php">Expenses</a>
<a href="history.php">History</a>
<a href="settings.php">Settings</a>
<a href="logout.php">Logout</a>
</nav>
<hr>
