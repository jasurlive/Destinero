// src/pages/PackingListPage.js
import React from 'react';
import PackingList from '../components/PackingList';

const PackingListPage = () => {
  const packingList = ['Passport', 'Clothes', 'Camera'];

  return (
    <div>
      <h1>Packing List</h1>
      <PackingList packingList={packingList} />
    </div>
  );
};

export default PackingListPage;
