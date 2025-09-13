import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { Place, PlaceData } from "../../../types/interface";

// small helper to create custom icons. you can add more types if needed
const createCustomIcon = (
  type: "visited" | "planned" | "highlighted"
): React.ReactElement => {
  return <div className={`${type}-icon`} />;
};

export const usePlaces = () => {
  const [visitedPlaces, setVisitedPlaces] = useState<Place[]>([]);
  const [plannedPlaces, setPlannedPlaces] = useState<Place[]>([]);
  const [highlightedPlaces, setHighlightedPlaces] = useState<Place[]>([]);

  useEffect(() => {
    const fetchExcelData = async () => {
      try {
        const response = await fetch(`/python/data.xlsx`);
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });

        const visitedSheet = workbook.Sheets["Visited"];
        const plannedSheet = workbook.Sheets["Planned"];
        const highlightedSheet = workbook.Sheets["Highlighted"];

        if (!visitedSheet || !plannedSheet || !highlightedSheet) {
          console.error("Missing one or more required sheets in Excel file.");
        }

        const visitedData: PlaceData[] = XLSX.utils.sheet_to_json(visitedSheet);
        const plannedData: PlaceData[] = XLSX.utils.sheet_to_json(plannedSheet);
        const highlightedData: PlaceData[] =
          XLSX.utils.sheet_to_json(highlightedSheet);

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

        const highlighted: Place[] = highlightedData.map((row) => ({
          name: row.Name ?? "Unknown Place",
          coords: row.Coords ? JSON.parse(row.Coords) : [0, 0],
          imageLink: row["Image Links"],
          type: "highlighted",
          icon: createCustomIcon("highlighted"),
          autoOpenPopup: true, // auto open popup for highlighted places
        }));

        setVisitedPlaces(visited);
        setPlannedPlaces(planned);
        setHighlightedPlaces(highlighted);
      } catch (error) {
        console.error("Error fetching or parsing Excel file:", error);
      }
    };

    fetchExcelData();
  }, []);

  return { visitedPlaces, plannedPlaces, highlightedPlaces };
};
