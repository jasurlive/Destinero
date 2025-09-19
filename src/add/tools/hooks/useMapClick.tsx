import { useState, useCallback } from "react";
import { getCountryFlag } from "../components/getCountryFlags"; // <-- came from useHandleClick

interface LocationDetails {
  coords: [number, number];
  placeName: string;
  city: string;
  country: string;
  countryCode: string;
  flag?: React.ReactNode;
  formatted?: string;
}

export const useMapClick = () => {
  const [locationDetails, setLocationDetails] =
    useState<LocationDetails | null>(null);

  // Fetch details from Nominatim
  const fetchLocationDetails = async (coords: [number, number]) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords[0]}&lon=${coords[1]}&addressdetails=1`
    );
    const data = await response.json();

    const {
      city = "",
      town = "",
      village = "",
      country = "Unknown Country",
      country_code = "",
      state = "",
      county = "",
      suburb = "",
      neighbourhood = "",
    } = data.address || {};

    const placeName =
      city || town || village || suburb || neighbourhood || "Unknown Place";
    const areaName = suburb || neighbourhood || state || county || "";
    const countryCode = country_code?.toUpperCase();

    return {
      coords,
      placeName,
      city,
      country,
      countryCode,
      flag: getCountryFlag(country_code),
      formatted: areaName
        ? `${placeName} (${areaName}), ${country}`
        : `${placeName}, ${country}`,
    };
  };

  const handleMapClick = useCallback((coords: [number, number]) => {
    fetchLocationDetails(coords).then(setLocationDetails);
  }, []);

  return { locationDetails, handleMapClick };
};
