'use client';

import React from 'react';
import Image from 'next/image';
import { HeartHandshake, Play, MapPin } from '../icons/Icons';

interface HomeHeroProps {
  onOpenVisitModal: () => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({ onOpenVisitModal }) => {
  return (
    <section
      id="inicio"
      className="relative min-h-[92vh] flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 pt-32 pb-24 overflow-hidden"
      aria-label="Bienvenida a Amistad Nueva Creación Internacional"
    >
      {/* Background Photography: Real Church Auditorium & Worship */}
      <div className="absolute inset-0 -z-20 overflow-hidden">
        <Image
          src="/images/real-church-auditorium.png"
          alt="Auditorio real y alabanza en vivo en Amistad Nueva Creación Internacional"
          fill
          className="object-cover object-[center_40%] scale-100 opacity-65 transition-all duration-700"
          priority
        />
        {/* Balanced Vignette Gradients for Impeccable Text Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/75 to-void/45"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-void/85 via-transparent to-void/85"></div>
      </div>

      {/* Atmospheric Soft Light Accent */}
      <div className="absolute inset-0 pointer-events-none -z-10 flex items-center justify-center">
        <div className="w-[600px] sm:w-[900px] h-[550px] rounded-full bg-gradient-to-b from-cyan-electric/15 to-transparent blur-[140px]"></div>
      </div>

      <div className="max-w-4xl mx-auto flex flex-col items-center z-10">
        {/* Location Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel text-xs sm:text-sm font-semibold text-cyan-electric mb-8 shadow-cyanGlow border border-cyan-electric/30">
          <MapPin className="w-4 h-4 text-cyan-electric" />
          <span>Querétaro &bull; Amanecer Balvanera, Lourdes</span>
        </div>

        {/* Master Logo Presentation */}
        <div className="relative mb-8 group">
          <div className="absolute -inset-3 bg-gradient-to-r from-cyan-electric to-cyan-deep rounded-3xl blur-xl opacity-40 group-hover:opacity-70 transition duration-700"></div>
          <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-3xl bg-black p-3 border border-cyan-electric/40 flex items-center justify-center shadow-cardGlow">
            <Image
              src="/brand/logo-oficial.jpg"
              alt="Logo Oficial Amistad Nueva Creación Internacional"
              width={150}
              height={150}
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Sub-Brand Heading */}
        <h2 className="text-xs sm:text-sm font-bold tracking-[0.25em] uppercase text-cyan-electric mb-3 drop-shadow-sm">
          Amistad Nueva Creación Internacional
        </h2>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.15] mb-6 drop-shadow-md">
          Hay un nuevo comienzo{' '}
          <span className="text-gradient-cyan block sm:inline">
            para ti.
          </span>
        </h1>

        {/* Pastoral Subtitle */}
        <p className="max-w-2xl text-base sm:text-xl text-slate-200 leading-relaxed mb-10 font-normal drop-shadow-sm">
          Un lugar para conocer a Jesús, crecer en tu fe y caminar en una familia espiritual que te recibe con los brazos abiertos.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-12">
          <button
            onClick={onOpenVisitModal}
            className="w-full sm:w-auto px-8 py-4 rounded-full font-bold text-sm sm:text-base bg-cyan-electric text-void hover:bg-white hover:shadow-cyanGlowLg transition-all duration-300 transform active:scale-95 focus-visible:ring-2 focus-visible:ring-white flex items-center justify-center gap-2"
          >
            <HeartHandshake className="w-5 h-5 text-void" />
            <span>Quiero visitar la iglesia</span>
          </button>

          <a
            href="#nuestra-iglesia"
            className="w-full sm:w-auto px-8 py-4 rounded-full font-semibold text-sm sm:text-base glass-panel text-white hover:border-cyan-electric hover:text-cyan-electric transition-all duration-300 flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-cyan-electric"
          >
            <span>Conócenos</span>
          </a>
        </div>

        {/* Discrete Sermon Link */}
        <a
          href="#mensajes"
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-slate-300 hover:text-cyan-electric transition-colors bg-void/60 px-4 py-2 rounded-full border border-white/10 backdrop-blur-sm"
        >
          <Play className="w-3.5 h-3.5 text-cyan-electric" />
          <span>Ver el mensaje de esta semana &rarr;</span>
        </a>
      </div>
    </section>
  );
};
