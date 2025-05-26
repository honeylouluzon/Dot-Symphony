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
