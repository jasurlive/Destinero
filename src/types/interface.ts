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
  place: Place;
  mapRef: React.RefObject<any>;
  handleCopyClick: () => void;
  copySuccess: boolean;
  onPlaceClick: (coords: [number, number]) => void;
  locationDetails?: {
    placeName: string;
    city: string;
    country: string;
    countryCode: string;
  };
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

export interface SearchBoxProps {
  map: any;
  copySuccess: boolean;
  onSearch: (coords: [number, number]) => void;
  handleCopyClick: (value: [number, number]) => void;
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
  placeName: string;
  city: string;
  country: string;
  countryCode: string;
}

export interface UseUserLocationResult {
  coords: [number, number] | null;
  locationDetails: LocationDetails | null;
  isFetching: boolean;
  error: string | null;
  getUserLocation: () => void;
}
