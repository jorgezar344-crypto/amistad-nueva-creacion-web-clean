'use client';

import React from 'react';
import { X, Heart, MessageCircle, Sparkles, CheckCircle2 } from '../icons/Icons';

interface DecisionModalProps {
  isOpen: boolean;
  type: 'JESUS' | 'VISIT' | 'CHAT';
  onClose: () => void;
}

export const DecisionModal: React.FC<DecisionModalProps> = ({ isOpen, type, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg rounded-3xl glass-panel-elevated p-6 sm:p-8 border border-cyan-electric/30 shadow-cyanGlowLg">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-surface-elevated flex items-center justify-center text-brandText-secondary hover:text-white hover:bg-cyan-deep/40 transition-colors focus-visible:ring-2 focus-visible:ring-cyan-electric"
          aria-label="Cerrar ventana modal"
        >
          <X className="w-4 h-4" />
        </button>

        {type === 'JESUS' && (
          <div>
            <div className="w-12 h-12 rounded-2xl bg-cyan-deep/40 border border-cyan-electric/30 flex items-center justify-center text-cyan-electric mb-5">
              <Heart className="w-6 h-6 text-cyan-electric" />
            </div>
            <span className="text-xs font-bold text-cyan-electric uppercase tracking-widest block mb-1">
              Paso 01 • Oración de Fe
            </span>
            <h3 className="text-2xl font-bold text-white mb-3">
              Un nuevo comienzo con Jesús
            </h3>
            <p className="text-sm text-brandText-secondary leading-relaxed mb-6">
              Hacer esta oración con sinceridad de corazón es el primer paso de tu nueva vida:
            </p>
            <div className="rounded-2xl bg-void/80 border border-cyan-electric/20 p-5 mb-6 text-sm text-white italic leading-relaxed">
              &ldquo;Señor Jesús, hoy reconozco que te necesito. Te pido perdón por mis errores y te recibo como mi Señor y Salvador. Gracias por tu amor y por darme una nueva vida. Amén.&rdquo;
            </div>
            <div className="flex flex-col gap-3">
              <a
                href="https://wa.me/?text=Hola%20pastor%2C%20acabo%20de%20hacer%20la%20oraci%C3%B3n%20para%20aceptar%20a%20Jes%C3%BAs%20en%20la%20web%20y%20quisiera%20recibir%20gu%C3%ADa%20espiritual."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-full font-bold text-sm bg-cyan-electric text-void flex items-center justify-center gap-2 hover:bg-white transition-all shadow-cyanGlow"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Compartir mi decisión por WhatsApp</span>
              </a>
              <button
                onClick={onClose}
                className="w-full py-3 rounded-full text-xs font-semibold text-brandText-secondary hover:text-white"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}

        {type === 'VISIT' && (
          <div>
            <div className="w-12 h-12 rounded-2xl bg-cyan-deep/40 border border-cyan-electric/30 flex items-center justify-center text-cyan-electric mb-5">
              <Sparkles className="w-6 h-6 text-cyan-electric" />
            </div>
            <span className="text-xs font-bold text-cyan-electric uppercase tracking-widest block mb-1">
              Primera Visita
            </span>
            <h3 className="text-2xl font-bold text-white mb-3">
              ¡Queremos darte la bienvenida!
            </h3>
            <p className="text-sm text-brandText-secondary leading-relaxed mb-6">
              En Amistad Nueva Creación Internacional serás recibido como en familia. Tenemos un lugar preparado para ti y los tuyos.
            </p>
            <div className="space-y-2.5 mb-6 text-xs text-brandText-secondary">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-electric shrink-0" />
                <span>Ambiente cálido y familiar para todas las edades.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-electric shrink-0" />
                <span>Espacio especial y actividades para niños.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-electric shrink-0" />
                <span>Estacionamiento y equipo de bienvenida.</span>
              </div>
            </div>
            <a
              href="https://wa.me/?text=Hola%2C%20quisiera%20planear%20mi%20primera%20visita%20a%20Amistad%20Nueva%20Creaci%C3%B3n%20con%20mi%20familia.%20%C2%BFA%20qu%C3%A9%20hora%20son%20las%20reuniones%3F"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 rounded-full font-bold text-sm bg-cyan-electric text-void flex items-center justify-center gap-2 hover:bg-white transition-all shadow-cyanGlow"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Coordinar mi visita por WhatsApp</span>
            </a>
          </div>
        )}

        {type === 'CHAT' && (
          <div>
            <div className="w-12 h-12 rounded-2xl bg-cyan-deep/40 border border-cyan-electric/30 flex items-center justify-center text-cyan-electric mb-5">
              <MessageCircle className="w-6 h-6 text-cyan-electric" />
            </div>
            <span className="text-xs font-bold text-cyan-electric uppercase tracking-widest block mb-1">
              Atención Pastoral
            </span>
            <h3 className="text-2xl font-bold text-white mb-3">
              Estamos aquí para ti
            </h3>
            <p className="text-sm text-brandText-secondary leading-relaxed mb-6">
              Si tienes preguntas sobre la fe, necesitas oración o deseas orientación pastoral, puedes escribirnos con total confianza.
            </p>
            <a
              href="https://wa.me/?text=Hola%20pastor%2C%20quisiera%20conversar%20con%20usted%20para%20orientaci%C3%B3n%20y%20apoyo%20espiritual."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 rounded-full font-bold text-sm bg-cyan-electric text-void flex items-center justify-center gap-2 hover:bg-white transition-all shadow-cyanGlow"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Abrir chat pastoral en WhatsApp</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
