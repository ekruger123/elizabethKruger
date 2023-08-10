$('#country').click(function() {

    $.ajax({
        url: "../php/getCountry.php",
        type: 'GET',
        dataType: 'json',
        data: {
            country: $('#selectCountry').val(),
        },
        success: function(result) {

            console.log(JSON.stringify(result));

            if (result.status.name == "ok") {

                $('#result').html(result['data']['countryCode']);
                
            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
            console.log(jqXHR);
        }
    }); 

});