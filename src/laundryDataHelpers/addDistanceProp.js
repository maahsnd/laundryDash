export default function addDistance(position, laundryServices) {
  const arrPlusDistanceProp = laundryServices.map((el) => {
    return {
      ...el,
      distanceFromUser: calculateDistance(
        position.lat,
        position.lng,
        el.location.latitude,
        el.location.longitude
      )
    };
  });
  return arrPlusDistanceProp;
}
