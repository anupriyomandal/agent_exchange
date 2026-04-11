-- CreateEnum
CREATE TYPE "AgentCategory" AS ENUM ('customer_support', 'sales', 'hr', 'marketing', 'internal_tools', 'operations', 'finance', 'other');

-- CreateEnum
CREATE TYPE "AgentStatus" AS ENUM ('draft', 'pending_review', 'published', 'archived');

-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('admin', 'editor');

-- CreateTable
CREATE TABLE "admin_users" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "role" "AdminRole" NOT NULL DEFAULT 'editor',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agents" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "short_description" VARCHAR(200) NOT NULL,
    "long_description" TEXT NOT NULL,
    "icon_url" TEXT,
    "category" "AgentCategory" NOT NULL,
    "channels" JSONB NOT NULL DEFAULT '[]',
    "channel_links" JSONB NOT NULL DEFAULT '{}',
    "status" "AgentStatus" NOT NULL DEFAULT 'draft',
    "likes_count" INTEGER NOT NULL DEFAULT 0,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "agent_id" TEXT NOT NULL,
    "reviewer_name" VARCHAR(100) NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "agents_slug_key" ON "agents"("slug");

-- AddForeignKey
ALTER TABLE "agents" ADD CONSTRAINT "agents_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "admin_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "agents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
