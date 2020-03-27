$('#geocode').click(function (){
    //Area were coordinates are fetched of given address
    var geopoint;
    var address = $('#address').val();
    theUrl = "http://www.mapquestapi.com/geocoding/v1/address?key=zTJGcEgpfxjWCeNQHtYpkQ0Lr2tkIDCA&location="+address;
    console.log(theUrl);
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            console.log(JSON.parse(xmlHttp.responseText));
            console.log(JSON.parse(xmlHttp.responseText).results[0].locations[0].latLng);
            geopoint = JSON.parse(xmlHttp.responseText).results[0].locations[0].latLng;
        }
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
    //Area were coordinates are fetched of given address is over here

    var ustartt = $('#DT');
    var us_date = new Date(ustartt); 
    var us_ts = us_date.getTime();

    var dur = $('#dur').attr('checked');
    if(dur){
        uendt = $('#endt').val();
        var ue_date = new Date(uendt);
        var ue_ts = ue_date.getTime();
    }

    //loading patient location database from firestore

    var locations = db.collectionGroup("locations");
    locations.get().then(function(snap){
        snap.forEach(function(doc){
            
            var patientRef = doc.data().patientRef.path
            //Saving coordinates and address of location
            var lat2 = doc.data().geopoint.F;
            var lon2 = doc.data().geopoint.V;
            var ploc = doc.data().location;

            var pdur = doc.get("DT")!=null ?false : true;
            if(!pdur){
                var p_DT= doc.data().DT.toDate();
                var ps_year = p_DT.getFullYear();
                var ps_month = p_DT.getMonth();
                var ps_date = p_DT.getDate();
                var ps_hr = p_DT.getHours();
                var ps_min = p_DT.getMinutes(); 
                var ps_ts = p_DT.getTime();
            }
            else{
                var p_dur1 = doc.data().duration.startt.toDate();
                var ps_year = p_dur1.getFullYear();
                var ps_month = p_dur1.getMonth();
                var ps_date = p_dur1.getDate();
                var ps_hr = p_dur1.getHours();
                var ps_min = p_dur1.getMinutes();
                var ps_ts = doc.data().duration.startt.seconds*Math.pow(10,3);
                
                var p_dur2 = doc.data().duration.endt.toDate();
                var pe_year = p_dur2.getFullYear();
                var pe_month = p_dur2.getMonth();
                var pe_date = p_dur2.getDate();
                var pe_hr = p_dur2.getHours();
                var pe_min = p_dur2.getMinutes();
                var pe_ts = doc.data().duration.endt.seconds*Math.pow(10,3);
            }

            console.log(geopoint);
            var lat1 = geopoint.lat;
            var lon1 = geopoint.lng;

            if(find(lat1,lon1,lat2,lon2)<10){
                if(dur){
                    if(!pdur){
                        if(us_ts < ps_ts < ue_ts){
                            $('#table-body').append("<tr>"+
                                    "<td>"+ps_month+"/"+ps_date+"/"+ps_year+"</td>"+
                                    "<td>"+ps_hr+":"+ps_min+"</td>"+
                                    "<td>"+ploc+"</td>"+
                                  "</tr>")
                        }
                    }
                    else{
                        if(us_ts < pe_ts && ue_ts > ps_ts){
                            $('#table-body').append("<tr>"+
                                    "<td>"+ps_month+"/"+ps_date+"/"+ps_year+"</td>"+
                                    "<td>"+ps_hr+":"+ps_min+" to "+pe_hr+":"+pe_min+"</td>"+
                                    "<td>"+ploc+"</td>"+
                                  "</tr>")
                        }
                    }
                }
                else{
                    if(!pdur){
                        if(Math.abs(us_ts - ps_ts) < 3600000){
                            $('#table-body').append("<tr>"+
                                    "<td>"+ps_month+"/"+ps_date+"/"+ps_year+"</td>"+
                                    "<td>"+ps_hr+":"+ps_min+"</td>"+
                                    "<td>"+ploc+"</td>"+
                                  "</tr>")
                        }
                    }
                    else{
                        if(ps_ts < us_ts < pe_ts){
                            $('#table-body').append("<tr>"+
                                    "<td>"+ps_month+"/"+ps_date+"/"+ps_year+"</td>"+
                                    "<td>"+ps_hr+":"+ps_min+" to "+pe_hr+":"+pe_min+"</td>"+
                                    "<td>"+ploc+"</td>"+
                                  "</tr>")
                        }
                    }
                }
            }
        });
    });
});