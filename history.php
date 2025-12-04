<?php include "includes/header.php"; require "includes/db.php"; ?>
<h2>History</h2>

<table border="1" cellpadding="5">
<tr><th>Title</th><th>Amount</th><th>Category</th><th>Date</th></tr>

<?php
$uid=$_SESSION['user_id'];
$res=mysqli_query($conn,"SELECT * FROM expenses WHERE user_id='$uid' ORDER BY date DESC");
while($row=mysqli_fetch_assoc($res)){
    echo "<tr><td>{$row['title']}</td><td>{$row['amount']}</td><td>{$row['category']}</td><td>{$row['date']}</td></tr>";
}
?>
</table>

<?php include "includes/footer.php"; ?>
