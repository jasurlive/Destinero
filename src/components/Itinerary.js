// src/components/Itinerary.js
import React from 'react';

const Itinerary = ({ itinerary }) => {
  return (
    <div>
      <h2>Itinerary</h2>
      <ul>
        {itinerary.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default Itinerary;
