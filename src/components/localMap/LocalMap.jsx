import styles from './local-map.module.css';
import { useState, useEffect } from 'react';
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import logo from '../../assets/LoopieLogo.png';
import DiscountDisplay from '../discountCode/DiscountDisplay.jsx';
import ListView from '../listView/ListView.jsx';
import MarkerWithInfoWindow from '../markerWithInfoWindow/MarkerWithInfoWindow.jsx';
import getUserLocation from '../../getUserLocation';
import Autocomplete from '../autocomplete/Autocomplete.jsx';
import LocationButton from '../locationBtn/locationBtn.jsx';

function LocalMap() {
  const [position, setPosition] = useState({
    lat: 47.6061389,
    lng: -122.3328481
  });
  const [laundryServices, setLaundryServices] = useState([]);
  const [currentZoom, setCurrentZoom] = useState(12);

  const APIKey = import.meta.env.VITE_APIKEY;
  const MAPID = import.meta.env.VITE_MAPID;
  const googlePlacesURL =
    'https://places.googleapis.com/v1/places:searchNearby';

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
          <img className={styles.logo} src={logo} alt="Loopie Logo" />
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
                zoom={currentZoom}
                onZoomChanged={(newZoom) => setCurrentZoom(newZoom)}
                mapId={MAPID}
                key={`${position.lat},${position.lng}`}
                className={styles.map}
              >
                {laundryServices.length !== 0 &&
                  laundryServices.map((service, index) => (
                    <MarkerWithInfoWindow
                      index={index}
                      placeData={service}
                      key={service.id}
                    />
                  ))}
              </Map>
            </div>

            <ListView
              laundryServices={laundryServices}
              sponsoredServices={[]}
              loopieServices={[]}
              position={position}
            />
          </div>
        </APIProvider>
      </div>
    </>
  );
}

export default LocalMap;
