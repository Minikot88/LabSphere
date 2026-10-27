-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "Organization" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Laboratory" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "building" TEXT NOT NULL DEFAULT '',
    "room" TEXT NOT NULL DEFAULT '',
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Bangkok',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "policies" JSONB NOT NULL DEFAULT '{"weeklyQuota":3,"checkinEarlyMinutes":30,"availableHoursPerDay":8}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Laboratory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "emailVerifiedAt" TIMESTAMP(3),
    "platformRole" TEXT,
    "organizationAdminId" UUID,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Membership" (
    "id" UUID NOT NULL,
    "labId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "roles" TEXT[] DEFAULT ARRAY['MEMBER']::TEXT[],
    "approvedById" UUID,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Membership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "csrfHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "userAgent" TEXT,
    "ip" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountToken" (
    "id" UUID NOT NULL,
    "userId" UUID,
    "labId" UUID,
    "email" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "roles" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AccountToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TotpCredential" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "encryptedSecret" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "lastCounter" BIGINT NOT NULL DEFAULT -1,
    "recoveryHashes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TotpCredential_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StorageLocation" (
    "id" UUID NOT NULL,
    "labId" UUID NOT NULL,
    "parentId" UUID,
    "code" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "kind" TEXT NOT NULL DEFAULT 'CABINET',
    "hazardNotes" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StorageLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Supplier" (
    "id" UUID NOT NULL,
    "labId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "contacts" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chemical" (
    "id" UUID NOT NULL,
    "labId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL DEFAULT '',
    "casNumber" TEXT NOT NULL DEFAULT '',
    "formula" TEXT NOT NULL DEFAULT '',
    "concentration" TEXT NOT NULL DEFAULT '',
    "purity" TEXT NOT NULL DEFAULT '',
    "physicalState" TEXT NOT NULL DEFAULT 'LIQUID',
    "baseUnit" TEXT NOT NULL DEFAULT 'mL',
    "hazards" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "ghs" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "storageGuidance" TEXT NOT NULL DEFAULT '',
    "reorderThreshold" DECIMAL(20,6) NOT NULL DEFAULT 0,
    "requiresSds" BOOLEAN NOT NULL DEFAULT false,
    "requiresTraining" BOOLEAN NOT NULL DEFAULT false,
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chemical_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChemicalContainer" (
    "id" UUID NOT NULL,
    "labId" UUID NOT NULL,
    "chemicalId" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "supplierId" UUID,
    "locationId" UUID,
    "lotNumber" TEXT NOT NULL,
    "manufacturer" TEXT NOT NULL DEFAULT '',
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "openedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "initialQty" DECIMAL(20,6) NOT NULL,
    "currentQty" DECIMAL(20,6) NOT NULL,
    "reservedQty" DECIMAL(20,6) NOT NULL DEFAULT 0,
    "baseUnit" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChemicalContainer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockTransaction" (
    "id" UUID NOT NULL,
    "labId" UUID NOT NULL,
    "chemicalId" UUID NOT NULL,
    "containerId" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "qty" DECIMAL(20,6) NOT NULL,
    "baseUnit" TEXT NOT NULL,
    "referenceId" TEXT,
    "actorId" UUID NOT NULL,
    "reason" TEXT NOT NULL,
    "idempotencyKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StockTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Withdrawal" (
    "id" UUID NOT NULL,
    "labId" UUID NOT NULL,
    "requesterId" UUID NOT NULL,
    "purpose" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "reviewerId" UUID,
    "reviewedAt" TIMESTAMP(3),
    "note" TEXT NOT NULL DEFAULT '',
    "dispensedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Withdrawal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WithdrawalItem" (
    "id" UUID NOT NULL,
    "withdrawalId" UUID NOT NULL,
    "chemicalId" UUID NOT NULL,
    "requestedQty" DECIMAL(20,6) NOT NULL,
    "approvedQty" DECIMAL(20,6) NOT NULL DEFAULT 0,
    "dispensedQty" DECIMAL(20,6) NOT NULL DEFAULT 0,
    "baseUnit" TEXT NOT NULL,

    CONSTRAINT "WithdrawalItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockReservation" (
    "id" UUID NOT NULL,
    "itemId" UUID NOT NULL,
    "containerId" UUID NOT NULL,
    "qty" DECIMAL(20,6) NOT NULL,
    "dispensedQty" DECIMAL(20,6) NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "StockReservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stocktake" (
    "id" UUID NOT NULL,
    "labId" UUID NOT NULL,
    "startedById" UUID NOT NULL,
    "reviewerId" UUID,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stocktake_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StocktakeLine" (
    "id" UUID NOT NULL,
    "stocktakeId" UUID NOT NULL,
    "containerId" UUID NOT NULL,
    "expectedQty" DECIMAL(20,6) NOT NULL,
    "countedQty" DECIMAL(20,6) NOT NULL,

    CONSTRAINT "StocktakeLine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockTransfer" (
    "id" UUID NOT NULL,
    "labId" UUID NOT NULL,
    "destinationLabId" UUID NOT NULL,
    "containerId" UUID NOT NULL,
    "destinationLocationId" UUID,
    "qty" DECIMAL(20,6) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "requesterId" UUID NOT NULL,
    "sentById" UUID,
    "receivedById" UUID,
    "reason" TEXT NOT NULL,
    "dispatchedAt" TIMESTAMP(3),
    "receivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StockTransfer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WasteRecord" (
    "id" UUID NOT NULL,
    "labId" UUID NOT NULL,
    "containerId" UUID NOT NULL,
    "qty" DECIMAL(20,6) NOT NULL,
    "wasteType" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "custodianId" UUID NOT NULL,
    "destination" TEXT NOT NULL,
    "documentId" UUID,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "disposedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WasteRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Equipment" (
    "id" UUID NOT NULL,
    "labId" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'GENERAL',
    "model" TEXT NOT NULL DEFAULT '',
    "serialNumber" TEXT NOT NULL DEFAULT '',
    "assetTag" TEXT NOT NULL DEFAULT '',
    "manufacturer" TEXT NOT NULL DEFAULT '',
    "locationId" UUID,
    "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
    "requiresTraining" BOOLEAN NOT NULL DEFAULT false,
    "bookingEnabled" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT NOT NULL DEFAULT '',
    "calibrationRequired" BOOLEAN NOT NULL DEFAULT false,
    "calibrationValidUntil" TIMESTAMP(3),
    "nextServiceAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Equipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AvailabilityBlock" (
    "id" UUID NOT NULL,
    "labId" UUID NOT NULL,
    "equipmentId" UUID NOT NULL,
    "startsAt" TIMESTAMPTZ(3) NOT NULL,
    "endsAt" TIMESTAMPTZ(3) NOT NULL,
    "reason" TEXT NOT NULL,
    "createdById" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AvailabilityBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" UUID NOT NULL,
    "labId" UUID NOT NULL,
    "equipmentId" UUID NOT NULL,
    "requesterId" UUID NOT NULL,
    "startsAt" TIMESTAMPTZ(3) NOT NULL,
    "endsAt" TIMESTAMPTZ(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "purpose" TEXT NOT NULL,
    "reviewerId" UUID,
    "reviewedAt" TIMESTAMP(3),
    "note" TEXT NOT NULL DEFAULT '',
    "affected" BOOLEAN NOT NULL DEFAULT false,
    "exceptionId" UUID,
    "quotaWaived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookingException" (
    "id" UUID NOT NULL,
    "labId" UUID NOT NULL,
    "requesterId" UUID NOT NULL,
    "week" TEXT NOT NULL,
    "grantedDays" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "reviewerId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookingException_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EquipmentUsage" (
    "id" UUID NOT NULL,
    "labId" UUID NOT NULL,
    "bookingId" UUID NOT NULL,
    "equipmentId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "checkedInAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "checkedOutAt" TIMESTAMP(3),
    "actualCondition" TEXT NOT NULL DEFAULT '',
    "notes" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "EquipmentUsage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EquipmentIssue" (
    "id" UUID NOT NULL,
    "labId" UUID NOT NULL,
    "equipmentId" UUID NOT NULL,
    "reportedById" UUID NOT NULL,
    "bookingId" UUID,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'MEDIUM',
    "safetyStop" BOOLEAN NOT NULL DEFAULT false,
    "documentId" UUID,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "closedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EquipmentIssue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Maintenance" (
    "id" UUID NOT NULL,
    "labId" UUID NOT NULL,
    "equipmentId" UUID NOT NULL,
    "issueId" UUID,
    "type" TEXT NOT NULL DEFAULT 'REPAIR',
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "assignedToId" UUID,
    "vendor" TEXT NOT NULL DEFAULT '',
    "costs" DECIMAL(20,2) NOT NULL DEFAULT 0,
    "resolution" TEXT NOT NULL DEFAULT '',
    "testResult" TEXT NOT NULL DEFAULT '',
    "completedAt" TIMESTAMP(3),
    "verifiedById" UUID,
    "verifiedAt" TIMESTAMP(3),
    "nextDueAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Maintenance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Training" (
    "id" UUID NOT NULL,
    "labId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "equipmentId" UUID,
    "chemicalId" UUID,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "certificateDocId" UUID,
    "trainedAt" TIMESTAMP(3) NOT NULL,
    "validUntil" TIMESTAMP(3) NOT NULL,
    "approvedById" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Training_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" UUID NOT NULL,
    "labId" UUID NOT NULL,
    "kind" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "chemicalId" UUID,
    "equipmentId" UUID,
    "storageKey" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "bytes" INTEGER NOT NULL,
    "checksum" TEXT NOT NULL,
    "uploadedById" UUID NOT NULL,
    "visibility" TEXT NOT NULL DEFAULT 'LAB',
    "expiresAt" TIMESTAMP(3),
    "scanState" TEXT NOT NULL DEFAULT 'NOT_SCANNED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" UUID NOT NULL,
    "labId" UUID,
    "actorId" UUID NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "before" JSONB,
    "after" JSONB,
    "effectiveRoles" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "requestId" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "userAgent" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" UUID NOT NULL,
    "labId" UUID,
    "userId" UUID NOT NULL,
    "kind" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "dedupeKey" TEXT NOT NULL,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationOutbox" (
    "id" UUID NOT NULL,
    "userId" UUID,
    "email" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "dedupeKey" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,
    "nextAttemptAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NotificationOutbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LabAnnouncement" (
    "id" UUID NOT NULL,
    "labId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdById" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LabAnnouncement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organization_code_key" ON "Organization"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Laboratory_organizationId_code_key" ON "Laboratory"("organizationId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Membership_labId_status_idx" ON "Membership"("labId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Membership_labId_userId_key" ON "Membership"("labId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_tokenHash_key" ON "Session"("tokenHash");

-- CreateIndex
CREATE UNIQUE INDEX "AccountToken_tokenHash_key" ON "AccountToken"("tokenHash");

-- CreateIndex
CREATE UNIQUE INDEX "TotpCredential_userId_key" ON "TotpCredential"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "StorageLocation_labId_code_key" ON "StorageLocation"("labId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_labId_name_key" ON "Supplier"("labId", "name");

-- CreateIndex
CREATE INDEX "Chemical_labId_createdAt_idx" ON "Chemical"("labId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ChemicalContainer_code_key" ON "ChemicalContainer"("code");

-- CreateIndex
CREATE INDEX "ChemicalContainer_labId_status_idx" ON "ChemicalContainer"("labId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "StockTransaction_idempotencyKey_key" ON "StockTransaction"("idempotencyKey");

-- CreateIndex
CREATE INDEX "StockTransaction_labId_createdAt_idx" ON "StockTransaction"("labId", "createdAt");

-- CreateIndex
CREATE INDEX "Withdrawal_labId_status_idx" ON "Withdrawal"("labId", "status");

-- CreateIndex
CREATE INDEX "Stocktake_labId_status_idx" ON "Stocktake"("labId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "StocktakeLine_stocktakeId_containerId_key" ON "StocktakeLine"("stocktakeId", "containerId");

-- CreateIndex
CREATE INDEX "StockTransfer_labId_status_idx" ON "StockTransfer"("labId", "status");

-- CreateIndex
CREATE INDEX "WasteRecord_labId_status_idx" ON "WasteRecord"("labId", "status");

-- CreateIndex
CREATE INDEX "Equipment_labId_status_idx" ON "Equipment"("labId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Equipment_labId_code_key" ON "Equipment"("labId", "code");

-- CreateIndex
CREATE INDEX "Booking_labId_status_idx" ON "Booking"("labId", "status");

-- CreateIndex
CREATE INDEX "Booking_labId_requesterId_startsAt_idx" ON "Booking"("labId", "requesterId", "startsAt");

-- CreateIndex
CREATE INDEX "BookingException_labId_status_idx" ON "BookingException"("labId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "EquipmentUsage_bookingId_key" ON "EquipmentUsage"("bookingId");

-- CreateIndex
CREATE INDEX "EquipmentIssue_labId_status_idx" ON "EquipmentIssue"("labId", "status");

-- CreateIndex
CREATE INDEX "Maintenance_labId_status_idx" ON "Maintenance"("labId", "status");

-- CreateIndex
CREATE INDEX "Training_labId_status_idx" ON "Training"("labId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Document_storageKey_key" ON "Document"("storageKey");

-- CreateIndex
CREATE INDEX "Document_labId_createdAt_idx" ON "Document"("labId", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_labId_createdAt_idx" ON "AuditLog"("labId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Notification_dedupeKey_key" ON "Notification"("dedupeKey");

-- CreateIndex
CREATE INDEX "Notification_userId_createdAt_idx" ON "Notification"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationOutbox_dedupeKey_key" ON "NotificationOutbox"("dedupeKey");
