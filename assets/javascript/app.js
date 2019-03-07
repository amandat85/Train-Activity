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

    //VALIDATION FORM===========================================================
    if (document.querySelector("#inputTrain").value.trim() === "") {
      $("#alertTrain").addClass("show").css("display", "block");
      $("#closeModal").on("click", function () {
        $("#alertTrain").removeClass("show").css("display", "none");
      });
    }

    else if (document.querySelector("#destination").value.trim() === "") {
      $("#alertDestination").addClass("show").css("display", "block");
      $("#closeModalD").on("click", function () {
        $("#alertDestination").removeClass("show").css("display", "none");
        return;
      });
    }

    else if (document.querySelector("#firstTrain").value.trim() === "") {
      $("#alertMilitaryTime").addClass("show").css("display", "block");
      $("#closeModalMT").on("click", function () {
        $("#alertMilitaryTime").removeClass("show").css("display", "none");
        return;
      });

    }
    else if (document.querySelector("#frequency").value.trim() === "") {
      $("#alertFrequency").addClass("show").css("display", "block");
      $("#closeModalF").on("click", function () {
        $("#alertFrequency").removeClass("show").css("display", "none");
        return;
      });
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

  database.ref("/newTrain").on("child_added", function (childSnapshot) {

    var trainAdded = childSnapshot.val().train;
    var destinationLocation = childSnapshot.val().destination;
    var startTimeConverted = moment(childSnapshot.val().startTime, "HH:mm").subtract(1, "years");
    var frequencyMin = childSnapshot.val().frequency;
    var key = childSnapshot.key;

    //CALCULATE NEXT TRAIN TIME======================================
    var timeMin = moment().diff(moment(startTimeConverted), "minutes");

    var timeRemaining = timeMin % frequencyMin;

    var minToArrival = frequencyMin - timeRemaining;

    var nextTrain = moment().add(minToArrival, "minutes");

    //ADD NEW TRAIN TO TABLE========================================
    var newRow = document.createElement("tbody");
    newRow.setAttribute("class", "newInfo");

    var columnTrainName = document.createElement("td");
    columnTrainName.setAttribute("class", "text-center");
    columnTrainName.innerHTML = trainAdded;
    newRow.appendChild(columnTrainName);

    var columnDestination = document.createElement("td");
    columnDestination.setAttribute("class", "text-center");
    columnDestination.innerHTML = destinationLocation;
    newRow.appendChild(columnDestination);

    var columnFrequency = document.createElement("td");
    columnFrequency.setAttribute("class", "text-center");
    columnFrequency.innerHTML = frequencyMin;
    newRow.appendChild(columnFrequency);

    var columnNextTrain = document.createElement("td");
    columnNextTrain.setAttribute("class", "text-center");
    columnNextTrain.innerHTML = moment(nextTrain).format("LT");
    newRow.appendChild(columnNextTrain);

    var columnArrival = document.createElement("td");
    columnArrival.setAttribute("class", "text-center");
    columnArrival.innerHTML = minToArrival;
    newRow.appendChild(columnArrival);

    var columnRemove = document.createElement("td");
    columnRemove.setAttribute("class", "text-center");
    columnRemove.innerHTML = ("<button class='arrival btn btn-xs' data-key='" + key + "'>X</button>");
    newRow.appendChild(columnRemove);

    document.querySelector("#trains").appendChild(newRow);
  });

  $(document).on("click", ".arrival", function (event) {
    console.log(event);
    var keyRef = this.dataset.key;
    database.ref("/newTrain").child(keyRef).remove();
    window.location.reload();
  });

  setInterval(function () {
    window.location.reload();
  }, 60000);
});
