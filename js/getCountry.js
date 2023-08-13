$(document).ready(function() {

    $.ajax({
        url: "../php/getCountry.php",
        type: 'GET',
        dataType: 'json',

        success: function(result) {
            console.log(JSON.stringify(result));

            if (result.status.name == "ok") {
                for (const iterator of result.data) {
                    $('#selectCountry').append(`<option value="${iterator.iso_a2}">${iterator.name}</option>`)
                } 
            }     
        },

        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
            console.log(jqXHR);
        }
    });
});