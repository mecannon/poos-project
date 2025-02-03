<?php
    header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
	header("Access-Control-Allow-Headers: Content-Type, Authorization");

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }
    
    $inData = getRequestInfo();

    $firstName = $inData["firstName"] ?? "";
    $lastName = $inData["lastName"] ?? "";
    $username = $inData["username"] ?? "";
    $password = $inData["password"] ?? "";

    $conn = new mysqli("localhost", "appuser", "SecurePass123", "contact");	
    if ($conn->connect_error) 
    {
        returnWithError($conn->connect_error);
        exit();
    }

    $stmt = $conn->prepare("SELECT * FROM users WHERE Login=?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) 
    {
        returnWithError("User Already Exists");
        exit();
    }

    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $conn->prepare("INSERT INTO users (FirstName, LastName, Login, Password) VALUES (?,?,?,?)");
    $stmt->bind_param("ssss", $firstName, $lastName, $username, $hashedPassword);
    $stmt->execute();

    sendResultInfoAsJson(["result" => "Finished Successfully"]);

    $stmt->close();
    $conn->close();

    function getRequestInfo() 
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson($obj) 
    {
        header('Content-type: application/json');
        echo json_encode($obj);
    }

    function returnWithError($err) 
    {
        sendResultInfoAsJson(["result" => $err]);
    }
?>
