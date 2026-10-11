"use client";

import { useEffect, useState } from "react";
import { Brand, Navigation } from "./Navigation";
import { View } from "@/lib/types";
import { Dashboard } from "./Dashboard";
import { TransactionList } from "./TransactionList";
import { MonthlyPlan } from "./MonthlyPlan";
import { Reports } from "./Reports";
import { TransactionForm } from "./TransactionForm";
import { useMoneyTracker } from "@/hooks/useMoneyTracker";
import { Plus } from "lucide-react";
import { AuthForm } from "./AuthForm";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export function AppShell() {
  const [view, setView] = useState<View>("home");
  const [formOpen, setFormOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setAuthLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    return () => listener.subscription.unsubscribe();
  }, []);

  const tracker = useMoneyTracker(user?.id ?? "");

  if (!isSupabaseConfigured) return <main className="auth-page"><section className="auth-card"><span className="eyebrow">Setup required</span><h1>Connect Supabase.</h1><p>Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local`, then restart the dev server.</p></section></main>;
  if (authLoading) return <main className="auth-page"><p>Loading your secure tracker...</p></main>;
  if (!user) return <AuthForm />;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Brand />
        <Navigation view={view} onChange={setView} />
        <div className="sidebar-note">
          <span>This month&apos;s habit</span>
          <strong>Log it while it&apos;s fresh.</strong>
          <p>Small entries make the month clear.</p>
          <button className="text-button" type="button" onClick={() => void supabase.auth.signOut()}>Sign out</button>
        </div>
      </aside>

      <header className="mobile-header">
        <Brand />
        <span className="mobile-month">This month</span>
      </header>

      <main className="main-content">
        {tracker.loading && <p>Loading your money data...</p>}
        {tracker.error && <p className="auth-message" role="alert">{tracker.error}</p>}
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
