import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

interface ChennaiBoundaryProps {
  map: mapboxgl.Map;
}

export const ChennaiBoundary: React.FC<ChennaiBoundaryProps> = ({ map }) => {
  useEffect(() => {
    // Add the boundary layer
    map.addLayer({
      id: 'chennai-boundary',
      type: 'line',
      source: {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [[
              [80.2497, 13.0427],
              [80.2897, 13.0427],
              [80.2897, 13.0827],
              [80.2497, 13.0827],
              [80.2497, 13.0427]
            ]]
          }
        }
      },
      paint: {
        'line-color': '#FF0000',
        'line-width': 2,
        'line-dasharray': [2, 2]
      }
    });

    // Cleanup
    return () => {
      if (map.getLayer('chennai-boundary')) {
        map.removeLayer('chennai-boundary');
      }
      if (map.getSource('chennai-boundary')) {
        map.removeSource('chennai-boundary');
      }
    };
  }, [map]);

  return null;
};