export interface WeatherCodeInfo {
  description: string;
  iconDay: string;
  iconNight: string;
}

export const WMO_CODES: Record<number, WeatherCodeInfo> = {
  0: { description: 'Clear sky', iconDay: 'clear-day', iconNight: 'clear-night' },
  1: { description: 'Mainly clear', iconDay: 'partly-cloudy-day', iconNight: 'partly-cloudy-night' },
  2: { description: 'Partly cloudy', iconDay: 'partly-cloudy-day', iconNight: 'partly-cloudy-night' },
  3: { description: 'Overcast', iconDay: 'cloudy', iconNight: 'cloudy' },
  45: { description: 'Foggy', iconDay: 'fog', iconNight: 'fog' },
  48: { description: 'Rime fog', iconDay: 'fog', iconNight: 'fog' },
  51: { description: 'Light drizzle', iconDay: 'drizzle', iconNight: 'drizzle' },
  53: { description: 'Drizzle', iconDay: 'drizzle', iconNight: 'drizzle' },
  55: { description: 'Heavy drizzle', iconDay: 'drizzle', iconNight: 'drizzle' },
  56: { description: 'Freezing drizzle', iconDay: 'drizzle', iconNight: 'drizzle' },
  57: { description: 'Heavy freezing drizzle', iconDay: 'drizzle', iconNight: 'drizzle' },
  61: { description: 'Light rain', iconDay: 'rain-light', iconNight: 'rain-light' },
  63: { description: 'Rain', iconDay: 'rain', iconNight: 'rain' },
  65: { description: 'Heavy rain', iconDay: 'rain-heavy', iconNight: 'rain-heavy' },
  66: { description: 'Freezing rain', iconDay: 'rain', iconNight: 'rain' },
  67: { description: 'Heavy freezing rain', iconDay: 'rain-heavy', iconNight: 'rain-heavy' },
  71: { description: 'Light snow', iconDay: 'snow-light', iconNight: 'snow-light' },
  73: { description: 'Snow', iconDay: 'snow', iconNight: 'snow' },
  75: { description: 'Heavy snow', iconDay: 'snow-heavy', iconNight: 'snow-heavy' },
  77: { description: 'Snow grains', iconDay: 'snow', iconNight: 'snow' },
  80: { description: 'Light showers', iconDay: 'showers-day', iconNight: 'showers-night' },
  81: { description: 'Showers', iconDay: 'showers-day', iconNight: 'showers-night' },
  82: { description: 'Heavy showers', iconDay: 'showers-day', iconNight: 'showers-night' },
  85: { description: 'Light snow showers', iconDay: 'snow-light', iconNight: 'snow-light' },
  86: { description: 'Snow showers', iconDay: 'snow', iconNight: 'snow' },
  95: { description: 'Thunderstorm', iconDay: 'thunderstorm', iconNight: 'thunderstorm' },
  96: { description: 'Thunderstorm with hail', iconDay: 'thunderstorm', iconNight: 'thunderstorm' },
  99: { description: 'Thunderstorm with heavy hail', iconDay: 'thunderstorm', iconNight: 'thunderstorm' },
};

export function getWeatherInfo(code: number, isDay: boolean): WeatherCodeInfo & { icon: string } {
  const info = WMO_CODES[code] || { description: 'Unknown', iconDay: 'unknown', iconNight: 'unknown' };
  return {
    ...info,
    icon: isDay ? info.iconDay : info.iconNight,
  };
}

export function isNightHour(hour: number): boolean {
  return hour < 6 || hour >= 20;
}
