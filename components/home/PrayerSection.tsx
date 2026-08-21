'use client';

import React from 'react';
import Image from 'next/image';
import { Heart, MessageCircle, Sparkles } from '../icons/Icons';

export const PrayerSection: React.FC = () => {
  return (
    <section
      id="oracion"
      className="relative py-28 px-4 sm:px-6 lg:px-8 overflow-hidden bg-surface/60 border-y border-cyan-electric/10"
      aria-label="Petición de oración y apoyo pastoral"
    >
      {/* Background Soft Atmospheric Prayer Image */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <Image
          src="/images/prayer-moment.jpg"
          alt="Momento de oración y fe"
          fill
          className="object-cover object-center opacity-15"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-void via-void/90 to-void"></div>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-cyan-deep/40 border border-cyan-electric/30 flex items-center justify-center text-cyan-electric mx-auto mb-6 shadow-cyanGlow">
          <Heart className="w-7 h-7 text-cyan-electric" />
        </div>

        <span className="text-xs font-bold uppercase tracking-widest text-cyan-electric block mb-2">
          Atención y Cuidado Pastoral
        </span>

        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          ¿Podemos orar por ti?
        </h2>

        <p className="text-base sm:text-lg text-brandText-secondary max-w-2xl mx-auto leading-relaxed mb-8 font-normal">
          No tienes que caminar tus cargas en soledad. En momentos de alegría o dificultad, nuestro equipo pastoral y líderes de oración están listos para interceder por tu vida y tu familia.
        </p>

        <a
          href="https://wa.me/524424112143?text=Hola%20pastor%2C%20me%20gustar%C3%ADa%20solicitar%20apoyo%20en%20oraci%C3%B3n%20para%20una%20necesidad%20personal%2Ffamiliar."
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-sm sm:text-base bg-cyan-electric text-void hover:bg-white hover:shadow-cyanGlowLg transition-all"
        >
          <MessageCircle className="w-5 h-5 text-void" />
          <span>Enviar petición de oración por WhatsApp</span>
        </a>
      </div>
    </section>
  );
};
