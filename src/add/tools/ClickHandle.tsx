import { useState } from "react";
import { getCountryFlag } from "./Flags";
import L from "leaflet";

const useHandleClick = () => {
  const [clickedCoords, setClickedCoords] = useState<[number, number] | null>(
    null
  );
  const [placeInfo, setPlaceInfo] = useState<{
    name: string;
    flag: any;
  } | null>(null);

  const handleMapClick = async (
    coords: [number, number],
    mapRef: React.RefObject<L.Map>
  ) => {
    setClickedCoords(coords);

    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords[0]}&lon=${coords[1]}`;
    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data && data.address) {
        const {
          city = "",
          town = "",
          village = "",
          country_code = "",
          country = "Unknown Country",
          state = "",
          county = "",
          suburb = "",
          neighbourhood = "",
        } = data.address;
        const placeName =
          city || town || village || suburb || neighbourhood || "Unknown Place";
        const areaName = suburb || neighbourhood || state || county || "";
        const countryCode = getCountryFlag(country_code);

        setPlaceInfo({
          name: areaName
            ? `${placeName} (${areaName}), ${country}`
            : `${placeName}, ${country}`,
          flag: countryCode,
        });
      } else {
        console.warn("Address data is missing or incomplete:", data);
        setPlaceInfo({
          name: "Unknown Place, Unknown Country",
          flag: null,
        });
      }
    } catch (error) {
      console.error("Error fetching reverse geocoding data:", error);
    }
  };

  return { clickedCoords, handleMapClick, placeInfo };
};

export default useHandleClick;
