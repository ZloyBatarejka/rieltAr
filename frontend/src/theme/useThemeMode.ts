import { useState, useEffect } from 'react';

type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'rieltar-theme';

export function useThemeMode() {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;

    // Определяем по системным настройкам
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  const toggleMode = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return { mode, toggleMode, isDark: mode === 'dark' };
}

