import data from './LoopieDummyData.js';

function getSponsoredServices(zip) {
  const sponsoredServicesByZip = data.sponsored;

  return zip in sponsoredServicesByZip && sponsoredServicesByZip[zip].length > 0
    ? sponsoredServicesByZip[zip]
    : [];
}
export default getSponsoredServices;
