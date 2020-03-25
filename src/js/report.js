$("tbody").on("click",".report", function(){
    console.log("pateintRef:"+$(this).data('val1')+" locRef:"+$(this).data('val2'));
    var patRef = $(this).data('val1');
    var locRef = $(this).data('val2');
    db.collection("flags").add({
        name: $('#name').val(),
        address: $('#address').val(),
        contact: $('#contact').val(),
        suspectRef: db.doc(patRef+"/locations/"+locRef)
    });
});