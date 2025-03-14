"use client"

import { useState, useEffect } from "react"
import { toast } from "@/hooks/use-toast"
import { Expense, Income } from "@/interface"
import TransactionTable from "@/components/TransactionTable"
import TransactionHistoryChart from "@/components/TransactionChart"

export default function TransactionsPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [incomes, setIncomes] = useState<Income[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString())
  const [selectedMonth, setSelectedMonth] = useState<string>((new Date().getMonth() + 1).toString().padStart(2, "0"))
  const [activeView, setActiveView] = useState<"year" | "month">("month")

  useEffect(() => {
    const mockExpenses: Expense[] = [
      { id: 1, name: "Groceries", amount: 150, createdAt: "2024-04-01T10:00:00Z" },
      { id: 2, name: "Rent", amount: 800, createdAt: "2024-04-01T12:00:00Z" },
      { id: 3, name: "Utilities", amount: 100, createdAt: "2024-04-02T15:30:00Z" },
      { id: 4, name: "Dining out", amount: 75, createdAt: "2024-04-03T19:45:00Z" },
      { id: 5, name: "Shopping", amount: 200, createdAt: "2024-04-04T14:20:00Z" },
      { id: 6, name: "Entertainment", amount: 50, createdAt: "2024-04-05T20:15:00Z" },
      { id: 7, name: "Transportation", amount: 60, createdAt: "2024-04-06T08:30:00Z" },
      { id: 8, name: "Healthcare", amount: 120, createdAt: "2024-04-08T11:00:00Z" },
      { id: 9, name: "Education", amount: 250, createdAt: "2024-04-10T09:15:00Z" },
      { id: 10, name: "Subscription", amount: 15, createdAt: "2024-04-12T16:45:00Z" },
      { id: 11, name: "Home Improvement", amount: 180, createdAt: "2024-04-13T13:20:00Z" },
      { id: 12, name: "Insurance", amount: 110, createdAt: "2024-04-14T10:30:00Z" },
      { id: 13, name: "Gifts", amount: 70, createdAt: "2024-04-16T17:00:00Z" },
      { id: 14, name: "Electronics", amount: 300, createdAt: "2024-04-18T15:10:00Z" },
      { id: 15, name: "Clothing", amount: 130, createdAt: "2024-04-20T12:45:00Z" },
      { id: 16, name: "Fitness", amount: 80, createdAt: "2024-04-22T07:30:00Z" },
      { id: 17, name: "Travel", amount: 450, createdAt: "2024-04-24T09:00:00Z" },
      { id: 18, name: "Pet Supplies", amount: 40, createdAt: "2024-04-25T14:15:00Z" },
      { id: 19, name: "Office Supplies", amount: 25, createdAt: "2024-04-26T11:30:00Z" },
      { id: 20, name: "Charity", amount: 100, createdAt: "2024-04-28T16:20:00Z" },
      { id: 21, name: "Maintenance", amount: 90, createdAt: "2024-04-30T13:45:00Z" },
      // Add some transactions for March
      { id: 22, name: "Groceries", amount: 140, createdAt: "2024-03-05T10:00:00Z" },
      { id: 23, name: "Rent", amount: 800, createdAt: "2024-03-01T12:00:00Z" },
      { id: 24, name: "Utilities", amount: 95, createdAt: "2024-03-10T15:30:00Z" },
      // Add some transactions for May
      { id: 25, name: "Groceries", amount: 160, createdAt: "2024-05-03T10:00:00Z" },
      { id: 26, name: "Rent", amount: 800, createdAt: "2024-05-01T12:00:00Z" },
      { id: 27, name: "Utilities", amount: 105, createdAt: "2024-05-08T15:30:00Z" },
    ]

    const mockIncomes: Income[] = [
      { id: 1, name: "Salary", amount: 3000, createdAt: "2024-04-01T09:00:00Z", createdBy: "user1" },
      { id: 2, name: "Freelance", amount: 500, createdAt: "2024-04-03T14:30:00Z", createdBy: "user1" },
      { id: 3, name: "Dividends", amount: 200, createdAt: "2024-04-05T11:15:00Z", createdBy: "user1" },
      { id: 4, name: "Side Project", amount: 350, createdAt: "2024-04-07T16:45:00Z", createdBy: "user1" },
      { id: 5, name: "Tax Refund", amount: 800, createdAt: "2024-04-09T10:30:00Z", createdBy: "user1" },
      { id: 6, name: "Gift", amount: 100, createdAt: "2024-04-11T13:20:00Z", createdBy: "user1" },
      { id: 7, name: "Investment Return", amount: 250, createdAt: "2024-04-13T15:00:00Z", createdBy: "user1" },
      { id: 8, name: "Bonus", amount: 1000, createdAt: "2024-04-15T09:45:00Z", createdBy: "user1" },
      { id: 9, name: "Rental Income", amount: 700, createdAt: "2024-04-17T11:30:00Z", createdBy: "user1" },
      { id: 10, name: "Consulting", amount: 450, createdAt: "2024-04-19T14:15:00Z", createdBy: "user1" },
      { id: 11, name: "Royalties", amount: 120, createdAt: "2024-04-21T16:00:00Z", createdBy: "user1" },
      { id: 12, name: "Part-time Job", amount: 300, createdAt: "2024-04-23T10:30:00Z", createdBy: "user1" },
      { id: 13, name: "Cashback", amount: 50, createdAt: "2024-04-25T13:45:00Z", createdBy: "user1" },
      { id: 14, name: "Selling Items", amount: 180, createdAt: "2024-04-27T15:20:00Z", createdBy: "user1" },
      { id: 15, name: "Interest", amount: 75, createdAt: "2024-04-29T11:00:00Z", createdBy: "user1" },
      // Add some transactions for March
      { id: 16, name: "Salary", amount: 3000, createdAt: "2024-03-01T09:00:00Z", createdBy: "user1" },
      { id: 17, name: "Freelance", amount: 400, createdAt: "2024-03-15T14:30:00Z", createdBy: "user1" },
      // Add some transactions for May
      { id: 18, name: "Salary", amount: 3000, createdAt: "2024-05-01T09:00:00Z", createdBy: "user1" },
      { id: 19, name: "Freelance", amount: 600, createdAt: "2024-05-12T14:30:00Z", createdBy: "user1" },
    ]

    setExpenses(mockExpenses)
    setIncomes(mockIncomes)
    setIsLoading(false)
  }, [])

  // Handle chart interactions
  const handleChartViewChange = (view: "year" | "month") => {
    setActiveView(view)
  }

  const handleYearChange = (year: string) => {
    setSelectedYear(year)
  }

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month)
  }

  // Handle table actions
  const handleEditTransaction = (transaction: any) => {
    toast({
      title: "Edit Transaction",
      description: `Editing ${transaction.type}: ${transaction.name}`,
    })
    // In a real app, you would open a modal or navigate to an edit page
  }

  const handleDeleteTransaction = (transaction: any) => {
    toast({
      title: "Delete Transaction",
      description: `Deleting ${transaction.type}: ${transaction.name}`,
      variant: "destructive",
    })
    // In a real app, you would show a confirmation dialog and then delete
  }

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

