import { Pool } from 'pg';

/**
 * Pool de connexions PostgreSQL.
 *
 * Un "pool" maintient plusieurs connexions ouvertes en permanence,
 * évitant d'en ouvrir une nouvelle à chaque requête (ce qui serait lent).
 * Le pool est partagé dans toute l'application via ce module.
 */
const pool = new Pool({
  host: 'localhost',
  database: 'geoptis',
  user: 'asad',
  port: 5432,
});

export default pool;