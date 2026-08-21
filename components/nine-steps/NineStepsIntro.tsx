'use client';

import React from 'react';
import { Compass, Sparkles } from '../icons/Icons';

export const NineStepsIntro: React.FC = () => {
  return (
    <section
      id="los-9-pasos"
      className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12 text-center"
      aria-label="Introducción a los 9 Pasos"
    >
      {/* Chapter 1 Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel text-xs font-semibold text-cyan-electric mb-6 border border-cyan-electric/30 shadow-cyanGlow">
        <Compass className="w-3.5 h-3.5 text-cyan-electric" />
        <span>CAPÍTULO I: COMENZAR (PASOS 1 AL 3)</span>
      </div>

      {/* Main Section Heading */}
      <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
        LOS 9 PASOS
      </h2>

      {/* Primary Subtitle */}
      <p className="text-xl sm:text-2xl font-semibold text-gradient-cyan mb-3">
        Un camino para crecer en Cristo
      </p>

      {/* Secondary Guiding Phrase */}
      <p className="text-sm sm:text-base text-brandText-secondary max-w-xl mx-auto font-normal">
        Cada paso te ayudará a crecer más cerca de Jesús.
      </p>

      {/* Visual Down Connector Indicator */}
      <div className="mt-8 flex justify-center">
        <div className="w-0.5 h-12 bg-gradient-to-b from-cyan-electric to-transparent"></div>
      </div>
    </section>
  );
};
