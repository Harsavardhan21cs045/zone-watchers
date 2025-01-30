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
        center: [80.2707, 13.0827], // Chennai coordinates
        zoom: 12,
        pitch: 45, // Add some tilt to the map
        bearing: -45 // Rotate slightly for better perspective
      });

      mapInstance.current = map;

      // Add navigation controls
      map.addControl(new mapboxgl.NavigationControl(), 'top-right');

      map.on('load', () => {
        // Add Chennai boundaries
        map.addSource('chennai-boundary', {
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

        // Add boundary line
        map.addLayer({
          id: 'boundary-line',
          type: 'line',
          source: 'chennai-boundary',
          paint: {
            'line-color': '#FF0000',
            'line-width': 2,
            'line-dasharray': [2, 2]
          }
        });

        // Add boundary fill
        map.addLayer({
          id: 'boundary-fill',
          type: 'fill',
          source: 'chennai-boundary',
          paint: {
            'fill-color': '#FF0000',
            'fill-opacity': 0.1
          }
        });
      });

      return () => {
        Object.values(markersRef.current).forEach(marker => marker.remove());
        markersRef.current = {};
        map.remove();
      };
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }, []);

  useEffect(() => {
    if (!mapInstance.current) return;

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
      } catch (error) {
        console.error('Error adding marker for official:', official.id, error);
      }
    });
  }, [officials, onZoneViolation]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg shadow-lg" />
    </div>
  );
};