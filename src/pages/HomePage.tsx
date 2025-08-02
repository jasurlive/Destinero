import Map from "../add/tools/Map";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import LockOverlay from "../add/tools/Lock";
import { Place, PlaceData } from "../types/types";
import "../add/css/home.css";

import { FaLock, FaLockOpen } from "react-icons/fa";
import { RiResetLeftFill } from "react-icons/ri";

const createCustomIcon = (type: "visited" | "planned"): React.ReactElement => {
  return <div className={`${type}-icon`} />;
};

const HomePage = () => {
  const [visitedPlaces, setVisitedPlaces] = useState<Place[]>([]);
  const [plannedPlaces, setPlannedPlaces] = useState<Place[]>([]);
  const [searchCoords, setSearchCoords] = useState<[number, number] | null>(
    null
  );
  const [locked, setLocked] = useState(true);

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
        <div className="map-home-title-btn-row">
          <button
            className="map-home-reset-view-button"
            onClick={() => setLocked(!locked)}
            title={locked ? "Unlock map" : "Lock map"}
          >
            {locked ? <FaLock /> : <FaLockOpen />}
          </button>
        </div>
        🚩Travel Map 🗺️
        <div className="map-home-title-btn-row">
          <button
            className="map-home-reset-view-button"
            onClick={resetView}
            title="Reset view"
          >
            <RiResetLeftFill />
          </button>
        </div>
      </h1>
      <LockOverlay locked={locked}>
        {(locked: boolean) => (
          <Map
            visitedPlaces={visitedPlaces}
            plannedPlaces={plannedPlaces}
            searchCoords={searchCoords}
            setSearchCoords={setSearchCoords}
            locked={locked}
          />
        )}
      </LockOverlay>
    </div>
  );
};

export default HomePage;
