-- Migration: Replace current partidos fixture with the real 2026 World Cup group start matches for Groups A-D
-- This script deletes all rows from partidos and inserts the requested 8 pending fixtures.

BEGIN;

TRUNCATE TABLE partidos RESTART IDENTITY CASCADE;

INSERT INTO partidos (equipo_local, equipo_visita, grupo, fecha_partido, estado) VALUES
  ('México', 'Arabia Saudita', 'A', '2026-06-11T18:00:00+00:00', 'pendiente'),
  ('USA', 'Gales', 'A', '2026-06-12T21:00:00+00:00', 'pendiente'),
  ('Canadá', 'Togo', 'B', '2026-06-12T18:00:00+00:00', 'pendiente'),
  ('Italia', 'Corea del Sur', 'B', '2026-06-13T21:00:00+00:00', 'pendiente'),
  ('España', 'Camerún', 'C', '2026-06-13T18:00:00+00:00', 'pendiente'),
  ('Argentina', 'Suecia', 'C', '2026-06-14T21:00:00+00:00', 'pendiente'),
  ('Brasil', 'Irán', 'D', '2026-06-14T18:00:00+00:00', 'pendiente'),
  ('Francia', 'Australia', 'D', '2026-06-15T21:00:00+00:00', 'pendiente');

COMMIT;
