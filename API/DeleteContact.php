<?php
    header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
	header("Access-Control-Allow-Headers: Content-Type, Authorization");
    $inData = getRequestInfo();

    $ID = $inData["ID"];

    $conn = new mysqli("localhost", "appuser", "SecurePass123", "contact");	
    if($conn->connect_error){
        returnWithError("error: Could not connect to database");
    }
    else{
        $stmt = $conn->prepare("DELETE FROM contacts WHERE ID = ?");
        $stmt->bind_param("i", $ID);
        $stmt->execute();
        sendResultInfoAsJson('{"result":"Finished Successfully"}');

        $stmt->close();
        $conn->close();
    }

    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson($obj)
    {
        header('Content-type: application/json');
        echo $obj;
    }

    function returnWithError($err)
    {
        $retValue = '{"result":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }
?>
