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
  
/*L.easyButton("fa-info", function (btn, map) {
    $("#exampleModal").modal("show");
  }).addTo(map);*/

/*var latlngs = [[37, -109.05],[41, -109.03],[41, -102.05],[37, -102.04]];

var polygon = L.polygon(latlngs, {color: 'red'}).addTo(map);

// zoom the map to the polygon
map.fitBounds(polygon.getBounds());*/

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
});

$('option').on(click, function() {

  $.ajax({
      url: "php/getBorders.php",
      type: 'GET',
      dataType: 'json',

      success: function(result) {
          console.log(JSON.stringify(result));

          if (result.status.name == "ok") {
              for (const iterator of result.data) {
                if (iterator.properties.iso_a2 == value) {
                  var latlngs = iterator.geometry.coordinates;

                var polygon = L.polygon(latlngs, {color: 'red'}).addTo(map);
                
                // zoom the map to the polygon
                map.fitBounds(polygon.getBounds());
                }
                else iterator++                
                
              } 
          }     
      },

      error: function(jqXHR, textStatus, errorThrown) {
          // your error code
          console.log(jqXHR);
      }
  });
});