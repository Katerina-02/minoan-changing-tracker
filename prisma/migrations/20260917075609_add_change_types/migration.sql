-- AlterTable
ALTER TABLE "Entry" ADD COLUMN     "changeTypeOther" TEXT,
ADD COLUMN     "changeTypes" TEXT[] DEFAULT ARRAY[]::TEXT[];
