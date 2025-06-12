// ThemeManager utility for toggling light/dark themes
export function setTheme(theme) {
  const light = document.getElementById('light-theme');
  const dark = document.getElementById('dark-theme');
  if (theme === 'dark') {
    light.disabled = true;
    dark.disabled = false;
  } else {
    light.disabled = false;
    dark.disabled = true;
  }
  localStorage.setItem('theme', theme);
}

export function getTheme() {
  return localStorage.getItem('theme') || 'auto';
}

export function getPreferredTheme() {
  const stored = localStorage.getItem('theme');
  if (stored) return stored;
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
  return 'light';
}

export function toggleTheme() {
  const current = getTheme();
  const next = current === 'dark' ? 'light' : 'dark';
  setTheme(next);
}
