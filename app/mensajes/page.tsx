import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Youtube } from '../../components/icons/Icons';
import { SiteNavbar } from '../../components/v2/SiteNavbar';
import { SiteFooter } from '../../components/v2/SiteFooter';
import { InternalPageHero } from '../../components/v2/InternalPageHero';
import { MessagePlayer } from '../../components/v2/MessagePlayer';
import { MESSAGE } from '../../data/siteData';

export const metadata: Metadata = { title: 'Mensajes' };

export default function MessagesPage() {
  return (
    <div className="v2-site v2-oyster-page">
      <SiteNavbar />
      <main>
        <InternalPageHero eyebrow="Mensajes" title={<>Una palabra para <em>tu camino.</em></>} description="Encuentra el mensaje más reciente compartido en Amistad Nueva Creación." />
        <section className="v2-messages-page" data-v2-nav-theme="light">
          <div className="v2-shell v2-messages-page__grid">
            <MessagePlayer />
            <article><p className="v2-eyebrow">Mensaje reciente</p><h2>{MESSAGE.title}</h2><p className="v2-messages-page__speaker">{MESSAGE.speaker}</p><p>Reproduce el mensaje sin cargar YouTube hasta que tú lo decidas, o ábrelo directamente en el canal oficial.</p><a className="v2-button v2-button--ink" href={`https://www.youtube.com/watch?v=${MESSAGE.youtubeId}`} target="_blank" rel="noopener noreferrer"><Youtube className="h-4 w-4" /> Ver en YouTube</a></article>
          </div>
        </section>
        <section className="v2-messages-page__more" data-v2-nav-theme="dark"><div className="v2-shell"><p className="v2-eyebrow">Más mensajes</p><h2>La biblioteca crecerá con contenido <em>publicado por la iglesia.</em></h2><p>No se muestran prédicas ni datos no confirmados.</p><Link className="v2-text-link v2-text-link--light" href="/">Volver al inicio <ArrowRight className="h-4 w-4" /></Link></div></section>
      </main>
      <SiteFooter />
    </div>
  );
}
