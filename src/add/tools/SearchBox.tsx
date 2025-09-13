import { useCallback, useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { MdOutlineMyLocation } from "react-icons/md";
import { BsPersonRaisedHand } from "react-icons/bs";
import "../css/searchbox.css";
import CreatePopup from "./PopUp";
import { SearchBoxProps } from "../../types/interface";
import { useUserLocation } from "./hooks/useUserLocation";
import { useSearch } from "./hooks/useSearch";
import { useZoom } from "./hooks/useZoom";

type Message = { type: "error" | "success"; text: string } | null;

const SearchBox: React.FC<SearchBoxProps> = ({
  map,
  handleCopyClick,
  copySuccess,
  onSearch,
}) => {
  const { zoomToLocation } = useZoom(map);

  const {
    coords: currentLocation,
    locationDetails,
    isFetching: isFetchingLocation,
    error: locationError,
    getUserLocation,
  } = useUserLocation();

  const {
    searchTerm,
    setSearchTerm,
    search,
    resultCoords,
    isSearching,
    error: searchError,
    success: searchSuccess,
  } = useSearch((coords) => zoomToLocation(coords, 15, () => onSearch(coords)));

  // --- Message state for auto-clear ---
  const [message, setMessage] = useState<Message>(null);

  useEffect(() => {
    if (searchError) setMessage({ type: "error", text: searchError });
    else if (locationError) setMessage({ type: "error", text: locationError });
    else if (searchSuccess)
      setMessage({ type: "success", text: searchSuccess });

    if (searchError || locationError || searchSuccess) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [searchError, locationError, searchSuccess]);

  // --- Zoom to live location when fetched ---
  useEffect(() => {
    if (currentLocation) zoomToLocation(currentLocation, 15);
  }, [currentLocation, zoomToLocation]);

  // --- Clipboard ---
  const handleCopy = useCallback(() => {
    if (currentLocation) {
      navigator.clipboard.writeText(
        `[${currentLocation[0]}, ${currentLocation[1]}]`
      );
      handleCopyClick(currentLocation);
    }
  }, [currentLocation, handleCopyClick]);

  // --- Input Handlers ---
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value),
    [setSearchTerm]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        search();
      }
    },
    [search]
  );

  const handleSearchClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      search();
    },
    [search]
  );

  // --- Live Location Button ---
  const handleLocationClick = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.stopPropagation();
      const target = e.currentTarget as HTMLElement;
      target.style.transform = "scale(0.8)";
      setTimeout(() => (target.style.transform = "scale(1)"), 200);
      getUserLocation();
    },
    [getUserLocation]
  );

  const glowStyle = currentLocation ? "active-glow" : "inactive-glow";

  return (
    <>
      {/* Search Input */}
      <div className="search-box">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Search for a place..."
          className="search-input"
        />
        <button onClick={handleSearchClick} className="search-button">
          {isSearching ? (
            <FaSpinner className="spinner-search-button" />
          ) : (
            "Search"
          )}
        </button>
      </div>

      {/* Live Location */}
      <div
        className="location-icon-container"
        onMouseEnter={(e) => e.currentTarget?.classList.add("hovered")}
        onMouseLeave={(e) => e.currentTarget?.classList.remove("hovered")}
        onClick={handleLocationClick}
        onTouchStart={handleLocationClick}
        title="🟢 Live location"
      >
        {isFetchingLocation ? (
          <FaSpinner className="spinner-live" />
        ) : (
          <MdOutlineMyLocation className={`location-icon ${glowStyle}`} />
        )}
      </div>

      {/* Popup */}
      {currentLocation && locationDetails && (
        <CreatePopup
          place={{
            type: "current",
            coords: currentLocation,
            icon: <BsPersonRaisedHand className="custom-marker-icon-live" />,
          }}
          mapRef={map}
          handleCopyClick={handleCopy}
          copySuccess={copySuccess}
          onPlaceClick={() => {}}
          locationDetails={locationDetails}
        />
      )}

      {message && (
        <div className={`message ${message.type}-message`}>{message.text}</div>
      )}
    </>
  );
};

export default SearchBox;
