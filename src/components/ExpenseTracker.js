// src/components/ExpenseTracker.js
import React from "react";
import { useVisitedPlaces } from "./VisitedPlacesStore";
import { ExpandMore } from "@mui/icons-material";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";

const ExpenseTracker = () => {
  const { state } = useVisitedPlaces();
  const visitedPlaces = state.visitedPlacesList[0];
  console.log("................" + visitedPlaces);
  return (
    <div
      style={{
        height: "500px",
        overflowY: "auto",
        padding: "10px",
      }}
    >
      <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
        <h1>Visited Places</h1>
        {visitedPlaces?.map((visitedPlace, index) => (
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls="panel1a-content"
            >
              <Typography
                style={{
                  fontWeight: 10,
                }}
              >
                <li key={index}>{visitedPlace.name}</li>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                <li key={index}> Expense {visitedPlace.expense}</li>
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </ul>
    </div>
  );
};

export default ExpenseTracker;
