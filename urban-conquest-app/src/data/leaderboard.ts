// Leaderboard data for distance-based ranking
// Will be populated from Supabase

export const DISTANCE_OPTIONS = [2, 5, 8, 10, 15, 20, 25] as const;
export type DistanceKm = typeof DISTANCE_OPTIONS[number];

export interface LeaderboardEntry {
    rank: number;
    username: string;
    avatar: string;
    time: string; // "12:34" format
    pace: string; // "5:30/km"
    date: string;
}

export interface DistanceRoute {
    km: DistanceKm;
    difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
    estimatedTime: string;
    icon: string;
    gradient: string;
    top1: LeaderboardEntry | null;
}

// Generate leaderboard for a specific city and distance
// Returns empty array - will be populated from Supabase
export const generateLeaderboard = (_city: string, _km: DistanceKm): LeaderboardEntry[] => {
    // Empty - will fetch from Supabase
    return [];
};

// Get distance routes with Top 1 for each
export const getDistanceRoutes = (city: string): DistanceRoute[] => {
    return DISTANCE_OPTIONS.map((km) => {
        const leaderboard = generateLeaderboard(city, km);

        let difficulty: DistanceRoute['difficulty'];
        let estimatedTime: string;
        let icon: string;
        let gradient: string;

        switch (km) {
            case 2:
                difficulty = 'easy';
                estimatedTime = '10-15 min';
                icon = '🏃';
                gradient = 'from-emerald-500 to-green-400';
                break;
            case 5:
                difficulty = 'easy';
                estimatedTime = '25-35 min';
                icon = '🏃‍♂️';
                gradient = 'from-cyan-500 to-teal-400';
                break;
            case 8:
                difficulty = 'medium';
                estimatedTime = '40-55 min';
                icon = '🔥';
                gradient = 'from-blue-500 to-indigo-400';
                break;
            case 10:
                difficulty = 'medium';
                estimatedTime = '50-70 min';
                icon = '💪';
                gradient = 'from-violet-500 to-purple-400';
                break;
            case 15:
                difficulty = 'hard';
                estimatedTime = '75-100 min';
                icon = '⚡';
                gradient = 'from-orange-500 to-amber-400';
                break;
            case 20:
                difficulty = 'hard';
                estimatedTime = '100-140 min';
                icon = '🏆';
                gradient = 'from-rose-500 to-pink-400';
                break;
            case 25:
                difficulty = 'extreme';
                estimatedTime = '130-180 min';
                icon = '👑';
                gradient = 'from-yellow-400 to-amber-300';
                break;
        }

        return {
            km,
            difficulty,
            estimatedTime,
            icon,
            gradient,
            top1: leaderboard[0] || null,
        };
    });
};

// Brazilian states
export const BRAZILIAN_STATES = [
    { code: 'AC', name: 'Acre' },
    { code: 'AL', name: 'Alagoas' },
    { code: 'AP', name: 'Amapá' },
    { code: 'AM', name: 'Amazonas' },
    { code: 'BA', name: 'Bahia' },
    { code: 'CE', name: 'Ceará' },
    { code: 'DF', name: 'Distrito Federal' },
    { code: 'ES', name: 'Espírito Santo' },
    { code: 'GO', name: 'Goiás' },
    { code: 'MA', name: 'Maranhão' },
    { code: 'MT', name: 'Mato Grosso' },
    { code: 'MS', name: 'Mato Grosso do Sul' },
    { code: 'MG', name: 'Minas Gerais' },
    { code: 'PA', name: 'Pará' },
    { code: 'PB', name: 'Paraíba' },
    { code: 'PR', name: 'Paraná' },
    { code: 'PE', name: 'Pernambuco' },
    { code: 'PI', name: 'Piauí' },
    { code: 'RJ', name: 'Rio de Janeiro' },
    { code: 'RN', name: 'Rio Grande do Norte' },
    { code: 'RS', name: 'Rio Grande do Sul' },
    { code: 'RO', name: 'Rondônia' },
    { code: 'RR', name: 'Roraima' },
    { code: 'SC', name: 'Santa Catarina' },
    { code: 'SP', name: 'São Paulo' },
    { code: 'SE', name: 'Sergipe' },
    { code: 'TO', name: 'Tocantins' },
];

export interface StateRanking {
    rank: number;
    username: string;
    avatar: string;
    firstPlaces: number;
    city: string;
    totalRuns: number;
}

// Generate Top 100 for a state
// Returns empty array - will be populated from Supabase
export const getStateRanking = (_stateCode: string): StateRanking[] => {
    // Empty - will fetch from Supabase
    return [];
};

// Reverse geocoding to get city from coordinates
export const getCityFromCoords = async (lat: number, lon: number): Promise<{ city: string; state: string; stateCode: string } | null> => {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`,
            {
                headers: {
                    'User-Agent': 'UrbanConquestApp/1.0',
                },
            }
        );

        if (!response.ok) return null;

        const data = await response.json();
        const address = data.address;

        // Try to get city name from various fields
        const city = address.city || address.town || address.municipality || address.village || address.county || 'Cidade Desconhecida';
        const state = address.state || 'Estado Desconhecido';

        // Map state name to code
        const stateEntry = BRAZILIAN_STATES.find(s =>
            state.toLowerCase().includes(s.name.toLowerCase()) || s.name.toLowerCase().includes(state.toLowerCase())
        );

        return {
            city,
            state,
            stateCode: stateEntry?.code || 'BR',
        };
    } catch (error) {
        console.error('Geocoding error:', error);
        return null;
    }
};
