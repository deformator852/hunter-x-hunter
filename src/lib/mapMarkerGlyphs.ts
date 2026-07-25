/** Inline SVG glyphs for map pins (viewBox center at 0,0). */

const glyphs: Record<string, string> = {
  whale: `
    <ellipse cx="-1" cy="-1" rx="7" ry="3.2" fill="#0b0d12"/>
    <path d="M5 -1 q3 -4 5 -1 q-2 1 -3 3 z" fill="#0b0d12"/>
    <path d="M-7 -1 q-2 -3 -4 0" fill="none" stroke="#0b0d12" stroke-width="1.4" stroke-linecap="round"/>
    <circle cx="-3.5" cy="-1.5" r="0.7" fill="#4fbf67"/>`,
  zaban: `
    <path d="M-7 1 h14 q0 7 -7 7 q-7 0 -7 -7z" fill="#0b0d12"/>
    <ellipse cx="0" cy="1" rx="7" ry="2" fill="#f4c95d" stroke="#0b0d12" stroke-width="1.2"/>
    <path d="M-3 -5 q1 4 0 7 M1 -6 q0 5 1 8 M4 -4 q-1 4 -1 6" fill="none" stroke="#0b0d12" stroke-width="1.6" stroke-linecap="round"/>`,
  heavens: `
    <rect x="-4" y="-8" width="8" height="14" rx="1" fill="#0b0d12"/>
    <rect x="-5.5" y="-10" width="11" height="2.2" rx="0.5" fill="#0e2030" stroke="#0b0d12" stroke-width="1"/>
    <path d="M-2 -6 h4 M-2 -3 h4 M-2 0 h4 M-2 3 h4" stroke="#58b3e0" stroke-width="1.1"/>
    <path d="M0 -10 v-3" stroke="#0b0d12" stroke-width="1.6" stroke-linecap="round"/>`,
  kukuroo: `
    <path d="M-7 6 V-2 q0 -7 7 -7 q7 0 7 7 V6" fill="none" stroke="#0b0d12" stroke-width="1.7" stroke-linecap="round"/>
    <path d="M-3 6 V0 M3 6 V0" fill="none" stroke="#0b0d12" stroke-width="1.7"/>
    <circle cx="0" cy="-2" r="1.6" fill="#9b6fd4"/>`,
  padokea: `
    <path d="M-8 5 L-2 -6 L2 -1 L5 -5 L9 5 Z" fill="#0b0d12"/>
    <path d="M-2 -6 L2 -1 L5 -5" fill="none" stroke="#b48ef2" stroke-width="1.3"/>`,
  yorknew: `
    <rect x="-8" y="-2" width="4" height="8" rx="0.5" fill="#0b0d12"/>
    <rect x="-3" y="-6" width="5" height="12" rx="0.5" fill="#0b0d12"/>
    <rect x="3" y="-4" width="4" height="10" rx="0.5" fill="#0b0d12"/>
    <path d="M0 -9 l2.2 2.2 -2.2 2.2 -2.2 -2.2 z" fill="#e63946" stroke="#0b0d12" stroke-width="0.8"/>`,
  meteor: `
    <path d="M-8 5 h16 l-2 -5 h-3 l-2 -4 h-4 l-2 4 h-3 z" fill="#0b0d12"/>
    <circle cx="0" cy="-1" r="2.2" fill="none" stroke="#0b0d12" stroke-width="1.3"/>
    <path d="M-3 -3 L-6 -6 M3 -3 L6 -6 M-3.5 0 L-7 1 M3.5 0 L7 1" fill="none" stroke="#0b0d12" stroke-width="1.2" stroke-linecap="round"/>`,
  southernpiece: `
    <rect x="-7" y="-5" width="9" height="5" rx="1" fill="#0b0d12" transform="rotate(-28 -2.5 -2.5)"/>
    <path d="M1 -1 L7 7" fill="none" stroke="#0b0d12" stroke-width="2.2" stroke-linecap="round"/>
    <ellipse cx="0" cy="6" rx="6" ry="1.4" fill="#f08c3a" stroke="#0b0d12" stroke-width="1"/>`,
  greed: `
    <rect x="-6" y="-7" width="12" height="14" rx="1.5" fill="#0b0d12"/>
    <rect x="-4" y="-5" width="8" height="5" rx="0.6" fill="#f08c3a"/>
    <text y="5" text-anchor="middle" font-size="6.5" font-weight="800" fill="#f08c3a" font-family="sans-serif">GI</text>`,
  ngl: `
    <ellipse cx="0" cy="0" rx="5.5" ry="4.5" fill="#0b0d12"/>
    <path d="M-4 -3 L-7 -7 M4 -3 L7 -7 M-5 2 L-8 5 M5 2 L8 5" fill="none" stroke="#0b0d12" stroke-width="1.5" stroke-linecap="round"/>
    <circle cx="-2" cy="-0.5" r="0.9" fill="#ff5c4d"/>
    <circle cx="2" cy="-0.5" r="0.9" fill="#ff5c4d"/>`,
  gorteau: `
    <path d="M-8 4 L-8 -2 L-4 2 L0 -5 L4 2 L8 -2 L8 4 Z" fill="#0b0d12"/>
    <rect x="-8" y="4" width="16" height="2.5" rx="0.5" fill="#f45fc0" stroke="#0b0d12" stroke-width="1"/>
    <circle cx="0" cy="-5" r="1.3" fill="#f45fc0"/>`,
  kakin: `
    <path d="M0 -8 L6 -2 L4 6 H-4 L-6 -2 Z" fill="#0b0d12"/>
    <circle cx="0" cy="0" r="2.4" fill="#f4c95d" stroke="#0b0d12" stroke-width="1"/>
    <path d="M-3 -4 h6" fill="none" stroke="#f4c95d" stroke-width="1.3"/>`,
  blackwhale: `
    <path d="M-8 3 L-5 -2 H6 L9 3 Z" fill="#0b0d12"/>
    <path d="M-2 -2 V-7 H1 V-2" fill="#58c9e8" stroke="#0b0d12" stroke-width="1"/>
    <path d="M-9 5 q9 3 18 0" fill="none" stroke="#0b0d12" stroke-width="1.5" stroke-linecap="round"/>`,
  gate: `
    <path d="M-6 7 V-3 a6 6 0 0 1 12 0 V7" fill="#0b0d12"/>
    <path d="M-6 7 V-3 a6 6 0 0 1 12 0 V7" fill="none" stroke="#0b0d12" stroke-width="1.8"/>
    <path d="M0 7 V-9 M-3 7 V-5 M3 7 V-5" fill="none" stroke="#f4c95d" stroke-width="1.2"/>`,
  brion: `
    <circle cx="0" cy="-3" r="5" fill="#0b0d12"/>
    <path d="M0 2 V8 M-3 5 H3" fill="none" stroke="#0b0d12" stroke-width="1.8" stroke-linecap="round"/>
    <circle cx="-1.5" cy="-4" r="0.8" fill="#ff5c4d"/>
    <circle cx="1.5" cy="-4" r="0.8" fill="#ff5c4d"/>
    <path d="M-5 -6 Q-7 -10 -3 -9 M5 -6 Q7 -10 3 -9" fill="none" stroke="#0b0d12" stroke-width="1.3"/>`,
  hellbell: `
    <path d="M-4 6 Q-7 -2 -2 -6 Q2 -2 0 6" fill="none" stroke="#0b0d12" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M4 6 Q7 -2 2 -6 Q-2 -2 0 6" fill="none" stroke="#0b0d12" stroke-width="1.8" stroke-linecap="round"/>
    <circle cx="-2" cy="-6" r="1.4" fill="#9b6fd4"/>
    <circle cx="2" cy="-6" r="1.4" fill="#9b6fd4"/>`,
  ai: `
    <ellipse cx="0" cy="0" rx="7" ry="4" fill="#0b0d12" opacity="0.85"/>
    <path d="M-5 -3 Q-1 -8 3 -3 Q0 -1 -5 -3" fill="#f45fc0" stroke="#0b0d12" stroke-width="1"/>
    <circle cx="-2" cy="0" r="0.8" fill="#f45fc0"/>
    <circle cx="2" cy="1" r="0.7" fill="#f45fc0"/>`,
  zobae: `
    <circle r="6.5" fill="#0b0d12"/>
    <path d="M-3 -1 h2.5 M1 -1 h2.5" fill="none" stroke="#6fe08a" stroke-width="1.4" stroke-linecap="round"/>
    <path d="M-3.5 2.5 Q0 6 3.5 2.5" fill="none" stroke="#6fe08a" stroke-width="1.5" stroke-linecap="round"/>`,
  pap: `
    <ellipse cx="0" cy="1" rx="5.5" ry="4" fill="#0b0d12"/>
    <circle cx="0" cy="-4" r="3.2" fill="#0b0d12"/>
    <path d="M4 2 Q9 0 8 -5 M-4 2 Q-9 0 -8 -5" fill="none" stroke="#0b0d12" stroke-width="1.7" stroke-linecap="round"/>
    <circle cx="-1" cy="-4.5" r="0.6" fill="#58c9e8"/>
    <circle cx="1" cy="-4.5" r="0.6" fill="#58c9e8"/>`,
};

const fallbackByType: Record<string, string> = {
  city: `<path d="M-5 5 V-4 H-1 V-7 H3 V-2 H6 V5 Z" fill="#0b0d12"/>`,
  island: `<path d="M-7 3 Q0 -2 7 3 Q0 7 -7 3 Z" fill="#0b0d12"/>`,
  landmark: `<path d="M0 -8 L4 5 H-4 Z" fill="#0b0d12"/>`,
  conflict: `<path d="M0 -7 L6 5 H-6 Z" fill="#0b0d12"/>`,
  calamity: `<circle r="5" fill="#0b0d12"/><path d="M-4 -2 L0 5 L4 -2" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>`,
};

export function markerGlyphSvg(id: string, type: string): string {
  return glyphs[id] ?? fallbackByType[type] ?? fallbackByType.calamity;
}
