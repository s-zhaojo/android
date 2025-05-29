import React from 'react';
import MapComponent from './components/MapComponent';
import 'mapbox-gl/dist/mapbox-gl.css';

function App() {
  return (
    <div>
      <h1>GPS Tracker</h1>
      <MapComponent />
    </div>
  );
}

export default App;