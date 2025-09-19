import { useState, useRef, useCallback, useEffect } from "react";
import { getCountryFlag } from "../components/getCountryFlags";

export interface LocationDetails {
  coords: [number, number];
  placeName: string;
  city: string;
  country: string;
  countryCode: string;
  flag?: React.ReactNode;
}

export interface UsePopupOptionsProps {
  autoOpen?: boolean;
  handleCopyClick?: () => void;
}

export const useLocationPopup = ({
  autoOpen = false,
  handleCopyClick,
}: UsePopupOptionsProps = {}) => {
  // --- Clipboard handling ---
  const [copySuccess, setCopySuccess] = useState(false);
  const copyToClipboard = useCallback(
    (value: string | [number, number]) => {
      const text =
        typeof value === "string" ? value : `${value[0]}, ${value[1]}`;

      navigator.clipboard.writeText(text).catch(() => {});
      setCopySuccess(true);
      if (handleCopyClick) handleCopyClick();
      setTimeout(() => setCopySuccess(false), 2000);
    },
    [handleCopyClick]
  );

  // --- Image loading ---
  const [imageLoaded, setImageLoaded] = useState(false);
  const handleImageLoad = useCallback(() => setImageLoaded(true), []);

  // --- Location state ---
  const [clickedCoords, setClickedCoords] = useState<[number, number] | null>(
    null
  );
  const [liveCoords, setLiveCoordsState] = useState<
    [number, number] | undefined
  >();
  const [locationMap, setLocationMap] = useState<
    Record<string, LocationDetails>
  >({});
  const [loading, setLoading] = useState(false);

  // --- Debounce ref for live coords ---
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const coordsKey = (coords: [number, number]) => `${coords[0]},${coords[1]}`;

  const fetchCoordsData = useCallback(
    async (coords: [number, number]) => {
      const key = coordsKey(coords);

      // ✅ Skip fetch if already cached
      if (locationMap[key]) return;

      setLoading(true);
      try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords[0]}&lon=${coords[1]}&addressdetails=1`;
        const resp = await fetch(url);

        if (!resp.ok) {
          throw new Error(`Reverse geocode failed: ${resp.status}`);
        }

        const data = await resp.json();

        const {
          city = "",
          town = "",
          village = "",
          country = "Unknown Country",
          country_code = "",
        } = data.address || {};

        const details: LocationDetails = {
          coords,
          placeName: data.display_name || "Unknown Place",
          city: city || town || village || "Unknown city",
          country,
          countryCode: (country_code || "").toUpperCase(),
          flag: getCountryFlag((country_code || "").toUpperCase()),
        };

        setLocationMap((prev) => ({ ...prev, [key]: details }));
      } catch (err) {
        console.error("Popup fetch error:", err);
      } finally {
        setLoading(false);
      }
    },
    [locationMap]
  );

  // --- Clicked coords trigger fetch immediately ---
  useEffect(() => {
    if (clickedCoords) {
      fetchCoordsData(clickedCoords);
    }
  }, [clickedCoords, fetchCoordsData]);

  // --- Live coords trigger fetch with debounce ---
  useEffect(() => {
    if (!liveCoords) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchCoordsData(liveCoords);
    }, 500); // fetch only after user stops moving
  }, [liveCoords, fetchCoordsData]);

  const handleMapClick = useCallback((coords: [number, number]) => {
    setClickedCoords(coords); // ✅ effect will handle fetch
  }, []);

  const setCoordsAndFetch = useCallback((coords: [number, number]) => {
    setClickedCoords(coords); // ✅ effect will handle fetch
  }, []);

  const setLiveCoords = useCallback((coords: [number, number]) => {
    setLiveCoordsState(coords); // ✅ effect will handle fetch
  }, []);

  const getDetailsForCoords = useCallback(
    (coords: [number, number] | null | undefined) =>
      coords ? locationMap[coordsKey(coords)] || null : null,
    [locationMap]
  );

  return {
    clickedCoords,
    liveCoords,
    loading,
    copySuccess,
    copyToClipboard,
    imageLoaded,
    handleImageLoad,
    handleMapClick,
    setCoordsAndFetch,
    setLiveCoords,
    getDetailsForCoords,
  };
};
