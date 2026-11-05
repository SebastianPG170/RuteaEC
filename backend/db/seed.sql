INSERT INTO regions (name) VALUES ('Costa'), ('Sierra'), ('Amazonía')
  ON CONFLICT (name) DO NOTHING;

INSERT INTO categories (name) VALUES ('Aventura'), ('Chocolate'), ('Gastronomía'), ('Cultura'), ('Naturaleza')
  ON CONFLICT (name) DO NOTHING;

INSERT INTO cities (name, region_id) VALUES
  ('Guayaquil', (SELECT id FROM regions WHERE name = 'Costa')),
  ('Montañita', (SELECT id FROM regions WHERE name = 'Costa')),
  ('Quito',     (SELECT id FROM regions WHERE name = 'Sierra')),
  ('Baños',     (SELECT id FROM regions WHERE name = 'Sierra')),
  ('Mindo',     (SELECT id FROM regions WHERE name = 'Sierra')),
  ('Tena',      (SELECT id FROM regions WHERE name = 'Amazonía'))
  ON CONFLICT (region_id, name) DO NOTHING;
