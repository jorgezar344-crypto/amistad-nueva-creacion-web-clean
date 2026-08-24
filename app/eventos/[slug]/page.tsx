import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, MapPin, MessageCircle } from '../../../components/icons/Icons';
import { SiteNavbar } from '../../../components/v2/SiteNavbar';
import { SiteFooter } from '../../../components/v2/SiteFooter';
import { CHURCH_EVENTS } from '../../../data/eventsData';
import { CHURCH } from '../../../data/siteData';

export function generateStaticParams() {
  return CHURCH_EVENTS.filter((event) => event.isPublic).map((event) => ({ slug: event.id }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const event = CHURCH_EVENTS.find((item) => item.id === params.slug && item.isPublic);
  return { title: event?.title ?? 'Evento' };
}

export default function EventDetailPage({ params }: { params: { slug: string } }) {
  const event = CHURCH_EVENTS.find((item) => item.id === params.slug && item.isPublic);
  if (!event) notFound();
  const whatsapp = `https://wa.me/524424112143?text=${encodeURIComponent(`Hola, quisiera información sobre ${event.title} (${event.dateDisplay}).`)}`;
  return (
    <div className="v2-site v2-oyster-page">
      <SiteNavbar />
      <main className="v2-event-detail" data-v2-nav-theme="light">
        <section className="v2-event-detail__hero">
          {event.image ? <Image src={event.image} alt="" fill priority sizes="100vw" className="object-cover" /> : null}
          <span className="v2-event-detail__shade" aria-hidden="true" />
          <div className="v2-shell"><Link href="/eventos" className="v2-text-link v2-text-link--light"><ArrowLeft className="h-4 w-4" /> Volver a eventos</Link><p className="v2-eyebrow">{event.category}</p><h1>{event.title}</h1></div>
        </section>
        <section className="v2-event-detail__body">
          <div className="v2-shell v2-event-detail__grid">
            <article><p className="v2-eyebrow">Información confirmada</p><h2>{event.dateDisplay}</h2>{event.guest ? <p className="v2-event-detail__guest">{event.guest}</p> : null}{event.details?.length ? <ul>{event.details.map((detail)=><li key={detail}>{detail}</li>)}</ul> : <p>Consulta los datos publicados para esta actividad y contáctanos si necesitas orientación.</p>}</article>
            <aside><div><Calendar className="h-5 w-5" /><span><strong>Fecha</strong>{event.dateDisplay}</span></div><div><Clock className="h-5 w-5" /><span><strong>Hora</strong>{event.time}</span></div><div><MapPin className="h-5 w-5" /><span><strong>Lugar</strong>{CHURCH.address}</span></div><a className="v2-button v2-button--ink" href={whatsapp} target="_blank" rel="noopener noreferrer"><MessageCircle className="h-4 w-4" /> Preguntar por WhatsApp</a><button type="button" disabled>Agregar a mi calendario · Próximamente</button></aside>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
