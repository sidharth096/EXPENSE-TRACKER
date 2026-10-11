"use client";

import { useEffect, useState } from "react";
import { FixedBill, MoneyState, Transaction } from "@/lib/types";
import { supabase } from "@/lib/supabase";

const emptyState: MoneyState = { expectedIncome: 0, savingsTarget: 0, bills: [], transactions: [] };
const toPaise = (amount: number) => Math.round(amount * 100);
const fromPaise = (amount: number) => amount / 100;

export function useMoneyTracker(userId: string) {
  const [state, setState] = useState<MoneyState>(emptyState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setState(emptyState);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    const load = async () => {
      const month = new Date().toISOString().slice(0, 7) + "-01";
      const { data: plan, error: planError } = await supabase.from("monthly_plans").select("id, expected_income_paise, savings_target_paise, fixed_bills(id, name, amount_paise)").eq("user_id", userId).eq("month", month).maybeSingle();
      const { data: transactions, error: transactionError } = await supabase.from("transactions").select("id, type, amount_paise, category, note, transaction_date").order("transaction_date", { ascending: false });

      if (planError || transactionError) {
        setError(planError?.message ?? transactionError?.message ?? "Could not load your data.");
      } else {
        setState({
          expectedIncome: fromPaise(plan?.expected_income_paise ?? 0),
          savingsTarget: fromPaise(plan?.savings_target_paise ?? 0),
          bills: (plan?.fixed_bills ?? []).map((bill) => ({ id: bill.id, name: bill.name, amount: fromPaise(bill.amount_paise) })),
          transactions: (transactions ?? []).map((item) => ({ id: item.id, type: item.type as Transaction["type"], amount: fromPaise(item.amount_paise), category: item.category as Transaction["category"], note: item.note, date: item.transaction_date })),
        });
      }
      setLoading(false);
    };
    void load();
  }, [userId]);

  const addTransaction = async (transaction: Omit<Transaction, "id">) => {
    const { data, error: insertError } = await supabase.from("transactions").insert({ user_id: userId, type: transaction.type, amount_paise: toPaise(transaction.amount), category: transaction.category, note: transaction.note, transaction_date: transaction.date }).select("id").single();
    if (insertError || !data) { setError(insertError?.message ?? "Could not save the transaction."); return; }
    setState((current) => ({ ...current, transactions: [{ ...transaction, id: data.id }, ...current.transactions] }));
  };

  const deleteTransaction = async (id: string) => {
    const { error: deleteError } = await supabase.from("transactions").delete().eq("id", id);
    if (deleteError) { setError(deleteError.message); return; }
    setState((current) => ({
      ...current,
      transactions: current.transactions.filter((item) => item.id !== id),
    }));
  };

  const updatePlan = async (expectedIncome: number, savingsTarget: number, bills: FixedBill[]) => {
    const month = new Date().toISOString().slice(0, 7) + "-01";
    const { data: plan, error: planError } = await supabase.from("monthly_plans").upsert({ user_id: userId, month, expected_income_paise: toPaise(expectedIncome), savings_target_paise: toPaise(savingsTarget) }, { onConflict: "user_id,month" }).select("id").single();
    if (planError || !plan) { setError(planError?.message ?? "Could not save the plan."); return; }
    const { error: clearError } = await supabase.from("fixed_bills").delete().eq("monthly_plan_id", plan.id);
    const { error: billError } = bills.length ? await supabase.from("fixed_bills").insert(bills.map((bill) => ({ user_id: userId, monthly_plan_id: plan.id, name: bill.name, amount_paise: toPaise(bill.amount) }))) : { error: null };
    if (clearError || billError) { setError(clearError?.message ?? billError?.message ?? "Could not save bills."); return; }
    const { data: savedBills } = await supabase.from("fixed_bills").select("id, name, amount_paise").eq("monthly_plan_id", plan.id);
    setState((current) => ({ ...current, expectedIncome, savingsTarget, bills: (savedBills ?? []).map((bill) => ({ id: bill.id, name: bill.name, amount: fromPaise(bill.amount_paise) })) }));
  };

  return { state, loading, error, addTransaction, deleteTransaction, updatePlan };
}
