export type { GearLevel, GearRecommendation, HourlyForecast, RainAlert, RainLevel, UVAlert, WeatherData, WindAlert, WindLevel };

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

interface GearRecommendation {
  level: GearLevel;
  label: string;
  detail: string;
}

