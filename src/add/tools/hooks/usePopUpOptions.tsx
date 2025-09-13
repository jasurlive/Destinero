import { useState, useRef, useCallback, useEffect } from "react";
import type { Marker as LeafletMarker } from "leaflet";
import { UsePopupOptionsProps } from "../../../types/interface";

export const usePopupOptions = ({
  autoOpen = false,
  handleCopyClick,
}: UsePopupOptionsProps) => {
  // --- Ref for Marker ---
  const markerRef = useRef<LeafletMarker>(null);

  // --- Auto-open popup ---
  useEffect(() => {
    if (autoOpen && markerRef.current) {
      setTimeout(() => markerRef.current?.openPopup(), 0);
    }
  }, [autoOpen]);

  // --- Clipboard handling ---
  const [copySuccess, setCopySuccess] = useState(false);
  const copyToClipboard = useCallback(
    (text: string) => {
      navigator.clipboard.writeText(text);
      setCopySuccess(true);
      if (handleCopyClick) handleCopyClick();
      setTimeout(() => setCopySuccess(false), 2000);
    },
    [handleCopyClick]
  );

  // --- Image loading ---
  const [imageLoaded, setImageLoaded] = useState(false);
  const handleImageLoad = useCallback(() => setImageLoaded(true), []);

  return {
    markerRef,
    copySuccess,
    copyToClipboard,
    imageLoaded,
    handleImageLoad,
  };
};
