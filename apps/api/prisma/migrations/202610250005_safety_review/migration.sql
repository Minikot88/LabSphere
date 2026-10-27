ALTER TABLE "Equipment" ADD COLUMN "requiresSafetySignoff" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Maintenance" ADD COLUMN "safetyVerifiedById" UUID REFERENCES "User"(id), ADD COLUMN "safetyVerifiedAt" TIMESTAMP(3);
CREATE TABLE "StorageCompatibility" (
 id UUID PRIMARY KEY,
 "labId" UUID NOT NULL REFERENCES "Laboratory"(id),
 "chemicalId" UUID NOT NULL,
 "otherChemicalId" UUID NOT NULL,
 decision TEXT NOT NULL CHECK (decision IN ('COMPATIBLE','INCOMPATIBLE','REVIEW_REQUIRED')),
 notes TEXT NOT NULL,
 "documentId" UUID NOT NULL,
 "verifiedById" UUID NOT NULL REFERENCES "User"(id),
 "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY ("chemicalId","labId") REFERENCES "Chemical"(id,"labId"),
 FOREIGN KEY ("otherChemicalId","labId") REFERENCES "Chemical"(id,"labId"),
 FOREIGN KEY ("documentId","labId") REFERENCES "Document"(id,"labId"),
 CHECK ("chemicalId" <> "otherChemicalId")
);
CREATE INDEX "StorageCompatibility_labId_createdAt_idx" ON "StorageCompatibility"("labId","createdAt");
