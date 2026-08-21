'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, Sparkles, ArrowRight } from '../icons/Icons';

export const NineStepsCtaSection: React.FC = () => {
  return (
    <section
      id="los-9-pasos-preview"
      className="relative py-28 px-4 sm:px-6 lg:px-8 overflow-hidden"
      aria-label="Invitación a la experiencia de Los 9 Pasos"
    >
      {/* Background Luminous Aura & Vignette */}
      <div className="absolute inset-0 pointer-events-none -z-10 flex items-center justify-center">
        <div className="w-[700px] sm:w-[1000px] h-[500px] rounded-full bg-gradient-to-r from-cyan-electric/15 via-cyan-deep/20 to-transparent blur-[120px]"></div>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="relative rounded-[32px] p-1 bg-gradient-to-r from-cyan-electric/50 via-cyan-core/30 to-cyan-deep/40 shadow-cyanGlowLg">
          <div className="relative rounded-[30px] bg-void/95 backdrop-blur-2xl p-8 sm:p-14 text-center overflow-hidden border border-cyan-electric/30">
            {/* Ambient Graphic Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-electric/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel text-xs font-bold uppercase tracking-widest text-cyan-electric mb-6 border border-cyan-electric/40 shadow-cyanGlow">
              <Compass className="w-4 h-4 text-cyan-electric" />
              <span>Experiencia Narrativa 3D</span>
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
              ¿Quieres conocer los 9 Pasos?
            </h2>

            {/* Subtitle */}
            <p className="text-xl sm:text-2xl font-bold text-gradient-cyan mb-4">
              Descubre un camino para crecer en Cristo.
            </p>

            {/* Guiding text */}
            <p className="text-base sm:text-lg text-brandText-secondary max-w-2xl mx-auto leading-relaxed mb-10">
              Cada paso te ayudará a crecer más cerca de Jesús. Recorre el sendero tridimensional de luz y conoce las etapas de discipulado y vida en comunidad.
            </p>

            {/* 3 Step Chapters Micro-Preview Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-10 text-xs font-semibold">
              <div className="glass-panel p-3 rounded-xl border border-cyan-electric/20 text-brandText-secondary">
                <span className="text-cyan-electric block font-bold">Capítulo I</span>
                <span>COMENZAR (Pasos 1 al 3)</span>
              </div>
              <div className="glass-panel p-3 rounded-xl border border-cyan-electric/20 text-brandText-secondary">
                <span className="text-cyan-electric block font-bold">Capítulo II</span>
                <span>CRECER (Pasos 4 al 6)</span>
              </div>
              <div className="glass-panel p-3 rounded-xl border border-cyan-electric/20 text-brandText-secondary">
                <span className="text-cyan-electric block font-bold">Capítulo III</span>
                <span>VIVIR Y SERVIR (Pasos 7 al 9)</span>
              </div>
            </div>

            {/* Master CTA Button */}
            <Link
              href="/9-pasos"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-full font-extrabold text-base sm:text-lg bg-gradient-to-r from-cyan-core to-cyan-electric text-void hover:shadow-cyanGlowLg hover:scale-105 active:scale-95 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-white"
            >
              <span>Entrar a la experiencia</span>
              <ArrowRight className="w-5 h-5 text-void" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
