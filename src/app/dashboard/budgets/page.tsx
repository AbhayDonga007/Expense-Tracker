"use client";

import { useCallback, useEffect, useState } from "react";
import { CreateBudgetCard } from "@/components/CreateBudgetsCard";
import { BudgetCard } from "@/components/BudgetCard";
import { useUser } from "@clerk/nextjs";
import { db } from "@/lib/dbConfig";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { Budgets, Expenses } from "@/schema";
import { Budget } from "@/interface";

export default function BudgetsPage() {
  const { user } = useUser();
  
  const [budgetList, setBudgetList] = useState<Budget[]>([]);

  const getBudgetList = useCallback(async () => {
    if (!user?.primaryEmailAddress?.emailAddress) return;

    const result = await db
      .select({
        ...getTableColumns(Budgets),
        totalSpend: sql<number>`SUM(${Expenses.amount})`.mapWith(Number), 
        totalItems: sql<number>`COUNT(${Expenses.id})`.mapWith(Number),
      })
      .from(Budgets)
      .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user.primaryEmailAddress.emailAddress))
      .groupBy(Budgets.id)
      .orderBy(desc(Budgets.id));

    setBudgetList(result);
  }, [user]);

  useEffect(() => {
    if (user) {
      getBudgetList();
    }
  }, [user, getBudgetList]);

  return (
    <div className="min-h-screen bg-gray-50 p-8 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">
          My Budgets
        </h1>
        
        <CreateBudgetCard onRefreshData={getBudgetList} />

        <div className="grid gap-6 mt-5 sm:grid-cols-2 lg:grid-cols-3">
          {budgetList.map((budget) => (
            <BudgetCard
              key={budget.id}
              budget={budget}
          />
          ))}
        </div>
      </div>
    </div>
  );
}
