'use client';

import React from 'react';
import Image from 'next/image';
import { MapPin, Navigation, Clock, MessageCircle, ExternalLink } from '../icons/Icons';

export const LocationSection: React.FC = () => {
  const churchAddress = 'Camino a Lourdes Km 1, Col. Amanecer Balvanera, Lourdes, Corregidora, Qro., México (C.P. 76908)';

  return (
    <section
      id="ubicacion"
      className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      aria-label="Ubicación y mapa de la iglesia"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-electric block mb-2">
            Ubicación y Acceso
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Cómo Llegar a Nuestra Iglesia
          </h2>
          <p className="text-base text-brandText-secondary leading-relaxed">
            Estamos ubicados al sur de El Pueblito, en la zona de Amanecer Balvanera, Lourdes, Corregidora.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Information Card */}
          <div className="lg:col-span-5 rounded-3xl glass-panel-elevated p-8 border border-cyan-electric/20 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-deep/40 border border-cyan-electric/30 flex items-center justify-center text-cyan-electric mb-6 shadow-cyanGlow">
                <MapPin className="w-6 h-6 text-cyan-electric" />
              </div>

              <h3 className="text-2xl font-bold text-white mb-3">
                Amistad Nueva Creación Internacional
              </h3>

              <p className="text-sm text-brandText-secondary leading-relaxed mb-6 font-medium">
                {churchAddress}
              </p>

              <div className="space-y-3 mb-8 text-xs text-brandText-secondary">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-electric shrink-0" />
                  <span>Reuniones dominicales: 9:00 a.m., 11:30 a.m. y 6:00 p.m.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-cyan-electric shrink-0" />
                  <span>Fácil acceso desde Carretera a Corregidora / El Pueblito</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <a
                href="https://maps.google.com/?q=Amistad+Nueva+Creacion+Lourdes+Corregidora+Queretaro"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-full font-bold text-sm bg-cyan-electric text-void flex items-center justify-center gap-2 hover:bg-white transition-all shadow-cyanGlow"
              >
                <Navigation className="w-4 h-4" />
                <span>Abrir en Google Maps</span>
              </a>

              <a
                href="https://wa.me/524424112143?text=Hola%2C%20quisiera%20orientaci%C3%B3n%20para%20llegar%20a%20la%20iglesia."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-full text-xs font-semibold text-brandText-secondary hover:text-white glass-panel flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4 text-cyan-electric" />
                <span>Pedir ayuda para llegar por WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Real Church Entrance Photography Frame */}
          <div className="lg:col-span-7 rounded-3xl overflow-hidden glass-panel p-2 border border-cyan-electric/30 min-h-[380px] flex flex-col relative group shadow-cardGlow">
            <div className="relative w-full h-full min-h-[360px] rounded-2xl overflow-hidden bg-void">
              <Image
                src="/images/real-church-entrance.jpg"
                alt="Entrada oficial a Amistad Nueva Creación en Camino a Lourdes, Querétaro"
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-void via-void/30 to-transparent"></div>

              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-void/85 border border-cyan-electric/40 text-[11px] font-bold text-cyan-electric shadow-cyanGlow backdrop-blur-md">
                  <span>Acceso Oficial &bull; Camino a Lourdes Km 1</span>
                </span>
              </div>

              <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-base font-bold text-white mb-1 drop-shadow-md">
                    Amanecer Balvanera &bull; Lourdes, Corregidora
                  </h4>
                  <p className="text-xs text-slate-200 drop-shadow-sm">
                    Pórtico de bienvenida &bull; Muro de sillar &bull; Estacionamiento
                  </p>
                </div>

                <a
                  href="https://maps.google.com/?q=Amistad+Nueva+Creacion+Lourdes+Corregidora+Queretaro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-full font-bold text-xs bg-cyan-core text-void hover:bg-cyan-electric transition-all flex items-center gap-1.5 shadow-cyanGlow shrink-0"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Ver en Maps</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
