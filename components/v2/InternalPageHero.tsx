import type { ReactNode } from 'react';

interface InternalPageHeroProps {
  eyebrow: string;
  title: ReactNode;
  description: string;
  dark?: boolean;
}

export function InternalPageHero({ eyebrow, title, description, dark = false }: InternalPageHeroProps) {
  return (
    <section className={`v2-internal-hero ${dark ? 'is-dark' : ''}`} data-v2-nav-theme={dark ? 'dark' : 'light'}>
      <div className="v2-shell">
        <p className="v2-eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="v2-internal-hero__description">{description}</p>
      </div>
    </section>
  );
}
