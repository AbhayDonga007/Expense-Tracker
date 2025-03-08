import { useState } from "react";
import { Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { db } from "@/lib/dbConfig";
import { Incomes } from "@/schema";
import { eq } from "drizzle-orm";
import toast from "react-hot-toast";
import { Income } from "@/interface";

interface IncomeTableProps {
  incomes: Income[];
  onRefreshData: () => void;
}

export function IncomeTable({ incomes, onRefreshData }: IncomeTableProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editIncome, setEditIncome] = useState<Income | null>(null);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0);

  const deleteIncome = async (income: Income) => {
    const result = await db.delete(Incomes).where(eq(Incomes.id, Number(income.id))).returning();
    if (result) {
      toast.success("Income deleted");
      onRefreshData();
    }
  };

  const openEditDialog = (income: Income) => {
    setEditIncome(income);
    setName(income.name);
    setAmount(income.amount);
    setIsEditOpen(true);
  };

  const updateIncome = async () => {
    if (!editIncome) return;
    const result = await db
      .update(Incomes)
      .set({ name, amount: String(amount) }) 
      .where(eq(Incomes.id, editIncome.id))
      .returning();

    if (result) {
      toast.success("Income updated");
      setIsEditOpen(false);
      onRefreshData();
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Latest Incomes</h2>
      <div className="rounded-lg border">
        <div className="grid grid-cols-4 gap-4 p-4 font-medium">
          <div>Name</div>
          <div>Amount</div>
          <div>Date</div>
          <div>Actions</div>
        </div>
        {incomes.map((income) => (
          <div key={income.id} className="grid grid-cols-4 gap-4 border-t p-4">
            <div>{income.name}</div>
            <div>₹{income.amount}</div>
            <div>{income.createdAt}</div>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => openEditDialog(income)}
                className="text-blue-600 hover:text-blue-700"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteIncome(income)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Income Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px] dark:bg-gray-950">
          <DialogHeader>
            <DialogTitle>Edit Income</DialogTitle>
          </DialogHeader>
          <div className="grid gap-2">
            <Label htmlFor="name">Income Name</Label>
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
          <Button onClick={updateIncome} className="mt-2">
            Update Income
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
