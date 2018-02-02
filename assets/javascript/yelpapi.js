$(document).ready(function(){



// //Geolocation function
// var useLocation = $('#useLocation');

// function getLocation() {
//     if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(showPosition);
//     } else { 
//         $('.search-box').text("Geolocation is not supported by this browser. Please enter a zip code.");
//     }
// }
// //enhance: add error handling for geolocation

// function showPosition(position) {
//     var latitude =  position.coords.latitude;
//     var longitude = position.coords.longitude;
//         return(latitude, longitude);
// }

// //If user clicks "use location" button, then get user's current location
// $('#useLocation').on('click', getLocation);

var latitude = 41.8963402;
var longitude = -87.6186032;

var queryURL = 'https://cors-anywhere.herokuapp.com/' + "https://nu-yelp-api.herokuapp.com/api/all/" + latitude + "/" + longitude + "/1/3219";
console.log(queryURL);

var restaurantCounter = 0;

function runQuery(queryURL){
  
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(yelpData){

        console.log(response);

        for (var i = 0; i < 11; i++){
          restaurantCounter++;
          var newResult = $('<div>');
              newResult.addClass('result');
              newResult.attr('id', + 'restaurant-' + restaurantCounter);
              $('.search-results').append(newResult);
          }
        });
    }

runQuery();
});
