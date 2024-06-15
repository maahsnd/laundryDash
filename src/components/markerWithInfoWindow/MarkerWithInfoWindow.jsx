import React, { useState } from "react";
import {
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef,
  Pin,
} from "@vis.gl/react-google-maps";
import styles from "./marker-with-info-window.module.css";

function MarkerWithInfowindow({
  placeData,
  selectedServiceUri,
  useLoopiePin = false,
}) {
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
          lng: placeData.location.longitude,
        }}
        title={placeData.displayName.text}
        zIndex={useLoopiePin ? 10 : 1}
      >
        {useLoopiePin ? (
          <Pin
            background={"var(--main-color)"}
            borderColor={"white"}
            glyphColor={"white"}
          />
        ) : selectedServiceUri === placeData.googleMapsUri ? (
          <Pin borderColor={"red"} background={"white"} />
        ) : (
          <Pin />
        )}
      </AdvancedMarker>

      {infowindowOpen && (
        <InfoWindow
          anchor={marker}
          maxWidth={400}
          onCloseClick={() => setInfowindowOpen(false)}
        >
          <div className={styles.infoCard}>
            <h4>
              <a href={placeData.googleMapsUri} target="_blank">
                {placeData.displayName.text}
              </a>
            </h4>
            <p>{placeData.shortFormattedAddress}</p>
            {placeData.nationalPhoneNumber && (
              <p>{placeData.nationalPhoneNumber}</p>
            )}
            <p>
              Rating: {placeData.rating}/5{" "}
              <span style={{ color: "grey" }}>
                ({placeData.userRatingCount} reviews)
              </span>
            </p>
            {placeData.currentOpeningHours && <p>{getCurrentDayHours()}</p>}
            {placeData.websiteUri && (
              <a href={placeData.websiteUri} target="_blank">
                {placeData.websiteUri}
              </a>
            )}
          </div>
        </InfoWindow>
      )}
    </>
  );
}

export default MarkerWithInfowindow;
