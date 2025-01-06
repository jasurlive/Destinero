// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ItineraryPage from "./pages/ItineraryPage";
import PackingListPage from "./pages/PackingListPage";
import ExpenseTrackerPage from "./pages/ExpenseTrackerPage";
import "./styles/App.css";

const App = () => {
  return (
    <Router>
      <div>
        {
          <nav>
            <ul>
              <li>
                <Link to="/itravel">🏠 Home Page New</Link>
              </li>
              <li>
                <Link to="/itravel/itinerary">📝 Itinerary</Link>
              </li>
              <li>
                <Link to="/itravel/packing-list">🎒 Packing List</Link>
              </li>
              <li>
                <Link to="/itravel/expense-tracker">💰 Expense Tracker</Link>
              </li>
            </ul>
          </nav>
        }
        <Routes>
          <Route path="/itravel" element={<HomePage />} />
          <Route path="/itravel/itinerary" element={<ItineraryPage />} />
          <Route path="/itravel/packing-list" element={<PackingListPage />} />
          <Route
            path="/itravel/expense-tracker"
            element={<ExpenseTrackerPage />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
