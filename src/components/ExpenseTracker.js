// src/components/ExpenseTracker.js
import React from 'react';

const ExpenseTracker = ({ expenses }) => {
  return (
    <div>
      <h2>Expense Tracker</h2>
      <ul>
        {expenses.map((expense, index) => (
          <li key={index}>{expense.name}: ${expense.amount}</li>
        ))}
      </ul>
    </div>
  );
};

export default ExpenseTracker;
