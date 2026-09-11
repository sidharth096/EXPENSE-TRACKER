"use client";

import { FormEvent, useEffect, useState } from "react";
import { X } from "lucide-react";
import { Category, Transaction } from "@/lib/types";

const expenseCategories: Category[] = ["Food", "Transport", "Shopping", "Home", "Health", "Fun", "Other"];

interface TransactionFormProps {
  onClose: () => void;
  onSubmit: (transaction: Omit<Transaction, "id">) => void;
}

export function TransactionForm({ onClose, onSubmit }: TransactionFormProps) {
  const [type, setType] = useState<"expense" | "income">("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<Category>("Food");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", closeOnEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0 || !note.trim()) return;
    onSubmit({ type, amount: parsedAmount, category: type === "income" ? "Other" : category, note: note.trim(), date });
    onClose();
  };

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section className="transaction-modal" role="dialog" aria-modal="true" aria-labelledby="transaction-title" onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-head">
          <div><span className="eyebrow">New entry</span><h2 id="transaction-title">Where did it go?</h2></div>
          <button className="icon-button" onClick={onClose} aria-label="Close"><X size={20} /></button>
        </div>
        <form onSubmit={submit}>
          <div className="segmented">
            <button type="button" className={type === "expense" ? "selected" : ""} onClick={() => setType("expense")}>Expense</button>
            <button type="button" className={type === "income" ? "selected" : ""} onClick={() => setType("income")}>Income</button>
          </div>
          <label className="amount-input"><span>₹</span><input autoFocus inputMode="decimal" type="number" min="1" step="1" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0" required /></label>
          <div className="form-grid">
            <label><span>What was it?</span><input value={note} onChange={(event) => setNote(event.target.value)} placeholder="Groceries, fuel, coffee..." required /></label>
            <label><span>Date</span><input type="date" value={date} onChange={(event) => setDate(event.target.value)} required /></label>
          </div>
          {type === "expense" && (
            <fieldset className="category-picker">
              <legend>Category</legend>
              {expenseCategories.map((item) => <button type="button" key={item} className={category === item ? "selected" : ""} onClick={() => setCategory(item)}>{item}</button>)}
            </fieldset>
          )}
          <button className="primary-button full" type="submit">Add {type}</button>
        </form>
      </section>
    </div>
  );
}
