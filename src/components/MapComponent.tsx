import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface Official {
  id: string;  // Changed from number to string to match Supabase's type
  name: string;
  location: [number, number];
  status: string;
}

interface MapComponentProps {
  officials: Official[];
  onZoneViolation?: (officialId: string) => void;
  isOfficialApp?: boolean;
}

mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';

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
    
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [80.2707, 13.0827],
      zoom: 12
    });

    mapInstance.current = map;

    map.on('load', () => {
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
    });

    return () => {
      Object.values(markersRef.current).forEach(marker => marker.remove());
      markersRef.current = {};
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstance.current) return;

    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    officials.forEach(official => {
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
  }, [officials, onZoneViolation]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};