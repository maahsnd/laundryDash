import React, { useRef, useEffect, useState } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import styles from './autocomplete.module.css';

// This is the classic "Place Autocomplete" widget.
// https://github.com/visgl/react-google-maps/blob/main/examples/autocomplete/src/app.tsx
const Autocomplete = ({ onPlaceSelect }) => {
  const [placeAutocomplete, setPlaceAutocomplete] = useState(null);
  const inputRef = useRef(null);
  const places = useMapsLibrary('places');

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const options = {
      fields: ['geometry', 'name', 'formatted_address']
    };

    setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
  }, [places]);

  useEffect(() => {
    if (!placeAutocomplete) return;

    const listener = placeAutocomplete.addListener('place_changed', () => {
      const place = placeAutocomplete.getPlace();

      onPlaceSelect({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      });
    });

    return () => {
      google.maps.event.removeListener(listener);
    };
  }, [placeAutocomplete, onPlaceSelect]);

  return (
    <div className={styles.autocompleteContainer}>
      <input ref={inputRef} />
    </div>
  );
};

export default Autocomplete;
