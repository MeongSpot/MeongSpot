// store/useMapStore.ts
import { create } from 'zustand';
import type { LatLng } from '@/types/map';
import type { SpotInfo } from '@/types/meetup';

interface MapState {
  center: LatLng | null;
  mapLevel: number;
  selectedSpot: SpotInfo | null;
  isModalOpen: boolean;
  setMapState: (state: Partial<MapState>) => void;
  resetMapState: () => void;
}

const initialState = {
  center: null,
  mapLevel: 4,
  selectedSpot: null,
  isModalOpen: false,
};

const useMapStore = create<MapState>((set) => ({
  ...initialState,

  setMapState: (newState) =>
    set((state) => ({
      ...state,
      ...newState,
    })),

  resetMapState: () => set(initialState),
}));

export default useMapStore;
