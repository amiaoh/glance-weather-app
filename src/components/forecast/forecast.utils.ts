import { GearRecommendation, HourlyForecast, RainAlert, RainLevel, UVAlert, WindAlert, WindLevel } from '../../types/weather';

import { formatHour } from './formatters';

function getWindLevel(speed: number): WindLevel | "light" {
  if (speed >= 40) return "strong";
  if (speed >= 20) return "moderate";
  return "light";
}

function getRainLevel(totalMm: number): RainLevel {
  if (totalMm >= 10) return "heavy";
  if (totalMm >= 2.5) return "moderate";
  return "light";
}

function getNextFourHours(hourly: HourlyForecast[]): HourlyForecast[] {
  const now = new Date();
  const currentHourStart = new Date(now);
  currentHourStart.setMinutes(0, 0, 0);
  const fourHoursLater = new Date(currentHourStart.getTime() + 4 * 60 * 60 * 1000);

  return hourly.filter((hour) => {
    const hourDate = new Date(hour.time);
    return hourDate >= currentHourStart && hourDate < fourHoursLater;
  });
}


function isCurrentHour(date: Date): boolean {
  const now = new Date();
  return (
    date.getHours() === now.getHours() &&
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
}

function formatAlertTime(date: Date): string {
  if (isCurrentHour(date)) return "Now";
  return `at ${formatHour(date)}`;
}

function analyzeUV(hours: HourlyForecast[]): UVAlert | null {
  // Find earliest hour where UV >= 3 (requires sun protection)
  const sorted = [...hours].sort(
    (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
  );
  const earliest = sorted.find((h) => h.uvIndex !== null && h.uvIndex >= 3);

  if (!earliest) return null;

  return {
    uvValue: earliest.uvIndex!,
    alertTime: earliest.time,
  };
}

function analyzeRain(hours: HourlyForecast[]): RainAlert | null {
  const hoursWithRain = hours.filter((h) => h.precipitation > 0);
  if (hoursWithRain.length === 0) return null;

  const sorted = [...hoursWithRain].sort(
    (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
  );

  const moderateOrHeavier = sorted.find(
    (h) => getRainLevel(h.precipitation) !== "light"
  );

  // Prefer the earliest moderate+ rain; fall back to the earliest light rain
  const alertHour = moderateOrHeavier || sorted[0];
  const level = getRainLevel(alertHour.precipitation);

  const totalMm = hours.reduce((sum, h) => sum + h.precipitation, 0);

  return {
    totalMm,
    alertTime: alertHour.time,
    precipitationProbability: alertHour.precipitationProbability,
    weatherCode: alertHour.weatherCode || 63,
    isDay: alertHour.isDay,
    level,
  };
}

function analyzeWind(hours: HourlyForecast[]): WindAlert | null {
  if (hours.length === 0) return null;

  const sorted = [...hours].sort(
    (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
  );

  const alertHour = sorted.find(
    (h) => getWindLevel(h.windSpeed) !== "light"
  );

  if (!alertHour) return null;

  return {
    speed: alertHour.windSpeed,
    alertTime: alertHour.time,
    level: getWindLevel(alertHour.windSpeed) as WindLevel,
  };
}

/**
 * Synthesizes the individual UV/rain/wind alerts into a single practical
 * "what should I take with me" answer for the next 4 hours.
 *
 * The reasoning an umbrella alone doesn't help once wind gets strong enough
 * to blow rain sideways - that combination calls for proper wet weather gear
 * instead of "rain = umbrella" in isolation.
 */
function analyzeGear(
  uvAlert: UVAlert | null,
  rainAlert: RainAlert | null,
  windAlert: WindAlert | null
): GearRecommendation {
  if (rainAlert) {
    const rainDefeatsUmbrella =
      rainAlert.level === 'heavy' ||
      (rainAlert.level === 'moderate' && windAlert?.level === 'strong');

    if (rainDefeatsUmbrella) {
      return {
        level: 'wet-weather-gear',
        label: 'Full wet weather gear',
        detail: windAlert
          ? `${rainAlert.totalMm.toFixed(1)}mm expected with ${Math.round(windAlert.speed)}km/h wind - an umbrella won't hold up`
          : `${rainAlert.totalMm.toFixed(1)}mm of rain expected ${formatAlertTime(rainAlert.alertTime)}`,
      };
    }

    return {
      level: 'umbrella',
      label: 'Umbrella will do',
      detail: `${rainAlert.totalMm.toFixed(1)}mm expected ${formatAlertTime(rainAlert.alertTime)}`,
    };
  }

  if (windAlert?.level === 'strong') {
    return {
      level: 'windbreaker',
      label: 'Windy - secure loose items',
      detail: `Gusts up to ${Math.round(windAlert.speed)}km/h expected ${formatAlertTime(windAlert.alertTime)}`,
    };
  }

  if (uvAlert) {
    return {
      level: 'sun',
      label: 'Sun protection',
      detail: `UV reaching ${Math.round(uvAlert.uvValue)} ${formatAlertTime(uvAlert.alertTime)}`,
    };
  }

  return {
    level: 'none',
    label: 'No protection needed',
    detail: 'Clear conditions expected for the next 4 hours',
  };
}

function getTodayRemainingHours(hourly: HourlyForecast[]): HourlyForecast[] {
  const now = new Date();
  const todayEnd = new Date(now);
  todayEnd.setHours(23, 59, 59, 999);

  return hourly.filter((hour) => {
    const hourDate = new Date(hour.time);
    return hourDate >= now && hourDate <= todayEnd;
  });
}

function findMaxTemp(hours: HourlyForecast[]): {
  value: number;
  time: Date;
  weatherCode: number;
  isDay: boolean;
} | null {
  if (hours.length === 0) return null;

  let max = hours[0];
  for (const hour of hours) {
    if (hour.temperature > max.temperature) {
      max = hour;
    }
  }
  return {
    value: max.temperature,
    time: max.time,
    weatherCode: max.weatherCode,
    isDay: max.isDay,
  };
}

function findMaxUV(hours: HourlyForecast[]): {
  value: number;
  time: Date;
} | null {
  const hoursWithUV = hours.filter((h) => h.uvIndex !== null);
  if (hoursWithUV.length === 0) return null;

  let max = hoursWithUV[0];
  for (const hour of hoursWithUV) {
    if ((hour.uvIndex ?? 0) > (max.uvIndex ?? 0)) {
      max = hour;
    }
  }
  return {
    value: max.uvIndex!,
    time: max.time,
  };
}
export { analyzeGear, analyzeRain, analyzeUV, analyzeWind, findMaxTemp, findMaxUV, formatAlertTime, getNextFourHours, getTodayRemainingHours };

