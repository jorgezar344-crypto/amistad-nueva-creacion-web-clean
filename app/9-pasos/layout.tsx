import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Los 9 Pasos — Un camino para crecer en Cristo',
  description: 'Conoce los 9 Pasos de Amistad Nueva Creación. Cada paso te ayudará a crecer más cerca de Jesús.',
  alternates: {
    canonical: '/9-pasos',
  },
  openGraph: {
    title: 'Los 9 Pasos — Un camino para crecer en Cristo',
    description: 'Cada paso te ayudará a crecer más cerca de Jesús.',
    url: '/9-pasos',
  },
};

export default function NineStepsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
