'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface NavbarProps {
  onOpenVisitModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenVisitModal }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass-panel-elevated py-3 border-b border-cyan-electric/15 shadow-lg'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <a
          href="#top"
          className="flex items-center gap-3 group focus-visible:ring-2 focus-visible:ring-cyan-electric rounded-lg p-1 transition-transform"
          aria-label="Amistad Nueva Creación Internacional — Inicio"
        >
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-cyan-electric/30 bg-black flex items-center justify-center shadow-cyanGlow">
            <Image
              src="/brand/logo-oficial.jpg"
              alt="Logo Amistad Nueva Creación"
              width={40}
              height={40}
              className="object-contain p-0.5"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm sm:text-base tracking-tight text-white group-hover:text-cyan-electric transition-colors">
              Amistad Nueva Creación
            </span>
            <span className="text-[10px] tracking-widest uppercase text-cyan-electric font-medium">
              Internacional
            </span>
          </div>
        </a>

        {/* Minimal Navigation & CTAs */}
        <nav className="flex items-center gap-4 sm:gap-6" aria-label="Navegación principal">
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-brandText-secondary">
            <a
              href="#top"
              className="hover:text-cyan-electric transition-colors focus-visible:text-cyan-electric"
            >
              Inicio
            </a>
            <a
              href="#los-9-pasos"
              className="hover:text-cyan-electric transition-colors focus-visible:text-cyan-electric flex items-center gap-1.5"
            >
              <span>Los 9 Pasos</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-electric animate-pulse"></span>
            </a>
          </div>

          <div className="flex items-center gap-3">
            {/* POC Badge */}
            <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-cyan-deep/30 border border-cyan-core/30 text-cyan-electric">
              POC • Camino de Luz
            </span>

            {/* Primary Action CTA */}
            <button
              onClick={onOpenVisitModal}
              className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-full bg-gradient-to-r from-cyan-core to-cyan-electric text-void hover:shadow-cyanGlow hover:scale-105 active:scale-95 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-white"
            >
              Planear mi visita
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};
