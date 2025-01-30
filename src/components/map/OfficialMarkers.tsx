import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

interface Official {
  id: string;
  name: string;
  location: [number, number];
  status: string;
}

interface OfficialMarkersProps {
  map: mapboxgl.Map;
  officials: Official[];
  onZoneViolation?: (officialId: string) => void;
}

export const OfficialMarkers = ({ map, officials, onZoneViolation }: OfficialMarkersProps) => {
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});

  useEffect(() => {
    // Remove existing markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    // Add new markers
    officials.forEach(official => {
      if (!official.location) return;

      try {
        const el = document.createElement('div');
        el.className = `w-4 h-4 rounded-full border-2 border-white ${
          official.status === 'on-duty' ? 'bg-green-500' : 'bg-red-500'
        }`;
        
        const marker = new mapboxgl.Marker(el)
          .setLngLat(official.location)
          .setPopup(new mapboxgl.Popup({ offset: 25 })
            .setHTML(`<strong>${official.name}</strong><br>Status: ${official.status}`))
          .addTo(map);
        
        markersRef.current[official.id] = marker;

        // Check zone violation
        const [lng, lat] = official.location;
        if (
          lng < 80.2497 || lng > 80.2897 ||
          lat < 13.0427 || lat > 13.0827
        ) {
          onZoneViolation?.(official.id);
        }
      } catch (error) {
        console.error('Error adding marker for official:', official.id, error);
      }
    });

    return () => {
      Object.values(markersRef.current).forEach(marker => marker.remove());
      markersRef.current = {};
    };
  }, [map, officials, onZoneViolation]);

  return null;
};