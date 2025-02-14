interface Budget {
  id: number;
  name: string;
  amount: string; // Stored as text in DB
  icon?: string | null;
  createdBy: string;
  totalSpend?: number;
  totalItems?: number;
}

interface Expense {
  id: number;
  name: string;
  amount: number;
  createdAt: string;
}