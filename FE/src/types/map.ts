// types/map.ts
export interface LatLng {
  lat: number;
  lng: number;
}

export interface Marker {
  position: LatLng;
  content: string;
}

export interface MapContextType {
  searchKeyword: string;
  currentLocation: string;
  currentPosition: LatLng;
  isTracking: boolean;
  handleSearch?: () => void;
}

export interface MapMarkerImageType {
  src: string;
  size: {
    width: number;
    height: number;
  };
}
