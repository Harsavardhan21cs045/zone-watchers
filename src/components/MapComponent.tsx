import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface Official {
  id: number;
  name: string;
  location: [number, number];
  status: string;
}

interface MapComponentProps {
  officials: Official[];
  onZoneViolation?: (officialId: number) => void;
  isOfficialApp?: boolean;
}

export const MapComponent: React.FC<MapComponentProps> = ({ 
  officials, 
  onZoneViolation,
  isOfficialApp = false 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ [key: number]: mapboxgl.Marker }>({});

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = 'YOUR_MAPBOX_TOKEN'; // Replace with your token
    
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [80.2707, 13.0827], // Chennai coordinates
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

    // Cleanup function
    return () => {
      Object.values(markersRef.current).forEach(marker => marker.remove());
      markersRef.current = {};
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Update markers
  useEffect(() => {
    if (!mapInstance.current) return;

    // Remove old markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    // Add new markers
    officials.forEach(official => {
      const el = document.createElement('div');
      el.className = 'w-4 h-4 bg-bandobast-accent rounded-full border-2 border-white';
      
      const marker = new mapboxgl.Marker(el)
        .setLngLat(official.location)
        .addTo(mapInstance.current!);
      
      markersRef.current[official.id] = marker;

      // Check zone violation
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