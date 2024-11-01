declare const kakao: {
  maps: {
    Map: {
      new (
        container: HTMLElement,
        options: {
          center: LatLng;
          level?: number;
        },
      ): {
        getCenter(): LatLng;
        setCenter(latlng: LatLng): void;
        getBounds(): LatLngBounds;
        getLevel(): number;
        setLevel(level: number): void;
      };
    };
    LatLng: {
      new (lat: number, lng: number): LatLng;
    };
    services: {
      Places: new () => Places;
      Status: {
        OK: string;
        ZERO_RESULT: string;
        ERROR: string;
      };
    };
  };
};

interface LatLng {
  getLat(): number;
  getLng(): number;
}

interface LatLngBounds {
  extend(latlng: LatLng): void;
}

interface Places {
  keywordSearch(
    keyword: string,
    callback: (result: PlacesSearchResult[], status: string, pagination: Pagination) => void,
  ): void;
}

interface PlacesSearchResult {
  place_name: string;
  address_name: string;
  x: string;
  y: string;
}

interface Pagination {
  current: number;
  total: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

declare global {
  interface Window {
    kakao: typeof kakao;
  }
}

export {};
