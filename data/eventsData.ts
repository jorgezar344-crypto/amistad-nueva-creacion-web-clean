export interface EventItem {
  id: string;
  title: string;
  startDate: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
  dateDisplay: string;
  dayBadge: string;
  monthBadge: string;
  monthName: string;
  year: number;
  time?: string;
  timeSchedule?: { label: string; time: string }[];
  details?: string[];
  guest?: string;
  category: 'Niños' | 'Celebración' | 'Santa Cena' | 'Capacitación' | 'Retiro' | 'Congreso' | 'Matrimonios' | 'Especial';
  featured?: boolean;
  image?: string;
  isPublic: boolean;
}

export const CHURCH_EVENTS: EventItem[] = [
  // AGOSTO 2026
  {
    id: 'encuentro-de-ninos-agosto-2026',
    title: 'Encuentro de Niños',
    startDate: '2026-08-21',
    endDate: '2026-08-22',
    dateDisplay: '21 y 22 de agosto de 2026',
    dayBadge: '21-22',
    monthBadge: 'AGO',
    monthName: 'Agosto',
    year: 2026,
    time: 'Desde las 8:00 a.m.',
    category: 'Niños',
    featured: true,
    image: '/images/kids-church.jpg',
    isPublic: true,
  },
  {
    id: 'santa-cena-agosto-2026',
    title: 'Santa Cena',
    startDate: '2026-08-28',
    dateDisplay: '28 de agosto de 2026',
    dayBadge: '28',
    monthBadge: 'AGO',
    monthName: 'Agosto',
    year: 2026,
    time: '8:00 p.m.',
    details: ['Traer alimentos para compartir.'],
    category: 'Santa Cena',
    image: '/images/community-fellowship.jpg',
    isPublic: true,
  },

  // SEPTIEMBRE 2026
  {
    id: 'aniversario-iglesia-septiembre-2026',
    title: 'Aniversario de la Iglesia',
    startDate: '2026-09-20',
    dateDisplay: '20 de septiembre de 2026',
    dayBadge: '20',
    monthBadge: 'SEP',
    monthName: 'Septiembre',
    year: 2026,
    time: '10:00 a.m.',
    details: [
      'Única reunión del día.',
      'Comida de traje.',
      'Invita a un amigo.',
    ],
    category: 'Celebración',
    featured: true,
    image: '/images/real-church-auditorium.png',
    isPublic: true,
  },
  {
    id: 'santa-cena-septiembre-2026',
    title: 'Santa Cena',
    startDate: '2026-09-25',
    dateDisplay: '25 de septiembre de 2026',
    dayBadge: '25',
    monthBadge: 'SEP',
    monthName: 'Septiembre',
    year: 2026,
    time: 'Horario por confirmar',
    details: ['Último viernes del mes.'],
    category: 'Santa Cena',
    isPublic: true,
  },
  {
    id: 'capacitacion-ministracion-septiembre-2026',
    title: 'Capacitación y Ministración',
    startDate: '2026-09-26',
    dateDisplay: '26 de septiembre de 2026',
    dayBadge: '26',
    monthBadge: 'SEP',
    monthName: 'Septiembre',
    year: 2026,
    time: '10:00 a.m. a 1:00 p.m.',
    guest: 'Pastor Eduardo Rodríguez',
    category: 'Capacitación',
    image: '/images/real-church-sermon.png',
    isPublic: true,
  },
  {
    id: 'predicacion-especial-septiembre-2026',
    title: 'Predicación Especial',
    startDate: '2026-09-27',
    dateDisplay: '27 de septiembre de 2026',
    dayBadge: '27',
    monthBadge: 'SEP',
    monthName: 'Septiembre',
    year: 2026,
    time: '6:00 p.m.',
    guest: 'Pastor Eduardo Rodríguez',
    category: 'Especial',
    isPublic: true,
  },

  // OCTUBRE 2026
  {
    id: 'retiro-de-provision-octubre-2026',
    title: 'Retiro de Provisión',
    startDate: '2026-10-10',
    dateDisplay: '10 de octubre de 2026',
    dayBadge: '10',
    monthBadge: 'OCT',
    monthName: 'Octubre',
    year: 2026,
    time: '4:00 p.m. a 8:00 p.m.',
    category: 'Retiro',
    isPublic: true,
  },
  {
    id: 'encuentro-mixto-octubre-2026',
    title: 'Encuentro Mixto',
    startDate: '2026-10-16',
    endDate: '2026-10-18',
    dateDisplay: '16, 17 y 18 de octubre de 2026',
    dayBadge: '16-18',
    monthBadge: 'OCT',
    monthName: 'Octubre',
    year: 2026,
    time: 'Horario por confirmar',
    category: 'Retiro',
    featured: true,
    image: '/images/prayer-moment.jpg',
    isPublic: true,
  },
  {
    id: 'santa-cena-octubre-2026',
    title: 'Santa Cena',
    startDate: '2026-10-30',
    dateDisplay: '30 de octubre de 2026',
    dayBadge: '30',
    monthBadge: 'OCT',
    monthName: 'Octubre',
    year: 2026,
    time: 'Horario por confirmar',
    details: ['Último viernes del mes.'],
    category: 'Santa Cena',
    isPublic: true,
  },

  // NOVIEMBRE 2026
  {
    id: 'encuentro-de-matrimonios-noviembre-2026',
    title: 'Encuentro de Matrimonios',
    startDate: '2026-11-06',
    endDate: '2026-11-07',
    dateDisplay: '6 y 7 de noviembre de 2026',
    dayBadge: '06-07',
    monthBadge: 'NOV',
    monthName: 'Noviembre',
    year: 2026,
    time: 'Horario por confirmar',
    category: 'Matrimonios',
    featured: true,
    image: '/images/native-assets/C1_PRIMERA_VISITA_FAMILIA_NATIVE.jpg',
    isPublic: true,
  },
  {
    id: 'santa-cena-noviembre-2026',
    title: 'Santa Cena',
    startDate: '2026-11-27',
    dateDisplay: '27 de noviembre de 2026',
    dayBadge: '27',
    monthBadge: 'NOV',
    monthName: 'Noviembre',
    year: 2026,
    time: 'Horario por confirmar',
    details: ['Último viernes del mes.'],
    category: 'Santa Cena',
    isPublic: true,
  },
  {
    id: 'congreso-corazones-llenos-de-su-gloria-2026',
    title: 'Congreso “Corazones Llenos de Su Gloria”',
    startDate: '2026-11-27',
    endDate: '2026-11-29',
    dateDisplay: '27, 28 y 29 de noviembre de 2026',
    dayBadge: '27-29',
    monthBadge: 'NOV',
    monthName: 'Noviembre',
    year: 2026,
    time: 'Viernes 7:00 p.m. / Sábado 10:00 a.m. / Domingo 10:00 a.m.',
    timeSchedule: [
      { label: 'Viernes 27', time: '7:00 p.m.' },
      { label: 'Sábado 28', time: '10:00 a.m.' },
      { label: 'Domingo 29', time: '10:00 a.m.' },
    ],
    category: 'Congreso',
    featured: true,
    image: '/images/real-church-auditorium.png',
    isPublic: true,
  },

  // DICIEMBRE 2026
  {
    id: 'cena-de-recompensa-diciembre-2026',
    title: 'Cena de Recompensa',
    startDate: '2026-12-05',
    dateDisplay: '5 de diciembre de 2026',
    dayBadge: '05',
    monthBadge: 'DIC',
    monthName: 'Diciembre',
    year: 2026,
    time: 'Horario por confirmar',
    category: 'Celebración',
    image: '/images/community-fellowship.jpg',
    isPublic: true,
  },
  {
    id: 'santa-cena-diciembre-2026',
    title: 'Santa Cena',
    startDate: '2026-12-25',
    dateDisplay: '25 de diciembre de 2026',
    dayBadge: '25',
    monthBadge: 'DIC',
    monthName: 'Diciembre',
    year: 2026,
    time: 'Horario por confirmar',
    details: ['Último viernes del mes.'],
    category: 'Santa Cena',
    isPublic: true,
  },
  {
    id: 'accion-de-gracias-diciembre-2026',
    title: 'Acción de Gracias',
    startDate: '2026-12-31',
    dateDisplay: '31 de diciembre de 2026',
    dayBadge: '31',
    monthBadge: 'DIC',
    monthName: 'Diciembre',
    year: 2026,
    time: '7:00 p.m.',
    category: 'Celebración',
    featured: true,
    image: '/images/real-church-auditorium.png',
    isPublic: true,
  },
];

/**
 * Returns current date string (YYYY-MM-DD) in America/Mexico_City timezone
 */
export function getMexicoCityTodayStr(overrideDateStr?: string): string {
  if (overrideDateStr) {
    return overrideDateStr;
  }
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Mexico_City',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return formatter.format(new Date());
  } catch {
    // Fallback in case Intl timeZone is unavailable
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

export type EventStatus = 'UPCOMING' | 'ONGOING' | 'PAST';

/**
 * Evaluates whether an event is UPCOMING, ONGOING, or PAST relative to Mexico City today
 */
export function getEventStatus(event: EventItem, todayStr?: string): EventStatus {
  const currentToday = todayStr || getMexicoCityTodayStr();
  const eventStart = event.startDate;
  const eventEnd = event.endDate || event.startDate;

  if (currentToday > eventEnd) {
    return 'PAST';
  } else if (currentToday >= eventStart && currentToday <= eventEnd) {
    return 'ONGOING';
  } else {
    return 'UPCOMING';
  }
}

/**
 * Returns upcoming and ongoing events sorted chronologically
 */
export function getUpcomingEvents(limit: number = 3, todayStr?: string): EventItem[] {
  const currentToday = todayStr || getMexicoCityTodayStr();
  return CHURCH_EVENTS.filter((evt) => {
    const status = getEventStatus(evt, currentToday);
    return evt.isPublic && (status === 'UPCOMING' || status === 'ONGOING');
  })
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
    .slice(0, limit);
}

export interface MonthGroup {
  monthName: string;
  year: number;
  events: (EventItem & { status: EventStatus })[];
}

/**
 * Returns public events grouped by Month, ONLY keeping ONGOING and UPCOMING events (PAST excluded).
 * Months with zero upcoming/ongoing events are excluded automatically.
 */
export function getEventsGroupedByMonth(todayStr?: string): MonthGroup[] {
  const currentToday = todayStr || getMexicoCityTodayStr();
  const monthsMap = new Map<string, (EventItem & { status: EventStatus })[]>();

  CHURCH_EVENTS.filter((evt) => evt.isPublic).forEach((evt) => {
    const status = getEventStatus(evt, currentToday);
    // Strict Rule 4: ONLY show ONGOING and UPCOMING (PAST events excluded)
    if (status === 'PAST') return;

    const key = `${evt.monthName} ${evt.year}`;
    if (!monthsMap.has(key)) {
      monthsMap.set(key, []);
    }
    monthsMap.get(key)!.push({ ...evt, status });
  });

  const result: MonthGroup[] = [];
  monthsMap.forEach((events, key) => {
    const [monthName, yearStr] = key.split(' ');
    result.push({
      monthName,
      year: parseInt(yearStr, 10),
      events,
    });
  });

  return result;
}


