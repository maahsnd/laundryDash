import data from './LoopieDummyData.js';

function getLoopieServices(zip, position) {
  const servicesByZip = data.loopie;

  const services = [];

  if (zip in servicesByZip && servicesByZip[zip].length > 0) {
    const loopieService = {
      ...servicesByZip[zip][0],
      location: { latitude: position.lat, longitude: position.lng }
    };
    services.push(loopieService);
  }

  return services;
}
export default getLoopieServices;
