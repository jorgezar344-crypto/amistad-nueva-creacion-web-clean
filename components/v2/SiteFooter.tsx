import Image from 'next/image';
import Link from 'next/link';
import { CHURCH, SITE_NAVIGATION, SOCIAL_LINKS } from '../../data/siteData';

export function SiteFooter() {
  return (
    <footer className="v2-footer" data-v2-nav-theme="dark">
      <div className="v2-footer__shell">
        <div className="v2-footer__lead">
          <div className="v2-footer__identity">
            <span className="v2-footer__mark">
              <Image src="/brand/logo-oficial.jpg" alt="" fill sizes="58px" className="object-cover" />
            </span>
            <div>
              <strong>{CHURCH.shortName}</strong>
              <span>Internacional</span>
            </div>
          </div>
          <p>{CHURCH.promise}</p>
        </div>

        <div className="v2-footer__grid">
          <nav aria-label="Directorio del sitio">
            <h2>Explora</h2>
            {SITE_NAVIGATION.slice(1).map((item) => (
              <Link key={item.href} href={item.href}>{item.label}</Link>
            ))}
          </nav>
          <section aria-labelledby="footer-contact-heading">
            <h2 id="footer-contact-heading">Visítanos</h2>
            <p>{CHURCH.address}</p>
            <a href={CHURCH.mapUrl} target="_blank" rel="noopener noreferrer">Cómo llegar</a>
          </section>
          <nav aria-label="Redes oficiales">
            <h2>Conecta</h2>
            {SOCIAL_LINKS.map((item) => (
              <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer">{item.label}</a>
            ))}
          </nav>
        </div>

        <div className="v2-footer__legal">
          <span>© {new Date().getFullYear()} {CHURCH.name}</span>
          <span>Querétaro, México</span>
        </div>
      </div>
    </footer>
  );
}
