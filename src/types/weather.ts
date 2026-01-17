export interface HourlyForecast {
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

export interface WeatherData {
  hourly: HourlyForecast[];
  lastUpdated: Date;
  city: string;
}

export interface UVDataPoint {
  time: string;
  uvIndex: number;
}

export interface LocationState {
  coordinates: { lat: number; lng: number } | null;
  city: string;
  arpansaCity: string;
  timezone: string;
  source: 'gps' | 'manual';
  isLoading: boolean;
  error: string | null;
}
