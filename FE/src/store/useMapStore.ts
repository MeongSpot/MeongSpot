import { create } from 'zustand';
import type { LatLng } from '@/types/map';
import type { SpotInfo } from '@/types/meetup';

interface MapState {
  lastPosition: LatLng | null;
  mapLevel: number;
  selectedSpot: SpotInfo | null;
  isModalOpen: boolean;
  setLastPosition: (position: LatLng) => void;
  setMapLevel: (level: number) => void;
  setSelectedSpot: (spot: SpotInfo | null) => void;
  setModalOpen: (isOpen: boolean) => void;
  resetState: () => void;
}

const initialState = {
  lastPosition: null,
  mapLevel: 4,
  selectedSpot: null,
  isModalOpen: false,
};

const useMapStore = create<MapState>((set) => ({
  ...initialState,

  setLastPosition: (position) => set({ lastPosition: position }),
  setMapLevel: (level) => set({ mapLevel: level }),
  setSelectedSpot: (spot) => set({ selectedSpot: spot }),
  setModalOpen: (isOpen) => set({ isModalOpen: isOpen }),
  resetState: () => set(initialState),
}));

export default useMapStore;
