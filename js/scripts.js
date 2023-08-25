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
    $("#overviewModal").modal("show");
  }).addTo(map);

L.easyButton("fa-wikipedia-w", function (btn, map) {
    $("#wikiModal").modal("show");
  }).addTo(map);

L.easyButton("fa-arrow-right-arrow-left", function (btn, map) {
    $("#currencyConverterModal").modal("show");
  }).addTo(map);

L.easyButton("fa-cloud", function (btn, map) {
    $("#weatherModal").modal("show");
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

   /* $.ajax({
      url: "php/getExchangeRate.php",
      type: 'GET',
      dataType: 'json',

      success: function(result) {
          console.log(JSON.stringify(result));

          if (result.status.name == "ok") {

            let rates = result.data.rates;

            let ratesArr = Object.entries(rates);

            for ([key, value] of ratesArr){

              $('#selectFrom').append(`<option class="${key}" value="${value}">${key}</option>`)

              $('#selectTo').append(`<option class="${key}" value="${value}">${key}</option>`)
            

              }
            }
          
          },
          

              error: function(jqXHR, textStatus, errorThrown) {
                // your error code
                console.log(jqXHR);
            }
        });*/

        
$('#amount').change(function(){

  let amount = $('#amount').val();
  let from = $('#selectFrom').val();
  let to = $('#selectTo').val();

  let convertedAmount = (amount/from)*to;

  let nf = new Intl.NumberFormat('en-US');
            
  $('#convertedAmount').text(`${nf.format(amount)} ${$('#selectFrom option:selected').text()} = ${nf.format(convertedAmount)} ${$('#selectTo option:selected').text()}`);

  console.log("amount", amount);
  console.log("from", from);
  console.log("to", to);
  console.log("convertedAmount", convertedAmount);
})
    

  
//fetching country borders and zooming into them

    let border = null;

$('#selectCountry').change(function() {

  let country = $('#selectCountry option:selected').text();
                //$('#modalTitle').text(country);

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

            let nf = new Intl.NumberFormat('en-US');
            
            $('#population').text(nf.format(result.data[0].population));

           
            //html(`<td>${result.data[0].population}</td>`);

            $('#currency').text(result.data[0].currencyCode);
            //html(`<td>${result.data[0].currencyCode}</td>`);

            $.ajax({
              url: "php/getWeather.php",
              type: 'GET',
              data:{
                city: result.data[0].capital             
              },
              dataType: 'json',
            
              success: function(result) {
                  console.log(JSON.stringify(result));
            
                  if (result.status.name == "ok") {
                     $('#weatherModalTitle').text($('#capitalCity').text());                    
                     $('#todayConditions').text(result.data.forecast.forecastday[0].day.condition.text)
                     $('#todayIcon').html(`<img src=${result.data.forecast.forecastday[0].day.condition.icon} alt="today's weather">`)
                     $('#todayMaxTemp').text(result.data.forecast.forecastday[0].day.maxtemp_c);
                    $('#todayMinTemp').text(result.data.forecast.forecastday[0].day.mintemp_c);

                    $('#day1Date').text(new Date(result.data.forecast.forecastday[1].date).toLocaleDateString('en-us', { weekday:"short", month:"short", day:"numeric"}) );
                    $('#day1Icon').html(`<img src=${result.data.forecast.forecastday[1].day.condition.icon} alt="tomorrow's weather">`);
                    $('#day1MaxTemp').text(result.data.forecast.forecastday[1].day.maxtemp_c);
                    $('#day1MinTemp').text(result.data.forecast.forecastday[1].day.mintemp_c);
                    

                    $('#day2Date').text(new Date(result.data.forecast.forecastday[2].date).toLocaleDateString('en-us', { weekday:"short", month:"short", day:"numeric"}));
                    $('#day2Icon').html(`<img src=${result.data.forecast.forecastday[2].day.condition.icon} alt="weather in two days">`);
                    $('#day2MaxTemp').text(result.data.forecast.forecastday[2].day.maxtemp_c);
                    $('#day2MinTemp').text(result.data.forecast.forecastday[2].day.mintemp_c);
  
            
                
            
                  }
                },
            
              error: function(jqXHR, textStatus, errorThrown) {
                  // your error code
                  console.log(jqXHR);
              }
            });
  

            //getting earthquakes
            //nesting it in geonames, as using north, south, east and west data.

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

                      var earthquakeMarker = L.marker([iterator.lat, iterator.lng], {icon: earthquakeIcon}).bindPopup(`<b>Earthquake</b> <br> Date: ${iterator.datetime} <br> Depth: ${iterator.depth} <br> Magnitude: ${iterator.magnitude}`);
 

                        var markers = L.markerClusterGroup();

                        markers.addLayer(earthquakeMarker);                     

                        map.addLayer(markers);



                    }

                      
                        
                        }     
                        
                      },
        
              error: function(jqXHR, textStatus, errorThrown) {
                  // your error code
                  console.log(jqXHR);
              }
          });

          //getting wiki data using, north, south, east west


          console.log("Ellie",result.data[0].north.toFixed(1));
            console.log("Ellie", result.data[0].south.toFixed(1));
            console.log("Ellie", result.data[0].east.toFixed(1));
            console.log("Ellie", result.data[0].west.toFixed(1));

          $.ajax({
            url: "php/getWikipedia.php",
            type: 'GET',
            data:{
              country: $('#selectCountry option:selected').text(),
              north: result.data[0].north.toFixed(1),
              south: result.data[0].south.toFixed(1),
              east: result.data[0].east.toFixed(1),
              west: result.data[0].west.toFixed(1)
            },
            
      
            dataType: 'json',
      
            success: function(result) {
                console.log(JSON.stringify(result));

                                       
                if (result.status.name == "ok") {
                  $('#wikiTitle').html(`<b>${result.data[0].title}</b>`)
                  $('#wikiSummary').html(result.data[0].summary);   
                  $('#wikiLink').html(`<a href=${result.data[0].wikipediaUrl} target="blank">More Info</a>`);                      
                      
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

 let countryURI = encodeURI($('#selectCountry option:selected').text());

let href = `https://en.wikipedia.org/wiki/${countryURI}`;

$('#wikiLinks').html(`<a href="${href}" target="blank">More Info</a>`);


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
                    /*if (Object.values(result.data).length !== 0) {

                      console.log("ellie", result.data[0].fields.year);
                    }*/


                  
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

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position) {
  $.ajax({
        url: "php/getLocation.php",
        type: 'GET',
        data:{
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        },
        dataType: 'json',
      
  
    
        success: function(result) {
        console.log(JSON.stringify(result));
  
        if (result.status.name == "ok") {  

          $('#selectCountry').val(result.data).change();
        }
      },
  
    error: function(jqXHR, textStatus, errorThrown) {
        // your error code
        console.log(jqXHR);
    }
  })
  
      })
    } 


});

