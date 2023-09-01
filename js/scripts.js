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
  
L.easyButton("fa-info fa-lg", function (btn, map) {
    $("#overviewModal").modal("show");
  }).addTo(map);

L.easyButton("fa-brands fa-wikipedia-w fa-lg", function (btn, map) {
    $("#wikiModal").modal("show");
  }).addTo(map);

L.easyButton("fa-arrow-right-arrow-left fa-lg", function (btn, map) {
    $("#currencyConverterModal").modal("show");
  }).addTo(map);

L.easyButton("fa-cloud fa-lg", function (btn, map) {
    $("#weatherModal").modal("show");
  }).addTo(map);

  L.easyButton("fa-newspaper fa-lg", function (btn, map) {
    $("#newsModal").modal("show");
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
            /*        $.ajax({
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
                  });*/



                    
                } 
                

             
        },

        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
            console.log(jqXHR);
        }
    });

//fetching country borders and zooming into them

    let border = null;

    let markers = null;

    //let volMarkers = null;

$('#selectCountry').change(function() {

  let country = $('#selectCountry option:selected').text();
                

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

  $.ajax({
    url: "php/getNews.php",
    type: 'GET',
    data:{iso:$('select').val()},
    dataType: 'json',

    success: function(result) {
        console.log(JSON.stringify(result));


        if (result.status.name == "ok") {

          console.log("Ellie", result.data)

          for (let i = 0; i < result.data.results.length; i++) {

          console.log("Ellie", result.data.results[i].image_url)
          console.log("Ellie", result.data.results[i].link)
          console.log("Ellie", result.data.results[i].title)

          $('#news').append(`<table class="table table-borderless mb-0">
          <tr>

          <td rowspan="2" width="50%">
            <img class="img-fluid rounded" src=${result.data.results[i].image_url} alt="article image">
          </td>
          
          <td>
            <a href=${result.data.results[i].link} class="fw-bold fs-6 text-black" target="_blank">${result.data.results[i].title}</a>
          </td>
          
        </tr>

        <tr>
                       
            <td class="align-bottom pb-0">
              
              <p class="fw-light fs-6 mb-1">${result.data.results[i].source_id}</p>
              
            </td>            
            
          </tr>         
        </table>
        <hr>`);
          }

          

             

              
              }     
              
            },

    error: function(jqXHR, textStatus, errorThrown) {
        // your error code
        console.log(jqXHR);
    }
});

  //getting restcountries data for flag model plus info

  $.ajax({
    url: "php/getRestCountries.php",
    type: 'GET',
    data:{
      country: encodeURI(country)             
    },
    dataType: 'json',
  
    success: function(result) {
        console.log(JSON.stringify(result));
  
        if (result.status.name == "ok") {
          $('#flag').html(`<img src=${result.data[0].flags.png} alt=${result.data[0].flags.alt} height="25" class="border border-secondary"></img>`);  
          
          $('#drivesOn').text(result.data[0].car.side);

          /*let languagesData = result.data[0].languages;

          let languagesArr = Object.entries(languagesData);

          for ([key, val] of languagesArr) {
            console.log("Ellie", val);
            
            $('#language').text(val);
          } */
  
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
    data:{country:encodeURI($('#selectCountry option:selected').text())},
    dataType: 'json',

    success: function(result) {
        console.log(JSON.stringify(result));

        if (result.status.name == "ok") {

          $('#callingCode').text(result.data.results[0].annotations.callingcode);



           


          

          }
      },

    error: function(jqXHR, textStatus, errorThrown) {
        // your error code
        console.log(jqXHR);
    }
});

//getting continent, capital, population and currency

  $.ajax({
      url: "php/getGeonames.php",
      type: 'GET',
      data:{country:$('select').val()},
      dataType: 'json',

      success: function(result) {
          console.log(JSON.stringify(result));

          if (result.status.name == "ok") {

            $currency = result.data[0].currencyCode;
  
            $('#continent').text(result.data[0].continentName);
            

            $('#capitalCity').text(result.data[0].capital);
            

            let nf = new Intl.NumberFormat('en-US');
            
            $('#population').text(nf.format(result.data[0].population));

            $('#currency').text(result.data[0].currencyCode);

            let currency = (result.data[0].currencyCode);

          $.ajax({
              url: "php/getExchangeRate.php",
              type: 'GET',
              dataType: 'json',
        
              success: function(result) {
                  console.log(JSON.stringify(result));
        
                  if (result.status.name == "ok") {
        
                    let rates = result.data.rates;
        
                    let ratesArr = Object.entries(rates);
        
                    for ([key, value] of ratesArr){        

                      if (key === currency) {
                        $('#exchangeRate').append(`<option class="${key}" value="${value}" selected="selected"></option>`)
                      } else {
                        $('#exchangeRate').append(`<option class="${key}" value="${value}"></option>`)
                      }
                     }

                     $.ajax({
                      url: "php/getCurrencyName.php",
                      type: 'GET',
                      dataType: 'json',
                
                      success: function(result) {
                          console.log(JSON.stringify(result));
                      
                
                          if (result.status.name == "ok") {

                                  
                
                            let currencyNames = result.data;
                
                            let currencyNamesArr = Object.entries(currencyNames);
                
                            for ([key, value] of currencyNamesArr){        
        

                            console.log("Ellie", key)
                            console.log("Ellie", value)
                            console.log($('#exchangeRate').find('option'))
                              if (key === $('#exchangeRate').find('option')) {
                                $('#').text(value)
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
                    }
                });
                  
                      

                $('#fromAmount').on('keyup', function () {

                  calcResult();
                
                })
                
                $('#fromAmount').on('change', function () {
                
                  calcResult();
                
                })
                
                $('#exchangeRate').on('change', function () {
                
                  calcResult();
                
                })
                
                $('#exampleModal').on('show.bs.modal', function () {
                
                  calcResult();
                
                })
                
                
                function calcResult() {
                   
                  $('#toAmount').val($('#fromAmount').val() * $('#exchangeRate').val()).format("0,0.00");
                  
                }
                


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
                     $('#todayMaxTemp').text(result.data.forecast.forecastday[0].day.maxtemp_c.fixedTo(0));
                    $('#todayMinTemp').text(result.data.forecast.forecastday[0].day.mintemp_c.fixedTo(0));

                    $('#day1Date').text(new Date(result.data.forecast.forecastday[1].date).toLocaleDateString('en-us', { weekday:"short", month:"short", day:"numeric"}) );
                    $('#day1Icon').html(`<img src=${result.data.forecast.forecastday[1].day.condition.icon} alt="tomorrow's weather">`);
                    $('#day1MaxTemp').text(result.data.forecast.forecastday[1].day.maxtemp_c.fixedTo(0));
                    $('#day1MinTemp').text(result.data.forecast.forecastday[1].day.mintemp_c.fixedTo(0));
                    

                    $('#day2Date').text(new Date(result.data.forecast.forecastday[2].date).toLocaleDateString('en-us', { weekday:"short", month:"short", day:"numeric"}));
                    $('#day2Icon').html(`<img src=${result.data.forecast.forecastday[2].day.condition.icon} alt="weather in two days">`);
                    $('#day2MaxTemp').text(result.data.forecast.forecastday[2].day.maxtemp_c.fixedTo(0));
                    $('#day2MinTemp').text(result.data.forecast.forecastday[2].day.mintemp_c.fixedTo(0));

                  }
                },
            
              error: function(jqXHR, textStatus, errorThrown) {
                  // your error code
                  console.log(jqXHR);
              }
            });

            var airports = L.markerClusterGroup({
              polygonOptions: {
                fillColor: '#fff',
                color: '#000',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.5
              }}).addTo(map);
        
        var cities = L.markerClusterGroup({
              polygonOptions: {
                fillColor: '#fff',
                color: '#000',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.5
              }}).addTo(map);
        
        var overlays = {
          "Airports": airports,
          "Cities": cities
        };
        
        var layerControl = L.control.layers(overlays).addTo(map);
        
        var airportIcon = L.ExtraMarkers.icon({
          prefix: 'fa',
          icon: 'fa-plane',
          iconColor: 'black',
          markerColor: 'white',
          shape: 'square'
        });
        
        var cityIcon = L.ExtraMarkers.icon({
          prefix: 'fa',
          icon: 'fa-city',
          markerColor: 'green',
          shape: 'square'
        });
          
          showToast("Getting airports and city markers", 1500, false);
                           
          $.ajax({
            url: "php/getAirports.php",
            type: 'GET',
            dataType: 'json',
            data: {
              iso:$('select').val() 
            },
            success: function (result) {
                    
              if (result.status.code == 200) {
                console.log("ellie", result.data)
                
                result.data.forEach(function(item) {
                  
                  L.marker([item.lat, item.lng], {icon: airportIcon})
                    .bindTooltip(item.name, {direction: 'top', sticky: true})
                    .addTo(airports);
                  
                })
               
              } else {
        
                showToast("Error retrieving airport data", 4000, false);
        
              } 
        
            },
            error: function (jqXHR, textStatus, errorThrown) {
              showToast("Airports - server error", 4000, false);
            }
          }); 
                           
          $.ajax({
            url: "php/getCities.php",
            type: 'GET',
            dataType: 'json',
            data: {
              iso:$('select').val() 
            },
            success: function (result) {
                    
              if (result.status.code == 200) {
        
                console.log("Ellie", result.data)
                result.data.forEach(function(item) {
                  
                  /*L.marker([item.lat, item.lng], {icon: cityIcon})
                    .bindTooltip("<div class='col text-center'><strong>" + item.name + "</strong><br><i>(" + numeral(item.population).format("0,0") + ")</i></div>", {direction: 'top', sticky: true})
                    .addTo(cities);*/
                  
                })
                
              } else {
        
                showToast("Error retrieving city data", 4000, false);
        
              }
        
            },
            error: function (jqXHR, textStatus, errorThrown) {
              showToast("Cities - server error", 4000, false);
            }
          });   
                          
        };
        
        // functions
        
        function showToast(message, duration, close) {
          
          Toastify({
            text: message,
            duration: duration,
            newWindow: true,
            close: close,
            gravity: "top", // `top` or `bottom`
            position: "center", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#004687"
            },
            onClick: function () {} // Callback after click
          }).showToast();
  

            //getting earthquakes
            //nesting it in geonames, as using north, south, east and west data.

            /*$.ajax({
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
                  console.log(JSON.stringify(result));

                  if (markers) {
                    markers.clearLayers();
                  }

                                         
                  if (result.status.name == "ok") {

                    
                    markers = L.markerClusterGroup();

                    for(const iterator of result.data.earthquakes) {

                      var earthquakeIcon = L.icon({
                        iconUrl: 'img/earthquake.png',  
                        iconSize: 32,                                    
                        popupAnchor:  [0, 0]
                    });

                      var earthquakeMarker = L.marker([iterator.lat, iterator.lng], {icon: earthquakeIcon}).bindPopup(`<b>Earthquake</b> <br> Date: ${iterator.datetime} <br> Depth: ${iterator.depth} <br> Magnitude: ${iterator.magnitude}`);

                        markers.addLayer(earthquakeMarker);                     

                        map.addLayer(markers);

                    }                        
                   }                        
                  },
        
              error: function(jqXHR, textStatus, errorThrown) {
                  // your error code
                  console.log(jqXHR);
              }
          });*/

          //getting wiki data using, north, south, east west

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
                  $('#wikiLink').html(`<a href="https://${result.data[0].wikipediaUrl}" target="blank">More Info</a>`);
                      
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



/*$.ajax({
              url: "php/getVolcanicEruptions.php",
              type: 'GET',
              data:{
                country: country
              },
        
              dataType: 'json',
        
              success: function(result) {
                  console.log(JSON.stringify(result));

                  if (volMarkers) {
                    volMarkers.clearLayers();
                  }

                                         
                  if (result.status.name == "ok") {
                                      
                   for(const iterator of result.data) {

                    
                        var volcanoeIcon = L.icon({
                        iconUrl: 'img/volcanoe1.png',
                        iconSize: 35,                                     
                        popupAnchor:  [0,-5]
                    });

                      volMarkers = L.marker([iterator.fields.coordinates[0], iterator.fields.coordinates[1]], {icon: volcanoeIcon}).addTo(map)
                      .bindPopup(`<b>Volcanic Eruption</b> <br> Name: ${iterator.fields.name} <br> Type: ${iterator.fields.type} <br> Year: ${iterator.fields.year} <br> Elevation: ${iterator.fields.elevation} <br> Status: ${iterator.fields.status}`);

                      map.addLayer(volMarkers);

                    }

                    

                      
                        
                        }    
                        
                      },
        
              error: function(jqXHR, textStatus, errorThrown) {
                  // your error code
                  console.log(jqXHR);
              }
          });*/

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

