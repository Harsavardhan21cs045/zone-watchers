
import React, { useRef } from 'react';
import { GoogleMap, LoadScript, Marker, Polygon } from '@react-google-maps/api';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { chennaiZonePolygon, isWithinChennaiZone } from '@/utils/geofencing';

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
  height: '100%'
};

const chennaiCenter = {
  lat: 13.0827,
  lng: 80.2707
};

const polygonOptions = {
  fillColor: "rgba(0, 255, 0, 0.1)",
  fillOpacity: 0.3,
  strokeColor: "#00FF00",
  strokeOpacity: 1,
  strokeWeight: 2,
};

export const MapComponent: React.FC<MapComponentProps> = ({ 
  officials, 
  onZoneViolation,
  isOfficialApp = false 
}) => {
  const { toast } = useToast();
  const mapRef = useRef(null);
  const isMobile = useIsMobile();

  const checkZoneViolation = (position: google.maps.LatLng) => {
    const lat = position.lat();
    const lng = position.lng();
    console.log('Checking zone violation for position:', { lat, lng });
    
    const isInZone = isWithinChennaiZone(lat, lng);
    console.log('Is within Chennai zone:', isInZone);
    
    return !isInZone;
  };

  const handleMarkerDrag = (officialId: string, position: google.maps.LatLng) => {
    if (checkZoneViolation(position) && onZoneViolation) {
      console.log('Zone violation detected for official:', officialId);
      onZoneViolation(officialId);
    }
  };

  const zonePolygonPath = chennaiZonePolygon.map(point => ({
    lat: point.lat,
    lng: point.lng
  }));

  return (
    <div className={`relative ${isMobile ? 'h-[calc(100dvh-4rem)]' : 'h-[600px]'} w-full`}>
      <LoadScript googleMapsApiKey=""> 
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={chennaiCenter}
          zoom={12}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            gestureHandling: isMobile ? 'greedy' : 'auto',
            zoomControl: !isMobile,
          }}
        >
          <Polygon
            paths={zonePolygonPath}
            options={polygonOptions}
          />

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
