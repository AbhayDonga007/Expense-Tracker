import { Home } from "lucide-react"

interface ExpenseCardProps {
  title: string
  items: number
  spent: number
  total: number
}

export function ExpenseCard({ title, items, spent, total }: ExpenseCardProps) {
  const remaining = total - spent
  const progress = (spent / total) * 100

  return (
    <div className="rounded-lg p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-purple-100 p-2">
            <Home className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="text-sm text-gray-500">
              {items} Item{items !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <span className="text-xl font-bold text-purple-600">${total}</span>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">${spent} Spend</span>
          <span className="text-gray-600">${remaining} Remaining</span>
        </div>
        <div className="h-2 rounded-full bg-gray-100">
          <div className="h-full rounded-full bg-purple-600 transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  )
}

