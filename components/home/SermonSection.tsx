'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Play, Headphones, Youtube, Sparkles, Volume2 } from '../icons/Icons';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const YOUTUBE_VIDEO_ID = '2mj-qXRdrHU';
const LOOP_START_SEC = 0;
const LOOP_END_SEC = 8.0;

export const SermonSection: React.FC = () => {
  const [isFullMode, setIsFullMode] = useState(false);
  const [isApiReady, setIsApiReady] = useState(false);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [hasAutoplayFailed, setHasAutoplayFailed] = useState(false);
  const [previewProgress, setPreviewProgress] = useState(0);

  const sectionRef = useRef<HTMLElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const loopIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isVisibleRef = useRef<boolean>(false);

  // 1. Dynamically Load YouTube IFrame API (Deferred & Non-Blocking)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (window.YT && window.YT.Player) {
      setIsApiReady(true);
      return;
    }

    const prevCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (prevCallback) prevCallback();
      setIsApiReady(true);
    };

    if (!document.getElementById('youtube-iframe-api-script')) {
      const tag = document.createElement('script');
      tag.id = 'youtube-iframe-api-script';
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScript = document.getElementsByTagName('script')[0];
      firstScript?.parentNode?.insertBefore(tag, firstScript);
    }
  }, []);

  // 2. Clear Loop Interval Helper
  const clearLoopTimer = useCallback(() => {
    if (loopIntervalRef.current) {
      clearInterval(loopIntervalRef.current);
      loopIntervalRef.current = null;
    }
  }, []);

  // 3. Start 0:00 -> 0:08 Loop Check
  const startLoopCheck = useCallback(() => {
    clearLoopTimer();
    loopIntervalRef.current = setInterval(() => {
      if (!playerRef.current || isFullMode || !isVisibleRef.current) return;

      try {
        const currentTime = playerRef.current.getCurrentTime();
        if (typeof currentTime === 'number') {
          // Update progress percentage (0 - 100% of 8 seconds)
          const pct = Math.min(100, Math.max(0, (currentTime / LOOP_END_SEC) * 100));
          setPreviewProgress(pct);

          if (currentTime >= LOOP_END_SEC) {
            // Smooth seek back to start of preview without reloading
            playerRef.current.seekTo(LOOP_START_SEC, true);
            playerRef.current.playVideo();
          }
        }
      } catch (err) {
        // Player might be buffering or transitioning
      }
    }, 200);
  }, [clearLoopTimer, isFullMode]);

  // 4. Initialize Preview Player when API and DOM Container are ready
  useEffect(() => {
    if (!isApiReady || !playerContainerRef.current || playerRef.current || isFullMode) return;

    try {
      const containerId = 'youtube-preview-player-container';
      let element = document.getElementById(containerId);
      if (!element) {
        element = document.createElement('div');
        element.id = containerId;
        playerContainerRef.current.appendChild(element);
      }

      playerRef.current = new window.YT.Player(containerId, {
        videoId: YOUTUBE_VIDEO_ID,
        host: 'https://www.youtube-nocookie.com',
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          playsinline: 1,
          disablekb: 1,
          fs: 0,
          rel: 0,
          modestbranding: 1,
          iv_load_policy: 3,
          showinfo: 0,
          origin: typeof window !== 'undefined' ? window.location.origin : undefined,
        },
        events: {
          onReady: (event: any) => {
            try {
              event.target.mute();
              if (isVisibleRef.current) {
                event.target.playVideo();
                setIsPlayingPreview(true);
                startLoopCheck();
              }
            } catch (e) {
              setHasAutoplayFailed(true);
            }
          },
          onStateChange: (event: any) => {
            // YT.PlayerState.PLAYING = 1
            if (event.data === 1) {
              setIsPlayingPreview(true);
              startLoopCheck();
            } else if (event.data === 0) {
              // Ended early -> loop back
              if (!isFullMode) {
                event.target.seekTo(LOOP_START_SEC, true);
                event.target.playVideo();
              }
            }
          },
          onError: () => {
            setHasAutoplayFailed(true);
          },
        },
      });
    } catch (e) {
      setHasAutoplayFailed(true);
    }

    return () => {
      clearLoopTimer();
    };
  }, [isApiReady, isFullMode, startLoopCheck, clearLoopTimer]);

  // 5. IntersectionObserver: Pause when out of view, resume when entering
  useEffect(() => {
    const target = sectionRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisibleRef.current = entry.isIntersecting;

          if (isFullMode) return; // In full mode, do not forcefully interrupt user playback

          if (entry.isIntersecting) {
            if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
              try {
                playerRef.current.mute();
                playerRef.current.playVideo();
                startLoopCheck();
              } catch (e) {}
            }
          } else {
            if (playerRef.current && typeof playerRef.current.pauseVideo === 'function') {
              try {
                playerRef.current.pauseVideo();
                clearLoopTimer();
              } catch (e) {}
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(target);
    return () => {
      observer.disconnect();
      clearLoopTimer();
    };
  }, [isFullMode, startLoopCheck, clearLoopTimer]);

  // 6. User Trigger: Switch to Full Video Mode
  const handlePlayFullVideo = useCallback(() => {
    clearLoopTimer();
    setIsFullMode(true);

    // Destroy preview player instance to allow full native iframe
    if (playerRef.current && typeof playerRef.current.destroy === 'function') {
      try {
        playerRef.current.destroy();
        playerRef.current = null;
      } catch (e) {}
    }
  }, [clearLoopTimer]);

  return (
    <section
      ref={sectionRef}
      id="mensajes"
      className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      aria-label="Mensaje de esta semana en video"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel text-xs font-bold text-cyan-electric mb-3 shadow-cyanGlow border border-cyan-electric/30">
              <Youtube className="w-3.5 h-3.5 text-cyan-electric" />
              <span>Transmisión & Prédica Oficial</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Mensaje de esta Semana
            </h2>
          </div>
          <p className="text-sm sm:text-base text-brandText-secondary max-w-md">
            Escucha la Palabra compartida en nuestra más reciente reunión de adoración y enseñanza bíblica.
          </p>
        </div>

        {/* Master Card with Large Protagonist Video */}
        <div className="rounded-3xl glass-panel-elevated p-4 sm:p-6 lg:p-8 border border-cyan-electric/25 shadow-cardGlow grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main 16:9 Video Canvas (Protagonist) */}
          <div className="lg:col-span-8 relative aspect-video rounded-2xl overflow-hidden bg-void border border-cyan-electric/30 shadow-2xl group">
            {/* FULL VIDEO MODE: Native YouTube Player with full controls, sound & scrubbing */}
            {isFullMode ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&controls=1&rel=0&playsinline=1&enablejsapi=1`}
                title="Mensaje oficial de esta semana - Amistad Nueva Creación Internacional"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0 absolute inset-0 z-20"
              />
            ) : (
              /* PREVIEW MODE: Living 0:00 -> 0:08 Muted Loop with Interactive Overlay */
              <div className="relative w-full h-full">
                {/* Embedded YouTube IFrame Host Container */}
                <div
                  ref={playerContainerRef}
                  className="w-full h-full absolute inset-0 pointer-events-none scale-105"
                  aria-hidden="true"
                />

                {/* Fallback Poster Image if YouTube API/Autoplay is blocked */}
                {hasAutoplayFailed && (
                  <Image
                    src="/images/real-church-sermon.png"
                    alt="Predicación y mensaje bíblico en Amistad Nueva Creación"
                    fill
                    className="object-cover object-[center_45%]"
                    priority
                  />
                )}

                {/* Subtle Filmic Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-void/80 via-transparent to-void/30 pointer-events-none" />

                {/* Interactive Clickable Play Overlay */}
                <button
                  type="button"
                  onClick={handlePlayFullVideo}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handlePlayFullVideo();
                    }
                  }}
                  className="absolute inset-0 w-full h-full flex flex-col items-center justify-center p-6 text-center cursor-pointer group focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-electric transition-all"
                  aria-label="Reproducir mensaje de esta semana completo con audio"
                >
                  {/* Top Live Badge & 8s Loop Progress */}
                  <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-void/80 backdrop-blur-md border border-cyan-electric/40 text-[11px] font-bold text-cyan-electric shadow-cyanGlow">
                    <span className="w-2 h-2 rounded-full bg-cyan-electric animate-ping" />
                    <span>PREVIEW EN VIVO &bull; 0:08 LOOP</span>
                  </div>

                  {/* Top Right Sound Cue */}
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-void/70 backdrop-blur-md border border-white/10 text-[11px] text-slate-300">
                    <Volume2 className="w-3.5 h-3.5 text-cyan-electric" />
                    <span>Silenciado &bull; Clic para audio</span>
                  </div>

                  {/* Pulsating Master Play Button */}
                  <div className="relative mb-3 transform group-hover:scale-110 active:scale-95 transition-transform duration-300">
                    <div className="absolute -inset-3 bg-cyan-electric/30 rounded-full blur-xl animate-pulse" />
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-cyan-electric text-void flex items-center justify-center shadow-cyanGlowLg">
                      <Play className="w-8 h-8 text-void ml-1" />
                    </div>
                  </div>

                  {/* Call to Action Pill */}
                  <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white px-5 py-2 rounded-full bg-void/90 border border-cyan-electric/50 shadow-cyanGlow backdrop-blur-md group-hover:bg-cyan-electric group-hover:text-void transition-all duration-300">
                    <Play className="w-3.5 h-3.5" />
                    <span>Ver Mensaje Completo</span>
                  </div>

                  {/* Micro Loop Progress Bar Indicator */}
                  <div className="absolute bottom-0 inset-x-0 h-1 bg-white/10">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-electric to-white transition-all duration-200"
                      style={{ width: `${previewProgress}%` }}
                    />
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Editorial Column (4 Columns on Desktop) */}
          <div className="lg:col-span-4 flex flex-col justify-between py-2 text-left space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-cyan-deep/40 text-cyan-electric border border-cyan-electric/30">
                  Transmisión Oficial
                </span>
                <span className="text-xs text-brandText-muted">Amistad Querétaro</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 leading-tight">
                Reunión General de Adoración y Palabra
              </h3>

              <p className="text-sm text-brandText-secondary leading-relaxed mb-6 font-normal">
                Te invitamos a ver la reunión completa: tiempo de alabanza en vivo, ministración y el mensaje bíblico de esta semana.
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={handlePlayFullVideo}
                className="w-full py-3.5 px-6 rounded-2xl font-black text-xs sm:text-sm bg-cyan-electric text-void hover:bg-white hover:shadow-cyanGlowLg transition-all duration-300 flex items-center justify-center gap-2 shadow-cyanGlow transform active:scale-95"
              >
                <Play className="w-4 h-4 text-void" />
                <span>Ver Mensaje Completo</span>
              </button>

              <a
                href="https://www.youtube.com/watch?v=2mj-qXRdrHU"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-6 rounded-2xl font-bold text-xs text-white glass-panel hover:border-cyan-electric/50 hover:text-cyan-electric transition-all flex items-center justify-center gap-2"
              >
                <Youtube className="w-4 h-4 text-red-500" />
                <span>Abrir en YouTube Oficial</span>
              </a>

              <a
                href="https://www.facebook.com/profile.php?id=100089851680572"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-6 rounded-2xl font-semibold text-xs text-brandText-muted hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <Headphones className="w-3.5 h-3.5 text-cyan-electric" />
                <span>Escuchar en Spotify / Podcasts</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

