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
    websiteUri: websiteUri,
    loopieService: 1
  };
}

const loopieServicesByZip = {
  98144: [],
  98108: [],
  98122: [],
  98070: [],
  98164: []
};

const sponsoredServicesByZip = {
  98144: ['850 Rainier Ave S, Seattle'],
  98164: ['850 Rainier Ave S, Seattle']
};

for (const zip in loopieServicesByZip) {
  const loopieService = createService(
    'https://loopielaundry.com',
    'https://loopielaundry.app/dashboard',
    'Picks up at your address!',
    '5.0',
    '25',
    'Loopie Wash and Fold'
  );
  loopieServicesByZip[zip].push(loopieService);
}

const data = { loopie: loopieServicesByZip, sponsored: sponsoredServicesByZip };

export default data;
