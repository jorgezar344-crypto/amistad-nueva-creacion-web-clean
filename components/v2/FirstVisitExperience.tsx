'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ArrowRight, CheckCircle2, Clock, MapPin, MessageCircle, Navigation } from '../icons/Icons';
import { VisitCoordinationModal } from '../home/VisitCoordinationModal';
import { CHURCH, WHATSAPP_LINKS } from '../../data/siteData';
import { SiteNavbar } from './SiteNavbar';
import { SiteFooter } from './SiteFooter';
import { InternalPageHero } from './InternalPageHero';

const expectations = [
  ['Ven tal como eres', 'No necesitas conocer el orden de la reunión ni vestir de una manera especial.'],
  ['Anfitriones desde la puerta', 'Nuestro equipo puede orientarte al llegar y responder tus preguntas.'],
  ['Un espacio para tus hijos', 'Durante la reunión hay enseñanza bíblica y actividades preparadas para niños.'],
  ['Estacionamiento y acceso', 'La ubicación cuenta con acceso para automóvil y un equipo que puede orientarte.'],
] as const;

export function FirstVisitExperience() {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <div className="v2-site v2-oyster-page">
      <SiteNavbar />
      <main>
        <InternalPageHero
          eyebrow="Primera visita"
          title={<>Tu primera vez puede sentirse <em>como llegar a casa.</em></>}
          description="Aquí tienes lo esencial para llegar con tranquilidad. Si necesitas orientación, podemos acompañarte por WhatsApp."
        />

        <section className="v2-visit-page-intro" data-v2-nav-theme="light">
          <div className="v2-shell v2-visit-page-intro__grid">
            <figure>
              <Image src="/images/primera-visita-bienvenida.jpg" alt="Familia recibiendo una bienvenida al llegar a Amistad Nueva Creación" fill sizes="(max-width: 900px) 100vw, 55vw" className="object-cover" />
            </figure>
            <div>
              <p className="v2-eyebrow">Antes de venir</p>
              <h2>Lo esencial, <em>sin presión.</em></h2>
              <div className="v2-visit-page-intro__facts">
                <div><Clock className="h-5 w-5" /><span><strong>Domingos</strong>{CHURCH.serviceTimes.join(' · ')}</span></div>
                <div><MapPin className="h-5 w-5" /><span><strong>Dirección</strong>{CHURCH.address}</span></div>
              </div>
              <div className="v2-actions">
                <button className="v2-button v2-button--ink" type="button" onClick={() => setModalOpen(true)}>Avisar que voy a visitar <ArrowRight className="h-4 w-4" /></button>
                <a className="v2-text-link" href={CHURCH.mapUrl} target="_blank" rel="noopener noreferrer"><Navigation className="h-4 w-4" /> Cómo llegar</a>
              </div>
            </div>
          </div>
        </section>

        <section className="v2-visit-page-expect" data-v2-nav-theme="dark">
          <div className="v2-shell">
            <header className="v2-section-heading"><div><p className="v2-eyebrow">Qué esperar</p><h2>Una llegada <em>simple y cercana.</em></h2></div></header>
            <div className="v2-visit-page-expect__grid">
              {expectations.map(([title, text], index) => (
                <article key={title}><span>{String(index + 1).padStart(2, '0')}</span><CheckCircle2 className="h-5 w-5" /><h3>{title}</h3><p>{text}</p></article>
              ))}
            </div>
          </div>
        </section>

        <section className="v2-visit-page-contact" data-v2-nav-theme="dark">
          <div className="v2-shell">
            <p className="v2-eyebrow">¿Tienes una pregunta?</p>
            <h2>Podemos orientarte <em>antes de llegar.</em></h2>
            <div className="v2-actions">
              <a className="v2-button v2-button--light" href={WHATSAPP_LINKS.visit} target="_blank" rel="noopener noreferrer"><MessageCircle className="h-4 w-4" /> Escribir por WhatsApp</a>
              <a className="v2-text-link v2-text-link--light" href={WHATSAPP_LINKS.directions} target="_blank" rel="noopener noreferrer">Necesito ayuda para llegar</a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <VisitCoordinationModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
