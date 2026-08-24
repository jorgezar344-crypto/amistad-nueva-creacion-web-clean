'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Clock, HeartHandshake, MapPin } from '../icons/Icons';

interface CinematicHomeHeroProps {
  onOpenVisitModal: () => void;
}

const HERO_VIDEO = '/videos/hero-hand-heart-cinematic.mp4';
const HERO_POSTER = '/images/hero-hand-heart-poster.webp';
const LOOP_FADE_SECONDS = 0.28;
const LOOP_VEIL_MAX_OPACITY = 0.66;

export const CinematicHomeHero: React.FC<CinematicHomeHeroProps> = ({
  onOpenVisitModal,
}) => {
  const [motionAllowed, setMotionAllowed] = useState(false);
  const [heroVisible, setHeroVisible] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  const [videoReady, setVideoReady] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const loopVeilRef = useRef<HTMLDivElement>(null);
  const videoActive = motionAllowed && heroVisible && pageVisible;

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPreference = () => {
      setMotionAllowed(!media.matches);
      if (media.matches) setVideoReady(false);
    };

    updateMotionPreference();
    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', updateMotionPreference);
      return () => media.removeEventListener('change', updateMotionPreference);
    }

    media.addListener(updateMotionPreference);
    return () => media.removeListener(updateMotionPreference);
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => setHeroVisible(entry.isIntersecting),
      { threshold: 0.01 },
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateVisibility = () => setPageVisible(!document.hidden);
    updateVisibility();
    document.addEventListener('visibilitychange', updateVisibility);
    return () => document.removeEventListener('visibilitychange', updateVisibility);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (videoActive) {
      void video.play().catch(() => undefined);
    } else {
      video.pause();
      if (loopVeilRef.current) loopVeilRef.current.style.opacity = '0';
    }
  }, [videoActive]);

  useEffect(() => {
    const veil = loopVeilRef.current;

    if (!videoActive || !videoReady) {
      if (veil) veil.style.opacity = '0';
      return;
    }

    let animationFrame = 0;

    const syncLoopVeil = () => {
      const video = videoRef.current;
      const activeVeil = loopVeilRef.current;

      if (!video || !activeVeil || !Number.isFinite(video.duration)) {
        if (activeVeil) activeVeil.style.opacity = '0';
      } else {
        const remaining = Math.max(0, video.duration - video.currentTime);
        const fadeProgress = video.currentTime < LOOP_FADE_SECONDS
          ? 1 - (video.currentTime / LOOP_FADE_SECONDS)
          : remaining < LOOP_FADE_SECONDS
            ? 1 - (remaining / LOOP_FADE_SECONDS)
            : 0;

        activeVeil.style.opacity = String(
          LOOP_VEIL_MAX_OPACITY * Math.max(0, Math.min(1, fadeProgress)),
        );
      }

      animationFrame = window.requestAnimationFrame(syncLoopVeil);
    };

    syncLoopVeil();
    return () => {
      window.cancelAnimationFrame(animationFrame);
      if (loopVeilRef.current) loopVeilRef.current.style.opacity = '0';
    };
  }, [videoActive, videoReady]);

  return (
    <section
      ref={heroRef}
      id="inicio"
      className="home-cinematic-hero relative isolate overflow-hidden bg-void"
      aria-label="Bienvenida a Amistad Nueva Creación Internacional"
      data-nav-theme="dark"
    >
      <div className="home-cinematic-media-stage absolute inset-x-0 top-0 overflow-hidden">
        <Image
          src={HERO_POSTER}
          alt=""
          fill
          priority
          sizes="100vw"
          className="home-cinematic-media"
        />
        {motionAllowed && (
          <video
            ref={videoRef}
            className={`home-cinematic-media transition-opacity duration-1000 ${
              videoReady ? 'opacity-100' : 'opacity-0'
            }`}
            autoPlay={videoActive}
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
            tabIndex={-1}
            onCanPlay={() => setVideoReady(true)}
          >
            <source src={HERO_VIDEO} type="video/mp4" />
          </video>
        )}
        <div
          ref={loopVeilRef}
          className="home-cinematic-loop-veil"
          aria-hidden="true"
        />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(2,5,9,.3)_0%,rgba(2,5,9,.03)_30%,rgba(3,7,12,.52)_58%,#06090e_88%)] md:bg-[linear-gradient(90deg,rgba(3,7,12,.95)_0%,rgba(3,7,12,.76)_29%,rgba(3,7,12,.1)_56%,rgba(3,7,12,.2)_75%,rgba(3,7,12,.68)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_53%_33%,transparent_0%,transparent_27%,rgba(2,6,10,.12)_55%,rgba(2,6,10,.72)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-52 bg-gradient-to-b from-transparent via-[#071018]/75 to-[#091018] md:h-36" />

      <div className="home-cinematic-hero-content relative z-20 mx-auto grid w-full max-w-[1440px] gap-8 px-4 sm:px-6 md:grid-cols-12 md:items-end md:px-10 lg:px-14 xl:px-16">
        <div className="home-cinematic-copy md:col-span-7 lg:col-span-6">
          <p className="home-cinematic-kicker mb-5 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.24em] text-cyan-electric sm:text-[11px]">
            <span className="h-px w-9 bg-gradient-to-r from-cyan-electric to-transparent" aria-hidden="true" />
            Amistad Nueva Creación Internacional
          </p>

          <h1 className="home-cinematic-title max-w-[10ch] text-balance font-serif font-medium leading-[0.88] tracking-[-0.055em] text-white">
            <span className="block">Hay un nuevo</span>
            <em className="block font-normal text-cyan-electric">comienzo</em>
            <span className="block">para ti.</span>
          </h1>

          <p className="home-cinematic-summary mt-6 max-w-lg text-[15px] leading-7 text-slate-200 sm:text-base sm:leading-8 lg:text-lg">
            Un lugar para conocer a Jesús, crecer en tu fe y caminar en una familia espiritual que te recibe con los brazos abiertos.
          </p>

          <div className="home-cinematic-actions mt-7 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onOpenVisitModal}
              className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-7 text-sm font-extrabold text-void shadow-[0_12px_38px_rgba(255,255,255,.14)] transition-[background-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:bg-cyan-electric hover:shadow-[0_14px_42px_rgba(0,229,255,.22)]"
            >
              <HeartHandshake className="h-5 w-5 text-cyan-deep transition-colors group-hover:text-void" />
              Quiero visitar la iglesia
            </button>
            <a
              href="#nuestra-iglesia"
              className="home-cinematic-glass inline-flex min-h-12 items-center justify-center rounded-full px-7 text-sm font-bold text-white transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-white/[0.08]"
            >
              Conócenos
            </a>
          </div>
        </div>

        <aside
          className="home-cinematic-visit-card home-cinematic-glass md:col-span-5 md:justify-self-end lg:col-span-4 lg:col-start-9 lg:max-w-[370px]"
          aria-label="Datos de tu visita"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.23em] text-cyan-electric">Este domingo</p>
          <div className="mt-3 flex items-start gap-3 text-white">
            <Clock className="mt-1 h-4 w-4 shrink-0 text-cyan-electric" />
            <p className="text-sm font-semibold leading-6">9:00 a.m. · 11:30 a.m. · 6:00 p.m.</p>
          </div>
          <div className="mt-2 flex items-start gap-3 text-slate-300">
            <MapPin className="mt-1 h-4 w-4 shrink-0 text-cyan-electric" />
            <p className="text-sm leading-6">Camino a Lourdes Km 1, Amanecer Balvanera, Corregidora.</p>
          </div>
        </aside>
      </div>
    </section>
  );
};
