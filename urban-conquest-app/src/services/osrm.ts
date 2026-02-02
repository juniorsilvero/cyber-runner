// Mapbox Directions API for ultra-fast street-accurate routing
const MAPBOX_TOKEN = 'pk.eyJ1IjoiZGpvdGFzdXBvcnRlIiwiYSI6ImNta3lqMXFnczA3dW4zZ3B6ZzQ0bXR5aDUifQ.DGWu3Qvq9trKh06ZB6cIVA';

// Route caching to avoid repeated API calls
const routeCache = new Map<string, [number, number][]>();

// Generate cache key from coordinates
function getCacheKey(points: [number, number][]): string {
    return points.map(p => `${p[0].toFixed(5)},${p[1].toFixed(5)}`).join('|');
}

/**
 * Fetch route from Mapbox Directions API
 * Mapbox is much faster and reliable than OSRM/ORS.
 */
async function fetchFromMapbox(points: [number, number][]): Promise<[number, number][] | null> {
    if (points.length < 2) return null;

    // Mapbox expects [longitude, latitude] format
    // Mapbox Directions coordinates limit: 25 for most plans
    const coordsString = points.map(p => `${p[1]},${p[0]}`).join(';');

    // Using 'driving' profile for robust street-snapping (avoids water/unwalkable gaps better for territory shapes)
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordsString}?access_token=${MAPBOX_TOKEN}&geometries=geojson&overview=full`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000); // 8s timeout

    try {
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeout);

        if (!response.ok) {
            const error = await response.json();
            console.warn('Mapbox API error:', error);
            return null;
        }

        const data = await response.json();

        if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
            // Mapbox returns [lon, lat], convert back to [lat, lon]
            return data.routes[0].geometry.coordinates.map((coord: number[]) =>
                [coord[1], coord[0]] as [number, number]
            );
        }

        return null;
    } catch (error) {
        clearTimeout(timeout);
        console.warn('Mapbox fetch failed:', error);
        return null;
    }
}

/**
 * Main function to fetch route with high-performance caching
 */
export async function fetchRoute(points: [number, number][]): Promise<[number, number][]> {
    if (points.length < 2) return points;

    // Check if it's already a circuit (start = end)
    // If not, we could force it here, but it's better to have correct input points

    // Check cache first
    const cacheKey = getCacheKey(points);
    if (routeCache.has(cacheKey)) {
        return routeCache.get(cacheKey)!;
    }

    // Primary: Mapbox
    let route = await fetchFromMapbox(points);

    // If Mapbox fails, return original points (avoid slow fallbacks for better UX)
    if (!route) {
        return points;
    }

    // Cache the result
    routeCache.set(cacheKey, route);

    return route;
}

/**
 * Batch fetch routes with high concurrency for Mapbox
 * Mapbox allows much higher rate limits than standard free APIs.
 */
export async function fetchRoutesBatch(
    routes: Array<{ id: number; path: [number, number][] }>,
    onProgress?: (completed: number, total: number) => void
): Promise<Map<number, [number, number][]>> {
    const results = new Map<number, [number, number][]>();

    // Mapbox allows concurrent requests. We can process them in small chunks.
    const chunkSize = 5;
    for (let i = 0; i < routes.length; i += chunkSize) {
        const chunk = routes.slice(i, i + chunkSize);

        await Promise.all(chunk.map(async (route) => {
            try {
                const path = await fetchRoute(route.path);
                results.set(route.id, path);
            } catch (error) {
                console.error(`Failed to fetch route ${route.id}:`, error);
                results.set(route.id, route.path);
            }
        }));

        if (onProgress) {
            const completed = Math.min(i + chunkSize, routes.length);
            onProgress(completed, routes.length);
        }

        // Small delay between chunks just to be safe, though Mapbox is very robust
        if (i + chunkSize < routes.length) {
            await new Promise(resolve => setTimeout(resolve, 100)); // 100ms instead of 600ms
        }
    }

    return results;
}
