import { useState } from "react";
import { SUBCATS, CategoryName } from "@/lib/budget";
import { Plus } from "lucide-react";

interface AddExpenseFormProps {
  onAdd: (amount: number, cat: CategoryName, subcat: string) => void;
}

export default function AddExpenseForm({ onAdd }: AddExpenseFormProps) {
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
  };

  return (
    <div className="space-y-3 p-4 rounded-2xl bg-card border border-border">
      <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Add Expense</h3>
      <div className="grid grid-cols-2 gap-2">
        <select
          value={cat}
          onChange={(e) => handleCatChange(e.target.value as CategoryName)}
          className="bg-secondary text-foreground text-sm rounded-xl px-3 py-2.5 border-none outline-none focus:ring-2 focus:ring-primary"
        >
          {Object.keys(SUBCATS).map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={subcat}
          onChange={(e) => setSubcat(e.target.value)}
          className="bg-secondary text-foreground text-sm rounded-xl px-3 py-2.5 border-none outline-none focus:ring-2 focus:ring-primary"
        >
          {SUBCATS[cat].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <div className="flex gap-2">
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          className="flex-1 bg-secondary text-foreground text-sm rounded-xl px-3 py-2.5 border-none outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground"
        />
        <button
          onClick={handleSubmit}
          className="bg-primary text-primary-foreground px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-1.5 hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>
    </div>
  );
}
