"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Landmark, PlusCircle } from "lucide-react";
import { useState } from "react";
import { Input } from "@heroui/react";
import { db } from "@/lib/dbConfig";
import { Budgets } from "@/schema";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Card, CardContent } from "./ui/card";

interface CreateBudgetCardProps {
  className?: string;
  onRefreshData: () => void;
}

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
  onRefreshData,
}: CreateBudgetCardProps) {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [amount, setAmount] = useState<number | undefined>(undefined);
  const { user } = useUser();

  const onCreateBudget = async () => {
    if (!name || !amount || !user?.primaryEmailAddress?.emailAddress) {
      toast.error("Please fill all fields");
      return;
    }

    const result = await db
      .insert(Budgets)
      .values({
        name: name,
        amount: String(amount),
        icon: icon || null,
        createdBy: user.primaryEmailAddress.emailAddress,
      })
      .returning({ insertedId: Budgets.id });

    if (result.length > 0) {
      toast.success("Budget Added Successfully");
      onRefreshData();
    }

    setOpen(false);
  };

  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Card className="bg-[#1a1d29] border-gray-800 text-white mb-3">
          <CardContent className="flex flex-col items-center justify-center p-10">
            <Landmark className="h-16 w-16 text-purple-500 mb-4" />
            <p className="text-gray-400 text-center mb-6">
              Set budgets to manage spending limits and stay on track with
              shared expenses.
            </p>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Budget
            </Button>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] dark:bg-gray-950">
        <DialogHeader>
          <DialogTitle>Create New Budget</DialogTitle>
        </DialogHeader>
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
                <SelectItem key={index} value={category}>
                  {category}
                </SelectItem>
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
            onChange={(e) => setAmount(Number(e.target.value) || undefined)}
            required
          />
        </div>
        <Button onClick={() => onCreateBudget()} type="submit" className="mt-2">
          Create Budget
        </Button>
      </DialogContent>
    </Dialog>
  );
}