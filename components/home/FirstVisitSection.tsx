'use client';

import React from 'react';
import Image from 'next/image';
import { Heart, Users, Sparkles, MapPin, MessageCircle } from '../icons/Icons';

interface FirstVisitSectionProps {
  onOpenVisitModal: () => void;
}

export const FirstVisitSection: React.FC<FirstVisitSectionProps> = ({ onOpenVisitModal }) => {
  const visitorHighlights = [
    {
      title: 'Ambiente Familiar y Cálido',
      description: 'Sin códigos de vestimenta rígidos ni formalismos fríos. Ven tal como eres con tu familia.',
      icon: Heart,
    },
    {
      title: 'Espacio para tus Hijos',
      description: 'Atención con enseñanza bíblica dinámica, segura y divertida para niños de todas las edades.',
      icon: Sparkles,
    },
    {
      title: 'Equipo de Bienvenida',
      description: 'Te recibiremos en la puerta, te guiaremos al auditorio y responderemos con gusto todas tus preguntas.',
      icon: Users,
    },
    {
      title: 'Estacionamiento y Fácil Acceso',
      description: 'Ubicación accesible en Amanecer Balvanera, Lourdes, con espacio seguro para tu auto.',
      icon: MapPin,
    },
  ];

  return (
    <section
      id="primera-visita"
      className="relative py-24 px-4 sm:px-6 lg:px-8 bg-surface/60 border-y border-cyan-electric/10"
      aria-label="Información para la primera visita"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-electric block mb-2">
            Tu Primera Visita
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            ¿Es tu primera vez? Nos encantará recibirte.
          </h2>
          <p className="text-base sm:text-lg text-brandText-secondary leading-relaxed">
            Sabemos que visitar una iglesia por primera vez puede generar dudas. Aquí te contamos exactamente qué encontrarás al llegar a nuestra casa.
          </p>
        </div>

        {/* Prominent Editorial Photography + Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16">
          {/* Left Column: C1 Native Familia Mexicana Llegando */}
          <div className="lg:col-span-6 relative aspect-[16/10] sm:aspect-[4/3] lg:aspect-[4/5] rounded-3xl overflow-hidden glass-panel border border-cyan-electric/30 shadow-cardGlow group">
            <Image
              src="/images/native-assets/C1_PRIMERA_VISITA_FAMILIA_NATIVE.jpg"
              alt="Familia mexicana llegando a la iglesia y recibiendo cálida bienvenida"
              fill
              className="object-cover object-[center_18%] group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-void via-void/30 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 text-left">
              <span className="inline-block text-[11px] font-black uppercase px-3 py-1 rounded-full bg-cyan-electric text-void mb-2 shadow-cyanGlow">
                Te esperamos en casa
              </span>
              <p className="text-white font-bold text-base sm:text-lg drop-shadow-md">
                Un lugar seguro donde tú y tus seres queridos pueden pertenecer.
              </p>
            </div>
          </div>

          {/* Right Column: 4 Feature Highlights */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {visitorHighlights.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl glass-panel p-6 border border-cyan-electric/15 hover:border-cyan-electric/40 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-cyan-deep/30 border border-cyan-electric/30 flex items-center justify-center text-cyan-electric mb-4">
                      <Icon className="w-6 h-6 text-cyan-electric" />
                    </div>
                    <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-xs sm:text-sm text-brandText-secondary leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Plan Visit Action Box */}
        <div className="rounded-3xl glass-panel-elevated p-8 sm:p-12 border border-cyan-electric/25 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left shadow-cardGlow">
          <div className="max-w-xl">
            <h3 className="text-2xl font-bold text-white mb-2">
              ¿Quieres avisarnos que nos visitarás este domingo?
            </h3>
            <p className="text-sm text-brandText-secondary leading-relaxed">
              Un anfitrión de nuestro equipo te estará esperando en la entrada para acompañarte y asegurarse de que tú y tu familia tengan la mejor experiencia desde el primer minuto.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <button
              onClick={onOpenVisitModal}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-sm bg-cyan-electric text-void hover:bg-white hover:shadow-cyanGlow transition-all"
            >
              Planear mi visita
            </button>
            <a
              href="https://wa.me/524424112143?text=Hola%2C%20quisiera%20planear%20mi%20primera%20visita%20a%20Amistad%20Nueva%20Creaci%C3%B3n%20con%20mi%20familia."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-full font-semibold text-xs text-brandText-secondary hover:text-white glass-panel hover:border-cyan-electric/40 transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-cyan-electric" />
              <span>Escribir por WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
