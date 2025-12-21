// lock, reset, live location, search buttons logic
import { useFlyTo } from "./useFlyTo";

export const useButtons = (
  setSearchedPlace: React.Dispatch<
    React.SetStateAction<{ coords: [number, number]; name?: string } | null>
  >,
  setLiveLocation: React.Dispatch<React.SetStateAction<[number, number] | null>>
) => {
  const { flyTo } = useFlyTo();

  const resetView = async () => {
    await flyTo([40, 62], { zoom: 4, duration: 3 });
  }; // resets map to default view with zoom animation

  const goToLiveLocation = async () => {
    const coords: [number, number] | null = await new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) =>
          resolve([position.coords.latitude, position.coords.longitude]),
        () => {
          console.log("Unable to get your location");
          resolve(null);
        }
      );
    });

    if (!coords) return;

    setLiveLocation(coords);
    await flyTo(coords, { zoom: 15, duration: 3 }); // zooms into user live location
  };

  const searchPlace = async (query: string) => {
    if (!query.trim()) return;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}`
      );
      const results = await res.json();
      const first = results[0];
      if (!first) return console.log("Place not found");

      const coords: [number, number] = [
        parseFloat(first.lat),
        parseFloat(first.lon),
      ];
      await flyTo(coords, { zoom: 15, duration: 3 }); // zooms into searched place coords
      setSearchedPlace({ coords, name: query });
    } catch {
      console.log("Global search failed");
    }
  };

  return { resetView, goToLiveLocation, searchPlace };
};
