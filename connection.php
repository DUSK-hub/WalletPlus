<?php
$conn = mysqli_connect('localhost','root','','WalletPlus');

if (!$conn) {
    die('Error'.mysqli_connect_error());
}else{
    // header('Location: test.php');  
}

if($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = $_POST['username'];
    $password = $_POST['password'];

    $sql = "SELECT `Username` FROM `users` WHERE Username = '$username';";
    $result = mysqli_query($conn, $sql);
    if ($username == $result) {
        echo "Login Successfully.";
        return;
    }

    $sql = "INSERT INTO `users` (`ID`, `Username`, `Password`) VALUES (NULL, '$username', '$password');";
    
    if ($result) {
        echo "New record created successfully";
    } else {
        echo "Error: " . $sql . "<br>" . mysqli_error($conn);
    }
}

