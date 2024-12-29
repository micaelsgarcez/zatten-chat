ALTER TABLE "Chat" ALTER COLUMN "title" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "Chat" ADD COLUMN "assistantId" text;--> statement-breakpoint
ALTER TABLE "Chat" ADD COLUMN "modelId" text;