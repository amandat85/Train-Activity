//Initialize Firebase
var config = {
    apiKey: "AIzaSyC8iV50tAKbwEqhyt1W2eIUIpcVLrCjMzA",
    authDomain: "trainscheduler-3734a.firebaseapp.com",
    databaseURL: "https://trainscheduler-3734a.firebaseio.com",
    projectId: "trainscheduler-3734a",
    storageBucket: "trainscheduler-3734a.appspot.com",
    messagingSenderId: "1088544218827"
  };
  firebase.initializeApp(config);
//Create a variable to store Firebase database
var database = firebase.database();
//Create Variables for all input fields. 
//Use val().trim() to capture the input
//Create temporary object to hold train data - fields should match the variables from the input field
//Push this information to Firebase database
//Clear all the text boxes on submit
//Create the Firebase event to add the new train information. Take snapshot of the event -"child_added?"
//Format the time with moment.js to be military time
//Calculate (using moment.js function and math), the next train minutes using the frequency and first train value
//Push to database
//Create new rows and append input information
//Add user ability to remove row
//Reset page every 60 secs
//Set current time. Tell it to update every 60 secs

