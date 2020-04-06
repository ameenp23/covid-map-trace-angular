
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
        patient.add({
                    name: name,
                    hospital: hosp,
                    patientID: patID,
                    parentID: parID
        }).then(function(docRef) {
                console.log("Document written with ID: ", docRef.id);
                patRef = docRef.id;
                return patRef;
        }).catch(function(error) {
                console.error("Error adding document: ", error);
        });
            
    
    }
});

// var locationRef = db.collection('patients').doc(patRef).collection('location');

