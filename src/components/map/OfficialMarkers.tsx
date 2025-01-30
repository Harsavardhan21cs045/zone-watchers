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

export class OfficialMarkers {
  private markers: { [key: string]: mapboxgl.Marker } = {};

  constructor({ map, officials, onZoneViolation }: OfficialMarkersProps) {
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
        
        this.markers[official.id] = marker;

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
  }

  cleanup() {
    Object.values(this.markers).forEach(marker => marker.remove());
    this.markers = {};
  }
}