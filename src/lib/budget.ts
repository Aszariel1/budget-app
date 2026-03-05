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
}

export const SUBCATS: Record<string, string[]> = {
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
      };
    }
  } catch {}
  return { salaries: [], expenses: [], currency: "USD" };
}

export function saveData(state: BudgetState) {
  localStorage.setItem("budget_data", JSON.stringify(state));
}

export function getCurrentSalary(state: BudgetState): number {
  return state.salaries.reduce((sum, s) => sum + s.amount, 0);
}

export function getTotals(state: BudgetState) {
  const salary = getCurrentSalary(state);
  const targets: Record<string, number> = {};
  const spent: Record<string, number> = {};
  const remaining: Record<string, number> = {};
  const percent: Record<string, number> = {};

  for (const cat of Object.keys(CATEGORY_RATIOS)) {
    targets[cat] = salary * CATEGORY_RATIOS[cat];
    // "Spent" here means how much of that category's budget has been used
    spent[cat] = state.expenses
      .filter((e) => e.cat === cat)
      .reduce((s, e) => s + e.amount, 0);
  }

  // Transfers from Needs/Wants to Savings should also count as "spent" in source categories
  for (const e of state.expenses) {
    if (e.cat === "Savings" && e.subcat === "Transfer from Needs") {
      spent["Needs"] += e.amount;
    } else if (e.cat === "Savings" && e.subcat === "Transfer from Wants") {
      spent["Wants"] += e.amount;
    }
  }

  for (const cat of Object.keys(CATEGORY_RATIOS)) {
    remaining[cat] = Math.max(targets[cat] - spent[cat], 0);
    percent[cat] = targets[cat] > 0 ? spent[cat] / targets[cat] : 0;
  }

  // Calculate the "Total Savings Pool"
  // It's the 20% target + any manual additions/transfers made TO savings
  const totalSavings = targets["Savings"] + spent["Savings"];

  return { targets, spent, remaining, percent, totalSavings };
}
