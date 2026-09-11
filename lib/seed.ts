import { MoneyState } from "./types";

const currentDate = new Date();
const dateThisMonth = (day: number) => {
  const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), Math.min(day, currentDate.getDate()));
  return date.toISOString().slice(0, 10);
};

export const seedState: MoneyState = {
  expectedIncome: 65000,
  savingsTarget: 15000,
  bills: [
    { id: "bill-rent", name: "House rent", amount: 12500 },
    { id: "bill-phone", name: "Phone & internet", amount: 1499 },
    { id: "bill-subscriptions", name: "Subscriptions", amount: 799 },
  ],
  transactions: [
    { id: "tx-1", type: "expense", amount: 2340, category: "Food", note: "Groceries", date: dateThisMonth(3) },
    { id: "tx-2", type: "expense", amount: 1260, category: "Transport", note: "Fuel", date: dateThisMonth(5) },
    { id: "tx-3", type: "expense", amount: 1899, category: "Shopping", note: "Running shoes", date: dateThisMonth(7) },
    { id: "tx-4", type: "expense", amount: 780, category: "Food", note: "Dinner with friends", date: dateThisMonth(8) },
    { id: "tx-5", type: "expense", amount: 620, category: "Health", note: "Pharmacy", date: dateThisMonth(9) },
  ],
};
