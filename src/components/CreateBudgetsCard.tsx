"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Input } from "@heroui/react";
import { db } from "@/lib/dbConfig";
import { Budgets } from "@/schema";
import { useUser } from "@clerk/nextjs";
import { Toast } from "@radix-ui/react-toast";
import toast from "react-hot-toast";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface CreateBudgetCardProps {
  className?: string
}

const initialBudgets = [
  { id: "1", title: "Books", icon: "books", amount: 1000, spent: 0, items: 0 },
  { id: "2", title: "Fruits", icon: "fruits", amount: 200, spent: 0, items: 0 },
  {
    id: "3",
    title: "Laptop",
    icon: "laptop",
    amount: 3000,
    spent: 0,
    items: 0,
  },
  { id: "4", title: "Loan", icon: "loan", amount: 5000, spent: 0, items: 0 },
  {
    id: "5",
    title: "Shopping",
    icon: "shopping",
    amount: 1000,
    spent: 0,
    items: 0,
  },
  {
    id: "6",
    title: "Travel",
    icon: "travel",
    amount: 2000,
    spent: 0,
    items: 0,
  },
];

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


export function CreateBudgetCard({
  className, onRefreshData
}: CreateBudgetCardProps) {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [amount, setAmount] = useState();
  const { user } = useUser();

  const [budgets, setBudgets] = useState(initialBudgets)
  

  const onCreateBudget =async () => {
    const result = await db
      .insert(Budgets)
      .values({
        name: name,
        amount: amount,
        icon:icon,
        createdBy: user?.primaryEmailAddress?.emailAddress,
      })
      .returning({ insertedId: Budgets.id });

    if (result) {
      toast.success("Budget Added Successful");
      onRefreshData()
    }
    setOpen(false)
  }

  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className={cn(
            "group relative flex h-[200px] w-full flex-col items-center justify-center gap-4",
            "rounded-xl border border-dashed border-gray-200 bg-gray-50/50",
            "transition-all hover:border-gray-300 hover:bg-gray-50/80",
            "dark:border-gray-800 dark:bg-gray-950/50 dark:hover:border-gray-700 dark:hover:bg-gray-950/80",
            className
          )}
        >
          <div className="rounded-full bg-gray-100 p-4 transition-transform group-hover:scale-110 dark:bg-gray-900">
            <Plus className="h-6 w-6 text-gray-600 dark:text-gray-400" />
          </div>
          <span className="text-lg font-medium text-gray-600 dark:text-gray-400">
            Create New Budget
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] dark:bg-gray-950">
        <DialogHeader>
          <DialogTitle>Create New Budget</DialogTitle>
        </DialogHeader>
        {/* <form onSubmit={handleCreateBudget} className="grid gap-4 py-4"> */}
          <div className="grid gap-2">
            <Label htmlFor="title">Budget Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g. Groceries"
              className="dark:bg-gray-900"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="icon">Category</Label>
            <Select onValueChange={setIcon} name="icon">
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
              placeholder="e.g. 1000"
              className="dark:bg-gray-900"
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <Button onClick={()=>onCreateBudget()} type="submit" className="mt-2">
            Create Budget
          </Button>
        {/* </form> */}
      </DialogContent>
    </Dialog>
  );
}

{
  /* <Dialog>
      <DialogTrigger asChild>
        <Button
          className={cn(
            "flex h-full min-h-[130px] mb-6 w-[100%] flex-col items-center justify-center gap-2 rounded-lg p-4 shadow-sm",
            className
          )}
        >
          <div className="rounded-full bg-gray-100 p-2">
            <Plus className="h-6 w-6 text-gray-600" />
          </div>
          <span className="font-medium text-black">Create New Budget</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-auto">
        <DialogHeader>
          <DialogTitle>Create New Budget</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="name" className="text-right">
              Budget Name
            </label>
            <Input id="name" placeholder="e.g. Shopping" onChange={(e) => setName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="amount" className="text-right">
             Amount
            </label>
            <Input type="number" id="amount" placeholder="e.g. 5000" onChange={(e) => setAmount(e.target.value)} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button disabled={!(name&&amount)} onClick={()=>onCreateBudget()} type="submit">Create Budget</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog> */
}
