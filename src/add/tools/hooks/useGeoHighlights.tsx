import { useState, useEffect } from "react";

import palestineGeo from "../geoJSON/palestine.json";
import uzbekistanGeo from "../geoJSON/uzbekistan.json";

export function useGeoHighlights() {
  const [geoData, setGeoData] = useState<any[] | null>(null);

  useEffect(() => {
    setGeoData([palestineGeo, uzbekistanGeo]); //GeoJSON files
  }, []);

  return geoData;
}
