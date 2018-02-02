var latitude = 41.8963402;
var longitude = -87.6186032;

var queryURL = 'https://cors-anywhere.herokuapp.com/' + "https://nu-yelp-api.herokuapp.com/api/all/" + latLong + "/1/3219";
console.log(queryURL);

var restaurantCounter = 0;

function runQuery(queryURL){
  
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(yelpData){

        console.log(yelpData);

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
