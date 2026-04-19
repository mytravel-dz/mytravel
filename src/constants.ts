import { Trip, VisaInfo } from './types';

export type { Trip, VisaInfo };

export const FEATURED_TRIPS: Trip[] = [
  {
    id: '1',
    title: 'Egypt',
    description: 'Explore the pyramids and the Nile in this 8-day historical journey.',
    price: '135,000 DA',
    image: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&q=80&w=800',
    duration: '8 Days',
    location: 'Egypt'
  },
  {
    id: '2',
    title: 'Istanbul',
    description: 'Discover the magic of Turkey from the Bosphorus to the fairy chimneys.',
    price: '105,000 DA',
    image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&q=80&w=800',
    duration: '8 Jrs',
    location: 'Turkey'
  },
  {
    id: '3',
    title: 'Maldives',
    description: 'Luxury escape in a tropical paradise with crystal clear waters.',
    price: '170,000 DA',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80&w=800',
    duration: '7 Days',
    location: 'Maldives'
  },
  {
    id: '4',
    title: 'Bali',
    description: 'Experience the spiritual and natural beauty of Indonesia.',
    price: '280,000 DA',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=800',
    duration: '10 Jrs',
    location: 'Indonesia'
  },
  {
    id: '5',
    title: 'Omra',
    description: 'Complete Umrah services with premium accommodation and guidance.',
    price: '140,000 DA',
    image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&q=80&w=800',
    duration: '15 Days',
    location: 'Saudi Arabia'
  }
];

export const VISA_INFO: VisaInfo[] = [
  // Main Visas
  {
    id: 'v1',
    country: 'Turkey',
    image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&q=80&w=800',
    type: 'Tourist Visa',
    processingTime: '10-15 Days',
    requirement: 'Passport, Photo 5/6, Bank Statement, Work Certificate',
    category: 'main',
    details: {
      en: 'Complete assistance for Turkey sticker visa.',
      fr: 'Assistance complète pour le visa vignette Turquie.',
      ar: 'مساعدة كاملة للحصول على تأشيرة تركيا (الملصق).'
    } as any
  },
  {
    id: 'v2',
    country: 'France',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800',
    type: 'Schengen Visa',
    processingTime: '15-30 Days',
    requirement: 'Passport, Insurance, Bank Statement, Work Certificate',
    category: 'main'
  },
  {
    id: 'v3',
    country: 'Italy',
    image: 'https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&q=80&w=800',
    type: 'Schengen Visa',
    processingTime: '15-30 Days',
    requirement: 'Passport, Insurance, Bank Statement, Work Certificate',
    category: 'main'
  },
  {
    id: 'v4',
    country: 'China',
    image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&q=80&w=800',
    type: 'Tourist Visa',
    processingTime: '7-10 Days',
    price: '18,500 DA',
    requirement: 'Passport, Photo, Work Certificate, Bank Account (>3000€)',
    category: 'main',
    dossier: [
      'Copie de la 1ère page du passeport',
      '01 photo 5/5 fond blanc',
      'Registre de commerce ou attestation de travail',
      'Compte en euro plus de 3000 euro',
      'Casier judiciaire'
    ]
  },
  {
    id: 'v5',
    country: 'Germany',
    image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&q=80&w=800',
    type: 'Schengen Visa',
    processingTime: '15-30 Days',
    requirement: 'Passport, Insurance, Bank Statement, Work Certificate',
    category: 'main'
  },

  // E-Visas
  {
    id: 'ev1',
    country: 'Turkey B1 (E-Visa)',
    image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&q=80&w=800',
    type: 'E-Visa B1',
    processingTime: '24 Hours',
    requirement: 'Schengen/UK/USA Visa, Age > 35',
    category: 'evisa',
    validity: '6 months',
    stay: '30 days',
    entries: 'Single',
    conditions: [
      'Le client doit avoir un visa Schengen ou UK ou USA',
      'La personne doit avoir plus de 35 ans d\'âge'
    ]
  },
  {
    id: 'ev2',
    country: 'Dubai (UAE)',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=800',
    type: 'Tourist E-Visa',
    processingTime: '1-3 Days',
    price: '28,000 DA',
    category: 'evisa',
    stay: '30 days',
    entries: 'Single',
    conditions: [
      'Délais de traitement : une semaine (sans weekend)',
      'Visa individuel (Adulte, CHD et INF) Il n\'y a pas de réduction',
      'Les frais de visa ne sont pas remboursables en cas de refus'
    ],
    details: {
      en: 'IMPORTANT: Fines apply for overstay (36,000 DA for 1 day, 220,000 DA for >9 days).',
      fr: 'IMPORTANT : Amendes pour dépassement (36 000 DA pour 1 jour, 220 000 DA pour >9 jours).',
      ar: 'هام: تطبق غرامات في حالة تجاوز مدة الإقامة (36,000 دج ليوم واحد، 220,000 دج لأكثر من 9 أيام).'
    } as any
  },
  {
    id: 'ev3',
    country: 'Thailand',
    image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=800',
    type: 'E-Visa',
    processingTime: '25-50 Days',
    price: '19,500 DA',
    category: 'evisa',
    dossier: [
      'Photo Biométrique',
      'Scan du passeport en cours de validité',
      'Scan de la Résidence moins de 2 mois (traduite en Français)',
      'Scan du relevé de compte bancaire (en devise)'
    ]
  },
  {
    id: 'ev4',
    country: 'Qatar',
    image: 'https://images.unsplash.com/photo-1594913785162-e6785b42fbb1?auto=format&fit=crop&q=80&w=800',
    type: 'E-Visa',
    processingTime: '3-5 Days',
    price: '15,000 DA',
    category: 'evisa',
    stay: '1 Month',
    dossier: ['Scan de Passport', 'Scan de photo (Fond Blanc)']
  },
  {
    id: 'ev5',
    country: 'Indonesia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=800',
    type: 'E-Visa',
    processingTime: '10+ Days',
    price: '27,000 DA',
    category: 'evisa',
    stay: '30 days',
    dossier: [
      'Copie de la 1ère page du passeport',
      '01 photo 5/5 fond blanc',
      'Compte en euro plus de 2500 euro'
    ]
  },
  {
    id: 'ev6',
    country: 'Singapore',
    image: 'https://images.unsplash.com/photo-1525625239912-466ae76ce59c?auto=format&fit=crop&q=80&w=800',
    type: 'E-Visa',
    processingTime: '10+ Days',
    price: '28,600 DA',
    category: 'evisa',
    stay: '30 days',
    entries: 'Single',
    dossier: ['Copie de la 1ère page du passeport', '01 photo fond blanc']
  },
  {
    id: 'ev7',
    country: 'Cambodia',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=800',
    type: 'E-Visa',
    processingTime: '3-7 Days',
    price: '19,500 DA',
    category: 'evisa',
    stay: '30 days',
    entries: 'Single'
  },
  {
    id: 'ev8',
    country: 'Cuba',
    image: 'https://images.unsplash.com/photo-1504109586057-7a2ae83d1338?auto=format&fit=crop&q=80&w=800',
    type: 'E-Visa',
    processingTime: '3-7 Days',
    price: '18,500 DA',
    category: 'evisa',
    stay: '30 days',
    entries: 'Single'
  },
  {
    id: 'ev9',
    country: 'Jordan',
    image: 'https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&q=80&w=800',
    type: 'E-Visa',
    processingTime: '48 Hours',
    price: '6,000 DA',
    category: 'evisa',
    validity: '90 days',
    stay: '30 days',
    entries: 'Single'
  },
  {
    id: 'ev10',
    country: 'Armenia',
    image: 'https://images.unsplash.com/photo-1527333656061-ca7adf608ae1?auto=format&fit=crop&q=80&w=800',
    type: 'E-Visa',
    processingTime: '3-7 Days',
    price: '8,000 DA',
    category: 'evisa',
    stay: '30 days',
    dossier: [
      'Copie de la 1ère page du passeport',
      '01 photo 5/5 fond blanc',
      'Relevé de compte en euro',
      'Réservation d\'hôtel'
    ]
  },
  {
    id: 'ev11',
    country: 'Azerbaijan',
    image: 'https://images.unsplash.com/photo-1565191999001-551c1874273d?auto=format&fit=crop&q=80&w=800',
    type: 'E-Visa',
    processingTime: '3-5 Days',
    price: '9,500 DA',
    category: 'evisa',
    stay: '30 days',
    dossier: ['Copie de la 1ère page du passeport', '01 photo 5/5 fond blanc']
  },

  // Residence
  {
    id: 'res1',
    country: 'Qatar Residence (Woman)',
    image: 'https://images.unsplash.com/photo-1594913785162-e6785b42fbb1?auto=format&fit=crop&q=80&w=800',
    type: 'Residence Permit',
    processingTime: '5-7 Days',
    price: '165,000 DA',
    category: 'residence',
    dossier: ['Copie de la 1ère page du passeport', '01 photo 5/5 fond blanc']
  },
  {
    id: 'res2',
    country: 'Qatar Residence (Man)',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800',
    type: 'Residence Permit',
    processingTime: '5-7 Days',
    price: '109,000 DA',
    category: 'residence',
    dossier: ['Copie de la 1ère page du passeport', '01 photo 5/5 fond blanc']
  },

  // Special
  {
    id: 'spec1',
    country: 'Egypt (Guarantee Letter)',
    image: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&q=80&w=800',
    type: 'Letter of Guarantee',
    processingTime: '2-3 Days',
    price: '5,000 DA',
    category: 'main',
    requirement: 'Passport, Confirmed Ticket',
    details: {
      en: 'Note: 30$ visa fee to be paid at the airport in Egypt.',
      fr: 'Note : Frais de visa de 30$ à payer à l\'aéroport en Égypte.',
      ar: 'ملاحظة: رسوم التأشيرة 30 دولاراً تدفع في المطار بمصر.'
    } as any
  }
];

export const AD_IMAGES = [
  "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1436491865332-7a61a109c0f2?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1502781259889-389f9503c034?auto=format&fit=crop&q=80&w=1000"
];
