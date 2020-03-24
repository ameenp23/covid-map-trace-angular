$("tbody").on("click",".report", function(){
    console.log("pateintRef:"+$(this).data('val1')+" locRef:"+$(this).data('val2'));
    var patRef = $(this).data('val1');
    var locRef = $(this).data('val2');
    db.collection("flags").add({
        name: "srj",
        address: "cax",
        contact: 93994,
        suspectRef: patRef+"/locations/"+locRef
    });
});