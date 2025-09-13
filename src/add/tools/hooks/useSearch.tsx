import { useState, useCallback } from "react";
import { OpenStreetMapProvider } from "leaflet-geosearch";

interface UseSearchResult {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  search: () => void;
  resultCoords: [number, number] | null;
  isSearching: boolean;
  error: string | null;
  success: string | null;
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
    if (searchTerm.trim() === "") return;

    setIsSearching(true);
    const provider = new OpenStreetMapProvider();

    try {
      const results = await provider.search({ query: searchTerm });
      if (results.length > 0) {
        const { x, y } = results[0];
        const coords: [number, number] = [y, x];
        setResultCoords(coords);
        setSuccess("The place was found");
        setError(null);
        onSearchCallback(coords);
      } else {
        setError("No results found");
        setSuccess(null);
        setResultCoords(null);
      }
    } catch {
      setError("Error fetching geocoding data");
      setSuccess(null);
      setResultCoords(null);
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
