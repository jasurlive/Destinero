import { useState, useCallback } from "react";
import {
  LocationDetails,
  UsePopupOptionsProps,
} from "../../../types/interface";

export const usePopupOptions = ({
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

  // --- Location state (just coordinates, no fetching) ---
  const [clickedCoords, setClickedCoords] = useState<[number, number] | null>(
    null
  );
  const [liveCoords, setLiveCoordsState] = useState<
    [number, number] | undefined
  >();

  // --- Map click handlers ---
  const handleMapClick = useCallback((coords: [number, number]) => {
    setClickedCoords(coords);
  }, []);

  const setCoordsAndFetch = useCallback((coords: [number, number]) => {
    setClickedCoords(coords);
  }, []);

  const setLiveCoords = useCallback((coords: [number, number]) => {
    setLiveCoordsState(coords);
  }, []);

  return {
    clickedCoords,
    liveCoords,
    copySuccess,
    copyToClipboard,
    imageLoaded,
    handleImageLoad,
    handleMapClick,
    setCoordsAndFetch,
    setLiveCoords,
  };
};
