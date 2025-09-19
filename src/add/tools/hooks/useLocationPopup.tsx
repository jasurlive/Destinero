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
  // 🔹 renamed popupCoords -> clickedCoords
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

  // --- Abort/dedupe ---
  const abortControllerRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = null;
    };
  }, []);

  const coordsKey = (coords: [number, number]) => `${coords[0]},${coords[1]}`;

  const startFetchForCoords = useCallback(async (coords: [number, number]) => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const myRequestId = ++requestIdRef.current;
    const key = coordsKey(coords);

    setLocationMap((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    setLoading(true);

    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords[0]}&lon=${coords[1]}&addressdetails=1`;
      const resp = await fetch(url, { signal: controller.signal });

      if (!resp.ok) {
        throw new Error(`Reverse geocode failed: ${resp.status}`);
      }

      const data = await resp.json();

      if (requestIdRef.current !== myRequestId) return;

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

      if (requestIdRef.current === myRequestId) {
        setLocationMap((prev) => ({ ...prev, [key]: details }));
      }
    } catch (err: any) {
      if (err?.name !== "AbortError") {
        console.error("Popup fetch error:", err);
      }
    } finally {
      if (requestIdRef.current === myRequestId) {
        setLoading(false);
        abortControllerRef.current = null;
      }
    }
  }, []);

  // 🔹 renamed handleMapClick -> handleMapClick
  const handleMapClick = useCallback(
    (coords: [number, number]) => {
      setClickedCoords(coords);
      startFetchForCoords(coords);
    },
    [startFetchForCoords]
  );

  const setCoordsAndFetch = useCallback(
    (coords: [number, number]) => {
      setClickedCoords(coords);
      startFetchForCoords(coords);
    },
    [startFetchForCoords]
  );

  const setLiveCoords = useCallback(
    (coords: [number, number]) => {
      setLiveCoordsState(coords);
      startFetchForCoords(coords);
    },
    [startFetchForCoords]
  );

  const getDetailsForCoords = useCallback(
    (coords: [number, number] | null | undefined) =>
      coords ? locationMap[coordsKey(coords)] || null : null,
    [locationMap]
  );

  return {
    clickedCoords, // 🔹 instead of popupCoords
    liveCoords,
    loading,
    copySuccess,
    copyToClipboard,
    imageLoaded,
    handleImageLoad,
    handleMapClick, // 🔹 instead of handleMapClick
    setCoordsAndFetch,
    setLiveCoords,
    getDetailsForCoords,
  };
};
