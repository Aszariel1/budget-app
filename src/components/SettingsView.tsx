import { Moon, Sun, Palette, RotateCcw } from "lucide-react";
import { Theme, getTheme, setTheme } from "@/lib/theme";
import { useState } from "react";

interface SettingsViewProps {
  onReset?: () => void;
}

export default function SettingsView({ onReset }: SettingsViewProps) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(getTheme);
  const [showConfirm, setShowConfirm] = useState(false);

  const toggleTheme = (theme: Theme) => {
    setTheme(theme);
    setCurrentTheme(theme);
  };

  const handleReset = () => {
    onReset?.();
    setShowConfirm(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground font-medium">Customize your experience</p>
      </div>

      {/* Appearance */}
      <div className="glass-card rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-3">
          <Palette className="w-5 h-5 text-primary" />
          <span className="text-sm font-semibold text-foreground">Appearance</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => toggleTheme("light")}
            className={`flex flex-col items-center gap-3 p-4 rounded-2xl transition-all ${
              currentTheme === "light"
                ? "ring-2 ring-primary bg-primary/10"
                : "bg-secondary hover:bg-secondary/80"
            }`}
          >
            <Sun className="w-6 h-6 text-warning" />
            <span className="text-sm font-semibold text-foreground">Light</span>
          </button>
          <button
            onClick={() => toggleTheme("dark")}
            className={`flex flex-col items-center gap-3 p-4 rounded-2xl transition-all ${
              currentTheme === "dark"
                ? "ring-2 ring-primary bg-primary/10"
                : "bg-secondary hover:bg-secondary/80"
            }`}
          >
            <Moon className="w-6 h-6 text-wants" />
            <span className="text-sm font-semibold text-foreground">Dark</span>
          </button>
        </div>
      </div>

      {/* Reset Data */}
      <div className="glass-card rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-3">
          <RotateCcw className="w-5 h-5 text-destructive" />
          <span className="text-sm font-semibold text-foreground">Reset Data</span>
        </div>
        <p className="text-xs text-muted-foreground">
          This will reset all salaries and transactions to zero. This action cannot be undone.
        </p>
        {!showConfirm ? (
          <button
            onClick={() => setShowConfirm(true)}
            className="w-full py-3 rounded-2xl text-sm font-semibold bg-destructive/15 text-destructive hover:bg-destructive/25 transition-colors"
          >
            Reset All Data
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => setShowConfirm(false)}
              className="flex-1 py-3 rounded-2xl text-sm font-semibold bg-secondary text-muted-foreground"
            >
              Cancel
            </button>
            <button
              onClick={handleReset}
              className="flex-1 py-3 rounded-2xl text-sm font-semibold bg-destructive text-destructive-foreground"
            >
              Confirm Reset
            </button>
          </div>
        )}
      </div>

      {/* App info */}
      <div className="glass-card rounded-2xl p-5 space-y-2">
        <p className="text-sm font-semibold text-foreground">SplitIt</p>
        <p className="text-xs text-muted-foreground">Version 1.0.0</p>
        <p className="text-xs text-muted-foreground">
          Plan your budget wisely using the 50/30/20 rule.
        </p>
      </div>
    </div>
  );
}
