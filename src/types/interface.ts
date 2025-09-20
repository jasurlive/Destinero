export interface Place {
  name?: string;
  coords: [number, number];
  imageLink?: string;
  type: string;
  icon: React.ReactElement;
  countryCode?: string;
  autoOpen?: boolean;
}

export interface CreatePopupProps {
  place: {
    type:
      | "current"
      | "searched"
      | "clicked"
      | "visited"
      | "planned"
      | "highlighted";
    coords: [number, number];
    icon: React.ReactNode;
    name?: string;
    imageLink?: string;
    description?: string;
  };
  locationDetails?: {
    placeName: string;
    city: string;
    country: string;
    countryCode: string;
  } | null;
  handleCopyClick?: () => void;
  autoOpen?: boolean; // optional for future auto-open behavior
  onPlaceClick?: () => void;
  loading?: boolean;
}

export interface PlaceData {
  Name: string;
  Coords?: string;
  "Image Links"?: string;
}

export interface MapProps {
  visitedPlaces: Place[];
  plannedPlaces: Place[];
  highlightedPlaces: Place[];
  searchCoords: [number, number] | null;
  setSearchCoords: React.Dispatch<
    React.SetStateAction<[number, number] | null>
  >;
  locked?: boolean;
}

export interface PlaceMarkersProps {
  visitedPlaces: MapProps["visitedPlaces"];
  plannedPlaces: MapProps["plannedPlaces"];
  highlightedPlaces?: MapProps["highlightedPlaces"];
  autoOpen?: boolean;
}

export interface PopupHandlerProps {
  popupCoords: [number, number] | null;
  searchCoords: [number, number] | null;
  liveCoords: [number, number] | null | undefined;
  locationDetails: LocationDetails | null;
  mapRef: React.RefObject<L.Map | null>;
  copyCoordsToClipboard: (coords: [number, number]) => void;
  copySuccess: boolean;
  loading?: boolean;
}

export interface SearchBoxProps {
  map: any;
  copySuccess: boolean;
  onSearch: (coords: [number, number]) => void;
  handleCopyClick?: (coords: [number, number]) => void;
}

export interface MapEventsProps {
  onClick: (coords: [number, number]) => void;
}

export interface UseSearchResult {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  search: () => void;
  resultCoords: [number, number] | null;
  isSearching: boolean;
  error: string | null;
  success: string | null;
}

export interface UsePopupOptionsProps {
  autoOpen?: boolean;
  coords?: [number, number];
  handleCopyClick?: () => void;
}

export interface LocationDetails {
  coords?: [number, number];
  placeName: string;
  city: string;
  country: string;
  countryCode: string;
  flag?: React.ReactNode;
}

export interface UseUserLocationResult {
  coords: [number, number] | null;
  locationDetails: LocationDetails | null;
  isFetching: boolean;
  error: string | null;
  getUserLocation: () => void;
}
