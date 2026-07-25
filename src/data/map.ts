// Map locations for the interactive World Map page.

export type PlaceType = 'city' | 'island' | 'landmark' | 'conflict' | 'calamity';

export type MapPlace = {
  id: string;
  name: string;
  x: number;
  y: number;
  color: string;
  type: PlaceType;
  labelY?: number;
  text: string;
  image: string | null;
  rank?: string | null;
};

export type LegendItem = {
  id: PlaceType;
  label: string;
  color: string;
};

export const legend: LegendItem[] = [
  { id: 'city', label: 'City', color: '#e63946' },
  { id: 'island', label: 'Island', color: '#4fbf67' },
  { id: 'landmark', label: 'Landmark', color: '#58b3e0' },
  { id: 'conflict', label: 'Conflict zone', color: '#ff5c4d' },
  { id: 'calamity', label: 'Calamity', color: '#f45fc0' },
];

export const knownPlaces: MapPlace[] = [
  {
    id: 'whale', name: 'Whale Island', x: 618, y: 470, color: '#4fbf67', type: 'island',
    labelY: -42,
    text: 'A sleepy fishing island shaped like a breaching whale. Gon grew up here with his aunt Mito — and caught the Lord of the Lake to earn his ticket to the Hunter Exam.',
    image: '/images/locations/whale.webp',
  },
  {
    id: 'zaban', name: 'Zaban City', x: 300, y: 318, color: '#f4c95d', type: 'city',
    labelY: -42,
    text: 'Host of the 287th Hunter Exam. Its entrance hid under a modest noodle shop — the first of many tricks played on 404 hopeful applicants.',
    image: '/images/locations/zaban.webp',
  },
  {
    id: 'heavens', name: 'Heavens Arena', x: 385, y: 242, color: '#58b3e0', type: 'landmark',
    labelY: -44,
    text: 'A 991-meter tower where 4,000 fighters battle daily. Above floor 200, prize money disappears — and Nen becomes the entry fee.',
    image: '/images/locations/heavens.webp',
  },
  {
    id: 'kukuroo', name: 'Kukuroo Mountain', x: 455, y: 355, color: '#9b6fd4', type: 'landmark',
    labelY: -42,
    text: 'A dormant 3,722 m volcano in the Republic of Padokea. The entire mountain is the Zoldyck family estate — the front gate alone weighs over 200 tonnes.',
    image: '/images/locations/kukuroo.webp',
  },
  {
    id: 'padokea', name: 'Padokea', x: 420, y: 300, color: '#b48ef2', type: 'city',
    labelY: -42,
    text: 'Republic of Padokea — home to Kukuroo Mountain and the Zoldyck estate. Quiet on the map. Very loud behind the Testing Gate.',
    image: null,
  },
  {
    id: 'yorknew', name: 'Yorknew City', x: 700, y: 255, color: '#e63946', type: 'city',
    labelY: -42,
    text: 'The world\'s commercial capital. Every September its Underground Auction draws the mafia, the Phantom Troupe, and one Kurta with chains.',
    image: '/images/locations/yorknew.webp',
  },
  {
    id: 'meteor', name: 'Meteor City', x: 800, y: 365, color: '#9aa0ae', type: 'city',
    labelY: -42,
    text: 'A junkyard city of ten million people who officially do not exist. Reject everything, accept everyone. The Phantom Troupe was born here.',
    image: '/images/locations/meteor.webp',
  },
  {
    id: 'southernpiece', name: 'Southernpiece', x: 740, y: 310, color: '#f08c3a', type: 'city',
    labelY: 28,
    text: 'Southernpiece Auction Company — the polite face of the Underground. If it can be stolen, it can be sold here.',
    image: null,
  },
  {
    id: 'greed', name: 'Greed Island', x: 540, y: 555, color: '#f08c3a', type: 'island',
    labelY: 28,
    text: 'A Nen-made island disguised as a video game cartridge. Buy-in: 8.9 billion jenny. Ging Freecss and friends built it — and hid a message for his son inside.',
    image: '/images/locations/greed.webp',
  },
  {
    id: 'ngl', name: 'NGL', x: 195, y: 455, color: '#ff5c4d', type: 'conflict',
    labelY: -42,
    text: 'The Neo-Green Life kingdom banned all technology — which made it the perfect nest for the Chimera Ant Queen and her growing colony.',
    image: '/images/locations/ngl.webp',
  },
  {
    id: 'gorteau', name: 'East Gorteau', x: 268, y: 555, color: '#f45fc0', type: 'conflict',
    labelY: 28,
    text: 'A dictatorship of 26 million that Meruem\'s royal guard turned into a selection ground. The palace of Peijin hosted the story\'s most devastating night.',
    image: '/images/locations/gorteau.webp',
  },
  {
    id: 'kakin', name: 'Kakin Empire', x: 860, y: 480, color: '#f4c95d', type: 'city',
    labelY: -42,
    text: 'An expansionist empire that launched the Black Whale toward the New Continent — with princes, Hunters, and a succession war aboard.',
    image: '/images/locations/kakin.webp',
  },
  {
    id: 'blackwhale', name: 'Black Whale Port', x: 830, y: 530, color: '#58c9e8', type: 'landmark',
    labelY: 28,
    text: 'Departure point of the Black Whale — a city-sized ship bound for the Dark Continent under Kakin\'s flag and the Association\'s uneasy escort.',
    image: '/images/locations/blackwhale.webp',
  },
];

export const darkPlaces: MapPlace[] = [
  {
    id: 'gate', name: 'Gateway to the New World', x: 500, y: 208, color: '#f4c95d', type: 'landmark', rank: null,
    text: 'The colossal door in the Mobius wall through which V5 expeditions depart. Beyond it: a land that has erased 149 expeditions... out of 149.',
    image: '/images/locations/gate.webp',
  },
  {
    id: 'brion', name: 'Brion', x: 240, y: 120, color: '#ff5c4d', type: 'calamity', rank: 'B',
    text: 'A botanical weapon guarding ancient ruins — a sphere-headed colossus that hunts anything that moves.',
    image: null,
  },
  {
    id: 'hellbell', name: 'Hellbell', x: 762, y: 118, color: '#9b6fd4', type: 'calamity', rank: 'A',
    text: 'The twin snake of mutual destruction. It kills through the human desire for revenge.',
    image: null,
  },
  {
    id: 'ai', name: 'Ai', x: 872, y: 400, color: '#f45fc0', type: 'calamity', rank: 'A+',
    text: 'A gaseous life form — "the codependence of desire." It whispers, and people walk into it smiling. Nanika came from here.',
    image: null,
  },
  {
    id: 'zobae', name: 'Zobae Disease', x: 126, y: 420, color: '#6fe08a', type: 'calamity', rank: 'B+',
    text: 'An immortality sickness. Its sole survivor came back undying — and permanently hungry.',
    image: null,
  },
  {
    id: 'pap', name: 'Pap', x: 500, y: 628, color: '#58c9e8', type: 'calamity', rank: 'B',
    text: 'A two-tailed beast of unconditional love. Its victims return as empty, blissful husks.',
    image: '/images/locations/pap.webp',
  },
];

export const calamities = darkPlaces.filter((p) => p.type === 'calamity');
