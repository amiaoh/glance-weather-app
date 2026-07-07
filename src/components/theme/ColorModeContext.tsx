import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { ColorModeContext, type ColorMode } from './colorMode.types';

const COLOR_MODE_KEY = 'glance-color-mode';

function getInitialColorMode(): ColorMode {
  try {
    const saved = localStorage.getItem(COLOR_MODE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    // ignore
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function ColorModeProvider({ children }: { children: ReactNode }) {
  const [colorMode, setColorMode] = useState<ColorMode>(getInitialColorMode);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', colorMode === 'dark');
    document.documentElement.classList.toggle('light', colorMode === 'light');
    localStorage.setItem(COLOR_MODE_KEY, colorMode);
  }, [colorMode]);

  const toggleColorMode = useCallback(() => {
    setColorMode((mode) => (mode === 'dark' ? 'light' : 'dark'));
  }, []);

  return (
    <ColorModeContext.Provider value={{ colorMode, toggleColorMode }}>
      {children}
    </ColorModeContext.Provider>
  );
}
