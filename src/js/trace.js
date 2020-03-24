    var locations = db.collectionGroup("locations");
    $("#trace").click(function() {
    locations.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {

            var patientRef = doc.data().patientRef.path
            //Saving coordinates of location
            var lat2 = doc.data().geopoint.F;
            var lon2 = doc.data().geopoint.V;
            //saving timestamp if any
            if(doc.get("DT")!=null){
                var p_tstamp = doc.data().DT.seconds * Math.pow(10,3);
                var i = new Date(Number(p_tstamp));
                var month = i.getMonth()+1;
                var date = i.getDate();
                var p_hr = i.getHours();
                var p_min = i.getMinutes();
            }
            //saving duration, if no timestamp
            else{
                var pstart = doc.data().duration.startt.seconds * Math.pow(10,3);
                var i =new Date(Number(pstart));
                var month = i.getMonth()+1;
                var date = i.getDate();
                var p_shr = i.getHours();
                var p_smin = i.getMinutes();
                var pend = doc.data().duration.endt.seconds * Math.pow(10,3);
                i =new Date(Number(pend));
                var p_ehr = i.getHours();
                var p_emin = i.getMinutes();
            }
            //saving details of the location
            var ploc = doc.data().location;
            
            //Loading json file
            var file = $('#myfile')[0].files[0];
            var reader = new FileReader();
            reader.readAsText(file, 'UTF-8');
            reader.onload = function(evt) {
            map = JSON.parse(evt.target.result);
            places = map.timelineObjects;
         
            //looping through each placevisit of user json
                $.each(places, function(i, e){
                    if(e.hasOwnProperty("placeVisit")){
                        //saving the users visited place variables ie coordinate,duration timestamp and address
                        var lat1 = e.placeVisit.location.latitudeE7/Math.pow(10,7);
                        var lon1 = e.placeVisit.location.longitudeE7/Math.pow(10,7);
                        var startt = e.placeVisit.duration.startTimestampMs;
                        var endt = e.placeVisit.duration.endTimestampMs;
                        var uloc = e.placeVisit.location.address;
                        var d1 = new Date(Number(startt));
                        var ushour = d1.getHours();
                        var usmin = d1.getMinutes();
                        var d2 = new Date(Number(endt));
                        var uehour = d2.getHours();
                        var uemin = d2.getMinutes();
                        //if the distance btw users placevisit and patients location is less than 2 KM
                        if (find(lat1,lon1,lat2,lon2)<2){
                            //if the patient visit time is given as 'DT'
                            if(p_tstamp){    
                                if((startt < p_tstamp) && (p_tstamp < endt)){
                
                                    $('#table-body').append("<tr>"+
                                    "<td>"+month+"/"+date+"</td>"+
                                    "<td>"+uloc+"</td>"+
                                    "<td>"+ushour+":"+usmin+" to "+uehour+":"+uemin+"</td>"+
                                    "<td>"+ploc+"</td>"+
                                    "<td>"+p_hr+":"+p_min+"</td>"+
                                    "<td><button type='button' class='report' data-val1='"+patientRef+"' data-val2='"+doc.id+"'>report</button></td>"+
                                  "</tr>") 
                                }
                            }
                            //if the patient visit 'duration' is given
                            else{
                                if(pstart < endt && pend > startt){

                                    $('#table-body').append("<tr>"+
                                    "<td>"+month+"/"+date+"</td>"+
                                    "<td>"+uloc+"</td>"+
                                    "<td>"+ushour+":"+usmin+" to "+uehour+":"+uemin+"</td>"+
                                    "<td>"+ploc+"</td>"+   
                                    "<td>"+p_shr+":"+p_smin+" to "+p_ehr+":"+p_emin+"</td>"+
                                    "<td><button type='button' class='report' data-val1='"+patientRef+"' data-val2='"+doc.id+"'>report</td>"+
                                  "</tr>") 
                                }
                            }
                        }
                    }
                    // if(e.hasOwnProperty("activitySegment")){
                        //area to implement path tracing
                    // }
                });   

            };  
            });


            //firestore fetching
        });
    });