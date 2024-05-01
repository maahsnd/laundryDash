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
        alert('Ensure you have enabled location access for you browser');
        console.error('Geolocation error:', error);
        reject(coords);
      }
    );
  });
};

export default getUserLocation;
