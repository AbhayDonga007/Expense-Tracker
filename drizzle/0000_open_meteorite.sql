CREATE TABLE "budgets" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"amount" text NOT NULL,
	"icon" text,
	"createdBy" text NOT NULL
);
