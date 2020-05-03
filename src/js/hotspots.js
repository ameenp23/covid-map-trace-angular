$(document).ready(function(){
    var hotpspots = db.collection("locations");
    console.log("ready");
    hotpspots.get().then(function(snap){
        snap.forEach(function(loc){
            db.collection("locations").doc(loc.id).collection("patients").get().then(function(snap2){
                $('#hotspots').append("<tr>"+
                "<td>"+loc.data().address+"</td>"+
                "<td>"+loc.data().district+"</td>"+
                "<td>"+loc.data().geopoint.F+" , "+loc.data().geopoint.V+"</td>"+
                "<td>"+snap2.size+"</td>"
                +"</tr>"); 
            });
        });
    });
    
});