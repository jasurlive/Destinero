// src/components/PackingList.js
import React from 'react';

const PackingList = ({ packingList }) => {
  return (
    <div>
      <h2>Packing List</h2>
      <ul>
        {packingList.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default PackingList;
