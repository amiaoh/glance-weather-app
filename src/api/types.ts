export interface OpenMeteoResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  hourly: {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
    wind_speed_10m: number[];
    precipitation_probability: number[];
    precipitation: number[];
  };
}

export interface UVApiResponse {
  city: string;
  date: string;
  data: Array<{
    time: string;
    uvIndex: number;
  }>;
  error?: string;
}
