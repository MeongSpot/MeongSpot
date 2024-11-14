// store/useMapStore.ts
import { create } from 'zustand';
import type { LatLng } from '@/types/map';
import type { SpotInfo } from '@/types/meetup';

interface MapState {
  lastPosition: LatLng | null;
  mapLevel: number;
  selectedSpot: SpotInfo | null;
  isModalOpen: boolean;
  spots: any[]; // 마지막으로 검색된 스팟들 저장
  setLastPosition: (position: LatLng) => void;
  setMapLevel: (level: number) => void;
  setSelectedSpot: (spot: SpotInfo | null) => void;
  setModalOpen: (isOpen: boolean) => void;
  setSpots: (spots: any[]) => void;
  resetState: () => void;
}

const initialState = {
  lastPosition: null,
  mapLevel: 4,
  selectedSpot: null,
  isModalOpen: false,
  spots: [],
};

const useMapStore = create<MapState>((set) => ({
  ...initialState,
  setLastPosition: (position) => set({ lastPosition: position }),
  setMapLevel: (level) => set({ mapLevel: level }),
  setSelectedSpot: (spot) => set({ selectedSpot: spot }),
  setModalOpen: (isOpen) => set({ isModalOpen: isOpen }),
  setSpots: (spots) => set({ spots }),
  resetState: () => set(initialState),
}));

export default useMapStore;
