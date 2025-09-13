import Map from "../add/tools/Map"; //this is the main map component

import { useState } from "react";
import { usePlaces } from "../add/tools/hooks/usePlaces"; //custom hook to fetch places data from excel file

import { FaLock, FaLockOpen } from "react-icons/fa";
import { RiResetLeftFill } from "react-icons/ri";

import LockOverlay from "../add/tools/Lock"; //for locking the map interactions on scroll

import "../add/css/home.css";

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
            visitedPlaces={visitedPlaces} //passes visited places
            plannedPlaces={plannedPlaces} //passes planned places
            highlightedPlaces={highlightedPlaces} // pass highlighted places
            searchCoords={searchCoords} // finds a place by search coordinates
            setSearchCoords={setSearchCoords} //manages search coordinates data
            locked={locked} // locks the map when true
          />
        )}
      </LockOverlay>
    </div>
  );
};

export default HomePage;
