"use client";

import { AddExpenseForm } from "@/components/AddExpenseForm";
import { BudgetCard } from "@/components/BudgetCard";
import { ExpenseCard } from "@/components/ExpenseCard";
import { ExpenseHeader } from "@/components/ExpenseHeader";
import { ExpensesTable } from "@/components/ExpensesTable";
import { db } from "@/lib/dbConfig";
import { Budgets, Expenses } from "@/schema";
import { useUser } from "@clerk/nextjs";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { use, useEffect, useState } from "react";

const initialExpenses = [
  { id: "1", name: "Living Room", amount: 800, date: "20/04/2024" },
  { id: "2", name: "Bath", amount: 1000, date: "20/04/2024" },
  { id: "3", name: "Kitchen", amount: 1500, date: "19/04/2024" },
];

export default function ExpensesPage({ params }) {
  // const {user} = useUser()
  // const [budgetInfo,setBudgetInfo] = useState({});

  // useEffect(()=>{
  //   user && getBudgetInfo()
  // },[user])

  const { user } = useUser();
  const {id} = use(params)
  const [budgetInfo, setBudgetInfo] = useState(null); // Initialize properly
  const [expenses, setExpenses] = useState([]); 

  useEffect(() => {
    if (user) getBudgetInfo();
    
  }, [user]);

  // Log budgetInfo when it actually updates
  useEffect(() => {
    console.log("Updated budgetInfo:", budgetInfo);
  }, [budgetInfo]);

  const getBudgetInfo = async () => {
    if (!user) return; // Ensure user exists before querying

    const result = await db
      .select({
        ...getTableColumns(Budgets),
        totalSpend: sql`sum (${Expenses.amount})`.mapWith(Number),
        totalItems: sql`count (${Expenses.id})`.mapWith(Number),
      })
      .from(Budgets)
      .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
      .where(eq(Budgets.id,id))
      .groupBy(Budgets.id)
      .orderBy(desc(Budgets.id));

    console.log("Result[0] before setting state:", result[0]); 

    setBudgetInfo(result[0] || null); 
    getExpensesList();
  };

  const getExpensesList = async () => {
    const result = await db.select().from(Expenses).where(eq(Expenses.budgetId,id)).orderBy(desc(Expenses.id))
    setExpenses(result)
  }

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-6xl">
        <ExpenseHeader onRefreshData={()=>getBudgetInfo()} budget={budgetInfo}/>
        <div className="grid gap-6 md:grid-cols-2"><BudgetCard budget={budgetInfo}/>
          <AddExpenseForm budgetId={id} user={user} onRefreshData={() => getBudgetInfo()} />
        </div>
        <div className="mt-8">
          <ExpensesTable onRefreshData={()=>getBudgetInfo()} expenses={expenses} />
        </div>  
      </div>
    </div>
  );
}
