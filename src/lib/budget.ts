export interface Expense {
  id: string;
  amount: number;
  cat: "Needs" | "Wants" | "Savings";
  subcat: string;
  date: string;
}

export interface BudgetState {
  salaries: { amount: number; date: string }[];
  expenses: Expense[];
  currency: string;
  customSubcats?: Record<string, string[]>;
}

export const DEFAULT_SUBCATS: Record<string, string[]> = {
  Needs: ["Rent", "Utilities", "Groceries", "Transport"],
  Wants: ["Drinks", "Entertainment", "Clothes", "Subscriptions"],
  Savings: ["Manual Add", "Transfer from Needs", "Transfer from Wants"],
};

export const CATEGORY_RATIOS: Record<string, number> = {
  Needs: 0.5,
  Wants: 0.3,
  Savings: 0.2,
};

export type CategoryName = "Needs" | "Wants" | "Savings";

export function loadData(): BudgetState {
  try {
    const raw = localStorage.getItem("budget_data");
    if (raw) {
      const data = JSON.parse(raw);
      return {
        salaries: data.salaries ?? [],
        expenses: data.expenses ?? [],
        currency: data.currency ?? "USD",
        customSubcats: data.customSubcats ?? { Needs: [], Wants: [], Savings: [] },
      };
    }
  } catch {}
  return {
    salaries: [],
    expenses: [],
    currency: "USD",
    customSubcats: { Needs: [], Wants: [], Savings: [] }
  };
}

export function saveData(state: BudgetState) {
  localStorage.setItem("budget_data", JSON.stringify(state));
}

export function getAllSubcats(state: BudgetState): Record<string, string[]> {
  const merged: Record<string, string[]> = {};
  for (const cat of Object.keys(DEFAULT_SUBCATS)) {
    merged[cat] = [...DEFAULT_SUBCATS[cat], ...(state.customSubcats?.[cat] ?? [])];
  }
  return merged;
}

export function getCurrentSalary(state: BudgetState): number {
  return state.salaries.reduce((sum, s) => sum + s.amount, 0);
}

export function getTotals(state: BudgetState) {
  const salary = getCurrentSalary(state);
  const targets: Record<string, number> = {};
  const actualSpent: Record<string, number> = {};
  const spent: Record<string, number> = {};
  const remaining: Record<string, number> = {};
  const percent: Record<string, number> = {};

  // Initialize
  for (const cat of Object.keys(CATEGORY_RATIOS)) {
    targets[cat] = salary * CATEGORY_RATIOS[cat];
    actualSpent[cat] = state.expenses
      .filter((e) => e.cat === cat)
      .reduce((s, e) => s + e.amount, 0);
  }

  // Handle transfers logic
  for (const e of state.expenses) {
    if (e.cat === "Savings" && e.subcat === "Transfer from Needs") {
      actualSpent["Needs"] += e.amount;
    } else if (e.cat === "Savings" && e.subcat === "Transfer from Wants") {
      actualSpent["Wants"] += e.amount;
    }
  }

  // --- MINIMALIST OVERFLOW LOGIC ---
  // If Needs > target, the overflow is taken from Wants.
  const needsOverflow = Math.max(0, actualSpent["Needs"] - targets["Needs"]);

  // Needs display spent is capped at target (stays at 100%)
  spent["Needs"] = actualSpent["Needs"];
  // Wants display spent includes its own spending + any needs overflow
  spent["Wants"] = actualSpent["Wants"] + needsOverflow;
  // Savings remains its own logic
  spent["Savings"] = actualSpent["Savings"];

  for (const cat of Object.keys(CATEGORY_RATIOS)) {
    remaining[cat] = Math.max(targets[cat] - spent[cat], 0);
    percent[cat] = targets[cat] > 0 ? Math.min(1, spent[cat] / targets[cat]) : 0;
  }

  const totalSavings = targets["Savings"] + actualSpent["Savings"];

  return { targets, spent, remaining, percent, totalSavings, needsOverflow };
}
