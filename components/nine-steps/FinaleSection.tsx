'use client';

import React from 'react';
import Link from 'next/link';
import { HeartHandshake, MapPin, MessageCircle, ArrowLeft, Sparkles } from '../icons/Icons';

interface FinaleProps {
  onOpenVisitModal: () => void;
  onOpenChatModal: () => void;
}

export const FinaleSection: React.FC<FinaleProps> = ({
  onOpenVisitModal,
  onOpenChatModal,
}) => {
  return (
    <section
      id="conclusion-espiritual"
      className="min-h-screen flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 py-24 relative"
      aria-label="Conclusión de Los 9 Pasos"
    >
      <div className="max-w-4xl mx-auto rounded-3xl glass-panel-elevated p-8 sm:p-14 border border-cyan-electric/30 shadow-cardGlow relative overflow-hidden backdrop-blur-2xl">
        <div className="w-16 h-16 rounded-3xl bg-cyan-deep/40 border border-cyan-electric/40 flex items-center justify-center text-cyan-electric mx-auto mb-6 shadow-cyanGlow">
          <Sparkles className="w-8 h-8 text-cyan-electric" />
        </div>

        <span className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-electric block mb-3">
          El Camino Continúa
        </span>

        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-6">
          Los 9 Pasos no son una meta final.{' '}
          <span className="text-gradient-cyan block sm:inline">
            Son el comienzo de tu vida con Jesús.
          </span>
        </h2>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-200 leading-relaxed mb-10">
          En Amistad Nueva Creación Internacional caminamos juntos. No importa si apenas comienzas en el Paso 01 o estás sirviendo con alegría, aquí siempre tendrás una familia espiritual con los brazos abiertos.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <button
            onClick={onOpenVisitModal}
            className="w-full sm:w-auto px-8 py-4 rounded-full font-bold text-sm sm:text-base bg-cyan-electric text-void hover:bg-white hover:shadow-cyanGlowLg transition-all flex items-center justify-center gap-2"
          >
            <HeartHandshake className="w-5 h-5 text-void" />
            <span>Visítanos este domingo</span>
          </button>

          <a
            href="https://wa.me/524424112143?text=Hola%2C%20he%20le%C3%ADdo%20Los%209%20Pasos%20en%20la%20web%20y%20me%20gustar%C3%ADa%20platicar%20con%20un%20pastor."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-4 rounded-full font-semibold text-sm sm:text-base glass-panel text-white hover:border-cyan-electric hover:text-cyan-electric transition-all flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5 text-cyan-electric" />
            <span>Hablar con nosotros por WhatsApp</span>
          </a>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brandText-muted">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-cyan-electric" />
            <span>Querétaro &bull; Camino a Lourdes Km 1, Amanecer Balvanera</span>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-cyan-electric hover:underline font-bold text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Regresar a la página de la iglesia</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

