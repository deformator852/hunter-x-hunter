export const portraits: Record<string, string> = {
  gon: '/images/characters/gon.png',
  killua: '/images/characters/killua.png',
  kurapika: '/images/characters/kurapika.png',
  leorio: '/images/characters/leorio.png',
  hisoka: '/images/characters/hisoka.png',
  kite: '/images/characters/kite.png',
  chrollo: '/images/characters/chrollo.png',
  netero: '/images/characters/netero.png',
  ging: '/images/characters/ging.png',
  tonpa: '/images/characters/tonpa.png',
};

/** Build an absolute-with-base portrait URL for the current Astro base path. */
export function portraitSrc(base: string, id: string): string {
  const path = portraits[id];
  if (!path) return '';
  const prefix = (base || '').replace(/\/$/, '');
  return `${prefix}${path}`;
}
