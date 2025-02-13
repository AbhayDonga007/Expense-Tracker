CREATE TABLE "expenses" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"amount" numeric DEFAULT 0 NOT NULL,
	"budgetId" integer,
	"createdAt" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_budgetId_budgets_id_fk" FOREIGN KEY ("budgetId") REFERENCES "public"."budgets"("id") ON DELETE no action ON UPDATE no action;