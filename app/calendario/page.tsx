'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  MessageCircle,
  CheckCircle2,
} from '../../components/icons/Icons';
import {
  getEventsGroupedByMonth,
  EventItem,
} from '../../data/eventsData';
import { VisitCoordinationModal } from '../../components/home/VisitCoordinationModal';

export default function ChurchCalendarPage() {
  const [selectedMonth, setSelectedMonth] = useState<string>('TODOS');
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);

  // Grouped active/upcoming events dynamically in America/Mexico_City
  const groupedMonths = getEventsGroupedByMonth();

  // Dynamic month tabs list from available active months (no empty tabs)
  const availableMonths = ['TODOS', ...groupedMonths.map((g) => g.monthName)];

  const filteredGroupedMonths =
    selectedMonth === 'TODOS'
      ? groupedMonths
      : groupedMonths.filter((g) => g.monthName.toLowerCase() === selectedMonth.toLowerCase());

  return (
    <main className="min-h-screen bg-void text-brandText-primary selection:bg-cyan-electric/30">
      {/* Header Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-panel-elevated py-3 border-b border-cyan-electric/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-cyan-electric hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-cyan-electric rounded-lg px-2 py-1"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-electric" />
            <span>Volver a la iglesia</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2.5 group"
              aria-label="Amistad Nueva Creación — Inicio"
            >
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-cyan-electric/40 bg-black flex items-center justify-center shadow-cyanGlow">
                <Image
                  src="/brand/logo-oficial.jpg"
                  alt="Logo Oficial"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <span className="text-xs sm:text-sm font-extrabold text-white hidden md:inline group-hover:text-cyan-electric transition-colors">
                Amistad Nueva Creación
              </span>
            </Link>
          </div>

          <button
            onClick={() => setIsVisitModalOpen(true)}
            className="px-4 py-1.5 rounded-full text-xs font-bold bg-cyan-electric text-void hover:bg-white transition-all shadow-cyanGlow"
          >
            Planea tu visita
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-10 px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel text-xs font-bold text-cyan-electric mb-4 shadow-cyanGlow border border-cyan-electric/30">
          <Calendar className="w-4 h-4 text-cyan-electric" />
          <span>Actividades Oficiales 2026</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-4">
          Calendario de la Iglesia
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Conoce nuestras próximas reuniones, encuentros y actividades especiales.
        </p>
      </section>

      {/* Month Selector Tabs (Only active months with upcoming events) */}
      {availableMonths.length > 1 && (
        <section className="sticky top-[57px] z-40 bg-void/90 backdrop-blur-lg py-3 border-y border-white/10 px-4">
          <div className="max-w-5xl mx-auto flex items-center justify-start sm:justify-center gap-2 overflow-x-auto no-scrollbar py-1">
            {availableMonths.map((month) => {
              const isSelected = selectedMonth === month;
              return (
                <button
                  key={month}
                  onClick={() => setSelectedMonth(month)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                    isSelected
                      ? 'bg-cyan-electric text-void shadow-cyanGlow scale-105'
                      : 'glass-panel text-slate-300 hover:text-white hover:border-cyan-electric/40'
                  }`}
                  aria-pressed={isSelected}
                >
                  {month}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Events Grouped by Month */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {filteredGroupedMonths.length === 0 ? (
          <div className="text-center py-16 glass-panel rounded-3xl p-8 border border-white/10">
            <Calendar className="w-12 h-12 text-cyan-electric mx-auto mb-4 opacity-80" />
            <h3 className="text-xl font-bold text-white mb-2">No hay eventos próximos registrados</h3>
            <p className="text-sm text-slate-400">Consulta más adelante para nuevas fechas confirmadas.</p>
          </div>
        ) : (
          filteredGroupedMonths.map((group) => (
            <div key={`${group.monthName}-${group.year}`} className="space-y-6">
              {/* Month Header Banner */}
              <div className="flex items-center gap-3 pb-3 border-b border-cyan-electric/20">
                <span className="w-3 h-3 rounded-full bg-cyan-electric shadow-cyanGlow"></span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight uppercase">
                  {group.monthName} <span className="text-cyan-electric font-light">{group.year}</span>
                </h2>
                <span className="text-xs text-brandText-muted ml-auto font-semibold">
                  {group.events.length} {group.events.length === 1 ? 'evento' : 'eventos'}
                </span>
              </div>

              {/* Event Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {group.events.map((evt) => (
                  <article
                    key={evt.id}
                    className={`rounded-3xl glass-panel-elevated overflow-hidden border transition-all duration-300 flex flex-col justify-between group shadow-cardGlow ${
                      evt.featured
                        ? 'border-cyan-electric/40 hover:border-cyan-electric/80'
                        : 'border-white/10 hover:border-cyan-electric/40'
                    }`}
                  >
                    {/* Optional Image */}
                    {evt.image && (
                      <div className="relative h-44 w-full overflow-hidden bg-void/60">
                        <Image
                          src={evt.image}
                          alt={evt.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent"></div>
                        
                        <span className="absolute top-3 right-3 text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-void/80 text-cyan-electric border border-cyan-electric/40 backdrop-blur-md">
                          {evt.category}
                        </span>
                      </div>
                    )}

                    <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Date Badge & Time */}
                        <div className="flex items-center gap-4 mb-5">
                          <div className="w-16 h-16 rounded-2xl bg-cyan-deep/40 border border-cyan-electric/40 flex flex-col items-center justify-center text-cyan-electric shadow-cyanGlow shrink-0">
                            <span className="text-[11px] font-black tracking-widest uppercase">
                              {evt.monthBadge}
                            </span>
                            <span className="text-xl font-black leading-none">{evt.dayBadge}</span>
                          </div>

                          <div>
                            {evt.time && (
                              <div className="flex items-center gap-1.5 text-xs text-cyan-electric font-bold">
                                <Clock className="w-3.5 h-3.5 shrink-0" />
                                <span>{evt.time}</span>
                              </div>
                            )}
                            <div className="text-xs text-slate-300 font-semibold mt-1">
                              {evt.dateDisplay}
                            </div>
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-extrabold text-white mb-3 group-hover:text-cyan-electric transition-colors">
                          {evt.title}
                        </h3>

                        {/* Guest Speaker Badge */}
                        {evt.guest && (
                          <div className="mb-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>{evt.guest}</span>
                          </div>
                        )}

                        {/* Multi-Schedule List if present */}
                        {evt.timeSchedule && evt.timeSchedule.length > 0 && (
                          <div className="rounded-2xl bg-void/80 border border-white/10 p-3.5 mb-4 space-y-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-electric block mb-1">
                              Horarios por día:
                            </span>
                            {evt.timeSchedule.map((s, idx) => (
                              <div key={idx} className="flex items-center justify-between text-xs text-slate-300">
                                <span>{s.label}:</span>
                                <span className="font-semibold text-white">{s.time}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Details list */}
                        {evt.details && evt.details.length > 0 && (
                          <ul className="rounded-2xl bg-surface/70 border border-white/5 p-3.5 mb-4 space-y-1.5">
                            {evt.details.map((d, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-electric shrink-0 mt-0.5" />
                                <span>{d}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      {/* Card Footer Actions */}
                      <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 mt-4">
                        <a
                          href="https://maps.app.goo.gl/uX3LgMh5v7x"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-slate-300 hover:text-cyan-electric flex items-center gap-1.5 transition-colors"
                        >
                          <MapPin className="w-3.5 h-3.5 text-cyan-electric" />
                          <span>Cómo llegar</span>
                        </a>

                        <a
                          href={`https://wa.me/524424112143?text=${encodeURIComponent(
                            `Hola, me gustaría recibir información sobre ${evt.title} del ${evt.dateDisplay}.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-1.5 rounded-full glass-panel text-xs font-bold text-cyan-electric hover:text-white hover:border-cyan-electric transition-all flex items-center gap-1.5"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Preguntar por WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))
        )}
      </section>

      {/* Footer Navigation */}
      <footer className="border-t border-cyan-electric/15 py-12 bg-surface/20 text-center text-xs text-brandText-muted">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-bold text-cyan-electric hover:underline text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a la página principal</span>
          </Link>

          <p className="text-slate-400">
            Amistad Nueva Creación Internacional &bull; Querétaro, México
          </p>

          <Link
            href="/9-pasos"
            className="font-bold text-slate-300 hover:text-cyan-electric transition-colors"
          >
            Descubrir Los 9 Pasos &rarr;
          </Link>
        </div>
      </footer>

      {/* Visit Coordination Modal */}
      <VisitCoordinationModal
        isOpen={isVisitModalOpen}
        onClose={() => setIsVisitModalOpen(false)}
      />
    </main>
  );
}


