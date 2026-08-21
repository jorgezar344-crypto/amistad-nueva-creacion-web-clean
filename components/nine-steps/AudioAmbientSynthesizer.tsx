'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from '../icons/Icons';

export const AudioAmbientSynthesizer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscsRef = useRef<OscillatorNode[]>([]);

  const toggleSound = () => {
    if (isPlaying) {
      if (gainNodeRef.current && audioCtxRef.current) {
        gainNodeRef.current.gain.setTargetAtTime(0.0001, audioCtxRef.current.currentTime, 0.3);
        setTimeout(() => {
          oscsRef.current.forEach((osc) => {
            try { osc.stop(); osc.disconnect(); } catch {}
          });
          oscsRef.current = [];
          setIsPlaying(false);
        }, 400);
      }
    } else {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0.0001, ctx.currentTime);
        masterGain.gain.setTargetAtTime(0.035, ctx.currentTime, 1.0);
        masterGain.connect(ctx.destination);
        gainNodeRef.current = masterGain;

        const freqs = [130.81, 196.00, 293.66, 329.63];
        const oscs: OscillatorNode[] = [];

        freqs.forEach((freq) => {
          const osc = ctx.createOscillator();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          osc.connect(masterGain);
          osc.start();
          oscs.push(osc);
        });

        oscsRef.current = oscs;
        setIsPlaying(true);
      } catch (err) {
        console.warn('AudioContext unavailable:', err);
      }
    }
  };

  useEffect(() => {
    return () => {
      oscsRef.current.forEach((osc) => {
        try { osc.stop(); osc.disconnect(); } catch {}
      });
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <button
      onClick={toggleSound}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel text-xs font-semibold text-cyan-electric hover:text-white border border-cyan-electric/30 hover:border-cyan-electric transition-all shadow-cyanGlow"
      aria-label={isPlaying ? 'Silenciar ambiente sonoro' : 'Activar ambiente sonoro contemplativo'}
      title="Música ambiental contemplativa en tiempo real (Web Audio API)"
    >
      {isPlaying ? (
        <>
          <Volume2 className="w-3.5 h-3.5 text-cyan-electric animate-pulse" />
          <span className="hidden sm:inline text-[11px]">Sonido: Activo</span>
        </>
      ) : (
        <>
          <VolumeX className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline text-[11px] text-slate-400">Sonido: Mute</span>
        </>
      )}
    </button>
  );
};

