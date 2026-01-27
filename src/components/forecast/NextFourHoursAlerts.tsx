import { FaUmbrella, FaWind } from "react-icons/fa";
import { RainLevel, WeatherData, WindLevel } from '../../types/weather';
import { analyzeRain, analyzeUV, analyzeWind, formatAlertTime, getNextFourHours } from './forecast.utils';

import { useMemo } from "react";
import { TbUvIndex } from "react-icons/tb";
import { mockAlerts } from './mockData';
import styles from "./NextFourHoursAlerts.module.css";
import { UVBadge } from './UVBadge';

function getRainIconClass(level: RainLevel): string {
  if (level === "heavy") return styles.iconVeryHigh;
  if (level === "moderate") return styles.iconModerate;
  return styles.iconLight;
}

function getWindIconClass(level: WindLevel): string {
  if (level === "strong") return styles.iconVeryHigh;
  return styles.iconModerate;
}

interface AlertsProps {
  data: WeatherData;
}

// Set to true to preview all alert states
const PREVIEW_MODE = false;


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
      <div className={styles.headerRow}>
        <div className={styles.header}>Alerts</div>
      </div>
      <div className={styles.alertsGrid}>
        {/* UV Alert */}
        {uvAlert && (
          <div className={styles.alertRow}>
            <TbUvIndex className={styles.alertIcon} />
            <div className={styles.alertContent}>
              <UVBadge value={uvAlert.uvValue} />
              <span className={styles.alertTime}>{formatAlertTime(uvAlert.alertTime)}</span>
            </div>
          </div>
        )}

        {/* Rain Alert */}
        {rainAlert && (
          <div className={styles.alertRow}>
            <FaUmbrella className={`${styles.alertIcon} ${getRainIconClass(rainAlert.level)}`} />
            <div className={styles.alertContent}>
              <span className={styles.alertValue}>{rainAlert.totalMm.toFixed(1)}mm</span>
              <span className={styles.alertValue}>{rainAlert.precipitationProbability.toFixed(1)}%</span>

              <span className={styles.alertTime}>{formatAlertTime(rainAlert.alertTime)}</span>
            </div>
          </div>
        )}

        {/* Wind Alert */}
        {windAlert && (
          <div className={styles.alertRow}>
            <FaWind className={`${styles.alertIcon} ${getWindIconClass(windAlert.level)}`} />
            <div className={styles.alertContent}>
              <span className={styles.alertValue}>{Math.round(windAlert.speed)} km/h</span>
              <span className={styles.alertTime}>{formatAlertTime(windAlert.alertTime)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
