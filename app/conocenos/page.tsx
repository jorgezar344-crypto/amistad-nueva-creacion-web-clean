import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from '../../components/icons/Icons';
import { SiteNavbar } from '../../components/v2/SiteNavbar';
import { SiteFooter } from '../../components/v2/SiteFooter';
import { InternalPageHero } from '../../components/v2/InternalPageHero';
import { CHURCH } from '../../data/siteData';

export const metadata: Metadata = { title: 'Conócenos' };

export default function AboutPage() {
  return (
    <div className="v2-site v2-oyster-page">
      <SiteNavbar />
      <main>
        <InternalPageHero
          eyebrow="Conoce nuestra iglesia"
          title={<>Jesús al centro. <em>Una familia para caminar.</em></>}
          description={CHURCH.promise}
        />

        <section className="v2-about-story" data-v2-nav-theme="light">
          <div className="v2-shell v2-about-story__grid">
            <figure><Image src="/images/small-group-home.jpg" alt="Personas compartiendo tiempo en comunidad" fill sizes="(max-width: 900px) 100vw, 55vw" className="object-cover" /></figure>
            <div><p className="v2-eyebrow">Quiénes somos</p><h2>Una iglesia para <em>conocer, crecer y caminar.</em></h2><p>Amistad Nueva Creación Internacional es una iglesia cristiana en Querétaro. Nos reunimos para conocer a Jesús, crecer en la fe y vivir la comunidad como una familia espiritual.</p><p>La vida de iglesia continúa más allá de una reunión: oración, enseñanza, amistad y pasos concretos para seguir creciendo.</p></div>
          </div>
        </section>

        <section className="v2-about-pillars" data-v2-nav-theme="dark">
          <div className="v2-shell"><header className="v2-about-pillars__heading"><p className="v2-eyebrow">Nuestra identidad</p><h2>Una comunidad <em>con propósito cotidiano.</em></h2></header><div className="v2-about-pillars__grid">{[['01','Jesús','El centro de nuestra fe y de cada nuevo comienzo.'],['02','Crecimiento','Una vida que se fortalece con la Palabra y pasos concretos.'],['03','Comunidad','Personas que caminan juntas, oran y se acompañan.']].map(([n,t,p])=><article key={n}><span>{n}</span><h3>{t}</h3><p>{p}</p></article>)}</div></div>
        </section>

        <section className="v2-about-visit" data-v2-nav-theme="light">
          <div className="v2-shell"><p className="v2-eyebrow">Conócenos en persona</p><h2>La mejor forma de conocernos es <em>venir un domingo.</em></h2><Link className="v2-button v2-button--ink" href="/primera-visita">Planea tu visita <ArrowRight className="h-4 w-4" /></Link></div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
