import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { db } from "@/lib/dbConfig";
import { Budgets, Expenses } from "@/schema";
import { eq } from "drizzle-orm";
import { use, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useUser } from "@clerk/nextjs";

const budgetCategories = [
  "Housing",
  "Utilities",
  "Groceries",
  "Transportation",
  "Insurance",
  "Fund",
  "Savings",
  "Investments",
  "Education",
  "Payments",
  "Loans",
  "Mortgage",
  "Dining",
  "Entertainment",
  "Hobbies",
  "Gaming",
  "Gym",
  "Medical",
  "Childcare",
  "Fees",
  "Travel",
  "Flight",
  "Donations",
  "Gifts",
  "Business",
  "Freelancing",
  "Advertising",
  "Software",
  "Pets",
  "Repairs",
  "Shopping",
  "Subscriptions",
];

export function ExpenseHeader({budget,onRefreshData}) {

  const route = useRouter()
  const [name, setName] = useState("");
  const [amount, setAmount] = useState();
  const [icon, setIcon] = useState("");
  const { user } = useUser();

  const deleteBudget =async () => {
    const deleteExpense = await db.delete(Expenses).where(eq(Expenses.budgetId,budget.id)).returning()
    if(deleteExpense){
      await db.delete(Budgets).where(eq(Budgets.id,budget.id)).returning()

      toast.success("Budget Deleted")
      route.replace('/dashboard/budgets')
    }
  }

  const [isEditOpen, setIsEditOpen] = useState(false)

  const UpdateBudget =async () => {
    const result = await db.update(Budgets).set({
      name:name,
      amount:amount,
      icon:icon,
    }).where(eq(Budgets.id,budget.id)).returning()

    if(result){
      toast.success("Budget Updated")
      onRefreshData()
    }
    setIsEditOpen(false)
  }

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/budgets">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">My Expenses</h1>
      </div>
      <div className="flex gap-2">
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <Button variant="outline" className="gap-2" onClick={() => setIsEditOpen(true)}>
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
          <DialogContent className="sm:max-w-[425px] dark:bg-gray-950">
            <DialogHeader>
              <DialogTitle>Edit Budget</DialogTitle>
            </DialogHeader>
            {/* <form onSubmit={handleEditSubmit} className="grid gap-4 py-4"> */}
              <div className="grid gap-2">
                <Label htmlFor="title">Budget Name</Label>
                <Input id="name" name="name" defaultValue={budget?.name} onChange={(e) => setName(e.target.value)} className="dark:bg-gray-900" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="icon">Category</Label>
                <Select onValueChange={setIcon} name="icon" defaultValue={budget?.icon}>
                  <SelectTrigger className="dark:bg-gray-900">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {budgetCategories.map((category, index) => (
                      <SelectItem key={index} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  defaultValue={budget?.amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="dark:bg-gray-900"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-sm text-gray-500 dark:text-gray-400">Current Spent: ${budget?.spent}</Label>
              </div>
              <Button onClick={()=>UpdateBudget()} type="submit" className="mt-2">
                Update Budget
              </Button>
            {/* </form> */}
          </DialogContent>
        </Dialog>
        
        <Button variant="destructive" >
        <AlertDialog>
          <AlertDialogTrigger className="flex gap-2">
            <Trash2 className="h-4 w-4" />
            Delete
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={()=>deleteBudget()}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        </Button>
      </div>
    </div>
  );
}
