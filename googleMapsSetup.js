function initMap() {
  var center = { lat: 47.608013, lng: -122.3328 }; // Update this with your actual coordinates
  var map = new google.maps.Map(document.getElementById('map'), {
    center: center,
    zoom: 15
  });

  var service = new google.maps.places.PlacesService(map);
  var request = {
    location: center,
    radius: '5000',
    type: ['laundry']
  };

  service.nearbySearch(request, function (results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      results.forEach(function (place) {
        createMarker(place, map);
      });
    }
  });
}

function createMarker(place, map) {
  const marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location,
    title: place.name
  });

  var infowindow = new google.maps.InfoWindow({
    content: place.name
  });

  marker.addListener('click', function () {
    infowindow.open(map, marker);
  });
}

window.initMap = initMap; // Expose initMap to the global scope
