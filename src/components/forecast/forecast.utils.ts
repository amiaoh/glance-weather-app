import { GearRecommendation, GearSeverity, HourlyForecast, RainAlert, RainLevel, SeverityTier, UVAlert, WindAlert, WindLevel } from '../../types/weather';

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

function formatAlertTime(date: Date, options?: { lowercaseNow?: boolean; omitAt?: boolean }): string {
  if (isCurrentHour(date)) return options?.lowercaseNow ? "now" : "Now";
  return options?.omitAt ? formatHour(date) : `at ${formatHour(date)}`;
}

// Drops the trailing decimal once rainfall reaches double digits, where the
// extra precision stops being meaningful.
function formatMm(mm: number): string {
  return mm >= 10 ? String(Math.round(mm)) : mm.toFixed(1);
}

// Last rainy hour within the window is also the window's last hour - can't
// tell from 4 hours of data whether it stops there or keeps going.
function rainEndTimeWithinWindow(hours: HourlyForecast[]): Date | null {
  const sorted = [...hours].sort((a, b) => a.time.getTime() - b.time.getTime());
  let lastRainyIndex = -1;
  sorted.forEach((hour, index) => {
    if (hour.precipitation > 0) lastRainyIndex = index;
  });

  if (lastRainyIndex === -1 || lastRainyIndex === sorted.length - 1) return null;
  return sorted[lastRainyIndex + 1].time;
}

function rainDurationPhrase(hours: HourlyForecast[]): string {
  const endTime = rainEndTimeWithinWindow(hours);
  return endTime ? `until ${formatHour(endTime)}` : "for at least the next 4 hours";
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

  // Prefer the earliest strong wind hour over the earliest moderate one, so a
  // window that ramps from moderate to strong doesn't get stuck reporting
  // the milder onset - the gear recommendation depends on catching "strong".
  const strongest = sorted.find((h) => getWindLevel(h.windSpeed) === "strong");
  const alertHour = strongest || sorted.find((h) => getWindLevel(h.windSpeed) === "moderate");

  if (!alertHour) return null;

  return {
    speed: alertHour.windSpeed,
    alertTime: alertHour.time,
    level: getWindLevel(alertHour.windSpeed) as WindLevel,
  };
}

// ARPANSA UV Index bands. analyzeUV only ever fires at UV >= 3, so "low"
// never shows up as a gear card severity.
function uvBand(uvValue: number): { tier: SeverityTier; label: string } {
  if (uvValue >= 11) return { tier: 'extreme', label: 'Extreme' };
  if (uvValue >= 8) return { tier: 'veryHigh', label: 'Very High' };
  if (uvValue >= 6) return { tier: 'high', label: 'High' };
  return { tier: 'moderate', label: 'Moderate' };
}

function rainSeverity(level: RainLevel): GearSeverity {
  if (level === 'heavy') return { tier: 'extreme', label: 'Heavy' };
  if (level === 'moderate') return { tier: 'moderate', label: 'Moderate' };
  return { tier: 'mild', label: 'Light' };
}

function windSeverity(level: WindLevel): GearSeverity {
  if (level === 'strong') return { tier: 'extreme', label: 'Strong' };
  return { tier: 'moderate', label: 'Moderate' };
}

// Below this, wind chill makes a jacket worth recommending even without rain.
const JACKET_TEMP_THRESHOLD_C = 20;

function temperatureAt(hours: HourlyForecast[], time: Date): number | null {
  const match = hours.find((h) => h.time.getTime() === time.getTime());
  return match ? match.temperature : null;
}

/**
 * Synthesizes the individual UV/rain/wind alerts into practical "what should
 * I take with me" answers for the next 4 hours - can return more than one
 * (e.g. umbrella + jacket on a cold rainy day). Always returns at least one
 * item; falls back to a "none" entry when nothing applies.
 *
 * Any rain plus strong wind defeats an umbrella outright (wind blows rain
 * sideways), not just moderate-or-heavier rain - so that check isn't gated
 * on rain level. Strong wind combined with cool temperatures calls for a
 * jacket instead of just a wind warning, since wind chill is what actually
 * matters at that point.
 */
function analyzeGear(
  uvAlert: UVAlert | null,
  rainAlert: RainAlert | null,
  windAlert: WindAlert | null,
  hours: HourlyForecast[]
): GearRecommendation[] {
  const items: GearRecommendation[] = [];

  if (uvAlert) {
    const band = uvBand(uvAlert.uvValue);
    const severity: GearSeverity = { tier: band.tier, label: String(Math.round(uvAlert.uvValue)), scale: 'uv' };
    items.push({
      level: 'sun',
      label: 'Sunscreen and hat',
      detail: `Peak UV ${formatAlertTime(uvAlert.alertTime, { lowercaseNow: true })}`,
      severity,
    });
  }

  if (rainAlert) {
    const rainDefeatsUmbrella = rainAlert.level === 'heavy' || windAlert?.level === 'strong';
    const duration = rainDurationPhrase(hours);
    const chanceOverWindow = Math.max(...hours.map((h) => h.precipitationProbability));
    const stats: GearRecommendation['stats'] = [
      { label: 'Chance of rain', value: `${Math.round(chanceOverWindow)}%` },
    ];

    items.push(
      rainDefeatsUmbrella
        ? {
            level: 'waterproof-gear',
            label: 'Waterproof gear',
            detail: windAlert
              ? `${formatMm(rainAlert.totalMm)}mm ${duration}`
              : `${formatMm(rainAlert.totalMm)}mm of rain ${duration}`,
            severity: rainSeverity(rainAlert.level),
            stats,
          }
        : {
            level: 'umbrella',
            label: 'Umbrella',
            detail: `${formatMm(rainAlert.totalMm)}mm ${duration}`,
            severity: rainSeverity(rainAlert.level),
            stats,
          }
    );
  }

  if (windAlert?.level === 'strong') {
    const windTemp = temperatureAt(hours, windAlert.alertTime);
    const isCold = windTemp !== null && windTemp <= JACKET_TEMP_THRESHOLD_C;
    const speeds = hours.map((h) => h.windSpeed);
    const minSpeed = Math.round(Math.min(...speeds));
    const maxSpeed = Math.round(Math.max(...speeds));
    const stats: GearRecommendation['stats'] = [
      {
        label: 'Wind speed',
        value: minSpeed === maxSpeed ? `${maxSpeed} km/h` : `${minSpeed}-${maxSpeed} km/h`,
      },
      { label: 'Strongest at', value: formatAlertTime(windAlert.alertTime, { omitAt: true }) },
    ];

    items.push(
      isCold
        ? {
            level: 'jacket',
            label: 'Jacket',
            detail: `${Math.round(windAlert.speed)}km/h winds and ${Math.round(windTemp!)}°C`,
            severity: windSeverity(windAlert.level),
            stats,
          }
        : {
            level: 'windbreaker',
            label: 'Windbreaker',
            detail: `Gusts up to ${Math.round(windAlert.speed)}km/h expected ${formatAlertTime(windAlert.alertTime, { lowercaseNow: true })}`,
            severity: windSeverity(windAlert.level),
            stats,
          }
    );
  }

  if (items.length === 0) {
    items.push({
      level: 'none',
      label: 'Clear conditions expected',
      detail: 'For the next 4 hours',
    });
  }

  return items;
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

export { analyzeGear, analyzeRain, analyzeUV, analyzeWind, findMaxTemp, formatAlertTime, getNextFourHours, getTodayRemainingHours };

