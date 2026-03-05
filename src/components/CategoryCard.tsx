import { Home, ShoppingBag, PiggyBank } from "lucide-react";
import { CategoryName } from "@/lib/budget";
import { hapticImpact } from "@/lib/haptics";

interface CategoryCardProps {
  name: CategoryName;
  amount: number;
  currency: string;
  isSelected: boolean;
  onClick: () => void;
  isSaved?: boolean;
}

const icons: Record<CategoryName, React.ReactNode> = {
  Needs: <Home className="w-5 h-5" />,
  Wants: <ShoppingBag className="w-5 h-5" />,
  Savings: <PiggyBank className="w-5 h-5" />,
};

const colorClasses: Record<CategoryName, string> = {
  Needs: "bg-needs/15 text-needs",
  Wants: "bg-wants/15 text-wants",
  Savings: "bg-savings/15 text-savings",
};

const selectedBorder: Record<CategoryName, string> = {
  Needs: "ring-2 ring-needs",
  Wants: "ring-2 ring-wants",
  Savings: "ring-2 ring-savings",
};

export default function CategoryCard({ name, amount, currency, isSelected, onClick, isSaved }: CategoryCardProps) {

  const handleClick = () => {
    hapticImpact();
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl glass-button transition-all duration-200 ${
        isSelected ? selectedBorder[name] : ""
      }`}
    >
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${colorClasses[name]}`}>
        {icons[name]}
      </div>
      <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
        {isSaved ? "Savings" : name}
      </span>
      <span className="text-sm font-bold text-foreground">
        {amount.toLocaleString("en-US", { minimumFractionDigits: 2 })} {currency}
      </span>
    </button>
  );
}
