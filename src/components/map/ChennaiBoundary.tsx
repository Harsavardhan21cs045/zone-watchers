import mapboxgl from 'mapbox-gl';

interface ChennaiBoundaryProps {
  map: mapboxgl.Map;
}

export class ChennaiBoundary {
  private map: mapboxgl.Map;

  constructor({ map }: ChennaiBoundaryProps) {
    this.map = map;
    this.addBoundaryLayer();
  }

  private addBoundaryLayer() {
    const geojsonData = {
      type: 'Feature' as const,
      properties: {},
      geometry: {
        type: 'Polygon' as const,
        coordinates: [[
          [80.2497, 13.0427],
          [80.2897, 13.0427],
          [80.2897, 13.0827],
          [80.2497, 13.0827],
          [80.2497, 13.0427]
        ]]
      }
    };

    this.map.addLayer({
      id: 'chennai-boundary',
      type: 'line',
      source: {
        type: 'geojson',
        data: geojsonData
      },
      paint: {
        'line-color': '#FF0000',
        'line-width': 2,
        'line-dasharray': [2, 2]
      }
    });
  }

  cleanup() {
    if (this.map.getLayer('chennai-boundary')) {
      this.map.removeLayer('chennai-boundary');
    }
    if (this.map.getSource('chennai-boundary')) {
      this.map.removeSource('chennai-boundary');
    }
  }
}