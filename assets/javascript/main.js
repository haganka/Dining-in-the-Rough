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
//Get Location
function getLocation(e) {
    e.preventDefault();
    
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

//Put yelp query function here
function runQuery(latLong) {

    //clear out search results 
    $('.search-results').empty('');

    var queryURL = 'https://cors-anywhere.herokuapp.com/' + 'https://nu-yelp-api.herokuapp.com/api/all/' + latLong + '/1/3219';
    var restaurantCounter = 0;
    console.log(queryURL);
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(yelpData) {

        //make the yelpData into an object
        var yelpObj = JSON.parse(yelpData);

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
                var imageAppend = '<div class="col-md-4"><img class="img-responsive imageThumbs" + src=' + image + '></div>' 
                var resultOutput = `<div col-md-8 id=${id} class="result-box"><p class="title">` + restaurantCounter + '. ' + yelpObj.businesses[i].name + '</p>' +
                    '<p class="address">' + yelpObj.businesses[i].location.display_address[0] + ', ' + yelpObj.businesses[i].location.display_address[1] + '</p>' +
                    `<p class=rating${i}>` + '</p>';
                    
                var favButton = $('<button><img class="burger-icon" src="assets/images/burger.png" alt="burger icon" /></button>');
                favButton.attr('id', restaurantCounter);
                favButton.attr('class', 'favBox button');
                favButton.attr("data-name", yelpObj.businesses[i].name);
                favButton.attr("data-url", yelpObj.businesses[i].url);
               
                    var open = false
                    if (yelpObj.businesses[i].is_closed === false){
                        open = true 
                    }

                    if (open){
                        resultOutput += "<p class='open'>Open Now</p></div>";
                    }else{
                        resultOutput += "<p class='closed'>Closed</p></div>";
                    }
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

                var anchorTag = '     <a class= "review" target="_blank" href=' + yelpObj.businesses[i].url + '>' + '    Based on ' + yelpObj.businesses[i].review_count + ' Reviews' + '</a>'
                if (yelpObj.businesses[i].rating === 5) {
                    $('.rating' + i).html(imageLinks[0] + anchorTag);
                } else if (yelpObj.businesses[i].rating === 4.5) {
                    $('.rating' + i).html(imageLinks[1] + anchorTag);
                } else if (yelpObj.businesses[i].rating === 4) {
                    $('.rating' + i).html(imageLinks[2] + anchorTag);
                } else if (yelpObj.businesses[i].rating === 3.5) {
                    $('.rating' + i).html(imageLinks[3] + anchorTag);
                } else if (yelpObj.businesses[i].rating === 3) {
                    $('.rating' + i).html(imageLinks[4] + anchorTag);
                } else if (yelpObj.businesses[i].rating === 2.5) {
                    $('.rating' + i).html(imageLinks[5] + anchorTag);
                } else if (yelpObj.businesses[i].rating === 2) {
                    $('.rating' + i).html(imageLinks[6] + anchorTag);
                } else if (yelpObj.businesses[i].rating === 1.5) {
                    $('.rating' + i).html(imageLinks[7] + anchorTag);
                } else if (yelpObj.businesses[i].rating === 1) {
                    $('.rating' + i).html(imageLinks[8] + anchorTag);
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

                // if (yelpObj.businesses[i].is_closed === false){
                //     newResult.append('<p class="open">Open Now</p>');
                //     var open = "Open Now";
                // }else{
                //     open = "Closed";
                // };

                var infowindow = new google.maps.InfoWindow({});

                    var open = false
                    if (yelpObj.businesses[i].is_closed === false){
                        open = true 
                    }

                    if (open){
                        content += "<p class='open'>Open Now</p></div>";
                    }else{
                        content += "<p class='closed'>Closed</p></div>";
                    }

                
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

