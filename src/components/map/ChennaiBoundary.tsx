import React from 'react';
import mapboxgl from 'mapbox-gl';

interface ChennaiBoundaryProps {
  map: mapboxgl.Map;
}

export class ChennaiBoundary {
  constructor({ map }: ChennaiBoundaryProps) {
    // Add the boundary layer
    map.addLayer({
      id: 'chennai-boundary',
      type: 'line',
      source: {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},  // Added required empty properties object
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

    // Add cleanup method
    this.cleanup = () => {
      if (map.getLayer('chennai-boundary')) {
        map.removeLayer('chennai-boundary');
      }
      if (map.getSource('chennai-boundary')) {
        map.removeSource('chennai-boundary');
      }
    };
  }

  cleanup: () => void;
}