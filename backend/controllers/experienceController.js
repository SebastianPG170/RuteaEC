const experienceModel = require('../models/experienceModel');
const catalogModel = require('../models/catalogModel');
const { validateExperience } = require('../validators/experienceValidator');

// Segunda capa de validacion: revisa contra la base de datos.
// Aunque el dropdown ya filtra, alguien puede enviar cualquier ciudad con cualquier region.
async function checkReferences(result) {
  const errors = { ...result.errors };
  const v = result.values;
  if (!errors.regionId && !errors.cityId && !(await catalogModel.cityBelongsToRegion(v.cityId, v.regionId))) {
    errors.cityId = 'Esa ciudad no pertenece a la región elegida.';
  }
  if (!errors.categoryId && !(await catalogModel.categoryExists(v.categoryId))) {
    errors.categoryId = 'La categoría elegida no existe.';
  }
  return errors;
}

function validationError(res, fields) {
  return res.status(400).json({ error: 'Revisa los campos marcados.', fields });
}

function duplicateError(e, res) {
  if (e.code !== '23505') throw e;
  return validationError(res, { name: 'Ya existe una experiencia con ese nombre en esa ciudad.' });
}

function parseId(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ error: 'Id inválido.' });
    return null;
  }
  return id;
}

const experienceController = {
  async list(req, res) {
    res.json(await experienceModel.list());
  },

  async get(req, res) {
    const id = parseId(req, res);
    if (!id) return;
    const row = await experienceModel.find(id);
    if (!row) return res.status(404).json({ error: 'Esa experiencia no existe.' });
    res.json({
      id: row.id, name: row.name, description: row.description, price: row.price,
      durationMinutes: row.duration_minutes, regionId: row.region_id,
      cityId: row.city_id, categoryId: row.category_id, active: row.active,
    });
  },

  async create(req, res) {
    const result = validateExperience(req.body);
    const errors = await checkReferences(result);
    if (Object.keys(errors).length) return validationError(res, errors);
    try {
      await experienceModel.create(result.values);
    } catch (e) {
      return duplicateError(e, res);
    }
    res.status(201).json({ ok: true });
  },

  async update(req, res) {
    const id = parseId(req, res);
    if (!id) return;
    if (!(await experienceModel.find(id))) return res.status(404).json({ error: 'Esa experiencia no existe.' });
    const result = validateExperience(req.body);
    const errors = await checkReferences(result);
    if (Object.keys(errors).length) return validationError(res, errors);
    try {
      await experienceModel.update(id, result.values);
    } catch (e) {
      return duplicateError(e, res);
    }
    res.json({ ok: true });
  },

  async remove(req, res) {
    const id = parseId(req, res);
    if (!id) return;
    await experienceModel.remove(id);
    res.status(204).end();
  },
};

module.exports = experienceController;
