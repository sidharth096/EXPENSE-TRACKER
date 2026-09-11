"use client";

import { useDeferredValue, useState } from "react";
import { Plus, Search, Trash2 } from "lucide-react";
import { formatINR } from "@/lib/money";
import { Transaction } from "@/lib/types";

export function TransactionList({ transactions, onAdd, onDelete }: { transactions: Transaction[]; onAdd: () => void; onDelete: (id: string) => void }) {
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search.toLowerCase());
  const filtered = transactions.filter((item) => `${item.note} ${item.category}`.toLowerCase().includes(deferredSearch));

  return (
    <div className="page">
      <div className="page-heading"><div><span className="eyebrow">Every rupee accounted for</span><h1>Transactions</h1><p>Search and review your entries for this month.</p></div><button className="primary-button desktop-action" onClick={onAdd}><Plus size={18} /> Add transaction</button></div>
      <section className="panel transaction-page-panel">
        <label className="search-box"><Search size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search notes or categories" /></label>
        <div className="transaction-table">
          {filtered.map((item) => (
            <div className="table-row" key={item.id}>
              <span className="date-block"><strong>{new Date(`${item.date}T12:00:00`).getDate()}</strong><small>{new Intl.DateTimeFormat("en-IN", { month: "short" }).format(new Date(`${item.date}T12:00:00`))}</small></span>
              <span className="transaction-main"><strong>{item.note}</strong><small>{item.category}</small></span>
              <strong className={item.type === "expense" ? "money-out" : "money-in"}>{item.type === "expense" ? "−" : "+"}{formatINR(item.amount)}</strong>
              <button className="delete-button" onClick={() => { if (window.confirm(`Delete ${item.note}?`)) onDelete(item.id); }} aria-label={`Delete ${item.note}`}><Trash2 size={17} /></button>
            </div>
          ))}
          {!filtered.length && <div className="empty-state">No transactions match your search.</div>}
        </div>
      </section>
    </div>
  );
}
