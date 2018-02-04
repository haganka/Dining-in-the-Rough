var latLong = '';

var getLatLng = function () {

    var APIKey = '&key=AIzaSyCRYYladM1Ui9mjSl2TgmWoTwj_tCO4Lxc';

    event.preventDefault();

    var getZip = $('#location-input').val();
    console.log(getZip);
    var queryURL = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + getZip;

    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(function (response) {

        latLong = response.results[0].geometry.location.lat + '/' + response.results[0].geometry.location.lng;
        console.log(latLong);
        runQuery(latLong);

    });
}
$('.submit').on('click', getLatLng);

//Put yelp query function here
function runQuery(latLong) {

    var queryURL = 'https://cors-anywhere.herokuapp.com/' + 'https://nu-yelp-api.herokuapp.com/api/all/' + latLong + '/1/3219';
    var restaurantCounter = 0;

    console.log(queryURL);

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (yelpData) {

        //make the yelpData into an object
        var yelpObj = JSON.parse(yelpData);
        console.log(yelpObj);

        for (var i = 0; i < 10; i++) {
            restaurantCounter++;
            console.log(yelpObj.businesses[i].name);

            var newResult = $('<div>');
            newResult.addClass('result');
            newResult.attr('id', 'restaurant-' + restaurantCounter);
            $('.search-results').append(newResult);

            var name = newResult.text(restaurantCounter + '. ' + yelpObj.businesses[i].name).attr('id', 'restName-' + yelpObj.businesses[i].name);
            // name.val(yelpObj.businesses[i].name);
            //favorites button addition to main.js
            // var favButton = $('<input type="button" value="add to favs" class="btn btn-default favorites" />').attr("data-index", i);
            var favButton = $('<button>');
            favButton.attr('id', restaurantCounter);
            favButton.attr('class', 'favBox btn btn-default');
            favButton.attr("data-name", yelpObj.businesses[i].name);
            favButton.attr("data-url", yelpObj.businesses[i].url);
            favButton.append("add to favs");
            // favButton.attr("#listNum-" + restaurantCounter);
            name.prepend(favButton);
            var address = newResult.append(yelpObj.businesses[i].location.display_address);
            var rating = newResult.append(yelpObj.businesses[i].rating);
            var link = newResult.append(yelpObj.businesses[i].link);
            if (yelpObj.businesses[i].is_closed === false) {
                var openNow = newResult.append('Open Now');
            }


        }

    });

};


var favorites = JSON.parse(localStorage.getItem("savedplaces"));

if (!Array.isArray(favorites)) {
    favorites = [];
}

function saveRestaurant(event){

    event.preventDefault();

    var rest = $(this).attr('data-name');
    var link = $(this).attr('data-url');
    link = '  <a target="_blank" href=' + link + '>' + "Link to Yelp" + '</a>';
    var save = [rest, link];
        console.log("link", link);
        console.log("rest", rest);
    favorites.push(save);
        console.log("faves", favorites);
    localStorage.setItem("savedplaces", JSON.stringify(favorites));

putOnPage();
}

$(document).on("click", ".favBox", saveRestaurant);


function putOnPage () {
    $(".saved-list").empty();


    var insideFavorites = JSON.parse(localStorage.getItem("savedplaces"));

    if (!Array.isArray(insideFavorites)){
        insideFavorites = [];
            console.log("inside1", insideFavorites);
    }
    for (var i = 0; i < insideFavorites.length; i++) {
        var name = $("<p>").append(insideFavorites[i]);
        var remove = $("<button class='delete'>").text("Remove").attr("data-index", i);
        name.prepend(remove);
        $(".saved-list").append(name);
        // $(".saved-places").append(insideFavorites[i]);
    }
    
}
putOnPage();

$(document).on("click", "button.delete", function() {
    var favelist = JSON.parse(localStorage.getItem("savedplaces"));
    var currentIndex = $(this).attr("data-index");

    favelist.splice(currentIndex, 1);
    favorites = favelist;

    localStorage.setItem("savedplaces", JSON.stringify(favelist));

    putOnPage();
  });

    