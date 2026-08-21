export interface EventItem {
  id: string;
  title: string;
  subtitle?: string;
  startDate: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
  dateDisplay: string;
  dayBadge: string;
  monthBadge: string;
  monthName: string;
  year: number;
  time: string;
  timeSchedule?: { label: string; time: string }[];
  description: string;
  details?: string[];
  guest?: string;
  category: 'Niños' | 'Celebración' | 'Santa Cena' | 'Capacitación' | 'Retiro' | 'Congreso' | 'Matrimonios' | 'Especial';
  featured?: boolean;
  image?: string;
  location: string;
  isPublic: boolean;
}

export const CHURCH_EVENTS: EventItem[] = [
  // AGOSTO 2026
  {
    id: 'encuentro-de-ninos-agosto-2026',
    title: 'Encuentro de Niños',
    subtitle: 'Un tiempo especial para sembrar la fe en el corazón de los más pequeños',
    startDate: '2026-08-21',
    endDate: '2026-08-22',
    dateDisplay: '21 y 22 de Agosto, 2026',
    dayBadge: '21-22',
    monthBadge: 'AGO',
    monthName: 'Agosto',
    year: 2026,
    time: 'Desde las 8:00 a.m.',
    description: 'Actividad dedicada a los niños de la congregación con dinámicas, enseñanza de la Palabra y tiempo de ministración infantil.',
    category: 'Niños',
    featured: true,
    image: '/images/kids-church.jpg',
    location: 'Auditorio Principal & Área Kids',
    isPublic: true,
  },
  {
    id: 'santa-cena-agosto-2026',
    title: 'Santa Cena',
    subtitle: 'Comunión, agradecimiento y partir el pan como familia de Dios',
    startDate: '2026-08-28',
    dateDisplay: '28 de Agosto, 2026',
    dayBadge: '28',
    monthBadge: 'AGO',
    monthName: 'Agosto',
    year: 2026,
    time: '8:00 p.m.',
    description: 'Reunión mensual de Santa Cena para recordar el sacrificio de Jesús en la cruz y celebrar la comunión fraterna.',
    details: ['Traer alimentos para compartir al término del servicio.'],
    category: 'Santa Cena',
    image: '/images/community-fellowship.jpg',
    location: 'Auditorio Principal',
    isPublic: true,
  },

  // SEPTIEMBRE 2026
  {
    id: 'aniversario-iglesia-septiembre-2026',
    title: 'Aniversario de la Iglesia',
    subtitle: 'Celebrando la fidelidad y la gracia de Dios en nuestra casa',
    startDate: '2026-09-20',
    dateDisplay: '20 de Septiembre, 2026',
    dayBadge: '20',
    monthBadge: 'SEP',
    monthName: 'Septiembre',
    year: 2026,
    time: '10:00 a.m.',
    description: 'Gran fiesta congregacional por el aniversario de Amistad Nueva Creación Internacional. ¡Únete a celebrar lo que Dios ha hecho!',
    details: [
      'Única reunión del día.',
      'Comida de traje.',
      'Invita a un amigo o familiar.',
    ],
    category: 'Celebración',
    featured: true,
    image: '/images/real-church-auditorium.png',
    location: 'Auditorio Principal',
    isPublic: true,
  },
  {
    id: 'santa-cena-septiembre-2026',
    title: 'Santa Cena',
    subtitle: 'Celebración mensual de comunión — Último viernes del mes',
    startDate: '2026-09-25',
    dateDisplay: '25 de Septiembre, 2026',
    dayBadge: '25',
    monthBadge: 'SEP',
    monthName: 'Septiembre',
    year: 2026,
    time: '8:00 p.m.',
    description: 'Tiempo solemne y gozoso de Santa Cena en congregación.',
    category: 'Santa Cena',
    location: 'Auditorio Principal',
    isPublic: true,
  },
  {
    id: 'capacitacion-ministracion-septiembre-2026',
    title: 'Capacitación y Ministración',
    subtitle: 'Edificación bíblica y crecimiento espiritual con invitado especial',
    startDate: '2026-09-26',
    dateDisplay: '26 de Septiembre, 2026',
    dayBadge: '26',
    monthBadge: 'SEP',
    monthName: 'Septiembre',
    year: 2026,
    time: '10:00 a.m. a 1:00 p.m.',
    description: 'Sesión intensiva de capacitación y ministración de la Palabra impartida por nuestro invitado especial.',
    guest: 'Pastor Eduardo Rodríguez',
    details: ['Invitado especial: Pastor Eduardo Rodríguez.'],
    category: 'Capacitación',
    image: '/images/real-church-sermon.png',
    location: 'Auditorio Principal',
    isPublic: true,
  },
  {
    id: 'predicacion-especial-septiembre-2026',
    title: 'Predicación Especial',
    subtitle: 'Servicio dominical especial de la tarde con el Pastor Eduardo Rodríguez',
    startDate: '2026-09-27',
    dateDisplay: '27 de Septiembre, 2026',
    dayBadge: '27',
    monthBadge: 'SEP',
    monthName: 'Septiembre',
    year: 2026,
    time: '6:00 p.m.',
    description: 'Reunión dominical vespertina con un mensaje ungido y relevante para toda la iglesia y la ciudad.',
    guest: 'Pastor Eduardo Rodríguez',
    category: 'Especial',
    location: 'Auditorio Principal',
    isPublic: true,
  },

  // OCTUBRE 2026
  {
    id: 'retiro-de-provision-octubre-2026',
    title: 'Retiro de Provisión',
    subtitle: 'Enseñanza y principios del Reino sobre mayordomía y provisión divina',
    startDate: '2026-10-10',
    dateDisplay: '10 de Octubre, 2026',
    dayBadge: '10',
    monthBadge: 'OCT',
    monthName: 'Octubre',
    year: 2026,
    time: '4:00 p.m. a 8:00 p.m.',
    description: 'Tiempo de instrucción bíblica y búsqueda de Dios enfocado en la provisión y el propósito financiero en Cristo.',
    category: 'Retiro',
    location: 'Auditorio Principal',
    isPublic: true,
  },
  {
    id: 'encuentro-mixto-octubre-2026',
    title: 'Encuentro Mixto',
    subtitle: 'Retiro de fin de semana para sanidad interior y renovación espiritual',
    startDate: '2026-10-16',
    endDate: '2026-10-18',
    dateDisplay: '16, 17 y 18 de Octubre, 2026',
    dayBadge: '16-18',
    monthBadge: 'OCT',
    monthName: 'Octubre',
    year: 2026,
    time: 'Horario por confirmar',
    description: 'Retiro espiritual transformador para hombres y mujeres. Un encuentro cara a cara con el amor y el poder restaurador de Dios.',
    category: 'Retiro',
    featured: true,
    image: '/images/prayer-moment.jpg',
    location: 'Auditorio & Casa de Retiros',
    isPublic: true,
  },
  {
    id: 'santa-cena-octubre-2026',
    title: 'Santa Cena',
    subtitle: 'Celebración mensual de comunión — Último viernes del mes',
    startDate: '2026-10-30',
    dateDisplay: '30 de Octubre, 2026',
    dayBadge: '30',
    monthBadge: 'OCT',
    monthName: 'Octubre',
    year: 2026,
    time: '8:00 p.m.',
    description: 'Celebración mensual de la Santa Cena en comunidad.',
    category: 'Santa Cena',
    location: 'Auditorio Principal',
    isPublic: true,
  },

  // NOVIEMBRE 2026
  {
    id: 'encuentro-de-matrimonios-noviembre-2026',
    title: 'Encuentro de Matrimonios',
    subtitle: 'Fortaleciendo lazos conyugales y bendición sobre el hogar',
    startDate: '2026-11-06',
    endDate: '2026-11-07',
    dateDisplay: '6 y 7 de Noviembre, 2026',
    dayBadge: '06-07',
    monthBadge: 'NOV',
    monthName: 'Noviembre',
    year: 2026,
    time: 'Horario por confirmar',
    description: 'Un retiro intencional diseñado para renovar el pacto matrimonial, sanar la comunicación y edificar familias sólidas sobre la roca.',
    category: 'Matrimonios',
    featured: true,
    image: '/images/native-assets/C1_PRIMERA_VISITA_FAMILIA_NATIVE.jpg',
    location: 'Auditorio Principal',
    isPublic: true,
  },
  {
    id: 'santa-cena-noviembre-2026',
    title: 'Santa Cena',
    subtitle: 'Celebración mensual de comunión — Último viernes del mes',
    startDate: '2026-11-27',
    dateDisplay: '27 de Noviembre, 2026',
    dayBadge: '27',
    monthBadge: 'NOV',
    monthName: 'Noviembre',
    year: 2026,
    time: '7:00 p.m.',
    description: 'Santa Cena en el marco del fin de semana de bendición de la iglesia.',
    category: 'Santa Cena',
    location: 'Auditorio Principal',
    isPublic: true,
  },
  {
    id: 'congreso-corazones-llenos-de-su-gloria-2026',
    title: 'Congreso “Corazones Llenos de Su Gloria”',
    subtitle: 'Tres días de adoración profética, palabra y derramamiento del Espíritu',
    startDate: '2026-11-27',
    endDate: '2026-11-29',
    dateDisplay: '27, 28 y 29 de Noviembre, 2026',
    dayBadge: '27-29',
    monthBadge: 'NOV',
    monthName: 'Noviembre',
    year: 2026,
    time: 'Viernes 7:00 p.m. / Sábado y Domingo 10:00 a.m.',
    timeSchedule: [
      { label: 'Viernes 27', time: '7:00 p.m.' },
      { label: 'Sábado 28', time: '10:00 a.m.' },
      { label: 'Domingo 29', time: '10:00 a.m.' },
    ],
    description: 'Magno congreso anual de la iglesia. Un fin de semana extraordinario para ser equipados, avivados y llenos de la presencia viva de Dios.',
    category: 'Congreso',
    featured: true,
    image: '/images/real-church-auditorium.png',
    location: 'Auditorio Principal',
    isPublic: true,
  },

  // DICIEMBRE 2026
  {
    id: 'cena-de-recompensa-diciembre-2026',
    title: 'Cena de Recompensa',
    subtitle: 'Tiempo de gratitud, honra y celebración por el fruto del año',
    startDate: '2026-12-05',
    dateDisplay: '5 de Diciembre, 2026',
    dayBadge: '05',
    monthBadge: 'DIC',
    monthName: 'Diciembre',
    year: 2026,
    time: 'Horario por confirmar',
    description: 'Cena especial de convivencia y reconocimiento al servicio y la fidelidad de la familia de la iglesia.',
    category: 'Celebración',
    image: '/images/community-fellowship.jpg',
    location: 'Auditorio Principal',
    isPublic: true,
  },
  {
    id: 'santa-cena-diciembre-2026',
    title: 'Santa Cena de Fin de Año',
    subtitle: 'Último viernes del mes — Agradecimiento por un año bendecido',
    startDate: '2026-12-25',
    dateDisplay: '25 de Diciembre, 2026',
    dayBadge: '25',
    monthBadge: 'DIC',
    monthName: 'Diciembre',
    year: 2026,
    time: '8:00 p.m.',
    description: 'Servicio de Santa Cena en gratitud por la natividad y la obra redentora de nuestro Señor.',
    category: 'Santa Cena',
    location: 'Auditorio Principal',
    isPublic: true,
  },
  {
    id: 'accion-de-gracias-diciembre-2026',
    title: 'Servicio Especial de Acción de Gracias',
    subtitle: 'Despidiendo el año en la presencia de Dios y recibiendo el 2027 con fe',
    startDate: '2026-12-31',
    dateDisplay: '31 de Diciembre, 2026',
    dayBadge: '31',
    monthBadge: 'DIC',
    monthName: 'Diciembre',
    year: 2026,
    time: '7:00 p.m.',
    description: 'Reunión solemne y festiva para dar gracias a Dios por el año 2026 y consagrarnos para el nuevo ciclo bajo su cobertura y gracia.',
    category: 'Celebración',
    featured: true,
    image: '/images/real-church-auditorium.png',
    location: 'Auditorio Principal',
    isPublic: true,
  },
];

/**
 * Parses date string in YYYY-MM-DD format as end-of-day in local time
 */
function getEndOfDay(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d, 23, 59, 59, 999);
}

/**
 * Parses date string in YYYY-MM-DD format as start-of-day in local time
 */
function getStartOfDay(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d, 0, 0, 0, 0);
}

export type EventStatus = 'UPCOMING' | 'ONGOING' | 'PAST';

export function getEventStatus(event: EventItem, refDate: Date = new Date('2026-08-21T00:00:00')): EventStatus {
  const start = getStartOfDay(event.startDate);
  const end = getEndOfDay(event.endDate || event.startDate);

  if (refDate > end) {
    return 'PAST';
  } else if (refDate >= start && refDate <= end) {
    return 'ONGOING';
  } else {
    return 'UPCOMING';
  }
}

/**
 * Returns upcoming and ongoing events sorted chronologically
 */
export function getUpcomingEvents(
  refDate: Date = new Date('2026-08-21T00:00:00'),
  limit: number = 3
): EventItem[] {
  return CHURCH_EVENTS.filter((evt) => {
    const status = getEventStatus(evt, refDate);
    return evt.isPublic && (status === 'UPCOMING' || status === 'ONGOING');
  })
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, limit);
}

/**
 * Returns all public events grouped by Month
 */
export function getEventsGroupedByMonth(
  refDate: Date = new Date('2026-08-21T00:00:00')
): { monthName: string; year: number; events: (EventItem & { status: EventStatus })[] }[] {
  const monthsMap = new Map<string, (EventItem & { status: EventStatus })[]>();

  CHURCH_EVENTS.filter((evt) => evt.isPublic).forEach((evt) => {
    const key = `${evt.monthName} ${evt.year}`;
    if (!monthsMap.has(key)) {
      monthsMap.set(key, []);
    }
    const status = getEventStatus(evt, refDate);
    monthsMap.get(key)!.push({ ...evt, status });
  });

  const result: { monthName: string; year: number; events: (EventItem & { status: EventStatus })[] }[] = [];
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

