-- Migration: Add World Cup 2026 group stage fixtures for Groups E through L
-- This script inserts the requested additional matches into partidos.

BEGIN;

INSERT INTO partidos (equipo_local, equipo_visita, grupo, fecha_partido, estado) VALUES
  -- Group E
  ('Bélgica', 'Túnez', 'E', '2026-06-16T18:00:00+00:00', 'pendiente'),
  ('Marruecos', 'Escocia', 'E', '2026-06-16T21:00:00+00:00', 'pendiente'),
  -- Group F
  ('Croacia', 'Ecuador', 'F', '2026-06-17T18:00:00+00:00', 'pendiente'),
  ('Inglaterra', 'Nueva Zelanda', 'F', '2026-06-17T21:00:00+00:00', 'pendiente'),
  -- Group G
  ('Japón', 'Nigeria', 'G', '2026-06-18T18:00:00+00:00', 'pendiente'),
  ('Alemania', 'Perú', 'G', '2026-06-18T21:00:00+00:00', 'pendiente'),
  -- Group H
  ('Portugal', 'Honduras', 'H', '2026-06-19T18:00:00+00:00', 'pendiente'),
  ('Colombia', 'Austria', 'H', '2026-06-19T21:00:00+00:00', 'pendiente'),
  -- Group I
  ('Países Bajos', 'Uzbekistán', 'I', '2026-06-20T18:00:00+00:00', 'pendiente'),
  ('Uruguay', 'Ghana', 'I', '2026-06-20T21:00:00+00:00', 'pendiente'),
  -- Group J
  ('Dinamarca', 'Costa Rica', 'J', '2026-06-21T18:00:00+00:00', 'pendiente'),
  ('Suiza', 'Mali', 'J', '2026-06-21T21:00:00+00:00', 'pendiente'),
  -- Group K
  ('Estados Unidos', 'Panamá', 'K', '2026-06-22T18:00:00+00:00', 'pendiente'),
  ('México', 'Jamaica', 'K', '2026-06-22T21:00:00+00:00', 'pendiente'),
  -- Group L
  ('Argentina', 'Ucrania', 'L', '2026-06-23T18:00:00+00:00', 'pendiente'),
  ('Brasil', 'República Checa', 'L', '2026-06-23T21:00:00+00:00', 'pendiente');

COMMIT;
