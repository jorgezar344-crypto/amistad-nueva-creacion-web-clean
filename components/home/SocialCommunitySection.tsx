'use client';

import React from 'react';
import { Facebook, Youtube, Headphones, MessageCircle, Sparkles } from '../icons/Icons';

export const SocialCommunitySection: React.FC = () => {
  const socials = [
    {
      name: 'Facebook Oficial',
      handle: 'Amistad Nueva Creación - Oficial',
      desc: 'Transmisiones en vivo, devocionales y anuncios de eventos.',
      url: 'https://www.facebook.com/profile.php?id=100089851680572',
      icon: Facebook,
    },
    {
      name: 'Canal de YouTube',
      handle: 'Amistad Nueva Creación',
      desc: 'Prédicas dominicales completas y series de enseñanza.',
      url: 'https://www.facebook.com/profile.php?id=100089851680572',
      icon: Youtube,
    },
    {
      name: 'Podcasts & Mensajes',
      handle: 'Spotify / Podcasts',
      desc: 'Escucha los mensajes semanales en cualquier momento.',
      url: 'https://www.facebook.com/profile.php?id=100089851680572',
      icon: Headphones,
    },
  ];

  return (
    <section
      id="contacto"
      className="relative py-24 px-4 sm:px-6 lg:px-8 bg-surface/30 border-t border-cyan-electric/10"
      aria-label="Comunidad en redes sociales y canales oficiales"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-electric block mb-2">
            Comunidad Digital
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Conéctate con Nosotros
          </h2>
          <p className="text-base text-brandText-secondary leading-relaxed">
            Sigue nuestras transmisiones en vivo y mantente al día con todas las actividades.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {socials.map((soc, idx) => {
            const Icon = soc.icon;
            return (
              <a
                key={idx}
                href={soc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-3xl glass-panel p-8 border border-cyan-electric/15 hover:border-cyan-electric/50 hover:shadow-cyanGlow transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-cyan-deep/30 border border-cyan-electric/30 flex items-center justify-center text-cyan-electric mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{soc.name}</h3>
                  <p className="text-xs text-cyan-electric font-semibold mb-3">{soc.handle}</p>
                  <p className="text-sm text-brandText-secondary leading-relaxed">
                    {soc.desc}
                  </p>
                </div>

                <span className="text-xs font-bold text-cyan-electric pt-6 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Seguir canal</span>
                  <span>&rarr;</span>
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};
