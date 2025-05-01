"use client"

import { useState, useEffect } from "react"
import { toast } from "@/hooks/use-toast"
import { Expense, Income } from "@/interface"
import TransactionTable, { Transaction } from "@/components/TransactionTable"
import TransactionHistoryChart from "@/components/TransactionChart"
import { db } from "@/lib/dbConfig"
import { Expenses, Incomes } from "@/schema"
import { eq } from "drizzle-orm"
import { useUser } from "@clerk/nextjs";

export default function TransactionsPage() {
  const { user } = useUser();
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [incomes, setIncomes] = useState<Income[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString())
  const [selectedMonth, setSelectedMonth] = useState<string>((new Date().getMonth() + 1).toString().padStart(2, "0"))
  const [activeView, setActiveView] = useState<"year" | "month">("month")

  useEffect(() => {
    if (user?.primaryEmailAddress) {
      fetchUserTransactions(user.primaryEmailAddress.emailAddress);
    }
  }, [user]);

  const fetchUserTransactions = async (userEmail: string) => {
    setIsLoading(true);
      const userExpenses = await db.select().from(Expenses).where(eq(Expenses.createdBy, userEmail));
      const userIncomes = await db.select().from(Incomes).where(eq(Incomes.createdBy, userEmail));
      const formattedExpenses = userExpenses.map(expense => ({
        ...expense,
        amount: parseFloat(expense.amount),
      }));

      const formattedIncomes = userIncomes.map(income => ({
        ...income,
        amount: parseFloat(income.amount),
      }));
      
      setIsLoading(false);
      setExpenses(formattedExpenses);
      setIncomes(formattedIncomes);
  };

  const handleChartViewChange = (view: "year" | "month") => {
    setActiveView(view)
  }

  const handleYearChange = (year: string) => {
    setSelectedYear(year)
  }

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month)
  }

  const handleEditTransaction = (transaction: Transaction) => {
    toast({
      title: "Edit Transaction",
      description: `Editing ${transaction.type}: ${transaction.name}`,
    });
  };
  
  const handleDeleteTransaction = (transaction: Transaction) => {
    toast({
      title: "Delete Transaction",
      description: `Deleting ${transaction.type}: ${transaction.name}`,
      variant: "destructive",
    });
  };

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-3xl font-bold">Transactions</h1>

      <div className="mb-8">
        <TransactionHistoryChart
          expenses={expenses}
          incomes={incomes}
          onViewChange={handleChartViewChange}
          onYearChange={handleYearChange}
          onMonthChange={handleMonthChange}
        />
      </div>

      <div>
        <TransactionTable
          expenses={expenses}
          incomes={incomes}
          selectedYear={selectedYear}
          selectedMonth={activeView === "month" ? selectedMonth : null}
          activeView={activeView}
          onEdit={handleEditTransaction}
          onDelete={handleDeleteTransaction}
        />
      </div>
    </div>
  )
}
