// src/pages/HomePage.js
import React from 'react';
import Map from '../components/Map';

const HomePage = () => {
  const visitedPlaces = [
    {
      name: 'Paris',
      coords: [48.8566, 2.3522],
      imageLink: 'https://example.com/paris.jpg'
    },
    // add more visited places
  ];
  const plannedPlaces = [
    {
      name: 'Tokyo',
      coords: [35.6895, 139.6917],
      imageLink: 'https://example.com/tokyo.jpg'
    },
    // add more planned places
  ];

  return (
    <div>
      <h1>Travel Planner</h1>
      <Map visitedPlaces={visitedPlaces} plannedPlaces={plannedPlaces} />
    </div>
  );
};

export default HomePage;
