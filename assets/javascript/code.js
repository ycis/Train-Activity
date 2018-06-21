  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAVEDWjJkLA4JmMVsoffl2ZX3WT2n8cCBM",
    authDomain: "ycis-train-activity.firebaseapp.com",
    databaseURL: "https://ycis-train-activity.firebaseio.com",
    projectId: "ycis-train-activity",
    storageBucket: "",
    messagingSenderId: "564554897256"
  };
  firebase.initializeApp(config);

 function TrainProto(name,dest,firstTime,freq) {
     this.name = name;
     this.dest = dest;
     this.firstTime = firstTime;
     this.frequency = freq;
 }
 function addTrain() {
     var trainObj = new TrainProto(
        $("#train-name").val().trim(),
        $("#dest").val().trim(),
        moment($("#first-time").val().trim(),'HH:mm'),
        $("#frequency").val().trim()
     )
     database.ref().push(trainObj);
 }
 
 $(document).ready(function() {
    intializeValidDate();
     $('#train-table').empty();
     $("#add-train").on("click",addTrain);
 })

 
 database.ref().on("child_added", 
     function(childSnapshot,prevChildKey) {
         var snapVal = childSnapshot.val();
         // console.log(childSnapshot.val()); 
         var empName = childSnapshot.val().name;
         var empRole = childSnapshot.val().role;
         var dateStart = new Date(childSnapshot.val().start);
         var monthlyRate = childSnapshot.val().rate;

         var firstTimePretty = "";
         var nextArrival = firstTimePretty; //calc next arrival time by looping until value > now

         add2Table([
            snapVal.name,
            snapVal.dest,
            snapVal.frequency,
            nextArrival, 
            minAway // nextArrival - now rounded to minute
        ]); 
 
     },
     function(errorOutput) {
         console.log(errorOutput);
     }
 );

 function intializeValidDate() {
    $('#trainForm').bootstrapValidator({
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            firstTime: {
                validators: {
                    date: {
                        format: 'HH:mm',
                        message: 'The value is not a valid date'
                    }
                }
            }
        }
    });
 }