const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  database: 'geoptis',
  user: 'asad',
  port: 5432,
});

module.exports = pool;