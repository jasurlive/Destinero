// hooks/useLocationPopup.tsx
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

  // --- Popup state ---
  const [locationDetails, setLocationDetails] =
    useState<LocationDetails | null>(null);
  const [popupCoords, setPopupCoords] = useState<[number, number] | null>(null);
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

  const startFetchForCoords = useCallback(async (coords: [number, number]) => {
    // Abort any in-flight request
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const myRequestId = ++requestIdRef.current;

    // Reset immediately (prevents stale data showing)
    setLocationDetails(null);
    setPopupCoords(coords);
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
        setLocationDetails(details);
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

  const handleMapClick = useCallback(
    (coords: [number, number]) => {
      startFetchForCoords(coords);
    },
    [startFetchForCoords]
  );

  const setCoordsAndFetch = useCallback(
    (coords: [number, number]) => {
      startFetchForCoords(coords);
    },
    [startFetchForCoords]
  );

  return {
    popupCoords,
    locationDetails,
    loading,
    copySuccess,
    copyToClipboard,
    imageLoaded,
    handleImageLoad,
    handleMapClick,
    setCoordsAndFetch,
  };
};
