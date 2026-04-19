export interface Trip {
  id: string;
  title: string;
  description: string;
  price: string;
  image: string;
  duration: string;
  location: string;
}

export interface VisaInfo {
  id: string;
  country: string;
  image: string;
  type: string;
  processingTime: string;
  requirement?: string;
  details?: string | any;
  price?: string;
  conditions?: string[];
  dossier?: string[];
  validity?: string;
  stay?: string;
  entries?: string;
  category?: 'main' | 'evisa' | 'residence';
}

export interface TripConsultation {
  visaRequirements: string;
  howToApply: string;
  bestTimeToVisit: string;
  estimatedCost: string;
}

export interface BookingOption {
  name: string;
  airline?: string;
  flightNumber?: string;
  departureTime?: string;
  arrivalTime?: string;
  duration?: string;
  stops?: number;
  priceEUR: number;
  details: string;
}

export type Language = 'ar' | 'en' | 'fr';
