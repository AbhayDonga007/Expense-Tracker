CREATE TABLE "incomes" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"amount" numeric DEFAULT '0' NOT NULL,
	"createdAt" text NOT NULL,
	"createdBy" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "expenses" ALTER COLUMN "amount" SET DEFAULT '0';