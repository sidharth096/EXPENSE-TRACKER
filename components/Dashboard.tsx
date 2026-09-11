import { ArrowRight, CalendarDays, ChevronRight, Landmark, Plus, ReceiptText, ShieldCheck, Target } from "lucide-react";
import { formatINR, getCategoryTotals, getTotals } from "@/lib/money";
import { MoneyState, View } from "@/lib/types";

const categoryColors: Record<string, string> = {
  Food: "#ec6a3a", Transport: "#3c7f71", Shopping: "#d7a72c", Home: "#7e695e", Health: "#5f7db8", Fun: "#bf6269", Other: "#969185",
};

interface DashboardProps {
  state: MoneyState;
  onAdd: () => void;
  onNavigate: (view: View) => void;
}

export function Dashboard({ state, onAdd, onNavigate }: DashboardProps) {
  const totals = getTotals(state);
  const categories = Object.entries(getCategoryTotals(state.transactions)).sort((a, b) => b[1] - a[1]);
  const spentPercent = totals.availableAfterPlan > 0 ? Math.min(100, Math.round((totals.expenses / totals.availableAfterPlan) * 100)) : 100;
  const month = new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric" }).format(new Date());
  const daysRemaining = getDaysRemaining();
  const dailyAllowance = Math.max(0, totals.safeToSpend / daysRemaining);
  const assignedPercent = totals.income > 0 ? Math.round(((totals.bills + state.savingsTarget) / totals.income) * 100) : 0;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning." : hour < 17 ? "Good afternoon." : "Good evening.";

  return (
    <div className="page dashboard-page">
      <div className="page-heading">
        <div><span className="eyebrow">Your money, made visible</span><h1>{greeting}</h1><p>Here&apos;s the honest picture for {month}.</p></div>
        <button className="primary-button desktop-action" onClick={onAdd}><Plus size={18} /> Add transaction</button>
      </div>

      <section className={totals.safeToSpend < 0 ? "hero-card danger" : "hero-card"}>
        <div className="pixel-field" aria-hidden="true">
          <i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i />
        </div>
        <div className="hero-copy">
          <span className="hero-label">Safe to spend</span>
          <strong>{formatINR(totals.safeToSpend)}</strong>
          <p>{totals.safeToSpend >= 0 ? "After bills, your savings goal, and every expense logged so far." : "You've spent beyond this month's planned amount. Review recent entries."}</p>
          {totals.safeToSpend >= 0 && <div className="daily-guide"><span>That&apos;s about</span><strong>{formatINR(dailyAllowance)} / day</strong><small>for the next {daysRemaining} {daysRemaining === 1 ? "day" : "days"}</small></div>}
        </div>
        <div className="hero-meter">
          <div className="meter-head"><span>{formatINR(totals.expenses)} spent</span><span>{spentPercent}% of flexible money</span></div>
          <div className="meter-track" role="progressbar" aria-label="Flexible money spent" aria-valuemin={0} aria-valuemax={100} aria-valuenow={spentPercent}><span style={{ width: `${spentPercent}%` }} /></div>
          <div className="hero-breakdown">
            <div><Landmark size={17} /><span>Income<strong>{formatINR(totals.income)}</strong></span></div>
            <div><ReceiptText size={17} /><span>Bills<strong>{formatINR(totals.bills)}</strong></span></div>
            <div><Target size={17} /><span>Savings<strong>{formatINR(state.savingsTarget)}</strong></span></div>
          </div>
        </div>
      </section>

      <div className="dashboard-grid">
        <section className="panel spending-panel">
          <div className="panel-heading"><div><span className="eyebrow">Spending map</span><h2>Where it went</h2></div><button className="text-button" onClick={() => onNavigate("reports")}>Full report <ArrowRight size={15} /></button></div>
          {categories.length ? (
            <div className="category-layout">
              <div className="donut" style={{ background: makeGradient(categories, totals.expenses) }}><div><span>Spent</span><strong>{formatINR(totals.expenses, true)}</strong></div></div>
              <div className="category-list">
                {categories.slice(0, 4).map(([name, amount]) => (
                  <div className="category-row" key={name}><span className="color-dot" style={{ background: categoryColors[name] }} /><span>{name}</span><strong>{formatINR(amount)}</strong><small>{Math.round((amount / totals.expenses) * 100)}%</small></div>
                ))}
              </div>
            </div>
          ) : <div className="empty-state">Log your first expense to see where your money goes.</div>}
        </section>

        <section className="panel plan-panel">
          <div className="panel-heading"><div><span className="eyebrow">Monthly plan</span><h2>Money with a job</h2></div><button className="icon-button" onClick={() => onNavigate("plan")} aria-label="Edit monthly plan"><ChevronRight size={20} /></button></div>
          <div className="plan-visual">
            <div className="plan-number"><span>{assignedPercent}%</span><small>assigned before spending</small></div>
            <div className="plan-allocation" aria-label={`${formatINR(totals.bills)} for bills and ${formatINR(state.savingsTarget)} for savings`}>
              <span className="bills-allocation" style={{ width: `${totals.income > 0 ? Math.min(100, (totals.bills / totals.income) * 100) : 0}%` }} />
              <span className="savings-allocation" style={{ width: `${totals.income > 0 ? Math.min(100, (state.savingsTarget / totals.income) * 100) : 0}%` }} />
            </div>
            <div className="allocation-key"><span><i className="bills-key" />Bills</span><span><i className="savings-key" />Savings</span></div>
          </div>
          <div className="plan-note"><ShieldCheck size={19} /><p><strong>{formatINR(state.savingsTarget)} protected</strong>Your savings target stays outside safe-to-spend.</p></div>
        </section>
      </div>

      <section className="panel recent-panel">
        <div className="panel-heading"><div><span className="eyebrow">Latest entries</span><h2>Recent transactions</h2></div><button className="text-button" onClick={() => onNavigate("transactions")}>View all <ArrowRight size={15} /></button></div>
        <div className="recent-list">
          {state.transactions.slice(0, 4).map((item) => (
            <div className="recent-row" key={item.id}>
              <span className="transaction-icon" style={{ background: `${categoryColors[item.category] ?? categoryColors.Other}18`, color: categoryColors[item.category] ?? categoryColors.Other }}>{item.note.charAt(0).toUpperCase()}</span>
              <span className="transaction-main"><strong>{item.note}</strong><small>{item.category} · {new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" }).format(new Date(`${item.date}T12:00:00`))}</small></span>
              <strong className={item.type === "expense" ? "money-out" : "money-in"}>{item.type === "expense" ? "−" : "+"}{formatINR(item.amount)}</strong>
            </div>
          ))}
        </div>
      </section>
      <div className="month-stamp"><CalendarDays size={14} /> Tracking {month}</div>
    </div>
  );
}

function getDaysRemaining() {
  const today = new Date();
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  return Math.max(1, lastDay - today.getDate() + 1);
}

function makeGradient(categories: [string, number][], total: number) {
  let start = 0;
  const sections = categories.map(([name, amount]) => {
    const end = start + (amount / total) * 100;
    const section = `${categoryColors[name] ?? categoryColors.Other} ${start}% ${end}%`;
    start = end;
    return section;
  });
  return `conic-gradient(${sections.join(", ")})`;
}
