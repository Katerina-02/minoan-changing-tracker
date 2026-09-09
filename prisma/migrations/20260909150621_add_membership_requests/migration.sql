-- AlterTable
ALTER TABLE "Entry" ADD COLUMN     "membershipChecklist" JSONB DEFAULT '{}',
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'change',
ALTER COLUMN "projectId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Entry_type_idx" ON "Entry"("type");
