import { useState, useCallback } from "react";

interface LocationDetails {
  placeName: string;
  city: string;
  country: string;
  countryCode: string;
}

export const useLocationClick = () => {
  const [popupCoords, setPopupCoords] = useState<[number, number] | null>(null);
  const [clickedLocationDetails, setClickedLocationDetails] =
    useState<LocationDetails>({
      placeName: "",
      city: "",
      country: "",
      countryCode: "",
    });

  // fetch location details by coordinates
  const fetchLocationDetails = async (coords: [number, number]) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords[0]}&lon=${coords[1]}&addressdetails=1`
    );
    const data = await response.json();

    return {
      placeName: data.display_name,
      city:
        data.address.city || data.address.town || data.address.village || "",
      country: data.address.country,
      countryCode: data.address.country_code.toUpperCase(),
    };
  };

  // handle map click (updates state + fetches details)
  const handleMapClick = useCallback((coords: [number, number]) => {
    setPopupCoords(coords);
    fetchLocationDetails(coords).then((details) =>
      setClickedLocationDetails(details)
    );
  }, []);

  return {
    popupCoords,
    clickedLocationDetails,
    handleMapClick,
  };
};
