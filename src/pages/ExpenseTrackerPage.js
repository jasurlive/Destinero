// src/pages/ExpenseTrackerPage.js
import React from "react";
import ExpenseTracker from "../components/ExpenseTracker";

const ExpenseTrackerPage = () => {
  console.log("ExpenseTrackerPagee............ ");
  const expenses = [
    { name: "Flight", amount: 500 },
    { name: "Hotel", amount: 300 },
  ];
  return (
    <div>
      <h1>Expense Tracker</h1>
      <ExpenseTracker expenses={expenses} />
    </div>
  );
};

export default ExpenseTrackerPage;
