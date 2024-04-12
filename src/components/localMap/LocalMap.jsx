import { APIProvider, Map } from '@vis.gl/react-google-maps';
import { useState, useEffect } from 'react';
import './local-map.module.css';
import MarkerWithInfoWindow from '../MarkerWithInfoWindow';

/* 
incorporate laundry services via: 
https://developers.google.com/maps/documentation/places/web-service/nearby-search
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
        console.log(data.places);
        setLaundryServices(data.places);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
      } catch (err) {
        console.error('Error : ', err);
      }
    };
    fetchLaundryServices();
  }, []);

  return (
    <APIProvider apiKey={APIKey}>
      <Map
        defaultCenter={position}
        zoom={currentZoom}
        onZoomChanged={(newZoom) => setCurrentZoom(newZoom)}
        mapId={MAPID}
      >
        {laundryServices.length !== 0 &&
          laundryServices.map((service, index) => (
            <MarkerWithInfoWindow index={index} placeData={service} />
          ))}
      </Map>
    </APIProvider>
  );
}

export default LocalMap;
