import { useState, useCallback } from "react";
import { getCountryFlag } from "../components/getCountryFlags";

export interface LocationDetails {
  coords: [number, number];
  placeName: string;
  city: string;
  country: string;
  countryCode: string;
  flag?: React.ReactNode;
  loading?: boolean;
}

export const useFetchLocation = () => {
  const [locationMap, setLocationMap] = useState<
    Record<string, LocationDetails>
  >({});
  const [loading, setLoading] = useState(false);

  const coordsKey = (coords: [number, number]) => `${coords[0]},${coords[1]}`;

  const fetchCoordsData = useCallback(
    async (coords: [number, number]) => {
      const key = coordsKey(coords);
      if (locationMap[key]) return locationMap[key];

      setLoading(true);
      try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords[0]}&lon=${coords[1]}&addressdetails=1`;
        const resp = await fetch(url);
        if (!resp.ok) throw new Error(`Reverse geocode failed: ${resp.status}`);
        const data = await resp.json();
        const {
          city = "",
          town = "",
          village = "",
          country = "Unknown Country",
          country_code = "",
        } = data.address || {};

        const details: LocationDetails = {
          coords,
          placeName: data.display_name || "Unknown Place",
          city: city || town || village || "Unknown city",
          country,
          countryCode: country_code.toUpperCase(),
          flag: getCountryFlag(country_code.toUpperCase()),
        };

        setLocationMap((prev) => ({ ...prev, [key]: details }));
        return details;
      } catch (err) {
        console.error("Fetch location error:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [locationMap]
  );

  const getDetailsForCoords = useCallback(
    (coords?: [number, number] | null) =>
      coords ? locationMap[coordsKey(coords)] || null : null,
    [locationMap]
  );

  return { locationMap, loading, fetchCoordsData, getDetailsForCoords };
};
