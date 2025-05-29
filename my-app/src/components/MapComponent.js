import React, { useEffect, useRef, useState } from 'react';
import { GoogleMap, LoadScript, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';

// Replace with your Google Maps API Key
const GOOGLE_MAPS_API_KEY = 'AIzaSyD6HMsrIQ2aL0WOAUuIBnGtNoyGZsr726w';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const MapComponent = () => {
  const [directions, setDirections] = useState(null);
  const [start, setStart] = useState(''); // Start location as a string
  const [end, setEnd] = useState(''); // End location as a string

  const handleDirectionsResponse = (result, status) => {
    if (status === 'OK') {
      setDirections(result);
    } else {
      console.error('Error fetching directions:', status);
      alert('Failed to fetch directions. Please check your locations.');
    }
  };

  const requestDirections = () => {
    if (!start || !end) {
      alert('Please enter both start and end locations.');
      return;
    }
    setDirections(null); // Clear previous directions
  };

  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
      <div>
        <h2>Choose Locations</h2>
        <input
          type="text"
          placeholder="Start Location (e.g., San Francisco, CA)"
          value={start}
          onChange={(e) => setStart(e.target.value)}
        />
        <input
          type="text"
          placeholder="End Location (e.g., Los Angeles, CA)"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
        />
        <button onClick={requestDirections}>Get Directions</button>

        <GoogleMap mapContainerStyle={containerStyle} center={{ lat: 37.7749, lng: -122.4194 }} zoom={10}>
          {start && end && (
            <DirectionsService
              options={{
                destination: end,
                origin: start,
                travelMode: 'DRIVING',
              }}
              callback={handleDirectionsResponse}
            />
          )}
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      </div>
    </LoadScript>
  );
};

export default MapComponent;