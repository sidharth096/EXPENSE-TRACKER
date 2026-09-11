export type TransactionType = "expense" | "income";

export type Category =
  | "Food"
  | "Transport"
  | "Shopping"
  | "Home"
  | "Health"
  | "Fun"
  | "Salary"
  | "Other";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: Category;
  note: string;
  date: string;
}

export interface FixedBill {
  id: string;
  name: string;
  amount: number;
}

export interface MoneyState {
  expectedIncome: number;
  savingsTarget: number;
  bills: FixedBill[];
  transactions: Transaction[];
}

export type View = "home" | "transactions" | "plan" | "reports";
