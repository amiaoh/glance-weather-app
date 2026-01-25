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
