import { useEffect } from "react";
import "../../css/home.css";

interface LockOverlayProps {
  locked: boolean;
  mapRef: React.RefObject<L.Map | null>;
}

const LockOverlay: React.FC<LockOverlayProps> = ({ locked, mapRef }) => {
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (locked) {
      map.dragging.disable();
      map.scrollWheelZoom.disable();
      map.doubleClickZoom.disable();
      map.boxZoom.disable();
      map.keyboard.disable();
      map.touchZoom.disable();
      map.off("click");
    } else {
      map.dragging.enable();
      map.scrollWheelZoom.enable();
      map.doubleClickZoom.enable();
      map.boxZoom.enable();
      map.keyboard.enable();
      map.touchZoom.enable();
    }

    return () => {
      map?.off("click");
    };
  }, [locked, mapRef.current]);

  return locked ? <div className="map-lock-overlay" /> : null;
};

export default LockOverlay;
