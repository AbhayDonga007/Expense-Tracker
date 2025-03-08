"use client";
import {
  Dialog,
  DialogContent,
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
import { Incomes } from "@/schema";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import { Label } from "./ui/label";
import moment from "moment";

interface CreateBudgetCardProps {
  className?: string;
  onRefreshData: () => void;
}

const CreateIncomeCard = ({
  className,
  onRefreshData,
}: CreateBudgetCardProps) => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState<number | undefined>(undefined);
  const { user } = useUser();

  const onCreateIncome = async () => {
    if (!name || !amount || !user?.primaryEmailAddress?.emailAddress) {
      toast.error("Please fill all fields");
      return;
    }
  
    const result = await db
      .insert(Incomes)
      .values({
        name: name,
        amount: String(amount), // Ensure amount is stored as a string (numeric type)
        createdAt: moment().format('DD/MM/yyy'), // Store timestamp
        createdBy: user.primaryEmailAddress.emailAddress, // Store user's email
      })
      .returning({ insertedId: Incomes.id });
  
    if (result.length > 0) {
      toast.success("Income Added Successfully");
      onRefreshData();
    }
  
    setOpen(false);
  };
  

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
            Create New Income
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] dark:bg-gray-950">
        <DialogHeader>
          <DialogTitle>Create New Income</DialogTitle>
        </DialogHeader>
        <div className="grid gap-2">
          <Label htmlFor="title">Income Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="e.g. Scholarship"
            className="dark:bg-gray-900"
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            placeholder="e.g. 10000"
            className="dark:bg-gray-900"
            onChange={(e) => setAmount(Number(e.target.value) || undefined)}
            required
          />
        </div>
        <Button onClick={() => onCreateIncome()} type="submit" className="mt-2">
          Create Income
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default CreateIncomeCard;
