<?php
session_start();

$host = "localhost";
$user = "root"; // Default XAMPP MySQL user
$pass = ""; // Default password is empty
$dbname = "saran";

// Connect to MySQL
$conn = new mysqli($host, $user, $pass, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get form data
$email = $_POST['Email'];
$password = $_POST['Password'];

// Prepare query to check credentials
$sql = "SELECT * FROM recepie WHERE Email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    
    // Verify password (assuming passwords are hashed)
    if (password_verify($password, $row['Password'])) {
        $_SESSION['Email'] = $Email;
        header("Location: dashboard.html"); // Redirect to dashboard
        exit();
    } else {
        echo "<script>alert('Invalid email or password!'); window.location.href='index.html';</script>";
    }
} else {
    echo "<script>alert('Invalid email or password!'); window.location.href='index.html';</script>";
}

$stmt->close();
$conn->close();
?>
