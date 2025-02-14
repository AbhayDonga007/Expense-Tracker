import { Home, TreePalmIcon as PalmTree } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Define Budget Interface
interface Budget {
  id: number;
  name: string;
  amount: number;
  icon?: string;
  totalSpend?: number;
  totalItems?: number;
}

interface BudgetListProps {
  budgets: Budget[]; 
}

export const BudgetList: React.FC<BudgetListProps> = ({ budgets }) => {
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
            const percentage = ((budget.totalSpend ?? 0) / budget.amount) * 100;

            return (
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
                      ₹{budget.amount - (budget.totalSpend ?? 0)} Remaining
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
