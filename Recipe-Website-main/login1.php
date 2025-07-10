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
$email = $_POST['email'];
$password = $_POST['password']; // User input

// Prepare query to check credentials
$sql = "SELECT email, password FROM recepie WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    
    // Debugging: Print retrieved values
    echo "Entered Email: " . $email . "<br>";
    echo "Entered Password: " . $password . "<br>";
    echo "Stored Password: " . $row['password'] . "<br>";

    // Since passwords are not hashed, compare directly
    if ($password === $row['password']) {
        echo "Password Matched!";
        $_SESSION['email'] = $email;
        header("Location: dashboard.html"); // Redirect to dashboard
        exit();
    } else {
        echo "Invalid password!";
    }
} else {
    echo "Email not found!";
}

$stmt->close();
$conn->close();
?>
