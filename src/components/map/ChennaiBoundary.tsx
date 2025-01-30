import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

interface ChennaiBoundaryProps {
  map: mapboxgl.Map;
}

export const ChennaiBoundary = ({ map }: ChennaiBoundaryProps) => {
  useEffect(() => {
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

    return () => {
      if (map.getSource('chennai-boundary')) {
        map.removeLayer('boundary-line');
        map.removeLayer('boundary-fill');
        map.removeSource('chennai-boundary');
      }
    };
  }, [map]);

  return null;
};