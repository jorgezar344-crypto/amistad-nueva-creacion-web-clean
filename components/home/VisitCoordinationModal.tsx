'use client';

import React from 'react';
import { X, Sparkles, HeartHandshake, MessageCircle, CheckCircle2 } from '../icons/Icons';

interface VisitCoordinationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VisitCoordinationModal: React.FC<VisitCoordinationModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg rounded-3xl glass-panel-elevated p-6 sm:p-8 border border-cyan-electric/30 shadow-cyanGlowLg">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-surface-elevated flex items-center justify-center text-brandText-secondary hover:text-white hover:bg-cyan-deep/40 transition-colors focus-visible:ring-2 focus-visible:ring-cyan-electric"
          aria-label="Cerrar modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-cyan-deep/40 border border-cyan-electric/30 flex items-center justify-center text-cyan-electric mb-5">
          <HeartHandshake className="w-6 h-6 text-cyan-electric" />
        </div>

        <span className="text-xs font-bold text-cyan-electric uppercase tracking-widest block mb-1">
          Planear Mi Visita
        </span>

        <h3 className="text-2xl font-bold text-white mb-3">
          ¡Queremos darte la bienvenida a casa!
        </h3>

        <p className="text-sm text-brandText-secondary leading-relaxed mb-6">
          Nuestras reuniones dominicales son a las <strong>9:00 a.m., 11:30 a.m. y 6:00 p.m.</strong> en Camino a Lourdes Km 1, Amanecer Balvanera, Corregidora, Qro.
        </p>

        <div className="space-y-2.5 mb-6 text-xs text-brandText-secondary">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-electric shrink-0" />
            <span>Equipo de anfitriones esperándote en la puerta.</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-electric shrink-0" />
            <span>Espacio y actividades didácticas para niños en Amistad Kids.</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-electric shrink-0" />
            <span>Ambiente contemporáneo, música en vivo y mensaje inspirador.</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <a
            href="https://wa.me/524424112143?text=Hola%2C%20quisiera%20planear%20mi%20primera%20visita%20a%20Amistad%20Nueva%20Creaci%C3%B3n%20este%20domingo%20con%20mi%20familia.%20%C2%BFPodr%C3%ADan%20orientarme%3F"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 rounded-full font-bold text-sm bg-cyan-electric text-void flex items-center justify-center gap-2 hover:bg-white transition-all shadow-cyanGlow"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Coordinar mi visita por WhatsApp</span>
          </a>

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-full text-xs font-semibold text-brandText-secondary hover:text-white"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
