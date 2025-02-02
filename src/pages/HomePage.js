import Map from '../add/Map';
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { FaRedo } from 'react-icons/fa';

const HomePage = () => {
    const [visitedPlaces, setVisitedPlaces] = useState([]);
    const [plannedPlaces, setPlannedPlaces] = useState([]);

    const fetchExcelData = async () => {
        try {
            const response = await fetch(`${process.env.PUBLIC_URL}/data.xlsx`);
            const arrayBuffer = await response.arrayBuffer();
            const workbook = XLSX.read(arrayBuffer, { type: "array" });

            const visitedSheetName = "Visited";
            const visitedSheet = workbook.Sheets[visitedSheetName];
            const visitedData = XLSX.utils.sheet_to_json(visitedSheet);

            const plannedSheetName = "Planned";
            const plannedSheet = workbook.Sheets[plannedSheetName];
            const plannedData = XLSX.utils.sheet_to_json(plannedSheet);

            const visited = [];
            const planned = [];

            visitedData.forEach((row) => {
                const coords = row.Coords ? JSON.parse(row.Coords) : [0, 0];
                const placeData = {
                    name: row.Name,
                    coords: coords,
                    imageLink: row["Image Links"],
                };
                visited.push(placeData);
            });

            plannedData.forEach((row) => {
                const coords = row.Coords ? JSON.parse(row.Coords) : [0, 0];
                const placeData = {
                    name: row.Name,
                    coords: coords,
                    imageLink: row["Image Links"],
                };
                planned.push(placeData);
            });

            setVisitedPlaces(visited);
            setPlannedPlaces(planned);

        } catch (error) {
            console.error("Error fetching or parsing Excel file:", error);
        }
    };

    const resetView = () => {
        window.location.reload();
    };

    useEffect(() => {
        fetchExcelData();
    }, []);

    return (
        <div>
            <h1>
                Travel Map 🗺️ | 🚩-visited | ✈️-planned <button className="reset-view-button" onClick={resetView}>
                    <FaRedo />
                </button>
            </h1>
            {/* Render Map component with fetched data */}
            <Map visitedPlaces={visitedPlaces} plannedPlaces={plannedPlaces} />
        </div>
    );
};

export default HomePage;
