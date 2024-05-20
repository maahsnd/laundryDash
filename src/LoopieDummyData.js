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
  98144: { loopie: [], sponsored: '850 Rainier Ave S, Seattle' },
  98108: { loopie: [], sponsored: '' },
  98122: { loopie: [], sponsored: '' },
  98070: { loopie: [], sponsored: '' },
  98164: { loopie: [], sponsored: '850 Rainier Ave S, Seattle' }
};

for (const zip in servicesByZip) {
  const loopieService = createService(
    'https://www.google.com/maps/place/Loopie+Laundry/@36.9717026,-121.0665008,4z/data=!3m1!4b1!4m6!3m5!1s0x549015908aee4fd1:0x5a9c65c57b4fbe89!8m2!3d38.9169694!4d-99.8730784!16s%2Fg%2F11g10mt9x6?entry=ttu',
    'https://loopielaundry.app/dashboard',
    'Picks up at your address!',
    '5.0',
    '25',
    'Loopie Wash and Fold'
  );
  servicesByZip[zip].loopie.push(loopieService);
}

export default servicesByZip;
