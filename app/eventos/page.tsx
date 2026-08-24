import type { Metadata } from 'next';
import { SiteNavbar } from '../../components/v2/SiteNavbar';
import { SiteFooter } from '../../components/v2/SiteFooter';
import { InternalPageHero } from '../../components/v2/InternalPageHero';
import { EventsExplorer } from '../../components/v2/EventsExplorer';

export const metadata: Metadata = { title: 'Eventos' };

export default function EventsPage() {
  return (
    <div className="v2-site v2-oyster-page">
      <SiteNavbar />
      <main>
        <InternalPageHero eyebrow="Eventos" title={<>Lo que viene en <em>Amistad.</em></>} description="Una cartelera clara para encontrar nuestras próximas reuniones y actividades publicadas." />
        <EventsExplorer />
      </main>
      <SiteFooter />
    </div>
  );
}
