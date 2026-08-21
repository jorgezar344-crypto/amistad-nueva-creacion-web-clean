'use client';

import React from 'react';
import Image from 'next/image';
import { Heart, Compass, Users, Sparkles, BookOpen } from '../icons/Icons';

export const OurChurchSection: React.FC = () => {
  const pillars = [
    {
      title: 'Amor y Aceptación Genuina',
      desc: 'En Cristo todos encontramos un nuevo comienzo y una familia espiritual donde caminar juntos.',
      icon: Heart,
    },
    {
      title: 'Enseñanza Bíblica Práctica',
      desc: 'Mensajes centrados en las Escrituras aplicables a los desafíos de la vida, el trabajo y el hogar.',
      icon: BookOpen,
    },
    {
      title: 'Grupos de Amistad en Hogares',
      desc: 'Comunidades cercanas en casas donde compartimos la vida, oramos unos por otros y crecemos.',
      icon: Users,
    },
  ];

  return (
    <section
      id="nuestra-iglesia"
      className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      aria-label="Nuestra iglesia y comunidad"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Story & Vision */}
        <div className="lg:col-span-6 text-left">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-electric block mb-2">
            Nuestra Identidad
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6">
            Una familia para crecer juntos en Cristo.
          </h2>
          <p className="text-base sm:text-lg text-brandText-secondary leading-relaxed mb-6 font-normal">
            En <strong>Amistad Nueva Creación Internacional</strong> estamos convencidos de que la fe no se camina en soledad. Somos una comunidad contemporánea en Querétaro comprometida con proclamar la gracia de Dios, restaurar vidas y edificar discípulos de Jesús.
          </p>
          <p className="text-sm sm:text-base text-brandText-secondary leading-relaxed mb-8">
            Aquí encontrarás amigos, familias y personas reales buscando amar a Dios y servir con alegría a nuestra ciudad.
          </p>

          <div className="space-y-4 mb-8">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl glass-panel-elevated p-4 sm:p-5 border border-cyan-electric/20 flex items-start gap-4 hover:border-cyan-electric/50 transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-xl bg-cyan-deep/40 border border-cyan-electric/30 flex items-center justify-center text-cyan-electric shrink-0 mt-0.5">
                    <Icon className="w-5 h-5 text-cyan-electric" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white mb-1">{pillar.title}</h3>
                    <p className="text-xs sm:text-sm text-brandText-secondary leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#reuniones"
              className="px-6 py-3 rounded-full text-xs sm:text-sm font-bold bg-cyan-core text-void hover:bg-cyan-electric transition-all"
            >
              Conocer nuestras reuniones
            </a>
            <a
              href="#los-9-pasos-preview"
              className="px-6 py-3 rounded-full text-xs sm:text-sm font-semibold glass-panel text-white hover:text-cyan-electric transition-all"
            >
              Ver los 9 pasos &rarr;
            </a>
          </div>
        </div>

        {/* Right Column: Dynamic Photo Mosaic (Community + Youth) */}
        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative aspect-[3/4] rounded-3xl overflow-hidden glass-panel border border-cyan-electric/20 shadow-cardGlow group">
            <Image
              src="/images/community-fellowship.jpg"
              alt="Comunidad y amigos en Amistad Nueva Creación"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-void via-void/20 to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4">
              <span className="text-xs font-bold text-cyan-electric block">Comunidad Viva</span>
              <span className="text-sm font-semibold text-white">Amistad y compañerismo</span>
            </div>
          </div>

          <div className="space-y-4 flex flex-col justify-between">
            <div className="relative aspect-video rounded-2xl overflow-hidden glass-panel border border-cyan-electric/20 shadow-cardGlow group">
              <Image
                src="/images/youth-gathering.jpg"
                alt="Jóvenes compartiendo fe y amistad"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-transparent"></div>
              <div className="absolute bottom-3 left-3 right-3">
                <span className="text-xs font-bold text-white">Jóvenes &bull; Pasión y Fe</span>
              </div>
            </div>

            <div className="relative aspect-video rounded-2xl overflow-hidden glass-panel border border-cyan-electric/20 shadow-cardGlow group">
              <Image
                src="/images/kids-church.jpg"
                alt="Niños en actividades didácticas"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-transparent"></div>
              <div className="absolute bottom-3 left-3 right-3">
                <span className="text-xs font-bold text-white">Familias & Niños</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
