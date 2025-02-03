<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }

    $inData = getRequestInfo();
    $login = $inData["login"] ?? "";
    $password = $inData["password"] ?? "";

    $conn = new mysqli("localhost", "appuser", "SecurePass123", "contact");  
    if ($conn->connect_error) {
        returnWithError("Database Connection Failed");
        exit();
    }

    // Fetch hashed password from database
    $stmt = $conn->prepare("SELECT ID, FirstName, LastName, Password FROM users WHERE Login=?");
    $stmt->bind_param("s", $login);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        
        if (password_verify($password, $row['Password'])) {
            returnWithInfo($row['FirstName'], $row['LastName'], $row['ID']);
        } else {
            returnWithError("Incorrect Password");
        }
    } else {
        returnWithError("No Records Found");
    }

    $stmt->close();
    $conn->close();

    function getRequestInfo() {
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson($obj) {
        header('Content-type: application/json');
        echo json_encode($obj);
    }

    function returnWithError($err) {
        sendResultInfoAsJson(["id" => 0, "firstName" => "", "lastName" => "", "error" => $err]);
    }

    function returnWithInfo($firstName, $lastName, $id) {
        sendResultInfoAsJson(["id" => $id, "firstName" => $firstName, "lastName" => $lastName, "error" => ""]);
    }
?>
