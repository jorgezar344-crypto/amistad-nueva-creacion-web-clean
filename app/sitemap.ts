import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://amistadnuevacreacion.org';
  const routes = [
    ['', 1],
    ['/conocenos', 0.8],
    ['/primera-visita', 0.9],
    ['/9-pasos', 0.9],
    ['/mensajes', 0.8],
    ['/eventos', 0.8],
    ['/ofrendar', 0.6],
  ] as const;

  return routes.map(([path, priority]) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '/eventos' || path === '' ? 'weekly' : 'monthly',
    priority,
  }));
}
