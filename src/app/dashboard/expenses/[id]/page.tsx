"use client"
import { AddExpenseForm } from "@/components/AddExpenseForm";
import { BudgetCard } from "@/components/BudgetCard";
import { ExpenseHeader } from "@/components/ExpenseHeader";
import ExpensesTable from "@/components/ExpensesTable";
import Footer from "@/components/footer";
import { Budget, Expense } from "@/interface";
import { db } from "@/lib/dbConfig";
import { Budgets, Expenses } from "@/schema";
import { useUser } from "@clerk/nextjs";
import { and, desc, eq, getTableColumns, sql } from "drizzle-orm";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function ExpensesPage() {
  const { user } = useUser();
  const params = useParams();
  const id = params?.id as string; 

  const [budgetInfo, setBudgetInfo] = useState<Budget | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  console.log(expenses);
  

  const getExpensesList = useCallback(async () => {
    if (!id) return;

    const result = await db
      .select({
        id: Expenses.id,
        name: Expenses.name,
        amount: sql<number>`${Expenses.amount}`.mapWith(Number), 
        budgetId: Expenses.budgetId,
        createdAt: Expenses.createdAt,
        createdBy: Expenses.createdBy,
      })
      .from(Expenses)
      .where(eq(Expenses.budgetId, Number(id)))
      .orderBy(desc(Expenses.id));

    setExpenses(result);
  }, [id]);

  const getBudgetInfo = useCallback(async () => {
    if (!user?.primaryEmailAddress?.emailAddress) return;

    const result = await db
      .select({
        ...getTableColumns(Budgets),
        totalSpend: sql<number>`COALESCE(SUM(${Expenses.amount}), 0)`.mapWith(Number),
        totalItems: sql<number>`COUNT(${Expenses.id})`.mapWith(Number),
      })
      .from(Budgets)
      .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(
        and(
          eq(Budgets.createdBy, user.primaryEmailAddress.emailAddress),
          eq(Budgets.id, Number(id))
        )
      )
      .groupBy(Budgets.id)
      .orderBy(desc(Budgets.id));

    setBudgetInfo(result[0] || null);
    getExpensesList(); 
  }, [user, id, getExpensesList]);

  useEffect(() => {
    if (user) {
      getBudgetInfo();
    }
  }, [user, getBudgetInfo]);

  return (
    <>
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-6xl">
        <ExpenseHeader onRefreshData={getBudgetInfo} budget={budgetInfo ?? ({} as Budget)} />
        
        <div className="grid gap-6 md:grid-cols-2">
          <BudgetCard budget={budgetInfo ?? ({} as Budget)} />
          <AddExpenseForm budgetId={Number(id)} onRefreshData={getBudgetInfo} createdBy={user?.primaryEmailAddress?.emailAddress || ""} />
        </div>

        <div className="mt-8">
          <ExpensesTable onRefreshData={getBudgetInfo} expenses={expenses} />
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}
