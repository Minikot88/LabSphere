-- Preserve existing records and their explicitly chosen visibility.
ALTER TABLE "Document" ALTER COLUMN "visibility" SET DEFAULT 'PRIVATE';
