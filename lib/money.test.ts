import { describe, expect, it } from "vitest";
import { getCategoryTotals, getTotals } from "./money";
import { MoneyState } from "./types";

const state: MoneyState = {
  expectedIncome: 50000,
  savingsTarget: 10000,
  bills: [{ id: "1", name: "Rent", amount: 12000 }],
  transactions: [
    { id: "1", type: "expense", amount: 3000, category: "Food", note: "Food", date: "2026-09-01" },
    { id: "2", type: "income", amount: 2000, category: "Other", note: "Refund", date: "2026-09-02" },
  ],
};

describe("money calculations", () => {
  it("calculates safe-to-spend after the plan and expenses", () => {
    expect(getTotals(state).safeToSpend).toBe(27000);
  });

  it("groups expenses without counting income", () => {
    expect(getCategoryTotals(state.transactions)).toEqual({ Food: 3000 });
  });
});
