import { useState, useEffect } from 'react';
import styles from './local-map.module.css';

// Google imports
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import Autocomplete from '../autocomplete/Autocomplete.jsx';

// Display assets
import logo from '../../assets/LoopieLogo.png';
import LocationButton from '../locationBtn/locationBtn.jsx';

//Components
import DiscountDisplay from '../discountCode/DiscountDisplay.jsx';
import ListView from '../listView/ListView.jsx';
import MarkerWithInfoWindow from '../markerWithInfoWindow/MarkerWithInfoWindow.jsx';
import LoadingDisplay from '../loadingDisplay/LoadingDisplay.jsx';

//Helpers
import getUserLocation from '../../locationHelpers/getUserLocation.js';
import reverseGeoCode from '../../locationHelpers/reverseGeoCode.js';
import getPlacesLaundry from '../../laundryFetchHelpers/getPlacesLaundry.js';
import getLoopieServices from '../../laundryFetchHelpers/getLoopieServices.js';
import getSponsoredServices from '../../laundryFetchHelpers/getSponsoredServices.js';

function LocalMap() {
  const [position, setPosition] = useState({
    lat: 47.6061389,
    lng: -122.3328481
  });
  const [currentZoom, setCurrentZoom] = useState(12);
  const [loopieServices, setLoopieServices] = useState([]);
  const [sponsoredServicesIds, setSponsoredServicesIds] = useState([]);
  const [laundryServices, setLaundryServices] = useState([]);
  const [loopieLoaded, setLoopieLoaded] = useState(false);
  const [laundryLoaded, setLaundryLoaded] = useState(false);

  const APIKey = import.meta.env.VITE_APIKEY;
  const MAPID = import.meta.env.VITE_MAPID;

  useEffect(() => {
    setLoopieLoaded(false);

    const fetchLoopieServices = async () => {
      const zipCode = await reverseGeoCode(position, APIKey);
      const loopieData = getLoopieServices(zipCode, position);
      setLoopieServices(loopieData);
      const sponsoredData = getSponsoredServices(zipCode);
      setSponsoredServicesIds(sponsoredData);
    };

    fetchLoopieServices();
    setLoopieLoaded(true);
  }, [position]);

  useEffect(() => {
    setLaundryLoaded(false);

    const fetchLaundryServices = async () => {
      const data = await getPlacesLaundry(position, 20, 5000);
      setLaundryServices(data);
    };

    fetchLaundryServices();
    setLaundryLoaded(true);
  }, [position]);

  useEffect(() => {
    setCurrentZoom(12);
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
                  zoom={currentZoom}
                  onZoomChanged={(newZoom) => {
                    setCurrentZoom(newZoom);
                  }}
                  mapId={MAPID}
                  key={`${position.lat},${position.lng}`}
                  className={styles.map}
                >
                  {laundryServices.length !== 0 &&
                    laundryServices.map((service) => (
                      <MarkerWithInfoWindow
                        placeData={service}
                        key={service.id}
                      />
                    ))}
                  {loopieServices.length !== 0 && (
                    <MarkerWithInfoWindow
                      placeData={loopieServices[0]}
                      key={'loopiemarker'}
                      useLoopiePin={true}
                    />
                  )}
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
