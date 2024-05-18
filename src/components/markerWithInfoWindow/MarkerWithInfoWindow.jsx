import React, { useState } from 'react';
import {
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef
} from '@vis.gl/react-google-maps';
import styles from './marker-with-info-window.module.css';

function MarkerWithInfowindow({ index, placeData }) {
  const [infowindowOpen, setInfowindowOpen] = useState(false);
  const [markerRef, marker] = useAdvancedMarkerRef();
  function getCurrentDayHours() {
    const date = new Date();
    let dayIndex = date.getDay(); // JavaScript's getDay() returns 0 for Sunday, 1 for Monday, ..., 6 for Saturday

    // Adjust index to match Monday == 0, Sunday == 6
    dayIndex === 0 ? (dayIndex = 6) : (dayIndex -= 1);

    return placeData.currentOpeningHours.weekdayDescriptions[dayIndex];
  }

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        onClick={() => setInfowindowOpen(true)}
        position={{
          lat: placeData.location.latitude,
          lng: placeData.location.longitude
        }}
        title={placeData.displayName.text}
      />
      {infowindowOpen && (
        <InfoWindow
          anchor={marker}
          maxWidth={400}
          onCloseClick={() => setInfowindowOpen(false)}
        >
          <div className={styles.infoCard}>
            <h4>
              <a href={placeData.googleMapsUri}>{placeData.displayName.text}</a>
            </h4>
            <p>{placeData.shortFormattedAddress}</p>
            <p>{placeData.nationalPhoneNumber}</p>
            <p>
              Rating: {placeData.rating}/5{' '}
              <span style={{ color: 'grey' }}>
                ({placeData.userRatingCount} reviews)
              </span>
            </p>
            <p>{getCurrentDayHours()}</p>
            {placeData.websiteUri && (
              <a href={placeData.websiteUri}>{placeData.websiteUri}</a>
            )}
          </div>
        </InfoWindow>
      )}
    </>
  );
}

export default MarkerWithInfowindow;
