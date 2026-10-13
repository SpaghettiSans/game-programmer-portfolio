// Respect Astro base paths on GitHub Pages and custom domains.
export function sitePath(path: string): string {
  if (!path.startsWith('/') || path.startsWith('//')) return path;
  return `${import.meta.env.BASE_URL.replace(/\/$/, '')}${path}`;
}
