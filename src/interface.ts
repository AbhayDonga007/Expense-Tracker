export interface Budget {
  id: number;
  name: string;
  amount: string; 
  icon?: string | null;
  createdBy: string;
  totalSpend?: number;
  totalItems?: number;
}

export interface Expense {
  id: number;
  name: string;
  amount: number;
  createdAt: string;
}

export interface Income {
  id: number;
  name: string;
  amount: number;
  createdAt: string;
  createdBy?: string; 
}
