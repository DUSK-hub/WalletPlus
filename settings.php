<?php include "includes/header.php"; require "includes/db.php"; ?>

<h2>Settings</h2>

<form method="POST">
<label>Theme:</label><br>
<select name="theme">
<option value="light">Light</option>
<option value="dark">Dark</option>
</select><br><br>
<button name="save">Save</button>
</form>

<?php
if(isset($_POST['save'])){
    $theme=$_POST['theme'];
    $id=$_SESSION['user_id'];
    mysqli_query($conn,"UPDATE users SET theme='$theme' WHERE id=$id");
    $_SESSION['theme']=$theme;  // refresh UI instantly
    echo "<p style='color:green;'>Theme updated!</p>";
}
?>

<?php include "includes/footer.php"; ?>
