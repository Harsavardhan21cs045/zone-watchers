import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { ChennaiBoundary } from './map/ChennaiBoundary';
import { OfficialMarkers } from './map/OfficialMarkers';
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

const defaultToken = 'pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbHM0Z2NyNHQwbWR4MmptbGw3ZjBocWo0In0.qY4WRhhYoIxMqaXfAQVj5Q';

export const MapComponent: React.FC<MapComponentProps> = ({ 
  officials, 
  onZoneViolation,
  isOfficialApp = false 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapToken, setMapToken] = useState(defaultToken);
  const { toast } = useToast();
  const boundaryRef = useRef<ChennaiBoundary | null>(null);
  const markersRef = useRef<OfficialMarkers | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    console.log('Initializing map...');
    
    try {
      mapboxgl.accessToken = mapToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [80.2707, 13.0827],
        zoom: 12,
        pitch: 45,
        bearing: -45
      });

      map.current.on('load', () => {
        console.log('Map loaded successfully');
        if (map.current) {
          try {
            boundaryRef.current = new ChennaiBoundary({ map: map.current });
            markersRef.current = new OfficialMarkers({ 
              map: map.current, 
              officials, 
              onZoneViolation 
            });
          } catch (error) {
            console.error('Error initializing map components:', error);
            toast({
              title: "Map Error",
              description: "There was an error loading the map components",
              variant: "destructive"
            });
          }
        }
      });

      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
        if (e.error && typeof e.error === 'object' && 'status' in e.error) {
          if (e.error.status === 401) {
            toast({
              title: "Invalid Map Token",
              description: "Please check your Mapbox access token",
              variant: "destructive"
            });
          }
        }
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    } catch (error) {
      console.error('Error initializing map:', error);
      toast({
        title: "Map Error",
        description: "There was an error initializing the map",
        variant: "destructive"
      });
    }

    return () => {
      boundaryRef.current?.cleanup();
      markersRef.current?.cleanup();
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [officials, onZoneViolation, mapToken, toast]);

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