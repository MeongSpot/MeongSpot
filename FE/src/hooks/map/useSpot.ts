// hooks/map/useSpot.ts
import { useState, useCallback } from 'react';
import { spotService } from '@/services/spotService';
import type { LatLng, Marker, ApiSpotInfo } from '@/types/map';

interface UseSpotProps {
  currentPosition: LatLng;
}

export const useSpot = ({ currentPosition }: UseSpotProps) => {
  const [spots, setSpots] = useState<ApiSpotInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [markerKey, setMarkerKey] = useState(0);

  const loadSpotsWithAPI = useCallback(
    async (map: kakao.maps.Map) => {
      if (!map || isLoading) return;
      setIsLoading(true);
      try {
        const center = map.getCenter();
        const position = { lat: center.getLat(), lng: center.getLng() };
        const { shortRadius, longRadius } = spotService.calculateMapRadius(map);

        // 첫 번째 시도: 짧은 반경으로 검색
        let spotsData = await spotService.fetchSpots(position, Math.round(shortRadius * 1.3));

        // 스팟이 없으면 반경을 1.6배로 늘려서 다시 시도
        if (spotsData.length === 0) {
          const mediumRadius = shortRadius * 1.6;
          spotsData = await spotService.fetchSpots(position, Math.round(mediumRadius));

          // 여전히 스팟이 없으면 긴 반경으로 최종 시도
          if (spotsData.length === 0) {
            spotsData = await spotService.fetchSpots(position, Math.round(longRadius));
          }

          // 스팟을 찾았다면 적절한 레벨로 조정
          if (spotsData.length > 0) {
            const spotBounds = new kakao.maps.LatLngBounds();
            spotBounds.extend(new kakao.maps.LatLng(currentPosition.lat, currentPosition.lng));

            // 찾은 스팟들 중 현재 위치에서 가장 가까운 N개만 선택 (예: 3개)
            const nearestSpots = spotsData
              .map((spot) => ({
                spot,
                distance: spotService.getDistance({ lat: spot.lat, lng: spot.lng }, currentPosition),
              }))
              .sort((a, b) => a.distance - b.distance)
              .slice(0, 3)
              .map(({ spot }) => spot);

            // 선택된 스팟들만 bounds에 포함
            nearestSpots.forEach((spot) => {
              spotBounds.extend(new kakao.maps.LatLng(spot.lat, spot.lng));
            });

            // bounds를 적용할 때 여유 공간을 더 줌
            const currentLevel = map.getLevel();
            map.setBounds(spotBounds, 100); // 여백을 더 크게

            // 레벨 변화가 너무 크면 제한
            const newLevel = map.getLevel();
            if (newLevel - currentLevel > 2) {
              map.setLevel(currentLevel + 2);
            }
          }
        }

        setSpots(spotsData);
        setMarkerKey((prev) => prev + 1);

        return spotsData.map((spot) => ({
          position: { lat: spot.lat, lng: spot.lng },
          content: spot.name,
        }));
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 200);
      }
    },
    [currentPosition],
  );

  const findSpotInfo = useCallback(
    (lat: number, lng: number) => {
      return spots.find((s) => s.lat === lat && s.lng === lng) || null;
    },
    [spots],
  );

  return {
    spots,
    isLoading,
    markerKey,
    loadSpotsWithAPI,
    findSpotInfo,
  };
};
