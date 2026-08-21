'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowDown, Sparkles, HeartHandshake } from '../icons/Icons';

interface HeroSectionProps {
  onOpenVisitModal: () => void;
  onOpenStepOneModal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenVisitModal,
  onOpenStepOneModal,
}) => {
  const scrollToSteps = (e: React.MouseEvent) => {
    e.preventDefault();
    const elem = document.getElementById('los-9-pasos');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="top"
      className="relative min-h-[92vh] sm:min-h-[95vh] flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 pt-28 pb-16 overflow-hidden pointer-events-auto"
      aria-label="Sección de bienvenida principal"
    >
      {/* Background ambient lighting vignette */}
      <div className="absolute inset-0 pointer-events-none -z-10 flex items-center justify-center">
        <div className="w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] rounded-full bg-cyan-electric/5 blur-[120px]"></div>
      </div>

      <div className="max-w-4xl mx-auto flex flex-col items-center z-10">
        {/* Subtle Welcome Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel text-xs sm:text-sm font-medium text-cyan-electric mb-8 shadow-cyanGlow border border-cyan-electric/25">
          <Sparkles className="w-4 h-4 text-cyan-electric" />
          <span>Bienvenido a casa</span>
        </div>

        {/* Hero Logo Emblem Display */}
        <div className="relative mb-6 group">
          <div className="absolute -inset-2 bg-gradient-to-r from-cyan-electric to-cyan-deep rounded-2xl blur-lg opacity-25 group-hover:opacity-40 transition duration-500"></div>
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-black/90 p-2 border border-cyan-electric/30 flex items-center justify-center shadow-cardGlow">
            <Image
              src="/brand/logo-oficial.jpg"
              alt="Logotipo Oficial Amistad Nueva Creación Internacional"
              width={144}
              height={144}
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Church Name Branding */}
        <h2 className="text-sm sm:text-base font-semibold tracking-widest uppercase text-cyan-electric mb-3">
          Amistad Nueva Creación Internacional
        </h2>

        {/* Master Base Copy Heading */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight sm:leading-none mb-6">
          Hay un nuevo comienzo{' '}
          <span className="text-gradient-cyan block sm:inline">
            para ti.
          </span>
        </h1>

        {/* Subtitle Message */}
        <p className="max-w-2xl text-base sm:text-xl text-brandText-secondary leading-relaxed mb-10 font-normal">
          Conoce a Jesús y descubre un camino para crecer en tu nueva vida y caminar en comunidad.
        </p>

        {/* Actions Button Group */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-14">
          <button
            onClick={onOpenVisitModal}
            className="w-full sm:w-auto px-8 py-4 rounded-full font-bold text-sm sm:text-base bg-cyan-electric text-void hover:bg-white hover:shadow-cyanGlowLg transition-all duration-300 transform active:scale-95 focus-visible:ring-2 focus-visible:ring-white flex items-center justify-center gap-2"
          >
            <HeartHandshake className="w-5 h-5 text-void" />
            <span>Quiero visitar la iglesia</span>
          </button>

          <a
            href="#los-9-pasos"
            onClick={scrollToSteps}
            className="w-full sm:w-auto px-8 py-4 rounded-full font-semibold text-sm sm:text-base glass-panel text-white hover:border-cyan-electric hover:text-cyan-electric transition-all duration-300 flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-cyan-electric"
          >
            <span>Conocer los 9 pasos</span>
            <ArrowDown className="w-4 h-4 text-cyan-electric animate-bounce" />
          </a>
        </div>

        {/* Scroll Indicator */}
        <div className="flex flex-col items-center gap-2 text-xs font-medium text-brandText-muted tracking-wider uppercase">
          <span>Desliza para recorrer el camino</span>
          <div className="w-5 h-8 rounded-full border border-cyan-electric/30 flex items-start justify-center p-1">
            <div className="w-1.5 h-2 bg-cyan-electric rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
