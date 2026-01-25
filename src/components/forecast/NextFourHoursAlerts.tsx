import type { HourlyForecast, WeatherData } from "../../types/weather";

import { useMemo } from "react";
import { FaWind } from "react-icons/fa";
import { TbUvIndex } from "react-icons/tb";
import { formatHour } from "./formatters";
import styles from "./NextFourHoursAlerts.module.css";
import { UVBadge } from "./UVBadge";
import { WeatherIcon } from "./WeatherIcon";

interface AlertsProps {
  data: WeatherData;
}

type WindLevel = "light" | "moderate" | "strong";
type RainLevel = "light" | "moderate" | "heavy";

function getWindLevel(speed: number): WindLevel {
  if (speed >= 40) return "strong";
  if (speed >= 20) return "moderate";
  return "light";
}

function getWindLabel(level: WindLevel): string {
  switch (level) {
    case "strong":
      return "Strong";
    case "moderate":
      return "Moderate";
    default:
      return "Light";
  }
}

function getRainLevel(totalMm: number): RainLevel {
  if (totalMm >= 10) return "heavy";
  if (totalMm >= 2.5) return "moderate";
  return "light";
}

function getRainLabel(level: RainLevel): string {
  switch (level) {
    case "heavy":
      return "Heavy";
    case "moderate":
      return "Moderate";
    default:
      return "Light";
  }
}

function getUVSeverityClass(uv: number): string {
  if (uv >= 11) return styles.uvExtreme;
  if (uv >= 8) return styles.uvVeryHigh;
  if (uv >= 6) return styles.uvHigh;
  return "";
}

function getRainSeverityClass(level: RainLevel): string {
  if (level === "heavy") return styles.rainHeavy;
  if (level === "moderate") return styles.rainModerate;
  return "";
}

function getWindSeverityClass(level: WindLevel): string {
  if (level === "strong") return styles.windStrong;
  if (level === "moderate") return styles.windModerate;
  return "";
}

function getNextFourHours(hourly: HourlyForecast[]): HourlyForecast[] {
  const now = new Date();
  const fourHoursLater = new Date(now.getTime() + 4 * 60 * 60 * 1000);

  return hourly.filter((hour) => {
    const hourDate = new Date(hour.time);
    return hourDate >= now && hourDate < fourHoursLater;
  });
}

interface UVAlert {
  maxUV: number;
  peakTime: Date;
}

interface RainAlert {
  totalMm: number;
  peakProbability: number;
  weatherCode: number;
  isDay: boolean;
  level: RainLevel;
}

interface WindAlert {
  maxSpeed: number;
  peakTime: Date;
  level: WindLevel;
}

function analyzeUV(hours: HourlyForecast[]): UVAlert | null {
  const hoursWithUV = hours.filter((h) => h.uvIndex !== null && h.uvIndex > 3);
  if (hoursWithUV.length === 0) return null;

  let max = hoursWithUV[0];
  for (const hour of hoursWithUV) {
    if ((hour.uvIndex ?? 0) > (max.uvIndex ?? 0)) {
      max = hour;
    }
  }

  return {
    maxUV: max.uvIndex!,
    peakTime: max.time,
  };
}

function analyzeRain(hours: HourlyForecast[]): RainAlert | null {
  const totalMm = hours.reduce((sum, h) => sum + h.precipitation, 0);
  if (totalMm <= 0) return null;

  let peakProbability = 0;
  let worstWeatherCode = 0;
  let worstIsDay = true;

  for (const hour of hours) {
    if (hour.precipitationProbability > peakProbability) {
      peakProbability = hour.precipitationProbability;
    }
    // Higher weather codes generally indicate worse weather
    if (hour.weatherCode > worstWeatherCode && hour.precipitation > 0) {
      worstWeatherCode = hour.weatherCode;
      worstIsDay = hour.isDay;
    }
  }

  return {
    totalMm,
    peakProbability,
    weatherCode: worstWeatherCode || 63, // Default to rain code
    isDay: worstIsDay,
    level: getRainLevel(totalMm),
  };
}

function analyzeWind(hours: HourlyForecast[]): WindAlert | null {
  if (hours.length === 0) return null;

  let max = hours[0];
  for (const hour of hours) {
    if (hour.windSpeed > max.windSpeed) {
      max = hour;
    }
  }

  const level = getWindLevel(max.windSpeed);
  // Only alert for moderate or strong winds
  if (level === "light") return null;

  return {
    maxSpeed: max.windSpeed,
    peakTime: max.time,
    level,
  };
}

// Set to true to preview all alert states
const PREVIEW_MODE = true;

const mockAlerts = {
  uvAlert: { maxUV: 9, peakTime: new Date(Date.now() + 2 * 60 * 60 * 1000) },
  rainAlert: { totalMm: 4.2, peakProbability: 80, weatherCode: 95, isDay: true, level: "moderate" as RainLevel },
  windAlert: { maxSpeed: 45, peakTime: new Date(Date.now() + 3 * 60 * 60 * 1000), level: "strong" as WindLevel },
};

export function NextFourHoursAlerts({ data }: AlertsProps) {
  const { uvAlert, rainAlert, windAlert, hasAlerts } = useMemo(() => {
    if (PREVIEW_MODE) {
      return { ...mockAlerts, hasAlerts: true };
    }

    const nextFourHours = getNextFourHours(data.hourly);
    const uv = analyzeUV(nextFourHours);
    const rain = analyzeRain(nextFourHours);
    const wind = analyzeWind(nextFourHours);

    return {
      uvAlert: uv,
      rainAlert: rain,
      windAlert: wind,
      hasAlerts: uv !== null || rain !== null || wind !== null,
    };
  }, [data.hourly]);

  if (!hasAlerts) {
    return (
      <div className={styles.container}>
        <div className={styles.noAlerts}>No alerts for the next 4 hours</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>Next 4 Hours</div>
      <div className={styles.alertsGrid}>
        {/* UV Alert */}
        {uvAlert && (
          <div className={`${styles.alertCard} ${getUVSeverityClass(uvAlert.maxUV)}`}>
            <TbUvIndex className={styles.uvIcon} />
            <div className={styles.alertContent}>
              <UVBadge value={uvAlert.maxUV} />
              <span className={styles.alertTime}>
                at {formatHour(uvAlert.peakTime)}
              </span>
            </div>
          </div>
        )}

        {/* Rain Alert */}
        {rainAlert && (
          <div className={`${styles.alertCard} ${getRainSeverityClass(rainAlert.level)}`}>
            <WeatherIcon
              code={rainAlert.weatherCode}
              isDay={rainAlert.isDay}
              size={28}
            />
            <div className={styles.alertContent}>
              <span className={styles.rainValue}>
                {rainAlert.totalMm.toFixed(1)}mm
              </span>
              <span className={styles.rainChance}>
                {rainAlert.peakProbability}%
              </span>
            </div>
            <span className={styles.rainLabel}>
              {getRainLabel(rainAlert.level)}
            </span>
          </div>
        )}

        {/* Wind Alert */}
        {windAlert && (
          <div className={`${styles.alertCard} ${getWindSeverityClass(windAlert.level)}`}>
            <FaWind className={styles.windIcon} />
            <div className={styles.alertContent}>
              <span className={styles.windValue}>
                {Math.round(windAlert.maxSpeed)} km/h
              </span>
              <span className={styles.alertTime}>
                at {formatHour(windAlert.peakTime)}
              </span>
            </div>
            <span className={styles.windLabel}>
              {getWindLabel(windAlert.level)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
