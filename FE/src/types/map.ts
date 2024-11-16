// types/map.ts
export interface LatLng {
  lat: number;
  lng: number;
}

export interface MapBounds {
  sw: LatLng;
  ne: LatLng;
}

export interface Marker {
  position: LatLng;
  content: string;
}

export interface MapMarkerImageType {
  src: string;
  size: {
    width: number;
    height: number;
  };
}

export interface ApiSpotInfo {
  meetingCnt: number;
  spotId: number;
  lat: number;
  lng: number;
  name: string;
}

export interface SpotResponse {
  code: string;
  message: string;
  data: ApiSpotInfo[];
}

// 지도 관련 유틸리티 타입들 추가
export interface RadiusResult {
  shortRadius: number;
  longRadius: number;
}

export interface MapContextType {
  currentPosition: LatLng;
  isTracking: boolean;
  onMapMove: () => void;
  searchResult: LatLng | null;
  isCompassMode: boolean; // 추가
  heading: number | null; // 추가
  isMobile: boolean; // 추가
}

export interface SpotImageType {
  src: string;
  size: {
    width: number;
    height: number;
  };
}

export interface SpotRecommendResponse {
  code: string;
  message: string;
  data: ApiSpotInfo[];
}
