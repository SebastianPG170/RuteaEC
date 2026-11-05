// Validacion en BACK-END de los datos sensibles del core:
// precio y duracion definen el puntaje de aprovechamiento, asi que no se confia en el navegador.
// Funcion pura: no toca la base de datos, por eso se puede probar sola.

const PRICE_REGEX = /^\d{1,4}(\.\d{1,2})?$/; // hasta 4 enteros y 2 decimales

function toId(value) {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
}

function validateExperience(input = {}) {
  const errors = {};
  const name = String(input.name ?? '').trim().replace(/\s+/g, ' ');
  const description = String(input.description ?? '').trim();
  const priceText = String(input.price ?? '').trim().replace(',', '.');
  const durationText = String(input.durationMinutes ?? '').trim();
  const regionId = toId(input.regionId);
  const cityId = toId(input.cityId);
  const categoryId = toId(input.categoryId);

  if (name.length < 3 || name.length > 80) errors.name = 'El nombre debe tener entre 3 y 80 caracteres.';
  if (description.length > 300) errors.description = 'La descripción no puede pasar de 300 caracteres.';

  // DATO SENSIBLE 1: precio
  let price = null;
  if (!PRICE_REGEX.test(priceText)) {
    errors.price = 'El precio debe ser un número con máximo 2 decimales, por ejemplo 12.50.';
  } else {
    price = Number(priceText);
    if (price <= 0 || price > 1000) errors.price = 'El precio debe ser mayor que 0 y no pasar de 1000 dólares.';
  }

  // DATO SENSIBLE 2: duracion en minutos
  let durationMinutes = null;
  if (!/^\d+$/.test(durationText)) {
    errors.durationMinutes = 'La duración debe ser un número entero de minutos.';
  } else {
    durationMinutes = Number(durationText);
    if (durationMinutes < 15 || durationMinutes > 720) {
      errors.durationMinutes = 'La duración debe estar entre 15 y 720 minutos.';
    } else if (durationMinutes % 15 !== 0) {
      errors.durationMinutes = 'La duración debe ir de 15 en 15 minutos (15, 30, 45, 60...).';
    }
  }

  if (!regionId) errors.regionId = 'Elige una región.';
  if (!cityId) errors.cityId = 'Elige una ciudad.';
  if (!categoryId) errors.categoryId = 'Elige una categoría.';

  return {
    errors,
    ok: Object.keys(errors).length === 0,
    values: {
      name,
      description,
      price,
      durationMinutes,
      regionId,
      cityId,
      categoryId,
      active: input.active === true || input.active === 'on' || input.active === 'true',
    },
  };
}

function validateCity(input = {}) {
  const errors = {};
  const name = String(input.name ?? '').trim().replace(/\s+/g, ' ');
  const regionId = toId(input.regionId);
  if (name.length < 2 || name.length > 60) errors.name = 'El nombre debe tener entre 2 y 60 caracteres.';
  if (!regionId) errors.regionId = 'Elige una región.';
  return { errors, ok: Object.keys(errors).length === 0, values: { name, regionId } };
}

module.exports = { validateExperience, validateCity };
