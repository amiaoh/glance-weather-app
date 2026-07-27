export type { ColdAlert, GearLevel, GearRecommendation, GearSeverity, GearStat, HourlyForecast, RainAlert, RainLevel, SeverityTier, UVAlert, WarningThresholds, WeatherData, WindAlert, WindLevel };

 interface HourlyForecast {
  time: Date;
  hour: number;
  temperature: number;
  weatherCode: number;
  windSpeed: number;
  precipitationProbability: number;
  precipitation: number;
  uvIndex: number | null;
  isDay: boolean;
}

 interface WeatherData {
  hourly: HourlyForecast[];
  lastUpdated: Date;
  city: string;
}

type WindLevel = "moderate" | "strong";
type RainLevel = "light" | "moderate" | "heavy";

interface UVAlert {
  currentValue: number;
  peakValue: number;
  peakTime: Date;
  peakIsNow: boolean;
}

interface ColdAlert {
  tempValue: number;
  alertTime: Date;
}

interface WarningThresholds {
  coldBelowC: number;
  rainModerateFromMm: number;
  rainHeavyFromMm: number;
  windModerateFromKmh: number;
  windStrongFromKmh: number;
}

interface RainAlert {
  totalMm: number;
  alertTime: Date;
  precipitationProbability: number;
  weatherCode: number;
  isDay: boolean;
  level: RainLevel;
}

interface WindAlert {
  alertTime: Date;
  maxSpeed: number;
  maxSpeedTime: Date;
  level: WindLevel;
  windyThroughout: boolean;
}

type GearLevel = "none" | "sun" | "umbrella" | "waterproof-gear" | "jacket" | "windbreaker";

// Badge color tier for a gear card. Only "moderate" and "extreme" are used
// by wind/rain today; UV uses the full range (its alert only fires at
// UV >= 3, so "mild" never applies to UV).
type SeverityTier = "mild" | "moderate" | "high" | "veryHigh" | "extreme";

interface GearSeverity {
  tier: SeverityTier;
  label: string;
  // Set when the badge should render with the ARPANSA UV Index palette and
  // show the numeric value instead of a word label.
  scale?: 'uv';
}

interface GearStat {
  label: string;
  value: string;
}

interface GearRecommendation {
  level: GearLevel;
  label: string;
  detail: string;
  severity?: GearSeverity;
  stats?: GearStat[];
}

