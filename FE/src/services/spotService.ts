// services/spotService.ts
import axiosInstance from '@/services/axiosInstance';
import type { LatLng, SpotResponse } from '@/types/map';

export const getDistance = (pos1: LatLng, pos2: LatLng) => {
  const R = 6371e3;
  const φ1 = (pos1.lat * Math.PI) / 180;
  const φ2 = (pos2.lat * Math.PI) / 180;
  const Δφ = ((pos2.lat - pos1.lat) * Math.PI) / 180;
  const Δλ = ((pos2.lng - pos1.lng) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const spotService = {
  getDistance, // getDistance 추가
  fetchSpots: async (position: LatLng, radius: number) => {
    try {
      const response = await axiosInstance.get<SpotResponse>(
        `/api/meeting-spot?lat=${position.lat}&lng=${position.lng}&radius=${radius}`,
      );
      if (response.data.code === 'MP100') {
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error('Error fetching spots:', error);
      return [];
    }
  },

  calculateMapRadius: (map: kakao.maps.Map) => {
    const mapNode = map.getNode();
    if (!mapNode) return { shortRadius: 1000, longRadius: 1000 };

    const bounds = map.getBounds();
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();

    const center = map.getCenter();

    const width =
      getDistance({ lat: center.getLat(), lng: sw.getLng() }, { lat: center.getLat(), lng: ne.getLng() }) / 2;

    const height =
      getDistance({ lat: sw.getLat(), lng: center.getLng() }, { lat: ne.getLat(), lng: center.getLng() }) / 2;

    return {
      shortRadius: Math.min(width, height),
      longRadius: Math.max(width, height),
    };
  },
};
