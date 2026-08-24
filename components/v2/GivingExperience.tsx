'use client';

import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, HeartHandshake, ShieldCheck } from '../icons/Icons';
import { GIVING_BANK_DETAILS } from '../../data/siteData';
import { SiteNavbar } from './SiteNavbar';
import { SiteFooter } from './SiteFooter';
import { InternalPageHero } from './InternalPageHero';

type BankDetailKey = 'accountNumber' | 'cardNumber' | 'clabe';

const bankFields: ReadonlyArray<{
  key: BankDetailKey;
  label: string;
  displayValue: string;
}> = [
  {
    key: 'accountNumber',
    label: 'Número de cuenta',
    displayValue: `${GIVING_BANK_DETAILS.accountNumber.slice(0, 3)} ${GIVING_BANK_DETAILS.accountNumber.slice(3, 6)} ${GIVING_BANK_DETAILS.accountNumber.slice(6)}`,
  },
  {
    key: 'cardNumber',
    label: 'Número de tarjeta',
    displayValue: GIVING_BANK_DETAILS.cardNumber.match(/.{1,4}/g)?.join(' ') ?? GIVING_BANK_DETAILS.cardNumber,
  },
  {
    key: 'clabe',
    label: 'CLABE interbancaria',
    displayValue: `${GIVING_BANK_DETAILS.clabe.slice(0, 3)} ${GIVING_BANK_DETAILS.clabe.slice(3, 6)} ${GIVING_BANK_DETAILS.clabe.slice(6)}`,
  },
] as const;

async function writeClipboardValue(value: string) {
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable');
    await navigator.clipboard.writeText(value);
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = value;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand('copy');
    textarea.remove();
    if (!copied) throw new Error('Unable to copy bank detail');
  }
}

export function GivingExperience() {
  const [copiedField, setCopiedField] = useState<BankDetailKey | null>(null);
  const [copyStatus, setCopyStatus] = useState('');
  const resetTimerRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (resetTimerRef.current !== null) window.clearTimeout(resetTimerRef.current);
  }, []);

  const copyBankDetail = async (key: BankDetailKey, label: string) => {
    try {
      await writeClipboardValue(GIVING_BANK_DETAILS[key]);
      setCopiedField(key);
      setCopyStatus(`${label} copiado.`);
      if (resetTimerRef.current !== null) window.clearTimeout(resetTimerRef.current);
      resetTimerRef.current = window.setTimeout(() => {
        setCopiedField(null);
        setCopyStatus('');
        resetTimerRef.current = null;
      }, 2200);
    } catch {
      setCopiedField(null);
      setCopyStatus(`No fue posible copiar ${label.toLowerCase()}.`);
    }
  };

  return (
    <div className="v2-site v2-oyster-page">
      <SiteNavbar />
      <main>
        <InternalPageHero
          eyebrow="Ofrendar"
          title={<>Dar también es parte de <em>nuestra adoración.</em></>}
          description="Tu generosidad nos permite continuar sirviendo y compartiendo el mensaje de Jesús."
        />

        <section className="v2-giving-page" data-v2-nav-theme="light">
          <div className="v2-shell v2-giving-page__grid">
            <div className="v2-giving-page__copy">
              <HeartHandshake className="h-8 w-8" />
              <h2>Una forma sencilla de ofrendar.</h2>
              <p>Puedes realizar una transferencia desde la aplicación o sucursal de tu banco utilizando los datos oficiales de la iglesia.</p>
              <ul>
                <li><ShieldCheck className="h-5 w-5" /> La web no solicita ni almacena datos bancarios personales.</li>
                <li><CheckCircle2 className="h-5 w-5" /> Verifica que el destinatario aparezca como Manuel Carrasco García antes de confirmar tu transferencia.</li>
              </ul>
              <aside className="v2-giving-online-note" aria-label="Pago en línea próximamente">
                <span>Pago en línea</span>
                <strong>Próximamente</strong>
                <p>La futura opción de pago hospedado permanecerá separada de la transferencia bancaria.</p>
              </aside>
            </div>

            <section className="v2-giving-panel v2-giving-bank" aria-labelledby="giving-panel-title">
              <p className="v2-eyebrow">Transferencia bancaria</p>
              <header className="v2-giving-bank__header">
                <h2 id="giving-panel-title">{GIVING_BANK_DETAILS.bank}</h2>
                <p><span>Titular</span><strong>{GIVING_BANK_DETAILS.accountHolder}</strong></p>
              </header>

              <div className="v2-giving-bank__details">
                {bankFields.map((field) => (
                  <div className="v2-giving-bank__detail" key={field.key}>
                    <div>
                      <span>{field.label}</span>
                      <code>{field.displayValue}</code>
                    </div>
                    <button
                      type="button"
                      onClick={() => void copyBankDetail(field.key, field.label)}
                      aria-label={`Copiar ${field.label.toLowerCase()}`}
                    >
                      {copiedField === field.key ? 'Copiado ✓' : 'Copiar'}
                    </button>
                  </div>
                ))}
              </div>

              <p className="v2-giving-bank__notice">Confirma cuidadosamente el importe y los datos en tu banca antes de autorizar la transferencia.</p>
              <p className="v2-giving-copy-status" role="status" aria-live="polite" aria-atomic="true">{copyStatus}</p>
            </section>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
