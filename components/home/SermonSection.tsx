'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Play, Headphones, Youtube, Sparkles } from '../icons/Icons';

export const SermonSection: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section
      id="mensajes"
      className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      aria-label="Mensajes y predicaciones recientes"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-electric block mb-2">
              Mensajes & Prédicas
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Mensaje de esta Semana
            </h2>
          </div>
          <p className="text-sm text-brandText-secondary max-w-md">
            Escucha y reflexiona en la Palabra de Dios compartida en nuestras reuniones recientes.
          </p>
        </div>

        {/* Main Video Facade Card */}
        <div className="rounded-3xl glass-panel-elevated p-4 sm:p-6 border border-cyan-electric/25 shadow-cardGlow grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Media Player Facade with Real Sermon Photography */}
          <div className="lg:col-span-7 relative aspect-video rounded-2xl overflow-hidden bg-void/90 border border-cyan-electric/30 flex items-center justify-center group shadow-cardGlow">
            <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center">
              {/* Real Preaching & Auditorium Image */}
              <Image
                src="/images/real-church-sermon.png"
                alt="Predicación y enseñanza bíblica en Amistad Nueva Creación"
                fill
                className="object-cover object-[center_45%] group-hover:scale-105 transition-transform duration-700"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-void via-void/40 to-transparent"></div>
              <div className="absolute inset-0 bg-black/25"></div>

              <div className="relative z-10 flex flex-col items-center">
                <a
                  href="https://www.facebook.com/share/v/1EJsKL2Urg/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-cyan-electric text-void flex items-center justify-center shadow-cyanGlowLg group-hover:scale-110 active:scale-95 transition-all duration-300 mb-4 focus-visible:ring-2 focus-visible:ring-white"
                  aria-label="Reproducir última reunión de Amistad Nueva Creación en Facebook"
                >
                  <Play className="w-8 h-8 text-void ml-1" />
                </a>
                <a
                  href="https://www.facebook.com/share/v/1EJsKL2Urg/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold uppercase tracking-wider text-cyan-electric px-4 py-1.5 rounded-full bg-void/85 border border-cyan-electric/40 shadow-cyanGlow backdrop-blur-md hover:bg-white hover:text-void transition-all flex items-center gap-1.5"
                >
                  <Play className="w-3 h-3" />
                  <span>Ver Transmisión de la Última Reunión</span>
                </a>
              </div>
            </div>
          </div>

          {/* Message Details */}
          <div className="lg:col-span-5 flex flex-col justify-between py-2 text-left">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-cyan-deep/40 text-cyan-electric border border-cyan-electric/30">
                  Última Reunión
                </span>
                <span className="text-xs text-brandText-muted">Transmisión Oficial en Vivo</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                Reunión General de Adoración y Palabra
              </h3>

              <p className="text-sm text-brandText-secondary leading-relaxed mb-6">
                Te invitamos a ver la última reunión completa de nuestra congregación: tiempo de alabanza en vivo, oración y el mensaje bíblico de esta semana.
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-white/10">
              <a
                href="https://www.facebook.com/share/v/1EJsKL2Urg/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-xl font-bold text-xs sm:text-sm bg-cyan-electric text-void hover:bg-white hover:shadow-cyanGlowLg transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 text-void" />
                <span>Reproducir Reunión en Facebook</span>
              </a>

              <a
                href="https://www.facebook.com/profile.php?id=100089851680572"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl font-semibold text-xs text-brandText-secondary hover:text-white glass-panel hover:border-cyan-electric/30 transition-all flex items-center justify-center gap-2"
              >
                <Headphones className="w-4 h-4 text-cyan-electric" />
                <span>Escuchar en Spotify / Podcasts</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
