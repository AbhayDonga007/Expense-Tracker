import { integer, numeric, serial, text } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";

export const Budgets = pgTable("budgets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  amount: text("amount").notNull(),
  icon: text("icon"),
  createdBy: text("createdBy").notNull(),
});

export const Expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  amount: numeric("amount").notNull().default("0"),
  budgetId: integer("budgetId").references(() => Budgets.id),
  createdAt: text("createdAt").notNull(),
  createdBy: text("createdBy").notNull(),
});

export const Incomes = pgTable("incomes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  amount: numeric("amount").notNull().default("0"),
  createdAt: text("createdAt").notNull(),
  createdBy: text("createdBy").notNull(),
});


export const Groups = pgTable("groups", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  inviteLink: text("inviteLink").notNull(),
  createdAt: text("createdAt").notNull(),
  createdBy: text("createdBy").notNull(),
});


export const GroupMembers = pgTable("group_members", {
  id: serial("id").primaryKey(),
  groupId: integer("groupId")
    .notNull()
    .references(() => Groups.id),
  name: text("name").notNull(),
  email: text("email").notNull(),
  isAdmin: text("isAdmin").notNull(),
});

export const GroupExpenses = pgTable("group_expenses", {
  id: serial("id").primaryKey(),
  groupId: integer("groupId").notNull(),
  description: text("description").notNull(),
  amount: numeric("amount").notNull(),
  category: text("category").notNull(),
  paidBy: text("paidBy").notNull(),
  paidById: text("paidById").notNull(),
  date: text("date").notNull(),
  participants: text("participants").notNull(), 
  participantIds: text("participantIds").notNull(), 
  splitType: text("splitType").notNull(),
});

export const GroupBalances = pgTable("group_balances", {
  id: serial("id").primaryKey(),
  groupId: integer("groupId")
    .notNull()
    .references(() => Groups.id),
  from: text("from").notNull(),
  to: text("to").notNull(),
  fromId: text("fromId").notNull(),
  toId: text("toId").notNull(),
  amount: numeric("amount").notNull(),
});
