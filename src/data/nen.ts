export type Principle = {
  id: string;
  name: string;
  jp: string;
  color: string;
  desc: string;
};

export type NenType = {
  id: string;
  name: string;
  color: string;
  x: number;
  y: number;
  water: string;
  personality: string;
  users: string;
  desc: string;
};

export type QuizAnswer = { t: string; text: string };
export type QuizQuestion = { q: string; a: QuizAnswer[] };

export type FaceLink = {
  id: string;
  name: string;
  color: string;
  portrait: string;
};

export const principles: Principle[] = [
  {
    id: 'ten',
    name: 'Ten',
    jp: '纏 · Envelop',
    color: '#4fbf67',
    desc: 'Keep the aura flowing around the body instead of leaking away. Ten is the foundation of everything: it protects you from emotional Nen attacks and slows aging. A calm shell of life energy.',
  },
  {
    id: 'zetsu',
    name: 'Zetsu',
    jp: '絶 · Suppress',
    color: '#9aa0ae',
    desc: 'Close all aura nodes and stop the flow entirely. Zetsu hides your presence completely — perfect for stealth and recovering from fatigue — but it leaves the body defenseless against Nen.',
  },
  {
    id: 'ren',
    name: 'Ren',
    jp: '練 · Refine',
    color: '#e63946',
    desc: 'Produce more aura than usual and hold it — a roaring outburst of life energy. Ren is raw output: it powers up strength and durability, and it is what a Hunter flares to intimidate an opponent.',
  },
  {
    id: 'hatsu',
    name: 'Hatsu',
    jp: '発 · Release',
    color: '#f4c95d',
    desc: "Release and shape your aura into a personal ability. Hatsu is your Nen made manifest — Gon's Jajanken, Kurapika's chains, Hisoka's Bungee Gum. It reflects who you truly are.",
  },
];

export const nenTypes: NenType[] = [
  {
    id: 'enhancement', name: 'Enhancement', color: '#ff5c4d', x: 200, y: 42,
    water: 'The volume of the water increases and overflows the glass.',
    personality: 'Simple and determined. They say what they mean and never back down.',
    users: 'Gon, Netero, Uvogin, Phinks',
    desc: 'Strengthen what already exists — the body, an object, a blow. Enhancers are the most balanced fighters, turning raw aura directly into overwhelming physical power.',
  },
  {
    id: 'transmutation', name: 'Transmutation', color: '#58c9e8', x: 62, y: 122,
    water: 'The taste of the water changes.',
    personality: 'Whimsical and prone to lying. Unique personalities no one can pin down.',
    users: 'Killua, Hisoka, Biscuit, Machi',
    desc: 'Change the properties of your aura — make it electricity, gum, sharpened wire. Transmuters mimic qualities of things, creating abilities that are famously hard to read.',
  },
  {
    id: 'conjuration', name: 'Conjuration', color: '#b48ef2', x: 62, y: 278,
    water: 'Impurities appear in the water.',
    personality: 'High-strung and observant. Careful people who thrive on rules and conditions.',
    users: 'Kurapika, Kite, Kortopi, Shizuku',
    desc: 'Materialize real, physical objects out of aura — chains, weapons, even a vacuum cleaner. Conjured items can carry powerful conditions that push them beyond physics.',
  },
  {
    id: 'specialization', name: 'Specialization', color: '#f45fc0', x: 200, y: 358,
    water: 'Something else entirely happens.',
    personality: 'Independent and charismatic. Individualists who follow no template.',
    users: 'Chrollo, Kurapika (Emperor Time), Neferpitou, Meruem',
    desc: 'Anything that fits no other category: stealing abilities, manipulating fate, perfect prophecy. You cannot train your way here — Specialization chooses you.',
  },
  {
    id: 'manipulation', name: 'Manipulation', color: '#ffcd4d', x: 338, y: 278,
    water: 'The leaf moves across the surface of the water.',
    personality: 'Logical debaters who like to control the pace — and sometimes people.',
    users: 'Illumi, Shalnark, Morel, Squala',
    desc: 'Control things — objects, animals, people — by attaching your aura to them. Manipulators win from a distance; one touch of their condition can decide the entire fight.',
  },
  {
    id: 'emission', name: 'Emission', color: '#6fe08a', x: 338, y: 122,
    water: 'The color of the water changes.',
    personality: 'Impatient, hot-blooded and quick to act — and quick to cool down.',
    users: 'Leorio, Razor, Franklin, Knuckle',
    desc: 'Detach aura from the body and keep it dense at range — energy blasts, warp gates, remote beasts. Emitters turn distance from a weakness into a weapon.',
  },
];

export const quiz: QuizQuestion[] = [
  {
    q: 'Your friend is in danger behind a locked steel door. You…',
    a: [
      { t: 'enhancement', text: 'Punch it down. Repeatedly. It WILL open.' },
      { t: 'transmutation', text: 'Slip something slippery/sharp/weird through the hinges.' },
      { t: 'manipulation', text: 'Find whoever has the key and make them open it.' },
      { t: 'conjuration', text: 'You already carry exactly the right tool for this.' },
    ],
  },
  {
    q: 'How do people usually describe you?',
    a: [
      { t: 'enhancement', text: 'Straightforward — maybe a little too honest.' },
      { t: 'transmutation', text: 'Unpredictable. Half of what I say is a joke. Which half? Hmm.' },
      { t: 'emission', text: 'Impatient and loud, but my heart is in the right place.' },
      { t: 'specialization', text: "They don't. Nobody really knows me." },
    ],
  },
  {
    q: 'Pick a training montage:',
    a: [
      { t: 'enhancement', text: '10,000 punches a day. Gratitude included.' },
      { t: 'conjuration', text: 'Study one object for weeks until I can draw it from memory.' },
      { t: 'manipulation', text: 'Chess, arguments, and puppets.' },
      { t: 'emission', text: 'Throwing my aura as far and hard as it can go.' },
    ],
  },
  {
    q: 'Your ideal Nen ability sounds like…',
    a: [
      { t: 'transmutation', text: 'My aura becomes something with strange, gross, wonderful properties.' },
      { t: 'conjuration', text: 'A weapon with strict rules that make it absurdly strong.' },
      { t: 'specialization', text: 'Something nobody else in the world could ever copy.' },
      { t: 'emission', text: 'A remote strike I can deliver from another city.' },
    ],
  },
  {
    q: 'In a team, you are the one who…',
    a: [
      { t: 'enhancement', text: 'Stands at the front and takes the hit.' },
      { t: 'manipulation', text: 'Makes the plan — and quietly makes everyone follow it.' },
      { t: 'transmutation', text: 'Does the thing no one predicted, including me.' },
      { t: 'specialization', text: 'Works alone. The team finds out later.' },
    ],
  },
  {
    q: 'What would you hunt?',
    a: [
      { t: 'enhancement', text: 'The strongest opponent alive.' },
      { t: 'conjuration', text: 'A lost relic everyone says is just a legend.' },
      { t: 'emission', text: 'Anything — as long as we leave RIGHT NOW.' },
      { t: 'manipulation', text: 'The truth behind a conspiracy.' },
    ],
  },
];

export const facesByType: Record<string, string[]> = {
  enhancement: ['gon', 'netero'],
  transmutation: ['killua', 'hisoka'],
  conjuration: ['kurapika', 'kite'],
  specialization: ['chrollo'],
  manipulation: [],
  emission: ['leorio'],
};

export const HEX_ORDER = [
  'enhancement',
  'transmutation',
  'conjuration',
  'specialization',
  'manipulation',
  'emission',
] as const;

export const HEX_PCT_BY_DISTANCE = [100, 80, 60, 40] as const;
