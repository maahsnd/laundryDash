const getUserLocation = (defaultCoords) => {
  return new Promise((resolve, reject) => {
    const coords = { lat: defaultCoords.lat, lng: defaultCoords.lng };
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        coords.lat = pos.coords.latitude;
        coords.lng = pos.coords.longitude;
        resolve(coords);
      },
      (error) => {
        alert(
          'Sorry, we were unable to access your location. Please either type it in, or enable browser location access in settings.'
        );
        console.error('Geolocation error:', error);
        reject(coords);
      }
    );
  });
};

export default getUserLocation;
