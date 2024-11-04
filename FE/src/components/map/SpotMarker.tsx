import { MapMarker } from 'react-kakao-maps-sdk';
import type { Marker } from '@/types/map';

interface SpotMarkerProps {
  marker: Marker;
  onClick: () => void;
  image: {
    src: string;
    size: {
      width: number;
      height: number;
    };
  };
}

export const SpotMarker = ({ marker, onClick, image }: SpotMarkerProps) => (
  <MapMarker
    key={`${marker.position.lat}-${marker.position.lng}`}
    position={marker.position}
    onClick={onClick}
    image={image}
  />
);
