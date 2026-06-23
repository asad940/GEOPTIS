var express = require('express');
var router = express.Router();
var pool = require('../db');

router.get('/search', async function(req, res) {
  try {
    const q = `%${req.query.q || ''}%`;
    const result = await pool.query(
      'SELECT * FROM restaurants WHERE name ILIKE $1 OR address ILIKE $1 ORDER BY created_at DESC',
      [q]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/filter', async function(req, res) {
  try {
    const result = await pool.query(
      'SELECT * FROM restaurants WHERE cuisine_type = $1 ORDER BY created_at DESC',
      [req.query.cuisine]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async function(req, res) {
  try {
    const result = await pool.query('SELECT * FROM restaurants ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async function(req, res) {
  const { name, address, latitude, longitude, cuisine_type, phone_number } = req.body;

  if (latitude < -90 || latitude > 90)
    return res.status(400).json({ error: 'Latitude doit être entre -90 et 90' });
  if (longitude < -180 || longitude > 180)
    return res.status(400).json({ error: 'Longitude doit être entre -180 et 180' });

  try {
    const result = await pool.query(
      'INSERT INTO restaurants (name, address, latitude, longitude, cuisine_type, phone_number) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [name, address, latitude, longitude, cuisine_type, phone_number || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;