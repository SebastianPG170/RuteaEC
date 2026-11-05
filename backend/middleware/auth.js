// Solo deja pasar a quien inicio sesion como administrador
function requireAdmin(req, res, next) {
  if (req.session && req.session.adminId) return next();
  return res.status(401).json({ error: 'Debes iniciar sesión.' });
}

// Defensa contra CSRF: la cookie es SameSite=Lax y ademas toda peticion que cambia datos
// debe traer este encabezado, que un formulario de otro sitio no puede enviar.
function requireFetchHeader(req, res, next) {
  const safe = ['GET', 'HEAD', 'OPTIONS'].includes(req.method);
  if (!safe && req.get('X-Requested-With') !== 'fetch') {
    return res.status(403).json({ error: 'Petición no permitida.' });
  }
  next();
}

module.exports = { requireAdmin, requireFetchHeader };
