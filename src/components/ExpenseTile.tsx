import { Expense, CategoryName } from "@/lib/budget";
import {
  Home, ShoppingBag, PiggyBank, Zap, ShoppingCart, Bus,
  Wine, Tv, Shirt, CreditCard, Trash2, ArrowRightLeft,
  Dumbbell, Utensils, Heart, Star, Tag, Gift, Car, Coffee,
  Gamepad, Scissors, Briefcase
} from "lucide-react";

interface ExpenseTileProps {
  expense: Expense;
  currency: string;
  onDelete: (id: string) => void;
}

// Extended map for better variety and "Smart Matching"
const subcatIcons: Record<string, React.ReactNode> = {
  Rent: <Home className="w-4 h-4" />,
  Utilities: <Zap className="w-4 h-4" />,
  Groceries: <ShoppingCart className="w-4 h-4" />,
  Transport: <Bus className="w-4 h-4" />,
  Drinks: <Wine className="w-4 h-4" />,
  Entertainment: <Tv className="w-4 h-4" />,
  Clothes: <Shirt className="w-4 h-4" />,
  Subscriptions: <CreditCard className="w-4 h-4" />,
  "Manual Add": <PiggyBank className="w-4 h-4" />,
  "Transfer from Needs": <ArrowRightLeft className="w-4 h-4" />,
  "Transfer from Wants": <ArrowRightLeft className="w-4 h-4" />,
  // Common keywords for custom entries
  Gym: <Dumbbell className="w-4 h-4" />,
  Fitness: <Dumbbell className="w-4 h-4" />,
  Food: <Utensils className="w-4 h-4" />,
  Restaurant: <Utensils className="w-4 h-4" />,
  Health: <Heart className="w-4 h-4" />,
  Gift: <Gift className="w-4 h-4" />,
  Car: <Car className="w-4 h-4" />,
  Coffee: <Coffee className="w-4 h-4" />,
  Game: <Gamepad className="w-4 h-4" />,
  Work: <Briefcase className="w-4 h-4" />,
};

const getIcon = (name: string) => {
  // 1. Direct match
  if (subcatIcons[name]) return subcatIcons[name];

  // 2. Keyword match (case insensitive)
  const lower = name.toLowerCase();
  for (const key of Object.keys(subcatIcons)) {
    if (lower.includes(key.toLowerCase())) return subcatIcons[key];
  }

  // 3. Fallback
  return <Tag className="w-4 h-4" />;
};

const catColors: Record<CategoryName, string> = {
  Needs: "bg-needs/15 text-needs",
  Wants: "bg-wants/15 text-wants",
  Savings: "bg-savings/15 text-savings",
};

export default function ExpenseTile({ expense, currency, onDelete }: ExpenseTileProps) {
  const symbol = currency;
  const icon = getIcon(expense.subcat);
  const isGain = expense.cat === "Savings";

  return (
    <div className="flex items-center gap-3 p-3 rounded-2xl glass-card group">
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${catColors[expense.cat]}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">{expense.subcat}</p>
        <p className="text-[11px] text-muted-foreground">{expense.date}</p>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className={`text-sm font-bold shrink-0 ${isGain ? "text-success" : "text-destructive"}`}>
          {isGain ? "+" : "-"}{expense.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })} {symbol}
        </span>
        <button
          onClick={() => onDelete(expense.id)}
          className="text-muted-foreground hover:text-destructive active:text-destructive transition-colors p-1"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
