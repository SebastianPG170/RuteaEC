const pool = require('./db');

// Regiones, ciudades y categorias (datos que alimentan los dropdowns)
const catalogModel = {
  async regions() {
    const { rows } = await pool.query('SELECT id, name FROM regions ORDER BY name');
    return rows;
  },
  async categories() {
    const { rows } = await pool.query('SELECT id, name FROM categories ORDER BY name');
    return rows;
  },
  async citiesByRegion(regionId) {
    const { rows } = await pool.query(
      'SELECT id, name FROM cities WHERE region_id = $1 ORDER BY name',
      [regionId]
    );
    return rows;
  },
  async cityBelongsToRegion(cityId, regionId) {
    const { rowCount } = await pool.query(
      'SELECT 1 FROM cities WHERE id = $1 AND region_id = $2',
      [cityId, regionId]
    );
    return rowCount === 1;
  },
  async categoryExists(categoryId) {
    const { rowCount } = await pool.query('SELECT 1 FROM categories WHERE id = $1', [categoryId]);
    return rowCount === 1;
  },
  async regionExists(regionId) {
    const { rowCount } = await pool.query('SELECT 1 FROM regions WHERE id = $1', [regionId]);
    return rowCount === 1;
  },
};

module.exports = catalogModel;
