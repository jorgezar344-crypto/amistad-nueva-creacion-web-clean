'use client';

import React from 'react';
import { Calendar, Clock, MapPin, Sparkles } from '../icons/Icons';

export const EventsSection: React.FC = () => {
  const events = [
    {
      dateBadge: { day: 'DOM', num: '24' },
      title: 'Servicio Dominical Especial de Bienvenida',
      time: '11:30 AM',
      location: 'Auditorio Principal',
      description: 'Una reunión dedicada a recibir a nuevas familias y celebrar la comunión en Cristo.',
    },
    {
      dateBadge: { day: 'JUE', num: '28' },
      title: 'Noche de Discipulado y Oración',
      time: '8:00 PM',
      location: 'Auditorio & Transmisión',
      description: 'Estudio bíblico para afianzar los fundamentos de nuestra fe y clamar por nuestra ciudad.',
    },
    {
      dateBadge: { day: 'PRÓX', num: 'SEP' },
      title: 'Próximo Encuentro de Restauración',
      time: 'Fin de semana',
      location: 'Fechas por confirmar',
      description: 'Un tiempo apartado para buscar a Dios de manera intencional y experimentar su sanidad.',
    },
  ];

  return (
    <section
      id="eventos"
      className="relative py-24 px-4 sm:px-6 lg:px-8 bg-surface/30 border-y border-cyan-electric/10"
      aria-label="Próximos eventos y actividades"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-electric block mb-2">
              Calendario & Vida de Iglesia
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Próximas Actividades
            </h2>
          </div>
          <p className="text-sm text-brandText-secondary max-w-md">
            Mantente conectado con lo que Dios está haciendo en nuestra congregación.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((evt, idx) => (
            <div
              key={idx}
              className="rounded-3xl glass-panel p-6 sm:p-8 border border-cyan-electric/15 hover:border-cyan-electric/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Date Header */}
                <div className="flex items-center gap-3.5 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-cyan-deep/40 border border-cyan-electric/30 flex flex-col items-center justify-center text-cyan-electric shadow-cyanGlow">
                    <span className="text-[10px] font-black tracking-widest uppercase">
                      {evt.dateBadge.day}
                    </span>
                    <span className="text-lg font-black leading-none">{evt.dateBadge.num}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-xs text-cyan-electric font-semibold">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{evt.time}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-brandText-muted">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{evt.location}</span>
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-2">{evt.title}</h3>
                <p className="text-sm text-brandText-secondary leading-relaxed mb-6">
                  {evt.description}
                </p>
              </div>

              <a
                href="#primera-visita"
                className="text-xs font-bold text-cyan-electric hover:text-white flex items-center gap-1 transition-colors"
              >
                <span>Más información</span>
                <span>&rarr;</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
