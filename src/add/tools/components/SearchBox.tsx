import { useCallback, useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import "../../css/searchbox.css";
import { SearchBoxProps } from "../../../types/interface";
import { useSearch } from "../hooks/useSearch";
import { useZoom } from "../hooks/useZoom";

type Message = { type: "error" | "success"; text: string } | null;

const SearchBox: React.FC<SearchBoxProps> = ({ map, onSearch }) => {
  const { zoomToLocation } = useZoom(map);

  const {
    searchTerm,
    setSearchTerm,
    search,
    isSearching,
    error: searchError,
    success: searchSuccess,
  } = useSearch((coords) => zoomToLocation(coords, 15, () => onSearch(coords)));

  const [message, setMessage] = useState<Message>(null);

  useEffect(() => {
    if (searchError) setMessage({ type: "error", text: searchError });
    else if (searchSuccess)
      setMessage({ type: "success", text: searchSuccess });

    if (searchError || searchSuccess) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [searchError, searchSuccess]);

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

      {message && (
        <div className={`message ${message.type}-message`}>{message.text}</div>
      )}
    </>
  );
};

export default SearchBox;
