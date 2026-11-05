const express = require('express');
const rateLimit = require('express-rate-limit');
const { requireAdmin } = require('../middleware/auth');
const auth = require('../controllers/authController');
const catalog = require('../controllers/catalogController');
const experiences = require('../controllers/experienceController');
const cities = require('../controllers/cityController');

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false,
  message: { error: 'Demasiados intentos. Espera 15 minutos.' },
});

router.post('/auth/login', loginLimiter, auth.login);
router.post('/auth/logout', auth.logout);
router.get('/auth/me', auth.me);

// Todo lo de abajo exige sesion de administrador
router.use(requireAdmin);

router.get('/regions', catalog.regions);
router.get('/regions/:regionId/cities', catalog.citiesByRegion);
router.get('/categories', catalog.categories);

router.get('/experiences', experiences.list);
router.get('/experiences/:id', experiences.get);
router.post('/experiences', experiences.create);
router.put('/experiences/:id', experiences.update);
router.delete('/experiences/:id', experiences.remove);

router.get('/cities', cities.list);
router.post('/cities', cities.create);
router.delete('/cities/:id', cities.remove);

module.exports = router;
