var locID = null;
$('#add_loc').click(function(){
    var locationsRef = db.collection('patients').doc(patRef).collection('routeMap');

    var date = $('#dt').val();
    var jdate = new Date(date)
    var loc = $('#loc').val();
    var lat = $('#lat').val();
    var lon = $('#lon').val();
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