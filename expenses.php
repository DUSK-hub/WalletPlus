<?php include "includes/header.php"; ?>
<h2>Add Expense</h2>

<form method="POST">
<input name="title" placeholder="Title" required><br><br>
<input name="amount" type="number" step="0.01" placeholder="Amount" required><br><br>
<input name="category" placeholder="Category"><br><br>
<textarea name="notes" placeholder="Notes"></textarea><br><br>
<button name="save">Save Expense</button>
</form>

<?php
require "includes/db.php";
if(isset($_POST['save'])){
    $uid = $_SESSION['user_id'];
    $t = $_POST['title'];
    $a = $_POST['amount'];
    $c = $_POST['category'];
    $n = $_POST['notes'];

    mysqli_query($conn,"INSERT INTO expenses(user_id,title,amount,category,notes) 
                        VALUES('$uid','$t','$a','$c','$n')");
    echo "<p style='color:green;'>Expense Added!</p>";
}
?>

<?php include "includes/footer.php"; ?>
