'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowLeft, Compass, Sparkles } from '../../components/icons/Icons';
import { AccessibleFallback } from '../../components/three/AccessibleFallback';
import { NINE_STEPS } from '../../components/nine-steps/nineStepsData';
import { StepCard } from '../../components/nine-steps/StepCard';
import { FinaleSection } from '../../components/nine-steps/FinaleSection';
import { NineStepsTimeline } from '../../components/nine-steps/NineStepsTimeline';
import { AudioAmbientSynthesizer } from '../../components/nine-steps/AudioAmbientSynthesizer';
import { DecisionModal } from '../../components/poc/DecisionModal';
import type { DeviceTier } from '../../components/three/LightwayCanvas';

// Lazy load Three.js Canvas exclusively on this dedicated route
const LightwayCanvas = dynamic(
  () =>
    import('../../components/three/LightwayCanvas').then(
      (mod) => mod.LightwayCanvas
    ),
  {
    ssr: false,
    loading: () => <AccessibleFallback />,
  }
);

export default function NineStepsExperiencePage() {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: 'JESUS' | 'VISIT' | 'CHAT';
  }>({
    isOpen: false,
    type: 'JESUS',
  });

  const [currentFps, setCurrentFps] = useState<number>(60);
  const [activeTier, setActiveTier] = useState<DeviceTier>('HIGH');

  // Track scroll position to update timeline & 3D spline station
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const stepElements = NINE_STEPS.map((s) => document.getElementById(s.id));
      const finaleEl = document.getElementById('conclusion-espiritual');

      if (finaleEl && scrollY + windowHeight * 0.5 >= finaleEl.offsetTop) {
        setCurrentStepIndex(9);
        return;
      }

      for (let i = stepElements.length - 1; i >= 0; i--) {
        const el = stepElements[i];
        if (el && scrollY + windowHeight * 0.45 >= el.offsetTop) {
          setCurrentStepIndex(i);
          return;
        }
      }
      setCurrentStepIndex(0);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSelectStep = (index: number) => {
    setCurrentStepIndex(index);
    if (index === 9) {
      const el = document.getElementById('conclusion-espiritual');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      const el = document.getElementById(NINE_STEPS[index].id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="relative min-h-screen bg-void text-brandText-primary selection:bg-cyan-electric/30">
      {/* 3D WebGL Background Canvas */}
      {activeTier !== 'NO_WEBGL_OR_REDUCED_MOTION' ? (
        <LightwayCanvas
          forceTier={activeTier}
          onFpsUpdate={setCurrentFps}
          onTierDetected={setActiveTier}
        />
      ) : (
        <AccessibleFallback />
      )}

      {/* Experience Header with return button & audio synthesizer */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-panel-elevated py-3 border-b border-cyan-electric/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-cyan-electric hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-cyan-electric rounded-lg px-2 py-1"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-electric" />
            <span>Volver a la iglesia</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-white">
              <Compass className="w-4 h-4 text-cyan-electric" />
              <span>Los 9 Pasos &bull; Camino de Luz</span>
            </div>

            {/* Contemplative Web Audio Synthesizer */}
            <AudioAmbientSynthesizer />
          </div>

          <Link
            href="/"
            className="px-4 py-1.5 rounded-full text-xs font-bold bg-cyan-electric text-void hover:bg-white transition-all shadow-cyanGlow"
          >
            Inicio
          </Link>
        </div>
      </header>

      {/* Intro Banner */}
      <div className="pt-32 pb-8 text-center max-w-3xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel text-xs font-bold text-cyan-electric mb-4 shadow-cyanGlow border border-cyan-electric/30">
          <Sparkles className="w-4 h-4 text-cyan-electric" />
          <span>Experiencia Espiritual Interactiva</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          Los 9 Pasos
        </h1>
        <p className="text-base sm:text-lg text-slate-300">
          Un camino vivo y guiado por Dios para crecer, sanar, congregarte y florecer en tu propósito.
        </p>
      </div>

      {/* All 9 Step Cards Container */}
      <div className="relative z-10 space-y-6 pb-20">
        {NINE_STEPS.map((step, idx) => (
          <StepCard
            key={step.id}
            step={step}
            isActive={currentStepIndex === idx}
            onOpenJesusModal={() => setModalState({ isOpen: true, type: 'JESUS' })}
            onOpenVisitModal={() => setModalState({ isOpen: true, type: 'VISIT' })}
            onOpenChatModal={() => setModalState({ isOpen: true, type: 'CHAT' })}
          />
        ))}

        {/* Spiritual Finale Section */}
        <FinaleSection
          onOpenVisitModal={() => setModalState({ isOpen: true, type: 'VISIT' })}
          onOpenChatModal={() => setModalState({ isOpen: true, type: 'CHAT' })}
        />
      </div>

      {/* Interactive Floating Timeline Bar */}
      <NineStepsTimeline
        currentStepIndex={currentStepIndex}
        onSelectStep={handleSelectStep}
      />

      {/* Interactive Modals */}
      <DecisionModal
        isOpen={modalState.isOpen}
        type={modalState.type}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
      />
    </main>
  );
}


