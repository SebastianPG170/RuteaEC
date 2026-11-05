// Cada region tiene su color. Asi se reconoce de un vistazo de donde es cada experiencia.
export function claseRegion(nombre = '') {
  const clave = nombre.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  return ['costa', 'sierra', 'amazonia'].includes(clave) ? `tag--${clave}` : '';
}
