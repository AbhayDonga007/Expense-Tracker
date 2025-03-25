"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HandCoins, PlusCircle } from "lucide-react";
import { useState } from "react";
import { Input } from "@heroui/react";
import { db } from "@/lib/dbConfig";
import { Incomes } from "@/schema";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import { Label } from "./ui/label";
import moment from "moment";
import { Card, CardContent } from "./ui/card";

interface CreateBudgetCardProps {
  className?: string;
  onRefreshData: () => void;
}

const CreateIncomeCard = ({
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
        amount: String(amount), 
        createdAt: moment().format("DD/MM/yyy"), 
        createdBy: user.primaryEmailAddress.emailAddress, 
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
        <Card className="bg-[#1a1d29] border-gray-800 text-white mb-3">
          <CardContent className="flex flex-col items-center justify-center p-10">
            <HandCoins className="h-16 w-16 text-purple-500 mb-4" />
            <p className="text-gray-400 text-center mb-6">
              Add your income to start tracking and sharing expenses with others.
            </p>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Income
            </Button>
          </CardContent>
        </Card>
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
