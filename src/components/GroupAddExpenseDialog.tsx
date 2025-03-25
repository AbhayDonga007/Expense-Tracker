"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { db } from "@/lib/dbConfig";
import { GroupBalances, GroupExpenses } from "@/schema";
import toast from "react-hot-toast";
import { GroupBalance } from "@/interface";
import { eq } from "drizzle-orm";

interface Member {
  id: string;
  name: string;
}

interface ExpenseData {
  groupId: number;
  description: string;
  amount: string;
  category: string;
  paidBy: string;
  paidById: string;
  date: string;
  participants: string[];
  participantIds: string[];
  splitType: string;
}

interface GroupAddExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  members: Member[];
  groupId: string;
  onRefreshData?: () => void;
}

export function GroupAddExpenseDialog({
  open,
  onOpenChange,
  members,
  groupId,
}: GroupAddExpenseDialogProps) {
  const [date, setDate] = useState(new Date());
  const [selectedMembers, setSelectedMembers] = useState(
    members?.map((member) => member.id)
  );
  const [splitType, setSplitType] = useState("equal");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [paidById, setPaidById] = useState("");
  const [paidByName, setPaidByName] = useState("");

  const categories = [
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

  const toggleMember = (memberId: string) => {
    setSelectedMembers((prev) =>
      (prev ?? []).includes(memberId)
        ? (prev ?? []).filter((id) => id !== memberId)
        : [...(prev ?? []), memberId]
    );
  };

  const onAddExpense = async (data: ExpenseData) => {
    try {
      const result = await db
        .insert(GroupExpenses)
        .values({
          groupId:Number(groupId),
          description: data.description,
          amount: data.amount,
          category: data.category,
          paidBy: data.paidBy,
          paidById: data.paidById,
          date: data.date,
          participants: JSON.stringify(data.participants),
          participantIds: JSON.stringify(data.participantIds),
          splitType: data.splitType,
        })
        .returning({ insertedId: GroupExpenses.id });
  
      if (result.length > 0) {
        toast.success("Expense Added Successfully");
  
        const allExpenses = await db
          .select()
          .from(GroupExpenses)
          .where(eq(GroupExpenses.groupId, Number(groupId)));
  
        const expensesFormatted: ExpenseData[] = allExpenses.map((exp) => ({
          groupId: exp.groupId,
          description: exp.description,
          amount: exp.amount,
          category: exp.category,
          paidBy: exp.paidBy,
          paidById: exp.paidById,
          date: exp.date,
          participants: JSON.parse(exp.participants),
          participantIds: JSON.parse(exp.participantIds),
          splitType: exp.splitType,
        }));
  
        const newBalances = calculateGroupBalances(members, expensesFormatted);
  
        await db.delete(GroupBalances).where(eq(GroupBalances.groupId, Number(groupId)));
  
        if (newBalances.length > 0) {
          await db.insert(GroupBalances).values(
            newBalances.map((bal) => ({
              groupId: Number(groupId), 
              from: bal.from,
              fromId: bal.fromId,
              to: bal.to,
              toId: bal.toId,
              amount: String(bal.amount), 
            }))
          );
          
        }

        // onRefreshData();
  
        onOpenChange(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while adding expense & updating balances");
    }
  };
  

 const calculateGroupBalances = (
    members: Member[],
    expenses: ExpenseData[]
  ): GroupBalance[] => {
    const balancesMap: { [fromId: string]: { [toId: string]: number } } = {};
  
    const addBalance = (fromId: string, toId: string, amount: number) => {
      if (!balancesMap[fromId]) {
        balancesMap[fromId] = {};
      }
      if (!balancesMap[fromId][toId]) {
        balancesMap[fromId][toId] = 0;
      }
      balancesMap[fromId][toId] += amount;
    };
  
    expenses.forEach((expense) => {
      const participantIds: string[] = Array.isArray(expense.participantIds)
      ? expense.participantIds
      : JSON.parse(expense.participantIds);
      const payerId = expense.paidById;
      const amount = Number(expense.amount);
      const share = amount / participantIds.length;
  
      participantIds.forEach((participantId) => {
        if (participantId !== payerId) {
          addBalance(participantId, payerId, share);
        }
      });
    });
  
    const finalBalances: GroupBalance[] = [];
    const membersMap = members.reduce(
      (acc, m) => ({ ...acc, [m.id]: m }),
      {} as { [id: string]: Member }
    );
  
    for (const fromId in balancesMap) {
      for (const toId in balancesMap[fromId]) {
        const amount = balancesMap[fromId][toId];
        const reverseAmount =
          balancesMap[toId]?.[fromId] ?? 0;
  
        const netAmount = amount - reverseAmount;
        if (netAmount > 0) {
          finalBalances.push({
            from: membersMap[fromId].name,
            to: membersMap[toId].name,
            fromId: fromId,
            toId: toId,
            amount: netAmount,
          });
        }
      }
    }
    
    return finalBalances;
  };
  
  
  

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    const description = (
      form.elements.namedItem("description") as HTMLInputElement
    )?.value;
    const amount = (form.elements.namedItem("amount") as HTMLInputElement)
      ?.value;

    if (
      !description ||
      !amount ||
      !selectedCategory ||
      !paidByName ||
      !paidById ||
      !selectedMembers.length
    ) {
      toast.error("Please fill all fields");
      return;
    }

    const expenseData: ExpenseData = {
      groupId :Number(groupId),
      description,
      amount: amount,
      category: selectedCategory,
      paidBy: paidByName,
      paidById: paidById,
      date: format(date, "yyyy-MM-dd"),
      participants: members
        .filter((m) => selectedMembers.includes(m.id))
        .map((m) => m.name),
      participantIds: selectedMembers,
      splitType,
    };

    onAddExpense(expenseData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1a1d29] border-gray-800 text-white sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-xl">Add New Expense</DialogTitle>
            <DialogDescription className="text-gray-400">
              Enter the details of the expense to split with the group.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="description" className="text-white">
                Description
              </Label>
              <Input
                id="description"
                name="description"
                placeholder="What was this expense for?"
                className="bg-[#0f1117] border-gray-700 text-white"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount" className="text-white">
                Amount (₹)
              </Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                placeholder="0.00"
                className="bg-[#0f1117] border-gray-700 text-white"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category" className="text-white">
                  Category
                </Label>
                <Select onValueChange={setSelectedCategory}>
                  <SelectTrigger className="bg-[#0f1117] border-gray-700 text-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1d29] border-gray-800 text-white">
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="bg-[#0f1117] border-gray-700 text-white justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="bg-[#1a1d29] border-gray-800 text-white p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(value) => {
                        if (value) setDate(value);
                      }}
                      initialFocus
                      className="bg-[#1a1d29]"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="paidBy" className="text-white">
                Paid By
              </Label>
              <Select
                onValueChange={(value) => {
                  const member = members.find((m) => m.id.toString() === value);
                  setPaidById(member?.id.toString() || "");
                  setPaidByName(member?.name || "");
                }}
              >
                <SelectTrigger className="bg-[#0f1117] border-gray-700 text-white">
                  <SelectValue placeholder="Who paid?" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1d29] border-gray-800 text-white">
                  {members?.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label className="text-white">Split Type</Label>
              <Select value={splitType} onValueChange={setSplitType}>
                <SelectTrigger className="bg-[#0f1117] border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1d29] border-gray-800 text-white">
                  <SelectItem value="equal">Equal Split</SelectItem>
                  <SelectItem value="percentage">Percentage Split</SelectItem>
                  <SelectItem value="custom">Custom Amounts</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label className="text-white">Split With</Label>
              <div className="bg-[#0f1117] border border-gray-700 rounded-md p-3 space-y-2">
                {members?.map((member) => (
                  <div key={member.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`member-${member.id}`}
                      checked={selectedMembers?.includes(member.id)}
                      onCheckedChange={() => toggleMember(member.id)}
                    />
                    <label
                      htmlFor={`member-${member.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white"
                    >
                      {member.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {splitType !== "equal" && (
              <div className="bg-[#0f1117] border border-gray-700 rounded-md p-3">
                <p className="text-sm text-yellow-400 mb-2">
                  {splitType === "percentage"
                    ? "Custom percentage splits will be available in the next step"
                    : "Custom amount splits will be available in the next step"}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-700 text-white hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-purple-600 text-white hover:bg-purple-700">
              Add Expense
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
