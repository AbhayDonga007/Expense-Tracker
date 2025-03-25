CREATE TABLE "group_expenses" (
	"id" serial PRIMARY KEY NOT NULL,
	"groupId" integer NOT NULL,
	"description" text NOT NULL,
	"amount" numeric NOT NULL,
	"category" text NOT NULL,
	"paidBy" text NOT NULL,
	"paidById" text NOT NULL,
	"date" text NOT NULL,
	"participants" text NOT NULL,
	"participantIds" text NOT NULL,
	"splitType" text NOT NULL
);
