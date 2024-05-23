async function getPlacesLaundry(position, maxResults, searchRadius) {
  const APIKey = import.meta.env.VITE_APIKEY;
  const GOOGLEPLACESURL =
    'https://places.googleapis.com/v1/places:searchNearby';

  const reqBody = {
    includedTypes: ['laundry'],
    maxResultCount: maxResults,
    locationRestriction: {
      circle: {
        center: {
          latitude: position.lat,
          longitude: position.lng
        },
        radius: searchRadius
      }
    }
  };

  try {
    const response = await fetch(GOOGLEPLACESURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': APIKey,
        'X-Goog-FieldMask': '*'
      },
      body: JSON.stringify(reqBody)
    });
    const data = await response.json();
    if (!response.ok || !data.places) {
      alert(
        "Sorry, Google couldn't find that address. We know it's annoying, and we're working on it. Please try a different address, or our autolocate button."
      );
      throw new Error('Network response was not ok');
    } else {
      return data.places;
    }
  } catch (err) {
    console.error('Error : ', err);
  }
}

export default getPlacesLaundry;
