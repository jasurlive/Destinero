import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

export type AllPlaceTypes = {
  type: "visited" | "planned" | "highlighted" | "searched" | "live" | "clicked";
  name: string;
  coords: [number, number];
  imageLink?: string;
};

type ExcelData = {
  Name: string;
  Coords: string;
  "Image Links": string;
};

const parseCoords = (str?: string): [number, number] => {
  if (!str) return [0, 0];
  try {
    const parsed = JSON.parse(str);
    if (Array.isArray(parsed) && parsed.length === 2)
      return [Number(parsed[0]) || 0, Number(parsed[1]) || 0];
  } catch {}
  const [lat, lng] = str.split(",").map((c) => parseFloat(c.trim()));
  return [lat || 0, lng || 0];
};

export const usePlaces = () => {
  const [visitedPlaces, setVisitedPlaces] = useState<AllPlaceTypes[]>([]);
  const [plannedPlaces, setPlannedPlaces] = useState<AllPlaceTypes[]>([]);
  const [highlightedPlaces, setHighlightedPlaces] = useState<AllPlaceTypes[]>(
    []
  );

  const fetchData = async () => {
    const res = await fetch("/python/data.xlsx");
    const buffer = await res.arrayBuffer();
    const wb = XLSX.read(buffer, { type: "array" });

    const mapSheet = (
      sheetName: string,
      type: "visited" | "planned" | "highlighted"
    ): AllPlaceTypes[] => {
      const sheet = wb.Sheets[sheetName];
      if (!sheet) return [];
      const data: ExcelData[] = XLSX.utils.sheet_to_json(sheet);
      return data.map((row) => ({
        name: row.Name ?? "Unknown Place",
        coords: parseCoords(row.Coords),
        imageLink: row["Image Links"] ?? "",
        type,
      }));
    };

    setVisitedPlaces(mapSheet("Visited", "visited"));
    setPlannedPlaces(mapSheet("Planned", "planned"));
    setHighlightedPlaces(mapSheet("Highlighted", "highlighted"));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { visitedPlaces, plannedPlaces, highlightedPlaces };
};
