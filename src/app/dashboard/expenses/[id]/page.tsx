"use client";

import { AddExpenseForm } from "@/components/AddExpenseForm";
import { BudgetCard } from "@/components/BudgetCard";
import { ExpenseHeader } from "@/components/ExpenseHeader";
import { ExpensesTable } from "@/components/ExpensesTable";
import { db } from "@/lib/dbConfig";
import { Budgets, Expenses } from "@/schema";
import { useUser } from "@clerk/nextjs";
import { and, desc, eq, getTableColumns, sql } from "drizzle-orm";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface ExpensesPageProps {
  params: { id: string }; 
}

export default function ExpensesPage({ params }: ExpensesPageProps) {
  const { user } = useUser();
  const { id } = useParams(); // Extracting id correctly
  const [budgetInfo, setBudgetInfo] = useState<any>(null);
  const [expenses, setExpenses] = useState<any[]>([]);

  console.log(params);
  
  const getBudgetInfo = useCallback(async () => {
    if (!user) return;

    const result = await db
      .select({
        ...getTableColumns(Budgets),
        totalSpend: sql<number>`SUM(${Expenses.amount})`.mapWith(Number),
        totalItems: sql<number>`COUNT(${Expenses.id})`.mapWith(Number),
      })
      .from(Budgets)
      .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(
        and(
          eq(Budgets.createdBy, user.primaryEmailAddress?.emailAddress!),
          eq(Budgets.id, Number(id))
        )
      )
      .groupBy(Budgets.id)
      .orderBy(desc(Budgets.id));

    setBudgetInfo(result[0] || null);
    getExpensesList();
  }, [user, id]);

  // Fetch Expense List
  const getExpensesList = useCallback(async () => {
    const result = await db
      .select()
      .from(Expenses)
      .where(eq(Expenses.budgetId, Number(id)))
      .orderBy(desc(Expenses.id));

    setExpenses(result);
  }, [id]);

  useEffect(() => {
    if (user) {
      getBudgetInfo();
    }
  }, [user, getBudgetInfo]);

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-6xl">
        <ExpenseHeader onRefreshData={getBudgetInfo} budget={budgetInfo} />
        
        <div className="grid gap-6 md:grid-cols-2">
          <BudgetCard budget={budgetInfo} />
          <AddExpenseForm budgetId={Number(id)} onRefreshData={getBudgetInfo} />
        </div>

        <div className="mt-8">
          <ExpensesTable onRefreshData={getBudgetInfo} expenses={expenses} />
        </div>
      </div>
    </div>
  );
}
