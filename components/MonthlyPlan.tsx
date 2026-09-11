"use client";

import { FormEvent, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { FixedBill, MoneyState } from "@/lib/types";
import { formatINR } from "@/lib/money";

export function MonthlyPlan({ state, onSave }: { state: MoneyState; onSave: (income: number, savings: number, bills: FixedBill[]) => void }) {
  const [income, setIncome] = useState(String(state.expectedIncome));
  const [savings, setSavings] = useState(String(state.savingsTarget));
  const [bills, setBills] = useState<FixedBill[]>(state.bills);
  const billTotal = bills.reduce((sum, bill) => sum + Number(bill.amount), 0);

  const save = (event: FormEvent) => {
    event.preventDefault();
    onSave(Number(income), Number(savings), bills.filter((bill) => bill.name.trim() && Number(bill.amount) > 0));
  };

  return (
    <div className="page">
      <div className="page-heading"><div><span className="eyebrow">Decide before you spend</span><h1>Monthly plan</h1><p>Give your salary a job before the month gets busy.</p></div></div>
      <form className="plan-form" onSubmit={save}>
        <section className="panel plan-basics">
          <div className="panel-heading"><div><span className="eyebrow">Step 01</span><h2>Set your guardrails</h2></div></div>
          <div className="form-grid">
            <label><span>Expected salary</span><div className="prefixed-input"><i>₹</i><input type="number" min="0" value={income} onChange={(event) => setIncome(event.target.value)} /></div></label>
            <label><span>Savings target</span><div className="prefixed-input"><i>₹</i><input type="number" min="0" value={savings} onChange={(event) => setSavings(event.target.value)} /></div></label>
          </div>
          <div className="plan-preview"><span>Available after your plan</span><strong>{formatINR(Number(income || 0) - Number(savings || 0) - billTotal)}</strong></div>
        </section>
        <section className="panel bills-panel">
          <div className="panel-heading"><div><span className="eyebrow">Step 02</span><h2>Fixed monthly bills</h2></div><button type="button" className="text-button" onClick={() => setBills([...bills, { id: crypto.randomUUID(), name: "", amount: 0 }])}><Plus size={16} /> Add bill</button></div>
          <div className="bill-list">
            {bills.map((bill, index) => (
              <div className="bill-row" key={bill.id}>
                <input aria-label="Bill name" value={bill.name} placeholder="Bill name" onChange={(event) => setBills(bills.map((item, itemIndex) => itemIndex === index ? { ...item, name: event.target.value } : item))} />
                <div className="prefixed-input"><i>₹</i><input aria-label={`${bill.name || "Bill"} amount`} type="number" min="0" value={bill.amount} onChange={(event) => setBills(bills.map((item, itemIndex) => itemIndex === index ? { ...item, amount: Number(event.target.value) } : item))} /></div>
                <button type="button" className="delete-button" aria-label={`Remove ${bill.name || "bill"}`} onClick={() => setBills(bills.filter((_, itemIndex) => itemIndex !== index))}><Trash2 size={17} /></button>
              </div>
            ))}
          </div>
          <button className="primary-button" type="submit">Save monthly plan</button>
        </section>
      </form>
    </div>
  );
}
