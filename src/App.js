// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ItineraryPage from './pages/ItineraryPage';
import PackingListPage from './pages/PackingListPage';
import ExpenseTrackerPage from './pages/ExpenseTrackerPage';
import './styles/App.css';

const App = () => {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">🏠 Home</Link>
            </li>
            <li>
              <Link to="/itinerary">📝 Itinerary</Link>
            </li>
            <li>
              <Link to="/packing-list">🎒 Packing List</Link>
            </li>
            <li>
              <Link to="/expense-tracker">💰 Expense Tracker</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/itinerary" element={<ItineraryPage />} />
          <Route path="/packing-list" element={<PackingListPage />} />
          <Route path="/expense-tracker" element={<ExpenseTrackerPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
