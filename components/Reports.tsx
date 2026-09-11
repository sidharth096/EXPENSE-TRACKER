import { getCategoryTotals, getTotals, formatINR } from "@/lib/money";
import { MoneyState } from "@/lib/types";

const colors = ["#ec6a3a", "#3c7f71", "#d7a72c", "#5f7db8", "#bf6269", "#7e695e"];

export function Reports({ state }: { state: MoneyState }) {
  const totals = getTotals(state);
  const categories = Object.entries(getCategoryTotals(state.transactions)).sort((a, b) => b[1] - a[1]);
  const highest = Math.max(...categories.map(([, value]) => value), 1);

  return (
    <div className="page">
      <div className="page-heading"><div><span className="eyebrow">Patterns, not guilt</span><h1>Monthly report</h1><p>See which choices shaped your month.</p></div></div>
      <div className="report-stats">
        <div><span>Total spent</span><strong>{formatINR(totals.expenses)}</strong></div>
        <div><span>Still safe</span><strong>{formatINR(totals.safeToSpend)}</strong></div>
        <div><span>Savings protected</span><strong>{formatINR(state.savingsTarget)}</strong></div>
      </div>
      <section className="panel report-panel">
        <div className="panel-heading"><div><span className="eyebrow">By category</span><h2>Your spending fingerprint</h2></div></div>
        <div className="bar-chart">
          {categories.map(([name, amount], index) => (
            <div className="bar-row" key={name}>
              <span>{name}</span><div><i style={{ width: `${(amount / highest) * 100}%`, background: colors[index % colors.length] }} /></div><strong>{formatINR(amount)}</strong>
            </div>
          ))}
          {!categories.length && <div className="empty-state">Your category report will appear after you log an expense.</div>}
        </div>
      </section>
    </div>
  );
}
