import { useState, useCallback, useEffect } from "react";
import { BudgetState, CategoryName, loadData, saveData, getCurrentSalary, getTotals, SUBCATS } from "@/lib/budget";
import { initTheme } from "@/lib/theme";
import CategoryCard from "@/components/CategoryCard";
import BudgetProgress from "@/components/BudgetProgress";
import ExpenseTile from "@/components/ExpenseTile";
import AddExpenseSheet from "@/components/AddExpenseSheet";
import BottomNav, { TabName } from "@/components/BottomNav";
import FAB from "@/components/FAB";
import AnalyticsView from "@/components/AnalyticsView";
import SettingsView from "@/components/SettingsView";
import SplashScreen from "@/components/SplashScreen";
import { Wallet } from "lucide-react";

const Index = () => {
  const [state, setState] = useState<BudgetState>(loadData);
  const [selectedCategory, setSelectedCategory] = useState<CategoryName>("Needs");
  const [salaryInput, setSalaryInput] = useState("");
  const [tab, setTab] = useState<TabName>("dashboard");
  const [showAdd, setShowAdd] = useState(false);
  const [showSplash, setShowSplash] = useState(() => {
    // Only show splash if this is a fresh page load (not a hot reload)
    if (sessionStorage.getItem("splitit_loaded")) return false;
    sessionStorage.setItem("splitit_loaded", "1");
    return true;
  });

  useEffect(() => { initTheme(); }, []);

  const persist = useCallback((newState: BudgetState) => {
    setState(newState);
    saveData(newState);
  }, []);

  const salary = getCurrentSalary(state);
  const { targets, spent, remaining, percent, totalSavings } = getTotals(state);

  // Only count Needs and Wants as "spent" from the total balance.
  // Savings transactions (transfers/adds) are just moving money around, not losing it.
  const totalSpent = state.expenses
    .filter(e => e.cat !== "Savings")
    .reduce((s, e) => s + e.amount, 0);

  const netIncome = salary - totalSpent;

  const addSalary = () => {
    const val = parseFloat(salaryInput);
    if (!val || val <= 0) return;
    persist({
      ...state,
      salaries: [...state.salaries, { amount: val, date: new Date().toISOString().split("T")[0] }],
    });
    setSalaryInput("");
  };

  const addExpense = (amount: number, cat: CategoryName, subcat: string) => {
    persist({
      ...state,
      expenses: [
        ...state.expenses,
        { id: crypto.randomUUID(), amount, cat, subcat, date: new Date().toISOString().split("T")[0] },
      ],
    });
  };

  const deleteExpense = (id: string) => {
    persist({ ...state, expenses: state.expenses.filter((e) => e.id !== id) });
  };

  const filtered = state.expenses.filter((e) => e.cat === selectedCategory);
  const symbol = state.currency;

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <div className="min-h-screen bg-background safe-area-top">
      <div className="max-w-md mx-auto px-4 pt-6 pb-28 space-y-5">
        {tab === "dashboard" && (
          <>
            {/* Header */}
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Overview</p>
            </div>

            {/* Currency Selector */}
            <div className="flex items-center gap-2">
              {["USD", "EUR", "RON"].map((cur) => (
                <button
                  key={cur}
                  onClick={() => persist({ ...state, currency: cur })}
                  className={`px-3.5 py-1.5 rounded-2xl text-xs font-semibold transition-all ${
                    state.currency === cur
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cur}
                </button>
              ))}
            </div>

            {/* Salary Input */}
            <div className="glass-card p-5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Income</span>
                </div>
                {salary > 0 && (
                  <span className="text-lg font-bold text-foreground">
                    {netIncome.toLocaleString("en-US", { minimumFractionDigits: 2 })} {symbol}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder={salary > 0 ? "Update salary" : "Enter salary"}
                  value={salaryInput}
                  onChange={(e) => setSalaryInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addSalary()}
                  className="flex-1 bg-secondary text-foreground text-sm rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground"
                />
                <button
                  onClick={addSalary}
                  className="bg-primary text-primary-foreground px-5 py-3 rounded-2xl font-semibold text-sm hover:opacity-90 transition-opacity"
                >
                  {salary > 0 ? "Update" : "Set"}
                </button>
              </div>
            </div>

            {/* Category Cards */}
            <div className="flex gap-2">
              {(["Needs", "Wants", "Savings"] as CategoryName[]).map((cat) => (
                <CategoryCard
                  key={cat}
                  name={cat}
                  amount={cat === "Savings" ? (totalSavings ?? 0) : (remaining[cat] ?? 0)}
                  currency={state.currency}
                  isSelected={cat === selectedCategory}
                  onClick={() => setSelectedCategory(cat)}
                  isSaved={cat === "Savings"}
                />
              ))}
            </div>

            {/* Progress Section */}
            <div className="glass-card p-4 rounded-2xl">
              <BudgetProgress
                category={selectedCategory}
                percent={percent[selectedCategory] ?? 0}
                budget={targets[selectedCategory] ?? 0}
                currency={state.currency}
              />
            </div>

            {/* Expense List */}
            <div className="space-y-3">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
                {selectedCategory} Transactions
              </h2>
              {filtered.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No transactions yet. Tap + to add one.
                </p>
              ) : (
                <div className="space-y-2">
                  {[...filtered].reverse().map((e) => (
                    <ExpenseTile
                      key={e.id}
                      expense={e}
                      currency={state.currency}
                      onDelete={deleteExpense}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {tab === "analytics" && (
          <AnalyticsView state={state} currency={state.currency} />
        )}

        {tab === "settings" && (
          <SettingsView onReset={() => persist({ salaries: [], expenses: [], currency: state.currency })} />
        )}
      </div>

      {/* FAB - only on dashboard */}
      {tab === "dashboard" && <FAB onClick={() => setShowAdd(true)} />}

      {/* Bottom Navigation */}
      <BottomNav active={tab} onChange={setTab} />

      {/* Add Expense Sheet */}
      <AddExpenseSheet open={showAdd} onClose={() => setShowAdd(false)} onAdd={addExpense} />
    </div>
  );
};

export default Index;
