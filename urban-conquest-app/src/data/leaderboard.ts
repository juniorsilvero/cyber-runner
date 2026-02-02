// Leaderboard data for distance-based ranking
// Mocked data - will be replaced with Supabase later

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

// Brazilian runner names for mocked data
const RUNNER_NAMES = [
    'Lucas Silva', 'Ana Santos', 'Pedro Costa', 'Mariana Oliveira',
    'Gabriel Souza', 'Julia Lima', 'Rafael Pereira', 'Camila Rodrigues',
    'Bruno Almeida', 'Fernanda Martins', 'Diego Ferreira', 'Larissa Gomes',
    'Thiago Ribeiro', 'Beatriz Carvalho', 'Matheus Araújo', 'Carolina Nascimento',
    'Leonardo Barbosa', 'Amanda Cardoso', 'Guilherme Rocha', 'Isabela Vieira'
];

// Generate random time based on distance
const generateTime = (km: number): string => {
    const basePace = 4.5 + Math.random() * 2; // 4:30 to 6:30 per km
    const totalMinutes = km * basePace;
    const minutes = Math.floor(totalMinutes);
    const seconds = Math.floor((totalMinutes - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

// Generate pace from time and distance
const generatePace = (timeStr: string, km: number): string => {
    const [min, sec] = timeStr.split(':').map(Number);
    const totalSeconds = min * 60 + sec;
    const paceSeconds = totalSeconds / km;
    const paceMin = Math.floor(paceSeconds / 60);
    const paceSec = Math.floor(paceSeconds % 60);
    return `${paceMin}:${paceSec.toString().padStart(2, '0')}/km`;
};

// Generate date within last 30 days
const generateDate = (): string => {
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toLocaleDateString('pt-BR');
};

// Generate avatar color
const generateAvatar = (): string => {
    const colors = [
        'bg-gradient-to-br from-yellow-400 to-orange-500',
        'bg-gradient-to-br from-cyan-400 to-blue-500',
        'bg-gradient-to-br from-pink-400 to-purple-500',
        'bg-gradient-to-br from-green-400 to-emerald-500',
        'bg-gradient-to-br from-red-400 to-rose-500',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
};

// Generate leaderboard for a specific city and distance
export const generateLeaderboard = (city: string, km: DistanceKm): LeaderboardEntry[] => {
    // Use city name as seed for consistent results
    const seed = city.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + km;
    const shuffledNames = [...RUNNER_NAMES].sort(() => (seed % 2) - 0.5);

    const entries: LeaderboardEntry[] = [];
    for (let i = 0; i < 10; i++) {
        const time = generateTime(km);
        entries.push({
            rank: i + 1,
            username: shuffledNames[i % shuffledNames.length],
            avatar: generateAvatar(),
            time,
            pace: generatePace(time, km),
            date: generateDate(),
        });
    }

    // Sort by time (fastest first)
    return entries.sort((a, b) => {
        const [aMin, aSec] = a.time.split(':').map(Number);
        const [bMin, bSec] = b.time.split(':').map(Number);
        return (aMin * 60 + aSec) - (bMin * 60 + bSec);
    }).map((entry, idx) => ({ ...entry, rank: idx + 1 }));
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
export const getStateRanking = (stateCode: string): StateRanking[] => {
    const seed = stateCode.charCodeAt(0) + stateCode.charCodeAt(1);
    const shuffledNames = [...RUNNER_NAMES, ...RUNNER_NAMES, ...RUNNER_NAMES, ...RUNNER_NAMES, ...RUNNER_NAMES]
        .sort(() => (seed % 3) - 1);

    const cities = ['São Paulo', 'Rio de Janeiro', 'Curitiba', 'Porto Alegre', 'Florianópolis',
        'Belo Horizonte', 'Salvador', 'Fortaleza', 'Recife', 'Brasília'];

    const entries: StateRanking[] = [];
    for (let i = 0; i < 100; i++) {
        entries.push({
            rank: i + 1,
            username: shuffledNames[i % shuffledNames.length] + (i > 19 ? ` ${Math.floor(i / 20)}` : ''),
            avatar: generateAvatar(),
            firstPlaces: Math.max(1, 50 - i - Math.floor(Math.random() * 5)),
            city: cities[i % cities.length],
            totalRuns: 50 + Math.floor(Math.random() * 200),
        });
    }

    return entries.sort((a, b) => b.firstPlaces - a.firstPlaces)
        .map((entry, idx) => ({ ...entry, rank: idx + 1 }));
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
