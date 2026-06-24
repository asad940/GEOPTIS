import * as repo from '../repositories/restaurantRepository';
import { Restaurant, CreateRestaurantDto, PaginatedResult, CuisineType } from '../models/restaurant.model';
import { badRequest } from '../errors';

const CUISINE_TYPES: CuisineType[] = ['Française', 'Italienne', 'Asiatique', 'Américaine', 'Méditerranéenne', 'Autre'];

const LAT_MIN = -90;
const LAT_MAX = 90;
const LNG_MIN = -180;
const LNG_MAX = 180;

/** Vérifie que la latitude et la longitude sont des nombres dans les plages autorisées. */
function validateCoordinates(latitude: any, longitude: any): { lat: number; lng: number } {
  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);

  if (isNaN(lat) || lat < LAT_MIN || lat > LAT_MAX)
    throw badRequest(`Latitude invalide : doit être un nombre décimal entre ${LAT_MIN} et ${LAT_MAX}`);

  if (isNaN(lng) || lng < LNG_MIN || lng > LNG_MAX)
    throw badRequest(`Longitude invalide : doit être un nombre décimal entre ${LNG_MIN} et ${LNG_MAX}`);

  return { lat, lng };
}

/** Vérifie que tous les champs obligatoires sont présents et valides. */
function validateRestaurantData(data: any): void {
  if (!data.name || data.name.trim().length < 3)
    throw badRequest('Le nom est requis (minimum 3 caractères)');

  if (!data.address || data.address.trim().length < 10)
    throw badRequest("L'adresse est requise (minimum 10 caractères)");

  if (data.latitude === undefined || data.latitude === null)
    throw badRequest('La latitude est requise');

  if (data.longitude === undefined || data.longitude === null)
    throw badRequest('La longitude est requise');

  if (!data.cuisine_type || !CUISINE_TYPES.includes(data.cuisine_type))
    throw badRequest(`Le type de cuisine doit être l'un de : ${CUISINE_TYPES.join(', ')}`);

  const phoneRegex = /^(\+?\d[\d\s\-().]{6,19})?$/;
  if (data.phone_number && !phoneRegex.test(data.phone_number))
    throw badRequest('Format de téléphone invalide (ex: +33 1 23 45 67 89)');
}

/** Retourne la liste paginée de tous les restaurants. */
export async function getAllRestaurants(page = 1, limit = 10): Promise<PaginatedResult<Restaurant>> {
  const { rows, total } = await repo.findAll(page, limit);

  return {
    data: rows,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

/** Recherche des restaurants par nom ou adresse. */
export async function searchRestaurants(q: string): Promise<Restaurant[]> {
  if (!q || q.trim() === '')
    throw badRequest('Paramètre de recherche manquant');

  return repo.search(q.trim());
}

/** Filtre les restaurants par type de cuisine. */
export async function filterRestaurants(cuisine: string): Promise<Restaurant[]> {
  if (!cuisine)
    throw badRequest('Paramètre cuisine manquant');

  if (!CUISINE_TYPES.includes(cuisine as CuisineType))
    throw badRequest(`Type de cuisine invalide. Valeurs acceptées : ${CUISINE_TYPES.join(', ')}`);

  return repo.filterByCuisine(cuisine);
}

/** Valide les données puis crée le restaurant en base. */
export async function createRestaurant(data: any): Promise<Restaurant> {
  validateRestaurantData(data);
  const { lat, lng } = validateCoordinates(data.latitude, data.longitude);

  const restaurant: CreateRestaurantDto = {
    name: data.name.trim(),
    address: data.address.trim(),
    latitude: lat,
    longitude: lng,
    cuisine_type: data.cuisine_type,
    phone_number: data.phone_number,
  };

  return repo.create(restaurant);
}