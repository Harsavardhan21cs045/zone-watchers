import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { ChennaiBoundary } from './map/ChennaiBoundary';
import { OfficialMarkers } from './map/OfficialMarkers';

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

mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbHM0Z2NyNHQwbWR4MmptbGw3ZjBocWo0In0.qY4WRhhYoIxMqaXfAQVj5Q';

export const MapComponent: React.FC<MapComponentProps> = ({ 
  officials, 
  onZoneViolation,
  isOfficialApp = false 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    try {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [80.2707, 13.0827], // Chennai coordinates
        zoom: 12,
        pitch: 45, // Add some tilt to the map
        bearing: -45 // Rotate slightly for better perspective
      });

      mapInstance.current = map;

      // Add navigation controls
      map.addControl(new mapboxgl.NavigationControl(), 'top-right');

      return () => {
        map.remove();
      };
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }, []);

  if (!mapInstance.current) return null;

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg shadow-lg" />
      <ChennaiBoundary map={mapInstance.current} />
      <OfficialMarkers 
        map={mapInstance.current}
        officials={officials}
        onZoneViolation={onZoneViolation}
      />
    </div>
  );
};