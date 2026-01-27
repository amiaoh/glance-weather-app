import { findMaxTemp, findMaxUV, getTodayRemainingHours } from './forecast.utils';
import { mockCurrentHour, mockMaxTemp, mockMaxUV } from './mockData';

import { useMemo } from "react";
import { TbUvIndex } from "react-icons/tb";
import type { WeatherData } from "../../types/weather";
import { formatHour } from "./formatters";
import { UVBadge } from "./UVBadge";
import { WeatherIcon } from "./WeatherIcon";
import styles from "./WeatherMain.module.css";

interface WeatherMainProps {
  data: WeatherData;
}

// Set to true to preview with mock data
const PREVIEW_MODE = false;

export function WeatherMain({ data }: WeatherMainProps) {
  const currentHour = PREVIEW_MODE ? mockCurrentHour : data.hourly[0];

  const { maxTemp, maxUV } = useMemo(() => {
    if (PREVIEW_MODE) {
      return { maxTemp: mockMaxTemp, maxUV: mockMaxUV };
    }
    const remainingToday = getTodayRemainingHours(data.hourly);
    return {
      maxTemp: findMaxTemp(remainingToday),
      maxUV: findMaxUV(remainingToday),
    };
  }, [data.hourly]);
  const isMaxTempPast =
    !!maxTemp && maxTemp.value <= currentHour.temperature;
  const isMaxUVPast =
    !!maxUV && maxUV.value <= currentHour.uvIndex!;
  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {/* Now Card - Current Temp & UV */}
        <div className={`${styles.card} ${styles.nowCard}`}>
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
            <div className={styles.separator} />
            <div className={styles.metric}>
              <TbUvIndex className={styles.uvIcon} />
              <UVBadge value={currentHour.uvIndex} />
            </div>
          </div>
        </div>

        {/* Max Card - Max Temp & UV */}
        <div className={`${styles.card}`}>
          <div className={styles.cardLabel}>Max</div>
          <div className={styles.cardContent}>
            {!isMaxTempPast && maxTemp && (
              <>
                <div className={styles.metric}>
                  <span className={styles.tempValue}>
                    {`${Math.round(maxTemp.value)}°`}
                  </span>
                  <WeatherIcon
                    code={maxTemp.weatherCode}
                    isDay={maxTemp.isDay}
                    size={32}
                  />
                </div>
                <div className={styles.separator} />
              </>
            )}
            {!isMaxUVPast && maxUV && (
              <div className={styles.metric}>
                <TbUvIndex className={styles.uvIcon} />
                <UVBadge value={!isMaxUVPast && maxUV ? maxUV.value : null} />
              </div>)}
          </div>

          <div className={styles.timesRow}>
            {!isMaxTempPast && maxTemp && (<span className={styles.peakTime}>
              {maxTemp ? `at ${formatHour(maxTemp.time)}` : ""}
            </span>)}
            {!isMaxUVPast && maxUV && (<span className={styles.peakTime}>
              {maxUV ? `at ${formatHour(maxUV.time)}` : ""}
            </span>)}
          </div>
        </div>
      </div>
    </div>
  );
}
