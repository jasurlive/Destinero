import { useState, useEffect } from "react";
import palestineGeo from "../geoJSON/palestine.json";
import uzbekistanGeo from "../geoJSON/uzbekistan.json"; // optional local file

export function useCountryHighlights() {
  const [geoData, setGeoData] = useState<any[] | null>(null);

  useEffect(() => {
    // Directly use imported JSONs
    setGeoData([palestineGeo, uzbekistanGeo]); // array of GeoJSONs
  }, []);

  return geoData;
}
