'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Compass, HeartHandshake, MessageCircle } from '../icons/Icons';
import {
  NINE_STEPS_EXPERIENCE,
  NINE_STEPS_MAP_POSTER,
  NINE_STEP_MARKERS,
  type NineStepExperienceData,
} from '../../data/nineStepsExperienceData';
import { CinematicMapMedia } from './CinematicMapMedia';

type Phase = 'map' | 'step' | 'finale';

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { finished: Promise<void> };
};

function StepMedia({ step }: { step: NineStepExperienceData }) {
  if (step.videoReady && step.videoSrc) {
    return (
      <video controls playsInline preload="none" poster={step.posterSrc ?? NINE_STEPS_MAP_POSTER}>
        <source src={step.videoSrc} type="video/mp4" />
      </video>
    );
  }
  return (
    <div className="v2-step-media__pending">
      <Image src={step.posterSrc ?? NINE_STEPS_MAP_POSTER} alt="Paisaje del recorrido de Los 9 Pasos" fill sizes="(max-width: 900px) 100vw, 56vw" className="object-cover" />
      <span aria-hidden="true" />
      <div><p>Video Google Flow</p><strong>Slot preparado</strong><small>Este paso mostrará su video individual cuando el asset oficial esté disponible.</small></div>
    </div>
  );
}

export function NineStepsExperience() {
  const [phase, setPhase] = useState<Phase>('map');
  const [activeIndex, setActiveIndex] = useState(0);
  const [guided, setGuided] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const transition = (update: () => void) => {
    const transitionDocument = document as ViewTransitionDocument;
    if (transitionDocument.startViewTransition) transitionDocument.startViewTransition(update);
    else update();
  };

  const openStep = (index: number, isGuided = guided) => {
    transition(() => {
      setActiveIndex(index);
      setGuided(isGuided);
      setPhase('step');
    });
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedStep = Number(params.get('step'));
    if (Number.isInteger(requestedStep) && requestedStep >= 1 && requestedStep <= 9) {
      openStep(requestedStep - 1, false);
    } else if (params.get('guided') === '1') {
      openStep(0, true);
    }
    // URL intent is read once on entry; subsequent navigation stays in the experience.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (phase !== 'step') return;
    window.requestAnimationFrame(() => titleRef.current?.focus({ preventScroll: true }));
  }, [activeIndex, phase]);

  useEffect(() => {
    // Each cinematic phase owns its viewport; do not inherit a scroll offset from
    // the longer step view when returning to the map or reaching the finale.
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [phase]);

  const step = NINE_STEPS_EXPERIENCE[activeIndex];

  if (phase === 'finale') {
    return (
      <section className="v2-nine-finale" data-v2-nav-theme="dark">
        <CinematicMapMedia eager />
        <div className="v2-nine-finale__content">
          <p className="v2-eyebrow">Después del Paso 09</p>
          <h1>Tu camino <em>continúa.</em></h1>
          <p>Los 9 Pasos son una base para continuar creciendo, sirviendo, viviendo en comunidad y caminando con Jesús.</p>
          <div className="v2-actions">
            <Link className="v2-button v2-button--light" href="/primera-visita">Visítanos <ArrowRight className="h-4 w-4" /></Link>
            <a className="v2-text-link v2-text-link--light" href="https://wa.me/524424112143?text=Hola%2C%20he%20recorrido%20Los%209%20Pasos%20y%20me%20gustar%C3%ADa%20hablar%20con%20un%20pastor." target="_blank" rel="noopener noreferrer"><MessageCircle className="h-4 w-4" /> Habla con un pastor</a>
            <button type="button" className="v2-text-link v2-text-link--light" onClick={() => transition(() => setPhase('map'))}>Volver al mapa</button>
          </div>
        </div>
      </section>
    );
  }

  if (phase === 'step') {
    return (
      <section className="v2-step-view" data-v2-nav-theme="dark">
        <div className="v2-step-view__ambient" aria-hidden="true" />
        <div className="v2-step-view__shell">
          <div className="v2-step-view__topline">
            <button type="button" onClick={() => transition(() => setPhase('map'))}><Compass className="h-4 w-4" /> Volver al mapa</button>
            <span>{guided ? 'Recorrido guiado' : 'Exploración libre'} · {step.number}/09</span>
          </div>

          <div className="v2-step-view__grid">
            <div className="v2-step-view__media"><StepMedia step={step} /></div>
            <article className="v2-step-view__content">
              <p className="v2-eyebrow">Paso {step.number}</p>
              <h1 ref={titleRef} tabIndex={-1}>{step.name}</h1>
              <p className="v2-step-view__subtitle">{step.subtitle}</p>
              <p>{step.description}</p>
              <blockquote><p>“{step.verseText}”</p><cite>{step.verseRef}</cite></blockquote>
              <a className="v2-button v2-button--light" href={`https://wa.me/524424112143?text=${encodeURIComponent(step.whatsappMessage)}`} target="_blank" rel="noopener noreferrer"><HeartHandshake className="h-4 w-4" /> {step.primaryCtaText}</a>
            </article>
          </div>

          <nav className="v2-step-view__selector" aria-label="Seleccionar un paso">
            {NINE_STEPS_EXPERIENCE.map((item, index) => <button key={item.id} type="button" aria-current={index === activeIndex ? 'step' : undefined} onClick={() => openStep(index, false)}><span>{item.number}</span><strong>{item.name}</strong></button>)}
          </nav>

          <div className="v2-step-view__controls">
            <button type="button" onClick={() => activeIndex === 0 ? transition(() => setPhase('map')) : openStep(activeIndex - 1)}><ArrowLeft className="h-4 w-4" /> {activeIndex === 0 ? 'Volver al mapa' : 'Paso anterior'}</button>
            <button type="button" onClick={() => activeIndex === 8 ? transition(() => setPhase('finale')) : openStep(activeIndex + 1)}>{activeIndex === 8 ? 'Completar recorrido' : 'Continuar al siguiente'} <ArrowRight className="h-4 w-4" /></button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="v2-nine-map" data-v2-nav-theme="dark">
      <CinematicMapMedia eager />
      <div className="v2-nine-map__overlay">
        <header>
          <p className="v2-eyebrow">Los 9 Pasos</p>
          <h1>Un camino para <em>crecer en Cristo.</em></h1>
          <p>Cada paso te ayudará a crecer más cerca de Jesús.</p>
          <div className="v2-actions"><button className="v2-button v2-button--light" type="button" onClick={() => openStep(0, true)}>Comenzar recorrido <ArrowRight className="h-4 w-4" /></button><span>o explora cualquier paso</span></div>
        </header>

        <div className="v2-nine-map__markers" aria-label="Mapa interactivo de Los 9 Pasos">
          {NINE_STEPS_EXPERIENCE.map((item, index) => (
            <button key={item.id} type="button" className="v2-nine-marker" style={{ left: `${NINE_STEP_MARKERS[index].left}%`, top: `${NINE_STEP_MARKERS[index].top}%` }} onClick={() => openStep(index, false)} aria-label={`Abrir Paso ${item.number}: ${item.name}`}>
              <span>{item.number}</span><strong>{item.name}</strong>
            </button>
          ))}
        </div>

        <nav className="v2-nine-map__mobile" aria-label="Exploración libre de los pasos">
          {NINE_STEPS_EXPERIENCE.map((item, index) => <button key={item.id} type="button" onClick={() => openStep(index, false)}><span>{item.number}</span>{item.name}</button>)}
        </nav>
      </div>
    </section>
  );
}
