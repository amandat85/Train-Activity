$(document).ready(function () {

  function time() {
    setInterval(function () {
      var currentTime = moment();
      document.querySelector("#currentTime").innerHTML = moment(currentTime).format("HH:mm.ss");
    }, 1000);
  }
  time();

  //INITIALIZE FIREBASE==========================================================================================================
  var config = {
    apiKey: "AIzaSyC8iV50tAKbwEqhyt1W2eIUIpcVLrCjMzA",
    authDomain: "trainscheduler-3734a.firebaseapp.com",
    databaseURL: "https://trainscheduler-3734a.firebaseio.com",
    projectId: "trainscheduler-3734a",
    storageBucket: "trainscheduler-3734a.appspot.com",
    messagingSenderId: "1088544218827"
  };
  firebase.initializeApp(config);
  //VARIABLES=====================================================================================================================
  var database = firebase.database();

  //ON CLICK INPUT SUBMIT=========================================================================================================
  document.querySelector("#addTrain").addEventListener("click", function (event) {
    event.preventDefault();

    //EMPTY FIELDS ON SUBMIT
    if ($("#inputTrain").val().trim() === "" || $("#destination").val().trim() === "" || $("#firstTrain").val().trim() === "" || $("#frequency").val().trim() === "") {
    }
    else {
      //VARIABLES====================================================
      var trainAdded = document.querySelector("#inputTrain").value.trim();
      var destinationLocation = document.querySelector("#destination").value.trim();
      var startTimeMilitary = moment(document.querySelector("#firstTrain").value.trim(), "HH.mm").format();
      var frequencyMin = parseInt(document.querySelector("#frequency").value.trim());
      //CREATE TEMPORARY OBJECT FOR TRAIN DATA==============================================
      var newTrain = {
        train: trainAdded,
        destination: destinationLocation,
        startTime: startTimeMilitary,
        frequency: frequencyMin,
      };
      //PUSH TO DATABASE=================================================
      database.ref("/newTrain").push(newTrain);
    }
    //CLEAR FORM==========================================================
    document.getElementById("inputTrain").value = "";
    document.getElementById("destination").value = "";
    document.getElementById("firstTrain").value = "";
    document.getElementById("frequency").value = "";
  });

  database.ref("/newTrain").on("child_added", function(childSnapshot){
   
    var trainAdded = childSnapshot.val().train;
    var destinationLocation = childSnapshot.val().destination;
    var startTimeConverted = moment(childSnapshot.val().startTime, "HH:mm").subtract(1, "years");
    var frequencyMin = childSnapshot.val().frequency;

  //CALCULATE NEXT TRAIN TIME======================================
    var timeMin = moment().diff(moment(startTimeConverted), "minutes");

    var timeRemaining = timeMin % frequencyMin;

    var minToArrival = frequencyMin - timeRemaining;

    var nextTrain = moment().add(minToArrival, "minutes");

  //ADD NEW TRAIN TO TABLE========================================
  var newRow = document.createElement("tbody");
  newRow.setAttribute("class", "newInfo");
  
  var columnTrainName = document.createElement("td");
  columnTrainName.innerHTML = trainAdded;
  newRow.appendChild(columnTrainName);

  var columnDestination = document.createElement("td");
  columnDestination.innerHTML = destinationLocation;
 newRow.appendChild(columnDestination);

  var columnFrequency = document.createElement("td");
  columnFrequency.innerHTML = frequencyMin;
  newRow.appendChild(columnFrequency);

  var columnNextTrain = document.createElement("td");
  columnNextTrain.innerHTML = moment(nextTrain).format("LT");
  newRow.appendChild(columnNextTrain);

  var columnArrival = document.createElement("td");
  columnArrival.innerHTML = minToArrival;
  newRow.appendChild(columnArrival);

  document.querySelector("#trains").appendChild(newRow);

});


// setInterval(function(){
//   var counter = 10
//   counter--;

// }, 10000);
// function reloadRow() {
//   setInterval(function () {
//     document.querySelector(".newInfo")
//   }, 1000);
// }
// reloadRow();
  
  //Fix form validation
  //Add user ability to remove row
  //Reset page every 60 secs
  //error handler
  //add local storage


});
