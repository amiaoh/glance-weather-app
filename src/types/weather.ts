export type { GearLevel, GearRecommendation, GearSeverity, GearStat, HourlyForecast, RainAlert, RainLevel, SeverityTier, UVAlert, WeatherData, WindAlert, WindLevel };

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
  uvValue: number;
  alertTime: Date;
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
  speed: number;
  alertTime: Date;
  level: WindLevel;
}

type GearLevel = "none" | "sun" | "umbrella" | "wet-weather-gear" | "jacket" | "windbreaker";

// Badge color tier for a gear card. Only "moderate" and "extreme" are used
// by wind/rain today; UV uses the full range (its alert only fires at
// UV >= 3, so "mild" never applies to UV).
type SeverityTier = "mild" | "moderate" | "high" | "veryHigh" | "extreme";

interface GearSeverity {
  tier: SeverityTier;
  label: string;
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

