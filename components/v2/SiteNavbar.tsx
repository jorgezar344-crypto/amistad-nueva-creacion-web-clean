'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Menu, X } from '../icons/Icons';
import { SITE_NAVIGATION } from '../../data/siteData';

export function SiteNavbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(pathname === '/' ? 0 : 1);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const progress = pathname === '/'
          ? Math.min(1, Math.max(0, (scrollY - 24) / 86))
          : 1;

        setScrollProgress(Number(progress.toFixed(3)));
        setScrolled(scrollY > 100);
      });
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', update);
    };
  }, [pathname]);

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>('[data-v2-nav-theme]'),
    );
    if (sections.length === 0 || typeof IntersectionObserver === 'undefined') {
      setTheme(pathname === '/' || pathname === '/9-pasos' ? 'dark' : 'light');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        const nextTheme = visible?.target.getAttribute('data-v2-nav-theme');
        if (nextTheme === 'light' || nextTheme === 'dark') setTheme(nextTheme);
      },
      { rootMargin: '-8% 0px -78% 0px', threshold: [0, 0.05, 0.2] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setMenuOpen(false);
      window.requestAnimationFrame(() => toggleRef.current?.focus());
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  const navStyle = {
    '--v2-nav-dark-alpha': (0.01 + scrollProgress * 0.57).toFixed(3),
    '--v2-nav-light-alpha': (0.02 + scrollProgress * 0.53).toFixed(3),
    '--v2-nav-border-dark': (0.06 + scrollProgress * 0.13).toFixed(3),
    '--v2-nav-border-light': (0.02 + scrollProgress * 0.12).toFixed(3),
    '--v2-nav-shadow': (scrollProgress * 0.22).toFixed(3),
    '--v2-nav-light-shadow': (scrollProgress * 0.099).toFixed(3),
    '--v2-nav-inset': (0.02 + scrollProgress * 0.12).toFixed(3),
    '--v2-nav-light-inset': (0.47 + scrollProgress * 0.12).toFixed(3),
    '--v2-nav-blur': `${4 + scrollProgress * 14}px`,
  } as CSSProperties;
  const isHeroTop = pathname === '/' && scrollProgress <= 0.02;
  const activeTheme = isHeroTop ? 'dark' : theme;

  return (
    <header
      className={`v2-site-nav v2-site-nav--${activeTheme} ${isHeroTop ? 'is-hero-top' : ''} ${scrolled ? 'is-scrolled' : ''} ${menuOpen ? 'is-open' : ''}`}
      style={navStyle}
    >
      <div className="v2-site-nav__bar">
        <Link href="/" className="v2-site-nav__brand" aria-label="Amistad Nueva Creación — Inicio">
          <span className="v2-site-nav__logo">
            <Image
              src="/brand/logo-navbar-official.png"
              alt=""
              fill
              priority
              sizes="(max-width: 767px) 108px, 140px"
              className="object-contain"
            />
          </span>
        </Link>

        <nav className="v2-site-nav__links" aria-label="Navegación principal">
          {SITE_NAVIGATION.map((item) => {
            const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} aria-current={active ? 'page' : undefined}>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link href="/primera-visita" className="v2-site-nav__visit">
          Planea tu visita
        </Link>

        <button
          ref={toggleRef}
          type="button"
          className="v2-site-nav__toggle"
          aria-label={menuOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
          aria-expanded={menuOpen}
          aria-controls="v2-mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {menuOpen ? (
        <div className="v2-site-nav__scrim" onMouseDown={() => setMenuOpen(false)}>
          <nav
            id="v2-mobile-navigation"
            className="v2-site-nav__mobile"
            aria-label="Navegación móvil"
            onMouseDown={(event) => event.stopPropagation()}
          >
            {SITE_NAVIGATION.map((item, index) => {
              const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  {item.label}
                </Link>
              );
            })}
            <Link href="/primera-visita" className="v2-site-nav__mobile-visit" onClick={() => setMenuOpen(false)}>
              Planea tu visita
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
