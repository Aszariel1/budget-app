import { useMemo } from "react";
import { BudgetState, CategoryName, CATEGORY_RATIOS, getCurrentSalary, getTotals } from "@/lib/budget";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface AnalyticsViewProps {
  state: BudgetState;
  currency: string;
}

function getMonthlyData(state: BudgetState) {
  const months: Record<string, Record<string, number>> = {};

  for (const e of state.expenses) {
    const month = e.date.slice(0, 7); // YYYY-MM
    if (!months[month]) months[month] = { Needs: 0, Wants: 0, Savings: 0 };
    months[month][e.cat] += e.amount;
  }

  return Object.entries(months)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, cats]) => ({
      month: new Date(month + "-01").toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
      Needs: cats.Needs || 0,
      Wants: cats.Wants || 0,
      Savings: cats.Savings || 0,
    }));
}

export default function AnalyticsView({ state, currency }: AnalyticsViewProps) {
  const data = useMemo(() => getMonthlyData(state), [state]);
  const salary = getCurrentSalary(state);
  const { targets, spent, totalSavings } = getTotals(state);
  const symbol = currency;

  const catTotals = (["Needs", "Wants", "Savings"] as CategoryName[]).map((cat) => ({
    cat,
    displayTotal: cat === "Savings" ? totalSavings : spent[cat],
    budget: targets[cat],
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground font-medium">Monthly spending trends</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-2">
        {catTotals.map(({ cat, displayTotal, budget }) => (
          <div key={cat} className="glass-card rounded-2xl p-3 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">{cat}</p>
            <p className="text-sm font-bold text-foreground">
              {displayTotal.toLocaleString("en-US", { minimumFractionDigits: 0 })} {symbol}
            </p>
            <p className="text-[10px] text-muted-foreground">
              {cat === "Savings" ? "total pool" : `of ${budget.toLocaleString("en-US", { minimumFractionDigits: 0 })} ${symbol}`}
            </p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="glass-card rounded-2xl p-4">
        <h3 className="text-sm font-semibold text-foreground mb-4">Monthly Trends</h3>
        {data.length < 1 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Add expenses to see trends over time.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
              />
              <Line type="monotone" dataKey="Needs" stroke="hsl(var(--needs))" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="Wants" stroke="hsl(var(--wants))" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="Savings" stroke="hsl(var(--savings))" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Spending Breakdown */}
      <div className="glass-card rounded-2xl p-4 space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Spending Breakdown</h3>
        {catTotals.map(({ cat, displayTotal, budget }) => {
          // For savings, we don't really have a "limit" since transfers increase the pool
          // but we can show how much of the target 20% we have surpassed or filled.
          const pct = budget > 0 ? (displayTotal / budget) * 100 : 0;
          const colorVar = cat === "Needs" ? "--needs" : cat === "Wants" ? "--wants" : "--savings";
          return (
            <div key={cat} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-foreground">{cat}</span>
                <span className="text-xs text-muted-foreground">{pct.toFixed(0)}%</span>
              </div>
              <div className="h-1.5 rounded-full glass-progress overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: `hsl(var(${colorVar}))` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
