import { useState } from "react";
import { SUBCATS, CategoryName } from "@/lib/budget";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface AddExpenseSheetProps {
  open: boolean;
  onClose: () => void;
  onAdd: (amount: number, cat: CategoryName, subcat: string) => void;
}

export default function AddExpenseSheet({ open, onClose, onAdd }: AddExpenseSheetProps) {
  const [amount, setAmount] = useState("");
  const [cat, setCat] = useState<CategoryName>("Needs");
  const [subcat, setSubcat] = useState(SUBCATS["Needs"][0]);

  const handleCatChange = (newCat: CategoryName) => {
    setCat(newCat);
    setSubcat(SUBCATS[newCat][0]);
  };

  const handleSubmit = () => {
    const val = parseFloat(amount);
    if (!val || val <= 0) return;
    onAdd(val, cat, subcat);
    setAmount("");
    onClose();
  };

  const catColors: Record<CategoryName, string> = {
    Needs: "bg-needs text-primary-foreground",
    Wants: "bg-wants text-primary-foreground",
    Savings: "bg-savings text-primary-foreground",
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
            {(Object.keys(SUBCATS) as CategoryName[]).map((c) => (
              <button
                key={c}
                onClick={() => handleCatChange(c)}
                className={`flex-1 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
                  cat === c ? catColors[c] : "bg-secondary text-muted-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Subcategory */}
          <select
            value={subcat}
            onChange={(e) => setSubcat(e.target.value)}
            className="w-full bg-secondary text-foreground text-sm rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary appearance-none"
          >
            {SUBCATS[cat].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

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
            className="w-full bg-primary text-primary-foreground py-3.5 rounded-2xl font-semibold text-base hover:opacity-90 transition-opacity"
          >
            Add Transaction
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
