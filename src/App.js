// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import './css/App.css';


const App = () => {
  return (
    <Router>
      <div>

        <Routes>
          <Route path="/itravel" element={<HomePage />} />

        </Routes>
      </div>
    </Router>
  );
};

export default App;
