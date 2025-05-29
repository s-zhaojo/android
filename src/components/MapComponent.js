import React, { useState } from 'react';
import { GoogleMap, LoadScript, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import './styles.css'; // Import the CSS

const GOOGLE_MAPS_API_KEY = 'AIzaSyD2So3MFuZo2C7B_qfrD1I-3mmaPuzl-rQ';


const containerStyle = {
  width: '100%',
  height: '60vh', // Same height for the map as before
};

const carbonEmissions = {
  car: 0.411, // kg CO2 per mile for a car
  truck: 1.3, // kg CO2 per mile for a truck
  bus: 0.089, // kg CO2 per mile for a bus
  motorcycle: 0.16, // kg CO2 per mile for a motorcycle
  airplane: 0.255, // kg CO2 per mile for an airplane (only for long trips)
};

const transportationCosts = {
  car: 0.13, // $ per mile for a car (avg gas price)
  truck: 0.25, // $ per mile for a truck
  bus: 0.05, // $ per mile for a bus
  motorcycle: 0.08, // $ per mile for a motorcycle
  airplane: 0.15, // $ per mile for an airplane (only for long trips)
};

const speeds = {
  car: 60, // mph
  truck: 50, // mph
  bus: 30, // mph
  motorcycle: 70, // mph
  airplane: 500, // mph (assuming long-distance)
};

const MapComponent = () => {
  const [directions, setDirections] = useState(null);
  const [start, setStart] = useState(''); // Start location as a string
  const [end, setEnd] = useState(''); // End location as a string
  const [isRequestingDirections, setIsRequestingDirections] = useState(false);
  const [distance, setDistance] = useState(null); // Distance in meters
  const [emissions, setEmissions] = useState(null); // Carbon emissions
  const [costs, setCosts] = useState(null); // Cost for different modes
  const [durationsByMode, setDurationsByMode] = useState(null); // Duration for each mode
  const [selectedVehicle, setSelectedVehicle] = useState('car'); // Default to 'car'

  // Add state for total values
  const [totalDistance, setTotalDistance] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [totalEmissions, setTotalEmissions] = useState(0);

  const handleDirectionsResponse = (result, status) => {
    if (status === 'OK') {
      setDirections(result);
      const route = result.routes[0];
      const distInMeters = route.legs[0].distance.value; // distance in meters
      const distInKm = distInMeters / 1000; // Convert meters to kilometers
      const distInMiles = distInKm * 0.621371; // Convert kilometers to miles

      setDistance(distInMeters);

      // Calculate emissions for each mode of transport
      const modeEmissions = {
        car: distInMiles * carbonEmissions.car,
        truck: distInMiles * carbonEmissions.truck,
        bus: distInMiles * carbonEmissions.bus,
        motorcycle: distInMiles * carbonEmissions.motorcycle,
        airplane: distInMiles * carbonEmissions.airplane, // Assuming it's a long-distance trip
      };

      setEmissions(modeEmissions);

      // Calculate costs for each mode of transport
      const modeCosts = {
        car: distInMiles * transportationCosts.car,
        truck: distInMiles * transportationCosts.truck,
        bus: distInMiles * transportationCosts.bus,
        motorcycle: distInMiles * transportationCosts.motorcycle,
        airplane: distInMiles * transportationCosts.airplane, // Assuming it's a long-distance trip
      };

      setCosts(modeCosts);

      // Calculate duration for each mode of transport
      const modeDurations = {};
      Object.keys(speeds).forEach((mode) => {
        const speed = speeds[mode]; // speed in mph
        const durationInHours = distInMiles / speed; // duration in hours
        modeDurations[mode] = `${(durationInHours).toFixed(2)} hours`; // Convert to string with 2 decimal places
      });

      setDurationsByMode(modeDurations);

    } else {
      console.error('Error fetching directions:', status);
      alert('Failed to fetch directions. Please check your locations.');
    }
    setIsRequestingDirections(false); // Stop the directions request process after the response
  };

  const requestDirections = () => {
    if (!start || !end) {
      alert('Please enter both start and end locations.');
      return;
    }
    setIsRequestingDirections(true); // Start directions request
    setDirections(null); // Clear previous directions
    setDistance(null); // Clear previous distance
    setEmissions(null); // Clear previous emissions
    setCosts(null); // Clear previous costs
    setDurationsByMode(null); // Clear previous durations
  };

  const handleModeSelect = (mode) => {
    if (emissions && emissions[selectedVehicle]) {
      setTotalDistance(totalDistance + (distance / 1000)); // Add distance in km
      setTotalCost(totalCost + costs[selectedVehicle]); // Add cost for selected mode
      setTotalEmissions(totalEmissions + emissions[selectedVehicle]); // Add emissions for selected mode
    }
  };


  return (
    <div className="container">
      {/* Sidebar */}
      <div className="sidebar">

        <div className="card">
          <h3>Total Distance</h3>
          <p>{totalDistance.toFixed(2)} km</p>
        </div>
        <div className="card">
          <h3>Total Cost</h3>
          <p>${totalCost.toFixed(2)}</p>
        </div>
        <div className="card">
          <h3>Total CO2 Emissions</h3>
          <p>{totalEmissions.toFixed(2)} kg CO2</p>
        </div>
    </div> 
    

      {/* Main Content */}
      <div className="main-content">
        <div className="header">
          <h1>GPS Trakcer</h1>
          <div className="input-container">
            <input
              className="search-bar"
              type="text"
              placeholder="Start Location (e.g., San Francisco, CA)"
              value={start}
              onChange={(e) => setStart(e.target.value)}
            />
            <input
              className="search-bar"
              type="text"
              placeholder="End Location (e.g., Los Angeles, CA)"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
            />

            <label for="vehicle">Vehicle type:</label>
            <select name="vehicle" id="vehicle" value={selectedVehicle} 
            onChange={(e) => setSelectedVehicle(e.target.value)}
          >
            <option value="car">Car</option>
            <option value="truck">Truck</option>
            <option value="bus">Bus</option>
            <option value="motorcycle">Motorcycle</option>
            <option value="airplane">Airplane</option>
          </select>


            <button onClick={() => {requestDirections();handleModeSelect(selectedVehicle);}}>Get Directions</button>
          </div>
        </div>

        <div className="map-container">
          <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={{ lat: 37.7749, lng: -122.4194 }} // Set static initial center
              zoom={10} // Keep zoom level static
            >
              {isRequestingDirections && start && end && (
                <DirectionsService
                  options={{
                    destination: end,
                    origin: start,
                    travelMode: 'DRIVING',
                  }}
                  callback={handleDirectionsResponse}
                />
              )}
              {directions && (
                <DirectionsRenderer
                  directions={directions}
                  options={{
                    polylineOptions: {
                      strokeColor: '#4CAF50', // Green color for the route line
                      strokeWeight: 5,
                    },
                  }}
                />
              )}
            </GoogleMap>
          </LoadScript>
        </div>

        <div className="trip-details">
          {directions && (
            <div className="card">
              <h3>Distance</h3>
              <div className="section-title">
                <span>Distance:</span>
                <span className="section-value">
                  {distance / 1000} km / {distance * 0.000621371} miles
                </span>
              </div>
            </div>
          )}

          {directions && (
            <div className="card">
              <h3>Carbon Emissions (in kg CO2)</h3>
              <ul>
                {Object.keys(emissions).map((mode) => (
                  <li key={mode}>
                    <span className="section-title">
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}:
                    </span>
                    <span className="section-value">
                      {emissions[mode].toFixed(2)} kg CO2
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {directions && (
            <div className="card">
              <h3>Estimated Costs</h3>
              <ul>
                {Object.keys(costs).map((mode) => (
                  <li key={mode}>
                    <span className="section-title">
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}:
                    </span>
                    <span className="section-value">${costs[mode].toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {directions && (
            <div className="card">
              <h3>Duration</h3>
              <ul>
                {durationsByMode && Object.keys(durationsByMode).map((mode) => (
                  <li key={mode}>
                    <span className="section-title">
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}:
                    </span>
                    <span className="section-value">{durationsByMode[mode]}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Travel Mode Selection */}
          {directions && (
            <div className="card">
              <h3>Select Mode of Transport</h3>
              <ul>
                {Object.keys(speeds).map((mode) => (
                  <li key={mode}>
                    <button onClick={() => handleModeSelect(selectedVehicle)}>
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


export default MapComponent;