import { CategoryName } from "@/lib/budget";

interface BudgetProgressProps {
  category: CategoryName;
  percent: number;
  budget: number;
  currency: string;
}

const barColors: Record<CategoryName, string> = {
  Needs: "--needs",
  Wants: "--wants",
  Savings: "--savings",
};

export default function BudgetProgress({ category, percent, budget, currency }: BudgetProgressProps) {
  const used = Math.min(percent * 100, 100);
  const symbol = currency;

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {category}
        </span>
        <span className="text-xs font-semibold text-foreground">{used.toFixed(0)}%</span>
      </div>
      <div className="w-full h-1.5 rounded-full glass-progress overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${used}%`,
            backgroundColor: `hsl(var(${barColors[category]}))`,
          }}
        />
      </div>
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground font-medium">Budget</span>
        <span className="font-bold text-foreground">
          {budget.toLocaleString("en-US", { minimumFractionDigits: 2 })} {symbol}
        </span>
      </div>
    </div>
  );
}
