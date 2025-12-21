import { useState } from "react";
import { TileLayer } from "react-leaflet";
import Marker from "./Markers";
import Buttons from "./Buttons";
import { usePlaces, AllPlaceTypes } from "../hooks/useFetchExcel";
import { useClickedMarker } from "../hooks/useClickedMarker";
import MapLock from "../tools/MapLock";

const KEY = import.meta.env["VITE_MAPKEY"];

export default function MapTiler() {
  const { visitedPlaces, plannedPlaces, highlightedPlaces } = usePlaces();

  const [searchedPlace, setSearchedPlace] = useState<{
    coords: [number, number];
    name?: string;
  } | null>(null);

  const [liveLocation, setLiveLocation] = useState<[number, number] | null>(
    null
  );

  const [locked] = useState(true);

  const { clickedMarker, setClickedMarker, ClickListener } = useClickedMarker();

  // Combine all markers
  const markers: AllPlaceTypes[] = [
    ...visitedPlaces.map((p) => ({ ...p, type: "visited" as const })),
    ...plannedPlaces.map((p) => ({ ...p, type: "planned" as const })),
    ...highlightedPlaces.map((p) => ({ ...p, type: "highlighted" as const })),
  ];

  if (searchedPlace) {
    markers.push({
      coords: searchedPlace.coords,
      type: "searched" as const,
      name: "Searched Place",
    });
  }

  if (liveLocation) {
    markers.push({
      coords: liveLocation,
      type: "live" as const,
      name: "Current Location",
    });
  }

  if (clickedMarker) {
    markers.push({ ...clickedMarker, type: "clicked" as const });
  }

  // Pick a random static marker to auto-open
  const staticMarkers = markers.filter((m) =>
    ["visited", "planned", "highlighted"].includes(m.type)
  );
  const randomStaticMarker = staticMarkers.length
    ? staticMarkers[Math.floor(Math.random() * staticMarkers.length)]
    : null;
  const autoOpenCoords = randomStaticMarker?.coords.join(",") || "";

  return (
    <>
      <MapLock locked={locked} />
      <TileLayer
        url={`https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${KEY}`}
      />

      <Buttons
        setSearchedPlace={setSearchedPlace}
        setLiveLocation={setLiveLocation}
        setClickedMarker={setClickedMarker}
      />

      <ClickListener />

      {markers.map((m, idx) => (
        <Marker
          key={idx}
          place={m}
          autoOpen={m.coords.join(",") === autoOpenCoords}
        />
      ))}
    </>
  );
}
