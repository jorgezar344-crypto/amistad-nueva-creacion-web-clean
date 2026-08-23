'use client';

import React from 'react';
import Image from 'next/image';
import { Heart, Users, Sparkles, MapPin, MessageCircle, HeartHandshake, ShieldCheck, CheckCircle2 } from '../icons/Icons';

interface FirstVisitSectionProps {
  onOpenVisitModal: () => void;
}

export const FirstVisitSection: React.FC<FirstVisitSectionProps> = ({ onOpenVisitModal }) => {
  const visitorHighlights = [
    {
      step: '01',
      title: 'Sin Códigos Rígidos',
      description: 'Ven tal como eres. Jeans, tenis o ropa casual; en nuestra casa lo importante es tu corazón, no un formalismo exterior.',
      icon: Heart,
    },
    {
      step: '02',
      title: 'Espacio Seguro para tus Hijos',
      description: 'Enseñanza bíblica dinámica y divertida con maestras capacitadas para cada edad mientras tú disfrutas la reunión.',
      icon: Sparkles,
    },
    {
      step: '03',
      title: 'Anfitriones desde la Puerta',
      description: 'Un equipo cercano te dará la bienvenida, te guiará al auditorio y responderá cualquier duda con una cálida sonrisa.',
      icon: Users,
    },
    {
      step: '04',
      title: 'Estacionamiento & Fácil Acceso',
      description: 'Ubicación accesible en Amanecer Balvanera, Lourdes, con espacio seguro y cómodo para tu automóvil.',
      icon: MapPin,
    },
  ];

  return (
    <section
      id="primera-visita"
      className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-surface/60 border-y border-cyan-electric/10 overflow-hidden"
      aria-label="Información para la primera visita"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-0 w-[450px] h-[450px] bg-cyan-electric/5 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-0 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto">
        {/* Editorial Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel text-xs sm:text-sm font-semibold text-cyan-electric mb-4 shadow-cyanGlow border border-cyan-electric/30">
            <Sparkles className="w-3.5 h-3.5 text-cyan-electric" />
            <span>Tu Primera Visita</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-5 leading-[1.12]">
            ¿Es tu primera vez?<br />
            <span className="text-gradient-cyan">Nos encantará recibirte.</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-6 font-normal">
            Sabemos que visitar una iglesia por primera vez puede generar dudas. Preparamos cada detalle para que tú y tu familia disfruten una experiencia cálida, segura y edificante.
          </p>

          {/* Value Promise Badge */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-4 px-4 sm:px-6 py-2 rounded-full glass-panel border border-cyan-electric/20 text-xs sm:text-sm text-cyan-electric font-semibold">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-electric" />
              0% Presión
            </span>
            <span className="text-slate-600 hidden sm:inline">&bull;</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-electric" />
              100% Acogida
            </span>
            <span className="text-slate-600 hidden sm:inline">&bull;</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-electric" />
              Ambiente Familiar
            </span>
          </div>
        </div>

        {/* Dual Photographic Composition & Editorial 4-Pillars Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-12 lg:mb-16">
          {/* Left Column: Díptico Fotográfico Editorial */}
          <div className="lg:col-span-6 relative">
            {/* Main Image: Llegada & Familia */}
            <div className="relative aspect-[4/3] sm:aspect-[16/11] rounded-3xl overflow-hidden glass-panel border border-cyan-electric/30 shadow-cardGlow group">
              <Image
                src="/images/native-assets/C1_PRIMERA_VISITA_FAMILIA_NATIVE.jpg"
                alt="Familia mexicana llegando a la iglesia y recibiendo cálida bienvenida"
                fill
                className="object-cover object-[center_18%] group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-void via-void/35 to-transparent" />
              
              <div className="absolute bottom-5 left-5 right-5 sm:bottom-6 sm:left-6 sm:right-6">
                <span className="inline-block text-[11px] font-black uppercase px-3 py-1 rounded-full bg-cyan-electric text-void mb-2 shadow-cyanGlow">
                  Te esperamos en casa
                </span>
                <p className="text-white font-bold text-sm sm:text-base md:text-lg leading-snug drop-shadow-md">
                  Un lugar cercano donde tú y tus seres queridos pueden pertenecer.
                </p>
              </div>
            </div>

            {/* Sub-card Flotante: Kids Church / Espacio Seguro */}
            <div className="mt-4 sm:-mt-8 sm:ml-auto sm:mr-4 relative sm:max-w-xs rounded-2xl glass-panel-elevated p-3.5 sm:p-4 border border-cyan-electric/30 shadow-cardGlow flex items-center gap-3.5 z-20">
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 border border-cyan-electric/30">
                <Image
                  src="/images/kids-church.jpg"
                  alt="Área de niños y enseñanza dinámica en Amistad"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <span className="text-[10px] sm:text-[11px] font-extrabold uppercase text-cyan-electric tracking-wider block">
                  Kids Church
                </span>
                <p className="text-xs sm:text-sm font-bold text-white leading-tight">
                  Espacio seguro y alegre para tus hijos.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: 4 Editorial Numbered Pillars */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {visitorHighlights.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="group relative rounded-2xl glass-panel p-5 sm:p-6 border border-cyan-electric/15 hover:border-cyan-electric/40 hover:shadow-cyanGlow transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-11 h-11 rounded-xl bg-cyan-deep/30 border border-cyan-electric/30 flex items-center justify-center text-cyan-electric group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-5 h-5 text-cyan-electric" />
                      </div>
                      <span className="text-xl sm:text-2xl font-black text-cyan-electric/30 group-hover:text-cyan-electric/60 transition-colors font-mono">
                        {item.step}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white mb-2 group-hover:text-cyan-electric transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Peace of Mind Guarantee Banner */}
        <div className="mb-10 sm:mb-12 rounded-2xl glass-panel px-6 py-4 border border-cyan-electric/20 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-center sm:text-left">
          <div className="w-10 h-10 rounded-full bg-cyan-electric/10 border border-cyan-electric/30 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-cyan-electric" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white">
              Garantía de tranquilidad para tu visita
            </h4>
            <p className="text-xs sm:text-sm text-slate-300">
              No te haremos pasar al frente, ni hablar en público, ni te pediremos nada. Eres nuestro invitado de honor y puedes vivir la reunión en total paz.
            </p>
          </div>
        </div>

        {/* Plan Visit Action Box */}
        <div className="rounded-3xl glass-panel-elevated p-6 sm:p-10 lg:p-12 border border-cyan-electric/30 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 text-center md:text-left shadow-cardGlow">
          <div className="max-w-xl">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white mb-2">
              ¿Quieres avisarnos que nos visitarás este domingo?
            </h3>
            <p className="text-xs sm:text-sm md:text-base text-slate-300 leading-relaxed">
              Un anfitrión de nuestro equipo te estará esperando en la entrada para darte la bienvenida, orientarte y asegurarse de que tú y tu familia disfruten la mejor experiencia desde el primer minuto.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full md:w-auto shrink-0">
            <button
              onClick={onOpenVisitModal}
              className="w-full sm:w-auto px-7 sm:px-8 py-3.5 sm:py-4 rounded-full font-extrabold text-sm bg-cyan-electric text-void hover:bg-white hover:shadow-cyanGlowLg transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 shadow-cyanGlow"
            >
              <HeartHandshake className="w-4 h-4 text-void" />
              <span>Planear mi visita</span>
            </button>
            <a
              href="https://wa.me/524424112143?text=Hola%2C%20quisiera%20planear%20mi%20primera%20visita%20a%20Amistad%20Nueva%20Creaci%C3%B3n%20con%20mi%20familia."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 sm:px-7 py-3.5 sm:py-4 rounded-full font-bold text-xs sm:text-sm text-slate-200 hover:text-cyan-electric glass-panel hover:border-cyan-electric/40 transition-all flex items-center justify-center gap-2"
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
