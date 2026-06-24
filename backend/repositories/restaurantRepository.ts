import pool from '../db';
import { Restaurant, CreateRestaurantDto } from '../models/restaurant.model';

// Le driver pg retourne les colonnes DECIMAL en string — on les convertit en number ici
function parseCoords(row: any): Restaurant {
  return {
    ...row,
    latitude: parseFloat(row.latitude),
    longitude: parseFloat(row.longitude),
  };
}

/** Retourne une page de restaurants triés du plus récent au plus ancien. */
export async function findAll(page: number, limit: number): Promise<{ rows: Restaurant[]; total: number }> {
  const offset = (page - 1) * limit;

  const [rowsResult, countResult] = await Promise.all([
    pool.query('SELECT * FROM restaurants ORDER BY created_at DESC LIMIT $1 OFFSET $2', [limit, offset]),
    pool.query<{ count: string }>('SELECT COUNT(*) FROM restaurants'),
  ]);

  return {
    rows: rowsResult.rows.map(parseCoords),
    total: parseInt(countResult.rows[0].count, 10),
  };
}

/** Recherche par nom ou adresse, insensible à la casse (ILIKE). */
export async function search(term: string): Promise<Restaurant[]> {
  const pattern = `%${term}%`;

  const result = await pool.query(
    'SELECT * FROM restaurants WHERE name ILIKE $1 OR address ILIKE $1 ORDER BY created_at DESC',
    [pattern]
  );

  return result.rows.map(parseCoords);
}

/** Filtre les restaurants par type de cuisine exact. */
export async function filterByCuisine(cuisine: string): Promise<Restaurant[]> {
  const result = await pool.query(
    'SELECT * FROM restaurants WHERE cuisine_type = $1 ORDER BY created_at DESC',
    [cuisine]
  );

  return result.rows.map(parseCoords);
}

/** Insère un restaurant et retourne la ligne créée avec son id et created_at. */
export async function create(data: CreateRestaurantDto): Promise<Restaurant> {
  const result = await pool.query(
    `INSERT INTO restaurants (name, address, latitude, longitude, cuisine_type, phone_number)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [data.name, data.address, data.latitude, data.longitude, data.cuisine_type, data.phone_number ?? null]
  );

  return parseCoords(result.rows[0]);
}