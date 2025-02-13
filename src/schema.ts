import { integer, numeric, serial, text } from "drizzle-orm/pg-core";  // ✅ Use pg-core instead of mysql-core
import { pgTable } from "drizzle-orm/pg-core";

export const Budgets = pgTable('budgets', {
    id: serial('id').primaryKey(),  
    name: text('name').notNull(),   
    amount: text('amount').notNull(), 
    icon: text('icon'),
    createdBy: text('createdBy').notNull(),
});

export const Expenses = pgTable('expenses', {
    id: serial('id').primaryKey(),  
    name: text('name').notNull(),   
    amount: numeric('amount').notNull().default(0), 
    budgetId: integer('budgetId').references(()=>Budgets.id),
    createdAt: text('createdAt').notNull(),
});
