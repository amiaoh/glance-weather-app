import { useMemo, useState } from "react";
import { FaUmbrella, FaWind } from "react-icons/fa";
import { TbJacket, TbUvIndex } from "react-icons/tb";
import type { HourlyForecast, WeatherData } from "../../types/weather";

import { GiCorkHat } from "react-icons/gi";
import { formatHour } from "./formatters";
import styles from "./NextFourHoursAlerts.module.css";

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
  if (uv >= 11) return styles.severityExtreme;
  if (uv >= 8) return styles.severityVeryHigh;
  if (uv >= 6) return styles.severityHigh;
  if (uv >= 3) return styles.severityModerate;
  return styles.severityDefault;
}

function getRainSeverityClass(level: RainLevel): string {
  if (level === "heavy") return styles.severityRainHeavy;
  if (level === "moderate") return styles.severityRainModerate;
  return styles.severityRainLight;
}

function getWindSeverityClass(level: WindLevel): string {
  if (level === "strong") return styles.severityVeryHigh;
  if (level === "moderate") return styles.severityModerate;
  return styles.severityDefault;
}

function getNextFourHours(hourly: HourlyForecast[]): HourlyForecast[] {
  const now = new Date();
  // Start from the beginning of the current hour to include the current hour
  const currentHourStart = new Date(now);
  currentHourStart.setMinutes(0, 0, 0);
  const fourHoursLater = new Date(currentHourStart.getTime() + 4 * 60 * 60 * 1000);

  return hourly.filter((hour) => {
    const hourDate = new Date(hour.time);
    return hourDate >= currentHourStart && hourDate < fourHoursLater;
  });
}

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
  // Filter hours with precipitation and sort by time
  const hoursWithRain = hours.filter((h) => h.precipitation > 0);
  if (hoursWithRain.length === 0) return null;

  const sorted = [...hoursWithRain].sort(
    (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
  );

  // Find earliest moderate or heavier rain
  const moderateOrHeavier = sorted.find(
    (h) => getRainLevel(h.precipitation) !== "light"
  );

  // If no moderate+, use earliest light rain
  const alertHour = moderateOrHeavier || sorted[0];
  const level = getRainLevel(alertHour.precipitation);

  // Calculate total for display
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

  // Sort by time
  const sorted = [...hours].sort(
    (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
  );

  // Find earliest moderate or stronger wind
  const moderateOrStronger = sorted.find(
    (h) => getWindLevel(h.windSpeed) !== "light"
  );

  // If no moderate+, find earliest light wind (if any notable wind)
  // Only show light wind alert if there's at least some wind
  const lightWind = sorted.find((h) => h.windSpeed >= 10);

  const alertHour = moderateOrStronger || lightWind;
  if (!alertHour) return null;

  const level = getWindLevel(alertHour.windSpeed);

  return {
    speed: alertHour.windSpeed,
    alertTime: alertHour.time,
    level,
  };
}

// Set to true to preview all alert states
const PREVIEW_MODE = true;

const mockAlerts = {
  uvAlert: { uvValue: 9, alertTime: new Date(Date.now() + 2 * 60 * 60 * 1000) },
  rainAlert: { totalMm: 4.2, alertTime: new Date(Date.now() + 1 * 60 * 60 * 1000), precipitationProbability: 80, weatherCode: 95, isDay: true, level: "moderate" as RainLevel },
  windAlert: { speed: 45, alertTime: new Date(Date.now() + 3 * 60 * 60 * 1000), level: "strong" as WindLevel },
};

type ViewMode = "simple" | "detailed";

export function NextFourHoursAlerts({ data }: AlertsProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("simple");

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

  const toggleView = () => {
    setViewMode((prev) => (prev === "simple" ? "detailed" : "simple"));
  };

  if (!hasAlerts) {
    return (
      <div className={styles.container}>
        <div className={styles.noAlerts}>No alerts for the next 4 hours</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <div className={styles.header}>Alerts</div>
        <button className={styles.toggleButton} onClick={toggleView}>
          {viewMode === "simple" ? "Detailed view" : "Simple view"}
        </button>
      </div>

      {viewMode === "simple" ? (
        <div className={styles.simpleGrid}>
          {uvAlert && (
            <div className={styles.simpleItem}>
              <GiCorkHat className={styles.simpleIcon} />
              <span className={styles.alertTime}>{formatAlertTime(uvAlert.alertTime)}</span>

            </div>
          )}
          {rainAlert && (
            <div className={styles.simpleItem}>
              <FaUmbrella className={styles.simpleIcon} />
              <span className={styles.alertTime}>{formatAlertTime(rainAlert.alertTime)}</span>

            </div>
          )}
          {windAlert && (
            <div className={styles.simpleItem}>
              <TbJacket className={styles.simpleIcon} />
              <span className={styles.alertTime}>{formatAlertTime(windAlert.alertTime)}</span>

            </div>
          )}
        </div>
      ) : (
        <div className={styles.alertsGrid}>
          {/* UV Alert */}
          {uvAlert && (
            <div className={styles.alertRow}>
              <div className={`${styles.severityBar} ${getUVSeverityClass(uvAlert.uvValue)}`} />
              <TbUvIndex className={styles.alertIcon} />
              <div className={styles.alertContent}>
                <span className={styles.alertValue}>UV {Math.round(uvAlert.uvValue)}</span>
                <span className={styles.alertTime}>{formatAlertTime(uvAlert.alertTime)}</span>
              </div>
            </div>
          )}

          {/* Rain Alert */}
          {rainAlert && (
            <div className={styles.alertRow}>
              <div className={`${styles.severityBar} ${getRainSeverityClass(rainAlert.level)}`} />
              <FaUmbrella className={styles.alertIcon} />
              <div className={styles.alertContent}>
                <span className={styles.alertValue}>{rainAlert.totalMm.toFixed(1)}mm</span>
                <span className={styles.alertTime}>{formatAlertTime(rainAlert.alertTime)}</span>
              </div>
              <span className={styles.alertLabel}>{getRainLabel(rainAlert.level)}</span>
            </div>
          )}

          {/* Wind Alert */}
          {windAlert && (
            <div className={styles.alertRow}>
              <div className={`${styles.severityBar} ${getWindSeverityClass(windAlert.level)}`} />
              <FaWind className={styles.alertIcon} />
              <div className={styles.alertContent}>
                <span className={styles.alertValue}>{Math.round(windAlert.speed)} km/h</span>
                <span className={styles.alertTime}>{formatAlertTime(windAlert.alertTime)}</span>
              </div>
              <span className={styles.alertLabel}>{getWindLabel(windAlert.level)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
