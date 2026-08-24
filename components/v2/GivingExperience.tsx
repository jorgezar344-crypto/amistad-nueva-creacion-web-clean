'use client';

import { useState } from 'react';
import { CheckCircle2, HeartHandshake, ShieldCheck } from '../icons/Icons';
import { SiteNavbar } from './SiteNavbar';
import { SiteFooter } from './SiteFooter';
import { InternalPageHero } from './InternalPageHero';

const amounts = [100, 300, 500] as const;

export function GivingExperience() {
  const [selectedAmount, setSelectedAmount] = useState<number | 'other' | null>(null);
  return (
    <div className="v2-site v2-oyster-page">
      <SiteNavbar />
      <main>
        <InternalPageHero
          eyebrow="Ofrendar"
          title={<>Dar también es parte de <em>nuestra adoración.</em></>}
          description="Esta página prepara una forma clara y respetuosa de ofrendar. La integración de pago todavía no está activa."
        />

        <section className="v2-giving-page" data-v2-nav-theme="light">
          <div className="v2-shell v2-giving-page__grid">
            <div className="v2-giving-page__copy">
              <HeartHandshake className="h-8 w-8" />
              <h2>Una experiencia preparada con cuidado.</h2>
              <p>Cuando la integración futura esté autorizada, el proceso dirigirá a un checkout hospedado. Este sitio no manejará directamente números de tarjeta ni CVV.</p>
              <ul>
                <li><ShieldCheck className="h-5 w-5" /> Sin captura local de datos financieros.</li>
                <li><CheckCircle2 className="h-5 w-5" /> Integración futura claramente separada del contenido pastoral.</li>
              </ul>
            </div>

            <div className="v2-giving-panel" aria-labelledby="giving-panel-title">
              <p className="v2-eyebrow">Integración en preparación</p>
              <h2 id="giving-panel-title">Elige una cantidad</h2>
              <div className="v2-giving-panel__amounts" role="group" aria-label="Cantidad de ofrenda">
                {amounts.map((amount) => (
                  <button key={amount} type="button" aria-pressed={selectedAmount === amount} onClick={() => setSelectedAmount(amount)}>${amount}</button>
                ))}
                <button type="button" aria-pressed={selectedAmount === 'other'} onClick={() => setSelectedAmount('other')}>Otra cantidad</button>
              </div>
              {selectedAmount === 'other' ? <label className="v2-giving-panel__other">Cantidad personalizada<input type="number" min="1" inputMode="decimal" placeholder="$0" /></label> : null}
              <button className="v2-button v2-button--disabled" type="button" disabled>Continuar para ofrendar</button>
              <p role="status">Próximamente: checkout hospedado. No se procesará ningún pago en esta versión.</p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
