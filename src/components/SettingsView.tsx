import { Moon, Sun, Palette, RotateCcw, Wallet, Gem, ChevronRight, ChevronDown } from "lucide-react";
import { Theme, getTheme, setTheme } from "@/lib/theme";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SettingsViewProps {
  onReset?: () => void;
  salary: number;
  salaryInput: string;
  onSalaryInputChange: (val: string) => void;
  onAddSalary: () => void;
  currency: string;
}

export default function SettingsView({
  onReset,
  salary,
  salaryInput,
  onSalaryInputChange,
  onAddSalary,
  currency
}: SettingsViewProps) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(getTheme);
  const [showConfirm, setShowConfirm] = useState(false);
  const [themeExpanded, setThemeExpanded] = useState(false);

  const toggleTheme = (theme: Theme) => {
    setTheme(theme);
    setCurrentTheme(theme);
  };

  const handleReset = () => {
    onReset?.();
    setShowConfirm(false);
  };

  const themes = [
    { id: "light" as Theme, name: "Soft Clay", icon: <Sun className="w-4 h-4 text-warning" /> },
    { id: "dark" as Theme, name: "Nero Dark", icon: <Moon className="w-4 h-4 text-primary" /> },
    { id: "slate" as Theme, name: "Deep Slate", icon: <Gem className="w-4 h-4 text-slate-400" /> },
  ];

  const activeTheme = themes.find(t => t.id === currentTheme) || themes[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground tracking-tight">Settings</h1>
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mt-1">Configuration</p>
      </div>

      {/* Salary Section - Elegant Minimalist */}
      <div className="glass-card p-5 rounded-3xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Wallet className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold text-foreground">Monthly Income</span>
        </div>

        <div className="flex gap-2">
          <input
            type="number"
            placeholder="0.00"
            value={salaryInput}
            onChange={(e) => onSalaryInputChange(e.target.value)}
            className="flex-1 bg-secondary/50 text-foreground text-sm rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={onAddSalary}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-bold text-sm hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20"
          >
            Update
          </button>
        </div>
      </div>

      {/* Theme Selection - Elegant Expandable Accordion */}
      <div className="glass-card rounded-3xl overflow-hidden">
        <button
          onClick={() => setThemeExpanded(!themeExpanded)}
          className="w-full flex items-center justify-between p-5 active:bg-secondary/20 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Palette className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-foreground">Appearance</p>
              <p className="text-[10px] text-muted-foreground uppercase font-semibold">{activeTheme.name}</p>
            </div>
          </div>
          {themeExpanded ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
        </button>

        <AnimatePresence>
          {themeExpanded && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              className="px-5 pb-5 space-y-2"
            >
              <div className="h-px bg-border/50 mb-4" />
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => toggleTheme(t.id)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl transition-all ${
                    currentTheme === t.id
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/10"
                      : "bg-secondary/40 text-foreground hover:bg-secondary/60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {t.icon}
                    <span className="text-xs font-bold">{t.name}</span>
                  </div>
                  {currentTheme === t.id && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Reset Data - Refined */}
      <div className="glass-card rounded-3xl p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-destructive/10 flex items-center justify-center text-destructive">
            <RotateCcw className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold text-foreground">Data Management</span>
        </div>
        {!showConfirm ? (
          <button
            onClick={() => setShowConfirm(true)}
            className="w-full py-3.5 rounded-2xl text-xs font-bold text-destructive/60 hover:text-destructive active:bg-destructive/5 transition-all"
          >
            Reset all transactions
          </button>
        ) : (
          <div className="flex gap-2 animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowConfirm(false)}
              className="flex-1 py-3 rounded-2xl text-xs font-bold bg-secondary text-muted-foreground"
            >
              Cancel
            </button>
            <button
              onClick={handleReset}
              className="flex-1 py-3 rounded-2xl text-xs font-bold bg-destructive text-destructive-foreground shadow-lg shadow-destructive/20"
            >
              Confirm
            </button>
          </div>
        )}
      </div>

      <div className="px-5 opacity-40">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">SplitIt</p>
        <p className="text-[9px] font-medium text-muted-foreground mt-1">Version 1.0.0 • Private Edition</p>
      </div>
    </div>
  );
}
