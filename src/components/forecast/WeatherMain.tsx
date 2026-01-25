import type { HourlyForecast, WeatherData } from "../../types/weather";

import { useMemo } from "react";
import { TbUvIndex } from "react-icons/tb";
import { formatHour } from "./formatters";
import { UVBadge } from "./UVBadge";
import { WeatherIcon } from "./WeatherIcon";
import styles from "./WeatherMain.module.css";

interface WeatherMainProps {
  data: WeatherData;
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

export function WeatherMain({ data }: WeatherMainProps) {
  const currentHour = data.hourly[0];

  const { maxTemp, maxUV } = useMemo(() => {
    const remainingToday = getTodayRemainingHours(data.hourly);
    return {
      maxTemp: findMaxTemp(remainingToday),
      maxUV: findMaxUV(remainingToday),
    };
  }, [data.hourly]);

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {/* Now Card - Current Temp & UV */}
        <div className={styles.card}>
          <div className={styles.cardLabel}>Now</div>
          <div className={styles.cardContent}>
            <div className={styles.metric}>
              <span className={styles.tempValue}>
                {Math.round(currentHour.temperature)}°
              </span>
              <WeatherIcon
                code={currentHour.weatherCode}
                isDay={currentHour.isDay}
                size={32}
              />
            </div>
            <div className={styles.metric}>
              <TbUvIndex className={styles.uvIcon} />
              <UVBadge value={currentHour.uvIndex} />
            </div>
          </div>
        </div>

        {/* Max Card - Max Temp & UV */}
        <div className={styles.card}>
          <div className={styles.cardLabel}>Max</div>
          <div className={styles.cardContent}>
            <div className={styles.metric}>
              <span className={styles.tempValue}>
                {maxTemp ? `${Math.round(maxTemp.value)}°` : "-"}
              </span>
              {maxTemp && (
                <WeatherIcon
                  code={maxTemp.weatherCode}
                  isDay={maxTemp.isDay}
                  size={32}
                />
              )}
              {maxTemp && (
                <span className={styles.peakTime}>
                  at {formatHour(maxTemp.time)}
                </span>
              )}
            </div>
            <div className={styles.metric}>
              <TbUvIndex className={styles.uvIcon} />
              <UVBadge value={maxUV?.value ?? null} />
              {maxUV && (
                <span className={styles.peakTime}>
                  at {formatHour(maxUV.time)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
