'use client';

import React from 'react';
import Image from 'next/image';
import { Calendar, Clock, MapPin, Sparkles } from '../icons/Icons';

export const ScheduleSection: React.FC = () => {
  const schedules = [
    {
      badge: 'DOMINGOS • 3 REUNIONES',
      time: '9:00 a.m. • 11:30 a.m. • 6:00 p.m.',
      times: [
        { label: '1ª Reunión', time: '9:00 a.m. – 11:00 a.m.' },
        { label: '2ª Reunión', time: '11:30 a.m. – 2:00 p.m.' },
        { label: '3ª Reunión', time: '6:00 p.m. – 8:00 p.m.' },
      ],
      name: 'Reuniones Dominicales de Adoración y Palabra',
      desc: 'Tres reuniones dominicales con alabanza en vivo, enseñanza bíblica y clases dinámicas para niños.',
      image: '/images/real-church-auditorium.png',
      highlight: true,
    },
    {
      badge: 'VIERNES',
      time: 'Horario por confirmar',
      name: 'Reunión de Oración',
      desc: 'Todos los viernes nos unimos para buscar a Dios e interceder juntos. El último viernes de cada mes celebramos Santa Cena (traer alimentos para compartir).',
      image: null,
      highlight: false,
    },
    {
      badge: 'ENTRE SEMANA',
      time: 'Horarios por zona',
      name: 'Grupos de Amistad en Hogares',
      desc: 'Reuniones en casas por diferentes sectores de Querétaro y Corregidora para convivir, orar y compartir una taza de café.',
      image: '/images/small-group-home.jpg',
      highlight: false,
    },
  ];

  return (
    <section
      id="reuniones"
      className="relative py-24 px-4 sm:px-6 lg:px-8 bg-surface/40 border-y border-cyan-electric/10"
      aria-label="Horarios de reuniones semanales"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-electric block mb-2">
            Reuniones y Servicios
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Nuestros Tiempos de Encuentro
          </h2>
          <p className="text-base text-brandText-secondary leading-relaxed">
            Te invitamos a ser parte de nuestras reuniones presenciales en Querétaro.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {schedules.map((item, idx) => (
            <div
              key={idx}
              className={`rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 group ${
                item.highlight
                  ? 'glass-panel-elevated border-2 border-cyan-electric/40 shadow-cardGlow'
                  : 'glass-panel border border-cyan-electric/15'
              }`}
            >
              {/* Card Photo Header if available */}
              {item.image && (
                <div className="relative aspect-video w-full overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-elevated via-surface-elevated/40 to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <span
                      className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                        item.highlight
                          ? 'bg-cyan-electric text-void shadow-cyanGlow'
                          : 'bg-void text-cyan-electric border border-cyan-electric/30'
                      }`}
                    >
                      {item.badge}
                    </span>
                  </div>
                </div>
              )}

              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                <div>
                  {!item.image && (
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-void text-cyan-electric border border-cyan-electric/30">
                        {item.badge}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs text-brandText-secondary font-medium">
                        <Clock className="w-3.5 h-3.5 text-cyan-electric" />
                        <span>{item.time}</span>
                      </div>
                    </div>
                  )}

                  {item.image && (
                    <div className="flex items-center gap-1.5 text-xs text-cyan-electric font-semibold mb-2">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{item.time}</span>
                    </div>
                  )}

                  <h3 className="text-xl font-bold text-white mb-3">{item.name}</h3>
                  <p className="text-sm text-brandText-secondary leading-relaxed mb-4">
                    {item.desc}
                  </p>

                  {item.times && (
                    <div className="space-y-1.5 mb-4 bg-void/60 p-3 rounded-2xl border border-white/5">
                      {item.times.map((t, tIdx) => (
                        <div key={tIdx} className="flex items-center justify-between text-xs">
                          <span className="font-bold text-cyan-electric">{t.label}:</span>
                          <span className="text-white font-medium">{t.time}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-brandText-muted">
                  <span>Presencial &bull; Querétaro</span>
                  <span className="text-cyan-electric font-medium">Entrada libre</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
