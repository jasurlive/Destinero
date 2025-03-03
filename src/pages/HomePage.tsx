import Map from '../add/tools/Map';
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { BsFullscreen } from "react-icons/bs";
import L from "leaflet";
import { Place } from "./types";  // Import the shared type
import '../add/css/home.css';

interface PlaceData {
    Name: string;
    Coords?: string;
    "Image Links"?: string;
}

const createCustomIcon = (type: "visited" | "planned"): L.DivIcon => {
    return L.divIcon({
        className: `${type}-icon`,
        html: `<div class="${type}-icon"></div>`,
        iconSize: [20, 20],
    });
};

const HomePage = () => {
    const [visitedPlaces, setVisitedPlaces] = useState<Place[]>([]);
    const [plannedPlaces, setPlannedPlaces] = useState<Place[]>([]);
    const [searchCoords, setSearchCoords] = useState<[number, number] | null>(null);

    const fetchExcelData = async () => {
        try {
            const response = await fetch(`/python/data.xlsx`);
            const arrayBuffer = await response.arrayBuffer();
            const workbook = XLSX.read(arrayBuffer, { type: "array" });

            const visitedSheet = workbook.Sheets["Visited"];
            const plannedSheet = workbook.Sheets["Planned"];

            if (!visitedSheet || !plannedSheet) {
                throw new Error("Missing required sheets in Excel file.");
            }

            const visitedData: PlaceData[] = XLSX.utils.sheet_to_json(visitedSheet);
            const plannedData: PlaceData[] = XLSX.utils.sheet_to_json(plannedSheet);

            const visited: Place[] = visitedData.map((row) => ({
                name: row.Name ?? "Unknown Place",
                coords: row.Coords ? JSON.parse(row.Coords) : [0, 0],
                imageLink: row["Image Links"],
                type: "visited",
                icon: createCustomIcon("visited"),
            }));

            const planned: Place[] = plannedData.map((row) => ({
                name: row.Name ?? "Unknown Place",
                coords: row.Coords ? JSON.parse(row.Coords) : [0, 0],
                imageLink: row["Image Links"],
                type: "planned",
                icon: createCustomIcon("planned"),
            }));

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
            <h1 className="map-home-title">
                Travel Map 🗺️ <div className="map-home-reset-view-button" onClick={resetView}>
                    <BsFullscreen />
                </div>
            </h1>
            <Map
                visitedPlaces={visitedPlaces}
                plannedPlaces={plannedPlaces}
                searchCoords={searchCoords}
                setSearchCoords={setSearchCoords}
            />
        </div>
    );
};

export default HomePage;
