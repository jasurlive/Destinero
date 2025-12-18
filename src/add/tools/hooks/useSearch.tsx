import { useState, useCallback } from "react";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import { UseSearchResult } from "../../../types/interface";

interface SearchResultSafe {
  x: number; // longitude
  y: number; // latitude
}

export const useSearch = (
  onSearchCallback: (coords: [number, number]) => void
): UseSearchResult => {
  const [searchTerm, setSearchTerm] = useState("");
  const [resultCoords, setResultCoords] = useState<[number, number] | null>(
    null
  );
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const search = useCallback(async () => {
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    setError(null);
    setSuccess(null);

    const provider = new OpenStreetMapProvider();

    try {
      const results = await provider.search({ query: searchTerm });
      if (!results || results.length === 0) {
        setResultCoords(null);
        setError("No results found");
        return;
      }

      const firstResult = results[0] as SearchResultSafe;

      if (
        typeof firstResult.x !== "number" ||
        typeof firstResult.y !== "number"
      ) {
        setResultCoords(null);
        setError("Invalid geocoding result");
        return;
      }

      const coords: [number, number] = [firstResult.y, firstResult.x];
      setResultCoords(coords);
      setSuccess("Place found successfully");
      onSearchCallback(coords);
    } catch {
      setResultCoords(null);
      setError("Error fetching geocoding data");
    } finally {
      setIsSearching(false);
    }
  }, [searchTerm, onSearchCallback]);

  return {
    searchTerm,
    setSearchTerm,
    search,
    resultCoords,
    isSearching,
    error,
    success,
  };
};
