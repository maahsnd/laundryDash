import { APIProvider, Map } from '@vis.gl/react-google-maps';
import { useState, useEffect } from 'react';
import './local-map.module.css';
import MarkerWithInfoWindow from '../markerWithInfoWindow/MarkerWithInfoWindow.jsx';
import getUserLocation from '../../getUserLocation';
import Autocomplete from '../autocomplete/Autocomplete.jsx';
import LocationButton from '../locationBtn/locationBtn.jsx';
import styles from './local-map.module.css';

/* 
Get location, pass to fetch laundry services
*/

function LocalMap() {
  const [position, setPosition] = useState({ lat: 61.2176, lng: -149.8997 });
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
      <div className={styles.mapContainer}>
        <APIProvider apiKey={APIKey}>
          <div className={styles.locationSelectors}>
            <Autocomplete onPlaceSelect={setPosition} />
            <LocationButton onClickHandler={getLocationFromNavigator} />
          </div>

          <Map
            defaultCenter={position}
            zoom={currentZoom}
            onZoomChanged={(newZoom) => setCurrentZoom(newZoom)}
            mapId={MAPID}
            key={`${position.lat},${position.lng}`}
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
        </APIProvider>
      </div>
    </>
  );
}

export default LocalMap;
