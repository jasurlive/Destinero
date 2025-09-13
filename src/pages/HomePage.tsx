import Map from "../add/tools/Map";
import { useState } from "react";
import LockOverlay from "../add/tools/Lock";
import { usePlaces } from "../add/tools/hooks/usePlaces";
import "../add/css/home.css";

import { FaLock, FaLockOpen } from "react-icons/fa";
import { RiResetLeftFill } from "react-icons/ri";

const HomePage = () => {
  const { visitedPlaces, plannedPlaces, highlightedPlaces } = usePlaces();
  const [searchCoords, setSearchCoords] = useState<[number, number] | null>(
    null
  );
  const [locked, setLocked] = useState(true);

  const resetView = () => {
    window.location.reload();
  };

  return (
    <div>
      <h1 className="map-home-title">
        <div className="map-home-title-btn-row">
          <button
            className="map-home-reset-view-button"
            onClick={() => setLocked(!locked)}
            title={locked ? "Unlock map" : "Lock map"}
          >
            {locked ? <FaLock /> : <FaLockOpen />}
          </button>
        </div>
        🚩Travel Map 🗺️
        <div className="map-home-title-btn-row">
          <button
            className="map-home-reset-view-button"
            onClick={resetView}
            title="Reset view"
          >
            <RiResetLeftFill />
          </button>
        </div>
      </h1>
      <LockOverlay locked={locked}>
        {(locked: boolean) => (
          <Map
            visitedPlaces={visitedPlaces}
            plannedPlaces={plannedPlaces}
            highlightedPlaces={highlightedPlaces} // ✅ pass highlighted places
            searchCoords={searchCoords}
            setSearchCoords={setSearchCoords}
            locked={locked}
          />
        )}
      </LockOverlay>
    </div>
  );
};

export default HomePage;
