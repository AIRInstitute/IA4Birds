-- Añade subId (checklist de eBird) a observation y la restricción única (subId, speciesId)
-- para que las inserciones repetidas no dupliquen filas.
-- Idempotente: se puede ejecutar varias veces.
-- Las filas antiguas quedan con subId NULL y no chocan con la restricción.

ALTER TABLE observation ADD COLUMN IF NOT EXISTS subId VARCHAR(255);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'observation_subid_speciesid_unique'
    ) THEN
        ALTER TABLE observation
            ADD CONSTRAINT observation_subid_speciesid_unique UNIQUE (subId, speciesId);
    END IF;
END $$;
