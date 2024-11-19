import { MapMarker, CustomOverlayMap } from 'react-kakao-maps-sdk';
import type { MapMarkerImageType, Marker } from '@/types/map';

interface SpotMarkerProps {
  marker: Marker & { meetingCnt?: number };
  onClick: () => void;
  image: MapMarkerImageType;
}

export const SpotMarker = ({ marker, onClick, image }: SpotMarkerProps) => {
  const position = {
    lat: marker.position.lat,
    lng: marker.position.lng,
  };

  return (
    <>
      <MapMarker position={position} onClick={onClick} image={image} />
      <CustomOverlayMap
        position={position}
        yAnchor={2.5} // 위치 조정
        xAnchor={0.0} // 위치 조정
      >
        <div
          className="bg-deep-coral text-white text- font-bold rounded-full w-8 h-8 flex items-center justify-center shadow-md"
          style={{ transform: 'translateY(-2px)' }} // 미세 조정이 필요한 경우
        >
          {marker.meetingCnt ?? 0}
        </div>
      </CustomOverlayMap>
    </>
  );
};
