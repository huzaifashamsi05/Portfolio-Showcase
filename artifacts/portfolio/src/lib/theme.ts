export function getTheme(): "dark" | "light" {
  const saved = localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") return saved;
  return "dark";
}

export function setTheme(theme: "dark" | "light"): void {
  localStorage.setItem("theme", theme);
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

export function initTheme(): void {
  const theme = getTheme();
  setTheme(theme);
}
