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
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    console.log('Initializing map...');
    
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [80.2707, 13.0827], // Chennai coordinates
        zoom: 12,
        pitch: 45,
        bearing: -45
      });

      map.current.on('load', () => {
        console.log('Map loaded successfully');
        if (map.current) {
          const chennaiBoundary = new ChennaiBoundary({ map: map.current });
          const officialMarkers = new OfficialMarkers({ 
            map: map.current, 
            officials, 
            onZoneViolation 
          });
        }
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    } catch (error) {
      console.error('Error initializing map:', error);
    }

    // Cleanup function
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [officials, onZoneViolation]);

  return (
    <div className="relative w-full h-full min-h-[600px]">
      <div 
        ref={mapContainer} 
        className="absolute inset-0 rounded-lg shadow-lg" 
        style={{ minHeight: '600px' }}
      />
    </div>
  );
};