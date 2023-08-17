var streets = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
    {
      attribution:
        "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012"
    }
  );
  
  var satellite = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
      attribution:
        "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
    }
  );
  var basemaps = {
    "Streets": streets,
    "Satellite": satellite
  };
  
  var map = L.map("map", {
    layers: [streets]
  }).setView([54.5, -4], 6);
  
var layerControl = L.control.layers(basemaps).addTo(map);
  
L.easyButton("fa-info", function (btn, map) {
    $("#exampleModal").modal("show");
  }).addTo(map);

  //onload button

  document.onreadystatechange = function() {
    if (document.readyState !== "complete") {
        document.querySelector("body").style.visibility = "hidden";
        document.querySelector("#loader").style.visibility = "visible";
    } else {
        document.querySelector("#loader").style.display = "none";
        document.querySelector("body").style.visibility = "visible";
    }
};

  //event handlers and ajax calls
  
  $(document).ready(function() {
  
    $.ajax({
        url: "php/getCountry.php",
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

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
          $.getJSON('http://api.geonames.org/countryCode?&type=JSON&username=ekruger', {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              type: 'JSON'
          }, function(result) {
              $('select').val(result.countryCode);
          });
      });
    }
    });

let border = null;

$('select').change(function() {

  $.ajax({
      url: "php/getBorders.php",
      type: 'GET',
      data:{iso:$('select').val()},
      dataType: 'json',

      success: function(result) {
          console.log(JSON.stringify(result));

          if (border) {
            border.clearLayers();
          }

          if (result.status.name == "ok") {

                border = L.geoJSON(result.data).addTo(map);
                
                // zoom the map to the polygon
                map.fitBounds(border.getBounds());
                }     
                
              },

      error: function(jqXHR, textStatus, errorThrown) {
          // your error code
          console.log(jqXHR);
      }
  });

  /*$.ajax({
    url: "php/getOpenCageData.php",
    type: 'GET',
    data:{country:$('select').html()},
    dataType: 'json',

    success: function(result) {
        console.log(JSON.stringify(result));

        if (result.status.name == "ok") {


        }
      },

    error: function(jqXHR, textStatus, errorThrown) {
        // your error code
        console.log(jqXHR);
    }
});*/

  $.ajax({
      url: "php/getBasicInfo.php",
      type: 'GET',
      data:{country:$('select').val()},
      dataType: 'json',

      success: function(result) {
          console.log(JSON.stringify(result));

          if (result.status.name == "ok") {
            
          let capitalLocal; 
          capitalLocal = result.data[0].capital;
          window.capitalGlobal = capitalLocal;

          console.log(capitalLocal);
          console.log(window.capitalGlobal);

      
            $('#continent').html(`<td>${result.data[0].continentName}</td>`);

            $('#capitalCity').html(`<td>${capitalLocal}</td>`);
            
            $('#population').html(`<td>${result.data[0].population}</td>`);

            $('#currency').html(`<td>${result.data[0].currencyCode}</td>`);


          }
        },

      error: function(jqXHR, textStatus, errorThrown) {
          // your error code
          console.log(jqXHR);
      }
  });

  $.ajax({
    url: "php/getExchangeRate.php",
    type: 'GET',
    data:{currency:$('#currency').html()},
    dataType: 'json',

    success: function(result) {
        console.log(JSON.stringify(result));

        if (result.status.name == "ok") {

          $('#exchangeRate').html(`1 USD = ${result.data.exchangeRate}`);

        }
      },

    error: function(jqXHR, textStatus, errorThrown) {
        // your error code
        console.log(jqXHR);
    }
});

$.ajax({
  url: "php/getWeather.php",
  type: 'GET',
  data:{city: result.data[0].capital},
  dataType: 'json',

  success: function(result) {
      console.log(JSON.stringify(result));

      if (result.status.name == "ok") {

        $('#weather').html(result.data.current.temp_c);

      }
    },

  error: function(jqXHR, textStatus, errorThrown) {
      // your error code
      console.log(jqXHR);
  }
});

 $country = ('select').html;
 $('#wiki').html('https://en.wikipedia.org/wiki/' . $country);

});
