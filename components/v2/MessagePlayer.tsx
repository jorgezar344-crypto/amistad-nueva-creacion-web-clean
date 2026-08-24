'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Play } from '../icons/Icons';
import { MESSAGE } from '../../data/siteData';

interface MessagePlayerProps {
  compact?: boolean;
}

export function MessagePlayer({ compact = false }: MessagePlayerProps) {
  const [playing, setPlaying] = useState(false);
  const playerRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!playing) return;
    const frame = window.requestAnimationFrame(() => playerRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [playing]);

  return (
    <div className={`v2-message-player ${compact ? 'is-compact' : ''}`}>
      {playing ? (
        <iframe
          ref={playerRef}
          src={`https://www.youtube-nocookie.com/embed/${MESSAGE.youtubeId}?autoplay=1&controls=1&rel=0&playsinline=1`}
          title={`${MESSAGE.title} — mensaje de Amistad Nueva Creación`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <>
          <Image
            src={MESSAGE.thumbnail}
            alt={`${MESSAGE.title}, mensaje compartido en Amistad Nueva Creación`}
            fill
            sizes={compact ? '(max-width: 768px) 100vw, 55vw' : '100vw'}
            className="object-cover"
          />
          <span className="v2-message-player__shade" aria-hidden="true" />
          <button type="button" onClick={() => setPlaying(true)} aria-label={`Reproducir ${MESSAGE.title}`}>
            <span><Play className="h-5 w-5" /></span>
            Reproducir mensaje
          </button>
        </>
      )}
    </div>
  );
}
