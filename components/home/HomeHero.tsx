'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { HeartHandshake, Play, MapPin, Sparkles } from '../icons/Icons';

// Dynamic progressive enhancement for Full-Hero Three.js Canvas without blocking LCP
const FullHeroHeartScene = dynamic(
  () => import('../3d/FullHeroHeartScene').then((mod) => mod.FullHeroHeartScene),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 flex items-center justify-end pr-32 pointer-events-none">
        <div className="w-64 h-64 rounded-full bg-cyan-electric/5 animate-pulse filter blur-2xl"></div>
      </div>
    ),
  }
);

interface HomeHeroProps {
  onOpenVisitModal: () => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({ onOpenVisitModal }) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY || 0);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollOpacity = Math.max(0, 1 - scrollY / 420);
  const scrollTranslateY = -Math.min(scrollY * 0.15, 60);

  return (
    <section
      id="inicio"
      className="relative min-h-[100svh] min-h-[100dvh] lg:min-h-[94vh] flex items-center justify-center px-4 sm:px-6 lg:px-12 pt-20 sm:pt-28 pb-12 sm:pb-20 overflow-hidden bg-void"
      aria-label="Bienvenida a Amistad Nueva Creación Internacional"
    >
      {/* 1. FULL-BLEED REAL CHURCH AUDITORIUM PHOTOGRAPHY (100% Width x 100% Height) */}
      <div className="absolute inset-0 -z-30 overflow-hidden">
        <Image
          src="/images/real-church-auditorium.png"
          alt="Auditorio real y alabanza en vivo en Amistad Nueva Creación Internacional"
          fill
          className="object-cover object-[center_38%] sm:object-[center_42%] opacity-80 scale-100 transition-transform duration-1000"
          priority
        />
        {/* Mobile Vertical Gradient Vignette: Crisp Top Text -> Visible Mid Stage/Heart -> Smooth Bottom Fade */}
        <div className="absolute inset-0 bg-gradient-to-b from-void/90 via-void/45 to-void/90 lg:hidden"></div>
        {/* Mobile Central Focal Contrast Pocket (Behind Enveloping Text) */}
        <div className="absolute top-[28%] left-1/2 -translate-x-1/2 w-[340px] sm:w-[420px] h-[340px] sm:h-[420px] bg-void/50 rounded-full blur-[80px] pointer-events-none lg:hidden"></div>
        {/* Desktop Filmic Directional Gradient: 85% Dark on Left -> 35-50% in Center -> Transparent on Right */}
        <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-void via-void/75 to-transparent"></div>
        <div className="hidden lg:block absolute inset-0 bg-gradient-to-t from-void via-transparent to-void/50"></div>
        {/* Amber Stage Warmth Accent + Subtle Cyan Ambient Spill */}
        <div className="absolute top-1/4 left-1/3 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute top-1/3 right-1/4 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-cyan-electric/15 rounded-full blur-[160px] pointer-events-none"></div>
      </div>

      {/* 2. FULL-HERO THREE.JS CANVAS (Full Screen Particle Field + V3.1 Heart Nucleus) */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none z-10 transition-opacity duration-300"
        style={{
          opacity: scrollOpacity,
          transform: `translateY(${scrollTranslateY}px)`,
        }}
      >
        <FullHeroHeartScene
          enableMouseInteraction={true}
          simulatedState="auto"
        />
      </div>

      {/* 3. EDITORIAL COPY & CTAs (Completely Static Texts & Full Interactivity) */}
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center z-20 pointer-events-none">
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left pt-2 lg:pt-0 pointer-events-auto">
          {/* Location Badge */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full glass-panel text-[11px] sm:text-sm font-semibold text-cyan-electric mb-4 sm:mb-6 shadow-cyanGlow border border-cyan-electric/30">
            <MapPin className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-cyan-electric shrink-0" />
            <span>Querétaro &bull; Amanecer Balvanera, Lourdes</span>
          </div>

          {/* Sub-Brand Heading */}
          <div className="flex items-center gap-2 mb-2.5 sm:mb-4">
            <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-cyan-electric" />
            <h2 className="text-[10px] sm:text-xs font-bold tracking-[0.2em] sm:tracking-[0.25em] uppercase text-cyan-electric drop-shadow-sm">
              Amistad Nueva Creación Internacional
            </h2>
          </div>

          {/* Main Headline: 3-Line Poetic Breakdown */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.06] mb-4 sm:mb-6 drop-shadow-lg">
            Hay un nuevo<br />
            <span className="text-gradient-cyan">comienzo</span><br />
            para ti.
          </h1>

          {/* Pastoral Subtitle */}
          <p className="max-w-lg text-sm sm:text-lg md:text-xl text-slate-200 leading-relaxed mb-6 sm:mb-8 font-normal drop-shadow-md">
            Un lugar para conocer a Jesús, crecer en tu fe y caminar en una familia espiritual que te recibe con los brazos abiertos.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto mb-6 sm:mb-8">
            <button
              onClick={onOpenVisitModal}
              className="w-full sm:w-auto px-7 sm:px-8 py-3.5 sm:py-4 rounded-full font-extrabold text-sm sm:text-base bg-cyan-electric text-void hover:bg-white hover:shadow-cyanGlowLg transition-all duration-300 transform active:scale-95 focus-visible:ring-2 focus-visible:ring-white flex items-center justify-center gap-2 shadow-cyanGlow"
            >
              <HeartHandshake className="w-4 sm:w-5 h-4 sm:h-5 text-void" />
              <span>Planea tu visita</span>
            </button>

            <a
              href="#nuestra-iglesia"
              className="w-full sm:w-auto px-7 sm:px-8 py-3.5 sm:py-4 rounded-full font-bold text-sm sm:text-base glass-panel text-white hover:border-cyan-electric hover:text-cyan-electric transition-all duration-300 flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-cyan-electric"
            >
              <span>Conócenos</span>
            </a>
          </div>

          {/* Discrete Weekly Sermon Link */}
          <a
            href="#mensajes"
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-slate-300 hover:text-cyan-electric transition-colors bg-void/80 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/10 backdrop-blur-sm shadow-sm"
          >
            <Play className="w-3.5 h-3.5 text-cyan-electric" />
            <span>Ver el mensaje de esta semana &rarr;</span>
          </a>
        </div>

        {/* Right Column is clear breathing space for the 3D heart & church background */}
        <div className="lg:col-span-5 hidden lg:block h-[500px]"></div>
      </div>
    </section>
  );
};

