import { BarChart3, House, List, NotebookTabs, WalletCards } from "lucide-react";
import { View } from "@/lib/types";

const items: { id: View; label: string; icon: typeof House }[] = [
  { id: "home", label: "Overview", icon: House },
  { id: "transactions", label: "Transactions", icon: List },
  { id: "plan", label: "Monthly plan", icon: NotebookTabs },
  { id: "reports", label: "Reports", icon: BarChart3 },
];

interface NavigationProps {
  view: View;
  onChange: (view: View) => void;
}

export function Brand() {
  return (
    <div className="brand">
      <span className="brand-mark"><WalletCards size={22} /></span>
      <span>Khata</span>
    </div>
  );
}

export function Navigation({ view, onChange }: NavigationProps) {
  return (
    <nav className="navigation" aria-label="Main navigation">
      {items.map(({ id, label, icon: Icon }) => (
        <button className={view === id ? "nav-item active" : "nav-item"} key={id} onClick={() => onChange(id)}>
          <Icon size={19} strokeWidth={1.8} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
