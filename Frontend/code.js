const urlBase = 'http://167.71.27.149/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

let please = 3;

function saveCookie() {
    let minutes = 20;
    let date = new Date();
    date.setTime(date.getTime() + minutes * 60 * 1000);

    document.cookie = `firstName=${encodeURIComponent(firstName)}; path=/; expires=${date.toUTCString()}`;
    document.cookie = `lastName=${encodeURIComponent(lastName)}; path=/; expires=${date.toUTCString()}`;
    document.cookie = `userId=${userId}; path=/; expires=${date.toUTCString()}`;

    console.log("Saved Cookie:", document.cookie);
}



function readCookie() {
    userId = -1;  // Default invalid value

    let cookies = document.cookie.split(";"); // Get all cookies

    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        let [key, value] = cookie.split("=");

        if (key === "firstName") {
            firstName = decodeURIComponent(value);
        } else if (key === "lastName") {
            lastName = decodeURIComponent(value);
        } else if (key === "userId") {
            userId = parseInt(value);  // Convert to number
        }
    }

    console.log("Read Cookie:", document.cookie);
    console.log("Extracted userId:", userId);

    // If userId is invalid, redirect to login
    if (isNaN(userId) || userId < 1) {
        console.log("Invalid userId, redirecting...");
        window.location.href = "index.html";
    }
}


function addContact() {
	readCookie();
	console.log("Extracted userId:", userId);
	
    let firstName = document.getElementById("contactTextFirst").value;
    let lastName = document.getElementById("contactTextLast").value;
    let phone = document.getElementById("contactTextNumber").value;
    let email = document.getElementById("contactTextEmail").value;
	//let userId = 10;

    // Check if all fields are filled
    if (!firstName || !lastName || !phone || !email) {
        document.getElementById("contactResult").innerHTML = "All fields are required.";
        return;
    }

    let tmp = {
		userId: userId,
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        email: email
         
    };

    let jsonPayload = JSON.stringify(tmp);
    let url = "http://167.71.27.149/LAMPAPI/AddContact.php";

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xhr.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let response = JSON.parse(xhr.responseText);

            if (response.error) {
                document.getElementById("contactResult").innerHTML = "Error: " + response.error;
            } else {
                document.getElementById("contactResult").innerHTML = "Contact added successfully!";
                // Optionally clear input fields
                document.getElementById("contactTextFirst").value = "";
                document.getElementById("contactTextLast").value = "";
                document.getElementById("contactTextNumber").value = "";
                document.getElementById("contactTextEmail").value = "";
            }
        }
    };

    xhr.send(jsonPayload);
}
function doLogin()
{

	console.log("Button clicked");
	userId = 0;
	firstName = "";
	lastName = "";



	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;

	
 	 //	var hash = md5( password );

	document.getElementById("loginResult").innerHTML = "";


	let tmp = {login:login,password:password};
  	//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	//let url = urlBase + '/Login.' + extension;
	let url = "http://167.71.27.149/LAMPAPI/Login.php"
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);

	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.onreadystatechange = function() 
		{
			
			if (this.readyState == 4 && this.status == 200) 
			{

				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;	
				console.log(userId);
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "contacts.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}




function doLogout()
{

	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

// function for handling Sign Up
function doSignup() {
	
	let firstName = document.getElementById("signupFirstname").value;
    let lastName = document.getElementById("signupLastname").value;	
	let username = document.getElementById("signupUsername").value;
    let password = document.getElementById("signupPassword").value;
    // Check if both fields are filled
    if (!username || !password || !firstName || !lastName) {
        document.getElementById("signupResult").innerHTML = "All the fields are required.";
        return;
    }

    let tmp = {
		firstName: firstName,
		lastName: lastName,
        username: username,
        password: password
    };

    let jsonPayload = JSON.stringify(tmp);
	let url = "http://167.71.27.149/LAMPAPI/Register.php"
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xhr.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let response = JSON.parse(xhr.responseText);

            if (response.error) {
                document.getElementById("signupResult").innerHTML = "Error: " + response.result;
            } else {
                document.getElementById("signupResult").innerHTML = "Account created successfully!";
                setTimeout(() => {
                    window.location.href = "index.html"; // Redirect to login page after success
                }, 2000);
            }
        }
    };

    xhr.send(jsonPayload); 
}

function displaySearchResults(results) {
    let resultContainer = document.getElementById("searchResult");

    if (!resultContainer) {
        console.error("Element with id='searchResult' not found!");
        return;
    }

    resultContainer.innerHTML = ""; // Clear previous results

    let table = document.createElement("table");
    table.border = "1";

    let headerRow = document.createElement("tr");
    headerRow.innerHTML = `
        <th>First Name</th>
        <th>Last Name</th>
        <th>Phone</th>
        <th>Email</th>
        <th>Actions</th>
    `;
    table.appendChild(headerRow);

    results.forEach(contact => {
        let row = document.createElement("tr");

        row.innerHTML = `
            <td>${contact.FirstName}</td>
            <td>${contact.LastName}</td>
            <td>${contact.Phone}</td>
            <td>${contact.Email}</td>
            <td>
                <button onclick="editContact(${contact.ID})">Edit</button>
                <button onclick="deleteContact(${contact.ID})">Delete</button>
            </td>
        `;

        table.appendChild(row);
    });

    resultContainer.appendChild(table);
}




function searchContacts() {
    readCookie(); // Ensure userId is set
    console.log(" Searching contacts for userId:", userId);

    let searchQuery = document.getElementById("searchText").value.trim();
    if (!searchQuery) {
        document.getElementById("searchResult").innerHTML = "Please enter a search term.";
        return;
    }

    let tmp = {
        userId: userId,
        search: searchQuery || "",
        limit: searchQuery ? undefined : 10
    };

    let jsonPayload = JSON.stringify(tmp);
    let url = "http://167.71.27.149/LAMPAPI/SearchContacts.php";

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let response = JSON.parse(xhr.responseText);
            console.log("Search Response:", response);

            if (response.error) {
                document.getElementById("searchResult").innerHTML = "Error: " + response.error;
            } else if (!response.results || response.results.length === 0) {
                document.getElementById("searchResult").innerHTML = "No contacts found.";
            } else {
                displaySearchResults(response.results);
            }
        }
    };

    xhr.send(jsonPayload);
}


function editContact(ID) {
    readCookie(); // Ensure userId is set

    let firstName = document.getElementById("contactTextFirst").value;
    let lastName = document.getElementById("contactTextLast").value;
    let phone = document.getElementById("contactTextNumber").value;
    let email = document.getElementById("contactTextEmail").value;

    // Check if all fields are filled
    if (!firstName || !lastName || !phone || !email) {
        document.getElementById("contactResult").innerHTML = "All fields are required.";
        return;
    }

    let tmp = {
        userId: userId,  // Set by readCookie()
        ID: ID,          // Contact ID (remains as ID)
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        email: email
    };

    let jsonPayload = JSON.stringify(tmp);
    let url = "http://167.71.27.149/LAMPAPI/UpdateContact.php";

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xhr.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 200) {
                let response = JSON.parse(xhr.responseText);

                if (response.result === "Finished Successfully") {
                    document.getElementById("contactResult").innerHTML = "Contact updated successfully!";
                } else {
                    document.getElementById("contactResult").innerHTML = "Error: " + response.result;
                }
            } else {
                document.getElementById("contactResult").innerHTML = "Error: Something went wrong.";
            }
        }
    };

    xhr.send(jsonPayload);
}

function deleteContact(Id) {
    if (!confirm("Are you sure you want to delete this contact?")) {
        return; 
    }

    let tmp = { ID: Id }; 
    let jsonPayload = JSON.stringify(tmp);
    let url = "http://167.71.27.149/LAMPAPI/DeleteContact.php"; 

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let response = JSON.parse(xhr.responseText);

            if (response.error) { 
                alert("Error deleting contact: " + response.error);
            } else {
                alert("Contact deleted!");
            }
        }
    };

    xhr.send(jsonPayload);
}

window.onload = function() {
    if (window.location.pathname.includes("contacts.html")) {
        searchContacts(); 
    }
}
