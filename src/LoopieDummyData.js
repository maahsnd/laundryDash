function createService(
  googleMapsUri,
  websiteUri,
  shortFormattedAddress,
  rating,
  userRatingCount,
  serviceDisplayName
) {
  return {
    displayName: { text: serviceDisplayName },

    rating: rating,
    googleMapsUri: googleMapsUri,
    shortFormattedAddress: shortFormattedAddress,
    userRatingCount: userRatingCount,
    websiteUri: websiteUri
  };
}

const servicesByZip = {
  98144: '',
  98108: '',
  98122: '',
  98070: ''
};

for (const zip of servicesByZip) {
  const services = [];
  for (let i = 0; i < 3; i++) {
    const loopieService = createService(
      'https://www.google.com/maps/place/Loopie+Laundry/@36.9717026,-121.0665008,4z/data=!3m1!4b1!4m6!3m5!1s0x549015908aee4fd1:0x5a9c65c57b4fbe89!8m2!3d38.9169694!4d-99.8730784!16s%2Fg%2F11g10mt9x6?entry=ttu',
      'https://loopielaundry.app/dashboard',
      'Picks up at your address',
      '5.0',
      '25',
      'Loopie Wash and Fold'
    );
    services.push(loopieService);
  }
  servicesByZip[zip] = services;
}

export default servicesByZip;
