'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X, Sparkles } from '../icons/Icons';

interface HomeNavbarProps {
  onOpenVisitModal: () => void;
}

export const HomeNavbar: React.FC<HomeNavbarProps> = ({ onOpenVisitModal }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Inicio', href: '#inicio' },
    { label: 'Primera Visita', href: '#primera-visita' },
    { label: 'Nuestra Iglesia', href: '#nuestra-iglesia' },
    { label: 'Reuniones', href: '#reuniones' },
    { label: 'Mensajes', href: '#mensajes' },
    { label: 'Los 9 Pasos', href: '#los-9-pasos-preview', highlight: true },
    { label: 'Ubicación', href: '#ubicacion' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass-panel-elevated py-3 border-b border-cyan-electric/15 shadow-xl'
          : 'bg-void/80 backdrop-blur-md py-4 border-b border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link
          href="#inicio"
          className="flex items-center gap-3 group focus-visible:ring-2 focus-visible:ring-cyan-electric rounded-lg p-1 transition-transform"
          aria-label="Amistad Nueva Creación Internacional — Inicio"
        >
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-cyan-electric/40 bg-black flex items-center justify-center shadow-cyanGlow">
            <Image
              src="/brand/logo-oficial.jpg"
              alt="Logo Oficial Amistad Nueva Creación Internacional"
              width={40}
              height={40}
              className="object-contain p-0.5"
              priority
            />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-bold text-sm sm:text-base tracking-tight text-white group-hover:text-cyan-electric transition-colors">
              Amistad Nueva Creación
            </span>
            <span className="text-[10px] tracking-widest uppercase text-cyan-electric font-semibold">
              Internacional &bull; Querétaro
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-brandText-secondary" aria-label="Navegación principal">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`transition-colors hover:text-cyan-electric focus-visible:text-cyan-electric ${
                link.highlight ? 'text-cyan-electric font-semibold flex items-center gap-1.5' : ''
              }`}
            >
              <span>{link.label}</span>
              {link.highlight && (
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-electric animate-pulse"></span>
              )}
            </a>
          ))}
        </nav>

        {/* CTA Button & Mobile Trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenVisitModal}
            className="px-4 sm:px-5 py-2 text-xs sm:text-sm font-bold rounded-full bg-gradient-to-r from-cyan-core to-cyan-electric text-void hover:shadow-cyanGlow hover:scale-105 active:scale-95 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-white flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-void" />
            <span>Planea tu visita</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg glass-panel text-brandText-secondary hover:text-white focus-visible:ring-2 focus-visible:ring-cyan-electric"
            aria-label="Abrir menú de navegación"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-cyan-electric" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-panel-elevated border-b border-cyan-electric/20 px-6 py-5 mt-2 animate-fadeIn">
          <nav className="flex flex-col gap-4 text-base font-medium">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-1.5 transition-colors ${
                  link.highlight ? 'text-cyan-electric font-bold' : 'text-brandText-secondary hover:text-white'
                }`}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
              <Link
                href="/9-pasos"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 rounded-full text-center text-xs font-bold glass-panel text-cyan-electric border-cyan-electric/40"
              >
                Entrar a Los 9 Pasos (Experiencia 3D) &rarr;
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
