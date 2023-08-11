$("index.html").onload(function() {

    $.ajax({
        url: "../php/getCountry.php",
        type: 'POST',
        dataType: 'json',
        success: function(result) {

            console.log(JSON.stringify(result));

            if (result.status.name == "ok") {

                $('#country').html(result['countries']);
                
            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
            console.log(jqXHR);
        }
    }); 

});