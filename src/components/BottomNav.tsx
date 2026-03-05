import { LayoutDashboard, BarChart3, Settings } from "lucide-react";

export type TabName = "dashboard" | "analytics" | "settings";

interface BottomNavProps {
  active: TabName;
  onChange: (tab: TabName) => void;
}

const tabs: { id: TabName; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-background safe-area-bottom" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)', boxShadow: '0 -4px 14px 0 var(--neu-shadow-dark), 0 -2px 6px 0 var(--neu-shadow-light)' }}>
      <div className="max-w-md mx-auto flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 1.8} />
              <span className="text-[10px] font-semibold tracking-wide">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
