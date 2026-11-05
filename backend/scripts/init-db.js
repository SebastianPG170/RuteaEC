// Crea las tablas y carga regiones, ciudades y categorias iniciales. Se puede correr varias veces.
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const fs = require('fs');
const path = require('path');
const pool = require('../models/db');

(async () => {
  for (const file of ['schema.sql', 'seed.sql']) {
    await pool.query(fs.readFileSync(path.join(__dirname, '..', 'db', file), 'utf8'));
    console.log(`OK ${file}`);
  }
  await pool.end();
})().catch((e) => { console.error(e.message); process.exit(1); });
