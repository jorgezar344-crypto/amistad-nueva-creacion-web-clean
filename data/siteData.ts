export const CHURCH = {
  name: 'Amistad Nueva Creación Internacional',
  shortName: 'Amistad Nueva Creación',
  address: 'Camino a Lourdes Km 1, Amanecer Balvanera, Corregidora, Qro.',
  mapUrl: 'https://maps.app.goo.gl/uX3LgMh5v7x',
  whatsapp: 'https://wa.me/524424112143',
  phoneDisplay: '442 411 2143',
  serviceTimes: ['9:00 a.m.', '11:30 a.m.', '6:00 p.m.'],
  promise: 'Un lugar para conocer a Jesús, crecer en tu fe y caminar en familia.',
} as const;

export const SITE_NAVIGATION = [
  { href: '/', label: 'Inicio' },
  { href: '/conocenos', label: 'Conócenos' },
  { href: '/primera-visita', label: 'Primera visita' },
  { href: '/9-pasos', label: '9 Pasos' },
  { href: '/mensajes', label: 'Mensajes' },
  { href: '/eventos', label: 'Eventos' },
  { href: '/ofrendar', label: 'Ofrendar' },
] as const;

export const SOCIAL_LINKS = [
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/channel/UCAWlij0J4GNbD1QgY3It_Bw',
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/profile.php?id=100089851680572',
  },
  {
    label: 'WhatsApp',
    href: CHURCH.whatsapp,
  },
] as const;

export const MESSAGE = {
  youtubeId: '2mj-qXRdrHU',
  title: 'Sabiduría en las relaciones familiares',
  speaker: 'Pastor Manuel Carrasco',
  thumbnail: '/images/message-sabiduria-relaciones-familiares.jpg',
} as const;

export const WHATSAPP_LINKS = {
  visit:
    'https://wa.me/524424112143?text=Hola%2C%20quisiera%20planear%20mi%20primera%20visita%20a%20Amistad%20Nueva%20Creaci%C3%B3n.',
  prayer:
    'https://wa.me/524424112143?text=Hola%20pastor%2C%20me%20gustar%C3%ADa%20solicitar%20apoyo%20en%20oraci%C3%B3n%20para%20una%20necesidad%20personal%2Ffamiliar.',
  directions:
    'https://wa.me/524424112143?text=Hola%2C%20quisiera%20orientaci%C3%B3n%20para%20llegar%20a%20la%20iglesia.',
} as const;
