import { useState, useCallback, useEffect } from "react";
import { BudgetState, CategoryName, loadData, saveData, getCurrentSalary, getTotals } from "@/lib/budget";
import { initTheme } from "@/lib/theme";
import CategoryCard from "@/components/CategoryCard";
import BudgetProgress from "@/components/BudgetProgress";
import ExpenseTile from "@/components/ExpenseTile";
import AddExpenseSheet from "@/components/AddExpenseSheet";
import BottomNav, { TabName } from "@/components/BottomNav";
import FAB from "@/components/FAB";
import AnalyticsView from "@/components/AnalyticsView";
import SettingsView from "@/components/SettingsView";
import { Wallet } from "lucide-react";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { format, isToday, isYesterday } from "date-fns";

const Index = () => {
  const [state, setState] = useState<BudgetState>(loadData);
  const [selectedCategory, setSelectedCategory] = useState<CategoryName>("Needs");
  const [salaryInput, setSalaryInput] = useState("");
  const [tab, setTab] = useState<TabName>("dashboard");
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => { initTheme(); }, []);

  const persist = useCallback((newState: BudgetState) => {
    setState(newState);
    saveData(newState);
  }, []);

  const salary = getCurrentSalary(state);
  const { targets, spent, remaining, percent, totalSavings } = getTotals(state);

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

  const addCustomSubcat = (cat: CategoryName, subcat: string) => {
    const currentCustom = state.customSubcats || { Needs: [], Wants: [], Savings: [] };
    if (currentCustom[cat].includes(subcat)) return;

    persist({
      ...state,
      customSubcats: {
        ...currentCustom,
        [cat]: [...currentCustom[cat], subcat]
      }
    });
  };

  const deleteExpense = (id: string) => {
    const expenseToDelete = state.expenses.find(e => e.id === id);
    if (!expenseToDelete) return;

    const newState = { ...state, expenses: state.expenses.filter((e) => e.id !== id) };
    persist(newState);

    toast("Transaction deleted", {
      action: {
        label: "Undo",
        onClick: () => {
          setState(prev => {
            const restored = { ...prev, expenses: [...prev.expenses, expenseToDelete] };
            saveData(restored);
            return restored;
          });
        },
      },
    });
  };

  const filtered = state.expenses.filter((e) => e.cat === selectedCategory);
  const symbol = state.currency;

  const groupedExpenses = [...filtered].reverse().reduce((acc: Record<string, any[]>, e) => {
    const date = e.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(e);
    return acc;
  }, {});

  const formatDateHeader = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMMM d, yyyy");
  };

  return (
    <div className="h-screen bg-background overflow-hidden flex flex-col safe-area-top">
      <div className={`px-4 pt-6 space-y-5 flex-shrink-0 ${tab !== "dashboard" ? "pb-2" : ""}`}>
        {tab === "dashboard" && (
          <>
            <div className="glass-card p-5 rounded-3xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest flex items-center gap-1.5">
                    <Wallet className="w-3 h-3 text-primary" />
                    Amount Available
                  </p>
                  <h2 className="text-3xl font-black text-foreground tracking-tight">
                    {netIncome.toLocaleString("en-US", { minimumFractionDigits: 0 })}
                    <span className="ml-1.5 text-sm font-medium text-muted-foreground uppercase">{symbol}</span>
                  </h2>
                </div>

                <div className="flex flex-col gap-1 p-1 bg-secondary/30 rounded-2xl">
                  {["USD", "EUR", "RON"].map((cur) => (
                    <button
                      key={cur}
                      onClick={() => persist({ ...state, currency: cur })}
                      className={`px-3 py-1.5 rounded-xl text-[9px] font-black transition-all ${
                        state.currency === cur
                          ? "bg-primary text-primary-foreground shadow-lg"
                          : "text-muted-foreground/60 hover:text-foreground"
                      }`}
                    >
                      {cur}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2.5">
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

            <div className="glass-card p-5 rounded-2xl">
              <BudgetProgress
                category={selectedCategory}
                percent={percent[selectedCategory] ?? 0}
                budget={targets[selectedCategory] ?? 0}
                currency={state.currency}
              />
            </div>
          </>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-32">
        <div className="max-w-md mx-auto py-5">
          {tab === "dashboard" && (
            <div className="space-y-6">
              <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">
                {selectedCategory} History
              </h2>

              {filtered.length === 0 ? (
                <div className="glass-card rounded-2xl py-12 text-center">
                  <p className="text-sm text-muted-foreground">
                    No transactions yet. Tap <span className="text-primary font-bold">+</span> to add one.
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  {Object.entries(groupedExpenses).map(([date, items]) => (
                    <div key={date} className="space-y-3">
                      <h3 className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em] px-1">
                        {formatDateHeader(date)}
                      </h3>
                      <div className="space-y-2">
                        <AnimatePresence initial={false}>
                          {items.map((e) => (
                            <motion.div
                              key={e.id}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ duration: 0.2 }}
                              className="relative"
                            >
                              <ExpenseTile
                                expense={e}
                                currency={state.currency}
                                onDelete={deleteExpense}
                              />
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "analytics" && (
            <AnalyticsView state={state} currency={state.currency} />
          )}

          {tab === "settings" && (
            <SettingsView
              salary={salary}
              salaryInput={salaryInput}
              onSalaryInputChange={setSalaryInput}
              onAddSalary={addSalary}
              currency={state.currency}
              onReset={() => persist({ salaries: [], expenses: [], currency: state.currency, customSubcats: { Needs: [], Wants: [], Savings: [] } })}
            />
          )}
        </div>
      </div>

      {tab === "dashboard" && <FAB onClick={() => setShowAdd(true)} />}
      <BottomNav active={tab} onChange={setTab} />
      <AddExpenseSheet
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onAdd={addExpense}
        state={state}
        onAddCustomSubcat={addCustomSubcat}
      />
    </div>
  );
};

export default Index;
