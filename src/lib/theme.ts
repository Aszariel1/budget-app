export type Theme = "light" | "dark";

export function getTheme(): Theme {
  try {
    const stored = localStorage.getItem("budget_theme");
    if (stored === "light" || stored === "dark") return stored;
  } catch {}
  return "dark";
}

export function setTheme(theme: Theme) {
  localStorage.setItem("budget_theme", theme);
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

// Initialize on load
export function initTheme() {
  setTheme(getTheme());
}
