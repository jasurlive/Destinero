// src/pages/HomePage.js
import React from 'react';
import Map from '../components/Map';

const HomePage = () => {
  const visitedPlaces = [
    {
      name: 'Paris',
      coords: [48.8566, 2.3522],
      imageLink: 'https://blogger.googleusercontent.com/img/a/AVvXsEjc3T6d_JL5_7cvJhnYZt05sJUf6v5it15CGPhzQDgMLzpTYJJvNTb58IeiMS5S22SRwEBWASRh62YgsAh9Xu0COG3SV1OFHtodmRcBaPUrsyNVxbmllaLht5e2PYgSrXuXxt9FF3Rw3KfbxdkvBhF8_rvKcPReev43F-nyGcihKuoAWM16sbl9KbExuOZS=w392-h523'
    },

    {
      name: 'Milano',
      coords: [45.45913914397633, 9.187069449510059],
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
      <h1>The places I have been to :)</h1>
      <Map visitedPlaces={visitedPlaces} plannedPlaces={plannedPlaces} />
    </div>
  );
};

export default HomePage;
