import React, { useState } from 'react';
import {
  GoogleMap,
  LoadScript,
  DirectionsService,
  DirectionsRenderer,
} from '@react-google-maps/api';
import './components/styles.css';

const GOOGLE_MAPS_API_KEY = 'AIzaSyCG4hWf-Cck1E4rNWBtW2tddCqcmfX261A';

const containerStyle = {
  width: '100%',
  height: '60vh',
};

const carbonEmissions = {
  car: 0.411,
  truck: 1.3,
  bus: 0.089,
  motorcycle: 0.16,
  airplane: 0.255,
};

const transportationCosts = {
  car: 0.13,
  truck: 0.25,
  bus: 0.05,
  motorcycle: 0.08,
  airplane: 0.15,
};

const speeds = {
  car: 60,
  truck: 50,
  bus: 30,
  motorcycle: 70,
  airplane: 500,
};

const MapComponent = () => {
  const [directions, setDirections] = useState(null);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [isRequestingDirections, setIsRequestingDirections] = useState(false);
  const [distance, setDistance] = useState(null);
  const [emissions, setEmissions] = useState('car');
  const [costs, setCosts] = useState(null);
  const [durationsByMode, setDurationsByMode] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState('car');

  const [totalDistance, setTotalDistance] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [totalEmissions, setTotalEmissions] = useState(0);

  const [isLoggedIn, setLoggedIn] = useState(false);
  const handleLogin = () => setLoggedIn(!isLoggedIn);

  const handleDirectionsResponse = (result, status) => {
    if (status === 'OK') {
      setDirections(result);
      const route = result.routes[0];
      const distInMeters = route.legs[0].distance.value;
      const distInKm = distInMeters / 1000;
      const distInMiles = distInKm * 0.621371;

      setDistance(distInMeters);

      const modeEmissions = {
        car: distInMiles * carbonEmissions.car,
        truck: distInMiles * carbonEmissions.truck,
        bus: distInMiles * carbonEmissions.bus,
        motorcycle: distInMiles * carbonEmissions.motorcycle,
        airplane: distInMiles * carbonEmissions.airplane,
      };
      setEmissions(modeEmissions);

      const modeCosts = {
        car: distInMiles * transportationCosts.car,
        truck: distInMiles * transportationCosts.truck,
        bus: distInMiles * transportationCosts.bus,
        motorcycle: distInMiles * transportationCosts.motorcycle,
        airplane: distInMiles * transportationCosts.airplane,
      };
      setCosts(modeCosts);

      const modeDurations = {};
      Object.keys(speeds).forEach((mode) => {
        const speed = speeds[mode];
        const durationInHours = distInMiles / speed;
        modeDurations[mode] = `${durationInHours.toFixed(2)} hours`;
      });
      setDurationsByMode(modeDurations);
    } else {
      console.error('Error fetching directions:', status);
      alert('Failed to fetch directions. Please check your locations.');
    }
    setIsRequestingDirections(false);
  };

  const requestDirections = () => {
    if (!start || !end) {
      alert('Please enter both start and end locations.');
      return;
    }
    setIsRequestingDirections(true);
    setDirections(null);
    setDistance(null);
    setEmissions(null);
    setCosts(null);
    setDurationsByMode(null);
  };

  const handleModeSelect = (mode) => {
    if (emissions && emissions[selectedVehicle]) {
      setTotalDistance(totalDistance + distance / 1000);
      setTotalCost(totalCost + costs[selectedVehicle]);
      setTotalEmissions(totalEmissions + emissions[selectedVehicle]);
    }
  };

  return (
    <div>
      <button onClick={handleLogin}>
        {isLoggedIn ? 'Log Out' : 'Log In'}
      </button>

      <div className="container">
        <div className="sidebar">
          <div className="card">
            <h3>Total Distance</h3>
            <p>{distance / 1000} km / {(distance * 0.000621371).toFixed(2)} miles</p>
          </div>
          <div className="card">
            <h3>Total Cost</h3>
            <p>
              {costs && costs[selectedVehicle]
                ? `$${costs[selectedVehicle].toFixed(2)}`
                : '$0'}
            </p>
          </div>
          <div className="card">
            <h3>Total CO2 Emissions</h3>
            <p>
              {emissions && emissions[selectedVehicle]
                ? `${emissions[selectedVehicle].toFixed(2)} kg CO2`
                : '0 kg CO2'}
            </p>
          </div>
        </div>

        <div className="main-content">
          <div className="header">
            <h1>EcoVoyage</h1>
            <div className="input-container">
              <input
                className="search-bar"
                type="text"
                placeholder="Start Location"
                value={start}
                onChange={(e) => setStart(e.target.value)}
              />
              <input
                className="search-bar"
                type="text"
                placeholder="End Location"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
              />
              <label htmlFor="vehicle">Vehicle type:</label>
              <select
                name="vehicle"
                id="vehicle"
                value={selectedVehicle}
                onChange={(e) => setSelectedVehicle(e.target.value)}
              >
                <option value="car">Car</option>
                <option value="truck">Truck</option>
                <option value="bus">Bus</option>
                <option value="motorcycle">Motorcycle</option>
                <option value="airplane">Airplane</option>
              </select>
              <button
                onClick={() => {
                  requestDirections();
                  handleModeSelect(selectedVehicle);
                }}
              >
                Get Directions
              </button>
            </div>
          </div>

          <div className="map-container">
            <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={{ lat: 37.7749, lng: -122.4194 }}
                zoom={10}
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
                        strokeColor: '#4CAF50',
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
              <>
                <div className="card">
                  <h3>Distance</h3>
                  <div className="section-title">
                    <span>Distance:</span>
                    <span className="section-value">
                      {distance / 1000} km / {(distance * 0.000621371).toFixed(2)} miles
                    </span>
                  </div>
                </div>

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

                <div className="card">
                  <h3>Estimated Costs</h3>
                  <ul>
                    {Object.keys(costs).map((mode) => (
                      <li key={mode}>
                        <span className="section-title">
                          {mode.charAt(0).toUpperCase() + mode.slice(1)}:
                        </span>
                        <span className="section-value">
                          ${costs[mode].toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="card">
                  <h3>Duration</h3>
                  <ul>
                    {Object.keys(durationsByMode).map((mode) => (
                      <li key={mode}>
                        <span className="section-title">
                          {mode.charAt(0).toUpperCase() + mode.slice(1)}:
                        </span>
                        <span className="section-value">
                          {durationsByMode[mode]}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="card">
                  <h3>Select Mode of Transport</h3>
                  <ul>
                    {Object.keys(speeds).map((mode) => (
                      <li key={mode}>
                        <button onClick={() => handleModeSelect(mode)}>
                          {mode.charAt(0).toUpperCase() + mode.slice(1)}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* User Profile Card */}
      <div className="user-profile">
        <img src="https://via.placeholder.com/250x150" alt="John" />
        <h1>John Doe</h1>
        <p className="title">CEO & Founder, Example</p>
        <p>Harvard University</p>
        <div className="icons" style={{ textAlign: 'center' }}>
          <a href="#"><i className="fa fa-dribbble"></i></a>
          <a href="#"><i className="fa fa-twitter"></i></a>
          <a href="#"><i className="fa fa-linkedin"></i></a>
          <a href="#"><i className="fa fa-facebook"></i></a>
        </div>
        <p><button>Contact</button></p>
      </div>
    </div>
  );
};

export default MapComponent;