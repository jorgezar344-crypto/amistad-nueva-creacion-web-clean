'use client';

import React from 'react';
import { Sparkles, MessageCircle, Heart, BookOpen } from '../icons/Icons';

interface StepOneCardProps {
  onOpenStepOneModal: () => void;
  onOpenChatModal: () => void;
}

export const StepOneCard: React.FC<StepOneCardProps> = ({
  onOpenStepOneModal,
  onOpenChatModal,
}) => {
  return (
    <section
      className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-32"
      aria-label="Paso 01: Aceptar a Jesús"
    >
      <div className="relative group rounded-3xl p-1 bg-gradient-to-b from-cyan-electric/40 via-cyan-deep/20 to-transparent shadow-cardGlow">
        {/* Card Body */}
        <div className="relative rounded-[22px] bg-surface/90 backdrop-blur-xl p-6 sm:p-10 md:p-12 border border-cyan-electric/20">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-cyan-deep/40 border border-cyan-electric/40 flex items-center justify-center text-2xl font-black text-cyan-electric shadow-cyanGlow">
                01
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-cyan-electric block mb-1">
                  Primer Paso
                </span>
                <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Aceptar a Jesús
                </h3>
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-electric/10 text-cyan-electric border border-cyan-electric/25 self-start sm:self-auto">
              <Sparkles className="w-3.5 h-3.5" />
              Todo comienza con Jesús
            </span>
          </div>

          {/* Official Doctrinal Description */}
          <p className="text-base sm:text-lg text-brandText-primary leading-relaxed mb-8">
            &ldquo;Aceptar a Jesús es reconocerlo como Señor y Salvador, recibir el perdón de Dios y comenzar una nueva vida con Él. No necesitas tener todo resuelto para acercarte a Dios. Puedes comenzar hoy.&rdquo;
          </p>

          {/* Suggested Scripture Box (Romanos 10:9) */}
          <div className="rounded-xl bg-void/70 border border-cyan-electric/15 p-5 mb-10 flex items-start gap-3.5">
            <BookOpen className="w-5 h-5 text-cyan-electric shrink-0 mt-0.5" />
            <div>
              <p className="text-xs sm:text-sm font-semibold text-cyan-electric uppercase tracking-wider mb-1">
                Romanos 10:9
              </p>
              <p className="text-xs sm:text-sm text-brandText-secondary italic">
                &ldquo;Si confiesas con tu boca que Jesús es el Señor y crees en tu corazón que Dios lo levantó de entre los muertos, serás salvo.&rdquo;
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2 border-t border-cyan-electric/15">
            <button
              onClick={onOpenStepOneModal}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-sm sm:text-base bg-gradient-to-r from-cyan-core to-cyan-electric text-void hover:shadow-cyanGlowLg hover:scale-105 active:scale-95 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-white flex items-center justify-center gap-2"
            >
              <Heart className="w-4 h-4 text-void" />
              <span>Quiero conocer a Jesús</span>
            </button>

            <button
              onClick={onOpenChatModal}
              className="w-full sm:w-auto px-6 py-3.5 rounded-full font-medium text-xs sm:text-sm text-brandText-secondary hover:text-white glass-panel hover:border-cyan-electric/40 transition-all flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-cyan-electric"
            >
              <MessageCircle className="w-4 h-4 text-cyan-electric" />
              <span>Conversar con un pastor</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
