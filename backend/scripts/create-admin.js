// Crea (o cambia la clave de) un administrador con la clave guardada como hash bcrypt
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const bcrypt = require('bcryptjs');
const pool = require('../models/db');
const adminModel = require('../models/adminModel');

(async () => {
  const email = String(process.env.ADMIN_EMAIL ?? '').trim().toLowerCase();
  const password = String(process.env.ADMIN_PASSWORD ?? '');
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error('ADMIN_EMAIL no es un correo valido');
  if (password.length < 10) throw new Error('ADMIN_PASSWORD debe tener al menos 10 caracteres');
  await adminModel.upsert(email, await bcrypt.hash(password, 12));
  console.log(`Administrador listo: ${email}`);
  await pool.end();
})().catch((e) => { console.error(e.message); process.exit(1); });
