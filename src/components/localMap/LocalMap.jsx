import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';

import './local-map.module.css';

/* 
incorporate laundry services via: 
https://developers.google.com/maps/documentation/places/web-service/nearby-search
*/

function LocalMap() {
  const position = { lat: 61.2176, lng: -149.8997 };
  const APIKey = import.meta.env.VITE_APIKEY;

  return (
    <APIProvider apiKey={APIKey}>
      <Map defaultCenter={position} zoom={10}>
        <Marker position={position} />
      </Map>
    </APIProvider>
  );
}

export default LocalMap;
