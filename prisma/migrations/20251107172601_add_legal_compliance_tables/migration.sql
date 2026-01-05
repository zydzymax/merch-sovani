-- CreateTable
CREATE TABLE "legal_docs" (
    "id" TEXT NOT NULL,
    "docKey" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "legal_docs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consents" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "formType" TEXT NOT NULL,
    "docKey" TEXT NOT NULL,
    "docVersion" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "consents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "legal_docs_docKey_idx" ON "legal_docs"("docKey");

-- CreateIndex
CREATE INDEX "legal_docs_publishedAt_idx" ON "legal_docs"("publishedAt");

-- CreateIndex
CREATE UNIQUE INDEX "legal_docs_docKey_version_key" ON "legal_docs"("docKey", "version");

-- CreateIndex
CREATE INDEX "consents_userId_idx" ON "consents"("userId");

-- CreateIndex
CREATE INDEX "consents_formType_idx" ON "consents"("formType");

-- CreateIndex
CREATE INDEX "consents_docKey_docVersion_idx" ON "consents"("docKey", "docVersion");

-- CreateIndex
CREATE INDEX "consents_createdAt_idx" ON "consents"("createdAt");
