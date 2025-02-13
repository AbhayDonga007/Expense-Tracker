"use client"
import { BudgetList } from "@/components/BudgetList";
import { StatCard } from "@/components/StatCard";
import { db } from "@/lib/dbConfig";
import { Budgets, Expenses } from "@/schema";
import { useUser } from "@clerk/nextjs";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { user } = useUser();
  const [budgetList, setBudgetList] = useState([]);
  // const [expenseList, setExpenseList] = useState([]);
  const [totalBudget,setTotalBudget] = useState(0);
  const [totalSpent,setTotalSpent] = useState(0);

  useEffect(() => {
    if(user){getBudgetList();}
  }, [user]);

  useEffect(() => {
    if(budgetList) {calCardInfo();}
  }, [budgetList]);

  const calCardInfo = () => {
    let spent = 0, budget = 0;
  
    console.log(budgetList);
  
    budgetList.forEach((ele) => {
      budget += Number(ele.amount); 
      spent += Number(ele.totalSpend) || 0;
    });
  
    setTotalBudget(budget);
    setTotalSpent(spent);
  };
  

  const getBudgetList = async () => {
    const result = await db
      .select({
        ...getTableColumns(Budgets),
        totalSpend: sql`sum (${Expenses.amount})`.mapWith(Number),
        totalItems: sql`count (${Expenses.id})`.mapWith(Number),
      })
      .from(Budgets)
      .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
      .groupBy(Budgets.id)
      .orderBy(desc(Budgets.id));

    setBudgetList(result);
    getAllExpenses();
  };


  const getAllExpenses =async () =>{
    const result = await db.select({
      id:Expenses.id,
      name: Expenses.name,
      amount: Expenses.amount,
      createdAt: Expenses.createdAt
    }).from(Budgets).rightJoin(Expenses,eq(Budgets.id,Expenses.budgetId))
    .where(eq(Budgets.createdBy,user?.primaryEmailAddress?.emailAddress))
    .orderBy(desc(Expenses.id));

    console.log(result);
    
    setExpenseList(result)
  }

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Hi, {user?.fullName} ✌️</h1>
          <p className="text-gray-500 mt-1">Here&apos;s what happening with your money, Lets Manage your expense</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard title="Total Budget" value={totalBudget} type="budget" />
          <StatCard title="Total Spend" value={totalSpent} type="spend" />
          <StatCard title="No. Of Budget" value={budgetList.length} type="count" />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            {/* <ActivityChart budgetList={budgetList} />
            <ExpensesTable expenses={expenseList} /> */}
          </div>
          <div>
            <BudgetList budgets={budgetList}/>
          </div>
        </div>

        
      </div>
    </div>
  );
}
