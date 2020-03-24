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