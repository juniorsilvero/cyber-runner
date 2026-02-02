// TERRITORIES - Polygon areas covering city neighborhoods
// Each territory has: polygon coordinates, start point, accurate distance

export const routeColors = [
    '#E6FF2B', '#00FFFF', '#FF1493', '#39FF14', '#FF6600',
    '#BF00FF', '#00BFFF', '#FF3131', '#CCFF00', '#FF00FF',
];

// Semi-transparent versions for polygon fill
export const routeColorsFill = [
    'rgba(230, 255, 43, 0.3)',
    'rgba(0, 255, 255, 0.3)',
    'rgba(255, 20, 147, 0.3)',
    'rgba(57, 255, 20, 0.3)',
    'rgba(255, 102, 0, 0.3)',
    'rgba(191, 0, 255, 0.3)',
    'rgba(0, 191, 255, 0.3)',
    'rgba(255, 49, 49, 0.3)',
    'rgba(204, 255, 0, 0.3)',
    'rgba(255, 0, 255, 0.3)',
];

export interface RouteData {
    id: number;
    name: string;
    city: string;
    state: string;
    neighbourhood: string;
    distance: string;
    distanceKm: number;
    difficulty: 'medium' | 'hard';
    type: string;
    dominator: null;
    avatar: string;
    routeColor: string;
    fillColor: string;
    time: string;
    center: [number, number]; // Card position
    startPoint: [number, number]; // Starting point marker
    path: [number, number][]; // Polygon vertices
}

// Calculate polygon perimeter in km
const calculatePerimeter = (points: [number, number][]): number => {
    let total = 0;
    for (let i = 0; i < points.length - 1; i++) {
        const [lat1, lon1] = points[i];
        const [lat2, lon2] = points[i + 1];
        // Haversine formula
        const R = 6371; // km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        total += R * c;
    }
    return Math.round(total * 10) / 10;
};

// FLORIANÓPOLIS - Real neighborhood territories (on land, not in water)
const florianopolisData: Array<{ name: string, neighbourhood: string, polygon: [number, number][] }> = [
    {
        name: 'CENTRO',
        neighbourhood: 'Centro',
        polygon: [
            [-27.5916, -48.5533], [-27.5905, -48.5478], [-27.5938, -48.5445],
            [-27.5968, -48.5467], [-27.5962, -48.5520], [-27.5916, -48.5533]
        ]
    },
    {
        name: 'TRINDADE',
        neighbourhood: 'Trindade',
        polygon: [
            [-27.5975, -48.5190], [-27.5940, -48.5145], [-27.5985, -48.5098],
            [-27.6025, -48.5130], [-27.6010, -48.5185], [-27.5975, -48.5190]
        ]
    },
    {
        name: 'ITACORUBI',
        neighbourhood: 'Itacorubi',
        polygon: [
            [-27.5810, -48.5055], [-27.5775, -48.5010], [-27.5815, -48.4965],
            [-27.5855, -48.4998], [-27.5845, -48.5050], [-27.5810, -48.5055]
        ]
    },
    {
        name: 'SANTA MÔNICA',
        neighbourhood: 'Santa Mônica',
        polygon: [
            [-27.5985, -48.5060], [-27.5955, -48.5020], [-27.5990, -48.4980],
            [-27.6025, -48.5010], [-27.6015, -48.5055], [-27.5985, -48.5060]
        ]
    },
    {
        name: 'CÓRREGO GRANDE',
        neighbourhood: 'Córrego Grande',
        polygon: [
            [-27.5915, -48.5115], [-27.5885, -48.5075], [-27.5920, -48.5035],
            [-27.5955, -48.5065], [-27.5945, -48.5110], [-27.5915, -48.5115]
        ]
    },
    {
        name: 'COQUEIROS',
        neighbourhood: 'Coqueiros',
        polygon: [
            [-27.5975, -48.5698], [-27.5945, -48.5658], [-27.5980, -48.5618],
            [-27.6015, -48.5648], [-27.6005, -48.5693], [-27.5975, -48.5698]
        ]
    },
    {
        name: 'ESTREITO',
        neighbourhood: 'Estreito',
        polygon: [
            [-27.5875, -48.5725], [-27.5845, -48.5685], [-27.5880, -48.5645],
            [-27.5915, -48.5675], [-27.5905, -48.5720], [-27.5875, -48.5725]
        ]
    },
    {
        name: 'CAPOEIRAS',
        neighbourhood: 'Capoeiras',
        polygon: [
            [-27.5828, -48.5815], [-27.5798, -48.5775], [-27.5833, -48.5735],
            [-27.5868, -48.5765], [-27.5858, -48.5810], [-27.5828, -48.5815]
        ]
    },
    {
        name: 'AGRONÔMICA',
        neighbourhood: 'Agronômica',
        polygon: [
            [-27.5845, -48.5405], [-27.5815, -48.5365], [-27.5850, -48.5325],
            [-27.5885, -48.5355], [-27.5875, -48.5400], [-27.5845, -48.5405]
        ]
    },
    {
        name: 'SACO GRANDE',
        neighbourhood: 'Saco Grande',
        polygon: [
            [-27.5605, -48.5015], [-27.5575, -48.4975], [-27.5610, -48.4935],
            [-27.5645, -48.4965], [-27.5635, -48.5010], [-27.5605, -48.5015]
        ]
    }
];

// JOINVILLE territories
const joinvilleData: Array<{ name: string, neighbourhood: string, polygon: [number, number][] }> = [
    { name: 'CENTRO', neighbourhood: 'Centro', polygon: [[-26.3030, -48.8505], [-26.3000, -48.8455], [-26.3045, -48.8410], [-26.3085, -48.8450], [-26.3070, -48.8500], [-26.3030, -48.8505]] },
    { name: 'BOA VISTA', neighbourhood: 'Boa Vista', polygon: [[-26.2830, -48.8405], [-26.2800, -48.8355], [-26.2845, -48.8310], [-26.2885, -48.8350], [-26.2870, -48.8400], [-26.2830, -48.8405]] },
    { name: 'AMÉRICA', neighbourhood: 'América', polygon: [[-26.2930, -48.8605], [-26.2900, -48.8555], [-26.2945, -48.8510], [-26.2985, -48.8550], [-26.2970, -48.8600], [-26.2930, -48.8605]] },
    { name: 'GLÓRIA', neighbourhood: 'Glória', polygon: [[-26.3130, -48.8605], [-26.3100, -48.8555], [-26.3145, -48.8510], [-26.3185, -48.8550], [-26.3170, -48.8600], [-26.3130, -48.8605]] },
    { name: 'BUCAREIN', neighbourhood: 'Bucarein', polygon: [[-26.3030, -48.8355], [-26.3000, -48.8305], [-26.3045, -48.8260], [-26.3085, -48.8300], [-26.3070, -48.8350], [-26.3030, -48.8355]] },
    { name: 'ANITA GARIBALDI', neighbourhood: 'Anita Garibaldi', polygon: [[-26.2730, -48.8555], [-26.2700, -48.8505], [-26.2745, -48.8460], [-26.2785, -48.8500], [-26.2770, -48.8550], [-26.2730, -48.8555]] },
    { name: 'COSTA E SILVA', neighbourhood: 'Costa e Silva', polygon: [[-26.2630, -48.8455], [-26.2600, -48.8405], [-26.2645, -48.8360], [-26.2685, -48.8400], [-26.2670, -48.8450], [-26.2630, -48.8455]] },
    { name: 'SAGUAÇU', neighbourhood: 'Saguaçu', polygon: [[-26.2830, -48.8705], [-26.2800, -48.8655], [-26.2845, -48.8610], [-26.2885, -48.8650], [-26.2870, -48.8700], [-26.2830, -48.8705]] },
    { name: 'IRIRIÚ', neighbourhood: 'Iririú', polygon: [[-26.2930, -48.8255], [-26.2900, -48.8205], [-26.2945, -48.8160], [-26.2985, -48.8200], [-26.2970, -48.8250], [-26.2930, -48.8255]] },
    { name: 'FLORESTA', neighbourhood: 'Floresta', polygon: [[-26.3230, -48.8455], [-26.3200, -48.8405], [-26.3245, -48.8360], [-26.3285, -48.8400], [-26.3270, -48.8450], [-26.3230, -48.8455]] }
];

// BLUMENAU territories
const blumenauData: Array<{ name: string, neighbourhood: string, polygon: [number, number][] }> = [
    { name: 'CENTRO', neighbourhood: 'Centro', polygon: [[-26.9180, -49.0680], [-26.9150, -49.0630], [-26.9195, -49.0585], [-26.9235, -49.0625], [-26.9220, -49.0675], [-26.9180, -49.0680]] },
    { name: 'VILA GERMÂNICA', neighbourhood: 'Vila Germânica', polygon: [[-26.9080, -49.0580], [-26.9050, -49.0530], [-26.9095, -49.0485], [-26.9135, -49.0525], [-26.9120, -49.0575], [-26.9080, -49.0580]] },
    { name: 'PONTA AGUDA', neighbourhood: 'Ponta Aguda', polygon: [[-26.9280, -49.0780], [-26.9250, -49.0730], [-26.9295, -49.0685], [-26.9335, -49.0725], [-26.9320, -49.0775], [-26.9280, -49.0780]] },
    { name: 'VELHA', neighbourhood: 'Velha', polygon: [[-26.9380, -49.0680], [-26.9350, -49.0630], [-26.9395, -49.0585], [-26.9435, -49.0625], [-26.9420, -49.0675], [-26.9380, -49.0680]] },
    { name: 'GARCIA', neighbourhood: 'Garcia', polygon: [[-26.9180, -49.0480], [-26.9150, -49.0430], [-26.9195, -49.0385], [-26.9235, -49.0425], [-26.9220, -49.0475], [-26.9180, -49.0480]] },
    { name: 'ITOUPAVA', neighbourhood: 'Itoupava', polygon: [[-26.8980, -49.0580], [-26.8950, -49.0530], [-26.8995, -49.0485], [-26.9035, -49.0525], [-26.9020, -49.0575], [-26.8980, -49.0580]] },
    { name: 'SALTO', neighbourhood: 'Salto', polygon: [[-26.8880, -49.0480], [-26.8850, -49.0430], [-26.8895, -49.0385], [-26.8935, -49.0425], [-26.8920, -49.0475], [-26.8880, -49.0480]] },
    { name: 'FORTALEZA', neighbourhood: 'Fortaleza', polygon: [[-26.9280, -49.0580], [-26.9250, -49.0530], [-26.9295, -49.0485], [-26.9335, -49.0525], [-26.9320, -49.0575], [-26.9280, -49.0580]] },
    { name: 'BADENFURT', neighbourhood: 'Badenfurt', polygon: [[-26.8780, -49.0680], [-26.8750, -49.0630], [-26.8795, -49.0585], [-26.8835, -49.0625], [-26.8820, -49.0675], [-26.8780, -49.0680]] },
    { name: 'ESCOLA AGRÍCOLA', neighbourhood: 'Escola Agrícola', polygon: [[-26.8680, -49.0780], [-26.8650, -49.0730], [-26.8695, -49.0685], [-26.8735, -49.0725], [-26.8720, -49.0775], [-26.8680, -49.0780]] }
];

// BC territories
const bcData: Array<{ name: string, neighbourhood: string, polygon: [number, number][] }> = [
    { name: 'CENTRO', neighbourhood: 'Centro', polygon: [[-26.9890, -48.6380], [-26.9860, -48.6330], [-26.9905, -48.6285], [-26.9945, -48.6325], [-26.9930, -48.6375], [-26.9890, -48.6380]] },
    { name: 'BARRA SUL', neighbourhood: 'Barra Sul', polygon: [[-27.0090, -48.6280], [-27.0060, -48.6230], [-27.0105, -48.6185], [-27.0145, -48.6225], [-27.0130, -48.6275], [-27.0090, -48.6280]] },
    { name: 'ATLÂNTICA', neighbourhood: 'Atlântica', polygon: [[-26.9790, -48.6280], [-26.9760, -48.6230], [-26.9805, -48.6185], [-26.9845, -48.6225], [-26.9830, -48.6275], [-26.9790, -48.6280]] },
    { name: 'PIONEIROS', neighbourhood: 'Pioneiros', polygon: [[-26.9990, -48.6480], [-26.9960, -48.6430], [-27.0005, -48.6385], [-27.0045, -48.6425], [-27.0030, -48.6475], [-26.9990, -48.6480]] },
    { name: 'NAÇÕES', neighbourhood: 'Nações', polygon: [[-26.9690, -48.6380], [-26.9660, -48.6330], [-26.9705, -48.6285], [-26.9745, -48.6325], [-26.9730, -48.6375], [-26.9690, -48.6380]] },
    { name: 'MUNICÍPIOS', neighbourhood: 'Municípios', polygon: [[-26.9590, -48.6480], [-26.9560, -48.6430], [-26.9605, -48.6385], [-26.9645, -48.6425], [-26.9630, -48.6475], [-26.9590, -48.6480]] },
    { name: 'VILA REAL', neighbourhood: 'Vila Real', polygon: [[-26.9490, -48.6380], [-26.9460, -48.6330], [-26.9505, -48.6285], [-26.9545, -48.6325], [-26.9530, -48.6375], [-26.9490, -48.6380]] },
    { name: 'ESTADOS', neighbourhood: 'Estados', polygon: [[-26.9890, -48.6580], [-26.9860, -48.6530], [-26.9905, -48.6485], [-26.9945, -48.6525], [-26.9930, -48.6575], [-26.9890, -48.6580]] },
    { name: 'PONTAL NORTE', neighbourhood: 'Pontal Norte', polygon: [[-26.9390, -48.6280], [-26.9360, -48.6230], [-26.9405, -48.6185], [-26.9445, -48.6225], [-26.9430, -48.6275], [-26.9390, -48.6280]] },
    { name: 'PRAIA BRAVA', neighbourhood: 'Praia Brava', polygon: [[-26.9290, -48.6180], [-26.9260, -48.6130], [-26.9305, -48.6085], [-26.9345, -48.6125], [-26.9330, -48.6175], [-26.9290, -48.6180]] }
];

// ITAJAÍ territories
const itajaiData: Array<{ name: string, neighbourhood: string, polygon: [number, number][] }> = [
    { name: 'CENTRO', neighbourhood: 'Centro', polygon: [[-26.9060, -48.6640], [-26.9030, -48.6590], [-26.9075, -48.6545], [-26.9115, -48.6585], [-26.9100, -48.6635], [-26.9060, -48.6640]] },
    { name: 'FAZENDA', neighbourhood: 'Fazenda', polygon: [[-26.8960, -48.6740], [-26.8930, -48.6690], [-26.8975, -48.6645], [-26.9015, -48.6685], [-26.9000, -48.6735], [-26.8960, -48.6740]] },
    { name: 'SÃO JOÃO', neighbourhood: 'São João', polygon: [[-26.9160, -48.6540], [-26.9130, -48.6490], [-26.9175, -48.6445], [-26.9215, -48.6485], [-26.9200, -48.6535], [-26.9160, -48.6540]] },
    { name: 'CORDEIROS', neighbourhood: 'Cordeiros', polygon: [[-26.9260, -48.6640], [-26.9230, -48.6590], [-26.9275, -48.6545], [-26.9315, -48.6585], [-26.9300, -48.6635], [-26.9260, -48.6640]] },
    { name: 'RESSACADA', neighbourhood: 'Ressacada', polygon: [[-26.9360, -48.6740], [-26.9330, -48.6690], [-26.9375, -48.6645], [-26.9415, -48.6685], [-26.9400, -48.6735], [-26.9360, -48.6740]] },
    { name: 'CABEÇUDAS', neighbourhood: 'Cabeçudas', polygon: [[-26.8860, -48.6440], [-26.8830, -48.6390], [-26.8875, -48.6345], [-26.8915, -48.6385], [-26.8900, -48.6435], [-26.8860, -48.6440]] },
    { name: 'PRAIA BRAVA', neighbourhood: 'Praia Brava', polygon: [[-26.8760, -48.6340], [-26.8730, -48.6290], [-26.8775, -48.6245], [-26.8815, -48.6285], [-26.8800, -48.6335], [-26.8760, -48.6340]] },
    { name: 'VILA OPERÁRIA', neighbourhood: 'Vila Operária', polygon: [[-26.9060, -48.6840], [-26.9030, -48.6790], [-26.9075, -48.6745], [-26.9115, -48.6785], [-26.9100, -48.6835], [-26.9060, -48.6840]] },
    { name: 'DOM BOSCO', neighbourhood: 'Dom Bosco', polygon: [[-26.9160, -48.6940], [-26.9130, -48.6890], [-26.9175, -48.6845], [-26.9215, -48.6885], [-26.9200, -48.6935], [-26.9160, -48.6940]] },
    { name: 'ESPINHEIROS', neighbourhood: 'Espinheiros', polygon: [[-26.8960, -48.6540], [-26.8930, -48.6490], [-26.8975, -48.6445], [-26.9015, -48.6485], [-26.9000, -48.6535], [-26.8960, -48.6540]] }
];

// SÃO PAULO territories
const spData: Array<{ name: string, neighbourhood: string, polygon: [number, number][] }> = [
    { name: 'IBIRAPUERA', neighbourhood: 'Ibirapuera', polygon: [[-23.5870, -46.6550], [-23.5840, -46.6500], [-23.5885, -46.6455], [-23.5925, -46.6495], [-23.5910, -46.6545], [-23.5870, -46.6550]] },
    { name: 'PAULISTA', neighbourhood: 'Paulista', polygon: [[-23.5610, -46.6550], [-23.5580, -46.6500], [-23.5625, -46.6455], [-23.5665, -46.6495], [-23.5650, -46.6545], [-23.5610, -46.6550]] },
    { name: 'PINHEIROS', neighbourhood: 'Pinheiros', polygon: [[-23.5670, -46.6850], [-23.5640, -46.6800], [-23.5685, -46.6755], [-23.5725, -46.6795], [-23.5710, -46.6845], [-23.5670, -46.6850]] },
    { name: 'VILA MADALENA', neighbourhood: 'Vila Madalena', polygon: [[-23.5470, -46.6950], [-23.5440, -46.6900], [-23.5485, -46.6855], [-23.5525, -46.6895], [-23.5510, -46.6945], [-23.5470, -46.6950]] },
    { name: 'LIBERDADE', neighbourhood: 'Liberdade', polygon: [[-23.5570, -46.6350], [-23.5540, -46.6300], [-23.5585, -46.6255], [-23.5625, -46.6295], [-23.5610, -46.6345], [-23.5570, -46.6350]] },
    { name: 'VILA OLÍMPIA', neighbourhood: 'Vila Olímpia', polygon: [[-23.5970, -46.6750], [-23.5940, -46.6700], [-23.5985, -46.6655], [-23.6025, -46.6695], [-23.6010, -46.6745], [-23.5970, -46.6750]] },
    { name: 'MOEMA', neighbourhood: 'Moema', polygon: [[-23.6070, -46.6650], [-23.6040, -46.6600], [-23.6085, -46.6555], [-23.6125, -46.6595], [-23.6110, -46.6645], [-23.6070, -46.6650]] },
    { name: 'ITAIM BIBI', neighbourhood: 'Itaim Bibi', polygon: [[-23.5870, -46.6750], [-23.5840, -46.6700], [-23.5885, -46.6655], [-23.5925, -46.6695], [-23.5910, -46.6745], [-23.5870, -46.6750]] },
    { name: 'CONSOLAÇÃO', neighbourhood: 'Consolação', polygon: [[-23.5510, -46.6550], [-23.5480, -46.6500], [-23.5525, -46.6455], [-23.5565, -46.6495], [-23.5550, -46.6545], [-23.5510, -46.6550]] },
    { name: 'JARDINS', neighbourhood: 'Jardins', polygon: [[-23.5670, -46.6650], [-23.5640, -46.6600], [-23.5685, -46.6555], [-23.5725, -46.6595], [-23.5710, -46.6645], [-23.5670, -46.6650]] }
];

// Generate remaining cities with similar structure
const generateCityTerritories = (
    startId: number,
    city: string,
    state: string,
    data: Array<{ name: string, neighbourhood: string, polygon: [number, number][] }>
): RouteData[] => {
    return data.map((t, i) => {
        const distanceKm = calculatePerimeter(t.polygon);
        const center: [number, number] = [
            t.polygon.reduce((sum, p) => sum + p[0], 0) / t.polygon.length,
            t.polygon.reduce((sum, p) => sum + p[1], 0) / t.polygon.length
        ];

        return {
            id: startId + i,
            name: t.name,
            city,
            state,
            neighbourhood: t.neighbourhood,
            distance: `${distanceKm} KM`,
            distanceKm,
            difficulty: distanceKm > 3 ? 'hard' as const : 'medium' as const,
            type: i % 3 === 0 ? 'Sprint' : i % 2 === 0 ? 'Trilha' : 'Corrida',
            dominator: null,
            avatar: 'bg-white/20',
            routeColor: routeColors[i],
            fillColor: routeColorsFill[i],
            time: '--:--',
            center,
            startPoint: t.polygon[0], // First vertex is start point
            path: t.polygon
        };
    });
};

// Generate all cities
const florianopolisRoutes = generateCityTerritories(1, 'Florianópolis', 'SC', florianopolisData);
const joinvilleRoutes = generateCityTerritories(11, 'Joinville', 'SC', joinvilleData);
const blumenauRoutes = generateCityTerritories(21, 'Blumenau', 'SC', blumenauData);
const bcRoutes = generateCityTerritories(31, 'Balneário Camboriú', 'SC', bcData);
const itajaiRoutes = generateCityTerritories(41, 'Itajaí', 'SC', itajaiData);
const spRoutes = generateCityTerritories(51, 'São Paulo', 'SP', spData);

// Remaining cities with generated data
const generateSimpleTerritories = (
    startId: number,
    city: string,
    state: string,
    cityCenter: [number, number],
    neighbourhoods: string[]
): RouteData[] => {
    return neighbourhoods.map((neighbourhood, i) => {
        const row = Math.floor(i / 5);
        const col = i % 5;
        const offsetLat = (row - 0.5) * 0.025;
        const offsetLon = (col - 2) * 0.035;
        const cLat = cityCenter[0] + offsetLat;
        const cLon = cityCenter[1] + offsetLon;
        const size = 0.008;

        const polygon: [number, number][] = [
            [cLat + size, cLon - size * 1.2],
            [cLat + size, cLon + size * 1.2],
            [cLat - size, cLon + size * 1.2],
            [cLat - size, cLon - size * 1.2],
            [cLat + size, cLon - size * 1.2]
        ];

        const distanceKm = calculatePerimeter(polygon);

        return {
            id: startId + i,
            name: neighbourhood.toUpperCase().substring(0, 15),
            city,
            state,
            neighbourhood,
            distance: `${distanceKm} KM`,
            distanceKm,
            difficulty: distanceKm > 3 ? 'hard' as const : 'medium' as const,
            type: i % 3 === 0 ? 'Sprint' : i % 2 === 0 ? 'Trilha' : 'Corrida',
            dominator: null,
            avatar: 'bg-white/20',
            routeColor: routeColors[i],
            fillColor: routeColorsFill[i],
            time: '--:--',
            center: [cLat, cLon] as [number, number],
            startPoint: polygon[0],
            path: polygon
        };
    });
};

// Other cities
const campinasRoutes = generateSimpleTerritories(61, 'Campinas', 'SP', [-22.9056, -47.0608], ['Centro', 'Cambuí', 'Barão Geraldo', 'Taquaral', 'Sousas', 'Nova Campinas', 'Chapadão', 'Guanabara', 'Ponte Preta', 'Bosque']);
const santosRoutes = generateSimpleTerritories(71, 'Santos', 'SP', [-23.9618, -46.3322], ['Gonzaga', 'Boqueirão', 'Embaré', 'Aparecida', 'Ponta da Praia', 'José Menino', 'Pompéia', 'Marapé', 'Macuco', 'Campo Grande']);
const rpRoutes = generateSimpleTerritories(81, 'Ribeirão Preto', 'SP', [-21.1767, -47.8208], ['Centro', 'Sumaré', 'Alto Boa Vista', 'Irajá', 'Vila Seixas', 'Campos Elíseos', 'Higienópolis', 'República', 'Ipiranga', 'Santa Cruz']);
const sjcRoutes = generateSimpleTerritories(91, 'São José dos Campos', 'SP', [-23.1791, -45.8872], ['Centro', 'Aquarius', 'Adyana', 'Satélite', 'Urbanova', 'Esplanada', 'Industrial', 'Santana', 'Bosque Cedros', 'América']);

const curitibaRoutes = generateSimpleTerritories(101, 'Curitiba', 'PR', [-25.4290, -49.2710], ['Centro', 'Batel', 'Água Verde', 'Jd Botânico', 'Alto da XV', 'Bigorrilho', 'Juvevê', 'Cabral', 'Santa Felicidade', 'Portão']);
const londrinaRoutes = generateSimpleTerritories(111, 'Londrina', 'PR', [-23.3045, -51.1696], ['Centro', 'Gleba Palhano', 'Shangri-lá', 'Ipiranga', 'Higienópolis', 'Zona Sul', 'Lago Igapó', 'Canadá', 'Vila Brasil', 'Petrópolis']);
const maringaRoutes = generateSimpleTerritories(121, 'Maringá', 'PR', [-23.4205, -51.9333], ['Centro', 'Zona 01', 'Zona 02', 'Zona 05', 'Zona 07', 'Parque Ingá', 'Alvorada', 'Esperança', 'Imperial', 'Zona 03']);
const fozRoutes = generateSimpleTerritories(131, 'Foz do Iguaçu', 'PR', [-25.5469, -54.5882], ['Centro', 'Vila Portes', 'Jd Central', 'Três Lagoas', 'Porto Meira', 'Vila Yolanda', 'Jd América', 'Cataratas', 'Morumbi', 'Jupira']);
const cascavelRoutes = generateSimpleTerritories(141, 'Cascavel', 'PR', [-24.9555, -53.4552], ['Centro', 'Lago', 'Pq Vitória', 'Coqueiral', 'Santa Cruz', 'Jd Itália', 'Neva', 'Brasília', 'Cancelli', 'Pacaembu']);

const poaRoutes = generateSimpleTerritories(151, 'Porto Alegre', 'RS', [-30.0346, -51.2177], ['Centro', 'Moinhos', 'Bom Fim', 'Cidade Baixa', 'Menino Deus', 'Petrópolis', 'Auxiliadora', 'Floresta', 'Rio Branco', 'Três Figueiras']);
const caxiasRoutes = generateSimpleTerritories(161, 'Caxias do Sul', 'RS', [-29.1634, -51.1797], ['Centro', 'São Pelegrino', 'Panazzolo', 'Exposição', 'Madureira', 'Cinquentenário', 'N.S. Fátima', 'Kayser', 'Charqueadas', 'Ana Rech']);
const pelotasRoutes = generateSimpleTerritories(171, 'Pelotas', 'RS', [-31.7654, -52.3376], ['Centro', 'Porto', 'Areal', 'Três Vendas', 'Fragata', 'Laranjal', 'Centro Hist', 'Cohab', 'Simões Lopes', 'Navegantes']);
const canoasRoutes = generateSimpleTerritories(181, 'Canoas', 'RS', [-29.9178, -51.1839], ['Centro', 'Mathias Velho', 'Niterói', 'Harmonia', 'N.S. Graças', 'Mal Rondon', 'Fátima', 'Igara', 'Rio Branco', 'São José']);
const nhRoutes = generateSimpleTerritories(191, 'Novo Hamburgo', 'RS', [-29.6878, -51.1311], ['Centro', 'HB Velho', 'Pátria Nova', 'Ideal', 'Canudos', 'Ouro Branco', 'Rondônia', 'Vila Rosa', 'Roselândia', 'Primavera']);

// Export all 200 territories
export const allRoutes: RouteData[] = [
    ...florianopolisRoutes, ...joinvilleRoutes, ...blumenauRoutes, ...bcRoutes, ...itajaiRoutes,
    ...spRoutes, ...campinasRoutes, ...santosRoutes, ...rpRoutes, ...sjcRoutes,
    ...curitibaRoutes, ...londrinaRoutes, ...maringaRoutes, ...fozRoutes, ...cascavelRoutes,
    ...poaRoutes, ...caxiasRoutes, ...pelotasRoutes, ...canoasRoutes, ...nhRoutes,
];
