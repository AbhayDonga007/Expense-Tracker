CREATE TABLE "group_balances" (
	"id" serial PRIMARY KEY NOT NULL,
	"groupId" integer NOT NULL,
	"from" text NOT NULL,
	"to" text NOT NULL,
	"fromId" text NOT NULL,
	"toId" text NOT NULL,
	"amount" numeric NOT NULL
);
--> statement-breakpoint
ALTER TABLE "group_balances" ADD CONSTRAINT "group_balances_groupId_groups_id_fk" FOREIGN KEY ("groupId") REFERENCES "public"."groups"("id") ON DELETE no action ON UPDATE no action;