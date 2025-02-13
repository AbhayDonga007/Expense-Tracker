import { Home, TreePalmIcon as PalmTree } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Budget {
  id: string
  title: string
  icon: "home" | "garden"
  items: number
  spent: number
  total: number
}

export function BudgetList({budgets}:Budget) {
  const calPer = () =>{
    const per = (budgets?.totalSpend / budgets?.amount) * 100
    return per.toFixed(2)
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest Budgets</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {budgets.map((budget) => (
          <div key={budget.id} className="rounded-lg border p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-gray-100 p-2">
                  {budget.icon === "home" ? (
                    <Home className="h-4 w-4 text-gray-600" />
                  ) : (
                    <PalmTree className="h-4 w-4 text-gray-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">{budget.name}</h3>
                  <p className="text-sm text-gray-500">{budget?.totalItems} Item</p>
                </div>
              </div>
              <span className="text-lg font-bold text-purple-600">₹{budget?.amount}</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">₹{budget?.totalSpend ? budget?.totalSpend : 0} Spend</span>
                <span className="text-gray-500">₹{budget?.amount - budget?.totalSpend} Remaining</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-100">
                <div
                  className="h-2 rounded-full bg-purple-600 transition-all"
                  style={{ width: `${calPer()}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

