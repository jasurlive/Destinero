import { useState, useCallback } from "react";

interface LocationDetails {
  placeName: string;
  city: string;
  country: string;
  countryCode: string;
}

interface UseUserLocationResult {
  coords: [number, number] | null;
  locationDetails: LocationDetails | null;
  isFetching: boolean;
  error: string | null;
  getUserLocation: () => void;
}

export const useUserLocation = (): UseUserLocationResult => {
  const [coords, setCoords] = useState<[number, number] | null>(null);
  const [locationDetails, setLocationDetails] =
    useState<LocationDetails | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLocationDetails = useCallback(async (coords: [number, number]) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords[0]}&lon=${coords[1]}`
      );
      const data = await response.json();
      setLocationDetails({
        placeName: data.display_name,
        city:
          data.address.city || data.address.town || data.address.village || "",
        country: data.address.country || "",
        countryCode: data.address.country_code?.toUpperCase() || "",
      });
    } catch {
      setLocationDetails(null); // silently fail
    }
  }, []);

  const getUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setIsFetching(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: [number, number] = [
          position.coords.latitude,
          position.coords.longitude,
        ];
        setCoords(coords);
        setError(null);
        setIsFetching(false);
        fetchLocationDetails(coords);
      },
      () => {
        setError("Unable to retrieve your location");
        setIsFetching(false);
      }
    );
  }, [fetchLocationDetails]);

  return { coords, locationDetails, isFetching, error, getUserLocation };
};
