import { Pool } from 'pg';

/**
 * Pool de connexions PostgreSQL.
 *
 * Un "pool" maintient plusieurs connexions ouvertes en permanence,
 * évitant d'en ouvrir une nouvelle à chaque requête (ce qui serait lent).
 * Le pool est partagé dans toute l'application via ce module.
 */
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'geoptis',
  user: process.env.DB_USER || process.env.USER,
  password: process.env.DB_PASSWORD || '',
  port: Number(process.env.DB_PORT) || 5432,
});

export default pool;