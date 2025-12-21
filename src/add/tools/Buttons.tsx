import { useState, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import { LuFullscreen } from "react-icons/lu";
import { TbLocationFilled } from "react-icons/tb";
import { ImSpinner } from "react-icons/im";
import { useButtons } from "../hooks/useButtons";
import "../css/buttons.css";

type ButtonsProps = {
  setSearchedPlace: React.Dispatch<
    React.SetStateAction<{ coords: [number, number]; name?: string } | null>
  >;
  setLiveLocation: React.Dispatch<
    React.SetStateAction<[number, number] | null>
  >;
  setClickedMarker?: (coords: [number, number], name?: string) => void;
};

const Buttons = ({ setSearchedPlace, setLiveLocation }: ButtonsProps) => {
  const { resetView, goToLiveLocation, searchPlace } = useButtons(
    setSearchedPlace,
    setLiveLocation
  );
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [loading, setLoading] = useState({
    reset: false,
    locate: false,
    search: false,
  });

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading((prev) => ({ ...prev, search: true }));
    await searchPlace(query);
    setQuery("");
    inputRef.current?.focus();
    setLoading((prev) => ({ ...prev, search: false }));
  };

  const handleResetView = async () => {
    setLoading((prev) => ({ ...prev, reset: true }));
    await resetView();
    setLoading((prev) => ({ ...prev, reset: false }));
  };

  const handleGoToUserLiveLocation = async () => {
    setLoading((prev) => ({ ...prev, locate: true }));
    await goToLiveLocation();
    setLoading((prev) => ({ ...prev, locate: false }));
  };

  const handleClick = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div
      className="map-buttons"
      onClick={handleClick}
      style={{ pointerEvents: "auto" }}
    >
      <div className="search-wrapper">
        <button onClick={handleSearch}>
          {loading.search ? <ImSpinner className="spinner" /> : <FaSearch />}
        </button>
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Search place"
          className="search-input"
        />
      </div>

      <button onClick={handleGoToUserLiveLocation}>
        {loading.locate ? (
          <ImSpinner className="spinner" />
        ) : (
          <TbLocationFilled />
        )}
      </button>

      <button onClick={handleResetView}>
        {loading.reset ? <ImSpinner className="spinner" /> : <LuFullscreen />}
      </button>
    </div>
  );
};

export default Buttons;
