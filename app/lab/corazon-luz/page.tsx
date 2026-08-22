'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Activity, Compass, Layers } from '../../../components/icons/Icons';
import { LuminousHeart3D } from '../../../components/3d/LuminousHeart3D';
import { LuminousHeartV2 } from '../../../components/3d/LuminousHeartV2';
import { LuminousHeartV3 } from '../../../components/3d/LuminousHeartV3';
import { LuminousHeartV31 } from '../../../components/3d/LuminousHeartV31';

function LuminousHeartLabContent() {
  const searchParams = useSearchParams();
  const stateParam = searchParams.get('state') as any;
  const versionParam = searchParams.get('version') as any;
  const zoomParam = searchParams.get('zoom') === 'true';

  const [version, setVersion] = useState<'v1' | 'v2' | 'v3' | 'v3.1'>(
    versionParam === 'v31' || versionParam === 'v3.1' ? 'v3.1' : versionParam || 'v3.1'
  );
  const [activeState, setActiveState] = useState<
    'auto' | 'reposo' | 'latido' | 'flow' | 'cursor-left' | 'cursor-right' | 'depth'
  >(stateParam || 'auto');
  const [qaZoom, setQaZoom] = useState(zoomParam || false);

  return (
    <main className="min-h-screen bg-void text-white flex flex-col items-center justify-between p-4 sm:p-8 relative overflow-hidden selection:bg-cyan-electric/30">
      {/* Deep Void Ambient Radial Background */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.06)_0%,transparent_75%)]"></div>

      {/* Top Header Bar & Control Panel */}
      <header className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-between gap-4 z-20 pb-4 border-b border-cyan-electric/20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-cyan-electric hover:text-white transition-colors glass-panel px-3.5 py-1.5 rounded-full self-start lg:self-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a la iglesia</span>
        </Link>

        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel text-[11px] font-bold text-cyan-electric border border-cyan-electric/30 shadow-cyanGlow">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Laboratorio 3D &bull; Comparación de Versiones</span>
          </div>
          <h1 className="text-lg sm:text-xl font-black text-white mt-1">
            {version === 'v3.1'
              ? 'Corazón de Luz V3.1 (Organic Energy & Plasma Mass)'
              : version === 'v3'
              ? 'Corazón de Luz V3 (Energy Filaments)'
              : version === 'v2'
              ? 'Corazón de Luz V2 (Refinado)'
              : 'Corazón de Luz V1 (Base)'}
          </h1>
        </div>

        {/* Master Controls: Version Switcher & States */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {/* Version Switcher */}
          <div className="flex items-center bg-void/80 p-1 rounded-2xl border border-cyan-electric/40 shadow-cyanGlow">
            {(['v1', 'v2', 'v3', 'v3.1'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setVersion(v)}
                className={`px-3 py-1 rounded-xl text-xs font-black transition-all ${
                  version === v
                    ? 'bg-cyan-electric text-void shadow-cyanGlow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {v === 'v1' ? 'V1' : v === 'v2' ? 'V2' : v === 'v3' ? 'V3' : 'V3.1 Organic'}
              </button>
            ))}
          </div>

          {/* State Simulator Controls */}
          <div className="flex flex-wrap items-center justify-center gap-1 bg-surface/60 p-1 rounded-2xl border border-white/10">
            {(['auto', 'reposo', 'latido', 'flow', 'cursor-left', 'cursor-right', 'depth'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setActiveState(s)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold uppercase transition-all ${
                  activeState === s
                    ? 'bg-cyan-electric text-void shadow-cyanGlow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {s === 'auto'
                  ? 'Interactivo'
                  : s === 'depth'
                  ? '3D Depth'
                  : s === 'flow'
                  ? 'Flow Puro'
                  : s}
              </button>
            ))}

            {/* QA Zoom Inspector */}
            <button
              onClick={() => setQaZoom(!qaZoom)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold uppercase transition-all ml-1 ${
                qaZoom
                  ? 'bg-white/25 text-white border border-cyan-electric/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {qaZoom ? 'Zoom: 1.3x' : 'Zoom: 1.0x'}
            </button>
          </div>
        </div>
      </header>

      {/* Centerpiece: Three.js Active Heart Viewport (Pure Hollow Center) */}
      <section className="relative w-full max-w-5xl h-[65vh] min-h-[500px] flex items-center justify-center my-auto z-10">
        {version === 'v3.1' ? (
          <LuminousHeartV31
            enableMouseInteraction={activeState === 'auto'}
            simulatedState={activeState}
            scale={qaZoom ? 1.3 : 1.0}
          />
        ) : version === 'v3' ? (
          <LuminousHeartV3
            enableMouseInteraction={activeState === 'auto'}
            simulatedState={activeState}
            scale={qaZoom ? 1.3 : 1.0}
          />
        ) : version === 'v2' ? (
          <LuminousHeartV2
            enableMouseInteraction={activeState === 'auto'}
            simulatedState={activeState === 'flow' ? 'reposo' : activeState}
            scale={qaZoom ? 1.3 : 1.0}
          />
        ) : (
          <LuminousHeart3D
            enableMouseInteraction={activeState === 'auto'}
            simulatedState={activeState === 'depth' ? 'cursor-right' : activeState === 'flow' ? 'reposo' : activeState}
            showCenterLogo={false}
            scale={qaZoom ? 1.3 : 1.0}
          />
        )}
      </section>

      {/* Bottom Technical Spec Bar */}
      <footer className="w-full max-w-5xl glass-panel p-4 rounded-2xl border border-cyan-electric/20 flex flex-wrap items-center justify-between gap-4 text-xs z-20">
        <div className="flex items-center gap-2 text-slate-300">
          <Activity className="w-4 h-4 text-cyan-electric animate-pulse" />
          <span className="font-bold text-white">Pulso Contemplativo:</span>
          <span>50 BPM (1.20s) &bull; Onda de plasma y nodos de energía en circulación</span>
        </div>

        <div className="flex items-center gap-2 text-slate-300">
          <Layers className="w-4 h-4 text-cyan-electric" />
          <span className="font-bold text-white">Masa & Filamentos:</span>
          <span>Ribbon volumétrico + 7 filamentos trenzados + Halo atmosférico (12%)</span>
        </div>

        <div className="flex items-center gap-2 text-slate-300">
          <Compass className="w-4 h-4 text-cyan-electric" />
          <span className="font-bold text-white">Micro-Cursor:</span>
          <span>Amortiguación elástica &bull; Rotación máx 2.6&deg; Y / 1.7&deg; X</span>
        </div>
      </footer>
    </main>
  );
}

export default function LuminousHeartLabPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-void text-cyan-electric flex items-center justify-center font-bold">
          Cargando Laboratorio 3D...
        </div>
      }
    >
      <LuminousHeartLabContent />
    </Suspense>
  );
}





