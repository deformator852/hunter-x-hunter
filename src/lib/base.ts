/** Strip trailing slash from Astro BASE_URL for path joining. */
export function siteBase(baseUrl: string = import.meta.env.BASE_URL): string {
  return baseUrl.replace(/\/$/, '');
}

/** Prefix a root-absolute asset path with the site base. */
export function withBase(path: string | null | undefined, baseUrl?: string): string | null {
  if (!path) return null;
  return `${siteBase(baseUrl)}${path}`;
}
