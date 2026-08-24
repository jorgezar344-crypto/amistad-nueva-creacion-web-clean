'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import {
  NINE_STEPS_MAP_POSTER,
  NINE_STEPS_MAP_VIDEO,
} from '../../data/nineStepsExperienceData';

interface CinematicMapMediaProps {
  className?: string;
  eager?: boolean;
}

export function CinematicMapMedia({ className = '', eager = false }: CinematicMapMediaProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [nearViewport, setNearViewport] = useState(eager);
  const [visible, setVisible] = useState(eager);
  const [pageVisible, setPageVisible] = useState(true);
  const [motionAllowed, setMotionAllowed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setMotionAllowed(!media.matches);
    update();
    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', update);
      return () => media.removeEventListener('change', update);
    }
    media.addListener(update);
    return () => media.removeListener(update);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof IntersectionObserver === 'undefined') {
      setNearViewport(true);
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting || entry.boundingClientRect.top < window.innerHeight + 700) {
          setNearViewport(true);
        }
      },
      { rootMargin: '420px 0px', threshold: 0.01 },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const update = () => setPageVisible(!document.hidden);
    update();
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);

  const active = motionAllowed && visible && pageVisible && nearViewport;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (active) void video.play().catch(() => undefined);
    else video.pause();
  }, [active]);

  return (
    <div ref={rootRef} className={`v2-map-media ${className}`}>
      <Image
        src={NINE_STEPS_MAP_POSTER}
        alt="Paisaje panorámico del camino de Los 9 Pasos, del corazón a la cruz"
        fill
        priority={eager}
        sizes="100vw"
        className="v2-map-media__poster"
      />
      {motionAllowed && nearViewport ? (
        <video
          ref={videoRef}
          className={`v2-map-media__video ${ready ? 'is-ready' : ''}`}
          muted
          loop
          playsInline
          preload={eager ? 'metadata' : 'none'}
          autoPlay={active}
          aria-hidden="true"
          tabIndex={-1}
          onCanPlay={() => setReady(true)}
        >
          <source src={NINE_STEPS_MAP_VIDEO} type="video/mp4" />
        </video>
      ) : null}
      <span className="v2-map-media__veil" aria-hidden="true" />
    </div>
  );
}
