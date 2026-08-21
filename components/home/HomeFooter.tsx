'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export const HomeFooter: React.FC = () => {
  return (
    <footer className="relative bg-void border-t border-cyan-electric/15 pt-16 pb-12 px-4 sm:px-6 lg:px-8 text-xs text-brandText-muted">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/5">
        {/* Brand Column */}
        <div className="md:col-span-5 flex flex-col items-start">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-cyan-electric/30 bg-black flex items-center justify-center">
              <Image
                src="/brand/logo-oficial.jpg"
                alt="Logo Amistad Nueva Creación"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-bold text-sm text-white">Amistad Nueva Creación</span>
              <span className="text-[10px] uppercase tracking-widest text-cyan-electric">Internacional</span>
            </div>
          </div>
          <p className="text-brandText-secondary leading-relaxed max-w-sm mb-4">
            Un santuario digital de acogida, fe y transformación. Una comunidad cristiana contemporánea en Querétaro.
          </p>
          <p className="text-[11px] text-brandText-muted">
            Camino a Lourdes Km 1, Amanecer Balvanera, Corregidora, Qro.
          </p>
        </div>

        {/* Quick Links */}
        <div className="md:col-span-3">
          <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4">Navegación</h4>
          <ul className="space-y-2.5">
            <li><a href="#inicio" className="hover:text-cyan-electric transition-colors">Inicio</a></li>
            <li><a href="#primera-visita" className="hover:text-cyan-electric transition-colors">Primera Visita</a></li>
            <li><a href="#nuestra-iglesia" className="hover:text-cyan-electric transition-colors">Nuestra Iglesia</a></li>
            <li><a href="#reuniones" className="hover:text-cyan-electric transition-colors">Horarios de Reunión</a></li>
            <li><a href="#ubicacion" className="hover:text-cyan-electric transition-colors">Ubicación y Mapa</a></li>
          </ul>
        </div>

        {/* 9 Steps & Special Links */}
        <div className="md:col-span-4">
          <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4">Experiencia de Crecimiento</h4>
          <ul className="space-y-2.5">
            <li>
              <Link href="/9-pasos" className="text-cyan-electric font-semibold hover:underline flex items-center gap-1">
                <span>Los 9 Pasos (Experiencia 3D)</span>
                <span>&rarr;</span>
              </Link>
            </li>
            <li><a href="#oracion" className="hover:text-cyan-electric transition-colors">Petición de Oración</a></li>
            <li><a href="https://wa.me/524424112143" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-electric transition-colors">Contacto Pastoral WhatsApp</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <p>&copy; {new Date().getFullYear()} Amistad Nueva Creación Internacional. Todos los derechos reservados.</p>
        <p className="text-cyan-electric font-medium">Un camino para crecer en Cristo.</p>
      </div>
    </footer>
  );
};
