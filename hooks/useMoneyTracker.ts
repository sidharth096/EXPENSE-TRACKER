"use client";

import { useEffect, useState } from "react";
import { seedState } from "@/lib/seed";
import { FixedBill, MoneyState, Transaction } from "@/lib/types";

const STORAGE_KEY = "khata-money-state-v1";

export function useMoneyTracker() {
  const [state, setState] = useState<MoneyState>(seedState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) setState(JSON.parse(saved) as MoneyState);
    } catch {
      // Invalid browser data falls back to a usable sample month.
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (ready) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [ready, state]);

  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    setState((current) => ({
      ...current,
      transactions: [{ ...transaction, id: crypto.randomUUID() }, ...current.transactions],
    }));
  };

  const deleteTransaction = (id: string) => {
    setState((current) => ({
      ...current,
      transactions: current.transactions.filter((item) => item.id !== id),
    }));
  };

  const updatePlan = (expectedIncome: number, savingsTarget: number, bills: FixedBill[]) => {
    setState((current) => ({ ...current, expectedIncome, savingsTarget, bills }));
  };

  const resetData = () => setState(seedState);

  return { state, addTransaction, deleteTransaction, updatePlan, resetData };
}
