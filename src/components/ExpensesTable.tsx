import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { db } from "@/lib/dbConfig"
import { Expenses } from "@/schema"
import { eq } from "drizzle-orm"
import toast from "react-hot-toast"

interface Expense {
  id: string
  name: string
  amount: number
  createdAt: string
}

interface ExpensesTableProps {
  expenses: Expense[]
}

export function ExpensesTable({ expenses,onRefreshData }: ExpensesTableProps) {
  const deleteExpense =async (expense) =>{
    const result = await db.delete(Expenses).where(eq(Expenses.id,expense.id)).returning()
    if(result){
      toast.success("Expense deleted")
      onRefreshData();
    }

  }
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Latest Expenses</h2>
      <div className="rounded-lg border">
        <div className="grid grid-cols-4 gap-4 p-4 font-medium">
          <div>Name</div>
          <div>Amount</div>
          <div>Date</div>
          <div>Action</div>
        </div>
        {expenses.map((expense) => (
          <div key={expense.id} className="grid grid-cols-4 gap-4 border-t p-4">
            <div>{expense.name}</div>
            <div>₹{expense.amount}</div>
            <div>{expense.createdAt}</div>
            <div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteExpense(expense)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

