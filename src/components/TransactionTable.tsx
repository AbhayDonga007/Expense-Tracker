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
import { Expense, Income } from "@/interface";

export interface Transaction {
  id: number;
  type: "income" | "expense";
  name: string;
  amount: number;
  date: string;
  createdBy?: string;
}

interface TransactionTableProps {
  expenses: Expense[];
  incomes: Income[];
  selectedYear: string;
  selectedMonth: string | null;
  activeView: "year" | "month";
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transaction: Transaction) => void;
}

export default function TransactionTable({
  expenses,
  incomes,
  selectedYear,
  selectedMonth,
  activeView,
  onEdit,
  onDelete,
}: TransactionTableProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Transaction;
    direction: "ascending" | "descending";
  }>({
    key: "date",
    direction: "descending",
  });

  const parseCustomDate = (dateString: string): Date | null => {
    const dateParts = dateString.split("/");

    if (dateParts.length === 3) {
      return new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
    }

    return null;
  };

  useEffect(() => {
    const expenseTransactions: Transaction[] = expenses.map((expense) => ({
      id: expense.id,
      type: "expense",
      name: expense.name,
      amount: expense.amount,
      date: expense.createdAt,
    }));

    const incomeTransactions: Transaction[] = incomes.map((income) => ({
      id: income.id,
      type: "income",
      name: income.name,
      amount: income.amount,
      date: income.createdAt,
      createdBy: income.createdBy,
    }));

    const allTransactions = [...expenseTransactions, ...incomeTransactions];
    setTransactions(allTransactions);
  }, [expenses, incomes]);

  useEffect(() => {
    let filtered = [...transactions];

    filtered = filtered.filter((transaction) => {
      const date = parseCustomDate(transaction.date);
      return date && date.getFullYear().toString() === selectedYear;
    });

    if (activeView === "month" && selectedMonth) {
      filtered = filtered.filter((transaction) => {
        const date = parseCustomDate(transaction.date);
        return (
          date &&
          (date.getMonth() + 1).toString().padStart(2, "0") === selectedMonth
        );
      });
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (transaction) =>
          transaction.name.toLowerCase().includes(query) ||
          transaction.amount.toString().includes(query) ||
          transaction.type.toLowerCase().includes(query)
      );
    }

    filtered.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (sortConfig.key === "date") {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
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

    setFilteredTransactions(filtered);
    setCurrentPage(1);
  }, [
    transactions,
    selectedYear,
    selectedMonth,
    activeView,
    searchQuery,
    sortConfig,
  ]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex);

  const requestSort = (key: keyof Transaction) => {
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

  const formatDate = (dateString: string) => {
    const parsedDate = parseCustomDate(dateString) || parseISO(dateString);

    return isValid(parsedDate)
      ? format(parsedDate, "MMM dd, yyyy")
      : "Invalid Date";
  };

  return (
    <div className="w-full space-y-4 rounded-lg bg-black p-6 text-white">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h2 className="text-2xl font-bold">
          Transactions
          {activeView === "year" && (
            <span className="ml-2 text-lg">({selectedYear})</span>
          )}
          {activeView === "month" && selectedMonth && (
            <span className="ml-2 text-lg">
              (
              {format(
                new Date(
                  Number.parseInt(selectedYear),
                  Number.parseInt(selectedMonth) - 1,
                  1
                ),
                "MMMM yyyy"
              )}
              )
            </span>
          )}
        </h2>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search transactions..."
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
                onClick={() => requestSort("date")}
              >
                Date{" "}
                {sortConfig.key === "date" &&
                  (sortConfig.direction === "ascending" ? "↑" : "↓")}
              </TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No transactions found
                </TableCell>
              </TableRow>
            ) : (
              currentTransactions.map((transaction) => (
                <TableRow key={`${transaction.type}-${transaction.id}`}>
                  <TableCell>
                    <Badge
                      variant={
                        transaction.type === "income"
                          ? "default"
                          : "destructive"
                      }
                      className={
                        transaction.type === "income"
                          ? "bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-500"
                          : "bg-rose-500/20 text-rose-500"
                      }
                    >
                      {transaction.type === "income" ? "Income" : "Expense"}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {transaction.name}
                  </TableCell>
                  <TableCell
                    className={`text-right font-medium ${
                      transaction.type === "income"
                        ? "text-emerald-500"
                        : "text-rose-500"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </TableCell>
                  <TableCell>{formatDate(transaction.date)}</TableCell>
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
                          onClick={() => onEdit && onEdit(transaction)}
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="flex cursor-pointer items-center gap-2 text-rose-500 hover:text-rose-400"
                          onClick={() => onDelete && onDelete(transaction)}
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
            {Math.min(endIndex, filteredTransactions.length)} of{" "}
            {filteredTransactions.length}
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
    </div>
  );
}
