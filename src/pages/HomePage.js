// src/pages/HomePage.js

import Map from "../components/Map";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { useVisitedPlaces } from "../components/VisitedPlacesStore";

const HomePage = () => {
  const [visitedPlaces, setVisitedPlaces] = useState([]);
  const [plannedPlaces, setPlannedPlaces] = useState([]);
  const { dispatch } = useVisitedPlaces();

  // Function to load and parse the Excel
  const fetchExcelData = async () => {
    try {
      const response = await fetch(`${process.env.PUBLIC_URL}/data.xlsx`);
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });

      // Fetch the data from the "Visited" sheet
      const visitedSheetName = "Visited";
      const visitedSheet = workbook.Sheets[visitedSheetName];
      const visitedData = XLSX.utils.sheet_to_json(visitedSheet);

      // Fetch the data from the "Planned" sheet
      const plannedSheetName = "Planned";
      const plannedSheet = workbook.Sheets[plannedSheetName];
      const plannedData = XLSX.utils.sheet_to_json(plannedSheet);

      const visited = [];
      const planned = [];

      // Process the visited data
      visitedData.forEach((row) => {
        const coords = row.Coords ? JSON.parse(row.Coords) : [0, 0];
        const placeData = {
          name: row.Name,
          coords: coords,
          imageLink: row["Image Links"],
          // expense: row.expense,
        };
        visited.push(placeData);
      });

      // Process the planned data
      plannedData.forEach((row) => {
        const coords = row.Coords ? JSON.parse(row.Coords) : [0, 0];
        const placeData = {
          name: row.Name,
          coords: coords,
          imageLink: row["Image Links"],
        };
        planned.push(placeData);
      });

      // Set the state for visited and planned places
      setVisitedPlaces(visited);
      setPlannedPlaces(planned);
      dispatch({ type: "ADD_PLACE", payload: visited });
    } catch (error) {
      console.error("Error fetching or parsing Excel file:", error);
    }
  };

  useEffect(() => {
    fetchExcelData(); // Fetch and process data once the component is mounted
  }, []);

  return (
    <div>
      <h1>My Travel Map 🗺️ == 🚩-visited | ✈️-planned</h1>
      {/* Render Map component with fetched data */}
      <Map visitedPlaces={visitedPlaces} plannedPlaces={plannedPlaces} />
    </div>
  );
};

export default HomePage;
