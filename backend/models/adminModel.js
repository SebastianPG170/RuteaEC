const pool = require('./db');

const adminModel = {
  async findByEmail(email) {
    const { rows } = await pool.query('SELECT id, email, password_hash FROM admins WHERE email = $1', [email]);
    return rows[0] || null;
  },
  async upsert(email, passwordHash) {
    await pool.query(
      `INSERT INTO admins (email, password_hash) VALUES ($1, $2)
       ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
      [email, passwordHash]
    );
  },
};

module.exports = adminModel;
