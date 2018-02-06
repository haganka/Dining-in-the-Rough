var map;
var latLong = '';
//This is the initial map view upon loading
function initMap() {
    var userLocation = { lat: 41.89633, lng: -87.61871 };
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: userLocation,
        gestureHandling: 'cooperative'
    });
}
//Get Location
function getLocation(e) {
    e.preventDefault();
    console.log("running");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        $('.search-box').text("Geolocation is not supported by this browser. Please enter a zip code.");
    }
}
//enhance: add error handling for geolocation
function showPosition(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    latLong = latitude + "/" + longitude;
    updateMap();
    runQuery(latLong);
    return latLong;
}
$('#useLocation').on('click', getLocation);
// Update Google Map with a view of the location requested by user
function updateMap() {
    var mapSplit = latLong.split("/");
    console.log("mapSplit", mapSplit);
    var userLocation = { lat: parseFloat(mapSplit[0]), lng: parseFloat(mapSplit[1]) };
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: userLocation,
        gestureHandling: 'cooperative'
    });
    //Turning this off - may use this as a custom marker for user position
    var marker = new google.maps.Marker({
        position: userLocation,
        map: map,
        title: 'User'
    });
}
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
        console.log("response", response);
        console.log(response.status);

        if (response.status === "ZERO_RESULTS")
            {
            //  $('#status').css( 'display', 'block').html('<h3>' + 'Bad Zip Code - Try again' + '</h3>');
         console.log("error in getting lat/long from zip");
            }else
           
           {
                latLong = response.results[0].geometry.location.lat + '/' + response.results[0].geometry.location.lng;
                console.log(latLong);
                runQuery(latLong);
            }
      });
      // clears out html at location-input
      $('#location-input').val('');
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
    }).then(function(yelpData) {
        //make the yelpData into an object
        var yelpObj = JSON.parse(yelpData);
        console.log(yelpObj);

        for (var i = 0; i < 10; i++){
            restaurantCounter++;
            var newResult = $('<div>');
            newResult.addClass('result');
            newResult.attr('id', 'restaurant-' + restaurantCounter);
            $('.search-results').append(newResult);
            var resultOutput = '<p class="title">' + restaurantCounter + '. ' + yelpObj.businesses[i].name + '</p>' +
                '<p class="address">' + yelpObj.businesses[i].location.display_address[0] + ', ' + yelpObj.businesses[i].location.display_address[1] + '</p>' +
                `<p class=rating${i}>` + '</p>' +
                '<p class="reviews"><a target="_blank" href=' + yelpObj.businesses[i].url + '>' + 'Based on ' + yelpObj.businesses[i].review_count + ' Reviews' + '</a></p>';
            var favButton = $('<button>');
            favButton.attr('id', restaurantCounter);
            favButton.attr('class', 'favBox btn btn-default');
            favButton.attr("data-name", yelpObj.businesses[i].name);
            favButton.attr("data-url", yelpObj.businesses[i].url);
            favButton.append("add to favs");
            newResult.html(resultOutput);
            var imageLinks = [
                '<img src="assets/images/regular/regular_5.png" alt="5 stars">',
                '<img src="assets/images/regular/regular_4_half.png" alt="4.5 stars">',
                '<img src="assets/images/regular/regular_4.png" alt="4 stars">',
                '<img src="assets/images/regular/regular_3_half.png" alt="3.5 stars">',
                '<img src="assets/images/regular/regular_3.png" alt="3 stars">',
                '<img src="assets/images/regular/regular_2_half.png" alt="2.5 stars">',
                '<img src="assets/images/regular/regular_2.png" alt="2 stars">',
                '<img src="assets/images/regular/regular_1_half.png" alt="1.5 stars">',
                '<img src="assets/images/regular/regular_1.png" alt="1 star">'
            ];
            if (yelpObj.businesses[i].rating === 5) {
                $('.rating' + i).html(imageLinks[0]);
            } else if (yelpObj.businesses[i].rating === 4.5) {
                $('.rating' + i).html(imageLinks[1]);
            } else if (yelpObj.businesses[i].rating === 4) {
                $('.rating' + i).html(imageLinks[2]);
            } else if (yelpObj.businesses[i].rating === 3.5) {
                $('.rating' + i).html(imageLinks[3]);
            } else if (yelpObj.businesses[i].rating === 3) {
                $('.rating' + i).html(imageLinks[4]);
            } else if (yelpObj.businesses[i].rating === 2.5) {
                $('.rating' + i).html(imageLinks[5]);
            } else if (yelpObj.businesses[i].rating === 2) {
                $('.rating' + i).html(imageLinks[6]);
            } else if (yelpObj.businesses[i].rating === 1.5) {
                $('.rating' + i).html(imageLinks[7]);
            } else if (yelpObj.businesses[i].rating === 1) {
                $('.rating' + i).html(imageLinks[8]);
            }
            newResult.prepend(favButton);
        }
        /* Update Map with location after location is entered */
        updateMap();
        for (var i = 0; i < 10; i++) {
            var infowindow = new google.maps.InfoWindow();
            var myLatLng = new google.maps.LatLng((yelpObj.businesses[i].coordinates.latitude), (yelpObj.businesses[i].coordinates.longitude));
            var marker = new google.maps.Marker({
                position: myLatLng,
                map: map,
                animation: google.maps.Animation.DROP,
            });
        
            var link = $(this).attr('data-url');
            link = '  <a target="_blank" href=' + link + '>' + "Link to Yelp" + '</a>';
            var content ='<div class="info-window">'
            + '<h4>' + yelpObj.businesses[i].name + '</h4>'
            + '<p>' +  yelpObj.businesses[i].location.display_address[0] + ', ' + yelpObj.businesses[i].location.display_address[1] + '</p>'
            + '<p>' + link + '</p>'
            + '</div>';
            console.log("content", content);

            // if (yelpObj.businesses[i].is_closed === false){
            //     newResult.append('<p class="open">Open Now</p>');
            //     var open = "Open Now";
            // }else{
            //     open = "Closed";
            // };

            var infowindow = new google.maps.InfoWindow({});
                // google.maps.event.addListener(marker, 'click', function() {
                //   info_window.open(map, marker);
            google.maps.event.addListener(marker,'click', (function(marker,content,infowindow){ 
                    return function() {
                    infowindow.setContent(content);
                    console.log(open);
                    infowindow.open(map,marker);
                    };
                })(marker,content,infowindow)); 

            }

    });
}