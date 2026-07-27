import { ColdAlert, GearRecommendation, GearSeverity, HourlyForecast, RainAlert, RainLevel, SeverityTier, UVAlert, WarningThresholds, WindAlert, WindLevel } from '../../types/weather';

import { formatHour } from './formatters';

function getWindLevel(speed: number, thresholds: WarningThresholds): WindLevel | "light" {
  if (speed >= thresholds.windStrongFromKmh) return "strong";
  if (speed >= thresholds.windModerateFromKmh) return "moderate";
  return "light";
}

function getRainLevel(totalMm: number, thresholds: WarningThresholds): RainLevel {
  if (totalMm >= thresholds.rainHeavyFromMm) return "heavy";
  if (totalMm >= thresholds.rainModerateFromMm) return "moderate";
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
  const sorted = [...hours].sort(
    (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
  );
  const validHours = sorted.filter((h): h is HourlyForecast & { uvIndex: number } => h.uvIndex !== null);
  if (validHours.length === 0) return null;

  const currentHour = validHours[0];
  const peakHour = validHours.reduce((max, h) => (h.uvIndex > max.uvIndex ? h : max));

  // Only surfaces once UV reaches a level that actually calls for sun protection.
  if (peakHour.uvIndex < 3) return null;

  return {
    currentValue: currentHour.uvIndex,
    peakValue: peakHour.uvIndex,
    peakTime: peakHour.time,
    peakIsNow: isCurrentHour(peakHour.time),
  };
}

function analyzeCold(hours: HourlyForecast[], thresholds: WarningThresholds): ColdAlert | null {
  const sorted = [...hours].sort(
    (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
  );
  const earliest = sorted.find((h) => h.temperature <= thresholds.coldBelowC);

  if (!earliest) return null;

  return {
    tempValue: earliest.temperature,
    alertTime: earliest.time,
  };
}

function analyzeRain(hours: HourlyForecast[], thresholds: WarningThresholds): RainAlert | null {
  const hoursWithRain = hours.filter((h) => h.precipitation > 0);
  if (hoursWithRain.length === 0) return null;

  const sorted = [...hoursWithRain].sort(
    (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
  );

  const moderateOrHeavier = sorted.find(
    (h) => getRainLevel(h.precipitation, thresholds) !== "light"
  );

  // Prefer the earliest moderate+ rain; fall back to the earliest light rain
  const alertHour = moderateOrHeavier || sorted[0];
  const level = getRainLevel(alertHour.precipitation, thresholds);

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

function analyzeWind(hours: HourlyForecast[], thresholds: WarningThresholds): WindAlert | null {
  if (hours.length === 0) return null;

  const sorted = [...hours].sort(
    (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
  );

  // Onset: earliest hour that crosses the moderate threshold at all.
  const onsetHour = sorted.find((h) => getWindLevel(h.windSpeed, thresholds) !== "light");
  if (!onsetHour) return null;

  // Peak: the windiest hour in the window, which may be later than onset -
  // a window that ramps from moderate to strong should report the true max,
  // not get stuck on whatever onset happened to hit first.
  const peakHour = sorted.reduce((max, h) => (h.windSpeed > max.windSpeed ? h : max));

  return {
    alertTime: onsetHour.time,
    maxSpeed: peakHour.windSpeed,
    maxSpeedTime: peakHour.time,
    level: getWindLevel(peakHour.windSpeed, thresholds) as WindLevel,
    windyThroughout: sorted.every((h) => getWindLevel(h.windSpeed, thresholds) !== "light"),
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

/**
 * Synthesizes the individual UV/rain/wind/cold alerts into practical "what
 * should I take with me" answers for the next 4 hours - can return more than
 * one (e.g. umbrella + jacket on a cold rainy day). Always returns at least
 * one item; falls back to a "none" entry when nothing applies.
 *
 * Any rain plus strong wind defeats an umbrella outright (wind blows rain
 * sideways), not just moderate-or-heavier rain - so that check isn't gated
 * on rain level. Wind gear scales with wind level alone: moderate calls for
 * a windbreaker, strong calls for a jacket. Cold weather also calls for a
 * jacket regardless of wind, so a cold alert alongside any wind alert merges
 * into a single jacket card rather than two separate ones.
 */
function analyzeGear(
  uvAlert: UVAlert | null,
  rainAlert: RainAlert | null,
  windAlert: WindAlert | null,
  coldAlert: ColdAlert | null,
  hours: HourlyForecast[]
): GearRecommendation[] {
  const items: GearRecommendation[] = [];

  if (uvAlert) {
    const band = uvBand(uvAlert.peakValue);
    const severity: GearSeverity = { tier: band.tier, label: String(Math.round(uvAlert.currentValue)), scale: 'uv' };
    const detail = uvAlert.peakIsNow
      ? 'UV will not get higher than this today'
      : `Current UV ${Math.round(uvAlert.currentValue)}, peak UV ${Math.round(uvAlert.peakValue)} ${formatAlertTime(uvAlert.peakTime, { lowercaseNow: true })}`;
    items.push({
      level: 'sun',
      label: 'Sunscreen and hat',
      detail,
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

  if (windAlert || coldAlert) {
    const isJacketWorthy = !!coldAlert || windAlert?.level === 'strong';
    const stats: GearRecommendation['stats'] = [];

    let windRangeLabel = '';
    if (windAlert) {
      const minSpeed = Math.round(Math.min(...hours.map((h) => h.windSpeed)));
      const maxSpeed = Math.round(windAlert.maxSpeed);
      windRangeLabel = minSpeed === maxSpeed ? `${maxSpeed} km/h` : `${minSpeed}-${maxSpeed} km/h`;
      stats.push(
        { label: 'Strongest at', value: formatAlertTime(windAlert.maxSpeedTime, { omitAt: true }) }
      );
    }

    const detail =
      coldAlert && windAlert
        ? `${Math.round(windAlert.maxSpeed)}km/h winds and ${Math.round(coldAlert.tempValue)}°C`
        : coldAlert
          ? `${Math.round(coldAlert.tempValue)}°C ${formatAlertTime(coldAlert.alertTime, { lowercaseNow: true })}`
          : windAlert!.windyThroughout
            ? `Wind speed ${windRangeLabel} for the next 4 hours`
            : `Wind up to ${Math.round(windAlert!.maxSpeed)}km/h ${formatAlertTime(windAlert!.alertTime, { lowercaseNow: true })}`;

    items.push({
      level: isJacketWorthy ? 'jacket' : 'windbreaker',
      label: isJacketWorthy ? 'Jacket' : 'Windbreaker',
      detail,
      severity: windAlert ? windSeverity(windAlert.level) : { tier: 'moderate', label: 'Cold' },
      stats,
    });
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

export { analyzeCold, analyzeGear, analyzeRain, analyzeUV, analyzeWind, findMaxTemp, formatAlertTime, getNextFourHours, getTodayRemainingHours };

