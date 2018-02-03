var latLong = '';

var getLatLng = function() {

    var APIKey = '&key=AIzaSyCRYYladM1Ui9mjSl2TgmWoTwj_tCO4Lxc';
 
    event.preventDefault();
 
    var getZip = $('#location-input').val();
    console.log(getZip);
    var queryURL = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + getZip;
    
    $.ajax({
        url: queryURL,
        method: 'GET'
      }).then(function(response) {
    
        latLong = response.results[0].geometry.location.lat + '/' + response.results[0].geometry.location.lng;
        console.log(latLong);
        runQuery(latLong);
  
      });
 }
 $('.submit').on('click', getLatLng);

//Put yelp query function here
function runQuery(latLong){

    var queryURL = 'https://cors-anywhere.herokuapp.com/' + 'https://nu-yelp-api.herokuapp.com/api/all/' + latLong + '/1/3219';
    var restaurantCounter = 0;
    console.log(queryURL);  
  
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(yelpData){

        //make the yelpData into an object
        var yelpObj = JSON.parse(yelpData);
        console.log(yelpObj);

        for (var i = 0; i < 10; i++){
            restaurantCounter++;
            console.log(yelpObj.businesses[i].name);

            var newResult = $('<div>');
                newResult.addClass('result');
                newResult.attr('id', 'restaurant-' + restaurantCounter);
                
                $('.search-results').append(newResult);
                var resultOutput = '<p class="title>' + restaurantCounter + '. ' + yelpObj.businesses[i].name + '</p>' + '<p class="address">' + yelpObj.businesses[i].location.display_address + '</p>' + '<p class="rating">' + yelpObj.businesses[i].rating + ' ' + 


                newResult.text(restaurantCounter + '. ' + yelpObj.businesses[i].name);
                newResult.append(yelpObj.businesses[i].location.display_address);
                newResult.append(yelpObj.businesses[i].rating);
                newResult.append(yelpObj.businesses[i].link);
                    if (yelpObj.businesses[i].is_closed === false){
                        newResult.append('Open Now');
                    }
                
        }
    });
}