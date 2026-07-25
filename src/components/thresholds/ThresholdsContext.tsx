import { useCallback, useEffect, useState, type ReactNode } from 'react';
import type { WarningThresholds } from '../../types/weather';
import { DEFAULT_THRESHOLDS } from './thresholds.constants';
import { ThresholdsContext } from './thresholds.types';

const THRESHOLDS_KEY = 'glance-warning-thresholds';

function getSavedThresholds(): WarningThresholds {
  try {
    const saved = localStorage.getItem(THRESHOLDS_KEY);
    if (saved) return { ...DEFAULT_THRESHOLDS, ...JSON.parse(saved) };
  } catch {
    // ignore
  }
  return DEFAULT_THRESHOLDS;
}

export function ThresholdsProvider({ children }: { children: ReactNode }) {
  const [thresholds, setThresholds] = useState<WarningThresholds>(getSavedThresholds);

  useEffect(() => {
    localStorage.setItem(THRESHOLDS_KEY, JSON.stringify(thresholds));
  }, [thresholds]);

  const setThreshold = useCallback((key: keyof WarningThresholds, value: number) => {
    setThresholds((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetThresholds = useCallback(() => {
    setThresholds(DEFAULT_THRESHOLDS);
  }, []);

  return (
    <ThresholdsContext.Provider value={{ thresholds, setThreshold, resetThresholds }}>
      {children}
    </ThresholdsContext.Provider>
  );
}
