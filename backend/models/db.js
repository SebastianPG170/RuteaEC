const { Pool } = require('pg');

// Supabase exige SSL. Para una base local sin SSL usa DATABASE_SSL=false
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'false' ? false : { rejectUnauthorized: false },
});

module.exports = pool;
