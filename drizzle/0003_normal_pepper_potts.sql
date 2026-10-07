CREATE TYPE "public"."user_role" AS ENUM('player', 'admin');--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "role" "user_role" DEFAULT 'player' NOT NULL;