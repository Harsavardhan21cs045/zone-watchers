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
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ [key: number]: mapboxgl.Marker }>({});

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    mapboxgl.accessToken = 'YOUR_MAPBOX_TOKEN'; // Replace with your token
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [80.2707, 13.0827], // Chennai coordinates
      zoom: 12
    });

    // Add Chennai zones (simplified for demo)
    map.current.on('load', () => {
      if (!map.current) return;
      
      map.current.addSource('zones', {
        type: 'geojson',
        data: {
          type: 'Feature',
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

      map.current.addLayer({
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
      map.current?.remove();
    };
  }, []);

  // Update markers when officials change
  useEffect(() => {
    if (!map.current) return;

    officials.forEach(official => {
      let marker = markersRef.current[official.id];
      
      if (!marker) {
        const el = document.createElement('div');
        el.className = 'w-4 h-4 bg-bandobast-accent rounded-full border-2 border-white';
        
        marker = new mapboxgl.Marker(el)
          .setLngLat(official.location)
          .addTo(map.current!);
        
        markersRef.current[official.id] = marker;
      } else {
        marker.setLngLat(official.location);
      }

      // Check if official is outside zone (simplified)
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