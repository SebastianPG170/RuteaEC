const catalogModel = require('../models/catalogModel');

const catalogController = {
  async regions(req, res) {
    res.json(await catalogModel.regions());
  },
  async categories(req, res) {
    res.json(await catalogModel.categories());
  },
  // Para el dropdown dependiente: ciudades de una region
  async citiesByRegion(req, res) {
    const regionId = Number(req.params.regionId);
    if (!Number.isInteger(regionId) || regionId < 1) return res.status(400).json({ error: 'Región inválida.' });
    res.json(await catalogModel.citiesByRegion(regionId));
  },
};

module.exports = catalogController;
