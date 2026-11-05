const cityModel = require('../models/cityModel');
const catalogModel = require('../models/catalogModel');
const { validateCity } = require('../validators/experienceValidator');

const cityController = {
  async list(req, res) {
    res.json(await cityModel.list());
  },

  async create(req, res) {
    const result = validateCity(req.body);
    const errors = { ...result.errors };
    if (!errors.regionId && !(await catalogModel.regionExists(result.values.regionId))) {
      errors.regionId = 'La región elegida no existe.';
    }
    if (Object.keys(errors).length) return res.status(400).json({ error: 'Revisa los campos marcados.', fields: errors });
    try {
      await cityModel.create(result.values.name, result.values.regionId);
    } catch (e) {
      if (e.code !== '23505') throw e;
      return res.status(400).json({ error: 'Revisa los campos marcados.', fields: { name: 'Esa ciudad ya existe en la región elegida.' } });
    }
    res.status(201).json({ ok: true });
  },

  async remove(req, res) {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) return res.status(400).json({ error: 'Id inválido.' });
    try {
      await cityModel.remove(id);
    } catch (e) {
      // 23503 = la ciudad todavia tiene experiencias
      if (e.code !== '23503') throw e;
      return res.status(409).json({ error: 'La ciudad tiene experiencias. Bórralas o muévelas primero.' });
    }
    res.status(204).end();
  },
};

module.exports = cityController;
