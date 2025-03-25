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
  createdBy: string;
}

export interface Income {
  id: number;
  name: string;
  amount: number;
  createdAt: string;
  createdBy?: string; 
}

export interface GroupMember {
  id: string;
  name: string;
  email: string;
  isAdmin: string;
}

export interface GroupExpense {
  id: number;
  groupId: string;
  description: string;
  amount: number;
  category: string;
  paidBy: string;
  paidById: string;
  date: string;
  participants: string[];
  participantIds: string[];
  splitType: string;
}


export interface GroupBalance {
  from: string;
  to: string;
  fromId: string;
  toId: string;
  amount: number;
}

export interface Group {
  id: number;
  name: string;
  inviteLink: string;
  createdAt: string;
  createdBy: string;
  totalMembers: number;
  totalExpenses: number;
  lastActivity: string;
  members: GroupMember[];   
  expenses: GroupExpense[];
  balances: GroupBalance[];
}
