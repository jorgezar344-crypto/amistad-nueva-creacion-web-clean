'use client';

import React, { useState } from 'react';
import { StepData } from './nineStepsData';
import { BookOpen, ChevronDown, ChevronUp, MessageCircle, ArrowRight } from '../icons/Icons';

interface StepCardProps {
  step: StepData;
  isActive: boolean;
  onOpenJesusModal: () => void;
  onOpenVisitModal: () => void;
  onOpenChatModal: () => void;
}

export const StepCard: React.FC<StepCardProps> = ({
  step,
  isActive,
  onOpenJesusModal,
  onOpenVisitModal,
  onOpenChatModal,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleAction = () => {
    if (step.primaryCtaAction === 'JESUS') onOpenJesusModal();
    else if (step.primaryCtaAction === 'VISIT') onOpenVisitModal();
    else onOpenChatModal();
  };

  return (
    <section
      id={step.id}
      className={`min-h-[85vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-16 transition-all duration-700 ${
        isActive ? 'opacity-100 scale-100' : 'opacity-85 scale-98'
      }`}
      aria-label={`Paso ${step.number}: ${step.name}`}
    >
      <div className="max-w-3xl w-full rounded-3xl glass-panel-elevated p-7 sm:p-12 border border-cyan-electric/25 shadow-cardGlow relative overflow-hidden backdrop-blur-xl">
        {/* Step Ambient Glow */}
        <div
          className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[100px] opacity-25 pointer-events-none"
          style={{ backgroundColor: step.colorAccent }}
        ></div>

        {/* Header Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl sm:text-3xl font-black text-cyan-electric tracking-tight">
              {step.number}
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-300">
              {step.chapterName}
            </span>
          </div>

          <span className={`text-[11px] font-bold uppercase px-3 py-1 rounded-full border ${step.badgeBg}`}>
            Estación {step.number} de 09
          </span>
        </div>

        {/* Step Title & Subtitle */}
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
          {step.name}
        </h2>
        <p className="text-sm sm:text-base font-semibold text-cyan-electric mb-6">
          {step.subtitle}
        </p>

        {/* Core Biblical Description */}
        <p className="text-base sm:text-lg text-slate-200 leading-relaxed mb-8">
          {step.description}
        </p>

        {/* Scripture Box */}
        <div className="rounded-2xl bg-void/80 border border-white/10 p-5 mb-8 shadow-inner">
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-electric mb-2 uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{step.verseRef}</span>
          </div>
          <blockquote className="text-sm sm:text-base italic text-slate-200 leading-relaxed font-serif">
            &ldquo;{step.verseText}&rdquo;
          </blockquote>
        </div>

        {/* Progressive Disclosure: Deepened Reflection */}
        {isExpanded && (
          <div className="rounded-2xl bg-surface/80 border border-cyan-electric/20 p-5 mb-8 animate-fadeIn">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-electric mb-2">
              Profundizando en este paso:
            </h4>
            <p className="text-sm text-brandText-secondary leading-relaxed">
              {step.detailedText}
            </p>
          </div>
        )}

        {/* Actions Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors order-2 sm:order-1"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4 text-cyan-electric" />
                <span>Mostrar menos</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 text-cyan-electric" />
                <span>Leer reflexión profunda</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto order-1 sm:order-2">
            <button
              onClick={handleAction}
              className="w-full sm:w-auto px-6 py-3.5 rounded-full font-bold text-xs sm:text-sm bg-cyan-electric text-void hover:bg-white hover:shadow-cyanGlow transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span>{step.primaryCtaText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href={`https://wa.me/524424112143?text=${encodeURIComponent(step.whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full glass-panel text-cyan-electric hover:text-white hover:border-cyan-electric transition-all shrink-0"
              title="Preguntar sobre este paso por WhatsApp"
              aria-label="Preguntar por WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

