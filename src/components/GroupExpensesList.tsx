import { Card, CardContent } from "@/components/ui/card";
import { GroupBalance, GroupExpense, GroupMember } from "@/interface";
import { Calendar, Tag, Trash2, User } from "lucide-react";
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
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { db } from "@/lib/dbConfig";
import { GroupBalances, GroupExpenses } from "@/schema";
import { eq } from "drizzle-orm";
import toast from "react-hot-toast";

interface GroupExpensesListProps {
  members: GroupMember[];
  groupId: string;
  expenses: GroupExpense[];
  onRefreshData: () => void;
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

export function GroupExpensesList({ members,groupId,expenses, onRefreshData }: GroupExpensesListProps) {
  if (!expenses || expenses.length === 0) {
    return (
      <Card className="bg-[#1a1d29] border-gray-800 text-white">
        <CardContent className="flex flex-col items-center justify-center p-10">
          <h3 className="text-xl font-semibold mb-2">No Expenses Yet</h3>
          <p className="text-gray-400 text-center">
            Add your first expense to start tracking shared costs
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleDeleteExpense = async (expenseId: number) => {
    try {
      const result = await db.delete(GroupExpenses).where(eq(GroupExpenses.id, expenseId)).returning();
      if (result.length > 0) {
        toast.success("Expense deleted");
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
        
                onRefreshData();
      } else {
        toast.error("Expense not found");
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Failed to delete expense");
    }
  };

  const calculateGroupBalances = (
      members: GroupMember[],
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
        {} as { [id: string]: GroupMember }
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

  return (
    <div className="space-y-4">
      {expenses.map((expense: GroupExpense) => (
        <Card
          key={expense.description + expense.date}
          className="bg-[#1a1d29] border-gray-800 text-white"
        >
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">
                  {expense.description}
                </h3>
                <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    {new Date(expense.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Tag className="mr-2 h-4 w-4" />
                    {expense.category}
                  </div>
                  <div className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Paid by {expense.paidBy}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">
                  ₹{expense.amount.toLocaleString()}
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  Split {expense.splitType} among{" "}
                  {
                    (Array.isArray(expense.participants)
                      ? expense.participants
                      : JSON.parse(expense.participants)
                    ).length
                  }{" "}
                  people
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-800">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-medium text-gray-400 mb-2">
                  Participants
                </h4>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white bg-red-500/50 hover:text-white hover:bg-red-500/30"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-[#1a1d29] border-gray-800 text-white">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Expense</AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-400">
                        Are you sure you want to delete this expense? This
                        action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-transparent border-gray-700 text-white hover:bg-gray-800">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-600 hover:bg-red-700 text-white"
                        onClick={() => handleDeleteExpense(expense.id)}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              <div className="flex flex-wrap gap-2">
                {(Array.isArray(expense.participants)
                  ? expense.participants
                  : JSON.parse(expense.participants)
                ).map((participant: string) => (
                  <div
                    key={participant}
                    className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-300"
                  >
                    {participant}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
