import { useState } from "react";
import { Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { db } from "@/lib/dbConfig";
import { Expenses } from "@/schema";
import { eq } from "drizzle-orm";
import toast from "react-hot-toast";
import { Expense } from "@/interface";

interface ExpensesTableProps {
  expenses: Expense[];
  onRefreshData: () => void;
}

export function ExpensesTable({ expenses, onRefreshData }: ExpensesTableProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editExpense, setEditExpense] = useState<Expense | null>(null);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0);

  const deleteExpense = async (expense: Expense) => {
    const result = await db.delete(Expenses).where(eq(Expenses.id, Number(expense.id))).returning();
    if (result) {
      toast.success("Expense deleted");
      onRefreshData();
    }
  };

  const openEditDialog = (expense: Expense) => {
    setEditExpense(expense);
    setName(expense.name);
    setAmount(expense.amount);
    setIsEditOpen(true);
  };

  const updateExpense = async () => {
    if (!editExpense) return;
    const result = await db
      .update(Expenses)
      .set({ name, amount: String(amount) })
      .where(eq(Expenses.id, editExpense.id))
      .returning();

    if (result) {
      toast.success("Expense updated");
      setIsEditOpen(false);
      onRefreshData();
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Latest Expenses</h2>
      <div className="rounded-lg border">
        <div className="grid grid-cols-5 gap-4 p-4 font-medium">
          <div>Name</div>
          <div>Amount</div>
          <div>Date</div>
          <div>Actions</div>
        </div>
        {expenses.map((expense) => (
          <div key={expense.id} className="grid grid-cols-5 gap-4 border-t p-4">
            <div>{expense.name}</div>
            <div>₹{expense.amount}</div>
            <div>{expense.createdAt}</div>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => openEditDialog(expense)}
                className="text-blue-600 hover:text-blue-700"
              >
                <Pencil className="h-4 w-4" />
              </Button>
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

      {/* Edit Expense Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px] dark:bg-gray-950">
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
          </DialogHeader>
          <div className="grid gap-2">
            <Label htmlFor="name">Expense Name</Label>
            <Input
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="dark:bg-gray-900"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="dark:bg-gray-900"
              required
            />
          </div>
          <Button onClick={updateExpense} className="mt-2">
            Update Expense
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
