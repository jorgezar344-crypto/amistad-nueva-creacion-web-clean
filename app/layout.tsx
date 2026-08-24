import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import './v2.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#06090E',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://amistadnuevacreacion.org'),
  title: {
    default: 'Amistad Nueva Creación Internacional',
    template: '%s | Amistad Nueva Creación',
  },
  description:
    'Hay un nuevo comienzo para ti. Conoce a Jesús y descubre un camino de 9 pasos para crecer en tu nueva vida y ser parte de una familia espiritual.',
  keywords: [
    'Amistad Nueva Creación Internacional',
    'Iglesia Cristiana',
    'Los 9 Pasos',
    'Conocer a Jesús',
    'Discipulado',
    'Comunidad',
  ],
  authors: [{ name: 'Amistad Nueva Creación Internacional' }],
  robots: {
    index: true,
    follow: true,
  },
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: '/',
    siteName: 'Amistad Nueva Creación Internacional',
    title: 'Amistad Nueva Creación Internacional',
    description: 'Un lugar para conocer a Jesús, crecer en tu fe y caminar en familia.',
  },
  twitter: {
    card: 'summary',
    title: 'Amistad Nueva Creación Internacional',
    description: 'Un lugar para conocer a Jesús, crecer en tu fe y caminar en familia.',
  },
  icons: { icon: '/brand/logo-oficial.jpg' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${playfair.variable} v2-body bg-void text-brandText-primary font-sans antialiased selection:bg-cyan-electric/30 selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
