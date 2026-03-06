import { Expense, CategoryName } from "@/lib/budget";
import {
  Home, ShoppingBag, PiggyBank, Zap, ShoppingCart, Bus,
  Wine, Tv, Shirt, CreditCard, Trash2, ArrowRightLeft,
  Dumbbell, Utensils, Heart, Star, Tag, Gift, Car, Coffee,
  Gamepad, Scissors, Briefcase
} from "lucide-react";
import { motion, useMotionValue, useTransform, useAnimation, PanInfo } from "framer-motion";
import { hapticImpact } from "@/lib/haptics";
import { ImpactStyle } from "@capacitor/haptics";

interface ExpenseTileProps {
  expense: Expense;
  currency: string;
  onDelete: (id: string) => void;
}

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
  Gym: <Dumbbell className="w-4 h-4" />,
  Fitness: <Dumbbell className="w-4 h-4" />,
  Food: <Utensils className="w-4 h-4" />,
  Restaurant: <Utensils className="w-4 h-4" />,
  Pizza: <Utensils className="w-4 h-4" />,
  Health: <Heart className="w-4 h-4" />,
  Gift: <Gift className="w-4 h-4" />,
  Car: <Car className="w-4 h-4" />,
  Coffee: <Coffee className="w-4 h-4" />,
  Game: <Gamepad className="w-4 h-4" />,
  Work: <Briefcase className="w-4 h-4" />,
};

const getIcon = (name: string) => {
  if (subcatIcons[name]) return subcatIcons[name];
  const lower = name.toLowerCase();
  for (const key of Object.keys(subcatIcons)) {
    if (lower.includes(key.toLowerCase())) return subcatIcons[key];
  }
  return <Tag className="w-4 h-4" />;
};

const catColors: Record<CategoryName, string> = {
  Needs: "bg-needs/15 text-needs",
  Wants: "bg-wants/15 text-wants",
  Savings: "bg-savings/15 text-savings",
};

export default function ExpenseTile({ expense, currency, onDelete }: ExpenseTileProps) {
  const x = useMotionValue(0);
  const controls = useAnimation();

  const bgOpacity = useTransform(x, [-100, -20], [1, 0]);
  const iconScale = useTransform(x, [-100, -40], [1, 0.5]);

  const onPanEnd = async (_: any, info: PanInfo) => {
    if (info.offset.x < -100) {
      hapticImpact(ImpactStyle.Medium);
      await controls.start({ x: -500, opacity: 0, transition: { duration: 0.2 } });
      onDelete(expense.id);
    } else {
      controls.start({ x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } });
    }
  };

  const icon = getIcon(expense.subcat);
  const isGain = expense.cat === "Savings";

  return (
    <div className="relative py-1">
      <motion.div
        style={{ opacity: bgOpacity }}
        className="absolute inset-x-0 inset-y-1 bg-destructive rounded-2xl flex items-center justify-end px-6 text-white"
      >
        <motion.div style={{ scale: iconScale }}>
          <Trash2 className="w-5 h-5" />
        </motion.div>
      </motion.div>

      <motion.div
        drag="x"
        dragConstraints={{ left: -120, right: 0 }}
        dragElastic={0.05}
        onDragStart={() => hapticImpact(ImpactStyle.Light)}
        onPanEnd={onPanEnd}
        animate={controls}
        style={{ x }}
        className="flex items-center gap-3 p-3.5 bg-background glass-card relative z-10 touch-pan-y"
      >
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${catColors[expense.cat]}`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-foreground truncate tracking-tight">{expense.subcat}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-black shrink-0 ${isGain ? "text-success" : "text-foreground"}`}>
            {isGain ? "+" : "-"}{expense.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })} <span className="text-[10px] font-medium text-muted-foreground uppercase">{currency}</span>
          </span>
        </div>
      </motion.div>
    </div>
  );
}
