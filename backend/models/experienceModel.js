const pool = require('./db');

const experienceModel = {
  async list() {
    const { rows } = await pool.query(
      `SELECT e.id, e.name, e.duration_minutes, e.price, e.active,
              c.name AS city, r.name AS region, cat.name AS category
         FROM experiences e
         JOIN cities c ON c.id = e.city_id
         JOIN regions r ON r.id = c.region_id
         JOIN categories cat ON cat.id = e.category_id
        ORDER BY r.name, c.name, e.name`
    );
    return rows;
  },
  async find(id) {
    const { rows } = await pool.query(
      `SELECT e.*, c.region_id
         FROM experiences e JOIN cities c ON c.id = e.city_id
        WHERE e.id = $1`,
      [id]
    );
    return rows[0] || null;
  },
  async create(v) {
    await pool.query(
      `INSERT INTO experiences (name, description, city_id, category_id, duration_minutes, price, active)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [v.name, v.description, v.cityId, v.categoryId, v.durationMinutes, v.price, v.active]
    );
  },
  async update(id, v) {
    await pool.query(
      `UPDATE experiences
          SET name = $1, description = $2, city_id = $3, category_id = $4,
              duration_minutes = $5, price = $6, active = $7
        WHERE id = $8`,
      [v.name, v.description, v.cityId, v.categoryId, v.durationMinutes, v.price, v.active, id]
    );
  },
  async remove(id) {
    await pool.query('DELETE FROM experiences WHERE id = $1', [id]);
  },
};

module.exports = experienceModel;
