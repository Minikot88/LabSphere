ALTER TABLE "Session" ADD COLUMN "mfaVerifiedAt" TIMESTAMP(3);
-- Existing sessions must reauthenticate before using MFA-protected administration.
