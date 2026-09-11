import { MoneyState, Transaction } from "./types";

export const formatINR = (amount: number, compact = false) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
    notation: compact ? "compact" : "standard",
  }).format(amount);

export const getTotals = (state: MoneyState) => {
  const transactionIncome = state.transactions
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + item.amount, 0);
  const expenses = state.transactions
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + item.amount, 0);
  const bills = state.bills.reduce((sum, bill) => sum + bill.amount, 0);
  const income = state.expectedIncome + transactionIncome;

  return {
    income,
    expenses,
    bills,
    safeToSpend: income - bills - state.savingsTarget - expenses,
    availableAfterPlan: income - bills - state.savingsTarget,
  };
};

export const getCategoryTotals = (transactions: Transaction[]) =>
  transactions
    .filter((item) => item.type === "expense")
    .reduce<Record<string, number>>((totals, item) => {
      totals[item.category] = (totals[item.category] ?? 0) + item.amount;
      return totals;
    }, {});
