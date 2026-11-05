const bcrypt = require('bcryptjs');
const adminModel = require('../models/adminModel');

// Hash falso para gastar el mismo tiempo cuando el correo no existe
const DUMMY_HASH = bcrypt.hashSync('no-existe', 12);

const authController = {
  me(req, res) {
    if (!req.session.adminId) return res.status(401).json({ error: 'Sin sesión.' });
    res.json({ email: req.session.adminEmail });
  },

  async login(req, res) {
    const email = String(req.body?.email ?? '').trim().toLowerCase();
    const password = String(req.body?.password ?? '');
    const admin = await adminModel.findByEmail(email);
    const ok = await bcrypt.compare(password, admin ? admin.password_hash : DUMMY_HASH);
    if (!admin || !ok) return res.status(401).json({ error: 'Correo o clave incorrectos.' });

    // Sesion nueva al iniciar para evitar fijacion de sesion
    req.session.regenerate((err) => {
      if (err) return res.status(500).json({ error: 'No se pudo iniciar sesión.' });
      req.session.adminId = admin.id;
      req.session.adminEmail = admin.email;
      req.session.save(() => res.json({ email: admin.email }));
    });
  },

  logout(req, res) {
    req.session.destroy(() => res.status(204).end());
  },
};

module.exports = authController;
