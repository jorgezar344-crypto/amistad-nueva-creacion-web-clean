'use client';

import React from 'react';
import { NINE_STEPS } from './nineStepsData';

interface TimelineProps {
  currentStepIndex: number;
  onSelectStep: (index: number) => void;
}

export const NineStepsTimeline: React.FC<TimelineProps> = ({
  currentStepIndex,
  onSelectStep,
}) => {
  return (
    <nav
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 px-4 py-2.5 rounded-full glass-panel-elevated border border-cyan-electric/30 shadow-cardGlow max-w-[94vw] overflow-x-auto no-scrollbar flex items-center gap-1.5 sm:gap-2"
      aria-label="Selector de estaciones de los 9 Pasos"
    >
      {NINE_STEPS.map((step, idx) => {
        const isActive = currentStepIndex === idx;
        return (
          <button
            key={step.id}
            onClick={() => onSelectStep(idx)}
            className={`px-2.5 sm:px-3 py-1 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-1 shrink-0 ${
              isActive
                ? 'bg-cyan-electric text-void shadow-cyanGlow scale-105'
                : 'text-slate-300 hover:text-cyan-electric hover:bg-white/5'
            }`}
            aria-current={isActive ? 'step' : undefined}
          >
            <span>{step.number}</span>
            <span className="hidden md:inline text-[11px] font-normal">{step.name.split(' ')[0]}</span>
          </button>
        );
      })}

      <div className="w-[1px] h-4 bg-white/20 mx-1"></div>

      <button
        onClick={() => onSelectStep(9)}
        className={`px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 ${
          currentStepIndex === 9
            ? 'bg-cyan-electric text-void shadow-cyanGlow'
            : 'text-slate-300 hover:text-white'
        }`}
      >
        <span>Fin</span>
      </button>
    </nav>
  );
};

