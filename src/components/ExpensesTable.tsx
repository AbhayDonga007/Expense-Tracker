"use client";
import { useState, useEffect } from "react";
import { format, isValid, parseISO } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Edit,
  MoreHorizontal,
  Search,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Expense } from "@/interface";
import toast from "react-hot-toast";
import { Expenses } from "@/schema";
import { db } from "@/lib/dbConfig";
import { eq } from "drizzle-orm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
import { useUser } from "@clerk/nextjs";

interface TableEntry {
  id: number;
  type: "income" | "expense";
  name: string;
  amount: number;
  createdAt: string;
  createdBy: string;
}

interface ExpensesTableProps {
  expenses: Expense[];
  onRefreshData: () => void;
}

export default function ExpensesTable({ expenses, onRefreshData }: ExpensesTableProps) {
  const [tableEntries, setTableEntries] = useState<TableEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<TableEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof TableEntry;
    direction: "ascending" | "descending";
  }>({
    key: "createdAt",
    direction: "descending",
  });
  const { user } = useUser();
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
      .set({ name, amount: String(amount), createdBy: user?.primaryEmailAddress?.emailAddress })
      .where(eq(Expenses.id, editExpense.id))
      .returning();

    if (result) {
      toast.success("Expense updated");
      setIsEditOpen(false);
      onRefreshData();
    }
  };

  useEffect(() => {
    const incomeEntries: TableEntry[] = expenses.map((expense) => ({
      id: expense.id,
      type: "expense",
      name: expense.name,
      amount: expense.amount,
      createdAt: expense.createdAt,
      createdBy: expense.createdBy,
    }));

    const allEntries = [...incomeEntries];
    setTableEntries(allEntries);
  }, [expenses]);

  useEffect(() => {
    let filtered = [...tableEntries];
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (entry) =>
          entry.name.toLowerCase().includes(query) ||
          entry.amount.toString().includes(query) ||
          entry.type.toLowerCase().includes(query) ||
          (entry.createdBy && entry.createdBy.toLowerCase().includes(query))
      );
    }

    filtered.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (sortConfig.key === "createdAt") {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortConfig.direction === "ascending"
          ? dateA - dateB
          : dateB - dateA;
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortConfig.direction === "ascending"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortConfig.direction === "ascending"
          ? aValue - bValue
          : bValue - aValue;
      }

      return 0;
    });

    setFilteredEntries(filtered);
    setCurrentPage(1);
  }, [tableEntries, searchQuery, sortConfig]);

  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEntries = filteredEntries.slice(startIndex, endIndex);

  const requestSort = (key: keyof TableEntry) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const parseCustomDate = (dateString: string): Date | null => {
    const dateParts = dateString.split("/");

    if (dateParts.length === 3) {
      return new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
    }

    return null;
  };

  const formatDate = (dateString: string) => {
    const parsedDate = parseCustomDate(dateString) || parseISO(dateString);

    return isValid(parsedDate)
      ? format(parsedDate, "MMM dd, yyyy")
      : "Invalid Date";
  };

  return (
    <div className="w-full space-y-4 rounded-lg bg-black p-6 text-white">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h2 className="text-2xl font-bold">Latest Expenses</h2>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search entries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-gray-900 pl-8 text-white"
          />
        </div>
      </div>

      <div className="rounded-md border border-gray-800">
        <Table>
          <TableHeader className="bg-gray-900">
            <TableRow>
              <TableHead
                className="cursor-pointer hover:text-primary"
                onClick={() => requestSort("type")}
              >
                Type{" "}
                {sortConfig.key === "type" &&
                  (sortConfig.direction === "ascending" ? "↑" : "↓")}
              </TableHead>
              <TableHead
                className="cursor-pointer hover:text-primary"
                onClick={() => requestSort("name")}
              >
                Name{" "}
                {sortConfig.key === "name" &&
                  (sortConfig.direction === "ascending" ? "↑" : "↓")}
              </TableHead>
              <TableHead
                className="cursor-pointer text-right hover:text-primary"
                onClick={() => requestSort("amount")}
              >
                Amount{" "}
                {sortConfig.key === "amount" &&
                  (sortConfig.direction === "ascending" ? "↑" : "↓")}
              </TableHead>
              <TableHead
                className="cursor-pointer hover:text-primary"
                onClick={() => requestSort("createdAt")}
              >
                Date{" "}
                {sortConfig.key === "createdAt" &&
                  (sortConfig.direction === "ascending" ? "↑" : "↓")}
              </TableHead>
              <TableHead
                className="cursor-pointer hover:text-primary"
                onClick={() => requestSort("createdBy")}
              >
                Created By{" "}
                {sortConfig.key === "createdBy" &&
                  (sortConfig.direction === "ascending" ? "↑" : "↓")}
              </TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentEntries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No entries found
                </TableCell>
              </TableRow>
            ) : (
              currentEntries.map((entry) => (
                <TableRow key={`${entry.type}-${entry.id}`}>
                  <TableCell>
                    <Badge
                      variant="default"
                      className={
                        entry.type === "income"
                          ? "bg-emerald-500/20 text-emerald-500"
                          : "bg-rose-500/20 text-rose-500"
                      }
                    >
                      {entry.type === "income" ? "Income" : "Expense"}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{entry.name}</TableCell>
                  <TableCell
                    className={`text-right font-medium ${
                      entry.type === "income"
                        ? "text-emerald-500"
                        : "text-rose-500"
                    }`}
                  >
                    {entry.type === "income" ? "+" : "-"}
                    {formatCurrency(entry.amount)}
                  </TableCell>
                  <TableCell>{formatDate(entry.createdAt)}</TableCell>
                  <TableCell>{entry.createdBy || "—"}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-gray-900 text-white"
                      >
                        <DropdownMenuItem
                          className="flex cursor-pointer items-center gap-2 text-blue-400 hover:text-blue-300"
                          onClick={() => openEditDialog(entry)}
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="flex cursor-pointer items-center gap-2 text-rose-500 hover:text-rose-400"
                          onClick={() => deleteExpense(entry)}
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => setItemsPerPage(Number.parseInt(value))}
          >
            <SelectTrigger className="h-8 w-[70px] bg-gray-900">
              <SelectValue placeholder={itemsPerPage.toString()} />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 text-white">
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-gray-400">
            Showing {startIndex + 1}-
            {Math.min(endIndex, filteredEntries.length)} of{" "}
            {filteredEntries.length}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-gray-900"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-gray-900"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages || 1}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-gray-900"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-gray-900"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
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
