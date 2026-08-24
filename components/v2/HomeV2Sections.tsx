'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  ArrowRight,
  Calendar,
  Clock,
  HeartHandshake,
  MapPin,
  MessageCircle,
  Navigation,
  Play,
} from '../icons/Icons';
import { CHURCH, MESSAGE, WHATSAPP_LINKS } from '../../data/siteData';
import { getUpcomingEvents, type EventItem } from '../../data/eventsData';
import { NINE_STEPS_EXPERIENCE, NINE_STEP_MARKERS } from '../../data/nineStepsExperienceData';
import { CinematicMapMedia } from './CinematicMapMedia';
import { MessagePlayer } from './MessagePlayer';

export function RecentMessageHome() {
  return (
    <section id="mensaje-reciente" className="v2-home-section v2-message-home" data-v2-nav-theme="light">
      <div className="v2-shell v2-message-home__grid">
        <div className="v2-message-home__media" data-home-reveal="media">
          <MessagePlayer compact />
        </div>
        <div className="v2-message-home__copy" data-home-reveal="copy">
          <p className="v2-eyebrow">Mensaje reciente</p>
          <h2>Una palabra para <em>acompañar tu semana.</em></h2>
          <p className="v2-message-home__title">{MESSAGE.title}</p>
          <p className="v2-message-home__speaker">{MESSAGE.speaker}</p>
          <p>Escucha la enseñanza compartida en nuestra reunión y vuelve a ella cuando lo necesites.</p>
          <div className="v2-actions">
            <a className="v2-button v2-button--ink" href={`https://www.youtube.com/watch?v=${MESSAGE.youtubeId}`} target="_blank" rel="noopener noreferrer">
              <Play className="h-4 w-4" /> Ver mensaje
            </a>
            <Link className="v2-text-link" href="/mensajes">Ver todos los mensajes <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ChurchHomeTeaser() {
  return (
    <section id="nuestra-iglesia" className="v2-home-section v2-church-home" data-v2-nav-theme="dark">
      <div className="v2-shell">
        <div className="v2-church-home__heading" data-home-reveal="copy">
          <p className="v2-eyebrow">Conoce la iglesia</p>
          <h2>Una comunidad real para <em>crecer juntos en Cristo.</em></h2>
        </div>
        <div className="v2-church-home__composition">
          <figure className="v2-church-home__media" data-home-reveal="image">
            <Image src="/images/real-church-auditorium.png" alt="Congregación reunida en el auditorio de Amistad Nueva Creación" fill sizes="(max-width: 900px) 100vw, 65vw" className="object-cover" />
          </figure>
          <div className="v2-church-home__note" data-home-reveal="copy">
            <span aria-hidden="true">02</span>
            <p>{CHURCH.promise}</p>
            <Link className="v2-text-link v2-text-link--light" href="/conocenos">Conoce nuestra iglesia <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FirstVisitHomeTeaser() {
  return (
    <section id="primera-visita" className="v2-home-section v2-visit-home" data-v2-nav-theme="light">
      <div className="v2-shell v2-visit-home__grid">
        <div className="v2-visit-home__copy" data-home-reveal="copy">
          <p className="v2-eyebrow">Tu primera visita</p>
          <h2>Ven como eres. <em>Queremos recibirte bien.</em></h2>
          <p>Desde que llegas encontrarás anfitriones para orientarte, un ambiente cercano y una reunión centrada en Jesús.</p>
          <dl className="v2-visit-home__facts">
            <div><dt>Domingo</dt><dd>{CHURCH.serviceTimes.join(' · ')}</dd></div>
            <div><dt>Ubicación</dt><dd>Amanecer Balvanera, Corregidora</dd></div>
          </dl>
          <Link className="v2-button v2-button--ink" href="/primera-visita">Planea tu primera visita <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <figure className="v2-visit-home__media" data-home-reveal="image">
          <Image src="/images/real-church-sermon-authentic.png" alt="Personas participando en una reunión de Amistad Nueva Creación" fill sizes="(max-width: 900px) 100vw, 52vw" className="object-cover" />
          <figcaption>Una iglesia donde puedes llegar, preguntar y caminar acompañado.</figcaption>
        </figure>
      </div>
    </section>
  );
}

export function NineStepsHomePortal() {
  return (
    <section id="los-9-pasos" className="v2-nine-portal" data-v2-nav-theme="dark">
      <CinematicMapMedia />
      <div className="v2-nine-portal__content">
        <header className="v2-nine-portal__heading" data-home-reveal="copy">
          <p className="v2-eyebrow">Los 9 Pasos</p>
          <h2>Un camino para <em>crecer en Cristo.</em></h2>
          <p>Cada paso te ayudará a crecer más cerca de Jesús.</p>
        </header>

        <div className="v2-nine-portal__markers" aria-label="Los nueve pasos del recorrido">
          {NINE_STEPS_EXPERIENCE.map((step, index) => (
            <Link
              key={step.id}
              href={`/9-pasos?step=${index + 1}`}
              className="v2-nine-marker"
              style={{ left: `${NINE_STEP_MARKERS[index].left}%`, top: `${NINE_STEP_MARKERS[index].top}%` }}
              aria-label={`Paso ${step.number}: ${step.name}`}
            >
              <span>{step.number}</span>
              <strong>{step.name}</strong>
            </Link>
          ))}
        </div>

        <div className="v2-nine-portal__mobile-steps" aria-label="Selector de Los 9 Pasos">
          {NINE_STEPS_EXPERIENCE.map((step, index) => (
            <Link key={step.id} href={`/9-pasos?step=${index + 1}`}>
              <span>{step.number}</span>{step.name}
            </Link>
          ))}
        </div>

        <div className="v2-nine-portal__actions">
          <Link className="v2-button v2-button--light" href="/9-pasos?guided=1">Comenzar recorrido <ArrowRight className="h-4 w-4" /></Link>
          <Link className="v2-text-link v2-text-link--light" href="/9-pasos">Explorar libremente</Link>
        </div>
      </div>
    </section>
  );
}

export function EventsHomeTeaser() {
  const [events, setEvents] = useState<EventItem[] | null>(null);
  useEffect(() => setEvents(getUpcomingEvents(3)), []);

  return (
    <section id="proximos-eventos" className="v2-home-section v2-events-home" data-v2-nav-theme="light">
      <div className="v2-shell">
        <header className="v2-section-heading" data-home-reveal="copy">
          <div><p className="v2-eyebrow">Próximos eventos</p><h2>Lo que viene en <em>Amistad.</em></h2></div>
          <Link className="v2-text-link" href="/eventos">Ver todos los eventos <ArrowRight className="h-4 w-4" /></Link>
        </header>
        <div className="v2-events-home__list" aria-live="polite">
          {events === null ? <p className="v2-inline-status">Preparando la agenda…</p> : events.length === 0 ? <p className="v2-inline-status">Pronto compartiremos nuevas fechas confirmadas.</p> : events.map((event, index) => (
            <article key={event.id} data-home-reveal="row">
              <div className="v2-events-home__date"><strong>{event.dayBadge}</strong><span>{event.monthBadge}</span></div>
              <div><p>{event.category}</p><h3>{event.title}</h3><span>{event.dateDisplay}</span></div>
              <div className="v2-events-home__time"><Clock className="h-4 w-4" />{event.time}</div>
              <Link href={`/eventos/${event.id}`} aria-label={`Ver detalles de ${event.title}`}><ArrowRight className="h-5 w-5" /></Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function GivingHomeTeaser() {
  return (
    <section id="ofrendar" className="v2-home-section v2-giving-home" data-v2-nav-theme="dark">
      <div className="v2-shell v2-giving-home__grid">
        <div data-home-reveal="copy"><p className="v2-eyebrow">Ofrendar</p><h2>Dar también es parte de <em>nuestra adoración.</em></h2></div>
        <div data-home-reveal="copy"><p>Esta experiencia quedará preparada para una futura integración de pago hospedado. La web no solicitará ni almacenará datos de tarjeta.</p><Link className="v2-button v2-button--light" href="/ofrendar">Conocer cómo ofrendar <ArrowRight className="h-4 w-4" /></Link></div>
      </div>
    </section>
  );
}

export function ClosingPracticalHome() {
  return (
    <section id="ubicacion" className="v2-home-section v2-closing-home" data-v2-nav-theme="dark">
      <Image src="/images/real-church-entrance.jpg" alt="Entrada de Amistad Nueva Creación Internacional en Corregidora" fill sizes="100vw" className="object-cover" />
      <span className="v2-closing-home__shade" aria-hidden="true" />
      <div className="v2-shell v2-closing-home__content">
        <div data-home-reveal="copy"><p className="v2-eyebrow">Ubicación · contacto · oración</p><h2>Nos encantará <em>recibirte.</em></h2></div>
        <div className="v2-closing-home__panel" data-home-reveal="copy">
          <div><MapPin className="h-5 w-5" /><p>{CHURCH.address}</p></div>
          <div><Calendar className="h-5 w-5" /><p>Domingos · {CHURCH.serviceTimes.join(' · ')}</p></div>
          <div className="v2-closing-home__actions">
            <a className="v2-button v2-button--light" href={CHURCH.mapUrl} target="_blank" rel="noopener noreferrer"><Navigation className="h-4 w-4" /> Cómo llegar</a>
            <a className="v2-text-link v2-text-link--light" href={WHATSAPP_LINKS.prayer} target="_blank" rel="noopener noreferrer"><MessageCircle className="h-4 w-4" /> Petición de oración</a>
          </div>
        </div>
      </div>
    </section>
  );
}
