// Point type for coordinates
type Point = {
  lat: number;
  lng: number;
};

// Define Chennai zone polygon vertices (clockwise order)
export const chennaiZonePolygon: Point[] = [
  { lat: 13.2367, lng: 80.1849 }, // Northwest
  { lat: 13.2367, lng: 80.3327 }, // Northeast
  { lat: 12.9343, lng: 80.3327 }, // Southeast
  { lat: 12.9343, lng: 80.1849 }, // Southwest
];

/**
 * Implementation of Ray Casting algorithm for Point-in-Polygon detection
 */
export const isPointInPolygon = (point: Point, polygon: Point[]): boolean => {
  let inside = false;
  
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lng;
    const yi = polygon[i].lat;
    const xj = polygon[j].lng;
    const yj = polygon[j].lat;
    
    const intersect = ((yi > point.lat) !== (yj > point.lat))
        && (point.lng < (xj - xi) * (point.lat - yi) / (yj - yi) + xi);
    
    if (intersect) inside = !inside;
  }
  
  return inside;
};

/**
 * Check if a point is within the Chennai zone
 */
export const isWithinChennaiZone = (lat: number, lng: number): boolean => {
  return isPointInPolygon({ lat, lng }, chennaiZonePolygon);
};