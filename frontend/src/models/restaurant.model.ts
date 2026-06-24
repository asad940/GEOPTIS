export type CuisineType = 'Française' | 'Italienne' | 'Asiatique' | 'Américaine' | 'Méditerranéenne' | 'Autre';

export const CUISINE_TYPES: CuisineType[] = [
  'Française', 'Italienne', 'Asiatique', 'Américaine', 'Méditerranéenne', 'Autre',
];

export const CUISINE_COLORS: Record<CuisineType, string> = {
  Française: '#3B82F6',
  Italienne: '#22C55E',
  Asiatique: '#EF4444',
  Américaine: '#F97316',
  Méditerranéenne: '#A855F7',
  Autre: '#6B7280',
};

export const CUISINE_EMOJIS: Record<CuisineType, string> = {
  Française: '🇫🇷',
  Italienne: '🇮🇹',
  Asiatique: '🥢',
  Américaine: '🍔',
  Méditerranéenne: '🫒',
  Autre: '🍽️',
};

export interface Restaurant {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  cuisine_type: CuisineType;
  phone_number: string | null;
  created_at: string;
}

export interface CreateRestaurantDto {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  cuisine_type: CuisineType;
  phone_number?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
