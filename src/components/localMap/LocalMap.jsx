import styles from './local-map.module.css';
import { useState, useEffect } from 'react';
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import logo from '../../assets/LoopieLogo.png';
import DiscountDisplay from '../discountCode/DiscountDisplay.jsx';
import ListView from '../listView/ListView.jsx';
import MarkerWithInfoWindow from '../markerWithInfoWindow/MarkerWithInfoWindow.jsx';
import getUserLocation from '../../getUserLocation';
import reverseGeoCode from '../../reverseGeoCode.js';
import Autocomplete from '../autocomplete/Autocomplete.jsx';
import LocationButton from '../locationBtn/locationBtn.jsx';

import servicesByZip from '../../LoopieDummyData.js';

function LocalMap() {
  const [position, setPosition] = useState({
    lat: 47.6061389,
    lng: -122.3328481
  });
  const [loopieServices, setLoopieServices] = useState([]);
  const [sponsoredServicesIds, setSponsoredServicesIds] = useState([]);
  const [laundryServices, setLaundryServices] = useState([]);
  const [loopieLoaded, setLoopieLoaded] = useState(false);
  const [laundryLoaded, setLaundryLoaded] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(12);

  const APIKey = import.meta.env.VITE_APIKEY;
  const MAPID = import.meta.env.VITE_MAPID;

  const googlePlacesURL =
    'https://places.googleapis.com/v1/places:searchNearby';

  // Get user zip code to determine Loopie service options
  useEffect(() => {
    const getLoopieServices = async () => {
      const zip = await reverseGeoCode(position.lat, position.lng, APIKey);
      if (zip in servicesByZip) {
        if (servicesByZip[zip].loopie.length > 0) {
          const loopieService = {
            ...servicesByZip[zip].loopie[0],
            location: { latitude: position.lat, longitude: position.lng }
          };
          setLoopieServices(loopieService);
        }
        if (servicesByZip[zip].sponsored.length > 0) {
          setSponsoredServicesIds(servicesByZip[zip].sponsored);
        }
      }
      setLoopieLoaded(true);
    };

    getLoopieServices();
  }, [position]);

  useEffect(() => {
    const fetchLaundryServices = async () => {
      const reqBody = {
        includedTypes: ['laundry'],
        maxResultCount: 10,
        locationRestriction: {
          circle: {
            center: {
              latitude: position.lat,
              longitude: position.lng
            },
            radius: 5000
          }
        }
      };

      try {
        const response = await fetch(googlePlacesURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': APIKey,
            'X-Goog-FieldMask': '*'
          },
          body: JSON.stringify(reqBody)
        });
        const data = await response.json();
        setLaundryServices(data.places);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        setLaundryLoaded(true);
      } catch (err) {
        console.error('Error : ', err);
      }
    };
    fetchLaundryServices();
  }, [position]);

  const getLocationFromNavigator = async () => {
    const location = await getUserLocation(position);
    setPosition(location);
  };

  return (
    <>
      <div className={styles.pageContainer}>
        <div className={styles.logoContainer}>
          <a href="https://loopielaundry.com/" target="__none">
            <img className={styles.logo} src={logo} alt="Loopie Logo" />
          </a>

          <h1 className={styles.logoHeader}>
            Streamline Your Laundry Experience with LaundryDash.ai: Your
            Ultimate Wash and Fold Navigator
          </h1>
          <DiscountDisplay discountCode={'NODISCOUNT'} />
        </div>
        <APIProvider apiKey={APIKey}>
          <div className={styles.locationSelectors}>
            <Autocomplete onPlaceSelect={setPosition} />
            <LocationButton onClickHandler={getLocationFromNavigator} />
          </div>

          <div className={styles.mapAndListWrap}>
            <div className={styles.mapContainer}>
              <Map
                defaultCenter={position}
                zoom={currentZoom || 12}
                onZoomChanged={(newZoom) => setCurrentZoom(newZoom)}
                mapId={MAPID}
                key={`${position.lat},${position.lng}`}
                className={styles.map}
              >
                {loopieServices.length !== 0 && (
                  <MarkerWithInfoWindow
                    placeData={loopieServices}
                    key={'loopiemarker'}
                  />
                )}
                {laundryServices.length !== 0 &&
                  laundryServices.map((service) => (
                    <MarkerWithInfoWindow
                      placeData={service}
                      key={service.id}
                    />
                  ))}
              </Map>
            </div>
            {loopieLoaded && laundryLoaded && (
              <ListView
                laundryServices={laundryServices}
                sponsoredServices={sponsoredServicesIds}
                loopieServices={[loopieServices]}
                position={position}
              />
            )}
          </div>
        </APIProvider>
      </div>
    </>
  );
}

export default LocalMap;
