"use client";

import { useState } from "react";
import { Brand, Navigation } from "./Navigation";
import { View } from "@/lib/types";
import { Dashboard } from "./Dashboard";
import { TransactionList } from "./TransactionList";
import { MonthlyPlan } from "./MonthlyPlan";
import { Reports } from "./Reports";
import { TransactionForm } from "./TransactionForm";
import { useMoneyTracker } from "@/hooks/useMoneyTracker";
import { Plus } from "lucide-react";

export function AppShell() {
  const [view, setView] = useState<View>("home");
  const [formOpen, setFormOpen] = useState(false);
  const tracker = useMoneyTracker();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Brand />
        <Navigation view={view} onChange={setView} />
        <div className="sidebar-note">
          <span>This month&apos;s habit</span>
          <strong>Log it while it&apos;s fresh.</strong>
          <p>Small entries make the month clear.</p>
        </div>
      </aside>

      <header className="mobile-header">
        <Brand />
        <span className="mobile-month">This month</span>
      </header>

      <main className="main-content">
        {view === "home" && <Dashboard state={tracker.state} onAdd={() => setFormOpen(true)} onNavigate={setView} />}
        {view === "transactions" && <TransactionList transactions={tracker.state.transactions} onAdd={() => setFormOpen(true)} onDelete={tracker.deleteTransaction} />}
        {view === "plan" && <MonthlyPlan state={tracker.state} onSave={tracker.updatePlan} />}
        {view === "reports" && <Reports state={tracker.state} />}
      </main>

      <button className="mobile-add" onClick={() => setFormOpen(true)} aria-label="Add transaction">
        <Plus size={25} />
      </button>
      <div className="bottom-nav"><Navigation view={view} onChange={setView} /></div>

      {formOpen && <TransactionForm onClose={() => setFormOpen(false)} onSubmit={tracker.addTransaction} />}
    </div>
  );
}
