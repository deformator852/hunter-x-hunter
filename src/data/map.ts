/**
 * Interactive World Map — places + camera (Pixi vector chart).
 *
 * Land/water shapes: src/data/mapVectors.ts (traced from official-world-map.webp)
 * Coordinates: same pixel space as the chart (3840×2280), origin TOP-LEFT.
 *
 * knownPlaces → both views
 * darkPlaces  → True Map only (calamities / gate)
 */

export type PlaceType = 'city' | 'island' | 'landmark' | 'conflict' | 'calamity';

export type MapPlace = {
  id: string;
  name: string;
  /** Pixel X on the map image (0 = left edge). */
  x: number;
  /** Pixel Y on the map image (0 = top edge). */
  y: number;
  color: string;
  type: PlaceType;
  text: string;
  /** Side-panel still (optional). */
  image: string | null;
  /**
   * Large map glyph for calamities (chart sketch).
   * Shown on the True Map instead of a plain pin.
   */
  mapIcon?: string | null;
  rank?: string | null;
};

export type LegendItem = {
  id: PlaceType;
  label: string;
  color: string;
};

/** Same space as official-world-map.webp / mapVectors.ts */
export const MAP_WIDTH = 3840;
export const MAP_HEIGHT = 2280;

/**
 * Camera — knownFrame crops Known World + New Continent.
 * knownZoomIn / trueZoomIn — scale multiplier after fit (1 = exact).
 * minScale / maxScale — screen px per world unit (vector stays sharp).
 */
export const MAP_CAMERA = {
  knownFrame: { x: 1080, y: 620, w: 2100, h: 1200 },
  knownZoomIn: 1,
  trueZoomIn: 1,
  knownPadding: 8,
  truePadding: 4,
  knownBoundsPad: 0,
  trueBoundsPad: 0,
  minScale: 0.08,
  maxScale: 12,
} as const;

/** @deprecated use MAP_CAMERA.knownFrame */
export const KNOWN_WORLD_FRAME = MAP_CAMERA.knownFrame;

export const legend: LegendItem[] = [
  { id: 'city', label: 'City', color: '#e63946' },
  { id: 'island', label: 'Island', color: '#4fbf67' },
  { id: 'landmark', label: 'Landmark', color: '#58b3e0' },
  { id: 'conflict', label: 'Conflict zone', color: '#ff5c4d' },
  { id: 'calamity', label: 'Calamity', color: '#f45fc0' },
];

/** Pins aligned to Sharpsider labels on the 3840×2280 chart. */
export const knownPlaces: MapPlace[] = [
  {
    id: 'whale',
    name: 'Whale Island',
    x: 1895,
    y: 1515,
    color: '#4fbf67',
    type: 'island',
    text: 'A sleepy fishing island shaped like a breaching whale. Gon grew up here with his aunt Mito — and caught the Lord of the Lake to earn his ticket to the Hunter Exam.',
    image: '/images/locations/whale.webp',
  },
  {
    id: 'zaban',
    name: 'Zaban City',
    x: 1385,
    y: 1135,
    color: '#f4c95d',
    type: 'city',
    text: 'Host of the 287th Hunter Exam. Its entrance hid under a modest noodle shop — the first of many tricks played on 404 hopeful applicants.',
    image: '/images/locations/zaban.webp',
  },
  {
    id: 'heavens',
    name: 'Heavens Arena',
    x: 1655,
    y: 905,
    color: '#58b3e0',
    type: 'landmark',
    text: 'A 991-meter tower where 4,000 fighters battle daily. Above floor 200, prize money disappears — and Nen becomes the entry fee.',
    image: '/images/locations/heavens.webp',
  },
  {
    id: 'kukuroo',
    name: 'Kukuroo Mountain',
    x: 1465,
    y: 955,
    color: '#9b6fd4',
    type: 'landmark',
    text: 'A dormant 3,722 m volcano in the Republic of Padokea. The entire mountain is the Zoldyck family estate — the front gate alone weighs over 200 tonnes.',
    image: '/images/locations/kukuroo.webp',
  },
  {
    id: 'padokea',
    name: 'Padokea',
    x: 1435,
    y: 855,
    color: '#b48ef2',
    type: 'city',
    text: 'Republic of Padokea — home to Kukuroo Mountain and the Zoldyck estate. Quiet on the map. Very loud behind the Testing Gate.',
    image: null,
  },
  {
    id: 'yorknew',
    name: 'Yorknew City',
    x: 1235,
    y: 1325,
    color: '#e63946',
    type: 'city',
    text: "The world's commercial capital. Every September its Underground Auction draws the mafia, the Phantom Troupe, and one Kurta with chains.",
    image: '/images/locations/yorknew.webp',
  },
  {
    id: 'meteor',
    name: 'Meteor City',
    x: 1365,
    y: 1465,
    color: '#9aa0ae',
    type: 'city',
    text: 'A junkyard city of ten million people who officially do not exist. Reject everything, accept everyone. The Phantom Troupe was born here.',
    image: '/images/locations/meteor.webp',
  },
  {
    id: 'southernpiece',
    name: 'Southernpiece',
    x: 1305,
    y: 1395,
    color: '#f08c3a',
    type: 'city',
    text: 'Southernpiece Auction Company — the polite face of the Underground. If it can be stolen, it can be sold here.',
    image: null,
  },
  {
    id: 'greed',
    name: 'Greed Island',
    x: 1810,
    y: 1395,
    color: '#f08c3a',
    type: 'island',
    text: 'A Nen-made island disguised as a video game cartridge. Buy-in: 8.9 billion jenny. Ging Freecss and friends built it — and hid a message for his son inside.',
    image: '/images/locations/greed.webp',
  },
  {
    id: 'ngl',
    name: 'NGL',
    x: 1965,
    y: 1635,
    color: '#ff5c4d',
    type: 'conflict',
    text: 'The Neo-Green Life kingdom banned all technology — which made it the perfect nest for the Chimera Ant Queen and her growing colony.',
    image: '/images/locations/ngl.webp',
  },
  {
    id: 'gorteau',
    name: 'East Gorteau',
    x: 2055,
    y: 1665,
    color: '#f45fc0',
    type: 'conflict',
    text: "A dictatorship of 26 million that Meruem's royal guard turned into a selection ground. The palace of Peijin hosted the story's most devastating night.",
    image: '/images/locations/gorteau.webp',
  },
  {
    id: 'kakin',
    name: 'Kakin Empire',
    x: 2200,
    y: 1115,
    color: '#f4c95d',
    type: 'city',
    text: "An expansionist empire that launched the Black Whale toward the New Continent — with princes, Hunters, and a succession war aboard.",
    image: '/images/locations/kakin.webp',
  },
  {
    id: 'blackwhale',
    name: 'Black Whale Port',
    x: 2485,
    y: 1210,
    color: '#58c9e8',
    type: 'landmark',
    text: "Departure point of the Black Whale — a city-sized ship bound for the Dark Continent under Kakin's flag and the Association's uneasy escort.",
    image: '/images/locations/blackwhale.webp',
  },
];

export const darkPlaces: MapPlace[] = [
  {
    id: 'gate',
    name: 'Gateway to the New World',
    x: 2795,
    y: 1165,
    color: '#f4c95d',
    type: 'landmark',
    rank: null,
    text: 'The colossal door in the Mobius wall through which V5 expeditions depart. Beyond it: a land that has erased 149 expeditions... out of 149.',
    image: '/images/locations/gate.webp',
  },
  {
    id: 'brion',
    name: 'Brion',
    x: 1995,
    y: 355,
    color: '#ff5c4d',
    type: 'calamity',
    rank: 'B',
    text: 'A botanical weapon guarding ancient ruins — a sphere-headed colossus that hunts anything that moves.',
    image: '/images/calamities/brion.webp',
    mapIcon: '/images/calamities/brion.webp',
  },
  {
    id: 'hellbell',
    name: 'Hellbell',
    x: 3385,
    y: 2015,
    color: '#9b6fd4',
    type: 'calamity',
    rank: 'A',
    text: 'The twin snake of mutual destruction. It kills through the human desire for revenge.',
    image: '/images/calamities/hellbell.webp',
    mapIcon: '/images/calamities/hellbell.webp',
  },
  {
    id: 'ai',
    name: 'Ai',
    x: 3085,
    y: 2105,
    color: '#f45fc0',
    type: 'calamity',
    rank: 'A+',
    text: 'A gaseous life form — "the codependence of desire." It whispers, and people walk into it smiling. Nanika came from here.',
    image: '/images/calamities/ai.webp',
    mapIcon: '/images/calamities/ai.webp',
  },
  {
    id: 'zobae',
    name: 'Zobae Disease',
    x: 2335,
    y: 2045,
    color: '#6fe08a',
    type: 'calamity',
    rank: 'B+',
    text: 'An immortality sickness. Its sole survivor came back undying — and permanently hungry.',
    image: '/images/calamities/zobae.webp',
    mapIcon: '/images/calamities/zobae.webp',
  },
  {
    id: 'pap',
    name: 'Pap',
    x: 2710,
    y: 325,
    color: '#58c9e8',
    type: 'calamity',
    rank: 'B',
    text: 'A two-tailed beast of unconditional love. Its victims return as empty, blissful husks.',
    image: '/images/locations/pap.webp',
    mapIcon: '/images/calamities/pap.webp',
  },
];

export const calamities = darkPlaces.filter((p) => p.type === 'calamity');
