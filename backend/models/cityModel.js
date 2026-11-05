const pool = require('./db');

const cityModel = {
  async list() {
    const { rows } = await pool.query(
      `SELECT c.id, c.name, r.name AS region,
              (SELECT COUNT(*) FROM experiences e WHERE e.city_id = c.id)::int AS experiences
         FROM cities c JOIN regions r ON r.id = c.region_id
        ORDER BY r.name, c.name`
    );
    return rows;
  },
  async create(name, regionId) {
    await pool.query('INSERT INTO cities (name, region_id) VALUES ($1, $2)', [name, regionId]);
  },
  async remove(id) {
    await pool.query('DELETE FROM cities WHERE id = $1', [id]);
  },
};

module.exports = cityModel;
