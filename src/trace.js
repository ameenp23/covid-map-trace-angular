function find(lat1_deg, lon1_deg, lat2_deg, long2_deg){
    const deg2rad = Math.PI / 180;
    const EARTH_RADIUS_KM = 6371.01;
    lat1 = lat1_deg*deg2rad;
    long1 = lon1_deg*deg2rad;
    lat2 = lat2_deg*deg2rad;
    long2 = long2_deg*deg2rad;

    return Math.acos(
        (Math.sin(lat1)*Math.sin(lat2))+
        (Math.cos(lat1)*Math.cos(lat2)*Math.cos(long1-long2))
    )*EARTH_RADIUS_KM;

    };
    // TODO: Replace the following with your app's Firebase project configuration
    var firebaseConfig = {
        apiKey: "AIzaSyC07aStcHa1MS0zosefs2CLHJydqukK8YU",
        authDomain: "covid-map-trace.firebaseapp.com",
        databaseURL: "https://covid-map-trace.firebaseio.com",
        projectId: "covid-map-trace",
        storageBucket: "covid-map-trace.appspot.com",
        messagingSenderId: "1038085926962",
        appId: "1:1038085926962:web:5754a25dffaf42c19b0c2b",
        measurementId: "G-TRG7B8ZRLL"
    };

    // // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    var db = firebase.firestore();
    var locations = db.collectionGroup("locations");
    $("#trace").click(function() {
    locations.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            //Saving coordinates of location
            var lat2 = doc.data().geopoint.F;
            var lon2 = doc.data().geopoint.V;
            //saving timestamp if any
            if(doc.get("DT")!=null){
                var p_tstamp = doc.data().DT.seconds * Math.pow(10,3);
            }
            //saving duration, if no timestamp
            else{
                var pstart = doc.data().duration.startt.seconds * Math.pow(10,3);
                var pend = doc.data().duration.endt.seconds * Math.pow(10,3);
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

                        //if the distance btw users placevisit and patients location is less than 2 KM
                        if (find(lat1,lon1,lat2,lon2)<2){
                            //if the patient visit time is given as 'DT'
                            if(p_tstamp){    
                                if((startt < p_tstamp) && (p_tstamp < endt)){
                                    // console.log("User visited",uloc," Around the same time patient visited: ",ploc);
                                    $("#result1").html("User visited: "+uloc+" || Around the same time patient visited: "+ploc);
                                }
                            }
                            //if the patient visit 'duration' is given
                            else{
                                if(pstart < endt && pend > startt){
                                    // console.log("User visited",uloc," Around the same time patient visited: ",ploc);
                                    $("#result2").html("User visited: "+uloc+" || Around the same time patient visited: "+ploc); 
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

        });
    });