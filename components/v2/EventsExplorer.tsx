'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowRight, Calendar, Clock, MapPin } from '../icons/Icons';
import {
  getEventsGroupedByMonth,
  getMexicoCityTodayStr,
  type EventItem,
  type EventStatus,
  type MonthGroup,
} from '../../data/eventsData';

type ListedEvent = EventItem & { status: EventStatus };
type Filter = 'UPCOMING' | 'MONTH' | 'ALL';

const EVENT_FILTERS: Array<{ value: Filter; label: string }> = [
  { value: 'UPCOMING', label: 'Próximos' },
  { value: 'MONTH', label: 'Este mes' },
  { value: 'ALL', label: 'Todos' },
];

const monthNumber: Record<string, number> = {
  Enero: 0, Febrero: 1, Marzo: 2, Abril: 3, Mayo: 4, Junio: 5,
  Julio: 6, Agosto: 7, Septiembre: 8, Octubre: 9, Noviembre: 10, Diciembre: 11,
};

function monthCells(group: MonthGroup) {
  const month = monthNumber[group.monthName];
  const firstDay = new Date(group.year, month, 1).getDay();
  const days = new Date(group.year, month + 1, 0).getDate();
  return Array.from({ length: 42 }, (_, index) => {
    const day = index - firstDay + 1;
    return day > 0 && day <= days ? day : null;
  });
}

export function EventsExplorer() {
  const [groups] = useState<MonthGroup[]>(() => getEventsGroupedByMonth());
  const [filter, setFilter] = useState<Filter>('UPCOMING');
  const [monthIndex, setMonthIndex] = useState(0);

  const allEvents = useMemo(
    () => groups.flatMap((group) => group.events),
    [groups],
  );
  const activeGroup = groups[Math.min(monthIndex, Math.max(0, groups.length - 1))];
  const visibleEvents = useMemo(() => {
    if (filter === 'MONTH') return activeGroup?.events ?? [];
    if (filter === 'UPCOMING') return allEvents.slice(0, 6);
    return allEvents;
  }, [activeGroup, allEvents, filter]);
  const featured = allEvents.find((event) => event.featured) ?? allEvents[0];

  const focusDay = (day: number) => {
    if (!activeGroup) return;
    const month = String(monthNumber[activeGroup.monthName] + 1).padStart(2, '0');
    const date = `${activeGroup.year}-${month}-${String(day).padStart(2, '0')}`;
    const event = activeGroup.events.find((item) => item.startDate <= date && (item.endDate ?? item.startDate) >= date);
    if (!event) return;
    setFilter('MONTH');
    window.requestAnimationFrame(() => document.getElementById(`event-row-${event.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }));
  };

  return (
    <>
      {featured ? (
        <section className="v2-events-featured" data-v2-nav-theme="dark">
          {featured.image ? <Image src={featured.image} alt="" fill sizes="100vw" className="object-cover" /> : null}
          <span className="v2-events-featured__shade" aria-hidden="true" />
          <div className="v2-shell v2-events-featured__content">
            <div className="v2-events-featured__date"><strong>{featured.dayBadge}</strong><span>{featured.monthBadge}</span></div>
            <div><p className="v2-eyebrow">Evento destacado</p><h2>{featured.title}</h2><p>{featured.dateDisplay} · {featured.time}</p><Link className="v2-button v2-button--light" href={`/eventos/${featured.id}`}>Ver detalles <ArrowRight className="h-4 w-4" /></Link></div>
          </div>
        </section>
      ) : null}

      <section className="v2-events-explorer" data-v2-nav-theme="light">
        <div className="v2-shell">
          <div className="v2-events-explorer__toolbar">
            <div role="group" aria-label="Filtrar eventos">
              {EVENT_FILTERS.map(({ value, label }) => (
                <button key={value} type="button" aria-pressed={filter === value} onClick={() => setFilter(value)}>{label}</button>
              ))}
            </div>
            <p>Actualizado al {getMexicoCityTodayStr().split('-').reverse().join('/')}</p>
          </div>

          {groups.length === 0 ? <p className="v2-inline-status">No hay próximos eventos publicados.</p> : (
            <div className="v2-events-explorer__grid">
              <div className="v2-events-agenda">
                <header><p className="v2-eyebrow">Agenda editorial</p><h2>Próximos <em>encuentros.</em></h2></header>
                <div>
                  {visibleEvents.map((event) => (
                    <article id={`event-row-${event.id}`} key={event.id}>
                      <div className="v2-events-agenda__date"><strong>{event.dayBadge}</strong><span>{event.monthBadge}</span></div>
                      <div><p>{event.category}</p><h3>{event.title}</h3><span>{event.dateDisplay}</span>{event.guest ? <small>{event.guest}</small> : null}</div>
                      <div className="v2-events-agenda__meta"><span><Clock className="h-4 w-4" />{event.time}</span></div>
                      <Link href={`/eventos/${event.id}`} aria-label={`Ver detalles de ${event.title}`}><ArrowRight className="h-5 w-5" /></Link>
                    </article>
                  ))}
                </div>
              </div>

              {activeGroup ? (
                <aside className="v2-mini-calendar" aria-label="Calendario mensual compacto">
                  <header><div><p>Calendario</p><h3>{activeGroup.monthName} {activeGroup.year}</h3></div><div><button type="button" onClick={() => setMonthIndex((index) => Math.max(0, index - 1))} disabled={monthIndex === 0} aria-label="Mes anterior">←</button><button type="button" onClick={() => setMonthIndex((index) => Math.min(groups.length - 1, index + 1))} disabled={monthIndex >= groups.length - 1} aria-label="Mes siguiente">→</button></div></header>
                  <div className="v2-mini-calendar__weekdays" aria-hidden="true">{['D','L','M','M','J','V','S'].map((day,index)=><span key={`${day}-${index}`}>{day}</span>)}</div>
                  <div className="v2-mini-calendar__days">
                    {monthCells(activeGroup).map((day, index) => {
                      if (!day) return <span key={`empty-${index}`} />;
                      const month = String(monthNumber[activeGroup.monthName] + 1).padStart(2, '0');
                      const date = `${activeGroup.year}-${month}-${String(day).padStart(2, '0')}`;
                      const hasEvent = activeGroup.events.some((event) => event.startDate <= date && (event.endDate ?? event.startDate) >= date);
                      return <button key={day} type="button" disabled={!hasEvent} className={hasEvent ? 'has-event' : ''} onClick={() => focusDay(day)} aria-label={hasEvent ? `${day} de ${activeGroup.monthName}, con evento` : `${day} de ${activeGroup.monthName}`}>{day}{hasEvent ? <span aria-hidden="true" /> : null}</button>;
                    })}
                  </div>
                  <p><Calendar className="h-4 w-4" /> Selecciona un día marcado para enfocarlo en la agenda.</p>
                </aside>
              ) : null}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
