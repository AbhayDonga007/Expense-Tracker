"use client";
import { ActivityChart } from "@/components/ActivityChart";
import { BudgetList } from "@/components/BudgetList";
import { ExpensesTable } from "@/components/ExpensesTable";
import FinanceAI from "@/components/FinanceAI";
import Footer from "@/components/footer";
import { StatCard } from "@/components/StatCard";
import { Budget, Expense } from "@/interface";
import { db } from "@/lib/dbConfig";
import getFinancialAdvice from "@/lib/FinancialAdvice";
import { Budgets, Expenses } from "@/schema";
import { useUser } from "@clerk/nextjs";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { useCallback, useEffect, useState } from "react";

export default function DashboardPage() {
  const { user } = useUser();

  const [budgetList, setBudgetList] = useState<Budget[]>([]);
  const [expenseList, setExpenseList] = useState<Expense[]>([]);
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  console.log(expenseList);

  const calCardInfo = useCallback(() => {
    let spent = 0,
      budget = 0;

    budgetList.forEach((ele) => {
      budget += Number(ele.amount);
      spent += ele.totalSpend ?? 0;
    });

    setTotalBudget(budget);
    setTotalSpent(spent);
  }, [budgetList]);

  const getAllExpenses = useCallback(async () => {
    if (!user?.primaryEmailAddress?.emailAddress) return;

    // const result: Expense[] = await db
    //   .select({
    //     id: Expenses.id,
    //     name: Expenses.name,
    //     amount: sql<number>`${Expenses.amount}`.mapWith(Number),
    //     createdAt: Expenses.createdAt,
    //   })
    //   .from(Expenses)
    //   .where(eq(Expenses.budgetId, Budgets.id))
    //   .orderBy(desc(Expenses.id));
    const result: Expense[] = await db
      .select({
        id: Expenses.id,
        name: Expenses.name,
        amount: sql<number>`${Expenses.amount}`.mapWith(Number),
        createdAt: Expenses.createdAt,
      })
      .from(Expenses)
      .innerJoin(Budgets, eq(Expenses.budgetId, Budgets.id)) // Ensure Budgets is included in the query
      .orderBy(desc(Expenses.id));

    setExpenseList(result);
  }, [user]);

  const getBudgetList = useCallback(async () => {
    if (!user?.primaryEmailAddress?.emailAddress) return;

    const result: Budget[] = await db
      .select({
        ...getTableColumns(Budgets),
        totalSpend: sql<number>`COALESCE(SUM(${Expenses.amount}), 0)`.mapWith(
          Number
        ),
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
      getAllExpenses();
    }
  }, [user, getBudgetList, getAllExpenses]);

  useEffect(() => {
    if (budgetList.length > 0) calCardInfo();
  }, [budgetList, calCardInfo]);

  const [financialAdvice, setFinancialAdvice] = useState<string>("");

  useEffect(() => {
    const fetchFinancialAdvice = async () => {
      if (totalBudget > 0 || totalSpent > 0) {
        try {
          const advice = await getFinancialAdvice(totalBudget, totalSpent,budgetList,expenseList);
          setFinancialAdvice(advice); // ✅ Now TypeScript won't throw an error
        } catch (error) {
          console.error("Error fetching advice:", error);
          setFinancialAdvice("Unable to fetch financial advice at this moment.");
        }
      }
    };

    fetchFinancialAdvice();
  }, [totalBudget, totalSpent]);

  return (
    <>
      <div className="min-h-screen p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Hi, {user?.fullName} ✌️</h1>
            <p className="text-gray-500 mt-1">
              Here&apos;s what&apos;s happening with your money. Let&apos;s
              manage your expenses!
            </p>
            <FinanceAI text={financialAdvice}/>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard title="Total Budget" value={totalBudget} type="budget" />
            <StatCard title="Total Spend" value={totalSpent} type="spend" />
            <StatCard
              title="No. Of Budget"
              value={budgetList.length}
              type="count"
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              <ActivityChart budgetList={budgetList} />
              <ExpensesTable
                expenses={expenseList}
                onRefreshData={() => getAllExpenses()}
              />
            </div>
            <div>
              <BudgetList budgets={budgetList} />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
