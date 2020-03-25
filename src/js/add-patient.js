firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
  .then(function() {
    email = "adeebnabdulsalam@gmail.com";
    password = "firebase";
    return firebase.auth().signInWithEmailAndPassword(email, password);
  })
  .catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
  });

var patRef=null;
  $('#add_patient').on("click", function(){
    console.log("clicked");
    if(( $('#name').val() ||  $('#hosp').val() || $('#id').val() || $('#p-id').val()) == ""){
       console.log("Enter patient data"); 
    }
    else{
        var name = $('#name').val();
        $('#name').attr("disabled", "disabled");
        var hosp = $('#hosp').val();
        $('#hosp').attr("disabled", "disabled");
        var patID = $('#id').val();
        $('#id').attr("disabled", "disabled");
        var parID = $('#p-id').val();
        $('#p-id').attr("disabled", "disabled");
        $('#add_patient').attr("disabled", "disabled");

        var patient = db.collection('patients');
        patient.where("patientID", "==", parID).get().then(function(snap){
                snap.forEach(function(doc){
                    if(doc.exists){
                        patient.add({
                            name: name,
                            hospital: hosp,
                            patientID: patID,
                            parentRef: db.doc('patients/'+doc.id)
                        }).then(function(docRef) {
                            console.log("Document written with ID: ", docRef.id);
                            patRef = docRef.id;
                            return patRef;
                        })
                        .catch(function(error) {
                            console.error("Error adding document: ", error);
                        });
                    }
                    else{
                        console.log("No such parent document with given patient ID:",parID); 
                    }
                });
        }).catch(function(error){
            console.log("Error querying the given parent ID"+error);
        });
    
    }
});
var locID = null;
$('#add_loc').click(function(){
    var locationsRef = db.collection('patients').doc(patRef).collection('location');

    var date = $('#dt').val();
    var jdate = new Date(date)
    var loc = $('#loc').val();
    var lat = $('#geopoint').data('lat');
    var lon = $('#geopoint').data('lon');
    console.log("date value: "+jdate+" type:"+typeof jdate);
    if($('#e').is(":checked")){
        var etime = $('#etime').val();
        var jdate2 = new Date(etime);

        locationsRef.add({
            location: loc,
            patientRef: db.doc('patients/'+patRef),
            geopoint: new firebase.firestore.GeoPoint(lat, lon),
            duration:{
                startt: firebase.firestore.Timestamp.fromDate(jdate),
                endt: firebase.firestore.Timestamp.fromDate(jdate2)
            },
        }).catch(function(error){
            console.log("error: "+error);
        });
        // console.log("date value: "+date+" type:"+typeof date);
    }else{
        locationsRef.add({
            location: loc,
            patientRef: db.doc('patients/'+patRef),
            geopoint: new firebase.firestore.GeoPoint(lat, lon),
            DT: firebase.firestore.Timestamp.fromDate(jdate)
        }).then(function(loc){
            console.log("new location id: "+loc.id);
            alert("new location added");
        }).catch(function(error){
            console.log("error: "+error);
        });
    }

});
// var locationRef = db.collection('patients').doc(patRef).collection('location');

