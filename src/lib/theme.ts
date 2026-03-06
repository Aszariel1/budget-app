export type Theme = "light" | "dark" | "slate";

const THEMES: Theme[] = ["light", "dark", "slate"];

export function getTheme(): Theme {
  try {
    const stored = localStorage.getItem("budget_theme");
    if (stored && THEMES.includes(stored as Theme)) return stored as Theme;
  } catch {}
  return "dark"; // Default theme
}

export function setTheme(theme: Theme) {
  localStorage.setItem("budget_theme", theme);

  // Remove all possible theme classes
  for (const t of THEMES) {
    document.documentElement.classList.remove(t);
  }

  // Add the active theme class
  document.documentElement.classList.add(theme);
}

// Initialize on load
export function initTheme() {
  setTheme(getTheme());
}
