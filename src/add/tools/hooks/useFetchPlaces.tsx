import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { Place, PlaceData } from "../../../types/interface";

type PlaceType = "visited" | "planned" | "highlighted";

const createCustomIcon = (type: PlaceType): React.ReactElement => {
  return <div className={`${type}-icon`} />;
};

const parseCoords = (coordsString?: string): [number, number] => {
  if (!coordsString) return [0, 0];
  try {
    const parsed = JSON.parse(coordsString);
    if (Array.isArray(parsed) && parsed.length === 2) {
      return [Number(parsed[0]) || 0, Number(parsed[1]) || 0];
    }
  } catch {}
  const [lat, lng] = coordsString.split(",").map((c) => parseFloat(c.trim()));
  return [lat || 0, lng || 0];
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
          console.error("Missing one or more sheets in Excel file.");
          return;
        }

        const mapSheet = (sheet: XLSX.Sheet, type: PlaceType): Place[] => {
          const data: PlaceData[] = XLSX.utils.sheet_to_json(sheet);
          return data.map((row) => ({
            name: row.Name ?? "Unknown Place",
            coords: parseCoords(row.Coords),
            imageLink: row["Image Links"] ?? "",
            type: type,
            icon: createCustomIcon(type),
          }));
        };

        setVisitedPlaces(mapSheet(visitedSheet, "visited"));
        setPlannedPlaces(mapSheet(plannedSheet, "planned"));
        setHighlightedPlaces(mapSheet(highlightedSheet, "highlighted"));
      } catch (error) {
        console.error("Error fetching or parsing Excel file:", error);
      }
    };

    fetchExcelData();
  }, []);

  return { visitedPlaces, plannedPlaces, highlightedPlaces };
};
