var map;
var latLong = '';

//For progress animation - check if ajax is called and if it has completed
$(document).ajaxStart(function(){
    $("#wait").css("visibility", "visible");
});
$(document).ajaxComplete(function(){
    $("#wait").css("visibility", "hidden");
});

//This is the initial map view upon loading
function initMap() {
    var userLocation = { lat: 41.89633, lng: -87.61871 }; 
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: userLocation,
        gestureHandling: 'cooperative'
    });
}
/**
 * This function obtains the user's current location.
 * @param {event} e built-in function that determine if geolocation is supported in browser
 * @param {event} e tells the user that their browser is not compatible with geolocation
 * 
 * @returns position, a parameter needed for the callback function showPosition to get the user's location
 */
function getLocation(e) {
    e.preventDefault();
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        $('.search-box').text("Geolocation is not supported by this browser. Please enter a zip code.");
    }
}

/**
 * This function gives us the user's current location 
 * @param {object} position the Geolocation object that captures the user's location 
 * 
 * @returns the location of the user's device in "latitude/longitude" format needed to run the Yelp ajax request
 */
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
    var icon = "http://maps.google.com/mapfiles/ms/micons/blue-dot.png";
    var marker = new google.maps.Marker({
        position: userLocation,
        map: map,
        title: 'User',
        icon: new google.maps.MarkerImage(icon)
    });
}

var getLatLng = function(event) {

    var APIKey = '&key=AIzaSyCRYYladM1Ui9mjSl2TgmWoTwj_tCO4Lxc';
    event.preventDefault();
    var getZip = $('#location-input').val();

    if (!getZip)
    {
        $('#noLocationModal').modal('show');
    }

    var queryURL = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + getZip;
    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(function(response) {
        console.log("response", response);
        console.log(response.status);

        if (response.status === "ZERO_RESULTS"){
            $('#badZipModal').modal('show');
        }  
            else

           {
                latLong = response.results[0].geometry.location.lat + '/' + response.results[0].geometry.location.lng;
         
                runQuery(latLong);
            }
      });
      // clears out html at location-input
      $('#location-input').val('');
}
$('.submit').on('click', getLatLng);

/**
 * This function makes the yelp ajax request and manipulates the DOM to display the search results
 * @param {string} latLong the user's latitude and longitude combined with a /
 * 
 * @returns results in map and list format
 */
function runQuery(latLong) {

    /**
     * This function empties the search results anytime a new request is performed so that the list only shows 10 results.
     */
    $('.search-results').empty('');

    var queryURL = 'https://cors-anywhere.herokuapp.com/' + 'https://nu-yelp-api.herokuapp.com/api/all/' + latLong + '/1/3219';
    var restaurantCounter = 0;
    console.log(queryURL);
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(yelpData) {

        /** 
        * This function takes the string returned from the ajax request and turns it into a JSON object
        * @param {string} yelpData is the string returned from the ajax request
        * 
        * @returns yelpObj -- the data in a JSON object format
        */
        var yelpObj = JSON.parse(yelpData);
        console.log(yelpObj);

        //error handling - if business array is empty, let's help the user with feedback
        if  (yelpObj.businesses.length === 0){

            $('#noResultModal').modal('show');
        }

        else {

            for (var i = 0; i < 10; i++){
                restaurantCounter++;
                var newResult = $('<div>');
                newResult.addClass('result row');
                newResult.attr('id', 'restaurant-' + restaurantCounter);
                $('.search-results').append(newResult);
                var image = yelpObj.businesses[i].image_url;
                var id = yelpObj.businesses[i].id
                var imageAppend = '<div class="col-md-4 hidden-xs"><img class="img-responsive imageThumbs" + src=' + image + '></div>' 
                var resultOutput = `<div col-md-8 id=${id} class="result-box"><p class="title">` + restaurantCounter + '. ' + yelpObj.businesses[i].name + '</p>' +
                    '<p class="address">' + yelpObj.businesses[i].location.display_address[0] + ', ' + yelpObj.businesses[i].location.display_address[1] + '</p>' +
                    `<p class=rating${i}>` + '</p>';
                    
                var favButton = $('<button><img class="burger-icon" src="assets/images/burger.png" alt="burger icon" /></button>');
                favButton.attr('id', restaurantCounter);
                favButton.attr('class', 'favBox button');
                favButton.attr("data-name", yelpObj.businesses[i].name);
                favButton.attr("data-url", yelpObj.businesses[i].url);
               
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

                var anchorTag = '<a class="review" target="_blank" href=' + yelpObj.businesses[i].url + '>' + '    Based on ' + yelpObj.businesses[i].review_count + ' Reviews' + '</a>'
                
                switch (yelpObj.businesses[i].rating) {
                    case 5:
                        $('.rating' + i).html(imageLinks[0] + anchorTag);
                        break;
                    case 4.5:
                        $('.rating' + i).html(imageLinks[1] + anchorTag);
                        break;
                    case 4:
                        $('.rating' + i).html(imageLinks[2] + anchorTag);
                        break;
                    case 3.5:
                        $('.rating' + i).html(imageLinks[3] + anchorTag);
                        break;
                    case 3:
                        $('.rating' + i).html(imageLinks[4] + anchorTag);
                        break;
                    case 2.5:
                        $('.rating' + i).html(imageLinks[5] + anchorTag);
                        break;
                    case 2:
                        $('.rating' + i).html(imageLinks[6] + anchorTag);
                        break;
                    case 1.5: 
                        $('.rating' + i).html(imageLinks[7] + anchorTag);
                        break;
                    case 1:
                        $('.rating' + i).html(imageLinks[8] + anchorTag);
                        break;
                }
         
                $('#'+ id).append(favButton);
                $('#' + id).append('<span id=favs class=hidden >' + "Add to favorites!" + '</span>');

                newResult.prepend(imageAppend);
                
        }

        $('.favBox').mouseover(function(){
            $(this).siblings("#favs").toggleClass('hidden');
        });
        $('.favBox').mouseout(function(){
            $(this).siblings("#favs").toggleClass('hidden');
        });


        /* Update Map with location after location is entered */
            updateMap();
            var infowindow = new google.maps.InfoWindow();

            for (var i = 0; i < 10; i++) {
                var myLatLng = new google.maps.LatLng((yelpObj.businesses[i].coordinates.latitude), (yelpObj.businesses[i].coordinates.longitude));
                var marker = new google.maps.Marker({
                    position: myLatLng,
                    map: map,
                    animation: google.maps.Animation.DROP,
                });
        

                var link = '<a target="_blank" href=' + yelpObj.businesses[i].url + '>' + "Link to Yelp" + '</a>';
                var content ='<div class="info-window">'
                + '<h4>' + yelpObj.businesses[i].name + '</h4>'
                + '<p>' +  yelpObj.businesses[i].location.display_address[0] + ', ' + yelpObj.businesses[i].location.display_address[1] + '</p>'
                + '<p>' + link + '</p>'
                + '</div>';


                var infowindow = new google.maps.InfoWindow({});
                
                google.maps.event.addListener(marker,'click', (function(marker,content){ 
                        return function() {
                        infowindow.setContent(content);
                        console.log(open);
                        infowindow.open(map,marker);
                        };
                    })(marker,content)); 

            }
        
        }
     
    });
}

