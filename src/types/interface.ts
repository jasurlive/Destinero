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
  handleCopyClick: () => void;
  copySuccess: boolean;
  onSearch: (coords: [number, number]) => void;
}

export interface MapEventsProps {
  onClick: (coords: [number, number]) => void;
}
