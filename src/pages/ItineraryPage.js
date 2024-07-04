// src/pages/ItineraryPage.js
import React from 'react';
import Itinerary from '../components/Itinerary';

const ItineraryPage = () => {
  const itinerary = ['Day 1: Arrival', 'Day 2: City Tour', 'Day 3: Museum Visit'];
  
  return (
    <div>
      <h1>Itinerary</h1>
      <Itinerary itinerary={itinerary} />
    </div>
  );
};

export default ItineraryPage;
