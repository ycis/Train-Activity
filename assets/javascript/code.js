  // Initialize Firebase

var localdbData = [];
  var config = {
    apiKey: "AIzaSyAVEDWjJkLA4JmMVsoffl2ZX3WT2n8cCBM",
    authDomain: "ycis-train-activity.firebaseapp.com",
    databaseURL: "https://ycis-train-activity.firebaseio.com",
    projectId: "ycis-train-activity",
    storageBucket: "",
    messagingSenderId: "564554897256"
};
firebase.initializeApp(config);
var database = firebase.database();

function addTrain(e) {
    var fields = $("#AdminForm").serializeArray();
    database.ref().push({
        name:fields[0].value,
        dest:fields[1].value,
        date:fields[2].value,
        freq:fields[3].value
    });
 }
 
 $(document).ready(function() {
    localdbData = [];
    $('#tDate').datetimepicker();
    $("#AdminForm").on("submit",addTrain);
    
    var timer = setInterval(fillTable,60000);
 })


 function add2Table(valArray) {
    var html = '';
    html += '<tr>';
    for(var i=0; i < valArray.length; i++) {
        html += '<td>' + valArray[i] + '</td>';
    };
    html += '</tr>';
    $('#train-table').append($(html));
}

function getFormRowArr(snapObj) {
    var nextArrival = moment(snapObj.date);
    while (moment().diff(nextArrival) > 0) {
        nextArrival.add(snapObj.freq,'m');
    }
    if(nextArrival.diff(moment(),"m") == 0) {
        var arrivalStr = "Now!!";
    } else if (moment().format("MM/DD/YYYY") == nextArrival.format("MM/DD/YYYY")) {
        arrivalStr = nextArrival.format("hh:mm A");
    } else {
        arrivalStr = nextArrival.format("MM/DD hh:mm A");
    }

    return [
        snapObj.name,
        snapObj.dest,
        snapObj.date,
        arrivalStr,
        "~" + (nextArrival.diff(moment(),"m")+1)
    ];
}

function fillTable(){
    console.log("Last Updated: " + moment().format("hh:mm A"));
    $('#train-table').empty();
    for(var i = 0; i < localdbData.length; i++) {
        add2Table(getFormRowArr(localdbData[i]));
    }
}
function popFromFB(childSnapshot,p) {
    localdbData.push(childSnapshot.val());
    fillTable();
}
function fbError(errorOutput) {
    console.log(errorOutput);
}
database.ref().on("child_added", popFromFB,fbError);
