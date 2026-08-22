'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Activity, Layers } from '../../../components/icons/Icons';
import { HomeHero } from '../../../components/home/HomeHero';
import { HomeHeroWithHeart } from '../../../components/home/HomeHeroWithHeart';

function HeroComparisonLabContent() {
  const searchParams = useSearchParams();
  const variantParam = searchParams.get('variant') as any;
  const stateParam = searchParams.get('state') as any;

  const [variant, setVariant] = useState<'actual' | 'fullbleed' | 'column'>(variantParam || 'fullbleed');
  const [activeState, setActiveState] = useState<any>(stateParam || 'auto');

  return (
    <div className="min-h-screen bg-void text-white selection:bg-cyan-electric/30">
      {/* Top QA Controls Bar */}
      <div className="sticky top-0 z-50 bg-void/90 backdrop-blur-md border-b border-cyan-electric/20 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-bold text-cyan-electric hover:text-white transition-colors glass-panel px-3 py-1.5 rounded-full"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver a la iglesia</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">Variante:</span>
            <div className="flex items-center bg-surface/80 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setVariant('actual')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  variant === 'actual'
                    ? 'bg-white/20 text-white border border-white/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Hero Actual (Producción)
              </button>
              <button
                onClick={() => setVariant('fullbleed')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  variant === 'fullbleed'
                    ? 'bg-cyan-electric text-void shadow-cyanGlow font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Full-Bleed + Campo Partículas
              </button>
            </div>
          </div>

          {variant === 'fullbleed' && (
            <div className="flex flex-wrap items-center gap-1.5 bg-surface/60 p-1 rounded-xl border border-white/10">
              <span className="text-[11px] font-bold text-slate-400 mr-1">Estado:</span>
              {[
                { id: 'auto', label: 'Interactivo' },
                { id: 'reposo', label: 'Reposo' },
                { id: 'latido', label: 'Latido' },
                { id: 'particle-field', label: 'PARTICLE FIELD (QA)' },
                { id: 'cursor-left', label: 'Cursor Izq' },
                { id: 'cursor-center', label: 'Cursor Centro' },
                { id: 'cursor-right', label: 'Cursor Der' },
                { id: 'scroll-state', label: 'Scroll' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveState(s.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                    activeState === s.id
                      ? 'bg-cyan-electric text-void shadow-cyanGlow'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Hero Viewport */}
      <main>
        {variant === 'actual' ? (
          <HomeHero onOpenVisitModal={() => {}} />
        ) : (
          <HomeHeroWithHeart
            onOpenVisitModal={() => {}}
            simulatedState={activeState}
          />
        )}

        {/* Mock Subsequent Section to Validate Scroll Transition */}
        <section id="nuestra-iglesia" className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative z-10 border-t border-white/10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel text-xs font-semibold text-cyan-electric mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Nuestra Identidad</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6">
              Una familia de fe en Querétaro
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed mb-8">
              En Amistad Nueva Creación Internacional creemos que cada persona tiene un propósito divino y un nuevo comienzo en Cristo. Te invitamos a ser parte de nuestra comunidad.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default function HeroComparisonLabPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-void text-cyan-electric flex items-center justify-center font-bold">Cargando Staging Hero...</div>}>
      <HeroComparisonLabContent />
    </Suspense>
  );
}

