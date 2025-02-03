<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }

    $inData = getRequestInfo();
    
    $searchResults = "";
    $searchCount = 0;

    $conn = new mysqli("localhost", "appuser", "SecurePass123", "contact");
    if ($conn->connect_error) {
        returnWithError($conn->connect_error);
    } else {
        $searchQuery = "%" . $inData["search"] . "%";
        $limit = isset($inData["limit"]) ? $inData["limit"] : 0; 


        if ($limit > 0) {
            $stmt = $conn->prepare("SELECT * FROM contacts WHERE (FirstName LIKE ? OR LastName LIKE ? OR Phone LIKE ? OR Email LIKE ?) AND UserID=? LIMIT ?");
            $stmt->bind_param("sssssi", $searchQuery, $searchQuery, $searchQuery, $searchQuery, $inData["userId"], $limit);
        } else {
            $stmt = $conn->prepare("SELECT * FROM contacts WHERE (FirstName LIKE ? OR LastName LIKE ? OR Phone LIKE ? OR Email LIKE ?) AND UserID=?");
            $stmt->bind_param("sssss", $searchQuery, $searchQuery, $searchQuery, $searchQuery, $inData["userId"]);
        }

        $stmt->execute();
        
        $result = $stmt->get_result();
        
        while ($row = $result->fetch_assoc()) {
            if ($searchCount > 0) {
                $searchResults .= ",";
            }
            $searchCount++;
            $searchResults .= '{"FirstName" : "' . $row["FirstName"] . '", "LastName" : "' . $row["LastName"] . '", "Phone" : "' . $row["Phone"] . '", "Email" : "' . $row["Email"] . '", "ID" : "' . $row["ID"] . '"}';
        }
        
        if ($searchCount == 0) {
            returnWithError("No Records Found");
        } else {
            returnWithInfo($searchResults);
        }
        
        $stmt->close();
        $conn->close();
    }

    function getRequestInfo() {
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson($obj) {
        header('Content-type: application/json');
        echo $obj;
    }

    function returnWithError($err) {
        $retValue = '{"id":0,"FirstName":"","LastName":"","error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }

    function returnWithInfo($searchResults) {
        $retValue = '{"results":[' . $searchResults . '],"error":""}';
        sendResultInfoAsJson($retValue);
    }
?>
