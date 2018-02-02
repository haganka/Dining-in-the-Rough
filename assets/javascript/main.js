//Geolocation function
$(document).ready(function(){

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else { 
            $('.search-box').text("Geolocation is not supported by this browser. Please enter a zip code.");
        }
    }
    //enhance: add error handling for geolocation
    
    function showPosition(position) {
        var latitude =  position.coords.latitude;
        var longitude = position.coords.longitude;
            console.log(latitude, longitude);
    }
    
    //If user clicks "use location" button, then get user's current location
    $('#useLocation').on('click', getLocation);

});



/** event listener on the .submit button for zip code
    captures zip zode as var = zipCode
    insert function to take zipCode and turn into lat/long
    ensure that the results come back as a NUMBER not string

This function makes the ajax call to the Yelp API to get business results

    queryURL: 
    restaurantCounter = 0;

    Inputs parameters of 
        latitude=latitude
        longitude=longitude
        price=1
        radius=3219
    Returns 10 restaurants

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(yelpData){
        filter out the $ results;
        
    USE NYT AND MOVIE-APPLICATION EXAMPLES
        for (var i = 0, i < 10, i++){
            restaurantCounter++;
            var newResult = $('<div>').
                .addClass('result');
                .attr('id', + 'restaurant-' + restaurantCounter);
            here add the following properties to page:
                yelpData.image_url
                yelpData.name
                yelpData.display_address
                yelpData.rating
                yelpData.link 
                yelpData.hours

            $('.search-results).append(newResult);
        }
        
    });

        
**/
