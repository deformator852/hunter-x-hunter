// Each emblem is original, hand-coded SVG inspired by the character's signature
// item or ability — no copyrighted artwork is used anywhere on the site.

export type NenTypeName =
  | 'Enhancement'
  | 'Transmutation'
  | 'Conjuration'
  | 'Specialization'
  | 'Manipulation'
  | 'Emission'
  | 'Unknown';

export type CharacterStats = {
  power: number;
  speed: number;
  tactics: number;
  nen: number;
};

export type Character = {
  id: string;
  name: string;
  epithet: string;
  nenType: NenTypeName;
  color: string;
  color2: string;
  quote: string;
  bio: string;
  abilities: string[];
  stats: CharacterStats;
  emblem: string;
};

export type CharacterWithPortrait = Character & { portrait: string };

export const characters: Character[] = [
  {
    id: 'gon',
    name: 'Gon Freecss',
    epithet: 'The Boy from Whale Island',
    nenType: 'Enhancement',
    color: '#4fbf67',
    color2: '#2e7d43',
    quote: 'I can\'t stand being on the sidelines while someone else risks everything!',
    bio: 'A cheerful, stubborn boy who left Whale Island to find his father, Ging. Gon\'s raw talent, monstrous focus and simple honesty win over friends and enemies alike — but the same single-mindedness can carry him to terrifying places.',
    abilities: ['Jajanken: Rock (mega-charged punch)', 'Jajanken: Scissors (aura blade)', 'Jajanken: Paper (emitted aura shot)', 'Superhuman senses honed in the wild'],
    stats: { power: 82, speed: 78, tactics: 60, nen: 80 },
    emblem: `<svg viewBox="0 0 100 100" aria-hidden="true">
      <path d="M18 84 Q30 40 74 18" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round"/>
      <path d="M74 18 q10 22 -4 40" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-dasharray="2 6"/>
      <circle cx="70" cy="60" r="7" fill="none" stroke="currentColor" stroke-width="4"/>
      <path d="M14 88 l10 -10" stroke="currentColor" stroke-width="8" stroke-linecap="round"/>
    </svg>`,
  },
  {
    id: 'killua',
    name: 'Killua Zoldyck',
    epithet: 'Heir of the Zoldyck Family',
    nenType: 'Transmutation',
    color: '#58c9e8',
    color2: '#2a7fa8',
    quote: 'Gon, you are light. Sometimes you shine so brightly, I must look away.',
    bio: 'Raised as the perfect assassin, Killua ran away from his family\'s mountain estate to find a life of his own. Brilliant, fast and ruthless when he must be — his friendship with Gon is the first thing he ever chose for himself.',
    abilities: ['Lightning Palm & Thunderbolt', 'Godspeed (electric nervous system override)', 'Rhythm Echo (assassin afterimages)', 'Yo-yos weighing 50 kg each'],
    stats: { power: 76, speed: 96, tactics: 88, nen: 82 },
    emblem: `<svg viewBox="0 0 100 100" aria-hidden="true">
      <path d="M55 8 L30 52 h16 L40 92 L72 42 H52 Z" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/>
    </svg>`,
  },
  {
    id: 'kurapika',
    name: 'Kurapika',
    epithet: 'The Last of the Kurta',
    nenType: 'Conjuration',
    color: '#e05252',
    color2: '#8f2f3c',
    quote: 'I do not fear death. I fear only that my rage will fade over time.',
    bio: 'Sole survivor of the Kurta Clan, slaughtered for their Scarlet Eyes. Kurapika became a Hunter to reclaim his people\'s eyes and hunt the Phantom Troupe. When his eyes turn scarlet he becomes a Specialist, wielding every Nen category at full power.',
    abilities: ['Chain Jail (binds Troupe members only)', 'Judgment Chain (a lethal contract)', 'Dowsing Chain & Holy Chain', 'Emperor Time (100% of every Nen type)'],
    stats: { power: 70, speed: 74, tactics: 94, nen: 90 },
    emblem: `<svg viewBox="0 0 100 100" aria-hidden="true">
      <path d="M50 12 c14 0 24 10 24 24 0 20 -24 28 -24 52 0 -24 -24 -32 -24 -52 0 -14 10 -24 24 -24z" fill="none" stroke="currentColor" stroke-width="5"/>
      <circle cx="50" cy="36" r="9" fill="currentColor"/>
      <g fill="none" stroke="currentColor" stroke-width="4">
        <circle cx="26" cy="78" r="6"/><circle cx="38" cy="86" r="6"/><circle cx="62" cy="86" r="6"/><circle cx="74" cy="78" r="6"/>
      </g>
    </svg>`,
  },
  {
    id: 'leorio',
    name: 'Leorio Paradinight',
    epithet: 'The Aspiring Doctor',
    nenType: 'Emission',
    color: '#6fe08a',
    color2: '#2f7d4a',
    quote: 'I want money — because with money, you can buy life!',
    bio: 'Loud, hot-blooded, and secretly the most soft-hearted of the group. Leorio wants to become a doctor who never charges the poor — losing a friend to a treatable illness set him on that path. One furious warp-punch made him famous at the Hunter election.',
    abilities: ['Remote Punch (warping emitted strike)', 'Medical knowledge & field treatment', 'Unshakeable loyalty', 'Surprisingly good negotiator'],
    stats: { power: 55, speed: 50, tactics: 66, nen: 58 },
    emblem: `<svg viewBox="0 0 100 100" aria-hidden="true">
      <rect x="16" y="34" width="68" height="46" rx="8" fill="none" stroke="currentColor" stroke-width="5"/>
      <path d="M38 34 v-8 a6 6 0 0 1 6 -6 h12 a6 6 0 0 1 6 6 v8" fill="none" stroke="currentColor" stroke-width="5"/>
      <path d="M50 46 v20 M40 56 h20" stroke="currentColor" stroke-width="6" stroke-linecap="round"/>
    </svg>`,
  },
  {
    id: 'hisoka',
    name: 'Hisoka Morow',
    epithet: 'The Magician',
    nenType: 'Transmutation',
    color: '#e070b8',
    color2: '#93356f',
    quote: 'I only fight people who make my heart race. ♦',
    bio: 'A grinning magician who lives for the thrill of fighting — and breaking — powerful opponents. He keeps promising prey alive until they \u201cripen.\u201d Unpredictable, theatrical, and one of the most dangerous free agents in the world.',
    abilities: ['Bungee Gum (aura of rubber and gum)', 'Texture Surprise (aura camouflage)', 'Master of thrown cards', 'Reads opponents like open books'],
    stats: { power: 88, speed: 86, tactics: 92, nen: 91 },
    emblem: `<svg viewBox="0 0 100 100" aria-hidden="true">
      <rect x="26" y="14" width="48" height="72" rx="7" fill="none" stroke="currentColor" stroke-width="5"/>
      <path d="M50 34 c6 -10 20 -4 12 8 l-12 12 -12 -12 c-8 -12 6 -18 12 -8z" fill="currentColor"/>
      <path d="M50 58 l8 12 h-16 z" fill="currentColor"/>
    </svg>`,
  },
  {
    id: 'kite',
    name: 'Kite',
    epithet: 'Ging\'s First Student',
    nenType: 'Conjuration',
    color: '#b48ef2',
    color2: '#6b4fae',
    quote: 'You should only kill when you\'re prepared to be killed.',
    bio: 'A calm, disciplined Hunter raised from the slums by Ging Freecss. Kite met Gon on Whale Island and later led the expedition into NGL, where he faced the Chimera Ants. His will to survive was strong enough to carry him into a second life.',
    abilities: ['Crazy Slots (a weapon roulette: 1–9)', 'Number 2: the giant scythe', 'Expert biologist & tracker', 'Reborn as a Chimera Ant princess'],
    stats: { power: 80, speed: 77, tactics: 85, nen: 84 },
    emblem: `<svg viewBox="0 0 100 100" aria-hidden="true">
      <path d="M34 90 L62 16" stroke="currentColor" stroke-width="6" stroke-linecap="round"/>
      <path d="M62 16 C46 8 26 14 18 30 c14 -6 32 -4 44 4z" fill="currentColor"/>
      <circle cx="76" cy="70" r="13" fill="none" stroke="currentColor" stroke-width="4"/>
      <text x="76" y="76" text-anchor="middle" font-size="16" font-weight="bold" fill="currentColor" font-family="sans-serif">2</text>
    </svg>`,
  },
  {
    id: 'chrollo',
    name: 'Chrollo Lucilfer',
    epithet: 'Head of the Phantom Troupe',
    nenType: 'Specialization',
    color: '#f45fc0',
    color2: '#8a2f76',
    quote: 'We take what we want. That is all the Spider is.',
    bio: 'The calm, book-loving leader of the Phantom Troupe — thirteen thieves from Meteor City marked with a twelve-legged spider. Chrollo steals not only treasure but other people\'s Nen abilities, collecting them in his conjured book.',
    abilities: ['Skill Hunter (steals Nen abilities)', 'Bandit\'s Secret: the conjured book', 'Double Face (two abilities at once)', 'Flawless strategic mind'],
    stats: { power: 84, speed: 85, tactics: 97, nen: 93 },
    emblem: `<svg viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="46" r="15" fill="none" stroke="currentColor" stroke-width="5"/>
      <g stroke="currentColor" stroke-width="4" stroke-linecap="round" fill="none">
        <path d="M38 36 C26 26 22 20 18 10"/><path d="M35 46 C22 44 14 40 8 34"/>
        <path d="M36 55 C26 62 18 66 10 68"/><path d="M42 59 C38 72 34 80 28 88"/>
        <path d="M62 36 C74 26 78 20 82 10"/><path d="M65 46 C78 44 86 40 92 34"/>
        <path d="M64 55 C74 62 82 66 90 68"/><path d="M58 59 C62 72 66 80 72 88"/>
      </g>
      <text x="50" y="52" text-anchor="middle" font-size="15" font-weight="bold" fill="currentColor" font-family="sans-serif">12</text>
    </svg>`,
  },
  {
    id: 'netero',
    name: 'Isaac Netero',
    epithet: '12th Chairman of the Hunter Association',
    nenType: 'Enhancement',
    color: '#f4c95d',
    color2: '#a8792a',
    quote: 'You should enjoy the little detours. Because that\'s where you\'ll find the things more important than what you want.',
    bio: 'The strongest Nen user in the world in his prime — and still monstrous at 110+ years old. Netero spent four years performing ten thousand punches of gratitude a day, and was rewarded with speed faster than sound and a bottomless love of the game.',
    abilities: ['100-Type Guanyin Bodhisattva', 'Zero Hand (his entire aura, at once)', 'Prayer faster than the eye can see', 'The Poor Man\'s Rose (his final trump)'],
    stats: { power: 98, speed: 95, tactics: 90, nen: 99 },
    emblem: `<svg viewBox="0 0 100 100" aria-hidden="true">
      <path d="M50 10 C58 26 70 30 70 48 c0 14 -9 24 -20 24 s-20 -10 -20 -24 c0 -18 12 -22 20 -38z" fill="none" stroke="currentColor" stroke-width="5"/>
      <path d="M50 30 v42 M40 46 c0 10 4 16 10 16 s10 -6 10 -16" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
      <path d="M26 84 h48" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
      <path d="M34 92 h32" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
    </svg>`,
  },
  {
    id: 'ging',
    name: 'Ging Freecss',
    epithet: 'The Wandering Genius',
    nenType: 'Unknown',
    color: '#f08c3a',
    color2: '#a5551a',
    quote: 'You should be asking what it is you want to find, not where I am.',
    bio: 'Gon\'s father, a double-star Ruins Hunter and one of the five best Nen users alive — according to Netero. Ging created Greed Island with friends, hid himself at the top of the world, and left his son a game instead of a goodbye. Rude, brilliant, unforgettable.',
    abilities: ['Can copy any attack after taking it once', 'Co-creator of Greed Island', 'Leverages rules like a game designer', 'Vice-chairman of the Zodiacs ("Boar")'],
    stats: { power: 90, speed: 88, tactics: 96, nen: 95 },
    emblem: `<svg viewBox="0 0 100 100" aria-hidden="true">
      <rect x="14" y="26" width="72" height="48" rx="8" fill="none" stroke="currentColor" stroke-width="5"/>
      <g stroke-linecap="round" stroke-width="6">
        <line x1="38" y1="38" x2="62" y2="62" stroke="currentColor"/>
        <line x1="62" y1="38" x2="38" y2="62" stroke="currentColor" opacity="0.55"/>
      </g>
      <text x="72" y="68" text-anchor="middle" font-size="22" font-weight="bold" fill="currentColor" font-family="sans-serif">?</text>
    </svg>`,
  },
  {
    id: 'tonpa',
    name: 'Tonpa',
    epithet: 'The Rookie Crusher',
    nenType: 'Unknown',
    color: '#9aa0ae',
    color2: '#565d6d',
    quote: 'Care for a juice? It\'s on me. *(Do not drink the juice.)*',
    bio: 'A veteran of thirty-five Hunter Exams — every single one failed. Tonpa\'s true talent is sabotage: he greets promising rookies with a friendly smile and a can of laxative-laced juice. A legend, just not the kind he hoped to be.',
    abilities: ['Laxative juice "welcome gift"', 'Encyclopedic Hunter Exam knowledge', 'Expert at sniffing out rookies', '35 attempts, 0 licenses'],
    stats: { power: 12, speed: 18, tactics: 45, nen: 5 },
    emblem: `<svg viewBox="0 0 100 100" aria-hidden="true">
      <path d="M34 24 h32 l-4 62 a6 6 0 0 1 -6 6 h-12 a6 6 0 0 1 -6 -6 z" fill="none" stroke="currentColor" stroke-width="5"/>
      <ellipse cx="50" cy="24" rx="16" ry="6" fill="none" stroke="currentColor" stroke-width="5"/>
      <path d="M50 24 l10 -12" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
      <path d="M40 48 q5 6 10 0 t10 0" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
      <path d="M40 62 q5 6 10 0 t10 0" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
    </svg>`,
  },
];

export const nenTypeColors: Record<NenTypeName, string> = {
  Enhancement: 'var(--nen-enhancement)',
  Transmutation: 'var(--nen-transmutation)',
  Conjuration: 'var(--nen-conjuration)',
  Specialization: 'var(--nen-specialization)',
  Manipulation: 'var(--nen-manipulation)',
  Emission: 'var(--nen-emission)',
  Unknown: 'var(--text-dim)',
};
