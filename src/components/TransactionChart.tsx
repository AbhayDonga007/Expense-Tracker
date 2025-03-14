"use client"

import { useState, useEffect } from "react"
import { getDaysInMonth, parseISO } from "date-fns"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Circle } from "lucide-react"
import { Expense, Income } from "@/interface"

interface TransactionHistoryChartProps {
  expenses: Expense[]
  incomes: Income[]
  onViewChange?: (view: "year" | "month") => void
  onYearChange?: (year: string) => void
  onMonthChange?: (month: string) => void
}

interface BarClickData {
  monthValue?: string;
}

interface ChartData {
  label: string;
  income: number;
  expense: number;
}

export default function TransactionHistoryChart({
  expenses,
  incomes,
  onViewChange,
  onYearChange,
  onMonthChange,
}: TransactionHistoryChartProps) {
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString())
  const [selectedMonth, setSelectedMonth] = useState<string>((new Date().getMonth() + 1).toString().padStart(2, "0"))
  // const [chartData, setChartData] = useState<[]>([])
  // console.log(setChartData);
  
  const [activeView, setActiveView] = useState<"year" | "month">("month")
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - 2 + i).toString())
  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ]

  // Handle view change
  const handleViewChange = (value: string) => {
    const view = value as "year" | "month"
    setActiveView(view)
    if (onViewChange) {
      onViewChange(view)
    }
  }

  // Handle year change
  const handleYearChange = (value: string) => {
    setSelectedYear(value)
    if (onYearChange) {
      onYearChange(value)
    }
  }

  // Handle month change
  const handleMonthChange = (value: string) => {
    setSelectedMonth(value)
    if (onMonthChange) {
      onMonthChange(value)
    }
  }

  // Handle bar click
  const handleBarClick = (data: BarClickData) => {
    if (activeView === "year" && data?.monthValue) {
      setSelectedMonth(data.monthValue)
      setActiveView("month")
      if (onViewChange) {
        onViewChange("month")
      }
      if (onMonthChange) {
        onMonthChange(data.monthValue)
      }
    }
  }

  useEffect(() => {
    // Generate data based on the active view (year or month)
    const generateChartData = () => {
      if (activeView === "month") {
        // Month view - show daily data
        const daysInMonth = getDaysInMonth(new Date(Number.parseInt(selectedYear), Number.parseInt(selectedMonth) - 1))
        const data = Array.from({ length: daysInMonth }, (_, i) => {
          const day = (i + 1).toString().padStart(2, "0")
          return {
            label: day,
            income: 0,
            expense: 0,
          }
        })

        // Filter expenses for the selected year and month
        const filteredExpenses = expenses.filter((expense) => {
          if (!expense.createdAt) return false
          
            const date = parseISO(expense.createdAt)
            return (
              date.getFullYear().toString() === selectedYear &&
              (date.getMonth() + 1).toString().padStart(2, "0") === selectedMonth
            )
        })

        // Filter incomes for the selected year and month
        const filteredIncomes = incomes.filter((income) => {
          if (!income.createdAt) return false
       
            const date = parseISO(income.createdAt)
            return (
              date.getFullYear().toString() === selectedYear &&
              (date.getMonth() + 1).toString().padStart(2, "0") === selectedMonth
            )
        })

        // Aggregate expenses by day
        filteredExpenses.forEach((expense) => {
          
            const date = parseISO(expense.createdAt)
            const day = date.getDate().toString().padStart(2, "0")
            const dayIndex = Number.parseInt(day) - 1
            if (dayIndex >= 0 && dayIndex < data.length) {
              data[dayIndex].expense += Number(expense.amount)
            }
        })

        // Aggregate incomes by day
        filteredIncomes.forEach((income) => {
         
            const date = parseISO(income.createdAt)
            const day = date.getDate().toString().padStart(2, "0")
            const dayIndex = Number.parseInt(day) - 1
            if (dayIndex >= 0 && dayIndex < data.length) {
              data[dayIndex].income += Number(income.amount)
            }
        })

        return data
      } else {
        // Year view - show monthly data
        const data = months.map((month) => {
          return {
            label: month.label.substring(0, 3), // Short month name
            income: 0,
            expense: 0,
            monthValue: month.value,
          }
        })

        // Filter expenses for the selected year
        const filteredExpenses = expenses.filter((expense) => {
          if (!expense.createdAt) return false
          
            const date = parseISO(expense.createdAt)
            return date.getFullYear().toString() === selectedYear
        
        })

        // Filter incomes for the selected year
        const filteredIncomes = incomes.filter((income) => {
          if (!income.createdAt) return false
         
            const date = parseISO(income.createdAt)
            return date.getFullYear().toString() === selectedYear
         
        })

        // Aggregate expenses by month
        filteredExpenses.forEach((expense) => {
          
            const date = parseISO(expense.createdAt)
            const monthIndex = date.getMonth()
            if (monthIndex >= 0 && monthIndex < data.length) {
              data[monthIndex].expense += Number(expense.amount)
            }
         
        })

        // Aggregate incomes by month
        filteredIncomes.forEach((income) => {
          
            const date = parseISO(income.createdAt)
            const monthIndex = date.getMonth()
            if (monthIndex >= 0 && monthIndex < data.length) {
              data[monthIndex].income += Number(income.amount)
            }
        })

        return data
      }
    }

    
    console.log(chartData);
    

    setChartData(generateChartData())
  }, [activeView, selectedYear, selectedMonth, expenses, incomes])

  return (
    <div className="w-full rounded-lg bg-black p-6 text-white">
      <h2 className="mb-4 text-2xl font-bold">History</h2>

      <div className="mb-6 flex flex-wrap items-center gap-4">
        <Tabs defaultValue="month" className="w-auto" onValueChange={handleViewChange}>
          <TabsList className="bg-gray-900">
            <TabsTrigger value="year">Year</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </TabsList>
        </Tabs>

        <Select value={selectedYear} onValueChange={handleYearChange}>
          <SelectTrigger className="w-32 bg-gray-900 text-white">
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 text-white">
            {years.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {activeView === "month" && (
          <Select value={selectedMonth} onValueChange={handleMonthChange}>
            <SelectTrigger className="w-32 bg-gray-900 text-white">
              <SelectValue placeholder="Select Month" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 text-white">
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <div className="ml-auto flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Circle className="h-4 w-4 fill-emerald-500 text-emerald-500" />
            <span>Income</span>
          </div>
          <div className="flex items-center gap-2">
            <Circle className="h-4 w-4 fill-rose-500 text-rose-500" />
            <span>Expense</span>
          </div>
        </div>
      </div>

      {chartData.length === 0 || chartData.every((item:ChartData) => item.income === 0 && item.expense === 0) ? (
        <div className="flex h-[300px] w-full items-center justify-center text-gray-400">
          No transaction data available for this period
        </div>
      ) : (
        <ChartContainer
          config={{
            income: {
              label: "Income",
              color: "hsl(153, 80%, 50%)",
            },
            expense: {
              label: "Expense",
              color: "hsl(350, 80%, 60%)",
            },
          }}
          className="h-[300px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              barGap={0}
              barCategoryGap={4}
              onClick={(data) => {
                if (activeView === "year" && data?.activePayload?.[0]?.payload) {
                  handleBarClick(data.activePayload[0].payload)
                }
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }}
                domain={[0, "auto"]}
              />
              <Bar dataKey="income" fill="var(--color-income)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" fill="var(--color-expense)" radius={[4, 4, 0, 0]} />
              <ChartTooltip
                content={<ChartTooltipContent className="bg-gray-900 border-gray-800 text-white" />}
                cursor={false}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      )}
    </div>
  )
}

