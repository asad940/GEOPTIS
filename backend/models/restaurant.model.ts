// number = IEEE 754 double precision, mapped to DECIMAL(10,8)/DECIMAL(11,8) in PostgreSQL
export type CuisineType = 'Française' | 'Italienne' | 'Asiatique' | 'Américaine' | 'Méditerranéenne' | 'Autre';

export interface Restaurant {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  cuisine_type: CuisineType;
  phone_number: string | null;
  created_at: Date;
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