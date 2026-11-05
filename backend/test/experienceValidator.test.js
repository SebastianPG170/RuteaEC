const test = require('node:test');
const assert = require('node:assert');
const { validateExperience, validateCity } = require('../validators/experienceValidator');

const base = {
  name: 'Tour del chocolate', description: '', price: '12.50',
  durationMinutes: '60', regionId: '2', cityId: '5', categoryId: '2', active: 'on',
};

test('acepta una experiencia valida', () => {
  const r = validateExperience(base);
  assert.strictEqual(r.ok, true);
  assert.strictEqual(r.values.price, 12.5);
  assert.strictEqual(r.values.durationMinutes, 60);
});

test('rechaza precios invalidos', () => {
  for (const price of ['0', '-5', 'abc', '12.555', '1001', '']) {
    assert.ok(validateExperience({ ...base, price }).errors.price, `precio ${price}`);
  }
});

test('acepta coma decimal', () => {
  assert.strictEqual(validateExperience({ ...base, price: '9,90' }).values.price, 9.9);
});

test('rechaza duraciones invalidas', () => {
  for (const durationMinutes of ['0', '10', '721', '50', '1.5', 'x']) {
    assert.ok(validateExperience({ ...base, durationMinutes }).errors.durationMinutes, durationMinutes);
  }
});

test('exige region, ciudad y categoria', () => {
  const r = validateExperience({ ...base, regionId: '', cityId: 'abc', categoryId: '0' });
  assert.ok(r.errors.regionId && r.errors.cityId && r.errors.categoryId);
});

test('valida ciudad', () => {
  assert.strictEqual(validateCity({ name: 'Cuenca', regionId: '2' }).ok, true);
  assert.strictEqual(validateCity({ name: 'C', regionId: '' }).ok, false);
});
