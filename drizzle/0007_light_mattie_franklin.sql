ALTER TABLE "group_expenses" ADD COLUMN "group_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "group_expenses" ADD COLUMN "paid_by" text NOT NULL;--> statement-breakpoint
ALTER TABLE "group_expenses" ADD COLUMN "paid_by_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "group_expenses" ADD COLUMN "participant_ids" text NOT NULL;--> statement-breakpoint
ALTER TABLE "group_expenses" ADD COLUMN "split_type" text NOT NULL;--> statement-breakpoint
ALTER TABLE "group_expenses" DROP COLUMN "groupId";--> statement-breakpoint
ALTER TABLE "group_expenses" DROP COLUMN "paidBy";--> statement-breakpoint
ALTER TABLE "group_expenses" DROP COLUMN "paidById";--> statement-breakpoint
ALTER TABLE "group_expenses" DROP COLUMN "participantIds";--> statement-breakpoint
ALTER TABLE "group_expenses" DROP COLUMN "splitType";