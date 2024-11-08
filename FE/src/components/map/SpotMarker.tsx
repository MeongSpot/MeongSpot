import { MapMarker } from 'react-kakao-maps-sdk';
import type { MapMarkerImageType, Marker } from '@/types/map';

interface SpotMarkerProps {
  marker: Marker;
  onClick: () => void;
  image: MapMarkerImageType;
}

export const SpotMarker = ({ marker, onClick, image }: SpotMarkerProps) => {
  const position = {
    lat: marker.position.lat,
    lng: marker.position.lng,
  };

  return <MapMarker position={position} onClick={onClick} image={image} />;
};
