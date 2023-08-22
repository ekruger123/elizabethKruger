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
                    $('#selectCountry').append(`<option id="${iterator.iso_a2}" value="${iterator.iso_a2}">${iterator.name}</option>`)

                }

// adding flags next to country name in slect
                    $.ajax({
                      url: "php/getFlags.php",
                      type: 'GET',
                      dataType: 'json',
              
                      success: function(result) {
                          console.log(JSON.stringify(result));
              
                          if (result.status.name == "ok") {

                            let flagsData = result.data;

                            let flagsArr = Object.entries(flagsData);

                            $('#selectCountry').find('option').each(function(index,element){
                              //console.log("Ellie",element.value);
                                                 
                              for ([key, val] of flagsArr){
                                if (key == element.value) {
                                  
                                  $(`#${element.value}`).prepend(`<span><img src="${val.image}" alt="${element.text} flag" height="32px" /></span>`);
                                                     
                                }
                              }
                              });                            
              
                          }     
                      },
              
                      error: function(jqXHR, textStatus, errorThrown) {
                          // your error code
                          console.log(jqXHR);
                      }
                  });



                    
                } 
                

             
        },

        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
            console.log(jqXHR);
        }
    });

  
//fetching country borders and zooming into them

    let border = null;

$('select').change(function() {

  let country = $('select option:selected').text();
                $('#modalTitle').text(country);

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

  //getting openCage data for lng and lat

  
  $.ajax({
    url: "php/getOpenCageData.php",
    type: 'GET',
    data:{country:encodeURI(country)},
    dataType: 'json',

    success: function(result) {
        console.log(JSON.stringify(result));

        if (result.status.name == "ok") {

          $('#callingCode').text(result.data.results[0].annotations.callingcode);



           //$('#currency').prepend(`<span>${result.data.results[0].annotations.currency.symbol}</span>`);


          //nesting get weather in openCage, b/c it using lng and lat in it's url

          $.ajax({
            url: "php/getWeather.php",
            type: 'GET',
            data:{
              lat:result.data.results[0].geometry.lat,
              lng:result.data.results[0].geometry.lng              
            },
            dataType: 'json',
          
            success: function(result) {
                console.log(JSON.stringify(result));
          
                if (result.status.name == "ok") {

          
                  $('#temp').html(`${result.data.current.temp_c} &#8451;`);
                  $('#conditions').html(`<img src="${result.data.current.condition.icon}" alt="${result.data.current.condition.text}" height="28"/>${result.data.current.condition.text}`)
          
                }
              },
          
            error: function(jqXHR, textStatus, errorThrown) {
                // your error code
                console.log(jqXHR);
            }
          });


        }
      },

    error: function(jqXHR, textStatus, errorThrown) {
        // your error code
        console.log(jqXHR);
    }
});

//getting continent, capital, population and currency

  $.ajax({
      url: "php/getBasicInfo.php",
      type: 'GET',
      data:{country:$('select').val()},
      dataType: 'json',

      success: function(result) {
          console.log(JSON.stringify(result));

          if (result.status.name == "ok") {

            $currency = result.data[0].currencyCode;
  
            $('#continent').text(result.data[0].continentName);
            //html(`<td>${result.data[0].continentName}</td>`);

            $('#capitalCity').text(result.data[0].capital);
            //html(`<td>${result.data[0].capital}</td>`);
            
            $('#population').text(result.data[0].population.toLocaleString());

           let num = 123456789;
            console.log("Ellie", num.toLocaleString);
            //html(`<td>${result.data[0].population}</td>`);

            $('#currency').text(result.data[0].currencyCode);
            //html(`<td>${result.data[0].currencyCode}</td>`);

            //getting earthquakes
            //nesting it in geonames, as using north, south, east and west data.

            /*console.log("Ellie",result.data[0].north.toFixed(1));
            console.log("Ellie", result.data[0].south.toFixed(1));
            console.log("Ellie", result.data[0].east.toFixed(1));
            console.log("Ellie", result.data[0].west.toFixed(1));*/

            $.ajax({
              url: "php/getEarthquakes.php",
              type: 'GET',
              data:{
                north: result.data[0].north.toFixed(1),
                south: result.data[0].south.toFixed(1),
                east: result.data[0].east.toFixed(1),
                west: result.data[0].west.toFixed(1)
              },
        
              dataType: 'json',
        
              success: function(result) {
                  console.log(JSON.stringify(result));;

                                         
                  if (result.status.name == "ok") {

                    for(const iterator of result.data.earthquakes) {

                      /*console.log("Ellie", iterator.datetime);
                      console.log("Ellie", iterator.depth);
                      console.log("Ellie", iterator.lng);
                      console.log("Ellie", iterator.lat);
                      console.log("Ellie", iterator.src);
                      console.log("Ellie", iterator.eqid);
                      console.log("Ellie", iterator.magnitude);*/

                      var earthquakeIcon = L.icon({
                        iconUrl: 'img/earthquake.png',  
                        iconSize: 32,                                    
                        popupAnchor:  [0, 0]
                    });

                      L.marker([iterator.lat, iterator.lng], {icon: earthquakeIcon}).addTo(map)
                      .bindPopup(`<b>Earthquake</b> <br> Date: ${iterator.datetime} <br> Depth: ${iterator.depth} <br> Magnitude: ${iterator.magnitude}`)
                      .openPopup();

                    }

                      
                        
                        }     
                        
                      },
        
              error: function(jqXHR, textStatus, errorThrown) {
                  // your error code
                  console.log(jqXHR);
              }
          });

            // nesting fecthing exchange rate in geonames call, to give the oprition of using the currency fetch from geonames to call only the currency of the country selected


            $.ajax({
              url: "php/getExchangeRate.php",
              type: 'GET',
              //data:{currency:$('#currency').text()},
              dataType: 'json',
          
              success: function(result) {
                  console.log(JSON.stringify(result));

                  if (result.status.name == "ok") {

                    let rates = result.data.rates;

                    let ratesArr = Object.entries(rates);

                    for ([key, value] of ratesArr){
                      if (key == $('#currency').text()) {

                      $('#exchangeRate').text(`1 USD = ${value} ${key}`)
                      //html(`<td>1 USD = ${value} ${key}</td>`);
                        }                     
                    }                 
          
                  }
                },
          
              error: function(jqXHR, textStatus, errorThrown) {
                  // your error code
                  console.log(jqXHR);
              }
          });
          
        }
      
        },

      error: function(jqXHR, textStatus, errorThrown) {
          // your error code
          console.log(jqXHR);
      },

      
  });

  //creating wikilinks

 let countryURI = encodeURI($('select option:selected').text());

let href = `https://en.wikipedia.org/wiki/${countryURI}`;

$('#wikiLinks').append(`<a href="${href}" target="blank">More Info</a>`);

console.log("Ellie", country);

$.ajax({
              url: "php/getVolcanicEruptions.php",
              type: 'GET',
              data:{
                country: country
              },
        
              dataType: 'json',
        
              success: function(result) {
                  console.log(JSON.stringify(result));

                                         
                  if (result.status.name == "ok") {
                    if (Object.values(result.data).length !== 0) {

                      console.log("ellie", result.data[0].fields.year);
                    }


                  
                   for(const iterator of result.data) {

                    /*console.log("Ellie", iterator.fields.location);
                    console.log("Ellie", iterator.fields.status);
                    console.log("Ellie", iterator.fields.coordinates[0]);
                    console.log("Ellie", iterator.fields.coordinates[1]);
                    console.log("Ellie", iterator.fields.elevation);
                    console.log("Ellie", iterator.fields.year);
                    console.log("Ellie", iterator.fields.name);
                    console.log("Ellie", iterator.fields.type);*/

                        var volcanoeIcon = L.icon({
                        iconUrl: 'img/volcanoe1.png',
                        iconSize: 35,                                     
                        popupAnchor:  [0,-5]
                    });

                      L.marker([iterator.fields.coordinates[0], iterator.fields.coordinates[1]], {icon: volcanoeIcon}).addTo(map)
                      .bindPopup(`<b>Volcanic Eruption</b> <br> Name: ${iterator.fields.name} <br> Type: ${iterator.fields.type} <br> Year: ${iterator.fields.year} <br> Elevation: ${iterator.fields.elevation} <br> Status: ${iterator.fields.status}`)
                      .openPopup();

                    }

                      
                        
                        }    
                        
                      },
        
              error: function(jqXHR, textStatus, errorThrown) {
                  // your error code
                  console.log(jqXHR);
              }
          });

});




//getting current location


/*$.ajax({

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      url: "php/getLocation.php",
      type: 'GET',
      data:{
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      },
      dataType: 'json'
    }, 
    function(result) {
      console.log(result);
      $('select').val(result.countryCode).change();
  });
});

  })
  

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

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position) {
      $.getJSON('http://api.geonames.org/countryCode?&type=JSON&username=ekruger', {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          type: 'JSON'
      }, function(result) {
          console.log(result);
          $('select').val(result.countryCode).change();
      });
  });
}
    });


