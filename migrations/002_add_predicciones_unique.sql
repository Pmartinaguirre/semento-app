-- Migration: Ensure unique (usuario_id, partido_id) on predicciones
-- Safe flow:
-- 1) Remove duplicate rows keeping the earliest `id` per (usuario_id, partido_id)
-- 2) Add a UNIQUE constraint on (usuario_id, partido_id)

BEGIN;

-- Remove duplicate predictions, keep the first (lowest id) for each user+match
WITH duplicates AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY usuario_id, partido_id ORDER BY id) AS rn
  FROM predicciones
)
DELETE FROM predicciones
WHERE id IN (SELECT id FROM duplicates WHERE rn > 1);

-- Add unique constraint so upserts using onConflict work reliably
ALTER TABLE predicciones
  ADD CONSTRAINT predicciones_usuario_partido_unique UNIQUE (usuario_id, partido_id);

COMMIT;

-- Notes:
-- - Run this in the Supabase SQL editor with an admin/service role.
-- - The duplicate-removal step deletes rows; back up data first if needed.
-- - If you prefer to only create a unique index instead of a constraint, you can run:
--     CREATE UNIQUE INDEX IF NOT EXISTS predicciones_usuario_partido_key ON predicciones(usuario_id, partido_id);
