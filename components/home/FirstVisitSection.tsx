'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRight, Sparkles, MessageCircle } from '../icons/Icons';

interface FirstVisitSectionProps {
  onOpenVisitModal: () => void;
}

export const FirstVisitSection: React.FC<FirstVisitSectionProps> = ({ onOpenVisitModal }) => {
  const triptychItems = [
    {
      num: '01',
      title: 'Conoce',
      desc: 'Descubre quiénes somos, nuestras creencias y lo que Dios está haciendo en nuestra comunidad.',
      linkText: 'Más sobre nosotros',
      linkHref: '#nuestra-iglesia',
      image: '/images/native-assets/B1_FACHADA_QUERETARO_NATIVE.jpg',
      alt: 'Fachada y arquitectura de Amistad Nueva Creación en Querétaro',
    },
    {
      num: '02',
      title: 'Crece',
      desc: 'Encuentra recursos, atención para tus hijos y enseñanzas que te ayudarán a fortalecer tu relación con Dios.',
      linkText: 'Explorar recursos',
      linkHref: '#los-9-pasos-preview',
      image: '/images/prayer-moment.jpg',
      alt: 'Enseñanza bíblica y crecimiento espiritual',
    },
    {
      num: '03',
      title: 'Conecta',
      desc: 'Grupos, ministerios y próximos pasos para vivir tu fe en comunidad y hacer la diferencia.',
      linkText: 'Ver grupos y ministerios',
      linkHref: '#reuniones',
      image: '/images/youth-gathering.jpg',
      alt: 'Compañerismo y grupos en Amistad Nueva Creación',
    },
  ];

  return (
    <section
      id="primera-visita"
      className="relative w-full overflow-hidden"
      aria-label="Información para la primera visita"
    >
      {/* ========================================================== */}
      {/* 1. EDITORIAL LIGHT CANVAS: "BIENVENIDOS A CASA" */}
      {/* ========================================================== */}
      <div className="relative bg-[#F8F9FA] text-slate-900 py-16 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-12 border-t border-slate-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left Column: Editorial Serif Copy & Primary Actions */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Tag / Category Badge */}
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <span className="text-[11px] sm:text-xs font-black uppercase tracking-[0.25em] text-cyan-600">
                Bienvenidos a Casa
              </span>
            </div>

            {/* Main Editorial Headline in Serif */}
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-[3.25rem] font-normal text-slate-900 tracking-tight leading-[1.18] mb-6">
              Un lugar para conocer a Jesús, crecer en tu fe y caminar en una familia espiritual que te recibe con los brazos abiertos.
            </h2>

            {/* Explanatory Body Copy */}
            <p className="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed max-w-2xl mb-8 sm:mb-10 font-normal">
              Amistad Nueva Creación Internacional es una iglesia cristiana que cree en el poder transformador del Evangelio y en el propósito de Dios para cada persona.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6 w-full sm:w-auto">
              <button
                onClick={onOpenVisitModal}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#0B0F17] hover:bg-slate-800 text-white font-bold text-sm sm:text-base transition-all duration-300 shadow-lg active:scale-95 group"
              >
                <span>Planea tu visita</span>
                <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="#nuestra-iglesia"
                className="inline-flex items-center justify-center text-sm sm:text-base font-semibold text-slate-700 hover:text-slate-900 transition-colors py-2 px-1 underline-offset-4 hover:underline"
              >
                Conoce más sobre nosotros
              </a>
            </div>
          </div>

          {/* Right Column: Warm Human Fellowship Photography */}
          <div className="lg:col-span-5 relative w-full aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src="/images/community-fellowship.jpg"
              alt="Abrazo cálido y bienvenida genuina en Amistad Nueva Creación Internacional"
              fill
              className="object-cover object-[center_30%]"
              priority
            />
            {/* Subtle Inner Border and Light Gradient */}
            <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-3xl" />
          </div>
        </div>
      </div>

      {/* ========================================================== */}
      {/* 2. CINEMATIC DARK TRIPTYCH: "01 CONOCE • 02 CRECE • 03 CONECTA" */}
      {/* ========================================================== */}
      <div className="relative bg-[#06090E] border-t border-b border-cyan-electric/15">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
          {triptychItems.map((item, idx) => (
            <div
              key={idx}
              className="relative min-h-[380px] sm:min-h-[420px] p-8 sm:p-10 lg:p-12 flex flex-col justify-between overflow-hidden group transition-all duration-500"
            >
              {/* Background Atmospheric Photography */}
              <div className="absolute inset-0 -z-10">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  className="object-cover opacity-20 group-hover:opacity-30 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#06090E] via-[#06090E]/85 to-[#06090E]/70" />
              </div>

              {/* Top: Amber Number & Serif Title */}
              <div>
                <span className="font-serif text-2xl sm:text-3xl text-amber-400/90 font-normal block mb-2 tracking-wider">
                  {item.num}
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl text-white font-normal tracking-tight mb-4 group-hover:text-cyan-electric transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>

              {/* Bottom: Interactive Link with Cyan Line */}
              <div className="pt-8">
                <a
                  href={item.linkHref}
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-200 group-hover:text-cyan-electric transition-colors"
                >
                  <span>{item.linkText}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-electric group-hover:translate-x-1 transition-transform" />
                </a>
                <div className="w-12 h-0.5 bg-cyan-electric/40 group-hover:w-full group-hover:bg-cyan-electric transition-all duration-500 mt-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
