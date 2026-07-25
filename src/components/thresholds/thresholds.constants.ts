import type { WarningThresholds } from '../../types/weather';

const DEFAULT_THRESHOLDS: WarningThresholds = {
  coldBelowC: 20,
  rainModerateFromMm: 2.5,
  rainHeavyFromMm: 10,
  windModerateFromKmh: 20,
  windStrongFromKmh: 40,
};

export { DEFAULT_THRESHOLDS };
