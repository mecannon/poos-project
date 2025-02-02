<?php
	$inData = getRequestInfo();
	
	$userId = $inData["userId"];
	$contacts = $inData["contacts"];

	$firstName = $contacts["firstName"];
	$lastName = $contacts["lastName"];
	$phone = $contacts["phone"];
	$email = $contacts["email"];

	$conn = new mysqli("localhost", "appuser", "SecurePass123", "contact");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("INSERT into contacts (UserId,FirstName, LastName, Phone, Email) VALUES(?,?,?,?,?)");
		$stmt->bind_param("sssss", $userId, $firstName, $lastName, $phone, $email);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithError("");
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
