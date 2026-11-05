const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const fs = require('fs');
const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const { requireFetchHeader } = require('./middleware/auth');
const routes = require('./routes');

const app = express();
const isProd = process.env.NODE_ENV === 'production';

if (!process.env.SESSION_SECRET) {
  console.error('Falta SESSION_SECRET en backend/.env');
  process.exit(1);
}

app.set('trust proxy', 1); // Render va detras de un proxy HTTPS
app.use(helmet());
app.use(express.json({ limit: '20kb' }));
app.use(session({
  secret: process.env.SESSION_SECRET,
  name: 'sid',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax', secure: isProd, maxAge: 1000 * 60 * 60 * 2 },
}));

app.use('/api', requireFetchHeader, routes);
app.use('/api', (req, res) => res.status(404).json({ error: 'Ruta no encontrada.' }));

// En produccion Express tambien entrega el frontend compilado (frontend/dist)
const dist = path.join(__dirname, '..', 'frontend', 'dist');
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get(/^(?!\/api).*/, (req, res) => res.sendFile(path.join(dist, 'index.html')));
}

// Express 5 envia aqui los errores de funciones async
app.use((err, req, res, next) => {
  console.error(err);
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'JSON inválido.' });
  res.status(500).json({ error: 'Algo fallo en el servidor.' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API escuchando en http://localhost:${port}`));
