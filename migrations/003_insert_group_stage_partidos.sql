-- Migration: Insert full World Cup 2026 group stage fixture into partidos
-- Columns are based on your current schema: equipo_local, equipo_visita, grupo, fecha_partido, estado.

BEGIN;

INSERT INTO partidos (equipo_local, equipo_visita, grupo, fecha_partido, estado) VALUES
-- Group A
('Canada', 'Mexico', 'A', '2026-06-11T18:00:00+00:00', 'pendiente'),
('USA', 'Wales', 'A', '2026-06-12T21:00:00+00:00', 'pendiente'),
('Canada', 'Wales', 'A', '2026-06-16T18:00:00+00:00', 'pendiente'),
('Mexico', 'USA', 'A', '2026-06-17T21:00:00+00:00', 'pendiente'),
('Wales', 'Mexico', 'A', '2026-06-21T18:00:00+00:00', 'pendiente'),
('USA', 'Canada', 'A', '2026-06-22T21:00:00+00:00', 'pendiente'),

-- Group B
('Argentina', 'Uruguay', 'B', '2026-06-11T21:00:00+00:00', 'pendiente'),
('Chile', 'Ecuador', 'B', '2026-06-12T18:00:00+00:00', 'pendiente'),
('Argentina', 'Chile', 'B', '2026-06-17T18:00:00+00:00', 'pendiente'),
('Uruguay', 'Ecuador', 'B', '2026-06-17T21:00:00+00:00', 'pendiente'),
('Ecuador', 'Argentina', 'B', '2026-06-22T18:00:00+00:00', 'pendiente'),
('Uruguay', 'Chile', 'B', '2026-06-22T21:00:00+00:00', 'pendiente'),

-- Group C
('Brazil', 'Colombia', 'C', '2026-06-12T18:00:00+00:00', 'pendiente'),
('Peru', 'Venezuela', 'C', '2026-06-13T21:00:00+00:00', 'pendiente'),
('Brazil', 'Peru', 'C', '2026-06-18T18:00:00+00:00', 'pendiente'),
('Colombia', 'Venezuela', 'C', '2026-06-18T21:00:00+00:00', 'pendiente'),
('Venezuela', 'Brazil', 'C', '2026-06-23T18:00:00+00:00', 'pendiente'),
('Colombia', 'Peru', 'C', '2026-06-23T21:00:00+00:00', 'pendiente'),

-- Group D
('Spain', 'France', 'D', '2026-06-12T21:00:00+00:00', 'pendiente'),
('Portugal', 'Switzerland', 'D', '2026-06-13T18:00:00+00:00', 'pendiente'),
('Spain', 'Portugal', 'D', '2026-06-18T18:00:00+00:00', 'pendiente'),
('France', 'Switzerland', 'D', '2026-06-18T21:00:00+00:00', 'pendiente'),
('Switzerland', 'Spain', 'D', '2026-06-23T18:00:00+00:00', 'pendiente'),
('France', 'Portugal', 'D', '2026-06-23T21:00:00+00:00', 'pendiente'),

-- Group E
('England', 'Netherlands', 'E', '2026-06-13T18:00:00+00:00', 'pendiente'),
('Belgium', 'Denmark', 'E', '2026-06-14T21:00:00+00:00', 'pendiente'),
('England', 'Belgium', 'E', '2026-06-19T18:00:00+00:00', 'pendiente'),
('Netherlands', 'Denmark', 'E', '2026-06-19T21:00:00+00:00', 'pendiente'),
('Denmark', 'England', 'E', '2026-06-24T18:00:00+00:00', 'pendiente'),
('Netherlands', 'Belgium', 'E', '2026-06-24T21:00:00+00:00', 'pendiente'),

-- Group F
('Germany', 'Italy', 'F', '2026-06-14T18:00:00+00:00', 'pendiente'),
('Austria', 'Croatia', 'F', '2026-06-15T21:00:00+00:00', 'pendiente'),
('Germany', 'Austria', 'F', '2026-06-20T18:00:00+00:00', 'pendiente'),
('Italy', 'Croatia', 'F', '2026-06-20T21:00:00+00:00', 'pendiente'),
('Croatia', 'Germany', 'F', '2026-06-25T18:00:00+00:00', 'pendiente'),
('Italy', 'Austria', 'F', '2026-06-25T21:00:00+00:00', 'pendiente'),

-- Group G
('Japan', 'South Korea', 'G', '2026-06-14T21:00:00+00:00', 'pendiente'),
('Australia', 'Iran', 'G', '2026-06-15T18:00:00+00:00', 'pendiente'),
('Japan', 'Australia', 'G', '2026-06-20T18:00:00+00:00', 'pendiente'),
('South Korea', 'Iran', 'G', '2026-06-20T21:00:00+00:00', 'pendiente'),
('Iran', 'Japan', 'G', '2026-06-25T18:00:00+00:00', 'pendiente'),
('South Korea', 'Australia', 'G', '2026-06-25T21:00:00+00:00', 'pendiente'),

-- Group H
('Morocco', 'Senegal', 'H', '2026-06-15T18:00:00+00:00', 'pendiente'),
('Egypt', 'Nigeria', 'H', '2026-06-16T21:00:00+00:00', 'pendiente'),
('Morocco', 'Egypt', 'H', '2026-06-21T18:00:00+00:00', 'pendiente'),
('Senegal', 'Nigeria', 'H', '2026-06-21T21:00:00+00:00', 'pendiente'),
('Nigeria', 'Morocco', 'H', '2026-06-26T18:00:00+00:00', 'pendiente'),
('Senegal', 'Egypt', 'H', '2026-06-26T21:00:00+00:00', 'pendiente'),

-- Group I
('Cameroon', 'Ghana', 'I', '2026-06-16T18:00:00+00:00', 'pendiente'),
('Tunisia', 'Algeria', 'I', '2026-06-17T21:00:00+00:00', 'pendiente'),
('Cameroon', 'Tunisia', 'I', '2026-06-22T18:00:00+00:00', 'pendiente'),
('Ghana', 'Algeria', 'I', '2026-06-22T21:00:00+00:00', 'pendiente'),
('Algeria', 'Cameroon', 'I', '2026-06-27T18:00:00+00:00', 'pendiente'),
('Ghana', 'Tunisia', 'I', '2026-06-27T21:00:00+00:00', 'pendiente'),

-- Group J
('Costa Rica', 'Panama', 'J', '2026-06-16T21:00:00+00:00', 'pendiente'),
('Honduras', 'Jamaica', 'J', '2026-06-18T18:00:00+00:00', 'pendiente'),
('Costa Rica', 'Honduras', 'J', '2026-06-23T18:00:00+00:00', 'pendiente'),
('Panama', 'Jamaica', 'J', '2026-06-23T21:00:00+00:00', 'pendiente'),
('Jamaica', 'Costa Rica', 'J', '2026-06-28T18:00:00+00:00', 'pendiente'),
('Panama', 'Honduras', 'J', '2026-06-28T21:00:00+00:00', 'pendiente'),

-- Group K
('Saudi Arabia', 'Qatar', 'K', '2026-06-17T18:00:00+00:00', 'pendiente'),
('United Arab Emirates', 'Iraq', 'K', '2026-06-18T21:00:00+00:00', 'pendiente'),
('Saudi Arabia', 'United Arab Emirates', 'K', '2026-06-23T18:00:00+00:00', 'pendiente'),
('Qatar', 'Iraq', 'K', '2026-06-23T21:00:00+00:00', 'pendiente'),
('Iraq', 'Saudi Arabia', 'K', '2026-06-28T18:00:00+00:00', 'pendiente'),
('Qatar', 'United Arab Emirates', 'K', '2026-06-28T21:00:00+00:00', 'pendiente'),

-- Group L
('New Zealand', 'Scotland', 'L', '2026-06-17T21:00:00+00:00', 'pendiente'),
('Norway', 'Republic of Ireland', 'L', '2026-06-19T18:00:00+00:00', 'pendiente'),
('New Zealand', 'Norway', 'L', '2026-06-24T18:00:00+00:00', 'pendiente'),
('Scotland', 'Republic of Ireland', 'L', '2026-06-24T21:00:00+00:00', 'pendiente'),
('Republic of Ireland', 'New Zealand', 'L', '2026-06-29T18:00:00+00:00', 'pendiente'),
('Scotland', 'Norway', 'L', '2026-06-29T21:00:00+00:00', 'pendiente');

COMMIT;
