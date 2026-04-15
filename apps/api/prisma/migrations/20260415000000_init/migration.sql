-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'MANAGER', 'USER', 'VIEWER');

-- CreateEnum
CREATE TYPE "CarrierType" AS ENUM ('CARRIER', 'BROKER', 'CARRIER_BROKER');

-- CreateEnum
CREATE TYPE "QuoteType" AS ENUM ('BUDGET', 'FIRM');

-- CreateEnum
CREATE TYPE "QuoteStatus" AS ENUM ('PENDING', 'QUOTED', 'SIGNED_CONTRACT', 'LOST_SALE', 'CUSTOMER_ARRANGED', 'CLOSED');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'EXPORT', 'IMPORT');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "siteId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Site" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Site_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lane" (
    "id" TEXT NOT NULL,
    "originId" TEXT NOT NULL,
    "destId" TEXT NOT NULL,
    "distance" DOUBLE PRECISION,
    "transitDays" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lane_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LaneMetric" (
    "id" TEXT NOT NULL,
    "laneId" TEXT NOT NULL,
    "period" TIMESTAMP(3) NOT NULL,
    "equipmentType" TEXT,
    "minRate" DOUBLE PRECISION NOT NULL,
    "maxRate" DOUBLE PRECISION NOT NULL,
    "avgRate" DOUBLE PRECISION NOT NULL,
    "medianRate" DOUBLE PRECISION NOT NULL,
    "p25Rate" DOUBLE PRECISION,
    "p75Rate" DOUBLE PRECISION,
    "shipmentCount" INTEGER NOT NULL,
    "ratePerMile" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LaneMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Carrier" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mcNumber" TEXT,
    "dotNumber" TEXT,
    "type" "CarrierType" NOT NULL,
    "isAssetBased" BOOLEAN NOT NULL DEFAULT false,
    "isBroker" BOOLEAN NOT NULL DEFAULT false,
    "isPreferred" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Carrier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarrierContact" (
    "id" TEXT NOT NULL,
    "carrierId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CarrierContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarrierSite" (
    "id" TEXT NOT NULL,
    "carrierId" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "isPreferred" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CarrierSite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarrierPerformance" (
    "id" TEXT NOT NULL,
    "carrierId" TEXT NOT NULL,
    "period" TIMESTAMP(3) NOT NULL,
    "totalBids" INTEGER NOT NULL DEFAULT 0,
    "wonBids" INTEGER NOT NULL DEFAULT 0,
    "winRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "avgResponseHrs" DOUBLE PRECISION,
    "onTimePickup" DOUBLE PRECISION,
    "onTimeDelivery" DOUBLE PRECISION,
    "avgEquipRating" DOUBLE PRECISION,
    "avgServiceRating" DOUBLE PRECISION,
    "avgResponseRating" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CarrierPerformance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quote" (
    "id" TEXT NOT NULL,
    "requestNumber" TEXT NOT NULL,
    "type" "QuoteType" NOT NULL,
    "status" "QuoteStatus" NOT NULL DEFAULT 'PENDING',
    "jobId" TEXT NOT NULL,
    "customer" TEXT NOT NULL,
    "laneId" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "createdById" TEXT,
    "flatbedQty" INTEGER NOT NULL DEFAULT 0,
    "stepDeckQty" INTEGER NOT NULL DEFAULT 0,
    "doubleDeckQty" INTEGER NOT NULL DEFAULT 0,
    "towawayQty" INTEGER NOT NULL DEFAULT 0,
    "dollyQty" INTEGER NOT NULL DEFAULT 0,
    "rgnQty" INTEGER NOT NULL DEFAULT 0,
    "flatbedRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "stepDeckRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "doubleDeckRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "towawayRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "dollyRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "rgnRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "carrierTotal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "liveLoadCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "listQuote" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "markup" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "quoteToCustomer" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "quoteResult" TEXT,
    "invoicedAmount" DOUBLE PRECISION,
    "carrierInvoice" DOUBLE PRECISION,
    "finalMargin" DOUBLE PRECISION,
    "finalMarginPct" DOUBLE PRECISION,
    "selectedCarrierId" TEXT,
    "quoteDate" TIMESTAMP(3) NOT NULL,
    "shipDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bid" (
    "id" TEXT NOT NULL,
    "quoteId" TEXT NOT NULL,
    "carrierId" TEXT NOT NULL,
    "lineHaulRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "fuelSurcharge" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "permitFees" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "escortFees" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "miscFees" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "equipmentRates" JSONB,
    "isSelected" BOOLEAN NOT NULL DEFAULT false,
    "responseHours" DOUBLE PRECISION,
    "validUntil" TIMESTAMP(3),
    "equipmentRating" INTEGER,
    "responseRating" INTEGER,
    "serviceRating" INTEGER,
    "ratingNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bid_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EquipmentType" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "avgWeightMin" INTEGER,
    "avgWeightMax" INTEGER,
    "avgLengthMin" INTEGER,
    "avgLengthMax" INTEGER,
    "requiresPermit" BOOLEAN NOT NULL DEFAULT false,
    "requiresEscort" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EquipmentType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "productGroup" TEXT NOT NULL,
    "modelGroup" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "minWeight" INTEGER NOT NULL,
    "maxWeight" INTEGER NOT NULL,
    "minLength" INTEGER NOT NULL,
    "maxLength" INTEGER NOT NULL,
    "minWidth" INTEGER NOT NULL,
    "maxWidth" INTEGER NOT NULL,
    "minHeight" INTEGER NOT NULL,
    "maxHeight" INTEGER NOT NULL,
    "equipmentTypeId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LiveLoadConfig" (
    "id" TEXT NOT NULL,
    "site" TEXT,
    "craneDailyRate" DOUBLE PRECISION NOT NULL,
    "laborHourlyRate" DOUBLE PRECISION NOT NULL,
    "forkliftDailyRate" DOUBLE PRECISION NOT NULL,
    "defaultMarkup" DOUBLE PRECISION NOT NULL DEFAULT 0.30,
    "effectiveFrom" TIMESTAMP(3) NOT NULL,
    "effectiveTo" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LiveLoadConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImportLog" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "recordsTotal" INTEGER NOT NULL,
    "recordsCreated" INTEGER NOT NULL,
    "recordsUpdated" INTEGER NOT NULL,
    "recordsFailed" INTEGER NOT NULL,
    "errors" JSONB,
    "importedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ImportLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "action" "AuditAction" NOT NULL,
    "changes" JSONB,
    "userId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_siteId_idx" ON "User"("siteId");

-- CreateIndex
CREATE UNIQUE INDEX "Site_code_key" ON "Site"("code");

-- CreateIndex
CREATE INDEX "Location_state_idx" ON "Location"("state");

-- CreateIndex
CREATE UNIQUE INDEX "Location_city_state_key" ON "Location"("city", "state");

-- CreateIndex
CREATE INDEX "Lane_originId_idx" ON "Lane"("originId");

-- CreateIndex
CREATE INDEX "Lane_destId_idx" ON "Lane"("destId");

-- CreateIndex
CREATE UNIQUE INDEX "Lane_originId_destId_key" ON "Lane"("originId", "destId");

-- CreateIndex
CREATE INDEX "LaneMetric_laneId_idx" ON "LaneMetric"("laneId");

-- CreateIndex
CREATE INDEX "LaneMetric_period_idx" ON "LaneMetric"("period");

-- CreateIndex
CREATE UNIQUE INDEX "LaneMetric_laneId_period_equipmentType_key" ON "LaneMetric"("laneId", "period", "equipmentType");

-- CreateIndex
CREATE UNIQUE INDEX "Carrier_name_key" ON "Carrier"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Carrier_mcNumber_key" ON "Carrier"("mcNumber");

-- CreateIndex
CREATE INDEX "CarrierContact_carrierId_idx" ON "CarrierContact"("carrierId");

-- CreateIndex
CREATE UNIQUE INDEX "CarrierSite_carrierId_siteId_key" ON "CarrierSite"("carrierId", "siteId");

-- CreateIndex
CREATE INDEX "CarrierPerformance_carrierId_idx" ON "CarrierPerformance"("carrierId");

-- CreateIndex
CREATE INDEX "CarrierPerformance_period_idx" ON "CarrierPerformance"("period");

-- CreateIndex
CREATE UNIQUE INDEX "CarrierPerformance_carrierId_period_key" ON "CarrierPerformance"("carrierId", "period");

-- CreateIndex
CREATE UNIQUE INDEX "Quote_requestNumber_key" ON "Quote"("requestNumber");

-- CreateIndex
CREATE INDEX "Quote_status_idx" ON "Quote"("status");

-- CreateIndex
CREATE INDEX "Quote_quoteDate_idx" ON "Quote"("quoteDate");

-- CreateIndex
CREATE INDEX "Quote_customer_idx" ON "Quote"("customer");

-- CreateIndex
CREATE INDEX "Quote_laneId_idx" ON "Quote"("laneId");

-- CreateIndex
CREATE INDEX "Quote_siteId_idx" ON "Quote"("siteId");

-- CreateIndex
CREATE INDEX "Bid_quoteId_idx" ON "Bid"("quoteId");

-- CreateIndex
CREATE INDEX "Bid_carrierId_idx" ON "Bid"("carrierId");

-- CreateIndex
CREATE UNIQUE INDEX "Bid_quoteId_carrierId_key" ON "Bid"("quoteId", "carrierId");

-- CreateIndex
CREATE UNIQUE INDEX "EquipmentType_code_key" ON "EquipmentType"("code");

-- CreateIndex
CREATE INDEX "Product_productGroup_idx" ON "Product"("productGroup");

-- CreateIndex
CREATE INDEX "Product_modelGroup_idx" ON "Product"("modelGroup");

-- CreateIndex
CREATE INDEX "LiveLoadConfig_site_idx" ON "LiveLoadConfig"("site");

-- CreateIndex
CREATE INDEX "LiveLoadConfig_effectiveFrom_idx" ON "LiveLoadConfig"("effectiveFrom");

-- CreateIndex
CREATE INDEX "AuditLog_entity_entityId_idx" ON "AuditLog"("entity", "entityId");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lane" ADD CONSTRAINT "Lane_originId_fkey" FOREIGN KEY ("originId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lane" ADD CONSTRAINT "Lane_destId_fkey" FOREIGN KEY ("destId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LaneMetric" ADD CONSTRAINT "LaneMetric_laneId_fkey" FOREIGN KEY ("laneId") REFERENCES "Lane"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarrierContact" ADD CONSTRAINT "CarrierContact_carrierId_fkey" FOREIGN KEY ("carrierId") REFERENCES "Carrier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarrierSite" ADD CONSTRAINT "CarrierSite_carrierId_fkey" FOREIGN KEY ("carrierId") REFERENCES "Carrier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarrierSite" ADD CONSTRAINT "CarrierSite_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarrierPerformance" ADD CONSTRAINT "CarrierPerformance_carrierId_fkey" FOREIGN KEY ("carrierId") REFERENCES "Carrier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_laneId_fkey" FOREIGN KEY ("laneId") REFERENCES "Lane"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_selectedCarrierId_fkey" FOREIGN KEY ("selectedCarrierId") REFERENCES "Carrier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_carrierId_fkey" FOREIGN KEY ("carrierId") REFERENCES "Carrier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_equipmentTypeId_fkey" FOREIGN KEY ("equipmentTypeId") REFERENCES "EquipmentType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

