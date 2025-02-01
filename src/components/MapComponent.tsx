import React, { useRef } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useToast } from '@/hooks/use-toast';

interface Official {
  id: string;
  name: string;
  location: [number, number];
  status: string;
}

interface MapComponentProps {
  officials: Official[];
  onZoneViolation?: (officialId: string) => void;
  isOfficialApp?: boolean;
}

const containerStyle = {
  width: '100%',
  height: '600px'
};

const chennaiBounds = {
  north: 13.2367,
  south: 12.9343,
  east: 80.3327,
  west: 80.1849,
};

const chennaiCenter = {
  lat: 13.0827,
  lng: 80.2707
};

export const MapComponent: React.FC<MapComponentProps> = ({ 
  officials, 
  onZoneViolation,
  isOfficialApp = false 
}) => {
  const { toast } = useToast();
  const mapRef = useRef(null);

  const checkZoneViolation = (position: google.maps.LatLng) => {
    const lat = position.lat();
    const lng = position.lng();
    
    if (lat < chennaiBounds.south || lat > chennaiBounds.north || 
        lng < chennaiBounds.west || lng > chennaiBounds.east) {
      return true;
    }
    return false;
  };

  const handleMarkerDrag = (officialId: string, position: google.maps.LatLng) => {
    if (checkZoneViolation(position) && onZoneViolation) {
      onZoneViolation(officialId);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[600px]">
      <LoadScript googleMapsApiKey=""> 
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={chennaiCenter}
          zoom={12}
          options={{
            restriction: {
              latLngBounds: chennaiBounds,
              strictBounds: false,
            },
            streetViewControl: false,
            mapTypeControl: false,
          }}
        >
          {officials.map((official) => (
            <Marker
              key={official.id}
              position={{ lat: official.location[1], lng: official.location[0] }}
              title={official.name}
              draggable={isOfficialApp}
              onDragEnd={(e) => {
                if (e.latLng) {
                  handleMarkerDrag(official.id, e.latLng);
                }
              }}
            />
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};