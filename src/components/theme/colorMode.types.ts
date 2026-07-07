import { createContext } from 'react';

type ColorMode = 'light' | 'dark';

interface ColorModeContextValue {
  colorMode: ColorMode;
  toggleColorMode: () => void;
}

const ColorModeContext = createContext<ColorModeContextValue | null>(null);

export { ColorModeContext, type ColorMode, type ColorModeContextValue };
