'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, MapPin, Sparkles, ArrowRight, CheckCircle2 } from '../icons/Icons';
import { getUpcomingEvents } from '../../data/eventsData';

export const EventsSection: React.FC = () => {
  // Uses real dynamic date in America/Mexico_City timezone
  const upcomingEvents = getUpcomingEvents(3);

  return (
    <section
      id="eventos"
      className="relative py-24 px-4 sm:px-6 lg:px-8 bg-surface/30 border-y border-cyan-electric/10"
      aria-label="Próximos eventos y actividades de la iglesia"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel text-[11px] font-bold text-cyan-electric mb-3 border border-cyan-electric/30">
              <Calendar className="w-3.5 h-3.5" />
              <span>Vida de Iglesia &bull; Comunidad</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Próximos Eventos
            </h2>
            <p className="text-sm sm:text-base text-cyan-electric/90 font-medium mt-1">
              Hay momentos que vivimos mejor juntos.
            </p>
          </div>

          <Link
            href="/calendario"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-panel font-bold text-xs sm:text-sm text-cyan-electric hover:text-white hover:border-cyan-electric transition-all shadow-cyanGlow self-start md:self-auto"
          >
            <span>Ver calendario completo</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Dynamic 3 Upcoming Event Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {upcomingEvents.map((evt) => (
            <article
              key={evt.id}
              className="rounded-3xl glass-panel-elevated overflow-hidden border border-cyan-electric/15 hover:border-cyan-electric/50 transition-all duration-300 flex flex-col justify-between group shadow-cardGlow hover:-translate-y-1"
            >
              {/* Optional Top Image */}
              {evt.image && (
                <div className="relative h-44 w-full overflow-hidden bg-void/60">
                  <Image
                    src={evt.image}
                    alt={evt.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/30 to-transparent"></div>
                  
                  {/* Category Pill on Image */}
                  <span className="absolute top-3 right-3 text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-void/80 text-cyan-electric border border-cyan-electric/40 backdrop-blur-md">
                    {evt.category}
                  </span>
                </div>
              )}

              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                <div>
                  {/* Date & Time Header */}
                  <div className="flex items-center gap-3.5 mb-5">
                    <div className="w-14 h-14 rounded-2xl bg-cyan-deep/40 border border-cyan-electric/40 flex flex-col items-center justify-center text-cyan-electric shadow-cyanGlow shrink-0">
                      <span className="text-[10px] font-black tracking-widest uppercase">
                        {evt.monthBadge}
                      </span>
                      <span className="text-lg font-black leading-none">{evt.dayBadge}</span>
                    </div>

                    <div>
                      {evt.time && (
                        <div className="flex items-center gap-1.5 text-xs text-cyan-electric font-bold">
                          <Clock className="w-3.5 h-3.5 shrink-0" />
                          <span>{evt.time}</span>
                        </div>
                      )}
                      <div className="text-xs text-slate-300 font-medium mt-0.5">
                        {evt.dateDisplay}
                      </div>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-3 group-hover:text-cyan-electric transition-colors">
                    {evt.title}
                  </h3>

                  {/* Guest Speaker */}
                  {evt.guest && (
                    <div className="text-[11px] font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg mb-3 inline-block">
                      {evt.guest}
                    </div>
                  )}

                  {/* Details List */}
                  {evt.details && evt.details.length > 0 && (
                    <ul className="space-y-1 mb-4">
                      {evt.details.map((d, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-xs text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-electric shrink-0 mt-0.5" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between mt-4">
                  <a
                    href="#ubicacion"
                    className="text-xs font-bold text-slate-300 hover:text-cyan-electric flex items-center gap-1 transition-colors"
                  >
                    <span>Cómo llegar</span>
                    <MapPin className="w-3 h-3 text-cyan-electric" />
                  </a>

                  <Link
                    href="/calendario"
                    className="text-xs font-bold text-cyan-electric hover:underline flex items-center gap-1"
                  >
                    <span>Ver detalles</span>
                    <span>&rarr;</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="rounded-2xl glass-panel p-5 text-center border border-cyan-electric/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <span className="text-xs font-bold text-white block">
              Consulta todas las actividades y reuniones de nuestra congregación
            </span>
            <span className="text-[11px] text-brandText-muted">
              Santa Cena mensual, Aniversario, Encuentros, Capacitación y Congreso anual.
            </span>
          </div>

          <Link
            href="/calendario"
            className="px-6 py-2.5 rounded-full text-xs font-extrabold bg-cyan-electric text-void hover:bg-white transition-all shadow-cyanGlow shrink-0"
          >
            Explorar Calendario de la Iglesia
          </Link>
        </div>
      </div>
    </section>
  );
};


