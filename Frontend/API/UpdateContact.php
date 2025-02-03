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
    $phone = $inData["phone"] ?? "";
    $email = $inData["email"] ?? "";
    $ID = $inData["ID"] ?? 0;

    $conn = new mysqli("localhost", "appuser", "SecurePass123", "contact");		
    if ($conn->connect_error) {
        returnWithError("error: Could not connect to database");
        exit();
    }

    $stmt = $conn->prepare("UPDATE contacts SET FirstName = ?, LastName = ?, Phone = ?, Email = ? WHERE ID = ?");
    $stmt->bind_param("ssssi", $firstName, $lastName, $phone, $email, $ID);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        sendResultInfoAsJson(["result" => "Finished Successfully"]);
    } else {
        sendResultInfoAsJson(["result" => "No records updated. ID may not exist."]);
    }

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
