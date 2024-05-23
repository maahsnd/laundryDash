async function reverseGeoCode(position, APIKey) {
  try {
    const filters = [['result_type', 'postal_code']];
    //In the event that no filters are used, initial & attaches key. To the same end, each filter has a trailing & to attach key
    let stringifiedFilters = '&';
    filters.forEach((filter) => {
      stringifiedFilters += `${filter[0]}=${filter[1]}&`;
    });

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.lat},${position.lng}${stringifiedFilters}key=${APIKey}`
    );
    const data = await response.json();
    const zip = data.results[0].address_components[0].short_name;
    return zip;
  } catch (err) {
    console.error(err);
  }
}

export default reverseGeoCode;
