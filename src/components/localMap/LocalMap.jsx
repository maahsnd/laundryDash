import styles from './local-map.module.css';
import { useState, useEffect } from 'react';
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import logo from '../../assets/LoopieLogo.png';
import DiscountDisplay from '../discountCode/DiscountDisplay.jsx';
import ListView from '../listView/ListView.jsx';
import MarkerWithInfoWindow from '../markerWithInfoWindow/MarkerWithInfoWindow.jsx';
import LoadingDisplay from '../loadingDisplay/LoadingDisplay.jsx';
import getUserLocation from '../../getUserLocation';
import reverseGeoCode from '../../reverseGeoCode.js';
import getPlacesLaundry from '../../getPlacesLaundry.js';
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

  // Get user zip code to determine Loopie service options
  useEffect(() => {
    setLoopieLoaded(false);
    const getLoopieServices = async () => {
      const zip = await reverseGeoCode(position.lat, position.lng, APIKey);
      if (zip in servicesByZip) {
        if (servicesByZip[zip].loopie.length > 0) {
          const loopieService = {
            ...servicesByZip[zip].loopie[0],
            location: { latitude: position.lat, longitude: position.lng }
          };
          setLoopieServices([loopieService]);
        }
        if (servicesByZip[zip].sponsored.length > 0) {
          setSponsoredServicesIds(servicesByZip[zip].sponsored);
        }
      } else {
        setLoopieServices([]);
        setSponsoredServicesIds([]);
      }
      setLoopieLoaded(true);
    };

    getLoopieServices();
  }, [position]);

  useEffect(() => {
    const fetchLaundryServices = async () => {
      setLaundryLoaded(false);
      const data = await getPlacesLaundry(position, 20, 5000);
      setLaundryServices(data);
      setLaundryLoaded(true);
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
              {!loopieLoaded || !laundryLoaded ? (
                <LoadingDisplay loadingFor={'map'} />
              ) : (
                <Map
                  defaultCenter={position}
                  zoom={currentZoom || 12}
                  onZoomChanged={(newZoom) => {
                    setCurrentZoom(parseInt(newZoom) || 12);
                  }}
                  mapId={MAPID}
                  key={`${position.lat},${position.lng}`}
                  className={styles.map}
                >
                  {loopieServices.length !== 0 && (
                    <MarkerWithInfoWindow
                      placeData={loopieServices[0]}
                      key={'loopiemarker'}
                      useLoopiePin={true}
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
              )}
            </div>
            {!loopieLoaded || !laundryLoaded ? (
              <LoadingDisplay loadingFor={'list'} />
            ) : (
              <ListView
                laundryServices={laundryServices}
                sponsoredServices={sponsoredServicesIds}
                loopieServices={loopieServices}
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
