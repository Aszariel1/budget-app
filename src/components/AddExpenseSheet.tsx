import { useState, useEffect } from "react";
import { CategoryName, getAllSubcats, BudgetState } from "@/lib/budget";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { hapticImpact, hapticSuccess } from "@/lib/haptics";
import { Plus } from "lucide-react";

interface AddExpenseSheetProps {
  open: boolean;
  onClose: () => void;
  onAdd: (amount: number, cat: CategoryName, subcat: string) => void;
  state: BudgetState;
  onAddCustomSubcat: (cat: CategoryName, subcat: string) => void;
}

export default function AddExpenseSheet({ open, onClose, onAdd, state, onAddCustomSubcat }: AddExpenseSheetProps) {
  const [amount, setAmount] = useState("");
  const [cat, setCat] = useState<CategoryName>("Needs");
  const allSubcats = getAllSubcats(state);
  const [subcat, setSubcat] = useState(allSubcats["Needs"][0]);
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customSubcatName, setCustomSubcatName] = useState("");

  // Update subcat when category changes
  useEffect(() => {
    setSubcat(allSubcats[cat][0]);
    setIsAddingCustom(false);
  }, [cat]);

  const handleCatChange = (newCat: CategoryName) => {
    hapticImpact();
    setCat(newCat);
  };

  const handleSubmit = () => {
    const val = parseFloat(amount);
    if (!val || val <= 0) return;

    let finalSubcat = subcat;

    if (isAddingCustom && customSubcatName.trim()) {
      finalSubcat = customSubcatName.trim();
      onAddCustomSubcat(cat, finalSubcat);
    }

    hapticSuccess();
    onAdd(val, cat, finalSubcat);
    setAmount("");
    setCustomSubcatName("");
    setIsAddingCustom(false);
    onClose();
  };

  const catColors: Record<CategoryName, string> = {
    Needs: "bg-needs text-primary-foreground shadow-lg shadow-needs/20",
    Wants: "bg-wants text-primary-foreground shadow-lg shadow-wants/20",
    Savings: "bg-savings text-primary-foreground shadow-lg shadow-savings/20",
  };

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="bottom" className="rounded-t-3xl bg-background pb-10" style={{ boxShadow: '0 -8px 24px 0 var(--neu-shadow-dark)' }}>
        <SheetHeader>
          <SheetTitle className="text-foreground text-lg font-bold">New Transaction</SheetTitle>
        </SheetHeader>
        <div className="space-y-5 pt-4">
          {/* Category pills */}
          <div className="flex gap-2">
            {(Object.keys(allSubcats) as CategoryName[]).map((c) => (
              <button
                key={c}
                onClick={() => handleCatChange(c)}
                className={`flex-1 py-2.5 rounded-2xl text-sm font-semibold transition-all active:scale-95 ${
                  cat === c ? catColors[c] : "bg-secondary text-muted-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Subcategory Selection */}
          <div className="space-y-3">
            {!isAddingCustom ? (
              <div className="flex gap-2">
                <select
                  value={subcat}
                  onChange={(e) => {
                    hapticImpact();
                    setSubcat(e.target.value);
                  }}
                  className="flex-1 bg-secondary text-foreground text-sm rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary appearance-none active:scale-[0.99] transition-transform"
                >
                  {allSubcats[cat].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    hapticImpact();
                    setIsAddingCustom(true);
                  }}
                  className="w-12 h-12 bg-secondary text-muted-foreground flex items-center justify-center rounded-2xl active:scale-90 transition-transform"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  autoFocus
                  type="text"
                  placeholder="Custom name..."
                  value={customSubcatName}
                  onChange={(e) => setCustomSubcatName(e.target.value)}
                  className="flex-1 bg-secondary text-foreground text-sm rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  onClick={() => {
                    hapticImpact();
                    setIsAddingCustom(false);
                  }}
                  className="px-4 bg-secondary text-muted-foreground text-xs font-semibold rounded-2xl active:scale-90 transition-transform"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Amount */}
          <input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            className="w-full bg-secondary text-foreground text-3xl font-bold text-center rounded-2xl px-4 py-4 outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground/40"
          />

          {/* Submit */}
          <button
            onClick={handleSubmit}
            className="w-full bg-primary text-primary-foreground py-3.5 rounded-2xl font-semibold text-base hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
          >
            Add Transaction
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
