-- Migration: Reset partidos table and insert full 24-match fixture with stadiums
-- This script truncates the table (restarting IDs) and inserts 24 matches with `estadio` field.

BEGIN;

TRUNCATE TABLE partidos RESTART IDENTITY CASCADE;

INSERT INTO partidos (equipo_local, equipo_visita, grupo, fecha_partido, estado, estadio) VALUES
  -- Group A
  ('México', 'Arabia Saudita', 'A', '2026-06-11T18:00:00+00:00', 'pendiente', 'Estadio Azteca'),
  ('USA', 'Gales', 'A', '2026-06-12T21:00:00+00:00', 'pendiente', 'SoFi Stadium'),
  -- Group B
  ('Canadá', 'Togo', 'B', '2026-06-12T18:00:00+00:00', 'pendiente', 'BC Place'),
  ('Italia', 'Corea del Sur', 'B', '2026-06-13T21:00:00+00:00', 'pendiente', 'MetLife Stadium'),
  -- Group C
  ('España', 'Camerún', 'C', '2026-06-13T18:00:00+00:00', 'pendiente', 'Hard Rock Stadium'),
  ('Argentina', 'Suecia', 'C', '2026-06-14T21:00:00+00:00', 'pendiente', 'NRG Stadium'),
  -- Group D
  ('Brasil', 'Irán', 'D', '2026-06-14T18:00:00+00:00', 'pendiente', 'MetLife Stadium'),
  ('Francia', 'Australia', 'D', '2026-06-15T21:00:00+00:00', 'pendiente', 'Arrowhead Stadium'),
  -- Group E
  ('Bélgica', 'Túnez', 'E', '2026-06-16T18:00:00+00:00', 'pendiente', 'AT&T Stadium'),
  ('Marruecos', 'Escocia', 'E', '2026-06-16T21:00:00+00:00', 'pendiente', 'Lumen Field'),
  -- Group F
  ('Croacia', 'Ecuador', 'F', '2026-06-17T18:00:00+00:00', 'pendiente', "Levi's Stadium"),
  ('Inglaterra', 'Nueva Zelanda', 'F', '2026-06-17T21:00:00+00:00', 'pendiente', 'Gillette Stadium'),
  -- Group G
  ('Japón', 'Nigeria', 'G', '2026-06-18T18:00:00+00:00', 'pendiente', 'Mercedes-Benz Stadium'),
  ('Alemania', 'Perú', 'G', '2026-06-18T21:00:00+00:00', 'pendiente', 'Lincoln Financial Field'),
  -- Group H
  ('Portugal', 'Honduras', 'H', '2026-06-19T18:00:00+00:00', 'pendiente', 'Hard Rock Stadium'),
  ('Colombia', 'Austria', 'H', '2026-06-19T21:00:00+00:00', 'pendiente', 'NRG Stadium'),
  -- Group I
  ('Países Bajos', 'Uzbekistán', 'I', '2026-06-20T18:00:00+00:00', 'pendiente', 'SoFi Stadium'),
  ('Uruguay', 'Ghana', 'I', '2026-06-20T21:00:00+00:00', 'pendiente', 'Estadio Azteca'),
  -- Group J
  ('Dinamarca', 'Costa Rica', 'J', '2026-06-21T18:00:00+00:00', 'pendiente', 'BC Place'),
  ('Suiza', 'Mali', 'J', '2026-06-21T21:00:00+00:00', 'pendiente', 'Lumen Field'),
  -- Group K
  ('Estados Unidos', 'Panamá', 'K', '2026-06-22T18:00:00+00:00', 'pendiente', 'AT&T Stadium'),
  ('México', 'Jamaica', 'K', '2026-06-22T21:00:00+00:00', 'pendiente', 'Estadio BBVA'),
  -- Group L
  ('Argentina', 'Ucrania', 'L', '2026-06-23T18:00:00+00:00', 'pendiente', 'MetLife Stadium'),
  ('Brasil', 'República Checa', 'L', '2026-06-23T21:00:00+00:00', 'pendiente', "Levi's Stadium");

COMMIT;
