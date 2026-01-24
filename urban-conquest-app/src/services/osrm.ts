export async function fetchRoute(points: [number, number][]): Promise<[number, number][]> {
    if (points.length < 2) return points;

    // OSRM expects {longitude},{latitude} separated by semicolons
    const coordinates = points.map(p => `${p[1]},${p[0]}`).join(';');

    // Using OSRM public demo server (Foot profile for running)
    const url = `https://router.project-osrm.org/route/v1/foot/${coordinates}?overview=full&geometries=geojson`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
            console.error('OSRM Error:', data);
            return points; // Fallback to straight lines
        }

        // OSRM returns [lon, lat], we need [lat, lon] for Leaflet
        const geometry = data.routes[0].geometry.coordinates.map((coord: number[]) => [coord[1], coord[0]] as [number, number]);

        return geometry;
    } catch (error) {
        console.error('Failed to fetch route:', error);
        return points; // Fallback
    }
}
