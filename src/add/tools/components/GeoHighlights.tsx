// CountryHighlights.tsx
import { GeoJSON } from "react-leaflet";
import { useGeoHighlights } from "../hooks/useGeoHighlights";

const GeoHighlights: React.FC = () => {
  const geoData = useGeoHighlights();

  if (!geoData) return null;

  return (
    <>
      {geoData.map((countryGeo, idx) => (
        <GeoJSON
          key={idx}
          data={countryGeo}
          style={() => ({
            fillColor: "rgba(108, 254, 154, 0.26)",
            weight: 1,
            color: "#0055bcff",
            fillOpacity: 0.9,
          })}
        />
      ))}
    </>
  );
};

export default GeoHighlights;
