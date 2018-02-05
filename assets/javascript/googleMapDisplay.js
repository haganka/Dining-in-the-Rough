/*

Display Google Map on Page, and markers for places

*/

/* Call back function */
// Test Lat/Long - 39.7701723/-94.8397698

function initMap() {
    var userLocation = {lat: 39.7701723, lng: -94.8397698};
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 13,
      center: userLocation,
      gestureHandling: 'cooperative'
    });
    var marker = new google.maps.Marker({
      position: userLocation,
      map: map,
      title: 'User'
    });
  }
  