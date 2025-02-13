import { PiggyBank, FileText, Wallet } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface StatCardProps {
  title: string
  value: string | number
  type: "budget" | "spend" | "count"
}

export function StatCard({ title, value, type }: StatCardProps) {
  const Icon = {
    budget: PiggyBank,
    spend: FileText,
    count: Wallet,
  }[type]

  return (
    <Card>
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold mt-1">
            {typeof value === "number" && type !== "count" ? `₹${value}` : value}
          </h3>
        </div>
        <div className="rounded-full bg-purple-600 p-3">
          <Icon className="h-6 w-6 text-white" />
        </div>
      </CardContent>
    </Card>
  )
}

