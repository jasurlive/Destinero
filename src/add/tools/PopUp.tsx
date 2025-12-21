// PopUp.tsx
import { useEffect, useState } from "react";
import { FaCopy, FaCheck } from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";
import "../css/popup.css";
import { AllPlaceTypes } from "../hooks/useFetchExcel";
import { useCountryFlag } from "../hooks/useCountryFlags";

type DynamicPlaceTypes = "clicked" | "searched" | "live";

type OSMLocationDetails = {
  title: string;
  info: string;
  countryCode?: string;
};

const TITLE_BY_TYPE: Record<DynamicPlaceTypes, string> = {
  clicked: "Clicked Location 📌",
  searched: "Searched Location 🔎",
  live: "Current Location 🟢",
};

const isDynamicType = (
  type: AllPlaceTypes["type"]
): type is DynamicPlaceTypes =>
  type === "clicked" || type === "searched" || type === "live";

const PopUp = ({ place }: { place: AllPlaceTypes }) => {
  const [details, setDetails] = useState<OSMLocationDetails | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [copied, setCopied] = useState(false);

  const dynamicType = isDynamicType(place.type) ? place.type : null;
  const hasImage = "imageLink" in place && Boolean(place.imageLink);

  useEffect(() => {
    if (!dynamicType) return;

    const loadDataOSM = async () => {
      try {
        const [lat, lon] = place.coords;
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
        );
        const data = await res.json();

        const info = [
          data.address?.road,
          data.address?.neighbourhood,
          data.address?.city,
          data.address?.state,
          data.address?.country,
        ]
          .filter(Boolean)
          .join(", ");

        const resolved: OSMLocationDetails = {
          title: TITLE_BY_TYPE[dynamicType],
          info,
          countryCode: data.address?.country_code?.toUpperCase(),
        };

        setDetails(resolved);
      } catch {
        const fallback: OSMLocationDetails = {
          title: TITLE_BY_TYPE[dynamicType],
          info: `${place.coords[0].toFixed(5)}, ${place.coords[1].toFixed(5)}`,
        };

        setDetails(fallback);
      }
    };

    setDetails(null);
    loadDataOSM();
  }, [dynamicType, place.coords]);

  const handleCopy = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    navigator.clipboard.writeText(place.coords.join(","));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="pop-up-container">
      {dynamicType ? (
        details ? (
          <>
            <h2 className="place-name">{details.title}</h2>
            <p className="location-info">
              {details.info}
              {details.countryCode && (
                <span className="country-flag">
                  {useCountryFlag(details.countryCode)}
                </span>
              )}
            </p>
          </>
        ) : (
          <ImSpinner2 className="spinner-icon" />
        )
      ) : (
        <>
          <h2 className="place-name">{place.name}</h2>
          {hasImage && (
            <>
              {!imageLoaded && <ImSpinner2 className="spinner-icon" />}
              <img
                className={`place-image ${imageLoaded ? "loaded" : "hidden"}`}
                src={place.imageLink}
                alt={place.name}
                onLoad={() => setImageLoaded(true)}
              />
            </>
          )}
        </>
      )}

      <div className="coords-container">
        <span className="coords-text">
          {place.coords[0].toFixed(5)}, {place.coords[1].toFixed(5)}
        </span>
        <button
          className={`copy-button ${copied ? "copied" : ""}`}
          onClick={handleCopy}
        >
          {copied ? <FaCheck /> : <FaCopy />}
        </button>
      </div>
    </div>
  );
};

export default PopUp;
