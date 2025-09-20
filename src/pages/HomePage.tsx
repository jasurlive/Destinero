import Map from "../add/tools/Map"; // main map component
import { useState } from "react";
import { usePlaces } from "../add/tools/hooks/useFetchPlaces"; //custom hook
import { FaLock, FaLockOpen } from "react-icons/fa";
import { RiResetLeftFill } from "react-icons/ri";

import "../add/css/home.css";

const HomePage = () => {
  const { visitedPlaces, plannedPlaces, highlightedPlaces } = usePlaces();
  const [searchCoords, setSearchCoords] = useState<[number, number] | null>(
    null
  );
  const [locked, setLocked] = useState(true);
  const [resetTrigger, setResetTrigger] = useState(false);

  const resetView = () => {
    setResetTrigger((prev) => !prev);
  };

  return (
    <div>
      {/* Floating buttons on top-left */}
      <div className="map-buttons-top-left">
        <button
          className="map-home-reset-view-button"
          onClick={() => setLocked(!locked)}
          title={locked ? "Unlock map" : "Lock map"}
        >
          {locked ? <FaLock /> : <FaLockOpen />}
        </button>

        <button
          className="map-home-reset-view-button"
          onClick={resetView}
          title="Reset view"
        >
          <RiResetLeftFill />
        </button>
      </div>

      <Map
        visitedPlaces={visitedPlaces}
        plannedPlaces={plannedPlaces}
        highlightedPlaces={highlightedPlaces}
        searchCoords={searchCoords}
        setSearchCoords={setSearchCoords}
        locked={locked}
        resetTrigger={resetTrigger}
      />
    </div>
  );
};

export default HomePage;
