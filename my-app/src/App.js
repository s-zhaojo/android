import logo from './logo.svg';
import './App.css';
import React from 'react';
import {GoogleMap, LoadScript, DirectionsService, DirectionsRenderer}
from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = 'AIzaSyD6HMsrIQ2aL0WOAUuIBnGtNoyGZsr726w';

const containerStyle = {
  width: '100',
  height: '60vh'
}

const carbonEmissions = {
  car: 0.411,
  truck: 1.3,
  bus: 0.089,
  motorcycle: 0.16,
  airplane: 0.255
}

const transportationCosts = {
  car: 0.13,
  truck: 0.25,
  bus: 0.05, 
  motorcycle: 0.08,
  airplane: 0.15,

}

const speeds = {
  car: 60,
  truck: 50, 
  bus:30, 
  motorcycle: 70,
  airplane: 500,
}

const MapComponent = () => {
  const [directions, setDirections] = useState(null);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [isRequestingDirections, setIsRequestingDirections]=
  useState(false);
  const [distance, setDistance] = useState(null);
  const [emissions, setEmissions] = useState(null);
  const [costs, setCosts] = useState(null);
  const [durationsByMode, setDurationsByMode] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState('car');
  const [totalDistance, setTotalDistance] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [totalEmissions, setTotalEmissions] = useState(0);

  const handleDirectionsResponse = (result, status) => {
    if (status === 'OK') {
      setDirections(result);
      const route = result.routes[0];
      const distInMeters = route.legs[0].distance.value;
      const distInKm = distInMeters / 1000;
      const distInMiles = distInKm * 0.6121361;
      setDistance(distInMeters);

      const modeEmissions = {
        car: distInMiles * carbonEmissions.car,
        truck: distInMiles * carbonEmissions.bus,
        motorcycle: distInMiles * carbonEmissions.motorcycle,
        airplane: distInMiles * carbonEmissions.airplane,
      };
      setEmissions(modeEmissions);
      const modeCosts = {
        car: distInMiles * transportationsCosts.car,
        truck: distInMiles * transportationCosts.truck,
        bus: distInMiles * transportationCosts.bus,
        motorcycle: distInMiles * transportationCosts.motorcycle, 
        airplane: distInMiles * transportationCosts.airplane, 
      
      };
      setCosts(modeCosts);
      const modeDurations = {};
      Object.keys(speeds).forEach((mode) => {
          const speed = speeds[mode];
          const durationInHours = distInMiles/speed;
          modeDurations[mode] = ${(durationInHours).toFixed(2)} durationInHours;
      });
      setDurationsByMode(modeDurations);
      } else{
        console.error("Error fetching directions:", status);
        alert('Failed to fetch directions. Please check your locations.');
      }
      setIsRequestingDirections(false);
    };
      const requestDirections = () => {
        if (!start || !end){
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
        if (emissions && emissions[selectedVehicle]){
          setTotalDistance(totalDistance + (distance/1000));
          setTotalCost(totalCost + costs[selectedVehicle]);
          setTotalEmissions(totalEmissions + emissions[selectedVehicle]);

        }
      }
      };
    
      return(
        <div className = "container">
          { /*SideBar"*/ }
          <div className = "sidebar">
            <div className = "card">
              <h3> Total Distance </h3>
              <p>{totalDistance.toFixed(2) km </p>
              </div>
              <div className = "card">
                <h3> Total Cost </h3>
                <p> ${totalCost.toFixed(2)}</p>
                </div>
                <div className = "card">
                  <h3> Total C02 Emissions</h3>
                  <p> {totalEmissions.toFixed(2)} kg C02</p>
                  </div>
                  </div>
              <div className = "main-content">
                <div className = "header">
                  <h1> GPSTracker</h1>
                  <div className = "input-container">
                    <input
                      className = "search-bar"
                      type = "text"
                      placeholder = "Start Location (e.g., San Francisco, CA)"
                      value={start}
                      onChange={(e) => setStart(e,targetvalue)}
                      />
                      <input
                          className = "search-bar"
                          type = "text"
                          placeholder = "End Location (e.g., Los Angeles, CA)"
                          value = {end}
                          onChange = {(e) => setEnd(e.target.value)}
                          />
                      <label for = "vehicle"> Vehicle type</label>
                      <select name="vehicle" id="vehicle" value={selectedVehicle} 
                            onChange={(e) => setSelectedVehicle(e.target.value)}
                            >
                              <option value = "car"> Car </option>
                              <option value = "truck">Truck</option>
                              <option value = "bus">Bus</option>
                              <option value = "motorcycle">Motorcycle</option>
                              <option value = "airplane">Airplane</option>
                            </select>

                            <button onClick = {() =>
                              {requestDirections();handleModeSelect(selectedVehicle);}}>Get Directions</button>
                              </div>
                              </div>
                            <div className = "map-container">
                              <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
                                <GoogleMap
                                mapContainerStyle = {containerStyle}
                                center = {{ lat: 37.7749, lng: -122.4194}}
                                zoom={10}
                                >
                                  {isRequestingDirections && start && end && (
                                  <DirectionsService
                                    options = {{
                                      destination: end, 
                                      origin: start,
                                      travelMode: 'DRIVING',
                                    }}
                                    callback = {handleDirectionsResponse}
                                    />
                                  )}

                                  
                            </div>

                      

          
      

export default MapComponent;
