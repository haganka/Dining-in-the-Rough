//Geolocation function
$(function(){
    getLocation(navigator.geolocation);
});

var latLong = '';

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

    var latLong = latitude + "/" + longitude; 
    console.log(latLong);   
    return latLong;

}

$('#useLocation').on('click', getLocation);
//Put zip code function
