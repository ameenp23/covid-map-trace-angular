$("#loc").keyup(function(){
    console.log("keyup");
    $('#locations').empty();
    var dist = $('#dist').val().toLowerCase();
    var searchkey = $('#loc').val();
    var LocsRef = db.collection('locations').where("district",">=",dist);
    LocsRef.get().then(function(querylocs){
        querylocs.forEach(function(loc){
            var result = loc.data().address;
            if(result.includes(searchkey)){
                $('#locations').append("<option value='"+loc.data().address+"' data-id='"+loc.id+"'>");
                console.log(loc.id);
            }
        })
    }).catch(function(error){
        console.log(error);
    });
    
});

$('#loc').on("change", function(){
    var val = $(this).ui.attribute.val();
    var option = this.ui.attributeList.find("[value='" + value + "']");
    if (option.length > 0) {
        var id = option.data("id");
        // do stuff with the id
        console.log("selected id"+id);
      }
});
