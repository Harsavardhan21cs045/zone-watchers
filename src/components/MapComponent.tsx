import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

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

// Use a valid public token - users should replace this with their own token in production
mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbHM0Z2NyNHQwbWR4MmptbGw3ZjBocWo0In0.qY4WRhhYoIxMqaXfAQVj5Q';

export const MapComponent: React.FC<MapComponentProps> = ({ 
  officials, 
  onZoneViolation,
  isOfficialApp = false 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});

  useEffect(() => {
    if (!mapContainer.current) return;
    
    try {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [80.2707, 13.0827],
        zoom: 12
      });

      mapInstance.current = map;

      map.on('load', () => {
        try {
          map.addSource('zones', {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'Polygon',
                coordinates: [[
                  [80.2497, 13.0827],
                  [80.2897, 13.0827],
                  [80.2897, 13.0427],
                  [80.2497, 13.0427],
                  [80.2497, 13.0827]
                ]]
              }
            }
          });

          map.addLayer({
            id: 'zone-borders',
            type: 'line',
            source: 'zones',
            paint: {
              'line-color': '#FF0000',
              'line-width': 2
            }
          });
        } catch (error) {
          console.error('Error adding map source or layer:', error);
        }
      });

      return () => {
        Object.values(markersRef.current).forEach(marker => marker.remove());
        markersRef.current = {};
        if (mapInstance.current) {
          mapInstance.current.remove();
          mapInstance.current = null;
        }
      };
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }, []);

  useEffect(() => {
    if (!mapInstance.current) return;

    try {
      Object.values(markersRef.current).forEach(marker => marker.remove());
      markersRef.current = {};

      officials.forEach(official => {
        if (!official.location) return;
        
        const el = document.createElement('div');
        el.className = 'w-4 h-4 bg-blue-500 rounded-full border-2 border-white';
        
        const marker = new mapboxgl.Marker(el)
          .setLngLat(official.location)
          .addTo(mapInstance.current!);
        
        markersRef.current[official.id] = marker;

        const [lng, lat] = official.location;
        if (
          lng < 80.2497 || lng > 80.2897 ||
          lat < 13.0427 || lat > 13.0827
        ) {
          onZoneViolation?.(official.id);
        }
      });
    } catch (error) {
      console.error('Error updating markers:', error);
    }
  }, [officials, onZoneViolation]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};