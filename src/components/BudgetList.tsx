import { Home } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Budget } from "@/interface";
import { iconMap } from "@/lib/icons";


interface BudgetListProps {
  budgets: Budget[];
}

export const BudgetList = ({ budgets }:BudgetListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest Budgets</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {budgets.length === 0 ? (
          <p className="text-gray-500">No budgets available.</p>
        ) : (
          budgets.map((budget) => {
            const percentage = ((budget.totalSpend ?? 0) / Number(budget.amount)) * 100;
            const IconComponent = iconMap[budget?.icon ?? "defaultIcon"] || Home;

            return (
              <div key={budget.id} className="rounded-lg border p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-gray-100 p-2">
                    <IconComponent className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{budget.name}</h3>
                      <p className="text-sm text-gray-500">
                        {budget.totalItems ?? 0} Items
                      </p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-purple-600">
                    ₹{budget.amount}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">
                      ₹{budget.totalSpend ?? 0} Spent
                    </span>
                    <span className="text-gray-500">
                      ₹{Number(budget.amount) - (budget.totalSpend ?? 0)} Remaining
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-100">
                    <div
                      className="h-2 rounded-full bg-purple-600 transition-all"
                      style={{ width: `${percentage.toFixed(2)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};
